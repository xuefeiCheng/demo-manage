<template>
  <div class="data smallScreen noback">

    <div class="data-title2">
    </div>
    <div class="data-content2">
        <div class="all fl">
          <div class="info">
                <div class="info-title2">宾阳漫入号码</div>
                <img src="static/img/bj-1.png" alt="" class="bj-1">
                <img src="static/img/bj-2.png" alt="" class="bj-2">
                <img src="static/img/bj-3.png" alt="" class="bj-3">
                <img src="static/img/bj-4.png" alt="" class="bj-4">
                <!-- shuiyin -->
                <div class="des des_small">?</div>
                <div class="des_content_small">{{desContent}}</div>
                <div id="small_echarts_7"  class="info-concent info-list info-height">
                  <div class="inter_table" style="padding:0 5px">
              <div class="inter_table_header">
                <ul>
                  <li style="width:15%">运营商</li>
                  <li style="width:35%">时间</li>
                  <li style="width:25%">手机号码</li>
                  <li style="width:15%">归属地</li>
                </ul>
              </div>
                <div class="inter_table_body" style="height:80%">
                  <div :class="{anim: animate === true}">
                    <ul v-for="(item, index) in zpgldata" :key="index">
                      <li class="YELLOW" style="width:15%">{{item.domain}}</li>
                      <li style="width:35%">{{item.btime | formatNum2 }}</li>
                      <li class="YELLOW" style="width:25%" :title="item.callingnum">{{item.callingnum | formatNum6}}</li>
                      <li style="width:15%">{{item.city}}</li>
                    </ul>
                  </div>
                </div>
            </div>
              </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/utils/timeFormat.js'
export default {
  name: 'test',
  data () {
    return {
      desContent: '针对重点地区宾阳县的外省漫入号码进行实时监控。以表格方式展示运营商、时间、归属地等信息',
      zpgldata: [
        {
          id: '1',
          suspect_type: '',
          caseDate: '20181103121212',
          victimNumber: '136******12',
          victim_lac: ''
        }
      ],
      isLoop: true,
      animate: false,
      byIndex: 0
    }
  },
  mounted () {
    this.getcase()
    this.scrollvalid = setInterval(this.scroll, 3000)
    this.prointervalid = setInterval(this.getcase, 300000)
  },
  methods: {
    getcase () {
      this.axios.get('bigscreen/nolocalBinYang/' + this.byIndex)
        .then(
          (res) => {
            if (res.code === 200) {
              this.zpgldata = res.data
              if (this.zpgldata.length) {
                this.byIndex = this.zpgldata[this.zpgldata.length - 1].id
              }
            }
          })
    },
    scroll () {
      this.animate = true
      setTimeout(() => {
        this.zpgldata.push(this.zpgldata[0]) // 将数组的第一个元素添加到数组的
        this.zpgldata.shift() // 删除数组的第一个元素
        this.animate = false // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      }, 500)
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.scrollvalid)
    clearInterval(this.prointervalid)
  },
  filters: {
    formatDate (time) {
      return formatDate(time)
    },
    substr (value, length, str) {
      if (!value) return ''
      const le = value.length
      return value.substr(0, length) + (length < le ? str : '')
    },
    formatNum6 (value) {
      if (!value) return ''
      let le = value.length
      return value.substr(0, 3) + '******' + value.substring(8, le - 1)
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
    }
  }
}
</script>
<style>
#small_echarts_7 {
  height: 95% !important;
  overflow: hidden;
  padding-top: 7%;
}
</style>
