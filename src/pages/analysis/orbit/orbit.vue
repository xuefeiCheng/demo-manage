<template lang="html">
  <div>
    <!-- echarts地图 -->
    <div id="baiduMap" :style="[mapSize]"></div>
  </div>
</template>

<script>
const queryByStaidData = {
  'code': 200,
  'msg': 'OK',
  'data': [
    {
      'streamnumber': 1281,
      'psoname': '广西自治区玉林市福绵区成均镇庞冲',
      'lacid': '30579',
      'cellid': '11403',
      'createtime': '20181221101010',
      'lat': '22.51618028',
      'lng': '109.93614393',
      'city': 'yl',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1283,
      'psoname': '广西自治区玉林市玉州区玉城街道教育中路510号玉林国际购物中心',
      'lacid': '30801',
      'cellid': '7431',
      'createtime': '20181221101010',
      'lat': '22.637387',
      'lng': '110.158961',
      'city': 'yl',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1286,
      'psoname': '广西自治区南宁市宾阳县宾州镇宾阳县国土资源局行政审批服务大厅',
      'lacid': '22811',
      'cellid': '16221',
      'createtime': '20181221101010',
      'lat': '23.229215',
      'lng': '108.823644',
      'city': 'nn',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1288,
      'psoname': '广西自治区崇左市大新县桃城镇521县道',
      'lacid': '30890',
      'cellid': '15162',
      'createtime': '20181221101010',
      'lat': '22.829992',
      'lng': '107.264648',
      'city': 'cz',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1291,
      'psoname': '广西自治区南宁市宾阳县洋桥镇高芹',
      'lacid': '30609',
      'cellid': '1861',
      'createtime': '20181221101010',
      'lat': '23.311505',
      'lng': '108.96753',
      'city': 'nn',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1347,
      'psoname': '广西自治区崇左市扶绥县新宁镇桂林理工大学南宁分校图书馆桂林理工大学南宁空港校区西区',
      'lacid': '22810',
      'cellid': '50666',
      'createtime': '20181221101010',
      'lat': '22.614543',
      'lng': '107.94125',
      'city': 'gl',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1679,
      'psoname': '广西自治区贵港市港南区瓦塘乡G80广昆高速',
      'lacid': '30813',
      'cellid': '38192',
      'createtime': '20181221101010',
      'lat': '22.899413',
      'lng': '109.587946',
      'city': 'gg',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1449,
      'psoname': '广西自治区柳州市融水苗族自治县和睦镇204省道',
      'lacid': '1478',
      'cellid': '3711',
      'createtime': '20181221101010',
      'lat': '24.900431',
      'lng': '109.162926',
      'city': 'yl',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1468,
      'psoname': '广西自治区百色市靖西市新甲乡320省道',
      'lacid': '30817',
      'cellid': '44',
      'createtime': '20181221101010',
      'lat': '23.192103',
      'lng': '106.378189',
      'city': 'bs',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1543,
      'psoname': '广西自治区贵港市平南县平山镇七新村',
      'lacid': '30807',
      'cellid': '31012',
      'createtime': '20181221101010',
      'lat': '23.099983',
      'lng': '110.50611',
      'city': 'gg',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1580,
      'psoname': '广西自治区百色市德保县那甲乡G69银百高速',
      'lacid': '1710',
      'cellid': '3943',
      'createtime': '20181221101010',
      'lat': '23.371397',
      'lng': '106.673426',
      'city': 'bs',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 2046,
      'psoname': '广西自治区梧州市万秀区城东镇001乡道',
      'lacid': '1239',
      'cellid': '4473',
      'createtime': '20181221101010',
      'lat': '23.478235',
      'lng': '111.433571',
      'city': 'wz',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 2178,
      'psoname': '广西自治区贺州市钟山县钟山镇北环西路419号',
      'lacid': '4617',
      'cellid': '1232',
      'createtime': '20181221101010',
      'lat': '24.527995',
      'lng': '111.284045',
      'city': 'hz',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1326,
      'psoname': '广西自治区贺州市昭平县黄姚镇大湾寨',
      'lacid': '30644',
      'cellid': '1533',
      'createtime': '20181221101010',
      'lat': '24.21426',
      'lng': '111.217987',
      'city': 'hz',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1503,
      'psoname': '广西自治区北海市合浦县山口镇新塘尾',
      'lacid': '30706',
      'cellid': '16903',
      'createtime': '20181221101010',
      'lat': '21.667026',
      'lng': '109.730564',
      'city': 'bh',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    },
    {
      'streamnumber': 1585,
      'psoname': '广西自治区北海市合浦县廉州镇325国道',
      'lacid': '2162',
      'cellid': '233',
      'createtime': '20181221101010',
      'lat': '21.679954',
      'lng': '109.1735',
      'city': 'bh',
      'staid': 0,
      'pas_lac': null,
      'pas_ci': null,
      'drowsta': null,
      'domain': null
    }
  ]
}
export default {
  data () {
    return {
      mapSize: {
        height: '400px',
        width: '100%'
      },
      baiduMap: null
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
    drawMap () {
      this.createMap(0, '22.51618028', '109.93614393')
    },
    createMap (id, lat, lng) {
      let datagj = queryByStaidData.data
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

<style lang="css">
</style>
