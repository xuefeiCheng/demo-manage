<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="诈骗号码">
            <Input v-model="search.phone" placeholder="请输入要查询的诈骗号码..."></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="时间">
            <DatePicker v-model="search.time" type="daterange" placement="bottom-end"
              @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8" style="text-align: center;">
          <FormItem>
            <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="handlePage(1)">搜索</Button>
            <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider/>

    <!-- 表格区域 -->
    <Table border highlight-row :loading="loading" :columns="columns" :data="data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: {
        phone: '',
        time: ['', '']
      },
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '诈骗号码',
          key: 'phoneNumber'
        }, {
          title: '呼叫特征',
          key: 'signValue'
        }, {
          title: '号码描述',
          key: 'susDesc'
        }, {
          title: '加入时间',
          key: 'bidTime',
          render: (h, params) => {
            return h('span', this.formatTime(params.row.bidTime))
          }
        }, {
          title: '操作',
          key: 'operation',
          width: 400,
          align: 'center',
          render: (h, params) => {
            let status = params.row.isblack
            let phone = params.row.phoneNumber
            if (status === '1') {
              return h('span', '已处置')
            } else {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.again(phone)
                    }
                  }
                }, '处置')
              ])
            }
          }
        }
      ],
      loading: true,
      data: [],
      page: {
        total: 0,
        size: 10,
        current: 1
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    formatTime (time) {
      let formatTime = time
      if (time.length === 14) {
        formatTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' +
          time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12)
      }
      return formatTime
    },
    init () { // 初始化列表
      this.page.current = 1
      this.loading = true
      this.axios.get('/cheatnumber').then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data.list
          this.page.total = data.count
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    handleReset () { // 重置查询条件
      this.search.phone = ''
      this.search.time = ['', '']
      this.page.size = 10
      this.init()
    },
    handleTime (time) {
      this.search.time = time
    },
    getSearchCondition () {
      let start = this.search.time[0]
      let formatStart = ''
      if (start.length === 10) {
        formatStart = start.substring(0, 4) + start.substring(5, 7) + start.substring(8, 10) + '000000'
      }
      let end = this.search.time[1]
      let formatEnd = ''
      if (end.length === 10) {
        formatEnd = end.substring(0, 4) + end.substring(5, 7) + end.substring(8, 10) + '235959'
      }

      return {
        'timeStart': formatStart,
        'timeEnd': formatEnd,
        'phone': this.search.phone
      }
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      page = page - 1
      this.axios.post('/cheatnumber/' + page + '/' + this.page.size, this.getSearchCondition()).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data.list
          this.page.total = data.count
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    again (phone) {
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认对号码[' + phone + ']处置？',
        okText: '确认',
        onOk: () => {
          this.axios.get('/cheatnumber/cheat/' + phone).then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('操作成功')
              this.init()
            } else {
              this.$Message.error(response.msg)
            }
          })
        }
      })
    },
    handleSize (size) { // 改变页大小
      this.loading = true
      this.page.size = size
      this.axios.post('/business/review/0/' + size, this.getSearchCondition()).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data.list
          this.page.total = data.count
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    initAuditData (params) {
      if (this.auditData.length < params.index + 1) { // 无值
        this.auditData.push({
          'id': params.row.streamnumber,
          'ps': '',
          'result': '',
          'audio': 0
        })
      }
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css"
</style>
