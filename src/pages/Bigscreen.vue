<template>
   <div class="data">

    <div class="data-title">
        <div class="title-left fl"></div>
        <div class="title-center fl">重点区域防范信息展示</div>
        <div class="title-right fr"></div>
    </div>
    <div class="data-content">
        <div class="con-left fl">
            <div class="left-top">
                <div class="info">
                    <div class="info-title">垃圾短信</div>
                    <img src="static/img/bj-1.png" alt="" class="bj-1">
                    <img src="static/img/bj-2.png" alt="" class="bj-2">
                    <img src="static/img/bj-3.png" alt="" class="bj-3">
                    <img src="static/img/bj-4.png" alt="" class="bj-4">
                     <div class="info-concent charts" id="echarts_1"></div>
                </div>
            </div>
            <div class="left-top left-top-bottom">
                <div class="info">
                    <div class="info-title">伪基站</div>
                    <img src="static/img/bj-1.png" alt="" class="bj-1">
                    <img src="static/img/bj-2.png" alt="" class="bj-2">
                    <img src="static/img/bj-3.png" alt="" class="bj-3">
                    <img src="static/img/bj-4.png" alt="" class="bj-4">
                    <div id="echarts_2"  class="info-concent charts"></div>
                </div>
            </div>
        </div>
        <div class="con-center fl">
            <div class="cen-top" >
               <div class="info-concent concent100" id="map"></div>
            </div>
            <div class="cen-bottom">
              <div class="info-bg info-bottom-left">
              <img src="static/img/man.png" class="info-icon">
              <p class="info-note">黑名单数量</p>
              <p class="info-num">{{blackcount}}</p>
              </div>
              <div class="info-bg info-bottom-center">
              <img src="static/img/protect.png" class="info-icon">
              <p class="info-note">公检法号码数量</p>
              <p class="info-num info-color-yellow">{{checknumcount}}</p>
              </div>
              <div class="info-bg info-bottom-right">
              <img src="static/img/talk.png" class="info-icon">
              <p class="info-note">有害语音模板数量</p>
              <p class="info-num info-color-blue">{{voicecount}}</p>
              </div>
            </div>
        </div>
        <div class="con-right fr">
            <div class="right-top">
              <div class="info-title">诈骗电话</div>
                 <div class="title">{{zpdate}}诈骗电话量</div>
                <img src="static/img/bj-1.png" alt="" class="bj-1">
                <img src="static/img/bj-2.png" alt="" class="bj-2">
                <img src="static/img/bj-3.png" alt="" class="bj-3">
                <img src="static/img/bj-4.png" alt="" class="bj-4">
                <div id="echarts_3" class="info-concent charts"></div>
            </div>
            <div class="right-center">
                <div class="info-title">热门事件</div>
                <img src="static/img/bj-1.png" alt="" class="bj-1">
                <img src="static/img/bj-2.png" alt="" class="bj-2">
                <img src="static/img/bj-3.png" alt="" class="bj-3">
                <img src="static/img/bj-4.png" alt="" class="bj-4">
                <div id="echarts_4"  class="info-concent charts"></div>
            </div>
            <div class="right-bottom">
              <div class="info-title">诈骗事件关联</div>
                <img src="static/img/bj-1.png" alt="" class="bj-1">
                <img src="static/img/bj-2.png" alt="" class="bj-2">
                <img src="static/img/bj-3.png" alt="" class="bj-3">
                <img src="static/img/bj-4.png" alt="" class="bj-4">
                <div id="echarts_7"  class="info-concent" style="padding-top:25px;">
                     <swiper :options="swiperOption">
                    <swiper-slide v-for="item in appData" :key="item.id">
                      <div class="carousel_row carousel_rowsmall">
                        <div class="carousel_item carousel_titilesmall">受害日期：</div>
                        <div class="carousel_item carousel_contentsmall">{{item.date}}</div>
                      </div>
                      <div class="carousel_row carousel_rowsmall">
                        <div class="carousel_item carousel_titilesmall">受害人号码：</div>
                        <div class="carousel_item carousel_contentsmall">{{item.tel}}</div>
                      </div>
                      <div class="carousel_row carousel_rowsmall">
                        <div class="carousel_item carousel_titilesmall">损失金额：</div>
                        <div class="carousel_item carousel_contentsmall">{{item.amount}}</div>
                      </div>
                      <div class="carousel_row carousel_rowsmall carousel_rowInline">
                        <span class="carousel_titilesmall">案件描述：</span>
                        <span class="carousel_contentInline">{{item.casedesc | ellipsis}}</span>
                      </div>
                    </swiper-slide>
                </swiper>

                </div>
            </div>
        </div>
    </div>

</div>
</template>
<script>
import 'echarts/lib/echarts'
import 'echarts/map/js/china.js'
import 'echarts/map/js/province/guangxi.js'
import CountUp from '@/utils/CountUp'
import axios from 'axios'
export default {
  name: 'test',
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 50) {
        return value.slice(0, 50) + '...'
      }
      return value
    }
  },
  data () {
    return {
      charts: '',
      blackcount: 0,
      checknumcount: 0,
      voicecount: 0,
      ljzj_old: 0, // 拦截来电上次总数
      txzj_old: 0, // 拦截来电上次总数
      ljzj: 532656, // 拦截来电总数
      txzj: 236540, // 提醒来电总数
      actionindex: 0, // 定时切换的标识
      setIntervalid: 0,

      zpdhintervalid: 0, // zpdh定时器id
      zpdate: '每日',
      hour: 0,
      alldata: [],
      alldate: [],
      index: 2,

      swiperOption: {// swiper3
        autoplay: 5000,
        speed: 1000,
        loop: true// 开启循环模式
      },
      appData: [
        {
          id: 1,
          date: '2018/11/61',
          tel: '1368782****',
          amount: '4000',
          casedesc: '事主接到一名自称淘宝天猫客服女子的电话，对方称事主淘宝账户被官方误操作变为铂金会员每月会扣款，后对方转接到一名自称银行经理男子的电话，对方称如需取消会员需要按照对方说的操作，对方以检查流水为由让对方向指定账户转账，后事主通过手机银行向对方账户转账5000元，到账后对方挂断电话，事主反打无人接听，后事主向淘宝核实发现被骗'
        },
        {
          id: 2,
          date: '2018/11/62',
          tel: '1368782****',
          amount: '4000',
          casedesc: '事主接到一名自称淘宝天猫客服女子的电话，对方称事主淘宝账户被官方误操作变为铂金会员每月会扣款，后对方转接到一名自称银行经理男子的电话，对方称如需取消会员需要按照对方说的操作，对方以检查流水为由让对方向指定账户转账，后事主通过手机银行向对方账户转账5000元，到账后对方挂断电话，事主反打无人接听，后事主向淘宝核实发现被骗'
        },
        {
          id: 3,
          date: '2018/11/63',
          tel: '1368782****',
          amount: '4000',
          casedesc: '事主接到一名自称淘宝天猫客服女子的电话，对方称事主淘宝账户被官方误操作变为铂金会员每月会扣款，后对方转接到一名自称银行经理男子的电话，对方称如需取消会员需要按照对方说的操作，对方以检查流水为由让对方向指定账户转账，后事主通过手机银行向对方账户转账5000元，到账后对方挂断电话，事主反打无人接听，后事主向淘宝核实发现被骗'
        },
        {
          id: 4,
          date: '2018/11/64',
          tel: '1368782****',
          amount: '4000',
          casedesc: '事主接到一名自称淘宝天猫客服女子的电话，对方称事主淘宝账户被官方误操作变为铂金会员每月会扣款，后对方转接到一名自称银行经理男子的电话，对方称如需取消会员需要按照对方说的操作，对方以检查流水为由让对方向指定账户转账，后事主通过手机银行向对方账户转账5000元，到账后对方挂断电话，事主反打无人接听，后事主向淘宝核实发现被骗'
        }
      ]
    }
  },
  mounted () {
    this.drawPie()
    this.drawLine()
    this.drawTriangle()
    this.drawMap()
    this.getBlackdata()
    this.getCheckdata()
    this.getVoicedata()
    this.drawGuangxi()
    this.changeNum()
    this.intervalid = setInterval(() => {
      this.getRandomNum()
      this.changeNum()
    }, 8000)
  },
  methods: {
    // 重置提醒或拦截总数
    changeNum () {
      var zljl = new CountUp('zljl', this.ljzj_old, this.ljzj, 0, 3)
      var ztxl = new CountUp('ztxl', this.txzj_old, this.txzj, 0, 3)
      zljl.start()
      ztxl.start()
    },
    // 生成随机提醒或拦截总数
    getRandomNum () {
      var ln = parseInt(1000 * Math.random())// 生成0-999的随机数
      this.ljzj_old = this.ljzj
      this.ljzj = this.ljzj + ln
      var tn = parseInt(1000 * Math.random())// 生成0-999的随机数
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
    drawPie () { // 垃圾短信
      let emyChart1 = this.$echarts.init(document.getElementById('echarts_1'))
      emyChart1.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: [' #528E95', '#D38265', ' #4682B4', ' #98C4B7', '#FFB980'],
        series: [
          {
            name: '垃圾短信',
            type: 'pie',
            radius: '65%',
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                trigger: 'item',
                // position: 'inner',
                formatter: '{b}'
              }
            },
            data: []
          }
        ]
      })
      window.addEventListener('resize', function () {
        emyChart1.resize()
      })
      axios.get('bigscreen/getSpamsms')
        .then(
          (res) => {
            if (res.code === 200) {
              let data = res.data
              emyChart1.setOption({
                series: [
                  {
                    data: data
                  }
                ]
              })
            }
          })
    },
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
                color: '#fff'
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
            data: []
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
    },
    drawTriangle () { // 基于准备好的dom，初始化echarts实例
      let eChart4 = this.$echarts.init(document.getElementById('echarts_4'))
      // 绘制图表
      eChart4.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}'
        },
        color: ['#D53A35', ' #528E95', ' #D38265', ' #98C4B7', '#FFB980'],
        series: [
          {
            name: '热门事件',
            type: 'funnel',
            x: '10%',
            y: 40,
            y2: 10,
            width: '70%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending', // 'ascending', 'descending'
            gap: 4,
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1,
                label: {
                  show: true,
                  position: 'inside', // outside
                  formatter: '{b}:{c}',
                  textStyle: {
                    fontSize: 15,
                    color: '#fff'
                  }
                },
                labelLine: {
                  show: false,
                  length: 10,
                  lineStyle: {
                    width: 1,
                    type: 'solid'
                  }
                }
              },
              emphasis: {
                borderColor: 'red',
                borderWidth: 5,
                label: {
                  show: true,
                  formatter: '{b}:{c}',
                  textStyle: {
                    fontSize: 20
                  }
                },
                labelLine: {
                  show: true
                }
              }
            },
            data: []
          }
        ]
      })
      window.addEventListener('resize', function () {
        eChart4.resize()
      })
      axios.get('bigscreen/getTopic')
        .then(
          (res) => {
            if (res.code === 200) {
              let data = res.data
              eChart4.setOption({
                series: [
                  {
                    data: data
                  }
                ]
              })
            }
          })
    },
    drawMap () { // 基于准备好的dom，初始化echarts实例
      let _this = this
      let minigrateChart = this.$echarts.init(document.getElementById('map'))
      let MinigrateOption = {
        title: {
          // text: '拦截号码',
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
          left: '5%',
          bottom: '0%',
          text: ['高', '低'],
          seriesIndex: [0],
          calculable: true,
          textStyle: {
            color: 'white'
          },
          inRange: {
            color: ['#191970', '#6495ED', '#87CEFA']
          }
        },
        geo: {
          map: 'china',
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: '#fff'
              }
            },
            emphasis: {
              show: false
            }
          },
          roam: true, // 是否开启鼠标缩放和平移漫游
          zoom: 1,
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
      minigrateChart.setOption(MinigrateOption)

      _this.$store.dispatch('fetchHeatChinaRealData', minigrateChart)

      window.addEventListener('resize', function () {
        minigrateChart.resize()
      })
    },
    drawGuangxi () { // 基于准备好的dom，初始化echarts实例
      let minigrateChart = this.$echarts.init(document.getElementById('echarts_2'))
      let wjzdata = [
        {
          'value': [109.602146, 23.0936]
        },
        {
          'value': [110.299121, 25.274215]
        },
        {
          'value': [109.74664, 22.576275]
        },
        {
          'value': [109.17245, 25.03179]
        }
      ]
      let MinigrateOption = {
        geo: {
          map: '广西',
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: '#fff'
              }
            },
            emphasis: {
              show: false
            }
          },
          roam: true, // 是否开启鼠标缩放和平移漫游
          zoom: 1,
          itemStyle: {
            normal: {
              areaColor: '#191970',
              borderColor: '#F5F5F5'
            },
            emphasis: {
              areaColor: '#528E95'
            }
          }
        },
        series: [
          { name: '广西伪基站分布',
            type: 'effectScatter', // 配置显示方式为用户自定义
            symbolSize: 13,
            coordinateSystem: 'geo',
            itemStyle: {
              normal: {
                color: 'orange' }
            },
            data: wjzdata
          }
        ]
      }
      minigrateChart.setOption(MinigrateOption)
      window.addEventListener('resize', function () {
        minigrateChart.resize()
      })
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.intervalid)
    clearInterval(this.setIntervalid)
    // 清除定时器
    clearInterval(this.zpdhintervalid)
  }

}

</script>
<style scoped>
.data{
  overflow: hidden;
}
/* 左侧 */
/*.num_box_basic{
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 2;
  height: 80px;
  width: 230px;
  border-top: 1px dashed white;
  border-left: 1px dashed white;
  border-right: 1px dashed white;
}
.num_box{
  top: 100px;
  border-top: 0;
  border-bottom: 1px dashed white;
}*/
/* 居中对齐*/
.num_box_basic{
  position: absolute;
  left: 50%;
  margin-left: -230px;
  top: 5px;
  z-index: 2;
  height: 80px;
  width: 230px;
  border-top: 1px dashed white;
  border-left: 1px dashed white;
  border-right: 1px dashed white;
  border-bottom: 1px dashed white;
}
.num_box{
  margin-left: 0;
  border-left: 0;
}
.num_box_title{
  text-align: center;
}
.num_box_content{
  margin-left: 20px;
  height: 35px;
  line-height: 35px;
}
</style>
