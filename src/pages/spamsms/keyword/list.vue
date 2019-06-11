<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="关键词">
            <Input v-model="search.keywords" placeholder="请输入要查询的关键词..."></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="创建时间">
            <DatePicker v-model="search.time" type="daterange" placement="bottom-end" :options="endTimeOptions"
              @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="垃圾短信分类">
            <Select v-model="search.kind" style="width: 100%;" placeholder="请选择要查询的垃圾短信分类">
              <Option v-for="item in kindList" :value="item.classifyType" :key="item.classifyType">{{ item.classifyName }}</Option>
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
      @on-ok="saveKeyword('add')"
      @on-cancel="cancel('add')"
      :loading="addLoading">
        <Form ref="add" :model="add" :label-width="100" :rules="addRule">
          <FormItem label="关键词" prop="keywords">
            <Input v-model="add.keywords" placeholder="请输入关键词..."></Input>
          </FormItem>
          <FormItem label="垃圾短信分类" prop="kind">
            <Select v-model="add.kind" style="width: 100%;" placeholder="请选择垃圾短信分类">
              <Option v-for="item in kindList" :value="item.classifyType" :key="item.classifyType">{{ item.classifyName }}</Option>
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
        keywords: '',
        time: ['', ''],
        kind: ''
      },
      kindList: [],
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '关键词',
          key: 'keywords'
        }, {
          title: '标记类型',
          key: 'kind',
          render: (h, params) => {
            let kind = params.row.kind
            let kindList = this.kindList
            for (let i = 0; i < kindList.length; i++) {
              if (kindList[i].classifyType === kind) {
                kind = kindList[i].classifyName
                break
              }
            }
            return h('span', kind)
          }
        }, {
          title: '加入时间',
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
                    this.delete(params.row.streamnumber, params.row.keywords)
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
        keywords: '',
        kind: ''
      },
      addLoading: true,
      addRule: {
        keywords: [
          {
            required: true,
            message: '关键词不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            message: '关键词不能超过25个字符',
            max: 25
          }
        ],
        kind: [
          {
            required: true,
            message: '请选择垃圾短信分类',
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
      this.axios.get('/spamsms/keywords').then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.kindList = data.type
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
      this.search.keywords = ''
      this.search.kind = ''
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
        'kind': this.search.kind,
        'keywords': this.search.keywords
      }
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      page = page - 1
      this.axios.post('/spamsms/keywords/' + page + '/' + this.page.size, this.getSearchCondition()).then((response) => {
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
      this.axios.post('/spamsms/keywords/0/' + size, this.getSearchCondition()).then((response) => {
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
    delete (id, keywords) { // 删除记录
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认删除关键词[' + keywords + ']？',
        okText: '确认删除',
        onOk: () => {
          this.axios.delete('/spamsms/keywords/' + id).then((response) => {
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
    saveKeyword (name) { // 保存新增关键词
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.axios.post('/spamsms/keywords', {
            'keywords': this.add.keywords,
            'kind': this.add.kind
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
