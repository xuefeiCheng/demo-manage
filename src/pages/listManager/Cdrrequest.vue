<template>
  <div ref="divWidth" class="div-border">
        <!-- 搜索区域 -->
    <Form :model="searchForm"  :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="主叫号码">
            <Input v-model="searchForm.callnumber" placeholder="请输入要查询的主叫号码"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="被叫号码">
            <Input v-model="searchForm.callednumber" placeholder="请输入要查询的被叫号码"></Input>
          </FormItem>
        </Col>
         <Col span="8">
          <FormItem label="呼叫时间">
            <DatePicker v-model="searchForm.time" type="daterange" placement="bottom-end"
              @on-change="handleTime" placeholder="请选择呼叫时间段" style="width: 100%;"></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="text-align: center;">
          <FormItem>
            <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="initailSearch()">话单查询请求</Button>
            <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="resultSearch()">话单查询结果</Button>
            <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
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
export default {
  data () {
    return {
      maxWidth: 0,
      addModal: false,
      deleteModal: false,
      deleteIndex: '',
      tableLoading: false,
      searchForm: {
        callnumber: '',
        callednumber: '',
        time: ''
      },
      tableTitle: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '主叫号码',
          key: 'callingnumber'
        },
        {
          title: '被叫号码',
          key: 'callednumber'
        },
        {
          title: '呼叫开始时间',
          key: 'callbegintime',
          render: (h, params) => {
            return h('span', this.formatTime(params.row.callbegintime))
          }
        },
        {
          title: '呼叫结束时间',
          key: 'callendtime',
          render: (h, params) => {
            return h('span', this.formatTime(params.row.callendtime))
          }
        },
        {
          title: '状态',
          key: 'phonestatus',
          render: (h, params) => {
            let status = params.row.status
            if (status === 1) {
              return h('span', '处理中')
            } else if (status === 2) {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.downloadfile(params.row.id, params.row.filepath)
                      }
                    }
                  },
                  '[下载话单文件]'
                )
              ])
            } else if (status === 3) {
              return h('span', '处理异常')
            } else if (status === 4) {
              return h('span', '无呼叫记录')
            }
          }
        }
      ],
      tableData: [],
      // 分页的默认配置
      pageConfig: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.maxWidth = this.$refs.divWidth.offsetWidth
    // this.initailSearch('searchForm')
  },
  methods: {
    formatTime (time) {
      let formatTime = time
      if (time.length === 14) {
        formatTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' +
          time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12)
      }
      return formatTime
    },
    downloadfile (fileIndex, fileName) {
      let headers = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'blob'
      }
      this.axios.get(`/request/download/${fileIndex}`, headers).then(data => {
        let url = window.URL.createObjectURL(data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName.trim())
        document.body.appendChild(link)
        link.click()
      })
    },
    // 格式化
    getSearchCondition () {
      let start = this.searchForm.time[0]
      let formatStart = ''
      if (start.length === 10) {
        formatStart = start.substring(0, 4) + start.substring(5, 7) + start.substring(8, 10) + '000000'
      }
      let end = this.searchForm.time[1]
      let formatEnd = ''
      if (end.length === 10) {
        formatEnd = end.substring(0, 4) + end.substring(5, 7) + end.substring(8, 10) + '235959'
      }

      return {
        'callbegintime': formatStart,
        'callendtime': formatEnd,
        'callnumber': this.searchForm.callnumber,
        'callednumber': this.searchForm.callednumber
      }
    },
    // 搜索数据
    initailSearch () {
      let callnumber = this.searchForm.callnumber
      let callednumber = this.searchForm.callednumber
      let number = false

      if (callnumber !== '' && callnumber != null) {
        if (!/^[+0-9]{1,24}$/.test(callnumber)) {
          this.$Message.warning('请输入正确的主叫号码')
          return false
        } else {
          number = true
        }
      }

      if (callednumber !== '' && callednumber != null) {
        if (!/^[+0-9]{1,24}$/.test(callednumber)) {
          this.$Message.warning('请输入正确的被叫号码')
          return false
        } else {
          number = true
        }
      }

      if (number === false) {
        this.$Message.warning('主叫号码、被叫号码需要至少填一项！')
        return false
      }

      let daterange = this.searchForm.time
      if (daterange == null || daterange === '') {
        this.$Message.warning('请选择呼叫时间！')
        return false
      }
      this.searchData()
    },
    searchData () {
      this.tableLoading = true
      this.axios
        .post('/request/hjsearch', this.getSearchCondition())
        .then(data => {
          if (data.code === 200) {
            this.tableData = data.data
            this.pageConfig.total = 1
          } else {
            this.$Message.error('该呼叫请求已经存在')
          }
          this.tableLoading = false
        })
    },
    resultSearch () {
      let callnumber = this.searchForm.callnumber
      let callednumber = this.searchForm.callednumber
      if (callnumber !== '' && callnumber != null) {
        if (!/^[+0-9]{1,24}$/.test(callnumber)) {
          this.$Message.warning('请输入正确的主叫号码')
          return false
        }
      }

      if (callednumber !== '' && callednumber != null) {
        if (!/^[+0-9]{1,24}$/.test(callednumber)) {
          this.$Message.warning('请输入正确的被叫号码')
          return false
        }
      }

      this.tableLoading = true
      this.axios
        .post('/request/hjresultsearch', {
          pageSize: this.pageConfig.pageSize,
          pageIndex: this.pageConfig.pageIndex,
          criterion: this.getSearchCondition()
        })
        .then(data => {
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
      this.searchForm.callnumber = ''
      this.searchForm.callednumber = ''
      this.searchForm.time = ''
    },
    handleTime (time) {
      this.searchForm.time = time
    },
    pageChange (pageIndex) {
      this.pageConfig.pageIndex = pageIndex
      this.resultSearch()
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize
      this.resultSearch()
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css"
</style>
