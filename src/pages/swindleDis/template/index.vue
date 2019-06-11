<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="模板名称">
            <Input v-model="search.name" placeholder="请输入要查询的模板名称..."></Input>
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

    <!-- 表格区域 -->
    <Button size="large" type="primary" icon="ios-add-circle-outline" style="margin-bottom: 10px;" @click="addModal = true">新增</Button>
    <Table border highlight-row :loading="table.loading" :columns="table.columns" :data="table.data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"></Page>
    </div>

    <!-- 新增模板区域 -->
    <Modal v-model="addModal" title="新增提醒模板" @on-ok="saveTemplate('add')" @on-cancel="cancel('add')" :loading="add.loading">
      <Form ref="add" :model="add.data" :label-width="100" :rules="addRules">
        <FormItem label="模板名称" prop="name">
          <Input v-model="add.data.name" placeholder="请输入模板名称..."></Input>
        </FormItem>
        <FormItem label="模板内容" prop="content">
          <Input type="textarea" :rows="3" v-model="add.data.content" placeholder="请输入模板内容..."></Input>
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
        name: ''
      },
      table: {
        loading: true,
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          }, {
            title: '模板名称',
            key: 'templateName'
          }, {
            title: '模板内容',
            key: 'templateContent'
          }, {
            title: '模板状态',
            key: 'templateState',
            render: (h, params) => {
              let state = params.row.templateState

              let stateText
              if (state === '0') {
                stateText = '待审'
              } else if (state === '1') {
                stateText = '通过'
              } else {
                stateText = '不通过'
              }

              return h('span', stateText)
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
                      this.delete(params.row.templateName)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        data: []
      },
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      addModal: false,
      add: {
        loading: true,
        data: {
          name: '',
          content: ''
        }
      },
      addRules: {
        name: [
          {
            required: true,
            message: '模板名称不能为空',
            trigger: 'blur'
          }, {
            validator: this.validateLength,
            max: 50,
            message: '模板名称不能超过50个字符',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '模板内容不能为空',
            trigger: 'blur'
          }, {
            validator: this.validateLength,
            max: 250,
            message: '模板内容不能超过250个字符',
            trigger: 'blur'
          }
        ]
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
      let current = this.page.current - 1
      let pageSize = this.page.size

      this.axios.get('/swindledis/template/' + current + '/' + pageSize, {params: this.search}).then((response) => {
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
      this.search.name = ''
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
    },
    saveTemplate (name) { // 保存提醒模板
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.axios.post('/swindledis/template', this.add.data).then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('新增成功')
              this.list()
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
    },
    delete (name) { // 根据模板名称删除模板
      let content = name
      if (content.length > 10) {
        content = content.substring(0, 10) + '...'
      }

      this.$Modal.confirm({
        title: '操作确认',
        content: '确认删除提醒模板[' + content + ']？',
        okText: '确认删除',
        onOk: () => {
          this.axios.delete('/swindledis/template/' + name).then((response) => {
            let code = response.code
            if (code === 200) {
              this.list()
            } else {
              this.$Message.error(response.msg)
            }
          })
        }
      })
    },
    changeLoading () { // 关闭加载状态
      this.add.loading = false

      this.$nextTick(() => {
        this.add.loading = true
      })
    },
    validateLength (rule, value, callback) { // 自定义校验规则：校验字符串长度(中文按两个字符计算)
      let err
      let maxLen = rule.max

      let len = 0
      for (var i = 0; i < value.length; i++) {
        len = len + ((value.charCodeAt(i) >= 0x4e00 && value.charCodeAt(i) <= 0x9fa5) ? 2 : 1)
      }
      if (len > maxLen) {
        err = '输入值不能超过' + maxLen + '个字符'
      }

      callback(err)
    }
  }
}
</script>

<style lang="css" scoped>
@import "../../../../static/css/base.css"
</style>
