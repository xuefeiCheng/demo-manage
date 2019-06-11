<template>
  <div class="data">

    <div class="data-title2">
    </div>
    <div class="data-content2">
        <div class="all fl">
                <div class="info">
                    <div class="info-title">垃圾短信</div>
                    <img src="static/img/bj-1.png" alt="" class="bj-1">
                    <img src="static/img/bj-2.png" alt="" class="bj-2">
                    <img src="static/img/bj-3.png" alt="" class="bj-3">
                    <img src="static/img/bj-4.png" alt="" class="bj-4">
                     <div class="info-concent charts" id="echarts_1"></div>
                </div>
        </div>
    </div>
  </div>
</template>
<script>
import 'echarts/lib/echarts'
import axios from 'axios'
export default {
  name: 'test',
  data () {
    return {
      charts: ''
    }
  },
  mounted () {
    this.drawPie()
  },
  methods: {
    drawPie () { // 垃圾短信
      let emyChart1 = this.$echarts.init(document.getElementById('echarts_1'))
      emyChart1.setOption({
        // legend: {
        // orient: 'vertical',
        //  x: 'right',
        //  y: 'center',
        //  data: ['诈骗', '运营商广告', '医疗美容保健', '骚扰', '赌黑', '电子电器', '餐饮娱乐休闲']
      //  },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // color: ['#528E95', '#D38265', ' #4682B4', ' #98C4B7', '#FFB980'],
        color: ['#D38265', '#B0B4DE', ' #BDB76B', '#FFB980', ' #98C4B7'],
        series: [
          {
            name: '垃圾短信',
            type: 'pie',
            radius: '65%',
            center: ['50%', '55%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                trigger: 'item',
                // position: 'inner',
                formatter: '{b}',
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 26
                }
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
    }
  }
}
</script>
