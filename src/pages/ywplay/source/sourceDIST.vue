<template>
  <div class="div-border source">
    <Form :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="时间周期">
            <Select style="width: 100%;" placeholder="请选择要查询的时间周期" v-model="timeSelect">
              <Option v-for="item in timeType" :value="item.type" :key="item.type">{{ item.content }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem>
            <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="getLjValue()">搜索</Button>
            <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Divider class="marginTen"/>
    <Row>
      <Col span="24" class="row-col">
        <div ref="worldMap" class="conent-echart"></div>
      </Col>
    </Row>
  </div>
</template>
<script>
import 'echarts/lib/echarts'
import 'echarts/map/js/world.js'
import nameMap from '@/utils/nameMap.js'
export default {
  data () {
    return {
      data: [],
      visualMapMix: 10,
      timeSelect: 'month',
      timeType: [{
        type: 'day',
        content: '最近一天'
      },
      {
        type: 'week',
        content: '最近一周'
      },
      {
        type: 'month',
        content: '最近一月'
      }]
    }
  },
  mounted () {
    this.getLjValue()
  },
  methods: {
    handleReset () { // 重置
      this.timeSelect = 'month'
      this.getLjValue()
    },
    retrunValue () {
      return {
        'timeType': this.timeSelect
      }
    },
    getLjValue () { // 获取应答量 拦截量
      this.axios.post('/serviceDisplay/source/country', this.retrunValue()).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          const arr = []
          for (let k in data) {
            const obj = {
              'value': data[k].ljValue,
              'ljValue': data[k].ljValue,
              'name': k
            }
            arr.push(data[k].ljValue)
            this.data.push(obj)
          }
          // 最大值
          this.visualMapMix = arr.length === 0 ? 5 : Math.max.apply(null, arr)
          this.drawMap()
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    drawMap () {
      let Chart = this.$echarts.init(this.$refs.worldMap)
      Chart.setOption({
        title: {
          text: '来源分布展示',
          left: 'center',
          top: 'top'
        },
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);',
          textStyle: {
            color: '#333'
          },
          formatter: function (params) {
            let ljValue
            if (params.data) {
              ljValue = (params.data.ljValue)
            }
            ljValue = ljValue ? '<br>拦截量 : ' + ljValue : ''
            return params.name + ljValue
          }
        },
        visualMap: {
          min: 0,
          max: this.visualMapMix,
          // calculable: true,
          inRange: {
            color: ['#50a3ba', '#eac736', '#d94e5d']
          },
          textStyle: {
            color: '#000'
          }
        },
        series: {
          type: 'map',
          map: 'world',
          roam: true,
          data: this.data,
          nameMap: nameMap
        }
      })
      window.addEventListener('resize', function () {
        Chart.resize()
      })
    }
  }
}
</script>

<style scoped>
.source .marginTen{
  margin: 10px 0 !important;
}
.source .ivu-form-item{
  margin-bottom: 0 !important;
}
.source .row-col{
    height: 600px;
    width: 100%;
}
.source .conent-echart{
    width:96%;
    height:95%;
}
</style>
