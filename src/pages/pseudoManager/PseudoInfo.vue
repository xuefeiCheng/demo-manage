<template>
  <div class="data">
      <div class="con-center fl">
        <div class="cen-top" style='width:1000px; height:600px'>
          <div class="info-concent concent100" id="map2"></div>
        </div>
    </div>
  </div>
</template>
<script>
import 'echarts/lib/echarts'
import 'echarts/map/js/china.js'
import 'echarts/map/js/province/guangxi.js'
export default {
  name: 'test',
  data () {
    return {
      charts: '',
      coldCar: [
        {
          'name': '车辆1',
          'value': [109.602146, 23.0936]
        },
        {
          'name': '车辆2',
          'value': [110.299121, 25.274215]
        }
      ]
    }
  },
  mounted () {
    this.drawMap()
  },
  methods: {
    drawMap () {
      let minigrateChart = this.$echarts.init(document.getElementById('map2'))
      let MinigrateOption = {
        title: {
          text: '伪基站分布',
          subtext: '',
          left: 'center',
          textStyle: {
            color: '#0F0F0F'
          }
        },
        geo: {
          map: '广西',
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: '#0F0F0F'
              }
            },
            emphasis: {
              show: false
            }
          },
          roam: true,
          zoom: 1.2,
          itemStyle: {
            normal: {
              areaColor: '#465471',
              borderColor: '#404a59'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          }
        },
        series: [
          { name: 'aaaa',
            type: 'effectScatter', // 配置显示方式为用户自定义
            coordinateSystem: 'geo',
            itemStyle: {
              normal: {
                color: 'red' }
            },
            data: this.coldCar
          }
        ]
      }
      minigrateChart.setOption(MinigrateOption)
    }
  }
}
</script>
<style scoped>
@import url('../../../static/css/common.css');
@import url('../../../static/css/map.css');
</style>
