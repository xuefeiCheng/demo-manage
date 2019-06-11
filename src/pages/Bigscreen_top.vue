<template>
  <div class="data">

    <div class="data-title2">
    </div>
    <div class="data-content2">
        <div class="all fl">
          <div class="infom">
                 <div class="info-title2">号码拦截量top5</div>
                <img src="static/img/bj-1.png" alt="" class="bj-1">
                <img src="static/img/bj-2.png" alt="" class="bj-2">
                <img src="static/img/bj-3.png" alt="" class="bj-3">
                <img src="static/img/bj-4.png" alt="" class="bj-4">
                <div id="top_ljhm"  class="info-concent info-list">
                  <div class="infotel" v-for="item in disdata" :key="item.tel">
                    <p  class="telnum">{{item.tel}}</p>
                    <p class="telTime"><i class="telIcon"></i><span class="Timenum">{{item.num}}</span></p>
                  </div>
                </div>
          </div>
          <div class="infom">
                 <div class="info-title2">省份拦截量top5</div>
                <img src="static/img/bj-1.png" alt="" class="bj-1">
                <img src="static/img/bj-2.png" alt="" class="bj-2">
                <img src="static/img/bj-3.png" alt="" class="bj-3">
                <img src="static/img/bj-4.png" alt="" class="bj-4">
                <div id="top_ljsf"  class="info-concent info-list">
                  <div class="infotel" v-for="item in lastpdata" :key="item.province">
                    <p  class="telnum">{{item.province}}</p>
                    <p class="telTime"><i class="telIcon"></i><span class="Timenum">{{item.num}}</span></p>
                  </div>
                </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'test',
  data () {
    return {
      oldData: [
        {
          tel: '133344****4',
          num: '20180'
        },
        {
          tel: '1368782***1',
          num: '10501'
        },
        {
          tel: '1368782***2',
          num: '10200'
        },
        {
          tel: '1368782***3',
          num: '10000'
        },
        {
          tel: '1368782***4',
          num: '4000'
        }
      ],
      newData: [
        {
          tel: '1333444***5',
          num: '20018'
        },
        {
          tel: '1368782***6',
          num: '14000'
        },
        {
          tel: '1368782***7',
          num: '13400'
        },
        {
          tel: '1368782***8',
          num: '11400'
        },
        {
          tel: '1368782***9',
          num: '8000'
        }
      ],
      disdata: [],
      index: 0,
      lastpdata: [],
      telintervalid: 0,
      prointervalid: 0
    }
  },
  mounted () {
    this.teltop()
    this.provincetop()
  },
  methods: {
    teltop () {
      this.disdata = this.oldData
      this.telintervalid = setInterval(() => {
        if (this.index === 0) {
          this.disdata = this.newData
          this.index = 1
        } else {
          this.disdata = this.oldData
          this.index = 0
        }
      }, 10000)
    },
    provincetop () {
      let pnewData = [
        {
          province: '安徽',
          num: '3334'
        },
        {
          province: '北京',
          num: '2322'
        },
        {
          province: '福建',
          num: '1223'
        },
        {
          province: '广东',
          num: '553'
        },
        {
          province: '广西',
          num: '333'
        }
      ]
      let poldData = [
        {
          province: '上海',
          num: '2201'
        },
        {
          province: '河北',
          num: '2000'
        },
        {
          province: '福建',
          num: '1877'
        },
        {
          province: '广东',
          num: '1588'
        },
        {
          province: '广西',
          num: '1000'
        }
      ]
      this.lastpdata = poldData
      let pindex = 0
      this.prointervalid = setInterval(() => {
        if (pindex === 0) {
          this.lastpdata = pnewData
          pindex = 1
        } else {
          this.lastpdata = poldData
          pindex = 0
        }
      }, 60000)
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.telintervalid)
    clearInterval(this.prointervalid)
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  }

}
</script>
