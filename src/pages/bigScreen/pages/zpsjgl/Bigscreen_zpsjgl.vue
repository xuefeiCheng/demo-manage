<template>
  <div class="data noback">

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
                <div id="echarts_7"  class="info-concent info-list info-height">
                  <div class="inter_table" style="padding:0 5px;text-align:center">
              <div class="inter_table_header">
                <ul>
                  <li>编号</li>
                  <li>案件类型</li>
                  <li>案发时间</li>
                  <li>受害人号码</li>
                  <li>受害人所在基站</li>
                </ul>
              </div>
                <div class="inter_table_body" style="height:80%">
                  <div :class="{anim: animate === true}">
                    <ul v-for="item in zpsjDataBig" :key="item.id">
                      <li>{{item.id}}</li>
                      <li class="YELLOW">{{item.suspect_type}}</li>
                      <li>{{item.caseDate}}</li>
                      <li class="YELLOW">{{item.victimNumber}}</li>
                      <li>{{item.victim_lac}}</li>
                    </ul>
                  </div>
                </div>
            </div>
                <!-- <Carousel autoplay :autoplay-speed="8000" dots='none' arrow='never' :loop='isLoop'>
                    <CarouselItem v-for="item in appData" :key="item.id">
                      <div class="box">
                        <div class="row_items">
                          <div class="row_item">
                            <div class="coner coner_topL"></div>
                            <div class="coner coner_topR"></div>
                            <div class="coner coner_bottomL"></div>
                            <div class="coner coner_bottomR"></div>
                            <div class="row_item_title">受害日期</div>
                            <div class="row_item_content FFDE00">{{item.caseDate|formatDate}}</div>
                          </div>
                          <div class="row_item">
                            <div class="coner coner_topL"></div>
                            <div class="coner coner_topR"></div>
                            <div class="coner coner_bottomL"></div>
                            <div class="coner coner_bottomR"></div>
                            <div class="row_item_title">受害人号码</div>
                            <div class="row_item_content FFDE00">{{item.victimNumber}}</div>
                          </div>
                          <div class="row_item">
                            <div class="coner coner_topL"></div>
                            <div class="coner coner_topR"></div>
                            <div class="coner coner_bottomL"></div>
                            <div class="coner coner_bottomR"></div>
                            <div class="row_item_title">损失金额</div>
                            <div class="row_item_content FF6316">{{item.lossAmount}}</div>
                          </div>
                          <div class="row_item">
                            <div class="coner coner_topL"></div>
                            <div class="coner coner_topR"></div>
                            <div class="coner coner_bottomL"></div>
                            <div class="coner coner_bottomR"></div>
                            <div class="row_item_title">通话记录</div>
                            <div class="row_item_content FFDE00">{{item.callNum}}</div>
                          </div>
                          <div class="row_item">
                            <div class="coner coner_topL"></div>
                            <div class="coner coner_topR"></div>
                            <div class="coner coner_bottomL"></div>
                            <div class="coner coner_bottomR"></div>
                            <div class="row_item_title">短信记录</div>
                            <div class="row_item_content FFDE00">{{item.smsNum || 0}}</div>
                          </div>
                        </div>
                        <div class="row_describe">
                          <div class="coner coner_topL"></div>
                          <div class="coner coner_topR"></div>
                          <div class="coner coner_bottomL"></div>
                          <div class="coner coner_bottomR"></div>
                          <div class="row_describe_title">案件描述</div>
                          <div class="row_describe_content">{{item.description}}</div>
                        </div>
                      </div>
                    </CarouselItem>
                </Carousel> -->
              </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { formatDate } from '@/utils/timeFormat.js'
export default {
  name: 'test',
  data () {
    return {
      zpsjDataBig: [
        {
          id: '1',
          suspect_type: '',
          caseDate: '20181103121212',
          victimNumber: '1367726****',
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
      axios.get('bigscreen/getCase')
        .then(
          (res) => {
            if (res.code === 200) {
              this.zpsjDataBig = res.data
            }
          })
    },
    scroll () {
      this.animate = true
      setTimeout(() => {
        this.zpsjDataBig.push(this.zpsjDataBig[0]) // 将数组的第一个元素添加到数组的
        this.zpsjDataBig.shift() // 删除数组的第一个元素
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
    }
  }
}
</script>
<style scoped>
.inter_mapTab .inter_table {height: 100%;}
</style>
