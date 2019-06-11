<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="特征号码">
            <Input v-model="search.phone" placeholder="请输入要查询的特征号码..."></Input>
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
    <Button size="large" type="primary" icon="ios-add-circle-outline" style="margin-bottom: 10px" @click="addModal = true">新增</Button>
    <Table border highlight-row :loading="table.loading" :columns="table.columns" :data="table.data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"></Page>
    </div>

    <!-- 新增模板框 -->
    <!-- 新增模板区域 -->
    <Modal v-model="addModal" title="新增特征号码" @on-ok="save('add')" @on-cancel="cancel('add')" :loading="add.loading">
      <Form ref="add" :model="add.data" :label-width="100" :rules="addRules">
        <FormItem label="特征号码" prop="phone">
          <Input v-model="add.data.phone" placeholder="请输入特征号码..."></Input>
        </FormItem>
        <FormItem label="号码说明" prop="desc">
          <Input type="textarea" :rows="3" v-model="add.data.desc" placeholder="请输入特征号码说明..."></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import '../../../static/js/customValidate.js'

export default {
  data () {
    return {
      search: {
        phone: ''
      },
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
            title: '加入时间',
            key: 'createTime',
            render: (h, params) => {
              return h(
                'span',
                `${params.row.createTime.slice(0, 4)}-${params.row.createTime.slice(4, 6)}-${params.row.createTime.slice(6, 8)} 
                ${params.row.createTime.slice(8, 10)}:${params.row.createTime.slice(10, 12)}:${params.row.createTime.slice(12, 14)}
                `
              )
            }
          }, {
            title: '号码',
            key: 'phone'
          }, {
            title: '号码描述',
            key: 'phoneDesc'
          }, {
            title: '总通话时长',
            key: 'ans_sum'
          }, {
            title: '平均通话时长',
            key: 'ans_avg'
          }, {
            title: '平均通话时间间隔',
            key: 'avg_int_rel_type'
          }, {
            title: '联系号码短步长占比',
            key: 'dis_user_type'
          }, {
            title: '操作',
            key: 'operation',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.delete(params.row.phone)
                  }
                }
              }, '删除')
            }
          }
        ],
        data: []
      },
      addModal: false,
      add: {
        loading: true,
        data: {
          phone: null,
          desc: ''
        }
      },
      addRules: {
        phone: [
          {
            required: true,
            message: '号码不能为空',
            trigger: 'blur'
          }, {
            max: 21,
            message: '号码不能超过21位',
            trigger: 'blur'
          }
        ],
        desc: [
          {
            validator: this.validateLength,
            max: 200,
            message: '模板内容不能超过200个字符',
            trigger: 'blur'
          }
        ]
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

      this.axios.post('/strategy/features/' + current + '/' + pageSize, {'endtime': '', 'phone': this.search.phone, 'starttime': ''}).then((response) => {
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
      this.search.phone = ''
      this.page.size = 10
      this.page.current = 1

      this.list()
    },
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.axios.post('/strategy/features', this.add.data).then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('新增成功')

              this.addModal = false
              this.cancel(name)
              this.list()
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
    cancel (name) {
      this.$refs[name].resetFields()
    },
    changeLoading () {
      this.add.loading = false

      this.$nextTick(() => {
        this.add.loading = true
      })
    },
    delete (phone) {
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认删除特征号码[' + phone + ']？',
        okText: '确认',
        onOk: () => {
          this.axios.delete('/strategy/features/' + phone).then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('删除成功')

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
@import "../../../static/css/base.css"
</style>
