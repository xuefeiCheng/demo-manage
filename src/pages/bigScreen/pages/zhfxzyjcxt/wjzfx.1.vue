<template>
  <div class="data mapTab noback inter_mapTab inter_margin analysis">
    <!-- <Modal v-model="modal" fullscreen footer-hide :closable="false">
      <p slot="header" style="width: 100%;">
        <a style="float: right;" @click='closeModal'>关闭</a>
      </p>
      <div id="baiduMap" ref="baiduMap" class="hideLogo" style="width: 100%; height: 100%;"></div>
    </Modal> -->
      <!-- title 部分 -->
      <div class="border-self analysis_title">
          <div class="inter_title">{{title}}</div>
          <div class="des">
            ?
          </div>
          <div class="des_content">{{des}}</div>
      </div>
      <!-- 主体部分 -->
      <div class="analysis_content">
          <div style="flex:0 0 60.1%;padding:15px" class="border-self">
            <img src="static/img/bigscreen/wjzfx.png" alt="" style="height:100%;width:100%">
          </div>
          <div style="flex:0 0 39.9%;" class="border-self">
            <!-- <div style="height:100%;position:relative">
              <div style="display:flex;height:100%;">
                <div style="flex:1;height:100%">
                  <div id="gxMap" style="width:100%;height:100%"></div>
                </div>
                <div style="flex:1;height:100%">
                  <div id="baiduMap" ref="baiduMap" class="hideLogo" style="width:100%;height:100%"></div>
                </div>
              </div>
            </div> -->
            <div style="height:60%">
              <div id="gxMap" style="width:100%;height:100%"></div>
            </div>
            <div style="height:40%">
              <div id="baiduMap" ref="baiduMap" class="hideLogo" style="width:100%;height:100%"></div>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  name: 'interMap',
  data () {
    return {
      animate: false,
      transition: true,
      modal: false, // 百度地图弹框
      timeout: null,
      tableData: [],
      gxEcharts: null,
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
      title: '伪基站分析',
      des: `伪基站分析检测子系统基于2/3/4G信令的位置更新CDR，结合伪基站工作原理及对移动网络产生的影响进行分析检测。通过检测伪基站干扰正常通信的事件进行伪基站的发现和疑似受害人的分析检测，并采用基站位置信息聚类方法对伪基站进行初步定位和轨迹跟踪。`
    }
  },
  filters: {
    substr: function (value, length, str) {
      if (!value) return ''
      const le = value.length
      return value.substr(0, length) + (length < le ? str : '')
    }
  },
  mounted () {
    setTimeout(() => {
      // 创建百度地图
      // this.createMap (id, lat, lng)
      this.getID()
    }, 20)
    this.drawGuangxi()
    this.scrollvalid = setInterval(this.scroll, 3000)
  },
  methods: {
    // 数据表格 滚动 [新加]
    scroll () {
      this.animate = true
      setTimeout(() => {
        this.tableData.push(this.tableData[0]) // 将数组的第一个元素添加到数组的
        this.tableData.shift() // 删除数组的第一个元素
        this.animate = false // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      }, 500)
    },
    drawGuangxi () {
      this.gxEcharts = this.$echarts.init(document.getElementById('gxMap'))
      this.gxEcharts.showLoading() // 加载中
      let _this = this

      let option = {
        title: { // 标题
          text: '伪基站分布热力图',
          left: 'center',
          textStyle: {
            color: '#F1F1F3'
          },
          top: 20
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
          textStyle: {
            color: '#fff'
          },
          calculable: true
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
                this.$set(this.mapData[idx], 'value', val)
              }
              idx++
            })
          }

          option.visualMap.max = max + 300
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
    },
    findKey (obj, value, compare = (a, b) => a === b) {
      return Object.keys(obj).find(k => compare(obj[k], value))
    },
    getID () {
      this.axios.get('/pathTrancking').then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data.list
          if (this.data.length !== 0) {
            this.createMap(this.data[0].staid, this.data[0].lat, this.data[0].lng)
          } else {
            this.map = new window.BMap.Map('baiduMap', {})
            this.map.centerAndZoom(new window.BMap.Point(109.93614393, 22.51618028), 8) // 创建中心点
            this.map.enableScrollWheelZoom() // 开启鼠标滚轮缩放
            this.map.setMinZoom(8) // 最小缩放级别
            this.map.setMaxZoom(15) // 最大缩放级别
          }
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    createMap (id, lat, lng) {
      this.axios.post('/pathTrancking/queryByStaid/' + id, {}).then((response) => {
        let code = response.code
        if (code === 200) {
          let datagj = response.data
          let i = 0
          let points = []
          let bPoints = []
          this.timeout = setInterval(() => {
            if (i < datagj.length) {
              let lng = datagj[i].lng
              let lat = datagj[i].lat
              this.dynamicLine(lng, lat, points, bPoints)
              i++
            } else {
              window.clearInterval(this.timeout)
            }
          }, 1000)
          this.map = new window.BMap.Map('baiduMap', {})
          this.map.centerAndZoom(new window.BMap.Point(lng, lat), 8) // 创建中心点
          this.map.enableScrollWheelZoom() // 开启鼠标滚轮缩放
          this.map.setMinZoom(8) // 最小缩放级别
          this.map.setMaxZoom(15) // 最大缩放级别
          this.map.setViewport(bPoints)
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    dynamicLine (lng, lat, points, bPoints) {
      let point = {'lng': lng, 'lat': lat}
      let makerPoints = []
      let newLinePoints = []
      let len
      makerPoints.push(point)
      this.addMarker(makerPoints)
      points.push(point)
      bPoints.push(new window.BMap.Point(lng, lat))
      len = points.length
      newLinePoints = points.slice(len - 2, len)
      this.addLine(newLinePoints)
    },
    addLine (points) {
      let linePoints = []
      let pointsLen = points.length
      for (var i = 0; i < pointsLen; i++) {
        linePoints.push(new window.BMap.Point(points[i].lng, points[i].lat))
      }
      let polyline = new window.BMap.Polyline(linePoints, {strokeColor: 'green', strokeWeight: 5, strokeOpacity: 1})
      this.map.addOverlay(polyline)
    },
    addMarker (points) {
      for (var i = 0, pointsLen = points.length; i < pointsLen; i++) {
        var point = new window.BMap.Point(points[i].lng, points[i].lat)
        var marker = new window.BMap.Marker(point)
        this.map.addOverlay(marker)
      }
    },
    closeModal () {
      this.modal = false
      this.map.clearOverlays() // 清除覆盖物
      this.datagj = null
      window.clearInterval(this.timeout)
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.scrollvalid)
  }
}
</script>

<style scoped>
  @keyframes rowup {
    0% {
        -webkit-transform: translate3d(0, 25px, 0);
        transform: translate3d(0, 25px, 0);
    }
    100% {
        -webkit-transform: translate3d(0, -470px, 0);
        transform: translate3d(0, -470px, 0);
    }
}
  .anim {
    transition: all 0.5s;
    position: relative;
  }
  .inter_mapTab .inter_table .inter_table_body ul li {
    height: 25px !important;
    line-height: 25px !important;
    font-size: 15px !important;
  }
  .inter_mapTab .inter_table .inter_table_body {
    height: 94% !important;
  }
  .border-self {box-shadow: none !important;}
</style>
