<template>
  <div class="data">
    <div class="data-title2"></div>
    <div class="data-content2">
      <div class="all fl">
        <div class="info">
          <div class="info-title">伪基站</div>
          <img src="static/img/bj-1.png" alt="" class="bj-1">
          <img src="static/img/bj-2.png" alt="" class="bj-2">
          <img src="static/img/bj-3.png" alt="" class="bj-3">
          <img src="static/img/bj-4.png" alt="" class="bj-4">
          <div id="echarts_2"  class="info-concent charts"></div>
        </div>
      </div>
      <!-- 百度地图 -->
      <!-- :fullscreen = 'fullscreenF'  draggable-->
      <Modal v-model="baiduModal" footer-hide :closable="false" class="wjzModal">
        <p slot="header" style="width: 100%;position: relative;">
          <span>{{mapTitle}}</span>
          <span style="position: absolute;top:0;right:0;cursor: pointer;" @click="closeModal">关闭</span>
          <!-- <Icon type="ios-expand" style="float: right;margin-right:10px" size="18" color="#000" @click="handleExpand"/> -->
        </p>
        <div id="baiduMap" ref="baiduMap" class="hideLogo" style="width: 100%; height:400px"></div>
      </Modal>
    </div>
  </div>
</template>
<script>
import 'echarts/lib/echarts'
import 'echarts/map/js/province/guangxi.js'
export default {
  name: 'test',
  data () {
    return {
      mapTitle: '',
      baiduModal: false,
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
      coordinate: {
        'bs': [106.631821404, 23.9015123679],
        'hc': [108.069947709, 24.6995207829],
        'lz': [109.42240181, 24.3290533525],
        'gl': [110.260920147, 25.262901246],
        'cz': [107.357322038, 22.4154552965],
        'nn': [108.297233556, 22.8064929356],
        'lb': [109.231816505, 23.7411659265],
        'gg': [109.613707557, 23.1033731644],
        'hz': [111.552594179, 24.4110535471],
        'wz': [111.30547195, 23.4853946367],
        'yl': [110.151676316, 22.6439736084],
        'qz': [108.638798056, 21.9733504653],
        'bh': [109.122627919, 21.472718235],
        'fcg': [108.351791153, 21.6173984705]
      },
      pointsSource: [
        {
          'value': [109.602146, 23.0936],
          'name': '贵港市'
        },
        {
          'value': [109.702146, 25.1936],
          'name': '桂林市'
        },
        {
          'value': [109.802146, 24.0936],
          'name': '来宾市'
        },
        {
          'value': [109.902146, 25.0936],
          'name': '桂林市'
        },
        {
          'value': [110.299121, 25.274215],
          'name': '桂林市'
        },
        {
          'value': [110.599121, 25.178215],
          'name': '桂林市'
        },
        {
          'value': [110.499121, 25.384215],
          'name': '桂林市'
        },
        {
          'value': [110.209121, 25.674215],
          'name': '桂林市'
        },
        {
          'value': [110.499121, 25.574215],
          'name': '桂林市'
        },
        {
          'value': [110.399121, 25.474215],
          'name': '桂林市'
        },
        {
          'value': [109.74664, 22.576275],
          'name': '钦州市'
        },
        {
          'value': [109.17245, 25.03179],
          'name': '柳州市'
        }
      ],
      map: null,
      points: []
    }
  },
  mounted () {
    this.drawGuangxi()
    this.$Notice.config({
      top: 100,
      duration: 3
    })
  },
  methods: {
    drawGuangxi () { // 基于准备好的dom，初始化echarts实例
      let _this = this
      let minigrateChart = this.$echarts.init(document.getElementById('echarts_2'))
      let MinigrateOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}'
        },
        geo: {
          map: '广西',
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: '#fff'
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
      minigrateChart.setOption(MinigrateOption)
      minigrateChart.on('click', function (params) {
        _this.clickMap(params)
      })
      window.addEventListener('resize', function () {
        minigrateChart.resize()
      })
    },
    clickMap (params) { // 点击echarts事件
      let name = params.name ? params.name : '' // 点击区域的名称
      // let value = params.value ? params.value : ''// 点击区域伪基站位置
      // let lng = value[0]
      // let lat = value[1]
      this.mapTitle = name + '伪基站信息'
      this.baiduModal = true
      // 英文名 中文名
      setTimeout(() => {
        this.createMap(this.nameMap[name], name)
        this.drawPoints()
        this.getBoundary(this.nameMap[name])
      }, 20)
      // this.createMap(this.nameMap[name], name)
      // // 绘制地图上的点
      // // 一次性全部绘制
      // this.drawPoints()
      // // 单个绘制
      // this.map.addOverlay(new window.BMap.Marker(new window.BMap.Point(lng, lat)))
      // this.getBoundary(this.nameMap[name])
    },
    drawPoints () {
      let data = this.pointsSource
      if (document.createElement('canvas').getContext) { // 判断当前浏览器是否支持绘制海量点
        data.map((item) => {
          let lat = item.value[1] // 纬度
          let lng = item.value[0] // 经度
          this.points.push(new window.BMap.Point(lng, lat))
        })
        let options = {
          shape: window.BMAP_POINT_SHAPE_WATERDROP
        }
        let pointCollection = new window.BMap.PointCollection(this.points, options)
        this.map.addOverlay(pointCollection)
      } else { // 不支持绘制海量点
        data.map((item) => {
          let lat = item.value[1] // 纬度
          let lng = item.value[0] // 经度
          this.map.addOverlay(new window.BMap.Marker(new window.BMap.Point(lng, lat)))
        })
      }
    },
    createMap (Ename, Cname) { // 创建百度地图
      this.map = new window.BMap.Map('baiduMap')
      const point = new window.BMap.Point(this.coordinate[Ename][0], this.coordinate[Ename][1])
      this.map.centerAndZoom(point, 8)
      this.map.setCurrentCity(Cname)
      this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
      this.map.setMinZoom(8) // 最小缩放级别
      this.map.setMaxZoom(15) // 最大缩放级别
    },
    getBoundary (name) { // 绘制边界
      this.axios.get(this.jsonURL + '/static/map/boundaries/gx/' + name + '.json').then((res) => {
        let count = res.boundaries.length
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
        }
      })
    },
    closeModal () {
      this.baiduModal = false
      this.map = null
      const content = this.$refs.baiduMap
      content.removeChild(content.childNodes[1])
      // this.$refs.baiduMap.empty()
    }
  }
}
</script>
