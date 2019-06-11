<template>
<!-- 固定互联网络接入子系统 -->
  <div class="mobile-box border-self">
    <div class="mobile-box-top">
      <div class="mobile-box-son" ref="chartOne"></div>
      <div class="mobile-box-son" ref="chartTwo"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {
    this.drawChar('chartOne', {title: '固网数据'})
    this.drawChar('chartTwo', {title: '僵木蠕数据'})
  },
  methods: {
    drawChar (ID, opt) {
      let chart = this.$echarts.init(this.$refs[ID])
      let option = {
        title: {
          text: opt.title || '标题',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['广西移动', '广西电信', '广西联通'],
          bottom: 0,
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['03/11', '03/12', '03/13', '03/14', '03/15', '03/16', '03/17'],
          axisLabel: {
            color: '#fff'
          }
        }],
        yAxis: [{
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            color: '#fff'
          },
          nameTextStyle: {
            color: '#fff'
          }
        }],
        series: [{
          name: '广西移动',
          type: 'bar',
          data: [20, 12, 31, 14, 21, 30, 12]
        }, {
          name: '广西电信',
          type: 'bar',
          data: [10, 20, 5, 9, 3, 10, 32]
        }, {
          name: '广西联通',
          type: 'bar',
          data: [1, 1, 2, 3, 1, 12, 15]
        }]
      }

      // 使用刚指定的配置项和数据显示图表。
      chart.setOption(option)
      window.addEventListener('resize', function () {
        chart.resize()
      })
    }
  }
}
</script>

<style scoped>
.mobile-box {
  height: 100%;
  width: 100%;
}
.mobile-box-top, .mobile-box-bottom {
  height: 100%;
  width: 100%;
  display: flex;
}
.mobile-box-son {
  flex: 1;
  height: 100%;
  width: 100%;
  padding: 10px 5px;
  box-sizing: border-box;
}
</style>
