<template>
  <div  class="div-border">
      <Form ref="searchForm"  style="margin-left:0.3rem" :model='searchForm' :rules="validateSearchForm">
        <Row>
          <Col span="8">
            <FormItem label="查询分类:" prop="searchType" >
              <Select v-model="searchForm.searchType"  style="width:85%">
                <Option :value="0">局点数据</Option>
                <Option :value="1">局向数据</Option>
                <Option :value="2">国家码</Option>
                <Option :value="3">移动H码</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem>
              <Button type="success" icon='ios-search'  class="searchBtn" @click="initailSearch('searchForm')">搜索</Button>
              <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>

     <Divider/>

      <Table border size='large'   :loading="tableLoading" highlight-row :columns='tableTitle' :data="tableData"></Table>

      <div class="tab_footer">
        <Page  :total="pageConfig.total"  :current='pageConfig.pageIndex' :page-size="pageConfig.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer show-elevator show-total />
      </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      tableLoading: false,
      total: 0,
      searchForm: {
        searchType: 0
      },
      validateSearchForm: {},
      tableTitle: [{
        type: 'index',
        width: 60,
        align: 'center'
      }, { title: '编码', key: 'code' }, { title: '信息描述', key: 'pointname' }],
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
    this.initailSearch('searchForm')
  },
  computed: {
  },
  methods: {
    // 搜索数据
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
    searchData () {
      this.tableLoading = true
      let queryUrl = ''
      switch (this.searchForm.searchType) {
        case 0:
          queryUrl = '/baseinfo/point'
          break
        case 1:
          queryUrl = '/baseinfo/dpc'
          break
        case 2:
          queryUrl = 'baseinfo/country'
          break
        case 3 :
          queryUrl = 'baseinfo/hcode'
          break
      }

      this.axios.post(queryUrl,
        {
          'criterion': {},
          'mode': 'desc',
          'pageIndex': this.pageConfig.pageIndex,
          'pageSize': this.pageConfig.pageSize,
          'sortKey': ''
        }).then(data => {
        if (data.code === 200) {
          let tableTitleArray = [
            [{
              type: 'index',
              width: 60,
              align: 'center'
            }, { title: '编码', key: 'code' }, { title: '信息描述', key: 'pointname' }],
            [{
              type: 'index',
              width: 60,
              align: 'center'
            }, { title: '编码', key: 'code' }, { title: '信息描述', key: 'dpcname' }],
            [{
              type: 'index',
              width: 60,
              align: 'center'
            }, { title: '国家码', key: 'code' }, { title: '国家名称', key: 'countryname' }],
            [{
              type: 'index',
              width: 60,
              align: 'center'
            }, { title: 'H码', key: 'code' }, { title: 'H码描述', key: 'hname' }] ]
          switch (this.searchForm.searchType) {
            case 0:
              this.tableTitle = tableTitleArray[0]
              break
            case 1:
              this.tableTitle = tableTitleArray[1]
              break
            case 2:
              this.tableTitle = tableTitleArray[2]
              break
            case 3 :
              this.tableTitle = tableTitleArray[3]
              break
          }
          this.tableData = data.data.list
          this.pageConfig.total = data.data.count
        } else {
          this.$Message.error('数据请求失败')
        }
        this.tableLoading = false
      })
    },
    handleReset () {
      this.searchForm.searchType = 0
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
