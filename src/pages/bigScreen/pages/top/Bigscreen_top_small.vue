<template>
  <div class="data noback smallScreen">

    <div class="data-title2">
    </div>
    <!-- shuiyin -->
    <div class="data-content2 data-content2-right">
        <div class="all fl">
          <div class="infom">
                 <div class="info-title2">号码拦截量TOP5</div>
                <img src="static/img/bj-1.png" alt="" class="bj-1">
                <img src="static/img/bj-2.png" alt="" class="bj-2">
                <img src="static/img/bj-3.png" alt="" class="bj-3">
                <img src="static/img/bj-4.png" alt="" class="bj-4">
                <div class="des des_small">?</div>
                <div class="des_content_small">{{desContent1}}</div>
                <div id="top_ljhm"  class="info-concent info-list">
                  <div class="infotel" v-for="item in disdata" :key="item.tel">
                    <p  class="telnum">{{item.name | formatNum6 }}</p>
                    <p class="telTime"><i class="telIcon"></i><span class="Timenum">{{item.value}}</span></p>
                  </div>
                  <div class="infotel" v-if="disdata.length === 0">
                    <p  class="telnum">暂无数据</p>
                  </div>
                </div>
          </div>
          <div class="infom">
                 <div class="info-title2">区域拦截量TOP5</div>
                <img src="static/img/bj-1.png" alt="" class="bj-1">
                <img src="static/img/bj-2.png" alt="" class="bj-2">
                <img src="static/img/bj-3.png" alt="" class="bj-3">
                <img src="static/img/bj-4.png" alt="" class="bj-4">
                <div class="des des_small">?</div>
                <div class="des_content_small">{{desContent2}}</div>
                <div id="top_ljsf"  class="info-concent info-list">
                  <div class="infotel" v-for="item in lastpdata" :key="item.province">
                    <p  class="telnum">{{item.name}}</p>
                    <p class="telTime"><i class="telIcon"></i><span class="Timenum">{{item.value}}</span></p>
                  </div>
                  <div class="infotel" v-if="lastpdata.length === 0">
                    <p  class="telnum">暂无数据</p>
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
  name: 'test',
  data () {
    return {
      desContent1: '显示当天拦截量前五的号码和对应的拦截量。以列表形式展示。',
      desContent2: '显示拦截量前五的省份和对应拦截量。以列表形式展示。',
      disdata: [],
      lastpdata: [],
      telintervalid: 0,
      prointervalid: 0
    }
  },
  mounted () {
    this.teltop()
    this.provincetop()
  },
  filters: {
    formatNum6 (value) {
      if (!value) return ''
      let le = value.length
      return value.substr(0, 3) + '******' + value.substring(8, le - 1)
    }
  },
  methods: {
    teltop () {
      axios.get('bigscreen/getPhonetop')
        .then(
          (res) => {
            if (res.code === 200) {
              this.disdata = res.data
            }
          })

      this.prointervalid = setInterval(() => {
        axios.get('bigscreen/getPhonetop')
          .then(
            (res) => {
              if (res.code === 200) {
                this.disdata = res.data
              }
            })
      }, 300000)
    },
    provincetop () {
      axios.get('bigscreen/getProvincetop')
        .then(
          (res) => {
            if (res.code === 200) {
              this.lastpdata = res.data
            }
          })

      this.prointervalid = setInterval(() => {
        axios.get('bigscreen/getProvincetop')
          .then(
            (res) => {
              if (res.code === 200) {
                this.lastpdata = res.data
              }
            })
      }, 300000)
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.telintervalid)
    clearInterval(this.prointervalid)
  }
}
</script>
