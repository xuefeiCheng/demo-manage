<template>
    <div>
        <Row>
            <Col span="12" class="row-col">
                  <Form ref="searchForm" :label-width="80"  class="search-form" >
                     <FormItem label="时间段" prop="interceptionTime" :label-width="65">
                        <DatePicker type="datetimerange" format="yyyy-MM-dd" @on-ok='searchprovince' @on-clear='searchprovinceClear' placeholder="请输入分省拦截量时间区间" v-model="interceptionTime" style="width: 90%"></DatePicker>
                    </FormItem>
                  </Form>
                <div   ref='interception' class="common-echart"></div>
            </Col>
            <Col span='12' class="row-col">
                  <Form ref="searchForm" :label-width="80"  class="search-form" >
                     <FormItem label="时间段" prop="interceptionTime" :label-width="65">
                        <DatePicker type="datetimerange"  format="yyyy-MM-dd" @on-ok='searchSwindle' @on-clear='searchSwindleClear' placeholder="请输入运营商拦截量时间区间" v-model="swindleTime" style="width: 90%"></DatePicker>
                    </FormItem>
                  </Form>
                <div  ref='swindle' class="common-echart"></div>
            </Col>
        </Row>
        <Row>
            <Col span='12' class="row-col">
                  <Form ref="searchForm" :label-width="80"  class="search-form" >
                     <FormItem label="时间段" prop="interceptionTime" :label-width="65">
                        <DatePicker type="datetimerange"  format="yyyy-MM-dd" @on-ok='searchTopic' @on-clear='searchTopicClear' placeholder="请输入话题拦截量时间区间" v-model="swindleTime" style="width: 90%"></DatePicker>
                    </FormItem>
                  </Form>
                <div  ref='topic' class="common-echart"></div>
            </Col>
            <Col span='12' class="row-col">
               <Form ref="searchForm" :label-width="80"  class="search-form" >
                     <FormItem label="时间段" prop="interceptionTime" :label-width="65">
                        <DatePicker type="datetimerange" format="yyyy-MM-dd" @on-ok='searchRubbish' @on-clear='searchRubbishClear' placeholder="请输入拦截类型拦截量时间区间" v-model="rubbishTime" style="width: 90%"></DatePicker>
                    </FormItem>
                </Form>
                <div  ref='rubbish' class="common-echart"></div>
            </Col>
        </Row>
    </div>
</template>

<script>
import { dateToString } from '@/utils/timeFormat'
export default {
  data () {
    return {
      interceptionTime: '',
      swindleTime: '',
      rubbishTime: ''
    }
  },
  mounted () {
    let searchData = {starttime: '', endtime: '', mode: 'hour'}
    this.drawInterceptionChart(searchData)
    this.searchSwindleClear()
    // this.searchRubbishClear()
  },
  methods: {
    drawInterceptionChart (searchData) {
      this.axios.post('/dataStatistic/getProvinceIntercept', searchData).then(data => {
        if (data.code === 200) {
          let chart = this.$echarts.init(this.$refs.interception)

          chart.setOption({
            title: {
              show: false,
              text: '拦截号码',
              subtext: '',
              left: 'center',
              textStyle: {
                color: '#fff'
              }
            },
            tooltip: {
              trigger: 'item'
            },
            visualMap: {
              min: 0,
              max: 1000,
              left: '3%',
              bottom: '0%',
              text: ['高', '低'],
              seriesIndex: [0],
              calculable: true,
              inRange: {
                color: ['#50a3ba', '#eac736', '#d94e5d']
              }
            },
            geo: {
              map: 'china',
              left: 'center',
              label: {
                normal: {
                  show: true, // 是否显示对应地名
                  textStyle: {
                    color: '#fff',
                    fontSize: 12
                  }
                },
                emphasis: {
                  show: false
                }
              },
              roam: true, // 是否开启鼠标缩放和平移漫游
              zoom: 1.1,
              itemStyle: {
                normal: {
                  borderColor: 'rgba(37, 142, 183, 1)',
                  borderWidth: 1,
                  areaColor: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.8,
                    colorStops: [{
                      offset: 0,
                      color: 'rgba(11, 37, 108, .5)' // 0% 处的颜色
                    }, {
                      offset: 1,
                      color: 'rgba(11, 37, 108, 1)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                  },
                  shadowColor: 'rgba(50, 137, 215, .34)',
                  shadowOffsetX: -2,
                  shadowOffsetY: 2,
                  shadowBlur: 18
                },
                emphasis: {
                  areaColor: '#389BB7',
                  borderWidth: 0
                }
              }
            },
            series: {
              name: '拦截量',
              type: 'map',
              geoIndex: 0,
              data: data.data,
              label: {
                show: true,
                position: ['50%', '50%'],
                formatter: function (params) {
                  let name = params.name
                  return name + '\n\n拦截量:' + params.value
                }
              }
            }
          })

          window.addEventListener('resize', function () {
            chart.resize()
          })
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('拦截量统计请求失败')
      })
    },
    drawTopic (data) {
      let chart = this.$echarts.init(this.$refs.topic)
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          top: 8,
          data: data.name,
          itemGap: 3,
          icon: 'circle',
          textStyle: {
            fontSize: 12,
            color: '#389BB7'
          }
        },
        color: ['#3AA7F9', '#F56C7C', '#FD9A36', '#EBE028', '#31CE65', '#20DACD', '#D671F5', '#F430E8', '#8A31FB'],
        series: [{
          // name: '事件：',
          type: 'pie',
          radius: '60%',
          center: ['45%', '55%'],
          data: data.topicdata,
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
      chart.setOption(option)
      window.addEventListener('resize', function () {
        chart.resize()
      })
    },
    drawSwindle (data) {
      let chart = this.$echarts.init(this.$refs.swindle)
      chart.setOption({
        title: {
          text: '运营商拦截量统计',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          orient: 'horizontal',
          feature: {
            dataZoom: {
              yAxisIndex: false
            },
            saveAsImage: {
              pixelRatio: 2
            },
            restore: {}
          }
        },
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 1,
            end: 100
          }
        ],
        xAxis: {
          type: 'category',
          data: ['电信', '移动', '联通', '铁通', '其他']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}条'
          },
          axisPointer: {
            snap: true
          }
        },
        series: [{
          type: 'bar',
          barWidth: 20,
          itemStyle: {
            normal: {
              color: '#01d1fd'
            }
          },
          data: data
        }]
      })

      window.addEventListener('resize', function () {
        chart.resize()
      })
    },
    drawBaseStation () {
      let chart = this.$echarts.init(this.$refs.baseStation)
      chart.setOption({
        title: {
          text: '伪基站展示',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          orient: 'horizontal',
          feature: {
            dataZoom: {
              yAxisIndex: false
            },
            saveAsImage: {
              pixelRatio: 2
            },
            restore: {}
          }
        },
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 1,
            end: 100
          }
        ],
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}条'
          },
          axisPointer: {
            snap: true
          }
        },
        series: [{
          type: 'bar'
        }],
        dataset: {
          dimensions: ['name', 'value'],
          source: []
        }

      })

      window.addEventListener('resize', function () {
        chart.resize()
      })
    },
    drawRubbish (data) {
      let myChart = this.$echarts.init(this.$refs.rubbish)
      var Color = ['#3b7186', '#2e8d94', '#637b69', '#789b6f',
        '#3b64a6', '#2672cc', '#503e8d', '#5d3ec5',
        '#874f5f', '#b6575c', '#623363', '#962e66'
      ]
      var option = {
        grid: {
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}: {c0}',
          backgroundColor: 'rgba(0,0,0,0.7)', // 背景
          padding: [8, 10], // 内边距
          extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', // 添加阴影
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'value',
          axisTick: {show: false},
          axisLine: {show: false},
          splitLine: {show: false},
          axisLabel: {show: false}
        },
        yAxis: {
          type: 'category',
          axisLine: {show: false},
          splitLine: {show: false},
          axisTick: {show: false},
          splitArea: {show: false},
          axisLabel: {
            inside: false,
            textStyle: {
              // color: '#fff',
              fontWeight: 'normal',
              fontSize: '12'
            },
            interval: 0
            // rotate: 20
          },
          data: data.type
        },
        series: [{
          name: '拦截类型拦截量统计',
          type: 'bar',
          itemStyle: {
            normal: {
              show: true,
              color: function (params) {
                var colorList = []
                for (var i = 11; i > 0; i--) {
                  colorList.push({
                    type: 'bar',
                    colorStops: [
                      {
                        offset: 0,
                        color: Color[i - 2] // 0% 处的颜色
                      }, {
                        offset: 1,
                        color: Color[i - 1] // 100% 处的颜色
                      }],
                    globalCoord: false // 缺省为 false
                  })
                }
                return colorList[params.dataIndex]
              },
              // barBorderRadius: 50,
              borderWidth: 0,
              borderColor: '#333',
              lineStyle: {
                width: 0.1
              }

            }
          },
          barGap: '0%',
          barCategoryGap: '50%',
          data: data.times
        }]
      }
      myChart.setOption(option)

      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    searchprovince () {
      let searchData = {starttime: '', endtime: '', mode: 'hour'}

      if (this.interceptionTime !== '') {
        searchData.starttime = dateToString(this.interceptionTime[0]).slice(0, 8)
        searchData.endtime = dateToString(this.interceptionTime[1]).slice(0, 8)
      }
      this.drawInterceptionChart(searchData)
    },
    searchprovinceClear () {
      let searchData = {starttime: '', endtime: '', mode: 'hour'}
      this.drawInterceptionChart(searchData)
    },
    searchSwindle () {
      let searchData = {starttime: '', endtime: ''}

      if (this.swindleTime !== '') {
        searchData.starttime = dateToString(this.swindleTime[0]).substr(0, 8)
        searchData.endtime = dateToString(this.swindleTime[1]).substr(0, 8)
      }
      this.axios.post('/dataStatistic/getcpIntercept', searchData).then(data => {
        if (data.code === 200) {
          this.drawSwindle(data.data)
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('数据请求失败')
      })
    },
    searchSwindleClear () {
      let searchData = {starttime: '', endtime: ''}
      this.axios.post('/dataStatistic/getcpIntercept', searchData).then(data => {
        if (data.code === 200) {
          this.drawSwindle(data.data)
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('数据请求失败')
      })
    },
    searchTopic () {
      let searchData = {starttime: '', endtime: ''}

      if (this.swindleTime !== '') {
        searchData.starttime = dateToString(this.swindleTime[0]).substr(0, 8)
        searchData.endtime = dateToString(this.swindleTime[1]).substr(0, 8)
      }
      this.axios.post('/dataStatistic/gettopicIntercept', searchData).then(data => {
        if (data.code === 200) {
          this.drawTopic(data.data)
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('数据请求失败')
      })
    },
    searchTopicClear () {
      let searchData = {starttime: '', endtime: ''}
      this.axios.post('/dataStatistic/gettopicIntercept', searchData).then(data => {
        if (data.code === 200) {
          this.drawTopic(data.data)
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('数据请求失败')
      })
    },
    searchRubbish () {
      let searchData = {starttime: '', endtime: ''}

      if (this.rubbishTime !== '') {
        searchData.starttime = dateToString(this.rubbishTime[0]).slice(0, 8)
        searchData.endtime = dateToString(this.rubbishTime[1]).slice(0, 8)
      }
      this.axios.post('/interStatis/getInterStatis', searchData).then(data => {
        if (data.code === 200) {
          this.drawRubbish(data.data)
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('数据请求失败')
      })
    },
    searchRubbishClear () {
      this.axios.get('/serviceDisplay/situation/lajiduanxin').then(data => {
        if (data.code === 200) {
          this.drawRubbish(data.data)
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('数据请求失败')
      })
    }

  }
}
</script>

<style scoped>
.row-col{
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 0.1em solid #C0C0C0;
}
.common-echart{
    flex:none;
    width:85%;
    height:85%;
}
.search-form{
  flex:auto;
  padding-top: 1em;
  padding-bottom: 1em;
  height: 10%;
  width: 85%;
}
</style>
