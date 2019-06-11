<template>
  <div class="data noback smallScreen">
    <div class="data-title2"></div>
    <div class="data-content2 data-content2-right">
        <div class="all fl">
          <div class="info">
                <div class="info-title2">运营商分类统计</div>
                 <div class="title zpdh_title">运营商分类号码量</div>
                <img src="static/img/bj-1.png" alt="" class="bj-1">
                <img src="static/img/bj-2.png" alt="" class="bj-2">
                <img src="static/img/bj-3.png" alt="" class="bj-3">
                <img src="static/img/bj-4.png" alt="" class="bj-4">
                <div class="des des_small">?</div>
                <div class="des_content_small">{{desContent}}</div>
                <div id="small_echarts_3" class="info-concent charts"></div>
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
      desContent: '查询移动、联通、电信各个运营商的号码量，分别展示昨日和今日的号码量。以双柱状图的形式显示',
      CpstatisticLastTwo: {} // 运营商分类号码量
    }
  },
  mounted () {
    setTimeout(() => {
      this.drawBar()
    }, 20)
  },
  methods: {
    // 运营商分类号码量 最近两天
    drawBar () { // 运营商分类号码量
      let myChart = this.$echarts.init(document.getElementById('small_echarts_3'))
      // 绘制图表
      myChart.setOption({
        title: '',
        tooltip: {},
        legend: {
          data: ['昨日号码量', '今日号码量'],
          y: 'bottom',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          data: ['电信', '移动', '联通', '铁通', '其他'],
          axisLabel: {
            // rotate: 60,
            textStyle: {
              color: '#fff',
              fontSize: '18'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: '#fff'
              // fontSize: '16'
            },
            formatter: function (value, index) {
              let res
              if (value >= 10000) {
                res = value / 10000 + '万'
              } else {
                res = value
              }
              return res
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: 55
        },
        series: [{
          name: '昨日号码量',
          type: 'bar',
          barWidth: 20,
          itemStyle: {
            normal: {
              color: '#D38265'
            }
          },
          data: []
        }, {
          name: '今日号码量',
          type: 'bar',
          barWidth: 20,
          itemStyle: {
            normal: {
              color: '#01d1fd'
            }
          },
          data: []
        } ]
      })
      window.addEventListener('resize', function () {
        myChart.resize()
      })
      axios.get('bigscreen/getCpstatisticLastTwo')
        .then(
          (res) => {
            if (res.code === 200) {
              this.CpstatisticLastTwo = res.data
              myChart.setOption({
                series: [
                  {
                    data: this.CpstatisticLastTwo.yesterday
                  },
                  {
                    data: this.CpstatisticLastTwo.today
                  }
                ]
              })
            }
          })
      this.prointervalid = setInterval(() => {
        axios.get('bigscreen/getCpstatisticLastTwo')
          .then(
            (res) => {
              if (res.code === 200) {
                this.CpstatisticLastTwo = res.data
                myChart.setOption({
                  series: [
                    {
                      data: this.CpstatisticLastTwo.yesterday
                    },
                    {
                      data: this.CpstatisticLastTwo.today
                    }
                  ]
                })
              }
            })
      }, 300000)
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.prointervalid)
  }
}
</script>
