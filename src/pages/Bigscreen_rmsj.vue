<template>
  <div class="data">

    <div class="data-title2">
    </div>
    <div class="data-content2">
        <div class="all fl">
          <div class="info">
                 <div class="info-title">热门事件</div>
                <img src="static/img/bj-1.png" alt="" class="bj-1">
                <img src="static/img/bj-2.png" alt="" class="bj-2">
                <img src="static/img/bj-3.png" alt="" class="bj-3">
                <img src="static/img/bj-4.png" alt="" class="bj-4">
                <div id="echarts_4"  class="info-concent charts"></div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import 'echarts/lib/echarts'
import axios from 'axios'
const staticData = [
  {value: 60, name: ''},
  {value: 40, name: ''},
  {value: 20, name: ''},
  {value: 80, name: ''},
  {value: 100, name: ''}
]
export default {
  name: 'test',
  data () {
    return {
    }
  },
  mounted () {
    this.drawTriangle()
  },
  methods: {
    drawTriangle () { // 基于准备好的dom，初始化echarts实例
      let eChart4 = this.$echarts.init(document.getElementById('echarts_4'))
      // 绘制图表
      eChart4.setOption({
        color: ['#D53A35', ' #528E95', ' #D38265', ' #98C4B7', '#FFB980'],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        series: [
          {
            name: ' ',
            type: 'funnel',
            left: '10%',
            width: '80%',
            labelLine: {
              normal: {
                show: false
              }
            },
            tooltip: {
              show: false
            },
            itemStyle: {
              normal: {
                opacity: 0.7
              }
            },
            data: [
              {value: 60, name: ''},
              {value: 40, name: ''},
              {value: 20, name: ''},
              {value: 80, name: ''},
              {value: 100, name: ''}
            ]
          },
          {
            name: '',
            type: 'funnel',
            left: '10%',
            width: '80%',
            maxSize: '80%',
            label: {
              normal: {
                position: 'inside',
                formatter: '{b}: {c}',
                textStyle: {
                  color: '#fff'
                }
              },
              emphasis: {
                position: 'inside',
                formatter: '{b}: {c}'
              }
            },
            itemStyle: {
              normal: {
                opacity: 0,
                borderColor: '#fff',
                borderWidth: 2,
                label: {
                  textStyle: {
                    fontSize: 22,
                    color: '#fff'
                  }
                }
              }
            },
            data: []
          }
        ]
      })
      window.addEventListener('resize', function () {
        eChart4.resize()
      })
      axios.get('bigscreen/getTopic')
        .then(
          (res) => {
            if (res.code === 200) {
              let data = res.data
              eChart4.setOption({
                series: [
                  {
                    data: staticData
                  },
                  {
                    data: data
                  }
                ]
              })
            }
          })
    }
  }
}
</script>
