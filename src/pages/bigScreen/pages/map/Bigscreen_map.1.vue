<template>
  <div class="data mapTab noback inter_mapTab globalBigMap inter_margin">
    <Modal v-model="baiduModal" footer-hide :closable="false" class="wjzModal interModal" :width='1100' @on-cancel="closeModal">
      <p slot="header" style="width: 100%;position: relative; font-size:16px">
        <span>{{mapTitle}}</span>
        <span style="position: absolute;top:0;right:0;cursor: pointer;" @click="closeModal">关闭</span>
      </p>
      <div id="gxMap" ref="gxMap" style="width:1090px; height:600px"></div>
    </Modal>
    <div class="inter_top_box" style="justify-content:space-between">
      <div class="inter_top_boxL" style="flex:0 0 24%">
        <div class="inter_TBL_box_bottom border-self">
          <!-- <Carousel radius-dot :arrow="setting_arrow" autoplay :autoplay-speed="8000" class="inter_TBR_box  border-self">
            <CarouselItem> -->
              <div class="box_title border-self-bottom" style="position:relative">
                <span class="cicle"></span><span>话单详情</span>
                <div style="position:absolute;right:5px;top:8px;width:50%;height:65%;display:none;font-size:1.5vh;text-align:center;">
                  <div class="border-self bakhover" style="flex:1;" @click="gettableData('yesterday')" :class="{active: timeF === 'yesterday'}">昨日</div>
                  <div class="border-self bakhover" style="flex:1" @click="gettableData('today')" :class="{active: timeF === 'today'}">今日</div>
                  <div class="border-self bakhover" style="flex:1" @click="gettableData('lastmonth')" :class="{active: timeF === 'lastmonth'}">上月</div>
                  <div class="border-self bakhover" style="flex:1" @click="gettableData('currmonth')" :class="{active: timeF === 'currmonth'}">本月</div>
                </div>
              </div>
              <div class="box_conent">
            <div class="inter_table">
              <div class="inter_table_header">
                <ul>
                  <li style="text-align:center;width:25% !important">主叫号码</li>
                  <li style="text-align:center;width:25% !important">被叫号码</li>
                  <li style="text-align:center">呼叫开始时间</li>
                  <li style="text-align:center;width:20% !important">拦截原因</li>
                </ul>
              </div>
              <transition name="list" v-if="transition">
                <div class="inter_table_body" style="height:80%">
                  <div :class="{anim: animate === true}">
                    <ul v-for="(item, index) in tableData" :key="index">
                      <!-- <li :title='item.real_msisdn'>{{item.user_msisdn}}</li> -->
                      <li  style="text-align:center;width:25% !important" :title='item.callingnumber' class="BLUE">{{item.realcalling | formatNum6}}</li>
                      <li style="text-align:center;width:25% !important" :title='item.callednumber' class="ORANGE">{{item.realcalled | formatNum6}}</li>
                      <li :title='item.calltime' style="text-align:center">{{item.calltime| formatTime}}</li>
                      <li :title='item.reason' class="YELLOW" style="text-align:center;width:20% !important">{{item.reason | substr(0, 6,'')}}</li>
                    </ul>
                  </div>
                </div>
              </transition>
            </div>
          </div>
            <!-- </CarouselItem>
          </Carousel> -->
        </div>
      </div>
      <div class="inter_top_boxM">
        <div class="inter_TBL_box_top">
          <div class="inter_TBL_box_top_item">
            <div style="font-size:20px;color:#fff;padding:15px 0 10px 20px">总拦截量</div>
            <div style="font-size:25px;text-align:center;font-family:'timerFont'" class="OOFD7E" id="zljl">{{ljzj}}</div>
          </div>
          <div class="inter_TBL_box_top_item">
            <div style="font-size:20px;color:#fff;padding:15px 0 10px 20px">被骚扰号码</div>
            <div style="font-size:25px;text-align:center;font-family:'timerFont'" class="FFDE00" id="ztxl">{{txzj}}</div>
          </div>
          <div class="inter_TBL_box_top_item">
            <div style="font-size:20px;color:#fff;padding:15px 0 10px 20px">黑名单数量</div>
            <div style="font-size:25px;text-align:center;font-family:'timerFont'" class="OODAFC">{{blackcount}}</div>
          </div>
          <div class="inter_TBL_box_top_item">
            <div style="font-size:20px;color:#fff;padding:15px 0 10px 20px">公检法号码数量</div>
            <div style="font-size:25px;text-align:center;font-family:'timerFont'" class="OODAFC">{{checknumcount}}</div>
          </div>
          <div class="inter_TBL_box_top_item">
            <div style="font-size:20px;color:#fff;padding:15px 0 10px 20px">有害语音模板数量</div>
            <div style="font-size:25px;text-align:center;font-family:'timerFont'" class="OODAFC">{{voicecount}}</div>
          </div>
        </div>
        <div class="inter_top_boxM_m">
          <div id='map' style="width:100%;height:100%"></div>
        </div>
      </div>
      <div class="inter_top_boxR">
        <div class="inter_TBR_box  border-self">
          <div class="box_title border-self-bottom">
            <span class="cicle"></span><span>{{zpdate}}诈骗电话拦截量</span>
          </div>
          <div class="box_conent">
            <div id='echart_bar' style="width:100%;height:100%"></div>
          </div>
        </div>
        <div class="inter_block"></div>
        <div class="inter_TBR_box  border-self">
          <div class="box_title border-self-bottom">
            <span class="cicle"></span><span>诈骗量变化趋势周统计</span>
          </div>
          <div class="box_conent">
            <div id="echart_huan" style="width:100%;height:100%;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'echarts/lib/echarts'
import 'echarts/map/js/china.js'
import axios from 'axios'
import CountUp from '@/utils/CountUp'
import 'echarts/map/js/world.js'
import $ from 'jquery'
const geoCoordMap = {
  '上海': [121.4648, 31.2891],
  '广东': [113.8953, 22.901],
  '山西': [111.4783, 36.1615],
  '新疆': [85.9236, 40.5883],
  '河北': [115.0488, 39.0948],
  '甘肃': [103.5901, 36.3043],
  '内蒙古': [110.3467, 41.4899],
  '北京': [116.4551, 40.2539],
  '北海': [109.314, 21.6211],
  '江苏': [119.6062, 32.9208],
  '广西': [108.479, 23.1152],
  '江西': [116.0046, 28.6633],
  '福建': [118.1689, 24.6478],
  '合肥': [117.29, 32.0581],
  '陕西': [108.4131, 34.8706],
  '黑龙江': [127.9688, 47.368],
  '辽宁': [122.2229, 38.6409],
  '天津': [117.4219, 39.4189],
  '安徽': [117.0123, 32.2121],
  '四川': [103.9526, 30.7617],
  '西藏': [91.1865, 30.1465],
  '云南': [102.9199, 25.4663],
  '浙江': [120.5313, 29.1773],
  '湖南': [111.5327, 27.0319],
  '湖北': [112.3896, 30.6628],
  '山东': [117.1582, 36.8701],
  '海南': [110.3893, 19.8516],
  '青海': [96.8038, 36.2207],
  '贵州': [106.6992, 26.7682],
  '河南': [113.4668, 34.1234],
  '重庆': [107.7539, 30.1904],
  '宁夏': [106.3586, 36.8775],
  '吉林': [125.8154, 43.6584],
  '香港': [115.1215, 22.1235],
  '澳门': [112.1211, 22.2111],
  '台北': [120.1111, 23.2435]
}
export default {
  name: 'MapBak',
  data () {
    return {
      blackcount: 0, // 黑名单数量
      checknumcount: 0,
      voicecount: 0,
      animate: false,
      setting_arrow: 'never',
      baiduModal: false,
      mapTitle: '标题',
      timeF: 'currmonth', // 数据表格时间标识
      ljzj_old: 0, // 总拦截量
      txzj_old: 0, // 被骚扰号码
      ljzj: 0, // 拦截来电总数
      txzj: 0, // 被骚扰号码总数
      transition: true,
      tableData: [],
      cdrData: [],
      tableF: true, // 数据表格动画效果控制
      worlddate: [],
      actionindex: 0, // 定时切换的标识
      setmapIntervalid: 0,
      barintervalid: 0, // 堆积柱状图的定时任务
      settimeIntervalid: 0, // 时间的定时任务
      zpl: {
        time: [],
        data: []
      }, // 诈骗量变化趋势周统计
      ws: null, // WebSocket连接
      provincedata: [], // 中国地图热力图
      chinaMap: null,
      zpdate: '每日',
      zpdhintervalid: 0,
      hour: 0,
      alldata: [],
      alldate: [],
      zpdhindex: 2
    }
  },
  filters: {
    substr: function (value, start, length, str) {
      if (!value) return ''
      const le = value.length
      const st = start || 0
      return value.substr(st, length) + (length < le ? str : '')
    },
    formatTime (value) {
      if (!value) return ''
      const hour = value.substr(8, 2)
      const minute = value.substr(10, 2)
      const second = value.substr(12, 2)
      return hour + ':' + minute + ':' + second
    },
    formatNum6 (value) {
      if (!value) return ''
      let le = value.length
      return value.substr(0, 3) + '******' + value.substring(8, le - 1)
    }
  },
  created () {
    // 创建页面时开启建立WebSocket连接
    this.initWebSocket()
  },
  mounted () {
    this.init()
    this.getBlackdata()
    this.getCheckdata()
    this.getVoicedata()
    this.drawZPLine()
    this.getInterceptByTime()
    this.gettableData()
    this.getcdr()
    this.cdrintervalid = setInterval(() => {
      this.getcdr()
    }, 3600000)
    this.initintervalid = setInterval(() => {
      this.init()
    }, 3600000)
    this.intervalid = setInterval(() => {
      this.getRandomNum()
      this.changeNum()
    }, 60000) // 更改为1分钟跳一次
    // this.set()
    // 数据表格 数据变更效果 [新加]
    this.scrollvalid = setInterval(this.scroll, 3000)
    this.getProvinceIntercept()
  },
  methods: {
    // 初始数值，根据小时来算
    init () {
      // let mydate = new Date()
      // let newhour = mydate.getHours()
      // this.ljzj = newhour * 11000 + parseInt(1000 * Math.random())
      // this.txzj = newhour * 1000 + parseInt(100 * Math.random())
      // var zljl = new CountUp('zljl', this.ljzj_old, this.ljzj, 0, 3)
      // var ztxl = new CountUp('ztxl', this.txzj_old, this.txzj, 0, 3)
      // zljl.start()
      // ztxl.start()

      // 获得当天总的拦截量
      axios.get('bigscreen/todayInterceptcount')
        .then(
          (res) => {
            if (res.code === 200) {
              this.ljzj = res.data.intercepttimes
              this.txzj = res.data.phonetimes
              var zljl = new CountUp('zljl', this.ljzj_old, this.ljzj, 0, 3)
              var ztxl = new CountUp('ztxl', this.txzj_old, this.txzj, 0, 3)
              zljl.start()
              ztxl.start()
            }
          })
    },
    // 重置提醒或拦截总数
    changeNum () {
      var zljl = new CountUp('zljl', this.ljzj_old, this.ljzj, 0, 3)
      var ztxl = new CountUp('ztxl', this.txzj_old, this.txzj, 0, 3)
      zljl.start()
      ztxl.start()
    },
    // 生成随机提醒或拦截总数
    getRandomNum () {
      var ln = parseInt(50 * Math.random())// 生成0-50的随机数
      this.ljzj_old = this.ljzj
      this.ljzj = this.ljzj + ln
      var tn = parseInt(8 * Math.random())// 生成0-8的随机数
      this.txzj_old = this.txzj
      this.txzj = this.txzj + tn
    },
    getBlackdata () {
      axios.get('bigscreen/getblackCount')
        .then(
          (res) => {
            if (res.code === 200) {
              this.blackcount = res.data
            }
          })
    },
    getCheckdata () {
      axios.get('bigscreen/getcheckCount')
        .then(
          (res) => {
            if (res.code === 200) {
              this.checknumcount = res.data
            }
          })
    },
    getVoicedata () {
      axios.get('bigscreen/getvoiceCount')
        .then(
          (res) => {
            if (res.code === 200) {
              this.voicecount = res.data
            }
          })
    },
    // 生成运营商今天号码量柱状图的增量
    // getyysRandomNum () {
    //   let _this = this
    //   _this.yysData = []
    //   _this.yysoldData.forEach(function (c) {
    //     var ln = c + parseInt(3 * Math.random())// 生成0-3的随机数
    //     _this.yysData.push(ln)
    //   })
    //   _this.yysoldData = _this.yysData
    // },
    getInterceptByTime () {
      axios.get('bigscreen/getInterceptByTime')
        .then(
          (res) => {
            if (res.code === 200) {
              let data = res.data
              data.forEach((obj, index, self) => {
                this.zpl.time.push(obj.time.substr(4, 2) + '.' + obj.time.substr(6))
                this.zpl.data.push(obj.num)
              })
              this.drawLine()
            }
          })
    },
    drawZPLine () { // 每日诈骗电话拦截量
      let eChart3 = this.$echarts.init(document.getElementById('echart_bar'))
      // 绘制图表
      eChart3.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: '{a} <br/>{b}时 : {c}'
        },
        grid: {
          x: 45,
          y: 65,
          x2: 15,
          y2: 30
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
                color: '#fff'
                // fontSize: 20
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#fff'
                // fontSize: 20
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
              symbolSize: 30,
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
    },
    // 广西省最近一周诈骗量变化趋势
    drawLine () {
      var myChart = this.$echarts.init(document.getElementById('echart_huan'))
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            },
            interval: 0
            // rotate: 10
          },
          data: this.zpl.time
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff',
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
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
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '诈骗量',
          type: 'line',
          smooth: true,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)'
            }
          },
          data: this.zpl.data,
          markPoint: {
            symbolSize: 30,
            data: [
              {type: 'min', name: '最小值'}
            ]
          }
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    getProvinceIntercept () {
      axios.get('bigscreen/getProvinceIntercept')
        .then((res) => {
          if (res.code === 200) {
            this.provincedata = res.data
          }
        })
    },
    drawMap () { // 基于准备好的dom，初始化echarts实例
      // let _this = this
      // _this.changestate = 0
      let chinachart = document.getElementById('map')
      // chinachart.removeAttribute('_echarts_instance_')// 加上这句
      let minigrateChart = this.$echarts.init(chinachart)
      let MinigrateOption = {
        title: {
          show: false,
          text: '拦截号码',
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
          textStyle: {
            color: 'white',
            fontSize: 15
          },
          inRange: {
            color: ['#191970', '#6495ED', '#87CEFA']
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
                fontSize: 15
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
              areaColor: '#6495ED',
              borderColor: '#F5F5F5'
            },
            emphasis: {
              areaColor: '#389BB7'
            }
          }
        },
        // series: mapseries
        series: []
      }
      minigrateChart.setOption(MinigrateOption)
      window.addEventListener('resize', function () {
        minigrateChart.resize()
      })

      this.chinaMap = minigrateChart
    },
    chartClick (param) {
      if (param.name === '广西') {
        if (this.actionindex === 0) {
          this.mapTitle = '广西受骗用户地市分布图'
        } else {
          this.mapTitle = '广西施骗用户地市分布图'
        }
        this.baiduModal = true
        this.$nextTick(() => { this.drowgx() })
      }
    },
    drowgx () {
      let chart = document.getElementById('gxMap')
      let gxmyChart = this.$echarts.init(chart)
      let gxoption = {
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
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}'
        },
        visualMap: {
          min: 0,
          max: 1000,
          left: '3%',
          bottom: '7%',
          text: ['高', '低'],
          seriesIndex: 0,
          calculable: true,
          textStyle: {
            color: 'white',
            fontSize: 15
          },
          inRange: {
            color: ['#191970', '#6495ED', '#87CEFA']
          }
        },
        geo: {
          map: '广西',
          left: 'center',
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: '#fff',
                fontSize: 15
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
              areaColor: '#6495ED',
              borderColor: '#F5F5F5'
            },
            emphasis: {
              areaColor: '#389BB7'
            }
          }
        },
        series: []
      }
      gxmyChart.setOption(gxoption)
      if (this.actionindex === 0) {
        this.$store.dispatch('toGxData', gxmyChart)
      } else {
        this.$store.dispatch('fromGxData', gxmyChart)
      }
      window.addEventListener('resize', function () {
        gxmyChart.resize()
      })
    },
    getcdr () {
      axios.get('bigscreen/getCdr')
        .then(
          (res) => {
            if (res.code === 200) {
              this.cdrData['today'] = res.data.todaylist
              this.cdrData['yesterday'] = res.data.yestodaylist
              this.cdrData['currmonth'] = res.data.monthlist
              this.cdrData['lastmonth'] = res.data.pastmonthlist
              this.tableData = res.data.monthlist
            } else {
              this.tableData = []
            }
          })
    },
    // 获取数据表格 数据
    gettableData (time) {
      // 参数 time 请求数据
      // 返回数据 时间标识
      this.tableData = this.cdrData[time]
      // this.timeF = data.time
      // 暂时先 按照 click传递的参数 来定义 class
      this.timeF = time || 'currmonth'
    },
    // 数据表格 滚动 [新加]
    scroll () {
      this.animate = true
      setTimeout(() => {
        this.tableData.push(this.tableData[0]) // 将数组的第一个元素添加到数组的
        this.tableData.shift() // 删除数组的第一个元素
        this.animate = false // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      }, 500)
    },
    set () {
      setTimeout(() => {
        this.tableF = !this.tableF
      }, 1000)
    },
    closeModal () {
      this.baiduModal = false
      $('#gxMap').html('')
      $('#gxMap').removeAttr('_echarts_instance_')
      // const content = this.$refs.BigMap
    },
    initWebSocket () {
      if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket
      }

      if (window.WebSocket) {
        // 初始化WebSocket连接对象
        this.ws = new WebSocket(this.websocketURL + '/ws/map')

        let _this = this

        // 建立WebSocket连接成功时触发事件，并发送data消息获取数据
        this.ws.onopen = function () {
          console.log('WebSocket connection success')
          _this.ws.send('cdr')
          _this.drawMap()
        }

        // 接收服务端数据时触发事件
        this.ws.onmessage = function (event) {
          let data = JSON.parse(event.data)
          let convertData = ((data) => {
            let res = []
            for (let i = 0; i < data.length; i++) {
              let dataItem = data[i]

              let fromCoord = geoCoordMap[dataItem.fromProvince]
              let toCoord = geoCoordMap[dataItem.toProvince]
              if (fromCoord && toCoord) {
                res.push({
                  fromName: dataItem.fromProvince,
                  toName: dataItem.toProvince,
                  // numValue: dataItem[0].value,
                  coords: [fromCoord, toCoord]
                })
              }
            }
            return res
          })(data)

          let LineColor = ['#ff3333', 'orange', 'lime', 'aqua', '#9ae5fc']
          let mapseries = []
          mapseries.push(
            {
              name: '拦截来电总数',
              type: 'map',
              geoIndex: 0,
              data: _this.provincedata
            },
            {
            // 设置飞行线
            // name: item[1],
              type: 'lines',
              zlevel: 1,
              effect: {
                show: true,
                period: 6,
                trailLength: 1.7,
                color: '#fff',
                shadowBlur: 0,
                symbolSize: 0
              },
              lineStyle: {
                normal: {
                  color: function (params) {
                    return LineColor[params.dataIndex]
                  },
                  width: 1,
                  curveness: 0.2
                }
              },
              data: convertData
            }, // 设置轨迹线
            {
            // name: item[0],
              type: 'lines',
              zlevel: 2,
              effect: {
                show: true,
                period: 6,
                trailLength: 0,
                symbolSize: 10
              },
              lineStyle: {
                normal: {
                  color: function (params) {
                    return LineColor[params.dataIndex]
                  },
                  width: 0.2,
                  opacity: 0.4,
                  curveness: 0.2
                }
              },
              data: convertData
            },
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 2,
              rippleEffect: {
                brushType: 'stroke'
              },
              itemStyle: {
                normal: {
                  color: '#9ae5fc'
                }
              },
              data: data.map(function (dataItem) {
                return {
                  name: dataItem.fromPhone,
                  value: geoCoordMap[dataItem.fromProvince]
                }
              })
            },
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 2,
              rippleEffect: {
                brushType: 'stroke'
              },
              itemStyle: {
                normal: {
                  color: '#9ae5fc'
                }
              },
              data: data.map(function (dataItem) {
                return {
                  name: dataItem.toPhone,
                  value: geoCoordMap[dataItem.toProvince]
                }
              })
            }
          )

          _this.chinaMap.setOption({
            series: mapseries
          })
          /* data.forEach(function (item, i) {
            mapseries.push(
              {
                // 起点设置点
                name: item.fromProvince,
                type: 'effectScatter',
                zlevel: 2,
                coordinateSystem: 'geo',
                rippleEffect: {
                  brushType: 'stroke'
                },
                symbolSize: 10,
                itemStyle: {
                  normal: {
                    color: function (params) {
                      return LineColor[i]
                    }
                  }

                },
                data: [{
                  'value': geoCoordMap[item.fromProvince].concat([Math.random()]),
                  'name': item.fromProvince
                }]
              },
              {
                // 终点设置点
                name: item.toProvince,
                type: 'effectScatter',
                zlevel: 2,
                coordinateSystem: 'geo',
                rippleEffect: {
                  brushType: 'stroke'
                },
                symbolSize: 13,
                itemStyle: {
                  normal: {
                    color: function (params) {
                      return LineColor[i]
                    }
                  }

                },
                data: [{
                  'value': geoCoordMap[item.toProvince].concat([Math.random()]),
                  'name': item.toProvince
                }]
              })
          }) */
          // _this.drawMap(mapseries)
        }

        this.ws.onerror = function (event) {
          console.log('WebSocket connection failed')
          _this.$Message.error('WebSocket连接断开，将无法实时刷新')
          _this.ws.close()
        }

        this.ws.onclose = function (event) {
          console.log('WebSocket connection closed')
        }
      } else {
        this.$Message.error('该浏览器不支持实时刷新，请更换新版本浏览器！')
      }
    },
    destroyedWebSocket () {
      this.ws.close()
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.initintervalid)
    clearInterval(this.intervalid)
    clearInterval(this.scrollvalid)
    // clearInterval(this.setmapIntervalid)
    clearInterval(this.barintervalid)
    // clearInterval(this.yysintervalid)
    clearInterval(this.settimeIntervalid)
    clearInterval(this.cdrintervalid)
    clearInterval(this.zpdhintervalid)
  },
  destroyed: function () {
    // 销毁页面时关闭长连接
    this.destroyedWebSocket()
  }
}
</script>

<style scoped>
/** 插入过程 **/
  .list-enter-active{
    transition: all 1s;
  }
  /** 移除过程 **/
  .list-leave-active {
    transition: all 1s;
  }
  /*** 开始插入、移除结束的位置变化 ***/
  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
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
    /* animation: 20s rowup linear infinite normal; */
    transition: all 0.5s;
    position: relative;
  }
  /* 数据表格 字体 行间距 */
.inter_mapTab .inter_table .inter_table_body ul li{
  height:28px;
  line-height:28px;
  font-size: 14px;
}
</style>
