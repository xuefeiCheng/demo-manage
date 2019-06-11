<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100" style="display:none">
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
    <Button type='info' icon='ios-add-circle-outline' style="margin-bottom:5px" @click="addModal=true">新增</Button>
    <Divider/>
    <Table border highlight-row :loading="table.loading" :columns="table.columns" :data="table.data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"></Page>
    </div>
    <!-- 新增modal -->
    <Modal v-model="addModal" title="新增" width='500' :mask-closable="false" :closable="false">
      <Form :label-width="80" :model="addForm" ref="addForm" :rules="validateAddForm">
        <FormItem label="预案名称" prop="planname">
          <Input type="text" v-model="addForm.planname"></Input>
        </FormItem>
        <FormItem label="预案类别" prop="plantype">
          <Select style="width: 100%;" placeholder="预案类别" v-model="addForm.plantype">
            <Option value="0">诈骗电话</Option>
            <Option value="1">伪基站</Option>
            <Option value="2">垃圾短信</Option>
          </Select>
        </FormItem>
        <FormItem label="预案等级" prop="planlevel">
          <Select style="width: 100%;" placeholder="预案等级" v-model="addForm.planlevel">
            <Option value="0">低</Option>
            <Option value="1">中</Option>
            <Option value="2">高</Option>
          </Select>
        </FormItem>
        <FormItem label="处置方式" prop="dealtype">
          <Select style="width: 100%;" placeholder="预案处置方式" v-model="addForm.dealtype">
            <Option value="0">录音取证</Option>
            <Option value="1">直接拦截</Option>
            <Option value="2">短信提醒</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="cancel('addForm')">取消</Button>
        <Button type="primary" @click="addHandle('addForm')">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// import { dateToString } from '@/utils/timeFormat'
export default {
  data () {
    return {
      addModal: false,
      addForm: {
        planname: '',
        plantype: '',
        planlevel: '',
        dealtype: ''
      },
      validateAddForm: {
        planname: [
          { required: true, message: '预案名称不能为空', trigger: 'blur' }
        ],
        plantype: [{
          required: true, message: '预案类别不能为空', trigger: 'blur'
        }],
        planlevel: [{
          required: true, message: '预案等级不能为空', trigger: 'blur'
        }],
        dealtype: [{
          required: true, message: '预案处置方式不能为空', trigger: 'blur'
        }]
      },
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
            title: '预案名称',
            key: 'planname'
          }, {
            title: '预案类别',
            key: 'plantype',
            render: (h, params) => {
              let state = params.row.plantype
              let stateText
              if (state === '0') {
                stateText = '诈骗电话'
              } else if (state === '1') {
                stateText = '伪基站'
              } else if (state === '2') {
                stateText = '垃圾短信'
              } else {
                stateText = '-'
              }
              return h('span', stateText)
            }
          }, {
            title: '预案等级',
            key: 'planlevel',
            render: (h, params) => {
              let state = params.row.planlevel
              let stateText
              if (state === '0') {
                stateText = '低'
              } else if (state === '1') {
                stateText = '中'
              } else if (state === '2') {
                stateText = '高'
              } else {
                stateText = '-'
              }
              return h('span', stateText)
            }
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
          // {
          //   title: '发案时间',
          //   key: 'caseDate',
          //   render: (h, params) => {
          //     return h(
          //       'span',
          //       `${params.row.caseDate.slice(0, 4)}-${params.row.caseDate.slice(4, 6)}-${params.row.caseDate.slice(6, 8)}
          //       ${params.row.caseDate.slice(8, 10)}:${params.row.caseDate.slice(10, 12)}:${params.row.caseDate.slice(12, 14)}`
          //     )
          //   }
          // }
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
      // let startTime = ''
      // let endTime = ''

      // if (this.search.time[0] !== '') {
      //   startTime = dateToString(this.search.time[0])
      //   endTime = dateToString(this.search.time[1])
      // }

      this.axios.post('/analysis/plan/list', {
        'criterion': {
          // 'endtime': endTime,
          // 'startTime': startTime
        },
        'mode': 'desc',
        'pageIndex': this.page.current,
        'pageSize': this.page.size,
        'sortKey': ''
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
    },
    cancel (formName) {
      this.addModal = false
      this.$refs[formName].resetFields()
    },
    addHandle (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios.post('/analysis/plan/add', this.addForm).then(data => {
            if (data.code === 200) {
              this.list()
              this.$refs[formName].resetFields()
            } else {
              this.$Message.error('数据添加失败')
              this.$refs[formName].resetFields()
            }
          })
          this.addModal = false
        } else {
          this.addModal = true
          this.$Message.warning('数据格式错误，请填写正确再提交')
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
@import "../../../../static/css/base.css"
</style>
