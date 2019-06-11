<template>
    <div>
        <Row>
            <Col span="12" class="row-col">
                  <Form ref="searchForm" :label-width="80"  class="search-form" >
                     <FormItem label="时间段" prop="interceptionTime" :label-width="65">
                        <DatePicker type="datetimerange" format="yyyy-MM-dd HH" @on-ok='getInterceptionData(1)' @on-clear='getInterceptionData(2)' placeholder="请输入拦截时间区间" v-model="interceptionTime" style="width: 90%"></DatePicker>
                    </FormItem>
                  </Form>
                <div   ref='interception' class="common-echart"></div>
            </Col>
            <Col span='12' class="row-col">
                  <Form ref="searchForm" :label-width="80"  class="search-form" >
                     <FormItem label="时间段" prop="interceptionTime" :label-width="65">
                        <DatePicker type="datetimerange"  @on-ok='searchSwindle()' @on-clear='searchSwindleClear()' placeholder="请输入诈骗电话时间区间" v-model="swindleTime" style="width: 90%"></DatePicker>
                    </FormItem>
                  </Form>
                <div  ref='swindle' class="common-echart"></div>
            </Col>
        </Row>
        <Row>
            <Col span="12" class="row-col">
              <Form ref="searchForm" :label-width="80"  class="search-form" >
                     <FormItem label="时间段" prop="interceptionTime" :label-width="65">
                        <DatePicker type="datetimerange" format="yyyy-MM-dd" @on-ok='getFakedPhoneData(1)' @on-clear='getFakedPhoneData(2)' placeholder="请输入拦截时间区间" v-model="fakedPhoneTime" style="width: 90%"></DatePicker>
                    </FormItem>
              </Form>
              <div  ref='fakedPhone' class="common-echart"></div>
            </Col>
            <Col span='12' class="row-col">
              <Form ref="searchForm"   class="search-form" >
                <Row>
                  <Col span="10">
                    <FormItem label="时间段" prop="interceptionTime" :label-width="65">
                          <DatePicker type="daterange" :split-panels="true" format="yyyy-MM-dd"  placeholder="请输入拦截时间区间" v-model="situationTime" style="width: 90%"></DatePicker>
                      </FormItem>
                  </Col>
                  <Col span="5">
                     <FormItem label="维度">
                        <Select v-model="dimension"  style="width:55%">
                            <Option value="callTimes" default>呼叫量</Option>
                            <Option value="answerTimes">应答量</Option>
                            <Option value="checkTimes">检出量</Option>
                            <Option value="interceptTimes">拦截量</Option>
                            <Option value="checkRadio">检出率</Option>
                            <Option value="interceptRadio">拦截率</Option>
                        </Select>
                   </FormItem>
                  </Col>

                <Col span ="9" justify="start" align="center">
                    <Button type="success" icon='ios-search'  @click="getSituationData()">搜索</Button>
                    <Button type="info"  icon="ios-refresh"  @click="handleReset">重置</Button>
                </Col>
              </Row>
              </Form>
              <div  ref='situationSta' class="common-echart"></div>
            </Col>
        </Row>
    </div>
</template>

<script>
import { dateToString } from '@/utils/timeFormat'
export default {
  data () {
    return {
      interceptionTime: ['', ''],
      swindleTime: ['', ''],
      fakedPhoneTime: ['', ''],
      situationTime: ['', ''],
      dimension: 'callTimes',
      allDate: {
        data1: [],
        data2: [],
        data3: [],
        data4: []
      }
    }
  },
  mounted () {
    this.getInterceptionData(1)
    this.getFakedPhoneData(1)
    this.searchSwindleClear()
    this.getSituationData()
  },
  methods: {
    searchInterception () {
      let searchData = {starttime: '', endtime: '', mode: 'hour'}
      if (this.interceptionTime[0] !== '') {
        searchData.starttime = dateToString(this.interceptionTime[0]).slice(0, 10)
        searchData.endtime = dateToString(this.interceptionTime[1]).slice(0, 10)
      }
      return searchData
    },
    getInterceptionData (type) {
      if (type === 2) {
        this.interceptionTime[0] = ''
        this.interceptionTime[1] = ''
      }
      this.axios.post('/serviceDisplay/situation/lanjie', this.searchInterception()).then(data => {
        if (data.code === 200) {
          data.data.forEach(element => {
            element.time = `${element.time.slice(0, 4)}-${element.time.slice(4, 6)}-${element.time.slice(6, 8)}/${element.time.slice(8, 10)}`
          })
          this.allDate.data1 = data.data
          this.drawInterceptionChart()
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('拦截量统计请求失败')
      })
    },
    drawInterceptionChart () {
      let chart = this.$echarts.init(this.$refs.interception)
      chart.setOption({
        title: {
          text: '拦截量统计',
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
          type: 'line'
        }],
        dataset: {
          dimensions: ['time', 'num'],
          source: this.allDate.data1
        }
      })
      window.addEventListener('resize', function () {
        chart.resize()
      })
    },
    searchSwindle () {
      let searchData = {starttime: '', endtime: ''}

      if (this.swindleTime[0] !== '') {
        searchData.starttime = dateToString(this.swindleTime[0])
        searchData.endtime = dateToString(this.swindleTime[1])
      }
      this.axios.post('/serviceDisplay/situation/zhapian', searchData).then(data => {
        if (data.code === 200) {
          this.allDate.data2 = data.data
          this.drawSwindle()
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('数据请求失败')
      })
    },
    searchSwindleClear () {
      this.axios.get('/serviceDisplay/situation/zhapian').then(data => {
        if (data.code === 200) {
          this.allDate.data2 = data.data
          this.drawSwindle()
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('数据请求失败')
      })
    },
    drawSwindle () {
      let chart = this.$echarts.init(this.$refs.swindle)
      chart.setOption({
        title: {
          text: '省份诈骗电话前10统计',
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
          source: this.allDate.data2
        }
      })

      window.addEventListener('resize', function () {
        chart.resize()
      })
    },
    getFakedTime () {
      let searchData = {startTime: '', endTime: '', interceptType: '16'}
      if (this.fakedPhoneTime[0] !== '') {
        searchData.startTime = dateToString(this.fakedPhoneTime[0]).slice(0, 8)
        searchData.endTime = dateToString(this.fakedPhoneTime[1]).slice(0, 8)
      }
      return searchData
    },
    getFakedPhoneData (type) {
      if (type === 2) {
        this.fakedPhoneTime[0] = ''
        this.fakedPhoneTime[1] = ''
      }
      this.axios.post('/serviceDisplay/situation/fakedPhone', this.getFakedTime()).then(data => {
        if (data.code === 200) {
          data.data.forEach(element => {
            element.date_statistics = `${element.date_statistics.slice(0, 4)}-${element.date_statistics.slice(4, 6)}-${element.date_statistics.slice(6, 8)}`
          })
          this.allDate.data3 = data.data
          this.drawFakePhoneChart()
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('拦截量统计请求失败')
      })
    },
    drawFakePhoneChart () {
      let chart = this.$echarts.init(this.$refs.fakedPhone)
      chart.setOption({
        title: {
          text: '仿冒号码统计图',
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
          type: 'line'
        }],
        dataset: {
          dimensions: ['date_statistics', 'intercept_times'],
          source: this.allDate.data3
        }
      })
      window.addEventListener('resize', function () {
        chart.resize()
      })
    },
    getSituationTime () {
      let searchData = {startTime: '', endTime: '', typeName: ''}

      if (this.situationTime[0] !== '') {
        searchData.startTime = dateToString(this.situationTime[0]).slice(0, 8)
        searchData.endTime = dateToString(this.situationTime[1]).slice(0, 8)
      } else {
        const date = new Date()
        const YY = date.getFullYear()
        const MM = date.getMonth() + 1
        const DD = date.getDate()
        searchData.startTime = `${YY}${MM}${DD}`
        searchData.endTime = `${YY}${MM}${DD}`
      }

      searchData.typeName = this.dimension
      return searchData
    },
    handleReset () {
      this.situationTime = ['', '']
      this.dimension = 'callTimes'
    },
    getSituationData () {
      this.axios.post('/serviceDisplay/situation/dpcStatistics', this.getSituationTime()).then(data => {
        if (data.code === 200) {
          let data4 = data.data.list
          let data4Template = []
          data4.forEach((item, index) => {
            data4Template[index] = {}
            data4Template[index].name = item.dpcName
            switch (this.dimension) {
              case 'callTimes':
                data4Template[index].value = item.callTimes
                break
              case 'answerTimes':
                data4Template[index].value = item.answerTimes
                break
              case 'checkTimes':
                data4Template[index].value = item.checkTimes
                break
              case 'interceptTimes':
                data4Template[index].value = item.interceptTimes
                break
              case 'checkRadio':
                data4Template[index].value = item.checkRadio * 100
                break
              case 'interceptRadio':
                data4Template[index].value = item.interceptRadio * 100
                break
            }
          })

          this.allDate.data4 = data4Template
          this.drawSituationChart()
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('数据请求失败')
      })
    },
    drawSituationChart () {
      let tipName = ''
      switch (this.dimension) {
        case 'callTimes':
          tipName = '条'
          break
        case 'answerTimes':
          tipName = '条'
          break
        case 'checkTimes':
          tipName = '条'
          break
        case 'interceptTimes':
          tipName = '条'
          break
        case 'checkRadio':
          tipName = '%'
          break
        case 'interceptRadio':
          tipName = '%'
          break
      }

      let chart = this.$echarts.init(this.$refs.situationSta)
      chart.setOption({
        title: {
          text: '入局情况统计图',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (datas) {
            var res = datas[0].value.name + '：' + datas[0].value.value + '' + tipName
            return res
          }
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
            formatter: '{value}' + tipName
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
          source: this.allDate.data4
        }
      })

      window.addEventListener('resize', function () {
        chart.resize()
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
