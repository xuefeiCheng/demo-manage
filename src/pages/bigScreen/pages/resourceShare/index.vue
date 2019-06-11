<template>
  <div class="data mapTab noback inter_mapTab inter_margin analysis">
      <!-- title 部分 -->
      <div class="border-self analysis_title">
          <div class="inter_title">{{title}}</div>
          <div class="des" style="display:none">
            ?
          </div>
          <div class="des_content">
            {{des}}
          </div>
      </div>
      <!-- 主体部分 -->
      <div class="analysis_content">
          <div style="flex:1;height:100%" class="border-self">
            <div style="color: #fff;height:100%;box-sizing:border-box;padding:20px;">
              <h1>系统功能：</h1>
              <div class="content noback">{{des}}</div>
            </div>
          </div>
          <div style="flex:1;height:100%" class="border-self">
            <div style="height:50%;width:100%">
              <div style="width:100%;height:100%;padding:20px" id="topic"></div>
            </div>
            <div style="width:100%;height:50%;position:relative">
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
      title: '资源共享和协同联动系统',
      des: '资源共享和协同联动系统在架构上分为内外两层，内外两层之间通过隔离管理专用设备实现内部专网与外部专网的有效隔离。内层包含信息交换、联动处置和知识库管理三个应用子系统，通过数据接口和指令接口连接业务数据管理系统和通讯信息诈骗处置系统，通过专线连接国家中心和分中心，实现与内部专网各系统之间的指令流转和数据传输；外层通过网络安全隔离与信息交换系统等边界设备，使用专线与我区公安机关、通信管理局、本区相关政府机构、基础电信企业连接，实现与外部相关系统之间的数据传输。',
      content: `安全隔离系统用以保存与用户个人信息相关的敏感数据，从前端采集到的敏感用户数据在云资源池的应用平台中通过单向隔离设备导入到安全隔离系统保存，安全隔离系统设置于屏蔽机柜中。`
    }
  },
  mounted () {
    this.drawTopic()
    this.drawLanjie()
  },
  methods: {
    drawTopic () {
      var myChart = this.$echarts.init(document.getElementById('topic'))
      var option = {
        title: {
          text: '公安接口黑灰名单拦截统计',
          x: 'left',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis'
          // formatter: '{a} <br/>{b}: {c}'
        },
        legend: {
          data: ['黑名单', '灰名单'],
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['03-14', '03-15', '03-16', '03-17', '03-18', '03-19', '03-20'],
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
        color: ['lightskyblue', 'yellow', 'orangered', 'red'],
        series: [{
          name: '黑名单',
          type: 'line',
          data: [1659, 2539, 1598, 3625, 2365, 3598, 1938]
        },
        {
          name: '灰名单',
          type: 'line',
          data: [2497, 1986, 1598, 1533, 1923, 1489, 2369]
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
      myChart.setOption(option)
    },
    drawLanjie () {
      var myChart = this.$echarts.init(document.getElementById('lanjie'))
      var option = {
        title: {
          text: '部省下发的号码统计',
          // subtext: '按部省下发模板统计',
          x: 'left',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c}'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['03-14', '03-15', '03-16', '03-17', '03-18', '03-19', '03-20'],
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
          name: '数量',
          type: 'line',
          data: [40, 45, 46, 40, 47, 49, 44]
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
  .border-self {box-shadow: none !important;}
  .content {
    text-indent: 2em;
    font-size: 36px;
  }
</style>
