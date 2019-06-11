<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="模板内容">
            <Input v-model="search.content" placeholder="请输入要查询的短信模板内容关键字..."></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="创建时间">
            <DatePicker v-model="search.time" type="daterange" placement="bottom-end" :options="endTimeOptions"
              @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="有害短信分类">
            <Select v-model="search.type" style="width: 100%;" placeholder="请选择要查询的有害短信分类">
              <Option v-for="item in typeList" :value="item.classifyType" :key="item.classifyType">{{ item.classifyName }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="text-align: center;">
          <FormItem>
            <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="handlePage(1)">搜索</Button>
            <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider/>

    <!-- 表格区域 -->
    <Button size="large" type="primary" icon="ios-add-circle-outline" style="margin-bottom: 10px;"
      @click="addModal = true">新增</Button>
    <Table border highlight-row :loading="loading" :columns="columns" :data="data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>

    <!-- 新增关键词区域 -->
    <Modal
      v-model="addModal"
      title="新增关键词"
      @on-ok="saveTemplate('add')"
      @on-cancel="cancel('add')"
      :loading="addLoading">
        <Form ref="add" :model="add" :label-width="100" :rules="addRule">
          <FormItem label="模板内容" prop="content">
            <Input type="textarea" :rows="3" v-model="add.content" placeholder="请输入短信模板内容..."></Input>
          </FormItem>
          <FormItem label="垃圾短信分类" prop="type">
            <Select v-model="add.type" style="width: 100%;" placeholder="请选择短信模板垃圾短信分类">
              <Option v-for="item in typeList" :value="item.classifyType" :key="item.classifyType">{{ item.classifyName }}</Option>
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
      endTimeOptions: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      search: {
        content: '',
        time: ['', ''],
        type: ''
      },
      typeList: [],
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '短信内容',
          key: 'template'
        }, {
          title: '短信类别',
          key: 'type',
          render: (h, params) => {
            let type = params.row.type
            let typeList = this.typeList
            for (let i = 0; i < typeList.length; i++) {
              if (typeList[i].classifyType === type) {
                type = typeList[i].classifyName
                break
              }
            }
            return h('span', type)
          }
        }, {
          title: '创建时间',
          key: 'time',
          render: (h, params) => {
            let time = params.row.time
            let formatTime = time
            if (time.length === 14) {
              formatTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' +
                time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12)
            }
            return h('span', formatTime)
          }
        }, {
          title: '操作人',
          key: 'operator'
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
                    this.delete(params.row.id, params.row.template)
                  }
                }
              }, '删除')
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
        content: '',
        type: ''
      },
      addLoading: true,
      addRule: {
        content: [
          {
            required: true,
            message: '模板内容不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            message: '模板内容不能超过100个字符',
            max: 100
          }
        ],
        type: [
          {
            required: true,
            message: '请选择关键词类型',
            trigger: 'change'
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
      this.axios.get('/spamsms/template').then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.typeList = data.type
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
      this.search.content = ''
      this.search.type = ''
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
        'type': this.search.type,
        'content': this.search.content
      }
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      page = page - 1
      this.axios.post('/spamsms/template/' + page + '/' + this.page.size, this.getSearchCondition()).then((response) => {
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
      this.axios.post('/spamsms/template/0/' + size, this.getSearchCondition()).then((response) => {
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
    delete (id, content) { // 删除记录
      if (content.length > 10) {
        content = content.substring(0, 10) + '...'
      }
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认删除短信模板[' + content + ']？',
        okText: '确认删除',
        onOk: () => {
          this.axios.delete('/spamsms/template/' + id).then((response) => {
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
    saveTemplate (name) { // 保存新增关键词
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.axios.post('/spamsms/template', {
            'content': this.add.content,
            'type': this.add.type
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
