<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="发案时间">
            <DatePicker type="datetimerange" :split-panels="true" style="width:85%"  format="yyyy-MM-dd HH:mm:ss" :editable="timeEditable"  placeholder="请选着加入时间"  v-model="search.time"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8" style="text-align: center;">
          <FormItem>
            <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="handlePage(1)">搜索</Button>
            <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleRest">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Divider/>
    <Table border highlight-row :loading="table.loading" :columns="table.columns" :data="table.data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"></Page>
    </div>
  </div>
</template>

<script>
import { dateToString } from '@/utils/timeFormat'
export default {
  data () {
    return {
      search: {
        time: ''
      },
      timeEditable: false,
      table: {
        loading: true,
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          }, {
            title: '受害用户号码',
            key: 'victimNumber'
          }, {
            title: '诈骗分子号码',
            key: 'suspectNumber'
          }, {
            title: '发案时间',
            key: 'caseDate',
            render: (h, params) => {
              return h(
                'span',
                `${params.row.caseDate.slice(0, 4)}-${params.row.caseDate.slice(4, 6)}-${params.row.caseDate.slice(6, 8)} 
                ${params.row.caseDate.slice(8, 10)}:${params.row.caseDate.slice(10, 12)}:${params.row.caseDate.slice(12, 14)}`
              )
            }
          }, {
            title: '触发预案名称',
            key: 'planname'
          }, {
            title: '处置方式',
            key: 'dealtype',
            render: (h, params) => {
              let state = params.row.dealtype
              let stateText
              if (state === '0') {
                stateText = '录音取证'
              } else if (state === '1') {
                stateText = '直接拦截'
              } else if (state === '2') {
                stateText = '短信提醒'
              } else {
                stateText = '-'
              }
              return h('span', stateText)
            }
          }
        ],
        data: []
      },
      page: {
        total: 0,
        current: 1,
        size: 10
      }
    }
  },
  mounted () {
    this.$Message.config({
      top: 200,
      duration: 3
    })

    this.list()
  },
  methods: {
    list () { // 查询列表数据
      this.table.loading = true
      let startTime = ''
      let endTime = ''

      if (this.search.time[0] !== '') {
        startTime = dateToString(this.search.time[0])
        endTime = dateToString(this.search.time[1])
      }

      this.axios.post('/analysis/list', {
        'criterion': {
          'endtime': endTime,
          'startTime': startTime
        },
        'mode': 'desc',
        'pageIndex': this.page.current,
        'pageSize': this.page.size,
        'sortKey': 'caseDate'
      }).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.table.data = data.list
          this.page.total = data.count
        } else {
          this.$Message.error(response.msg)
        }
        this.table.loading = false
      }).catch((e) => {
        this.table.loading = false
      })
    },
    handleRest () { // 重置查询条件
      this.search.time = ['', '']
      this.page.size = 10
      this.page.current = 1

      this.list()
    },
    handlePage (current) { // 查询或页码变动
      this.page.current = current

      this.list()
    },
    handleSize (size) { // 页大小变动
      this.page.size = size

      this.list()
    }
  }
}
</script>

<style lang="css" scoped>
@import "../../../../static/css/base.css"
</style>
