<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="监测结果">
            <Select v-model="search.state">
              <Option v-for="item in stateList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="监测时间">
            <DatePicker v-model="search.time" type="daterange" placement="bottom-end" :options="endTimeOptions"
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

    <!-- 审核模态框 -->
    <Modal v-model="stateModal" title="监测结果修改" @on-ok="auditOK('state')"  @on-cancel="auditCancel('state')"  :loading="state.loading">
        <Form ref="state" :model="state.data" :label-width="100">
          <FormItem label="监测结果" prop="state">
          <Select v-model="state.data.state" style="width: 100%;" placeholder="请选择监测结果">
            <Option v-for="item in state.stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        </Form>
    </Modal>

  </div>
</template>

<script>
export default {
  data () {
    return {
      stateList: [
        {
          value: '0',
          label: '正常'
        }, {
          value: '1',
          label: '异常'
        }, {
          value: '2',
          label: '已恢复'
        }
      ],
      stateModal: false,
      state: {
        loading: true,
        stateList: [
          {
            value: '1',
            label: '异常'
          }, {
            value: '2',
            label: '已恢复'
          }
        ],
        data: {
          name: '',
          state: 1,
          id: ''
        }
      },
      endTimeOptions: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      search: {
        state: '',
        time: ['', '']
      },
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '监测结果',
          key: 'monitorresult',
          render: (h, params) => {
            let result = params.row.monitorresult
            let stateList = this.stateList
            for (let i = 0; i < stateList.length; i++) {
              if (stateList[i].value === result) {
                result = stateList[i].label
                break
              }
            }
            return h('span', result)
          }
        }, {
          title: '监测时间',
          key: 'monitortime',
          render: (h, params) => {
            let time = params.row.monitortime
            let formatTime = time
            if (time.length === 14) {
              formatTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' +
                time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12)
            }
            return h('span', formatTime)
          }
        }, {
          title: '操作',
          key: 'operation',
          width: 150,
          align: 'center',
          render: (h, params) => {
            if (params.row.monitorresult === '1') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.stateModal = true
                      this.state.data.id = params.row.id
                    }

                  }
                }, '监测结果修改')
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
    init () { // 初始化列表
      this.page.current = 1
      this.loading = true
      this.axios.get('/dataSta/monitor').then((response) => {
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
      this.search.state = ''
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
        'state': this.search.state
      }
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      page = page - 1
      this.axios.post('/dataSta/monitor/' + page + '/' + this.page.size, this.getSearchCondition()).then((response) => {
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
    handleSize (size) { // 改变页大小
      this.loading = true
      this.page.size = size
      this.axios.post('/dataSta/monitor/0/' + size, this.getSearchCondition()).then((response) => {
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
    auditOK (name) {
      let id = this.state.data.id
      let state = this.state.data.state
      this.axios.get('/dataSta/monitor/' + id + '/' + state).then((resp) => {
        let code = resp.code
        if (code === 200) {
          this.$Message.success('修改成功')
          this.stateModal = false
          this.init()
        } else {
          this.$Message.error(resp.msg)
        }
      }).catch((e) => {
      })
    },
    auditCancel (name) {
      this.$refs[name].resetFields()
      this.state.data.id = ''
      this.state.data.state = 1
    },
    delete (id, classify) { // 删除记录
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认删除份分类[' + classify + ']？',
        okText: '确认删除',
        onOk: () => {
          this.axios.delete('/spamsms/classify/' + id).then((response) => {
            let code = response.code
            if (code === 200) {
              this.init()
            } else {
              this.$Message.error(response.msg)
            }
          })
        }
      })
    },
    changeLoading () { // 关闭加载状态
      this.addLoading = false
      this.$nextTick(() => {
        this.addLoading = true
      })
    },
    saveClassify (name) { // 保存新增短信分类
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.axios.post('/spamsms/classify', {
            'type': this.add.type,
            'classify': this.add.classify
          }).then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('新增成功')
              this.init()
              this.addModal = false
              this.cancel(name)
            } else {
              this.$Message.error(response.msg)
            }
            this.changeLoading()
          }).catch((e) => {
            this.changeLoading()
          })
        } else {
          this.changeLoading()
        }
      })
    },
    cancel (name) { // 取消新增
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style lang="css">
@import "../../../../static/css/base.css"
</style>
