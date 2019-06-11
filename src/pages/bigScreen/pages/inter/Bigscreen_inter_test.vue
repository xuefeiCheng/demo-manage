<template>
<!-- 说明：  大屏分辨率 测试界面 -->
  <div class="data mapTab noback inter_mapTab inter_margin">
    <Modal v-model="baiduModal" footer-hide :closable="false" class="wjzModal interModal" :width='1100' @on-cancel="closeModal">
      <p slot="header" style="width: 100%;position: relative; font-size:16px">
        <span>{{mapTitle}}</span>
        <span style="position: absolute;top:0;right:0;cursor: pointer;" @click="closeModal">关闭</span>
      </p>
      <div id="BigMap" ref="BigMap" style="width:1090px; height:600px"></div>
    </Modal>
    <div class="inter_top_box">
      <div class="inter_top_boxL">
        <div class="inter_TBL_box_top">
          <div class="inter_TBL_box_top_item">
            <div class="box_title" style="font-size:12px;font-weight:bold;">僵尸木马事件总数</div>
            <div class="box_conent upColor"><span style="color:#00DAFC;font-size:22px;dispaly:inle-block;padding-right:5px" id="jmcount">{{jmcount}}</span></div>
          </div>
          <div class="inter_TBL_box_top_item">
            <div class="box_title" style="font-size:12px;font-weight:bold;">恶意程序事件总数</div>
            <div class="box_conent downColor"><span style="color:#00DAFC;font-size:22px;dispaly:inle-block;padding-right:5px" id="eycount">{{eycount}}</span></div>
          </div>
          <div class="inter_TBL_box_top_item">
            <div class="box_title" style="font-size:12px;font-weight:bold;">蠕虫事件总数</div>
            <div class="box_conent downColor"><span style="color:#00DAFC;font-size:22px;dispaly:inle-block;padding-right:5px" id="rccount">{{rccount}}</span></div>
          </div>
        </div>
        <div class="inter_TBL_box_bottom">
          <div class="box_title border-self">
            <span class="cicle"></span><span>受害事件实时播报</span>
          </div>
          <div class="box_conent border-self">
            <div class="inter_table">
              <div class="inter_table_header">
                <ul>
                  <li>手机号</li>
                  <li style="width:15%">运营商</li>
                  <li>事件</li>
                  <li style="width:35%">事件详情</li>
                  <li style="width:10%">时间</li>
                </ul>
              </div>
              <transition name="list" v-if="transition">
                <div class="inter_table_body" style="height:90%">
                  <div :class="{anim: animate === true}">
                    <ul v-for="(item, index) in tableData" :key="index">
                      <li :title='item.real_msisdn' class="YELLOW">{{item.real_msisdn | formatNum6}}</li>
                      <li>{{item.user_comcode}}</li>
                      <li class="YELLOW" style="width:15%">{{item.charac_subcategory}}</li>
                      <li :title='item.charac_category_detail' style="width:30%">{{item.charac_category_detail | substr(16,'...')}}</li>
                      <li :title='item.commit_time' class="YELLOW" style="width:18%">{{item.commit_time | substr(8,'')}}</li>
                    </ul>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <div class="border-self inter_top_boxM">
        <div class="inter_top_boxM_side">
          <div class="inter_box_absolute inter_box_absolute_l">
            <div class="box_title border-self">
              <span>僵木事件地域分布图</span>
            </div>
            <div class="box_conent border-self">
              <div id='GxMap' style="width:100%;height:100%"></div>
            </div>
          </div>
        </div>
        <div class="inter_top_boxM_m">
          <div id='worldMap' style="width:100%;height:100%"></div>
        </div>
        <div class="inter_top_boxM_side">
          <div class="inter_box_absolute  inter_box_absolute_r">
            <div class="box_title border-self">
              <span>区域分布周统计</span>
            </div>
            <div class="box_conent border-self">
              <div id='chinaMap' style="width:100%;height:100%"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="inter_top_boxR">
        <!-- <div class="inter_TBR_box border-self"> -->
          <Carousel autoplay :autoplay-speed="8000" radius-dot :arrow="setting_arrow" class="inter_TBR_box border-self">
            <CarouselItem>
              <div class="box_title border-self-bottom">
                <span class="cicle"></span><span>受害运营商占比（事件）</span>
              </div>
              <div class="box_conent">
                <div id='YunYs' style="width:100%;height:100%"></div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div class="box_title border-self-bottom">
                <span class="cicle"></span><span>受害运营商占比（用户）</span>
              </div>
              <div class="box_conent">
                <div id='YunYsLine' style="width:100%;height:100%"></div>
              </div>
            </CarouselItem>
          </Carousel>
        <!-- </div> -->
        <div class="inter_block"></div>
        <!-- <div class="inter_TBR_box  border-self">   -->
          <Carousel radius-dot autoplay :autoplay-speed="8000" :arrow="setting_arrow"  class="inter_TBR_box  border-self">
            <CarouselItem id="widtht">
              <div class="box_title border-self-bottom">
                <span class="cicle"></span><span>僵木蠕事件 TOP10</span>
              </div>
              <div class="box_conent">
                <div id="top10" style="width:100%;height:100%;"></div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div class="box_title border-self-bottom">
                <span class="cicle"></span><span>僵木蠕安全事件</span>
              </div>
              <div class="box_conent" id="safe">
                            <div class="inter_table">
              <div class="inter_table_header">
                <ul>
                  <li style="width:30%">源城市</li>
                  <li style="width:30%">分类</li>
                  <li style="width:36%">目的城市ip</li>
                </ul>
              </div>
              <transition name="list" v-if="transition">
                <div class="inter_table_body" style="height:80%">
                  <div :class="{anim: animate === true}">
                    <ul v-for="(item, index) in safeDate" :key="index">
                      <li style="width:30%">{{item.s_ip_city}}</li>
                      <li class="YELLOW" style="width:30%">{{item.primary_class}}</li>
                      <li style="width:36%">{{item.dst_ip}}</li>
                    </ul>
                  </div>
                </div>
              </transition>
            </div>
              </div>
            </CarouselItem>
          </Carousel>
        <!-- </div> -->
      </div>
    </div>
    <div style="height:3%"></div>
    <div class="border-self inter_bottom_box">
      <div class="inter_bottom_box_items">
        <div style="height:20px;line-height:20px;font-size: 16px;color: #F1F1F3;padding-left:10px;">危害行为周统计</div>
        <div id="bottom_1" style="width: 100%;height:calc(100% - 20px);"></div>
      </div>
      <div class="inter_bottom_box_items">
        <div style="height:20px;line-height:20px;font-size: 16px;color: #F1F1F3;padding-left:10px;">事件数变化趋势周统计</div>
        <div id="bottom_2" style="width: 100%;height:calc(100% - 20px);"></div>
      </div>
      <div class="inter_bottom_box_items">
        <div style="height:20px;line-height:20px;font-size: 16px;color: #F1F1F3;padding-left:10px;">事件用户数变化趋势周统计</div>
        <div id="bottom_3" style="width: 100%;height:calc(100% - 20px);"></div>
      </div>
      <div class="inter_bottom_box_items" style="position:relative">
        <!-- <div class="inter_bottom_box_items_title">移动恶意事件类型次数统计</div> -->
        <div style="height:20px;line-height:20px;font-size: 16px;color: #F1F1F3;padding-left:10px;">移动恶意事件类型次数统计</div>
        <div id="bottom_4" style="width: 100%;height:calc(100% - 20px);"></div>
      </div>
      <div class="inter_bottom_box_items" style="position:relative">
        <!-- <div class="inter_bottom_box_items_title">恶意程序八大类占比图</div> -->
        <div style="height:20px;line-height:20px;font-size: 16px;color: #F1F1F3;padding-left:10px;">恶意程序八大类占比图</div>
        <div id="bottom_5" style="width: 100%;height:calc(100% - 20px);"></div>
      </div>
      <div class="inter_bottom_box_items">
        <div style="height:20px;line-height:20px;font-size: 16px;color: #F1F1F3;padding-left:10px;">僵木蠕事件趋势图</div>
        <div id="bottom_6" style="width: 100%;height:calc(100% - 20px);"></div>
      </div>
    </div>
  </div>
</template>

<script>
import 'echarts/lib/echarts'
import 'echarts/map/js/china.js'
import 'echarts/map/js/world.js'
import 'echarts/map/js/province/guangxi.js'
import nameMap from '@/utils/nameMap.js'
import axios from 'axios'
import $ from 'jquery'

// 移动恶意事件类型次数统计
const LENDGE = ['信息窃取', '诱骗欺诈', '资费消耗', '流氓行为', '恶意扣费', '远程控制', '恶意传播']
const PIEDATA = [
  {
    value: 335,
    name: '信息窃取'
  },
  {
    value: 310,
    name: '诱骗欺诈'
  },
  {
    value: 234,
    name: '资费消耗'
  },
  {
    value: 135,
    name: '流氓行为'
  },
  {
    value: 1548,
    name: '恶意扣费'
  },
  {
    value: 1548,
    name: '远程控制'
  },
  {
    value: 1548,
    name: '恶意传播'
  }
]
export default {
  name: 'interMap',
  inject: ['reload'],
  data () {
    return {
      animate: false,
      setting_arrow: 'never',
      baiduModal: false,
      mapTitle: '标题',
      jmcount: 0,
      eycount: 0,
      rccount: 0,
      transition: true,
      tableData: [],
      safeDate: [],
      tableF: true,
      YunYsData: [], // 受害运营商周统计
      Ydmalice: [], // 移动恶意事件类型次数统计
      Malice: [], // 恶意程序8大类
      worlddate: [],
      transferData: []
    }
  },
  filters: {
    substr: function (value, length, str) {
      if (!value) return ''
      const le = value.length
      return value.substr(0, length) + (length < le ? str : '')
    },
    formatNum6 (value) {
      if (!value) return ''
      let le = value.length
      return value.substr(0, 3) + '******' + value.substring(8, le - 1)
    }
  },
  mounted () {
    this.systermdate() // 获得僵尸木马、恶意事件、蠕虫事件数量
    this.category() // 获得受害事件
    this.eventtread() // 事件变化趋势
    this.jmrtrend()
    this.weekarea()
    this.jmarea()
    this.weekcountry()
    // this.set()
    // 数据表格 数据变更效果 [新加]
    this.scrollvalid = setInterval(this.scroll, 3000)
    this.reloadvalid = setInterval(this.reload, 300000)
    this.$nextTick(() => {
      const WIDTH = document.getElementById('widtht').offsetWidth
      const main = document.getElementById('top10')
      const IPTOP10 = document.getElementById('safe')
      const YunYs = document.getElementById('YunYs')
      const YunYsLine = document.getElementById('YunYsLine')
      IPTOP10.style.width = main.style.width = YunYs.style.width = YunYsLine.style.width = WIDTH - 5 + 'px'
      this.eventtop()
      this.safeevent()
      this.getYunYsData() // 受害运营商周统计
    })
    this.drawBottom_1()
    this.getydmaliceCount()
    this.getmalice()
  },
  methods: {
    // 数据表格 滚动 [新加]
    scroll () {
      this.animate = true
      setTimeout(() => {
        this.safeDate.push(this.safeDate[0])
        this.safeDate.shift()
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
    // 事件变化趋势
    eventtread () {
      axios.get('interbigscreen/geteventtread')
        .then((res) => {
          if (res.code === 200) {
            let result = res.data
            this.drawBottom_23('bottom_2', '', result.date, result.dynum, result.wfnum)
            this.drawBottom_23('bottom_3', '', result.date, result.dyuser, result.wfuser)
          }
        })
    },
    jmrtrend () {
      axios.get('interbigscreen/getjmrtrend')
        .then((res) => {
          if (res.code === 200) {
            let result = res.data
            this.drawBottom_6(result.date, result.jsdata, result.rcdata, result.mmdata, result.name)
          }
        })
    },
    eventtop () {
      axios.get('interbigscreen/geteventtop')
        .then((res) => {
          if (res.code === 200) {
            let result = res.data
            this.drawTopByID('top10', result.city, result.num, {text: '僵木蠕事件top10'})
          }
        })
    },
    safeevent () {
      axios.get('interbigscreen/getsafeevent')
        .then((res) => {
          if (res.code === 200) {
            this.safeDate = res.data
          }
        })
    },
    // 获得僵尸木马、恶意事件、蠕虫事件数量
    systermdate () {
      axios.get('interbigscreen/gettrojanCount')
        .then((res) => {
          if (res.code === 200) {
            let alldata = res.data
            this.jmcount = alldata[0].num
            this.eycount = alldata[1].num
            this.rccount = alldata[2].num
          }
        })
    },
    category () { // 获得受害事件
      axios.get('interbigscreen/getcategory')
        .then((res) => {
          if (res.code === 200) {
            this.tableData = res.data
          }
        })
    },
    // 移动恶意事件类型次数统计
    getydmaliceCount () {
      axios.get('interbigscreen/getydmaliceCount')
        .then((res) => {
          if (res.code === 200) {
            this.Ydmalice = res.data
            this.drawMapByType('bottom_4', this.Ydmalice.legend, this.Ydmalice.data, '事件', '', {radius: ['35%', '55%'], center: ['50%', '60%']}, '事件总数', 'big')
          }
        })
    },
    // 恶意程序8大类
    getmalice () {
      axios.get('interbigscreen/getmalice')
        .then((res) => {
          if (res.code === 200) {
            this.Malice = res.data
            this.drawMapByType('bottom_5', this.Malice.legend, this.Malice.data, '事件', '', {radius: ['35%', '55%'], center: ['50%', '60%']}, '事件总数', 'big')
          }
        })
    },
    // 受害运营商周统计
    getYunYsData () {
      axios.get('interbigscreen/getweekcpCount')
        .then((res) => {
          if (res.code === 200) {
            this.YunYsData = res.data
            this.drawMapByType('YunYs', this.YunYsData.cpname, this.YunYsData.nums, '事件', '', {radius: '60%', center: ['40%', '60%']}, '', '')
            this.drawMapByType('YunYsLine', this.YunYsData.cpname, this.YunYsData.users, '用户', '', {radius: '60%', center: ['40%', '60%']}, '', '')
          }
        })
    },
    // 分布区域周统计
    weekarea () {
      axios.get('interbigscreen/getweekarea')
        .then((res) => {
          if (res.code === 200) {
            let chinadate = res.data
            // let arr = []
            // let max = 0
            // let min = 0
            let sum = 0
            chinadate.forEach((item) => {
              // arr.push(item.value)
              sum += Number(item.value)
            })
            // max = Math.max.apply(null, arr)
            // min = Math.min.apply(null, arr)
            let avg = sum / chinadate.length
            this.drawMapByArea('chinaMap', 'china', chinadate, {show: false, title: '', mapTitle: '区域分布周统计'}, avg, 'china')
          }
        })
    },
    // 分布区域周统计
    jmarea () {
      axios.get('interbigscreen/getjmarea')
        .then((res) => {
          if (res.code === 200) {
            let gxdate = res.data
            let sum = 0
            // let arr = []
            // let max = 0
            // let min = 0
            gxdate.forEach((item) => {
              sum += Number(item.value)
              // arr.push(item.value)
            })
            let avg = sum / gxdate.length
            // max = Math.max.apply(null, arr)
            // min = Math.min.apply(null, arr)
            this.drawMapByArea('GxMap', '广西', gxdate, {show: false, title: '', mapTitle: '僵尸木马事件地域分布图'}, avg, '广西')
          }
        })
    },
    // 诈骗源国家分布周统计
    weekcountry () {
      let charts = this.drawTransferMap('worldMap')

      let _this = this
      charts.on('click', function (params) {
        _this.mapTitle = '诈骗源国家分布周统计'
        _this.baiduModal = true
        _this.weekcountry('BigMap')
        _this.drawTransferMap('BigMap')
      })
    },
    convertData (data) {
      var res = []
      for (var i = 0; i < data.length; i++) {
        var dataItem = data[i]
        var fromCoord = [dataItem.s_longitude, dataItem.s_latitude]
        var toCoord = [dataItem.d_longitude, dataItem.d_latitude]
        if (fromCoord && toCoord) {
          res.push([
            {
              coord: fromCoord,
              s_city: dataItem.s_city
            }, {
              coord: toCoord,
              d_city: dataItem.d_city,
              num: dataItem.num
            }
          ])
        }
      }

      return res
    },
    drawBottom_23 (ID, title, date, dydata, wfdata) {
      var myChart = this.$echarts.init(document.getElementById(ID))
      var option = {
        // title: {
        //   text: title || '事件数变化趋势统计（周）',
        //   textStyle: {
        //     fontWeight: 'normal',
        //     fontSize: 14,
        //     color: '#F1F1F3'
        //   },
        //   top: 10,
        //   left: 10
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['钓鱼网址', '违法网址'],
          right: 'right',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
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
              color: '#fff',
              fontSize: 12
            },
            interval: 0,
            rotate: 15
          },
          data: date
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
            formatter: function (value, index) {
              let res
              if (value >= 10000) {
                res = value / 10000 + '万'
              } else {
                res = value
              }
              return res
            },
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '钓鱼网址',
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
          data: dydata,
          markPoint: {
            symbolSize: 30,
            data: [
              {type: 'min', name: '最小值'}
            ]
          }
        }, {
          name: '违法网址',
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
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)'
            }
          },
          data: wfdata,
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
    drawMapByType (ID, legend, data, name, title, position, text, titltStyle) {
      let horizontal
      if (ID === 'bottom_4' || ID === 'bottom_5') {
        horizontal = 'horizontal'
      }
      let myChart = this.$echarts.init(document.getElementById(ID))
      let privateTBig = {
        text: title,
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14,
          color: '#F1F1F3'
        },
        top: 10,
        left: 10
      }
      let option = {
        title: title !== '' ? privateTBig : '',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: horizontal || 'vertical',
          left: 'right',
          top: 0,
          data: legend || LENDGE,
          itemGap: 3,
          icon: 'circle',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        graphic: {
          type: 'text',
          // 这是四个相对于父元素的定位属性，每个属性可取『像素值』或者『百分比』或者 'center'/'middle'。
          // right: 10,
          // bottom: '10%',
          left: '35%', // 相对父元素居中
          top: '55%', // 相对父元素居中
          // 可设置颜色 字体等等
          style: {
            fill: 'white', // text颜色
            text: text || '',
            font: '14px Microsoft YaHei'
          }
        },
        color: ['#3AA7F9', '#F56C7C', '#FD9A36', '#EBE028', '#31CE65', '#20DACD', '#D671F5', '#F430E8', '#8A31FB'],
        series: [{
          name: name,
          type: 'pie',
          radius: position.radius,
          center: position.center,
          data: data || PIEDATA,
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
    },
    drawMapByArea (ID, Areaname, data, others, max, flag) {
      let _this = this
      let minigrateChart = this.$echarts.init(document.getElementById(ID))
      minigrateChart.clear()
      let MinigrateOption = {
        title: {
          show: others.show,
          text: others.title || '',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          top: 20,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            if (params.name !== '' && params.name != null) {
              return params.name + ': ' + params.value + '条'
            } else {
              return ''
            }
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: max || 5000,
          left: '3%',
          bottom: '7%',
          text: ['高', '低'],
          seriesIndex: 0,
          calculable: true,
          inRange: {
            color: ['#50a3ba', '#eac736', '#d94e5d']
          }
        },
        geo: {
          map: Areaname,
          label: {
            normal: {
              show: others.isShow || false, // 是否显示对应地名
              textStyle: {
                color: '#fff'
              }
            },
            emphasis: {
              show: false

            }
          },
          roam: true, // 是否开启鼠标缩放和平移漫游
          zoom: 1.2,
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
        series: [
          {
            name: '区域',
            type: 'map',
            geoIndex: 0,
            data: data
          }
        ]
      }
      minigrateChart.setOption(MinigrateOption)
      window.addEventListener('resize', function () {
        minigrateChart.resize()
      })
      minigrateChart.on('click', function (params) {
        _this.mapTitle = others.mapTitle
        if (flag) {
          if (flag === '广西') {
            _this.drawMapByArea('BigMap', '广西', data, {show: false, mapTitle: '僵尸木马事件地域分布图', symbolSize: 15, isShow: true}, max)
          } else if (flag === 'china') {
            _this.drawMapByArea('BigMap', 'china', data, {show: false, mapTitle: '区域分布周统计', symbolSize: 15, isShow: true}, max)
          }
        }
        setTimeout(() => {
          _this.baiduModal = true
        }, 20)
      })
    },
    closeModal () {
      this.baiduModal = false
      $('#BigMap').html('')
      $('#BigMap').removeAttr('_echarts_instance_')
      // const content = this.$refs.BigMap
    },
    drawBottom_6 (date, jsdata, rcdata, mmdata, name) {
      var myChart = this.$echarts.init(document.getElementById('bottom_6'))
      var option = {
        title: {
          text: '',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14,
            color: '#F1F1F3'
          },
          top: 10,
          left: 10
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: name,
          right: 'right',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
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
            interval: 0,
            rotate: 15
          },
          data: date
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
            formatter: function (value, index) {
              let res
              if (value >= 10000) {
                res = value / 10000 + '万'
              } else {
                res = value
              }
              return res
            },
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: name[0],
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          markPoint: {
            symbolSize: 30,
            data: [
              {type: 'min', name: '最小值'}
            ]
          },
          lineStyle: {
            normal: {
              width: 2
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12
            }
          },
          data: jsdata
        }, {
          name: name[1],
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          markPoint: {
            symbolSize: 30,
            data: [
              {type: 'min', name: '最小值'}
            ]
          },
          lineStyle: {
            normal: {
              width: 2
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219,50,51)',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          },
          data: rcdata
        }, {
          name: name[2],
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          markPoint: {
            symbolSize: 30,
            data: [
              {type: 'min', name: '最小值'}
            ]
          },
          lineStyle: {
            normal: {
              width: 2
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(58,167,249)',
              borderColor: 'rgba(58,167,249,0.2)',
              borderWidth: 12
            }
          },
          data: mmdata
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    drawBottom_1 () {
      var myChart = this.$echarts.init(document.getElementById('bottom_1'))
      // 指定图表的配置项和数据
      var option = {
        // backgroundColor: '#00265f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['事件数', '用户数'],
          align: 'left',
          top: 0,
          right: 'right',
          textStyle: {
            color: '#fff'
          },
          itemWidth: 10,
          itemHeight: 10
          // itemGap: 35
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: [],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#57617B',
              width: 1,
              type: 'solid'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            },
            // interval: 0,
            rotate: 15
          }
        }],
        yAxis: [{
          type: 'value',
          axisLabel: {
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
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [
          {
            name: '事件数',
            type: 'bar',
            data: [],
            barWidth: 10,
            barGap: 0,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#00da9c'
                }, {
                  offset: 1,
                  color: '#007a55'
                }]),
                opacity: 1
              }
            }
          },
          {
            name: '用户数',
            type: 'bar',
            data: [],
            barWidth: 10,
            barGap: 0,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#c4e300'
                }, {
                  offset: 1,
                  color: '#728400'
                }]),
                opacity: 1
              }
            }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      axios.get('interbigscreen/getweekharm')
        .then((res) => {
          if (res.code === 200) {
            let weekharm = res.data
            myChart.setOption({
              xAxis: {data: weekharm.name
              },
              series: [{
                data: weekharm.user
              }, {
                data: weekharm.num
              }
              ]
            })
          }
        })
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    drawTopByID (ID, citydata, numdata, others) {
      var myChart = this.$echarts.init(document.getElementById(ID))
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
              color: '#fff',
              fontWeight: 'normal',
              fontSize: '12'
            },
            interval: 0
            // rotate: 20
          },
          data: citydata
        },
        series: [{
          name: others.text,
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
              barBorderRadius: 50,
              borderWidth: 0,
              borderColor: '#333'
            }
          },
          barGap: '0%',
          barCategoryGap: '50%',
          data: numdata
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    drawTransferMap (id) {
      // 获取echarts画布
      let charts = this.$echarts.init(document.getElementById(id))

      // 初始化地图
      let options = {
        title: {
          show: true,
          text: '诈骗源国家分布周统计',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          top: 20,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            if (params.componentSubType === 'lines') {
              return params.data.s_city + '> ' + params.data.d_city + ' ' + params.data.num + '条'
            } else if (params.componentSubType === 'map') {
              if (params.name !== '' && params.name != null) {
                return params.name + ': ' + params.value + '条'
              } else {
                return ''
              }
            } else {
              return params.name
            }
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 10000,
          calculable: true,
          inRange: {
            color: ['#50a3ba', '#eac736', '#d94e5d']
          },
          textStyle: {
            color: '#000'
          }
        },
        geo: {
          map: 'world',
          label: {
            emphasis: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            }
          },
          roam: true,
          nameMap: nameMap,
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
              }
              /* shadowColor: 'rgba(50, 137, 215, .34)',
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 18 */
            },
            emphasis: {
              areaColor: '#389BB7',
              borderWidth: 0
            }
          }
        },
        series: this.transferData
      }

      charts.setOption(options)
      window.addEventListener('resize', function () {
        charts.resize()
      })

      if (this.transferData.length < 1) {
        let series = []

        // 获取热力图数据
        this.axios.get('interbigscreen/getweekcountry').then((res) => {
          let code = res.code
          if (code === 200) {
            series.push({
              name: '区域',
              type: 'map',
              map: 'world',
              geoIndex: 0,
              data: res.data
            })

            // 获取迁徙图数据
            this.axios.get('interbigscreen/getjmr').then((resp) => {
              let code = resp.code
              if (code === 200) {
                let data = resp.data
                series.push({
                  type: 'lines',
                  zlevel: 2,
                  effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: 'circle',
                    symbolSize: 16
                  },
                  lineStyle: {
                    normal: {
                      color: '#9ae5fc',
                      width: 1,
                      opacity: 0.4,
                      curveness: 0.2
                    }
                  },
                  data: this.convertData(data)
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
                      name: dataItem.s_city,
                      value: [dataItem.s_longitude, dataItem.s_latitude]
                    }
                  })
                },
                {
                  // 终点设置点
                  name: '广西',
                  type: 'effectScatter',
                  zlevel: 2,
                  coordinateSystem: 'geo',
                  rippleEffect: {
                    brushType: 'stroke'
                  },
                  symbolSize: 13,
                  itemStyle: {
                    normal: {
                      color: 'red'
                    }
                  },
                  data: [
                    {'name': '广西', 'value': [108.479, 23.1152, '广西']}
                  ]
                })

                charts.setOption({
                  series: series
                })
              } else {
                this.$Message.error(resp.msg)
              }
            })
          } else {
            this.$Message.error(res.msg)
          }
        })
      }

      return charts
    }
  },
  beforeDestroy () {
    clearInterval(this.scrollvalid)
    clearInterval(this.reloadvalid)
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
    /* animation: 20s rowup linear infinite normal; */
    transition: all 0.5s;
    position: relative;
  }
  .inter_mapTab .inter_table {
    height: 100%;
  }
</style>
