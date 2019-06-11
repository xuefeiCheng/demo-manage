<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="任务名称">
            <Input v-model="search.name" placeholder="请输入要查询的任务名称..."></Input>
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
    <Modal v-model="addModal" title="新增提醒任务" @on-ok="saveTemplate('add')" @on-cancel="cancel('add')" :loading="add.loading">
      <Form ref="add" :model="add.data" :label-width="100" :rules="addRules">
        <FormItem label="任务名称" prop="name">
          <Input v-model="add.data.name" placeholder="请输入任务名称..."></Input>
        </FormItem>
        <FormItem label="模板名称" prop="template">
          <Select v-model="add.data.template" style="width: 100%;" placeholder="请选择模板">
            <Option v-for="item in templateList" :value="item.id" :key="item.templateName">{{ item.templateName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="运行商" prop="operator">
          <Select v-model="add.data.operator" style="width: 100%;" placeholder="请选择运营商">
            <Option v-for="item in operatorList" :value="item.id" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="号码文件" prop="file">
          <Upload :before-upload="handleUpload" ref="uploadBtn" action="" :accept="add.accept" :format="add.format">
            <Button icon="ios-cloud-upload-outline">请选择号码文件</Button>
            <span style="margin-left: 10px; color: red;">(每行一个号码的.txt文件)</span>
          </Upload>
          <div v-if="add.data.fileName !== null">已选中号码文件: {{ add.data.fileName }}</div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      startTimeOptions: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now()
        }
      },
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
            title: '任务名称',
            key: 'taskName'
          }, {
            title: '模板名称',
            key: 'templateId',
            render: (h, params) => {
              let id = params.row.templateId
              let name = ''

              let template = this.templateList
              for (let i = 0; i < template.length; i++) {
                if (template[i].id === id) {
                  name = template[i].templateName
                  break
                }
              }
              if (name === '') {
                name = '<span style="color: red;">该模板已删除</span>'
              }

              return h('span', {
                domProps: {
                  innerHTML: name
                }
              })
            }
          }, {
            title: '运营商',
            key: 'operator',
            render: (h, params) => {
              let operator = params.row.operator
              let operatorText

              for (let i = 0; i < this.operatorList.length; i++) {
                if (this.operatorList[i].id === operator) {
                  operatorText = this.operatorList[i].name
                  break
                }
              }

              return h('span', operatorText)
            }
          }, {
            title: '状态',
            key: 'state',
            render: (h, params) => {
              let state = params.row.state
              let stateText

              if (state === '1') {
                stateText = '待执行'
              } else if (state === '2') {
                stateText = '执行完成'
              } else {
                stateText = '执行失败'
              }

              return h('span', stateText)
            }
          }, {
            title: '总数量',
            key: 'total'
          }, {
            title: '任务创建时间',
            key: 'createTime',
            render: (h, params) => {
              let time = params.row.createTime
              let formatTime = time

              if (time.length === 14) {
                formatTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' +
                  time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12)
              }

              return h('span', formatTime)
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
      operatorList: [
        {
          id: '1',
          name: '中国移动'
        }, {
          id: '2',
          name: '中国联通'
        }, {
          id: '3',
          name: '中国电信'
        }
      ],
      templateList: [],
      addModal: false,
      add: {
        loading: true,
        appept: '.txt',
        format: ['.txt'],
        data: {
          name: '',
          channel: '',
          template: '',
          mode: '',
          time: '',
          file: null,
          fileName: null
        }
      },
      addRules: {
        name: [
          {
            required: true,
            message: '任务名称不能为空',
            trigger: 'blur'
          }, {
            validator: this.validateLength,
            max: 50,
            message: '任务名称不能超过50个字符',
            trigger: 'blur'
          }
        ],
        operator: [
          {
            required: true,
            message: '请选择运营商',
            trigger: 'change'
          }
        ],
        template: [
          {
            type: 'number',
            required: true,
            message: '请选择模板',
            trigger: 'change'
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

      this.axios.get('/swindledis/remind/' + current + '/' + pageSize, {params: this.search}).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.templateList = data.template
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
          if (this.add.data.file == null) {
            this.changeLoading()
            this.$Message.error('请选择号码文件')
          } else {
            let formData = new FormData()
            formData.append('name', this.add.data.name)
            formData.append('operator', this.add.data.operator)
            formData.append('template', this.add.data.template)
            formData.append('file', this.add.data.file)

            this.axios.post('/swindledis/remind', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then((response) => {
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
          }
        } else {
          this.changeLoading()
        }
      })
    },
    cancel (name) { // 取消新增
      this.add.data.fileName = null
      this.add.data.file = null
      this.$refs[name].resetFields()
    },
    changeLoading () { // 关闭加载状态
      this.add.loading = false

      this.$nextTick(() => {
        this.add.loading = true
      })
    },
    handleUpload (file) {
      this.add.data.file = file
      this.add.data.fileName = file.name

      return false
    },
    handleTime (time) {
      let formatTime = time
      if (time.length === 16) {
        formatTime = time.substring(0, 4) + time.substring(5, 7) + time.substring(8, 10) + time.substring(11, 13) + time.substring(14, 16) + '00'
      }

      this.add.data.time = formatTime
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
