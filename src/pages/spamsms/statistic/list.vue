<template>
    <div>
        <Row>
            <Col span='24' class="row-col">
               <Form ref="searchForm" :label-width="80"  class="search-form" >
                     <FormItem label="时间段" prop="interceptionTime" :label-width="65">
                        <DatePicker type="datetimerange"  @on-ok='searchRubbish' @on-clear='searchRubbishClear' placeholder="请输入有害短信时间区间" v-model="rubbishTime" style="width: 50%"></DatePicker>
                    </FormItem>
                </Form>
                <div  ref='rubbish' class="common-echart"></div>
            </Col>
        </Row>
    </div>
</template>

<script>
import { dateToString } from '@/utils/timeFormat'
export default {
  data () {
    return {
      rubbishTime: ''
    }
  },
  mounted () {
    this.searchRubbishClear()
  },
  methods: {
    drawRubbish (data) {
      let chart = this.$echarts.init(this.$refs.rubbish)
      chart.setOption({
        title: {
          text: '有害短信',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            return `${params.name}<br/> ${params.data.value}(${params.percent}%)`
          }
        },
        legend: {
          orient: 'vertical',
          x: 'right'
        },
        series: [
          {
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%']
          }
        ],
        dataset: {
          dimensions: ['name', 'value'],
          source: data
        }
      })

      window.addEventListener('resize', function () {
        chart.resize()
      })
    },
    searchRubbish () {
      let searchData = {starttime: '', endtime: ''}

      if (this.rubbishTime !== '') {
        searchData.starttime = dateToString(this.rubbishTime[0])
        searchData.endtime = dateToString(this.rubbishTime[1])
      }
      this.axios.post('/serviceDisplay/situation/lajiduanxin', searchData).then(data => {
        if (data.code === 200) {
          this.drawRubbish(data.data)
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('数据请求失败')
      })
    },
    searchRubbishClear () {
      this.axios.get('/serviceDisplay/situation/lajiduanxin').then(data => {
        if (data.code === 200) {
          this.drawRubbish(data.data)
        } else {
          this.$Message.error('数据请求失败')
        }
      }).catch((res) => {
        this.$Message.error('数据请求失败')
      })
    }

  }
}
</script>

<style scoped>
.row-col{
    height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 0.1em solid #C0C0C0;
}
.common-echart{
    flex:none;
    width:85%;
    height:85%;
}
.search-form{
  flex:auto;
  padding-top: 1em;
  padding-bottom: 1em;
  height: 10%;
  width: 85%;
}
</style>
