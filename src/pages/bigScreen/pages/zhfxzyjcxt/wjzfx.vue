<template>
  <div class="data mapTab noback inter_mapTab inter_margin analysis">
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
            <div style="height:100%">
              <div id="baiduMap" ref="baiduMap" class="hideLogo" style="width:100%;height:100%"></div>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'interMap',
  data () {
    return {
      timeout: null,
      title: '伪基站分析',
      des: `伪基站分析检测子系统基于2/3/4G信令的位置更新CDR，结合伪基站工作原理及对移动网络产生的影响进行分析检测。通过检测伪基站干扰正常通信的事件进行伪基站的发现和疑似受害人的分析检测，并采用基站位置信息聚类方法对伪基站进行初步定位和轨迹跟踪。`,
      pointsSource: [],
      points: []
    }
  },
  mounted () {
    this.createMap()
  },
  methods: {
    createMap () { // 创建百度地图
      this.map = new window.BMap.Map('baiduMap', {})
      // 宾阳县 23.217832,108.810326
      this.map.centerAndZoom(new window.BMap.Point(108.810326, 23.217832), 14) // 创建中心点
      var point = new window.BMap.Point(108.810326, 23.217832)
      var marker = new window.BMap.Marker(point)
      this.map.addOverlay(marker)
      this.map.enableScrollWheelZoom() // 开启鼠标滚轮缩放
      this.map.setMinZoom(8) // 最小缩放级别
      this.map.setMaxZoom(15)
      this.drawPoints()
    },
    drawPoints () {
      this.axios.get('bigscreen/getBYPaseudo')
        .then((res) => {
          if (res.code === 200) {
            let result = res.data
            this.pointsSource = []
            result.forEach((obj, index, self) => {
              this.pointsSource.push({
                value: [obj.lng, obj.lat]
              })
            })
          }
          let data = this.pointsSource
          if (document.createElement('canvas').getContext) { // 判断当前浏览器是否支持绘制海量点
            data.map((item) => {
              let lat = item.value[1] // 纬度
              let lng = item.value[0] // 经度
              this.points.push(new window.BMap.Point(lat, lng))
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
              this.map.addOverlay(new window.BMap.Marker(new window.BMap.Point(lat, lng)))
            })
          }
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
    }
  }
}
</script>

<style scoped>
  .border-self {box-shadow: none !important;}
</style>
