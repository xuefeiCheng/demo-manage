<template>
  <div class="data">

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
                <swiper :options="swiperOption">
                    <swiper-slide v-for="item in appData" :key="item.id">
                      <div class="box">
                        <div class="row_items">
                          <div class="row_item">
                            <div class="coner coner_topL"></div>
                            <div class="coner coner_topR"></div>
                            <div class="coner coner_bottomL"></div>
                            <div class="coner coner_bottomR"></div>
                            <div class="row_item_title">受害日期</div>
                            <div class="row_item_content FFDE00">{{item.case_date|formatDate}}</div>
                          </div>
                          <div class="row_item">
                            <div class="coner coner_topL"></div>
                            <div class="coner coner_topR"></div>
                            <div class="coner coner_bottomL"></div>
                            <div class="coner coner_bottomR"></div>
                            <div class="row_item_title">受害人号码</div>
                            <div class="row_item_content FFDE00">{{item.victim_number}}</div>
                          </div>
                          <div class="row_item">
                            <div class="coner coner_topL"></div>
                            <div class="coner coner_topR"></div>
                            <div class="coner coner_bottomL"></div>
                            <div class="coner coner_bottomR"></div>
                            <div class="row_item_title">损失金额</div>
                            <div class="row_item_content FF6316">{{item.loss_amount}}</div>
                          </div>
                          <div class="row_item">
                            <div class="coner coner_topL"></div>
                            <div class="coner coner_topR"></div>
                            <div class="coner coner_bottomL"></div>
                            <div class="coner coner_bottomR"></div>
                            <div class="row_item_title">通话记录数</div>
                            <div class="row_item_content FFDE00">{{item.call_num}}</div>
                          </div>
                          <div class="row_item">
                            <div class="coner coner_topL"></div>
                            <div class="coner coner_topR"></div>
                            <div class="coner coner_bottomL"></div>
                            <div class="coner coner_bottomR"></div>
                            <div class="row_item_title">短信记录数</div>
                            <div class="row_item_content FFDE00">{{item.sms_num}}</div>
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
                    </swiper-slide>
                </swiper>
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
      swiperOption: {// swiper3
        autoplay: 15000,
        speed: 1000,
        loop: true// 开启循环模式
      },
      appData: []
    }
  },
  mounted () {
    this.getcase()
  },
  methods: {
    getcase () {
      axios.get('bigscreen/getCase')
        .then(
          (res) => {
            if (res.code === 200) {
              this.appData = res.data
            }
          })
    }
  },
  filters: {
    formatDate (time) {
      return formatDate(time)
    }
  }
}
</script>
