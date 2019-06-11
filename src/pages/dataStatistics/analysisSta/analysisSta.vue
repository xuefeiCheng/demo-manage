<template lang="html">
  <div class="div-border box-anaSta">
    <div class="box-anaSta-sons">
      <div class="anaSta-title">
        <p>截止<span class="RED">{{currentTime}}</span>时，共计发现各种诈骗案件<span class="RED">19192</span>个，可识别案件类型<span class="RED">11</span>种。</p>
        <p>诈骗事件涉及<span class="RED">12</span>个省份，<span class="RED">21</span>个城市，其中最严重的三个省份为<span class="RED">湖南、山东、广西</span>。TOP 3 诈骗事件来源城市有<span class="RED">湖南长沙、山东泰安、广东深圳。</span></p>
        <p>其中，Top1 的<span class="RED">湖南长沙</span>，识别出的诈骗事件占总诈骗事件数量的<span class="RED">43.82%</span>,是第二名山东泰安的三倍。</p>
        <p>而从诈骗形式上看，单纯的呼叫诈骗的识别量远远小于短信与事件类识别。当前的识别趋势还是事件与短信识别。</p>
      </div>
      <div class="anaSta-chart div-border-T" ref="chart_TS"></div>
    </div>
    <div class="box-anaSta-sons div-border-RL">
      <div class="anaSta-title">
        <p>截止<span class="RED">{{currentTime}}</span>时，诈骗灾害影响了<span class="RED">31</span>个省份，<span class="RED">269</span>个城市，其中最严重的三个省份为<span class="RED">广西、湖南、湖北</span>。TOP 3 受害情况最多的城市有<span class="RED">湖南长沙、广西柳州、广西南宁</span>。</p>
        <p>其中，TOP1的受害程度接近<span class="RED">14.01%</span>,是第四名广西河池的两倍。</p>
        <p>而从受害形式上看，单纯的呼叫诈骗的识别量远远小于短信与事件类识别。当前的识别趋势还是事件与短信识别。</p>
      </div>
      <div class="anaSta-chart div-border-T" ref="chart_ZH"></div>
    </div>
    <div class="box-anaSta-sons">
      <div class="anaSta-title">
        <p>截止到<span class="RED">{{currentTime}}</span>时,受伪基站影响的受灾基站有<span class="RED">182</span>个，可识别的伪基站路径<span class="RED">78.0</span>条,受伪基站影响最为严重的TOP3城市有：<span class="RED">南宁市，玉林市和崇左市</span>。</p>
      </div>
      <div class="anaSta-chart div-border-T" ref="chart_TX"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentTime: '' // 当前时间
    }
  },
  mounted () {
    this.getToday()
    this.drawTS()
    this.drawZH()
    this.drawTX()
  },
  methods: {
    // 诈骗群体热点态势
    drawTS () {
      let chart = this.$echarts.init(this.$refs.chart_TS)
      let option = {
        title: {
          text: '诈骗群体热点态势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['通话次数', '案例数', '短信次数'],
          left: 'right'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['玉林', '武汉', '北京', '成都', '广元', '上海', '桂林', '潍坊', '阜新', '南宁', '济南', '柳州', '深圳', '泰安', '长沙']
        },
        series: [
          {
            name: '通话次数',
            type: 'bar',
            stack: '数据',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
          },
          {
            name: '案例数',
            type: 'bar',
            stack: '数据',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [1, 3, 10, 13, 25, 28, 63, 542, 543, 547, 546, 1084, 551, 3275, 11955]
          },
          {
            name: '短信次数',
            type: 'bar',
            stack: '数据',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [2, 7, 11, 23, 27, 47, 128, 542, 543, 551, 554, 1084, 1636, 4384, 17610]
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      chart.setOption(option)
    },
    // 灾害影响范围
    drawZH () {
      let chart = this.$echarts.init(this.$refs.chart_ZH)
      let option = {
        title: {
          text: '灾害影响范围'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['通话次数', '案例数', '短信次数'],
          left: 'right'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['梅州', '十堰', '南通', '百色', '东莞', '湖州', '北海', '宁波', '桂林', '广州', '武汉', '河池', '南宁', '柳州', '长沙']
        },
        series: [
          {
            name: '通话次数',
            type: 'bar',
            stack: '数据',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: '案例数',
            type: 'bar',
            stack: '数据',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [538, 541, 548, 550, 547, 552, 1095, 1108, 1112, 2146, 1093, 2794, 2732, 1105]
          },
          {
            name: '短信次数',
            type: 'bar',
            stack: '数据',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [542, 542, 550, 552, 554, 554, 560, 1097, 1119, 1128, 2152, 2186, 3436, 3819, 5599]
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      chart.setOption(option)
    },
    // 通信设施情况
    drawTX () {
      let chart = this.$echarts.init(this.$refs.chart_TX)
      let option = {
        title: {
          text: '通信设施情况'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['贺州市', '梧州市', '钦州市', '来宾市', '柳州市', '桂林市', '贵港市', '北海市', '河池市', '百色市', '崇左市', '玉林市', '南宁市']
        },
        series: [
          {
            name: '数据',
            type: 'bar',
            data: [6, 7, 7, 13, 13, 13, 19, 20, 23, 29, 53, 60, 83]
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      chart.setOption(option)
    },
    getToday () {
      const date = new Date()
      const YY = date.getFullYear()
      const MM = date.getMonth() + 1
      const newMM = MM > 9 ? MM : '0' + MM
      const DD = date.getDate()
      const newDD = DD > 9 ? DD : '0' + DD
      this.currentTime = YY + '' + newMM + '' + newDD + '_0'
    }
  }
}
</script>

<style scoped>
  .box-anaSta {
    display: flex;
    height: 100%;
  }
  .box-anaSta-sons {
    flex: 1;
  }
  .div-border-RL{
    border:1px solid #dcdee2;
    border-width:0 1px;
  }
  .div-border-T {
    border-top: 1px solid #dcdee2;
  }
  .anaSta-title {
    height: 30%;
    text-indent: 2em;
    font-size: 16px;
    padding: 0 5px;
    overflow: hidden;
  }
  .anaSta-chart {
    height: 70%;
    width: 100%;
    padding-top: 10px;
  }
</style>
