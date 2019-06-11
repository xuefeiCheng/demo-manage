<template>
  <div class="data mapTab noback inter_mapTab inter_margin analysis">
      <!-- title 部分 -->
      <div class="border-self analysis_title">
          <div class="inter_title">{{title}}</div>
          <div class="des">?</div>
          <div class="des_content">{{des}}</div>
      </div>
      <!-- 主体部分 -->
      <div class="analysis_content">
          <div style="flex:1;height:100%" class="border-self">
              <div style="width:100%;height:100%;">
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
      data: [],
      points: [],
      visualMapMix: 10,
      heatmapOverlay: '',
      title: '热点事件实时监控',
      des: '主要对公众通信网络进行实时监测，将该信息在GIS地图上展现，对应急处置、重大安全事件进行实时、直观的展示，并经过统计分析，自动触发相应的应急预案，启动预警和应急响应，事后自动生成统计报表。'
    }
  },
  mounted () {
    this.creatMap()
    setTimeout(() => { this.getHeatmap() }, 20)
  },
  methods: {
    creatMap () {
      this.map = new window.BMap.Map('baiduMap', {})
      // 南宁南站 22.841885,108.413974
      // 南宁站 22.826675,108.315303
      this.map.centerAndZoom(new window.BMap.Point(108.315303, 22.826675), 14) // 创建中心点
      var point = new window.BMap.Point(108.315303, 22.826675)
      var marker = new window.BMap.Marker(point)
      this.map.addOverlay(marker)
      this.map.enableScrollWheelZoom() // 开启鼠标滚轮缩放
      this.map.setMinZoom(8) // 最小缩放级别
      this.map.setMaxZoom(15)
    },
    getHeatmap () {
      const points = [
        {'lng': 108.3158261, 'lat': 22.821984, 'count': 50},
        {'lng': 108.3153382, 'lat': 22.316582, 'count': 51},
        {'lng': 108.3119787, 'lat': 22.330658, 'count': 15},
        {'lng': 108.3158455, 'lat': 22.820921, 'count': 40},
        {'lng': 108.3128843, 'lat': 22.315516, 'count': 100},
        {'lng': 108.312546, 'lat': 22.318503, 'count': 26},
        {'lng': 108.3122289, 'lat': 22.319989, 'count': 18},
        {'lng': 108.3118162, 'lat': 22.315051, 'count': 80},
        {'lng': 108.3122022, 'lat': 22.31782, 'count': 11},
        {'lng': 108.311387, 'lat': 22.317253, 'count': 37},
        {'lng': 108.311773, 'lat': 22.319426, 'count': 42},
        {'lng': 108.3121087, 'lat': 22.316445, 'count': 34},
        {'lng': 108.3117521, 'lat': 22.317943, 'count': 27},
        {'lng': 108.3169812, 'lat': 22.820836, 'count': 22},
        {'lng': 108.3120682, 'lat': 22.31463, 'count': 60},
        {'lng': 108.3165424, 'lat': 22.824675, 'count': 38},
        {'lng': 108.3119242, 'lat': 22.314509, 'count': 15},
        {'lng': 108.3122766, 'lat': 22.821408, 'count': 25},
        {'lng': 108.3151674, 'lat': 22.824226, 'count': 21},
        {'lng': 108.3127268, 'lat': 22.82267, 'count': 31},
        {'lng': 108.3117721, 'lat': 22.820034, 'count': 51},
        {'lng': 108.3112456, 'lat': 22.82667, 'count': 47},
        {'lng': 108.3120482, 'lat': 22.319114, 'count': 11},
        {'lng': 108.3125013, 'lat': 22.821611, 'count': 35},
        {'lng': 108.3168733, 'lat': 22.331037, 'count': 22},
        {'lng': 108.3119336, 'lat': 22.331134, 'count': 44},
        {'lng': 108.3173557, 'lat': 22.822254, 'count': 45},
        {'lng': 108.3118367, 'lat': 22.82943, 'count': 43},
        {'lng': 108.3184312, 'lat': 22.319621, 'count': 100},
        {'lng': 108.3122874, 'lat': 22.319447, 'count': 87},
        {'lng': 108.3124225, 'lat': 22.822091, 'count': 82},
        {'lng': 108.3157801, 'lat': 22.821854, 'count': 44},
        {'lng': 108.3117129, 'lat': 22.828227, 'count': 21},
        {'lng': 108.3126426, 'lat': 22.822286, 'count': 80},
        {'lng': 108.3141597, 'lat': 22.31948, 'count': 82},
        {'lng': 108.3113895, 'lat': 22.820787, 'count': 26},
        {'lng': 108.3153563, 'lat': 22.821197, 'count': 17},
        {'lng': 108.3137982, 'lat': 22.822547, 'count': 17},
        {'lng': 108.3176126, 'lat': 22.821938, 'count': 25},
        {'lng': 108.311826, 'lat': 22.315782, 'count': 100},
        {'lng': 108.3179222, 'lat': 22.316759, 'count': 22},
        {'lng': 108.3177185, 'lat': 22.829122, 'count': 11},
        {'lng': 108.3147227, 'lat': 22.827518, 'count': 9},
        {'lng': 108.3137784, 'lat': 22.315754, 'count': 47},
        {'lng': 108.3190193, 'lat': 22.317061, 'count': 52},
        {'lng': 108.3112735, 'lat': 22.315619, 'count': 100},
        {'lng': 108.3188495, 'lat': 22.315958, 'count': 46},
        {'lng': 108.3166292, 'lat': 22.331086, 'count': 19},
        {'lng': 108.3169916, 'lat': 22.824055, 'count': 18},
        {'lng': 108.315189, 'lat': 22.821308, 'count': 11},
        {'lng': 108.3153765, 'lat': 22.829376, 'count': 13},
        {'lng': 108.3158222, 'lat': 22.820348, 'count': 50},
        {'lng': 108.3147554, 'lat': 22.330511, 'count': 15},
        {'lng': 108.3148568, 'lat': 22.318161, 'count': 22},
        {'lng': 108.3153461, 'lat': 22.826306, 'count': 22},
        {'lng': 108.317222, 'lat': 22.82161, 'count': 13},
        {'lng': 108.31374, 'lat': 22.828616, 'count': 6},
        {'lng': 108.3134679, 'lat': 22.315499, 'count': 21},
        {'lng': 108.312171, 'lat': 22.315738, 'count': 29},
        {'lng': 108.3117836, 'lat': 22.316998, 'count': 99},
        {'lng': 108.0920755, 'lat': 22.828001, 'count': 10},
        {'lng': 108.0914077, 'lat': 22.330655, 'count': 14},
        {'lng': 108.0926092, 'lat': 22.822995, 'count': 16},
        {'lng': 108.091535, 'lat': 22.331054, 'count': 15},
        {'lng': 108.0913022, 'lat': 22.821895, 'count': 13},
        {'lng': 108.0915551, 'lat': 22.313373, 'count': 17},
        {'lng': 108.3121191, 'lat': 22.826572, 'count': 21},
        {'lng': 108.3189612, 'lat': 22.317119, 'count': 9},
        {'lng': 108.3188227, 'lat': 22.821337, 'count': 54},
        {'lng': 108.3163776, 'lat': 22.821919, 'count': 26},
        {'lng': 108.3157694, 'lat': 22.82536, 'count': 17},
        {'lng': 108.3135377, 'lat': 22.314137, 'count': 19},
        {'lng': 108.3187434, 'lat': 22.314224, 'count': 43},
        {'lng': 108.310588, 'lat': 22.822622, 'count': 27},
        {'lng': 108.3198345, 'lat': 22.319467, 'count': 83},
        {'lng': 108.3196883, 'lat': 22.317171, 'count': 33},
        {'lng': 108.3153877, 'lat': 22.316659, 'count': 34},
        {'lng': 108.3135712, 'lat': 22.315613, 'count': 14},
        {'lng': 108.0719869, 'lat': 22.331416, 'count': 12},
        {'lng': 108.0716956, 'lat': 22.825377, 'count': 11},
        {'lng': 108.072066, 'lat': 22.825017, 'count': 38},
        {'lng': 108.3116244, 'lat': 22.820215, 'count': 91},
        {'lng': 108.041929, 'lat': 22.315908, 'count': 54},
        {'lng': 108.0522108, 'lat': 22.319658, 'count': 21},
        {'lng': 108.06183, 'lat': 22.825015, 'count': 15},
        {'lng': 108.0621969, 'lat': 22.313527, 'count': 34},
        {'lng': 108.0622936, 'lat': 22.821854, 'count': 24},
        {'lng': 108.071905, 'lat': 22.829217, 'count': 12},
        {'lng': 108.3124579, 'lat': 22.314987, 'count': 57},
        {'lng': 108.092076, 'lat': 22.315251, 'count': 70},
        {'lng': 108.3125867, 'lat': 22.318989, 'count': 8}]
      this.heatmapOverlay = new window.BMapLib.HeatmapOverlay({radius: 10, opacity: 0.4})
      this.map.addOverlay(this.heatmapOverlay)
      this.heatmapOverlay.setDataSet({ data: points, max: 100 })
    }
  }
}
</script>

<style scoped>
  .border-self {box-shadow: none !important;}
</style>
