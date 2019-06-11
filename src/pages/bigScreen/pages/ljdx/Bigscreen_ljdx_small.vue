<template>
  <div class="data noback smallScreen">
    <div class="data-title2"></div>
    <div class="data-content2">
      <div class="all fl">
        <div class="info">
          <div class="info-title">短信分类统计</div>
          <img src="static/img/bj-1.png" alt="" class="bj-1">
          <img src="static/img/bj-2.png" alt="" class="bj-2">
          <img src="static/img/bj-3.png" alt="" class="bj-3">
          <img src="static/img/bj-4.png" alt="" class="bj-4">
          <div class="des des_small">?</div>
          <div class="des_content_small">{{desConent}}</div>
          <div class="info-concent charts" id="small_echarts_1"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import 'echarts/lib/echarts'
import axios from 'axios'
export default {
  name: 'test',
  data () {
    return {
      charts: '',
      desConent: '分析模块按小时统计有害短信数量。页面展示当天有害短信数量最多的五个分类，以饼图形式展示。'
    }
  },
  mounted () {
    setTimeout(() => {
      this.drawMapByType()
    }, 20)
  },
  methods: {
    drawMapByType () {
      let myChart = this.$echarts.init(document.getElementById('small_echarts_1'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: '8',
          data: [],
          itemGap: 3,
          icon: 'circle',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        color: ['#3AA7F9', '#F56C7C', '#FD9A36', '#EBE028', '#31CE65', '#20DACD', '#D671F5', '#F430E8', '#8A31FB'],
        series: [{
          name: '事件：',
          type: 'pie',
          radius: '60%',
          center: ['45%', '55%'],
          data: [],
          labelLine: {
            normal: {
              length: 1
            }
          },
          itemStyle: {
            normal: {
              label: {
                formatter: '{d}%'
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })

      axios.get('bigscreen/getSpamsms')
        .then(
          (res) => {
            if (res.code === 200) {
              let data = res.data
              if (data.length === 0) {
                myChart.setOption({
                  legend: {
                    data: ['暂无数据']
                  },
                  series: [
                    {
                      data: [{name: '暂无数据', value: '0'}]
                    }
                  ]
                })
              } else {
                const legend = []
                res.data.forEach((obj, index, self) => {
                  legend.push(obj.name)
                })
                myChart.setOption({
                  legend: {
                    data: legend
                  },
                  series: [
                    {
                      data: data
                    }
                  ]
                })
              }
            } else {
              myChart.setOption({
                legend: {
                  data: ['暂无数据']
                },
                series: [
                  {
                    data: [{name: '暂无数据', value: '0'}]
                  }
                ]
              })
            }
          }
        )
      this.prointervalid = setInterval(() => {
        axios.get('bigscreen/getSpamsms')
          .then(
            (res) => {
              if (res.code === 200) {
                let data = res.data
                if (data.length === 0) {
                  myChart.setOption({
                    legend: {
                      data: ['暂无数据']
                    },
                    series: [
                      {
                        data: [{name: '暂无数据', value: '0'}]
                      }
                    ]
                  })
                } else {
                  const legend = []
                  res.data.forEach((obj, index, self) => {
                    legend.push(obj.name)
                  })
                  myChart.setOption({
                    legend: {
                      data: legend
                    },
                    series: [
                      {
                        data: data
                      }
                    ]
                  })
                }
              } else {
                myChart.setOption({
                  legend: {
                    data: ['暂无数据']
                  },
                  series: [
                    {
                      data: [{name: '暂无数据', value: '0'}]
                    }
                  ]
                })
              }
            }
          )
      }, 300000)
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.prointervalid)
  }
}
</script>
