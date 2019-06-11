<template>
  <div class="div-border">
      <Form ref="searchForm" style="margin-left:0.3rem" :model='searchForm' :rules="validateSearchForm">
        <Row>
          <Col span="8">
          <FormItem label="创建时间"  prop="createTime">
            <DatePicker type="datetimerange" :split-panels="true" style="width:85%"  format="yyyy-MM-dd HH:mm:ss" :editable="timeEditable"  placeholder="请选着加入时间"  v-model="searchForm.createTime"></DatePicker>
          </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="告警级别" prop="warninglevel">
              <Select v-model="searchForm.warninglevel" clearable style="width:85%">
                <Option value="1">最高等级</Option>
                <Option value="2">中等</Option>
                <Option value="3">普通</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4" justify="start">
              <FormItem>
                 <Button type="success" icon='ios-search' @click="initailSearch('searchForm')">搜索</Button>
                 <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
              </FormItem>
          </Col>
        </Row>
      </Form>

     <Divider/>
     <Table border size='large'  :loading="tableLoading" highlight-row :columns='tableTitle' :data="tableData"></Table>
     <div class="tab_footer">
      <Page :total="pageConfig.total" :current='pageConfig.pageIndex' :page-size="pageConfig.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer show-elevator show-total />
     </div>
  </div>
</template>

<script>
import { dateToString } from '@/utils/timeFormat'
export default {
  data () {
    return {
      timeEditable: false,
      tableLoading: false,
      searchForm: {
        createTime: '',
        warninglevel: ''
      },
      validateSearchForm: {},
      tableTitle: [{
        type: 'index',
        width: 60,
        align: 'center'
      },
      {
        title: '告警级别',
        key: 'warninglevel',
        render: (h, params) => {
          switch (parseInt(params.row.warninglevel)) {
            case 1:
              return h('span', '最高等级')
            case 2 :
              return h('span', '中等')
            case 3 :
              return h('span', '普通')
          }
        }
      },
      {
        title: '告警内容',
        key: 'warningdesc'
      },
      {
        title: '告警时间',
        key: 'createtime',
        render: (h, params) => {
          return h(
            'span',
            `${params.row.createtime.slice(
              0,
              4
            )}-${params.row.createtime.slice(
              4,
              6
            )}-${params.row.createtime.slice(6, 8)} 
              ${params.row.createtime.slice(
    8,
    10
  )}:${params.row.createtime.slice(
  10,
  12
)}:${params.row.createtime.slice(12, 14)}`
          )
        }
      }
      ],
      tableData: [],
      // 分页的默认配置
      pageConfig: {
        total: 0,
        pageIndex: 0,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.initailSearch('searchForm')
  },
  computed: {},
  methods: {
    initailSearch (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.pageConfig.pageIndex = 1
          this.pageConfig.pageSize = 10
          this.searchData()
        } else {
          this.$Message.error('提交的格式错误')
        }
      })
    },
    // 搜索数据
    searchData () {
      // console.log('异常告警搜索', this.searchForm.createTime)
      let startTime = ''
      let endTime = ''

      if (this.searchForm.createTime[0] !== '') {
        startTime = dateToString(this.searchForm.createTime[0])
        endTime = dateToString(this.searchForm.createTime[1])
      }

      this.tableLoading = true
      this.axios.post('/warning/search', {
        'criterion': {
          'createtime': {
            'endtime': endTime,
            'starttime': startTime
          },
          'warninglevel': this.searchForm.warninglevel
        },
        'mode': 'desc',
        'pageIndex': this.pageConfig.pageIndex,
        'pageSize': this.pageConfig.pageSize,
        'sortKey': 'createtime'
      }).then(data => {
        // console.log('白名单搜索返回数据', data)
        if (data.code === 200) {
          this.tableData = data.data.list
          this.pageConfig.total = data.data.count
        } else {
          this.$Message.error('数据请求失败')
        }
        this.tableLoading = false
      })
    },
    handleReset () {
      this.searchForm.createTime = ''
      this.searchForm.warninglevel = ''
    },
    pageChange (pageIndex) {
      this.pageConfig.pageIndex = pageIndex
      this.searchData()
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize
      this.searchData()
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css"
</style>
