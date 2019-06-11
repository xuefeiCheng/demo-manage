<template>
  <div class="data mapTab noback inter_mapTab inter_margin analysis">
      <!-- title 部分 -->
      <div class="border-self analysis_title">
          <div class="inter_title">{{title}}</div>
          <div class="des">
            ?
          </div>
          <div class="des_content">
            {{desContent}}
          </div>
          <div class="btn-rddq btn-base">切换来源：</div>
          <div class="btn-rddq btn-binyang">
            <Cascader v-model="value3" :data="data" filterable @on-change='getCity'></Cascader>
          </div>
      </div>
      <!-- 主体部分 -->
      <div class="analysis_content">
        <div style="flex:1" class="border-self">
            <div style="height:100%;position:relative">
              <div class="box_conent" style="height:94%">
                <div class="inter_table" style="height:100%">
                  <div class="inter_table_header" style="font-size:20px">
                    <ul>
                      <li style="width:10%">位置更新时间</li>
                      <li style="width:8%">手机号码</li>
                      <li style="width:10%">IMSI号码</li>
                      <li style="width:10%">IMEI号码</li>
                      <li style="width:8%">TMSI号码</li>
                      <li style="width:8%">目的位置区</li>
                      <li style="width:8%">目的小区</li>
                      <li style="width:6%">运营商</li>
                      <li style="width:10%">基站名称</li>
                      <li style="width:8%">漫游地</li>
                      <li style="width:5%">号码归属地</li>
                      <li style="width:5%">卡类型</li>
                    </ul>
                  </div>
                  <div class="inter_table_body">
                    <div :class="{anim: animate === true}">
                      <!-- :key="item.id" -->
                      <ul v-for="(item, index) in BYdata" :key="index" v-if="BYdata">
                        <li style="width:10%" class="YELLOW">{{item.btime | returnO}}</li>
                        <li style="width:8.1%" :title="item.callingnum">{{item.callingnum | formatNum2}}</li>
                        <li style="width:10.1%" class="YELLOW">{{item.callingimsi | returnO}}</li>
                        <li style="width:10.1%">{{item.callingimei | returnO}}</li>
                        <li style="width:8.2%" class="YELLOW">{{item.callingtmsi | returnO}}</li>
                        <li style="width:8.2%">{{item.dlac | returnO}}</li>
                        <li style="width:8.1%" class="YELLOW">{{item.dci | returnO}}</li>
                        <li style="width:6.2%">{{item.domain | returnO}}</li>
                        <li style="width:10.1%" class="YELLOW">{{item.psoname | returnO}}</li>
                        <li style="width:8.1%">{{item.dcity | returnO}}</li>
                        <li style="width:5%" class="YELLOW">{{item.city | returnO}}</li>
                        <li style="width:5%">{{item.cardtype | returnO}}</li>
                      </ul>
                      <ul v-if="!BYdata">
                        <li style="text-align:center;width:100%">暂无数据</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div class="inter_table" style="height:100%">
                  <div class="inter_table_body" style="font-size:20px;border:0;border-top: 1px dotted #00DAFC;">
                    <ul>
                      <li style="width:12%;color:green;">{{localtime}}</li>
                    </ul>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      desContent: '针对广西省以及重点地区宾阳县的外省漫入号码进行实时监控。以表格方式展示位置更新时间、手机号、IMSI号码、IMEI号码、TMSI号码、目的位置区、目的小区、运营商、基站名称、漫游地、归属地、卡类型等信息。',
      animate: false,
      transition: true,
      newData: [], // 记录新数据
      tableData: [],
      newBY: [], // 新数据
      BYdata: [], // 宾阳
      title: '外省漫入号码分析',
      scrollvalid: null,
      watch: null,
      byvaild: null,
      setTimer: null,
      localtime: '',
      search: {
        cityname: '',
        xianname: ''
      },
      byIndex: 0, // 宾阳id
      data: [
        {
          value: '',
          label: '全省'
        }, {
          value: '南宁市',
          label: '南宁市',
          children: [
            {
              value: '宾阳县',
              label: '宾阳县'
            }
          ]
        }, {
          value: '玉林市',
          label: '玉林市',
          children: [
            {
              value: '陆川县',
              label: '陆川县'
            }
          ]
        }, {
          value: '百色市',
          label: '百色市',
          children: [
            {
              value: '凌云县',
              label: '凌云县'
            }
          ]
        }
      ],
      value3: []
    }
  },
  filters: {
    substr: function (value, length, str) {
      if (!value) return ''
      const le = value.length
      return value.substr(0, length) + (length < le ? str : '')
    },
    timeFilter (time) {
      let res
      if (time.length === 12) {
        res = time.slice(0, 4) + '-' + time.slice(4, 6) + '-' + time.slice(6, 8) + ' ' + time.slice(8, 10) + ':' + time.slice(10, 12)
      } else if (time.length === 14) {
        res = time.slice(0, 4) + '-' + time.slice(4, 6) + '-' + time.slice(6, 8) + ' ' + time.slice(8, 10) + ':' + time.slice(10, 12) + ':' + time.slice(12, 14)
      }
      return res
    },
    formatNum6 (value) {
      if (!value) return ''
      let le = value.length
      let res
      if (value.length === 11) {
        res = value.substr(0, 3) + '******' + value.substring(8, le - 1)
      } else {
        res = value
      }
      return res
    },
    formatNum2 (value) {
      if (!value) return ''
      let le = value.length
      let res
      if (value.length === 11) {
        res = value.substr(0, 7) + '**' + value.substring(9, le - 1)
      } else {
        res = value
      }
      return res
    },
    returnO (value) {
      let res
      if (!value || value === '0') {
        res = '-'
      } else {
        res = value
      }
      return res
    }
  },
  mounted () {
    this.watch = setInterval(this.gettime, 1000)
    this.getBYdata()
    // this.scrollvalid = setInterval(this.scroll, 3000)
    // this.byvaild = setInterval(this.getBYdata, 2000)
  },
  methods: {
    // 数据表格 滚动 [新加]
    scroll () {
      this.animate = true
      if (this.tableData) {
        setTimeout(() => {
          this.tableData.push(this.tableData[0]) // 将数组的第一个元素添加到数组的
          this.tableData.shift() // 删除数组的第一个元素
          this.animate = false // margin-top 为0 的时候取消过渡动画，实现无缝滚动
        }, 500)
      }
    },
    getCity (value, selectedData) {
      // ['baise', 'lingyun'] 格式
      this.search.cityname = value[0]
      this.search.xianname = value[1] === undefined ? '' : value[1]
      clearInterval(this.byvaild)
      clearTimeout(this.setTimer)
      this.BYdata = []
      this.getBYdata()
    },
    searchHandle () {
      this.getBYdata()
      // this.byvaild = setInterval(this.getBYdata(), 2000)
    },
    getBYdata () {
      clearInterval(this.byvaild)
      this.byvaild = null
      this.axios.post('/bigscreen/nolocalByCity/' + this.byIndex, this.search).then((res) => {
      // this.axios.get('/bigscreen/nolocalBinYang/' + this.byIndex).then((res) => {
        if (res.code === 200) {
          if (res.data.length) {
            this.newBY = res.data
            if (this.newBY.length) {
              this.byIndex = this.newBY[this.newBY.length - 1].id
              for (let i = 0, le = this.newBY.length; i < le; i++) {
                this.animate = true
                this.BYdata.push(this.newBY[i]) // 将数组的第一个元素添加到数组的
                if (this.BYdata.length > 23) {
                  this.BYdata.shift() // 删除第一个元素
                }
                setTimeout(() => {
                  this.animate = false // margin-top 为0 的时候取消过渡动画，实现无缝滚动
                }, 500)
              }
            }
            this.byvaild = setInterval(this.getBYdata, 2000)
          } else {
            // 先清除 定时器 否则队列中累积进程触发
            clearTimeout(this.setTimer)
            this.setTimer = null
            // 若无数据 此次不变更
            this.setTimer = setTimeout(() => {
              clearInterval(this.byvaild)
              this.getBYdata()
            }, 2000)
          }
        }
      }).catch((error) => {
        console.log(error.config)
      })
    },
    gettime () {
      var today = new Date()
      var hh = today.getHours()
      if (hh < 10) hh = '0' + hh
      var mm = today.getMinutes()
      if (mm < 10) mm = '0' + mm
      var ss = today.getSeconds()
      if (ss < 10) ss = '0' + ss
      var str
      var yy = today.getYear()
      if (yy < 1900) yy = yy + 1900
      var MM = today.getMonth() + 1
      if (MM < 10) MM = '0' + MM
      var dd = today.getDate()
      if (dd < 10) dd = '0' + dd
      str = yy + '-' + MM + '-' + dd
      this.localtime = str + ' ' + hh + ':' + mm + ':' + ss
    }
  },
  beforeDestroy () {
    clearTimeout(this.setTimer)
    // 清除定时器
    clearInterval(this.scrollvalid)
    clearInterval(this.byvaild)
    clearInterval(this.watch)
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
  .btn-rddq {
    color: rgb(255, 255, 255);
    position: absolute;
    bottom: 2px;
    right: 210px;
    padding: 5px;
    border-radius: 5px;
    font-size: 16px;
    width: 200px;
    cursor: pointer;
  }
  .btn-base {
    border: 2px solid #155591;
    width: 100px;
    padding: 3px;
    bottom: 7px;
    background-color: #125c9c;
  }
  .btn-base:hover{
    background-color: #0089ff;
  }
  .btn-binyang {
    /* 级联按钮 */
    right: 5px;
  }
  .btn-active {
    background-color: #b5896e;
  }
</style>
<style>
.btn-rddq .ivu-cascader-label {
  color: #000;
}
</style>
