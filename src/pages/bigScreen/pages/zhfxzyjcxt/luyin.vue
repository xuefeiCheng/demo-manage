<template>
  <div class="data mapTab noback inter_mapTab inter_margin analysis">
      <!-- title 部分 -->
      <div class="border-self analysis_title">
          <div class="inter_title">{{title}}</div>
          <div class="des">
            ?
          </div>
          <div class="des_content">
            {{des}}
          </div>
      </div>
      <!-- 主体部分 -->
      <div class="analysis_content">
          <div style="flex:1;height:100%" class="border-self">
              <div style="width:100%;height:100%;padding:20px" id="topic"></div>
          </div>
          <div style="flex:1;height:100%" class="border-self">
            <div style="width:100%;height:100%;position:relative">
              <div style="width:100%;height:100%;padding:20px" id="lanjie"></div>
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
      title: '录音型诈骗语音分析检测',
      des: '录音型诈骗语音分析实现诈骗语音特征挖掘和模板提取。对前端专用设备采集的信令和疑似呼叫内容信息进行挖掘分析，形成有害呼叫的信令和内容特征库，并下发到前端。系统通过基于内容域的语音聚类和语音识别、语义识别等技术，实现对诈骗呼叫信息的快速、全面、有效的发现，并最终形成新有害信息样本。新样本发现在系统正常运行过程中不间断地周期进行，以确保样本更新，实现与有害呼叫的内容翻新同步。',
      LJdata: {
        name: [],
        value: []
      }
    }
  },
  mounted () {
    this.drawTopic()
    this.getLJdata()
  },
  methods: {
    drawTopic () {
      var myChart = this.$echarts.init(document.getElementById('topic'))
      var option = {
        title: {
          text: '话题分类统计',
          x: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['诈骗类顺丰', '反宣类谣言', '诈骗类司法', '反宣类攻击', '诈骗类事故'],
          textStyle: {
            color: '#fff'
          }
        },
        color: ['#3AA7F9', '#F56C7C', '#FD9A36', '#EBE028', '#31CE65', '#20DACD', '#D671F5', '#F430E8', '#8A31FB'],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: 335, name: '诈骗类顺丰'},
              {value: 310, name: '反宣类谣言'},
              {value: 234, name: '诈骗类司法'},
              {value: 135, name: '反宣类攻击'},
              {value: 1548, name: '诈骗类事故'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    getLJdata () {
      this.axios.get('bigscreen/getTopic')
        .then(
          (res) => {
            if (res.code === 200) {
              let data = res.data
              data.forEach((item) => {
                this.LJdata.name.push(item.name)
                this.LJdata.value.push(item.value)
              })
              this.drawLanjie()
            }
          })
    },
    drawLanjie () {
      var myChart = this.$echarts.init(document.getElementById('lanjie'))
      var option = {
        title: {
          text: '模板的拦截量统计',
          x: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {},
        xAxis: {
          data: this.LJdata.name.length ? this.LJdata.name : ['暂无数据'],
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [{
          name: '模板',
          type: 'bar',
          data: this.LJdata.value.length ? this.LJdata.value : [0]
        }]
      }
      myChart.setOption(option)
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    }
  }
}
</script>

<style scoped>
  .border-self {box-shadow: none !important;}
</style>
