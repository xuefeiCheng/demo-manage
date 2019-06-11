<template>
  <div class="data noback">
    <Modal v-model="detailModal" footer-hide :closable="false" class="wjzModal detailModal" :width="1100" @on-cancel="closeModal">
        <p slot="header" style="width: 100%;position: relative;">
          <span>类别：{{modal.title}}</span>
          <span style="position: absolute;top:0;right:0;cursor: pointer;" @click="closeModal">关闭</span>
        </p>
        <Table height="400" :columns="columns" :data="tabledata"></Table>
      </Modal>
    <div class="data-title2"></div>
    <div class="data-content2">
        <div class="all fl">
                <div class="info">
                    <div class="info-title">有害短信</div>
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
      charts: '',
      detailModal: false, // 弹框初始状态
      modal: { // 弹框内部表格内容展示
        title: ''
      },
      columns: [
        {
          title: '发送方',
          key: 'name',
          width: 150
        },
        {
          title: '接收方',
          key: 'age',
          width: 150
        },
        {
          title: '发现时间',
          key: 'date',
          width: 120
        },
        {
          title: '短信内容',
          key: 'address'
        },
        {
          title: '命中关键词',
          key: 'keywords',
          width: 200
        }
      ],
      tabledata: [
        {
          name: '13768917188',
          age: '187****3971',
          address: '现在有笔款不方便以我名义办理，我想转到你卡里，你再帮我转过去给对方',
          date: '2018-10-03',
          keywords: '大奖、免费'
        },
        {
          name: '15007726028',
          age: '137****3971',
          address: '您好，您已成为爸爸去哪儿幸运观众 十万大奖还有一部iPhone等着您 免费领取 ，详情请加VX1008611',
          date: '2018-10-01',
          keywords: '佣金、回馈、盘'
        },
        {
          name: '13977499978',
          age: '147****3971',
          address: '【淘达人】亲，您的购物好评已超过99%，获得淘达人称号，加微信：app5572为您开通内部补贴资格每单额外返65%，验证码16 退定',
          date: '2018-10-02',
          keywords: '大促、原价、全店、点击'
        },
        {
          name: '13597148710',
          age: '187****3974',
          address: '您好，我是绿通道眼镜店34号营业员，我们现提供免费为您复检、免费调教眼镜、免费眼部按摩理疗，起到缓解眼疲劳、减缓度数加深，预约电话15',
          date: '2018-10-04',
          keywords: '特价、优惠、置业'
        },
        {
          name: '15177786280',
          age: '167****3471',
          address: '新口子拼业绩，审核放水，8000元额度，97%通过，1分钟放款，戳 t.cn/Evbrly9  取款，逾期自动取消。回T退订',
          date: '2018-10-03',
          keywords: '大奖、免费'
        },
        {
          name: '13878126073',
          age: '187****3958',
          address: '我刚在东方头条赚了15000金币，赶快回来试试吧！,     http://4b22668d.er.xdcfkh.cn/wakeup/hxte。',
          date: '2018-10-01',
          keywords: '商铺、首付、抵扣'
        },
        {
          name: '18276971807',
          age: '187****3971',
          address: '不是普惠，真的是现金！可提现！,     http://b660eeca.ui.yrwykp.cn/a378a192/7d/d087e861/c',
          date: '2018-10-02',
          keywords: '大奖、免费'
        }
      ]
    }
  },
  mounted () {
    this.drawMapByType()
  },
  methods: {
    drawMapByType () {
      let myChart = this.$echarts.init(document.getElementById('echarts_1'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          top: '5%',
          data: [],
          itemGap: 3,
          icon: 'circle',
          textStyle: {
            fontSize: 15,
            color: '#F1F1F3'
          }
        },
        color: ['#3AA7F9', '#F56C7C', '#FD9A36', '#EBE028', '#31CE65', '#20DACD', '#D671F5', '#F430E8', '#8A31FB'],
        series: [{
          name: '类型：',
          type: 'pie',
          radius: '60%',
          center: ['50%', '55%'],
          data: [],
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
      myChart.on('click', this.showDetail)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
      axios.get('bigscreen/getSpamsms')
        .then(
          (res) => {
            if (res.code === 200) {
              let data = res.data
              if (data.length === 0) {
                myChart.setOption({
                  legend: {
                    data: ['暂无数据']
                  },
                  series: [
                    {
                      data: [{name: '暂无数据', value: '0'}]
                    }
                  ]
                })
              } else {
                const legend = []
                res.data.forEach((obj, index, self) => {
                  legend.push(obj.name)
                })
                myChart.setOption({
                  legend: {
                    data: legend
                  },
                  series: [
                    {
                      data: data
                    }
                  ]
                })
              }
            } else {
              myChart.setOption({
                legend: {
                  data: ['暂无数据']
                },
                series: [
                  {
                    data: [{name: '暂无数据', value: '0'}]
                  }
                ]
              })
            }
          }
        )
      this.prointervalid = setInterval(() => {
        axios.get('bigscreen/getSpamsms')
          .then(
            (res) => {
              if (res.code === 200) {
                let data = res.data
                if (data.length === 0) {
                  myChart.setOption({
                    legend: {
                      data: ['暂无数据']
                    },
                    series: [
                      {
                        data: [{name: '暂无数据', value: '0'}]
                      }
                    ]
                  })
                } else {
                  const legend = []
                  res.data.forEach((obj, index, self) => {
                    legend.push(obj.name)
                  })
                  myChart.setOption({
                    legend: {
                      data: legend
                    },
                    series: [
                      {
                        data: data
                      }
                    ]
                  })
                }
              } else {
                myChart.setOption({
                  legend: {
                    data: ['暂无数据']
                  },
                  series: [
                    {
                      data: [{name: '暂无数据', value: '0'}]
                    }
                  ]
                })
              }
            }
          )
      }, 300000)
    },
    showDetail (param) { // 有害短信详情
      this.modal = {
        title: param.name
      }
      this.detailModal = true
    },
    closeModal () { // 关闭弹框
      this.detailModal = false
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.prointervalid)
  }
}
</script>

<style>
  .detailModal .ivu-table {color: #eee;background-color:#243769;}
  .detailModal .ivu-table-header{background-color: #18274e;}
  .detailModal .ivu-table-wrapper{border-color: #33415d;}
  .detailModal .ivu-table:before{background-color: #33415d;}
  .detailModal .ivu-table:after{background-color:#33415d;}
  .detailModal .ivu-table td,.detailModal .ivu-table th{
    background-color: transparent;
    border-bottom-color:#315982;
  }
  .detailModal tr.ivu-table-row-hover td {background-color: #315982;}
</style>
