<template>
  <div class="data smallScreen noback">

    <div class="data-title2">
    </div>
    <div class="data-content2">
        <div class="all fl">
          <div class="info">
                <div class="info-title2">诈骗事件关联</div>
                <img src="static/img/bj-1.png" alt="" class="bj-1">
                <img src="static/img/bj-2.png" alt="" class="bj-2">
                <img src="static/img/bj-3.png" alt="" class="bj-3">
                <img src="static/img/bj-4.png" alt="" class="bj-4">
                <!-- shuiyin -->
                <div id="small_echarts_7"  class="info-concent info-list info-height">
                  <div class="inter_table" style="padding:0 5px">
              <div class="inter_table_header">
                <ul>
                  <li style="width:12%;text-align:center">编号</li>
                  <li style="width:12%">类型</li>
                  <li style="width:23%">时间</li>
                  <li style="width:27%">号码</li>
                  <li style="width:20%">基站</li>
                </ul>
              </div>
                <div class="inter_table_body" style="height:80%">
                  <div :class="{anim: animate === true}">
                    <ul v-for="item in zpgldata" :key="item.id">
                      <li style="text-align:center;width:12%">{{item.id}}</li>
                      <li class="YELLOW" style="width:12%">{{item.suspect_type}}</li>
                      <li style="width:23%">{{item.caseDate | substr(8, '') }}</li>
                      <li class="YELLOW" style="width:27%;text-align:center">{{item.victimNumber | formatNum6}}</li>
                      <li style="width:20%">{{item.victim_lac}}</li>
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
      animate: false
    }
  },
  mounted () {
    this.getcase()
    this.scrollvalid = setInterval(this.scroll, 3000)
    this.prointervalid = setInterval(this.getcase, 300000)
  },
  methods: {
    getcase () {
      this.axios.get('bigscreen/getCase')
        .then(
          (res) => {
            if (res.code === 200) {
              this.zpgldata = res.data
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
