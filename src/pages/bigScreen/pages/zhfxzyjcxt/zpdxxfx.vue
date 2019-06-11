<template>
  <div class="data mapTab noback inter_mapTab inter_margin analysis">
      <!-- title 部分 -->
      <div class="border-self analysis_title">
          <div class="inter_title">{{title}}</div>
          <div class="des">
            ?
          </div>
          <div class="des_content">
            基于信令接入子系统输出的CDR（短消息、话单），结合黑白名单过滤、模板匹配、短文本分类、通联行为特征分析以及关联学习等技术手段，实现针对诈骗短消息的分析识别，提取诈骗短消息SP号、诈骗电话号码、诈骗短消息受害人号码、恶意URL、地理位置、被仿冒对象号码(如银行、邮局、快递、学校、社保机构……)
          </div>
      </div>
      <!-- 主体部分 -->
      <div class="analysis_content">
          <div style="flex:0 0 60.1%;padding:15px" class="border-self">
            <img src="static/img/bigscreen/zpdxxfx01.PNG" alt="" style="height:100%;width:100%">
          </div>
          <div style="flex:0 0 39.9%" class="border-self">
              <div style="height:100%;position:relative">
                <!-- <div class="box_title border-self" style="height:7%;font-size:22px;padding-top:8px">
                    <span class="cicle"></span><span>图表</span>
                </div> -->
                <div class="box_conent" style="height:100%">
                  <div class="inter_table" style="height:100%">
                    <div class="info-concent charts" id="small_echarts_halo"></div>
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
      title: '诈骗短消息分析',
      typeList: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      let myChart = this.$echarts.init(document.getElementById('small_echarts_halo'))
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
    clearInterval(this.prointervalid)
  }
}
</script>

<style scoped>
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
