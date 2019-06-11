<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search"  style="margin-left:0.3rem">
      <Row>
        <Col span="8">
          <FormItem label="反制号码">
            <Input v-model="search.phoneNumber" placeholder="请输入反制号码" style="width:80%"></Input>
          </FormItem>
        </Col>
        <Col span="8" justify="start">
          <FormItem>
            <Button type="success"  icon="ios-search" class="searchBtn" @click="handlePage(1)">搜索</Button>
            <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider/>

    <!-- 表格区域 -->
    <Button  type="primary" icon="ios-add-circle-outline" style="margin-bottom: 10px;"
      @click="addModal = true">新增</Button>
    <Table border highlight-row :loading="loading" :columns="columns" :data="data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>

    <!-- 新增反制号码模块 -->
    <Modal
      v-model="addModal"
      title="新增分类"
      @on-ok="saveSingleData('add')"
      @on-cancel="cancel('add')"
      :loading="addLoading">
        <Form ref="add" :model="add" :label-width="100" :rules="addRule">
          <FormItem label="反制号码" prop="phoneNumber">
            <Input v-model="add.phoneNumber" placeholder="请输入反制号码"></Input>
          </FormItem>
          <FormItem label="反制原因" prop="reason">
            <Input v-model="add.reason" type="textarea" :rows="6" placeholder="请输入反制原因" ></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: {
        phoneNumber: ''
      },
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '反制号码',
          key: 'phoneNumber'
        }, {
          title: '反制原因',
          key: 'reason'
        }, {
          title: '入库时间',
          key: 'subTime',
          render: (h, params) => {
            let time = params.row.subTime
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
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.delete(params.row.streamNumber, params.row.phoneNumber)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginLeft: '10px'
                },
                on: {
                  click: () => {
                    this.dispose(params.row.phoneNumber)
                  }
                }
              }, '反制')
            ])
          }
        }
      ],
      loading: true,
      data: [],
      page: {
        total: 0,
        size: 10,
        current: 1
      },
      addModal: false,
      add: {
        phoneNumber: '',
        reason: ''
      },
      addLoading: true,
      addRule: {
        phoneNumber: [
          {
            required: true,
            message: '反制号码不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^1[3|4|5|8][0-9]\d{4,8}$/,
            message: '号码格式错误',
            trigger: 'blur'
          }
        ],
        reason: [
          {
            required: true,
            message: '加入反制原因不呢为空',
            trigger: 'blur'
          }
        ]
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
      this.axios.post('/swindledis/counterspell/0/10', {}).then((response) => {
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
      this.search.phoneNumber = ''
      this.page.size = 10
      this.init()
    },
    handleTime (time) {
      this.search.time = time
    },
    getSearchCondition () {
      return {
        'phoneNumber': this.search.phoneNumber
      }
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      page = page - 1
      this.axios.post('/swindledis/counterspell/' + page + '/' + this.page.size, this.getSearchCondition()).then((response) => {
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
      this.axios.post('/swindledis/counterspell/0/' + size, this.getSearchCondition()).then((response) => {
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
    delete (streamNumber, phoneNumber) { // 删除记录
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认删除反制号码[' + phoneNumber + ']？',
        okText: '确认删除',
        onOk: () => {
          this.axios.delete('/swindledis/counterspell/' + streamNumber).then((response) => {
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
    dispose (phoneNumber) { // 删除记录
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认反制[' + phoneNumber + ']？',
        okText: '确认反制',
        onOk: () => {
          this.axios.post('/swindledis/counterspell/notify', {'phoneNumber': phoneNumber, 'type': '2'}).then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('反制成功')
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
    saveSingleData (name) { // 保存新增短信分类
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.axios.post('/swindledis/counterspell/add', {
            'phoneNumber': this.add.phoneNumber,
            'reason': this.add.reason
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
