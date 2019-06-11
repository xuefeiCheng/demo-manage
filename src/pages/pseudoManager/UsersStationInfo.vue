<template lang="html">
  <div>
    <!-- echarts地图 -->
    <div id="gxMap" :style="[mapSize]"></div>
  </div>
</template>

<script>
import 'echarts/map/js/province/guangxi.js'
export default {
  data () {
    return {
      mapSize: {
        height: '400px',
        width: '100%'
      },
      gxEcharts: null,
      pointsSource: [],
      nameMap: {
        '百色市': 'bs',
        '河池市': 'hc',
        '柳州市': 'lz',
        '桂林市': 'gl',
        '崇左市': 'cz',
        '南宁市': 'nn',
        '来宾市': 'lb',
        '贵港市': 'gg',
        '贺州市': 'hz',
        '梧州市': 'wz',
        '玉林市': 'yl',
        '钦州市': 'qz',
        '北海市': 'bh',
        '防城港市': 'fcg'
      }
    }
  },
  mounted () {
    // 初始化提示配置
    this.$Notice.config({
      top: 100,
      duration: 3
    })

    // 初始化高度
    let height = document.body.clientHeight - 115
    this.mapSize.height = height + 'px'

    this.$nextTick(() => {
      this.drawMap()
    })
  },
  methods: {
    // 反向取值 通过val获得key
    findKey (value, obj, compare = (a, b) => a === b) {
      return Object.keys(obj).find(k => compare(obj[k], value))
    },
    drawMap () { // 展示广西地图
      this.gxEcharts = this.$echarts.init(document.getElementById('gxMap'))
      this.gxEcharts.showLoading() // 加载中
      let _this = this

      let option = {
        title: { // 标题
          text: '伪基站分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          enterable: true,
          // alwaysShowContent:true,
          hideDelay: 100,
          backgroundColor: '#999', // 背景颜色（此时为默认色）
          borderRadius: 5, // 边框圆角
          borderWidth: 1,
          borderColor: '#eee',
          padding: 14, // [5, 10, 15, 20] 内边距
          textStyle: {
            color: '#fff'
          },
          // formatter: '{a} <br/>{b} : {c}'
          formatter: function (p) {
            let data = p.data
            let dom = `<div style="height:200px;">
              <p style="font-weight:bold;">` + data.name + `</p>
              <p>cellid：` + data.value[2] + `</p>
              <p>lacid：` + data.value[3] + `</p>
              <p>伪基站id：` + data.value[4] + `</p>
              <p>创建时间：` + data.value[5] + `</p>
              <p>5分钟受影响用户个数：` + data.value[6] + `</p>
              <p>5分钟内位置更新次数：` + data.value[7] + `</p>
            </div>`
            return dom
          }
        },
        toolbox: { // 工具栏
          show: true,
          left: 'left',
          top: 'top',
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        geo: {
          map: '广西',
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: '#fff',
                fontSize: 18
              }
            },
            emphasis: {
              show: false

            }
          },
          roam: true, // 是否开启鼠标缩放和平移漫游
          zoom: 1.2,
          itemStyle: {
            normal: {
              areaColor: '#191970',
              borderColor: '#F5F5F5'
            },
            emphasis: {
              areaColor: '#389BB7'
            }
          }
        },
        series: [
          {
            name: '广西伪基站分布',
            type: 'effectScatter', // 配置显示方式为用户自定义
            rippleEffect: { // 涟漪特效相关配置。
              period: 4, // 动画的时间。
              scale: 4, // 动画中波纹的最大缩放比例。
              brushType: 'stroke' // 波纹的绘制方式，可选 'stroke' 和 'fill'。
            },
            symbolSize: 16,
            coordinateSystem: 'geo',
            itemStyle: {
              normal: {
                color: 'orange'
              }
            },
            data: this.pointsSource
          }
        ]
      }

      this.gxEcharts.setOption(option)
      this.gxEcharts.on('click', function (params) {
        _this.clickMap(params)
      })
      this.axios.get('bigscreen/getAllPaseudo')
        .then((res) => {
          if (res.code === 200) {
            this.gxEcharts.hideLoading()
            let result = res.data
            this.pointsSource = []
            result.forEach((obj, index, self) => {
              let time = obj.createtime
              if (time.length === 14) {
                time = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' +
                time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12)
              }
              this.pointsSource.push({
                // name: this.findKey(obj.city, this.nameMap),
                name: obj.psoname,
                // 经度 纬度 cellid lacid staid createtime 随机数1（5分钟受影响用户个数） 随机数2（5分钟内位置更新次数）
                value: [obj.lng, obj.lat, obj.cellid, obj.lacid, obj.staid, time, parseInt(Math.random() * (30 - 10 + 1) + 10, 10), parseInt(Math.random() * (30 - 10 + 1) + 10, 10)]
              })
            })
            this.gxEcharts.setOption({
              series: [
                {
                  data: this.pointsSource
                }
              ]
            })
          }
        })
    },
    clickMap (params) { // 点击echarts事件
      let name = params.name // 点击区域名称
      let value = params.value // 点击区域伪基站数量

      if (value === 0) {
        this.$Notice.info({
          title: '提醒',
          desc: name + '不存在伪基站'
        })
      } else {
        this.$Notice.info({
          title: '提醒',
          desc: name + '存在伪基站'
        })
      }
    }
  }
}
</script>

<style lang="css">
</style>
