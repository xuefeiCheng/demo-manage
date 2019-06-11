<template>
  <div class="data mapTab noback inter_mapTab inter_margin analysis">
      <!-- title 部分 -->
      <div class="border-self analysis_title">
          <div class="inter_title">{{title}}</div>
          <div class="des">
            ?
          </div>
          <div class="des_content">
            系统能够基于信令接入子系统输出的通话CDR日志，结合黑白名单过滤、通联行为特征分析和关联学习等技术手段，实现针对诈骗电话的分析识别，提取诈骗电话号码、诈骗电话受害人号码、通话事件等信息，支撑前端号码信誉度的检测过滤，支撑对诈骗号码及行为特征（含样本）的上报、查询、展示和联动处置。
          </div>
      </div>
      <!-- 主体部分 -->
      <div class="analysis_content">
          <div style="flex:0 0 60.1%;padding:15px" class="border-self">
            <img src="static/img/bigscreen/jythxwtz.png" alt="" style="height:100%;width:100%">
          </div>
          <div style="flex:0 0 39.9%" class="border-self">
              <div style="height:100%;position:relative">
                <!-- <div class="box_title border-self" style="height:7%;font-size:22px;padding-top:8px">
                    <span class="cicle"></span><span>图表</span>
                </div> -->
                <div class="box_conent" style="height:100%">
                  <div class="inter_table" style="height:100%">
                    <div class="info-concent charts" id="small_echarts_show"></div>
                  </div>
                </div>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'interMap',
  data () {
    return {
      animate: false,
      transition: true,
      tableData: [],
      title: '基于通话行为特征的诈骗电话分析'
    }
  },
  filters: {
    substr: function (value, length, str) {
      if (!value) return ''
      const le = value.length
      return value.substr(0, length) + (length < le ? str : '')
    },
    timeFilter (time) {
      return time.slice(0, 4) + '-' + time.slice(4, 6) + '-' + time.slice(6, 8) + ' ' + time.slice(8, 10) + ':' + time.slice(10, 12) + ':' + time.slice(12, 14)
    },
    formatNum6 (value) {
      if (!value) return ''
      let le = value.length
      return value.substr(0, 3) + '******' + value.substring(8, le - 1)
    }
  },
  mounted () {
    this.drawMapByType()
  },
  methods: {
    category () { // 获得受害事件
      axios.post('/business/review/0/30', {}).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.list
        }
      })
    },
    drawMapByType () {
      let myChart = this.$echarts.init(document.getElementById('small_echarts_show'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
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
          name: '策略：',
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

      axios.post('/business/review/0/30', {})
        .then(
          (res) => {
            if (res.code === 200) {
              let data = res.data.list
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
                const showData = []
                data.forEach((obj, index, self) => {
                  legend.push(obj.strategy)
                  showData.push({name: obj.strategy, value: obj.signNum})
                })
                myChart.setOption({
                  legend: {
                    data: legend
                  },
                  series: [
                    {
                      data: showData
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
    }
  },
  beforeDestroy () {
  }
}
</script>

<style scoped>
  @keyframes rowup {
    0% {
        -webkit-transform: translate3d(0, 25px, 0);
        transform: translate3d(0, 25px, 0);
    }
    100% {
        -webkit-transform: translate3d(0, -470px, 0);
        transform: translate3d(0, -470px, 0);
    }
}
  .anim {
    transition: all 0.5s;
    position: relative;
  }
  .inter_mapTab .inter_table .inter_table_body ul li {
    height: 25px !important;
    line-height: 25px !important;
    font-size: 15px !important;
  }
  .inter_mapTab .inter_table .inter_table_body {
    height: 94% !important;
  }
  .border-self {box-shadow: none !important;}
</style>
