<template>
  <div class="data noback">
    <div class="data-title2"></div>
    <div class="data-content2">
        <div class="all fl">
          <div class="info">
                <div class="info-title">诈骗电话</div>
                 <div class="title">{{zpdate}}诈骗电话拦截量</div>
                <img src="static/img/bj-1.png" alt="" class="bj-1">
                <img src="static/img/bj-2.png" alt="" class="bj-2">
                <img src="static/img/bj-3.png" alt="" class="bj-3">
                <img src="static/img/bj-4.png" alt="" class="bj-4">
                <div id="echarts_3" class="info-concent charts"></div>
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
      zpdate: '每日',
      hour: 0,
      alldata: [],
      alldate: [],
      zpdhindex: 2,
      zpdhintervalid: 0
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    drawLine () { // 基于准备好的dom，初始化echarts实例
      let eChart3 = this.$echarts.init(document.getElementById('echarts_3'))
      // 绘制图表
      eChart3.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: '{a} <br/>{b}时 : {c}'
        },
        color: ['#a4d8cc', '#25f3e6'], // 修改折线颜色
        xAxis: [
          {
            type: 'category',
            rotate: 60,
            boundaryGap: false,
            data: ['1', '2', '3', '4', '5', '6', '7', '8',
              '9', '10', '11', '12', '13', '14', '15', '16',
              '17', '18', '19', '20', '21', '22', '23', '24'],
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 20
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 20
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
          }
        ],
        series: [
          {
            name: '拦截量',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: [],
            markPoint: {
              symbolSize: 50,
              data: [
                {type: 'min', name: '最小值'}
              ]
            }
          }
        ]
      })
      window.addEventListener('resize', function () {
        eChart3.resize()
      })

      axios.get('bigscreen/getIntercept')
        .then(
          (res) => {
            if (res.code === 200) {
              let data = res.data.num
              this.alldata = data
              let date = res.data.date
              this.alldate = res.data.date
              this.hour = res.data.hour
              this.zpdate = date[2]
              eChart3.setOption({
                series: [
                  {
                    data: data[2]
                  }
                ]
              })
            }
          })

      this.zpdhintervalid = setInterval(() => {
        let lastdata = ''
        if (this.zpdhindex === 2) {
          lastdata = this.alldata[0]
          this.zpdate = this.alldate[0]
          this.zpdhindex = 0
        } else if (this.zpdhindex === 0) {
          lastdata = this.alldata[1]
          this.zpdate = this.alldate[1]
          this.zpdhindex = 1
        } else if (this.zpdhindex === 1) {
          lastdata = this.alldata[2]
          this.zpdate = this.alldate[2]
          this.zpdhindex = 2
        }
        let mydate = new Date()
        let newhour = mydate.getHours() + ''
        if (this.hour === newhour) {
          eChart3.setOption({
            series: [
              {
                data: lastdata
              }
            ]
          })
        } else {
          axios.get('bigscreen/gettodayIntercept')
            .then(
              (res) => {
                if (res.code === 200) {
                  let data = res.data
                  this.alldata[2] = data
                  this.zpdate = this.alldate[2]
                  this.hour = newhour
                  this.zpdhindex = 2
                  eChart3.setOption({
                    series: [
                      {
                        data: data
                      }
                    ]
                  })
                }
              })
        }
      }, 30000)
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.zpdhintervalid)
  }
}
</script>
