<template lang="html">
  <div>
    <!-- echarts地图 -->
    <div id="gxMap" :style="[mapSize]"></div>

    <!-- 百度地图 -->
    <Modal v-model="baiduModal" fullscreen footer-hide :closable="false">
      <p slot="header" style="width: 100%;">
        <span>{{mapTitle}}</span>
        <a style="float: right;" @click='closeModal'>关闭</a>
      </p>
      <div id="baiduMap" ref="baiduMap" style="width: 100%; height: 100%;"></div>
    </Modal>
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
      mapData: [
        {
          name: 'bs',
          value: 0
        }, {
          name: 'hc',
          value: 0
        }, {
          name: 'lz',
          value: 0,
          label: {
            padding: [-80, 10, 10, 30]
          }
        }, {
          name: 'gl',
          value: 0
        }, {
          name: 'cz',
          value: 0
        }, {
          name: 'nn',
          value: 0,
          label: {
            padding: [-50, 10, 10, 50]
          }
        }, {
          name: 'lb',
          value: 0
        }, {
          name: 'gg',
          value: 0,
          label: {
            padding: [-20, 0, 10, 70]
          }
        }, {
          name: 'hz',
          value: 0
        }, {
          name: 'wz',
          value: 0,
          label: {
            padding: [50, 50, 10, 0]
          }
        }, {
          name: 'yl',
          value: 0,
          label: {
            padding: [50, 30, 10, 50]
          }
        }, {
          name: 'qz',
          value: 0,
          label: {
            padding: [-30, 0, 10, 70]
          }
        }, {
          name: 'bh',
          value: 0,
          label: {
            padding: [-30, 10, 10, 50]
          }
        }, {
          name: 'fcg',
          value: 0,
          label: {
            padding: [-40, 80, 10, 20]
          }
        }
      ],
      nameMap: {
        'bs': '百色市',
        'hc': '河池市',
        'lz': '柳州市',
        'gl': '桂林市',
        'cz': '崇左市',
        'nn': '南宁市',
        'lb': '来宾市',
        'gg': '贵港市',
        'hz': '贺州市',
        'wz': '梧州市',
        'yl': '玉林市',
        'qz': '钦州市',
        'bh': '北海市',
        'fcg': '防城港市'
      },
      baiduModal: false,
      mapTitle: '伪基站信息',
      map: null
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
    drawMap () { // 展示广西地图
      this.gxEcharts = this.$echarts.init(document.getElementById('gxMap'))
      this.gxEcharts.showLoading() // 加载中
      let _this = this

      let option = {
        title: { // 标题
          text: '伪基站分布热力图',
          left: 'center'
        },
        tooltip: { // 提示框
          trigger: 'none'
        },
        visualMap: { // 视觉映射
          type: 'continuous',
          left: 'left',
          min: 0,
          max: 100,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered', 'red']
          },
          text: ['多', '少'],
          calculable: true
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
        series: [
          {
            name: '伪基站数量',
            type: 'map',
            map: '广西',
            zoom: 1.2,
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
            },
            label: {
              show: true,
              position: ['50%', '50%'],
              formatter: function (params) {
                let name = params.name
                name = _this.nameMap[name]
                return name + '\n\n伪基站数量:' + params.value
              }
            },
            data: this.mapData
          }
        ]
      }

      this.axios.get('/pseudo/count').then((res) => {
        let code = res.code
        if (code === 200) {
          let data = res.data
          let max = 0

          for (let key in data) {
            let idx = 0
            let val = data[key]
            if (val > max) {
              max = val
            }

            this.mapData.map((item) => {
              if (key === this.nameMap[item.name]) {
              // if (key === item.name) {
                this.$set(this.mapData[idx], 'value', val)
              }
              idx++
            })
          }

          option.visualMap.max = max + 100
        } else {
          this.$Message.error(res.msg)
        }
        this.gxEcharts.setOption(option)
        this.gxEcharts.hideLoading() // 加载完成
      }).catch((e) => {
        this.$Message.error(e)
        this.gxEcharts.setOption(option)
        this.gxEcharts.hideLoading() // 加载完成
      })

      this.gxEcharts.on('click', function (params) {
        _this.clickMap(params)
      })
    },
    clickMap (params) { // 点击echarts事件
      let name = params.name // 点击区域名称
      let value = params.value // 点击区域伪基站数量

      if (value === 0) {
        this.$Notice.info({
          title: '提醒',
          desc: this.nameMap[name] + '不存在伪基站'
        })
      } else {
        this.mapTitle = this.nameMap[name] + '伪基站信息'
        this.baiduModal = true

        // 绘制边界
        this.getBoundary(name)
      }
    },
    createMap (name) { // 创建百度地图
      this.map = new window.BMap.Map('baiduMap', {})
      this.map.setCurrentCity('广西') // 创建中心城市
      this.map.centerAndZoom(new window.BMap.Point(109.231816505, 23.7411659265), 13) // 创建中心点
      this.map.enableScrollWheelZoom() // 开启鼠标滚轮缩放
      this.map.setMinZoom(8) // 最小缩放级别
      this.map.setMaxZoom(15) // 最大缩放级别
    },
    getBoundary (name) { // 绘制边界
      this.axios.get(this.jsonURL + '/static/map/boundaries/gx/' + name + '.json').then((res) => {
        this.createMap(name)
        let count = res.boundaries.length
        let pointArray = []
        for (var i = 0; i < count; i++) {
          let ply = new window.BMap.Polygon(res.boundaries[i], {
            strokeWeight: 2, // 多边形线粗
            strokeOpacity: 1, // 多边形线透明度
            strokeStyle: 'solid', // 多边形线为实线
            strokeColor: '#ff0000', // 多边形线颜色
            fillColor: '#00ffff', // 区域填充颜色
            fillOpacity: 0.001 // 区域填充颜色透明度
          }) // 建立多边形
          this.map.addOverlay(ply)
          pointArray = pointArray.concat(ply.getPath())
        }
        this.map.setViewport(pointArray) // 调整视野

        this.drawPoint(name)
      }).catch((e) => {
        this.createMap(name)
        this.drawPoint(name)
      })
    },
    drawPoint (name) {
      this.axios.get('/pseudo/details/' + name).then((res) => {
        let code = res.code
        if (code === 200) {
          let data = res.data
          if (document.createElement('canvas').getContext) { // 判断当前浏览器是否支持绘制海量点
            let points = []
            data.map((item) => {
              let lat = item.lat // 纬度
              let lng = item.lng // 经度
              points.push(new window.BMap.Point(lng, lat))
            })
            let options = {
              shape: window.BMAP_POINT_SHAPE_WATERDROP
            }
            let pointCollection = new window.BMap.PointCollection(points, options)
            this.map.addOverlay(pointCollection)
          } else { // 不支持绘制海量点
            data.map((item) => {
              let lat = item.lat // 纬度
              let lng = item.lng // 经度
              this.map.addOverlay(new window.BMap.Marker(new window.BMap.Point(lng, lat)))
            })
          }
        } else {
          this.$Message.error(res.msg)
        }
      }).catch((e) => {
        this.$Message.error('基站信息获取失败')
      })
    },
    closeModal () {
      this.baiduModal = false
      this.map.clearOverlays() // 清除覆盖物
    }
  }
}
</script>

<style lang="css">
</style>
