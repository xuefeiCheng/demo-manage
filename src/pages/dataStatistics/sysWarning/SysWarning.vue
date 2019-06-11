<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="监测时间">
            <DatePicker v-model="search.time" type="daterange" placement="bottom-end" :options="endTimeOptions"
              @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="监测类型">
            <Select v-model="search.type" style="width: 100%;" placeholder="请选择要查询的监测类型">
              <Option v-for="item in typeList" :value="item.key" :key="item.value">{{ item.value }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem>
            <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="handlePage(1)">搜索</Button>
            <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider/>

    <!-- 数据表格区域 -->
    <Table border highlight-row :loading="table.loading" :columns="table.columns" :data="table.data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"></Page>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      endTimeOptions: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      search: {
        time: ['', ''],
        type: ''
      },
      typeList: [
        {
          key: '1',
          value: '局点电话/传真拦截率监测'
        }, {
          key: '2',
          value: '局向电话/传真拦截率监测'
        }, {
          key: '3',
          value: 'PCM/CDR关联率监测'
        }, {
          key: '4',
          value: '统计项一致性监测 '
        }, {
          key: '5',
          value: '前后端数据比对'
        }
      ],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      table: {
        loading: true,
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          }, {
            title: '监测类型',
            key: 'monitorType',
            render: (h, params) => {
              let type = params.row.monitorType
              let typeText = '异常数据'

              for (let i = 0; i < this.typeList.length; i++) {
                if (this.typeList[i].key === type) {
                  typeText = this.typeList[i].value
                  break
                }
              }

              return h('span', typeText)
            }
          }, {
            title: '监测时间',
            key: 'monitorTime',
            render: (h, params) => {
              let time = params.row.monitorTime
              let formatTime = time

              if (time.length === 14) {
                formatTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) +
                  ' ' + time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12, 14)
              }

              return h('span', formatTime)
            }
          }, {
            title: '监测值',
            key: 'mvalue',
            render: (h, params) => {
              let res = params.row.mvalue
              if (res) {
                res = res * 100 + '%'
              } else {
                res = '暂无'
              }
              return h('span', res)
            }
          }, {
            title: '监测结果',
            key: 'monitorResult',
            render: (h, params) => {
              let result = params.row.monitorResult
              let resultText = '异常数据'

              if (result === '0') {
                resultText = '正常'
              } else if (result === '1') {
                resultText = '异常'
              } else if (result === '2') {
                resultText = '已修复'
              }

              return h('span', resultText)
            }
          },
          {
            title: '操作',
            key: 'operation',
            width: 150,
            align: 'center',
            render: (h, params) => {
              if (params.row.monitorResult === '1') {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.auditOK(params.row.id)
                      }

                    }
                  }, '修复')
                ])
              }
            }
          }
        ],
        data: []
      }
    }
  },
  mounted () {
    this.list()
  },
  methods: {
    list () {
      this.table.loading = true
      let current = this.page.current - 1
      let pageSize = this.page.size

      this.axios.post('/statistics/monitor/' + current + '/' + pageSize, this.getSearchCondition()).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.page.total = data.count
          this.table.data = data.list
        } else {
          this.$Message.error(response.msg)
        }

        this.table.loading = false
      }).catch((e) => {
        this.table.loading = false
      })
    },
    handlePage (current) {
      this.page.current = current

      this.list()
    },
    handleSize (size) {
      this.page.size = size

      this.list()
    },
    handleReset () {
      this.search.type = ''
      this.search.time = ['', '']
      this.page.size = 10
      this.page.current = 1

      this.list()
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
        'startTime': formatStart,
        'endTime': formatEnd,
        'type': this.search.type
      }
    },
    auditOK (id) {
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认修复该条记录？',
        okText: '确认修复',
        onOk: () => {
          this.axios.get('/statistics/monitor/restore/' + id).then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('操作成功')
              this.list()
            } else {
              this.$Message.error(response.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
@import "../../../../static/css/base.css"
</style>
