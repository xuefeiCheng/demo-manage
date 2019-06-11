<template>
  <div ref="divWidth" class="div-border">
      <Form ref="searchForm"  :model='searchForm' :label-width="100" :rules="validateSearchForm"  >
        <Row>
         <Col span="8">
          <FormItem label="发现时间"  prop="createTime">
            <DatePicker type="datetimerange" :split-panels="true" style="width:85%"  format="yyyy-MM-dd HH:mm:ss" :editable="timeEditable"  placeholder="请选着加入时间"  v-model="searchForm.createTime"></DatePicker>
          </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="查询类型" prop="warninglevel">
              <Select v-model="warninglevel" clearable style="width:85%">
                <Option value="1">疑似号码</Option>
                <Option value="2">疑似类型</Option>
                <Option value="3">号码类型</Option>
                <Option value="4">话单类型</Option>
                <Option value="5">数据来源</Option>
                <Option value="6">运营商</Option>
                <Option value="7">疑似号码归属省</Option>
                <Option value="8">疑似号码归属市</Option>
              </Select>
            </FormItem>
          </Col>
            <Col span="8"  v-if="showYstype">
            <FormItem label="疑似类型" prop="ystype">
              <Select v-model="searchForm.ystype"  clearable style="width:85%">
                <Option value="1">疑似虚假兼职诈骗</Option>
                <Option value="2">疑似网购诈骗</Option>
                <Option value="3">疑似中奖诈骗</Option>
                <Option value="4">疑似熟人诈骗</Option>
                <Option value="5">疑似公检法诈骗</Option>
                <Option value="6">疑似虚假传销诈骗</Option>
                <Option value="7">疑似其他类型</Option>
              </Select>
            </FormItem>
          </Col>
          </Row>
          <Row>
          <Col span="24" justify="start" style="text-align: center;">
          <FormItem>
              <Button type="success" class="searchBtn" icon='ios-search' @click="initailSearch2('searchForm')">搜索</Button>
              <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
          </Col>
        </Row>
    </Form>

    <Divider/>

    <Button size="large" type="primary" icon="ios-add-circle-outline" style="margin-bottom: 10px;"
      @click="exportTable">导出</Button>

    <Table border   :loading="tableLoading" highlight-row :columns='tableTitle' :data="tableData"></Table>
    <div class="tab_footer">
      <Page :total="pageConfig.total" :current='pageConfig.pageIndex' :page-size="pageConfig.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer show-elevator show-total />
    </div>

    <Modal v-model="addModal" title="新增一条黑名单数据" width='500' :mask-closable="false" :closable="false">
      <Form ref="addForm" :model="addForm" :label-width="80" :rules="validateAddForm">
        <FormItem label="加黑号码" prop="phonenumber">
          <Input type="text" v-model="addForm.phonenumber"></Input>
        </FormItem>
        <FormItem label="加黑原因" prop='reason'>
          <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="addForm.reason" ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="cancalAddSingleData('addForm')">取消</Button>
        <Button type="primary" @click="addSingleData('addForm')">确认</Button>
      </div>
    </Modal>

    <Modal v-model="deleteModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>确认删除</span>
      </p>
      <div style="text-align:center">
        <p>删除数据之后，数据不能恢复</p>
        <p>您确定删除吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="deleteSingleData">删除</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
export default {
  data () {
    return {
      timeEditable: false,
      showYstype: false,
      maxWidth: 0,
      addModal: false,
      deleteModal: false,
      deleteIndex: '',
      tableLoading: false,
      warninglevel: '',
      searchForm: {
        warninglevel: ''
      },
      validateSearchForm: {
        phoneNumber: []
      },
      addForm: {
        phonenumber: '',
        reason: ''
      },
      validateAddForm: {
        phonenumber: [
          { required: true, message: '号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|8][0-9]\d{4,8}$/,
            message: '号码格式错误',
            trigger: 'blur'
          }
        ],
        reason: [{
          required: true, message: '加黑原因不能为空', trigger: 'blur'
        }]
      },
      tableTitle: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '疑似号码',
          key: 'phonenumber'
        },
        {
          title: '归属省',
          key: 'gss'
        },
        {
          title: '归属市',
          key: 'gsd'
        },
        {
          title: '号码类型',
          key: 'hmlx'
        },
        {
          title: '疑似类型',
          key: 'yslx'
        },
        {
          title: '发现时间',
          key: 'fxsj'
        },
        {
          title: '数据来源',
          render: (h) => {
            let num = parseInt(Math.random() * (3 - 1 + 1) + 1, 10)
            return h('span', '策略' + num)
          }
        },
        {
          title: '运营商',
          render: (h) => {
            let num = parseInt(Math.random() * (2 - 0 + 1) + 0, 10)
            const arr = ['移动', '联通', '电信']
            return h('span', arr[num])
          }
        },
        {
          title: '漫游地',
          render: (h) => {
            let num = parseInt(Math.random() * (5 - 0 + 1) + 0, 10)
            const arr = ['广西宾阳', '广西北海', '广西柳州', '广西马山', '广西上林', '广西柳州']
            return h('span', arr[num])
          }
        },
        {
          title: '话单类型',
          key: 'hdlx'
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
    this.initailSearch('searchForm')
  },
  methods: {
    // 搜索数据
    initailSearch (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.pageConfig.pageIndex = 1
          this.pageConfig.pageSize = 10
          var alldata = [{
            'phonenumber': '15011998798',
            'gss': '天津',
            'gsd': '静海',
            'hmlx': '手机号',
            'yslx': '淘宝诈骗',
            'fxsj': '2019-04-18 12:10:10',
            'sjly': '策略1',
            'yys': '移动',
            'hdlx': 'A口'}, {
            'phonenumber': '18546521212',
            'gss': '湖南',
            'gsd': '长沙',
            'hmlx': '手机号',
            'yslx': '熟人诈骗',
            'fxsj': '2019-04-18 12:10:10',
            'sjly': '策略1',
            'yys': '移动',
            'hdlx': 'A口'}, {
            'phonenumber': '15211998798',
            'gss': '湖南',
            'gsd': '岳阳',
            'hmlx': '手机号',
            'yslx': '公检法诈骗',
            'fxsj': '2019-04-18 12:10:10',
            'sjly': '策略1',
            'yys': '移动',
            'hdlx': 'A口'}, {
            'phonenumber': '18546521213',
            'gss': '湖北',
            'gsd': '黄冈',
            'hmlx': '手机号',
            'yslx': '虚假兼职诈骗',
            'fxsj': '2019-04-18 12:10:10',
            'sjly': '策略1',
            'yys': '移动',
            'hdlx': 'A口'}, {
            'phonenumber': '18411998798',
            'gss': '广东',
            'gsd': '广州',
            'hmlx': '手机号',
            'yslx': '虚假兼职诈骗',
            'fxsj': '2019-04-18 12:10:10',
            'sjly': '策略1',
            'yys': '移动',
            'hdlx': 'A口'}, {
            'phonenumber': '18211998798',
            'gss': '河南',
            'gsd': '郑阳',
            'hmlx': '手机号',
            'yslx': '虚假兼职诈骗',
            'fxsj': '2019-04-18 12:10:10',
            'sjly': '策略1',
            'yys': '移动',
            'hdlx': 'A口'}]
          this.searchData(alldata, 6)
        } else {
          this.$Message.error('提交的格式错误')
        }
      })
    },
    // 搜索数据
    initailSearch2 (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.pageConfig.pageIndex = 1
          this.pageConfig.pageSize = 10
          var alldata = [{
            'phonenumber': '18546521213',
            'gss': '天津',
            'gsd': '静海',
            'hmlx': '手机号',
            'yslx': '虚假兼职诈骗',
            'fxsj': '2019-04-18 12:10:10',
            'sjly': '策略1',
            'yys': '移动',
            'hdlx': 'A口'}, {
            'phonenumber': '18411998798',
            'gss': '湖南',
            'gsd': '长沙',
            'hmlx': '手机号',
            'yslx': '虚假兼职诈骗',
            'fxsj': '2019-04-18 12:10:10',
            'sjly': '策略1',
            'yys': '移动',
            'hdlx': 'A口'}, {
            'phonenumber': '18211998798',
            'gss': '湖南',
            'gsd': '岳阳',
            'hmlx': '手机号',
            'yslx': '虚假兼职诈骗',
            'fxsj': '2019-04-18 12:10:10',
            'sjly': '策略1',
            'yys': '移动',
            'hdlx': 'A口'}]
          this.searchData(alldata, 3)
        } else {
          this.$Message.error('提交的格式错误')
        }
      })
    },
    searchData (inindate, initcount) {
      this.tableLoading = true
      this.axios
        .post('/black/search', {
          mode: 'desc',
          pageSize: this.pageConfig.pageSize,
          pageIndex: this.pageConfig.pageIndex,
          sortKey: 'createtime',
          criterion: { phonenumber: this.searchForm.phoneNumber }
        })
        .then(data => {
          if (data.code === 200) {
            // this.tableData = data.data.list
            this.tableData = inindate
            this.pageConfig.total = initcount
          } else {
            this.$Message.error('数据请求失败')
          }
          this.tableLoading = false
        })
    },
    getSearchCondition () {
      return {
        'timeStart': '20190418000000',
        'timeEnd': '20190418235959',
        'type': '',
        'content': '',
        'calling': ''
      }
    },
    exportTable () { // 导出垃圾短信
      this.$Modal.confirm({
        title: '操作确认',
        content: '将按照查询条件导出数据，是否导出？',
        okText: '导出',
        onOk: () => {
          this.axios.post('/spamsms/manage/export', this.getSearchCondition(), {
            responseType: 'blob'
          }).then((response) => {
            let code = response.code
            if (code) {
              this.$Message.error(response.msg)
            } else {
              let data = response
              let url = window.URL.createObjectURL(new Blob([data]))
              let link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              link.setAttribute('download', '异常漫入号码_' + this.getCurrentTime() + '.txt')

              document.body.appendChild(link)
              link.click()
            }
          })
        }
      })
    },
    getCurrentTime () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1 // js中是从0开始所以要加1
      var day = date.getDate()
      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds()

      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      hour = hour < 10 ? '0' + hour : hour
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second

      return year + month + day + hour + minute + second
    },
    addSingleData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios.post('/black/add', this.addForm).then(data => {
            // console.log('添加黑名单数据', data)
            if (data.code === 200) {
              this.initailSearch('searchForm')

              this.$refs[formName].resetFields()
            } else {
              this.$Message.error('黑名单数据添加失败')
              this.$refs[formName].resetFields()
            }
          })
          this.addModal = false
        } else {
          this.addModal = true
          this.$Message.warning('数据格式错误，请填写正确再提交')
        }
      })
    },
    handleReset () {
      this.searchForm.phoneNumber = ''
    },
    handleUpload (file) {
      let formData = new FormData()
      formData.append('file', file)
      let headers = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      this.axios.post('/black/addBaseFile', formData, headers).then(res => {
        // console.log('返回值', res)
        if (res.code === 200) {
          this.$Message.success('导入成功')
          this.initailSearch('searchForm')
        } else {
          this.$Message.error('导入失败')
        }
        this.changeLoading()
      })
      return false
    },
    cancalAddSingleData (formName) {
      this.addModal = false
      this.$refs[formName].resetFields()
    },
    deleteSingleData () {
      this.axios.delete(`/black/${this.deleteIndex}`).then(data => {
        if (data.code === 200) {
          this.initailSearch('searchForm')
        } else {
          this.$Message.error('数据删除失败')
        }
      })
      this.deleteModal = false
    },
    pageChange (pageIndex) {
      this.pageConfig.pageIndex = pageIndex
      this.searchData()
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize
      this.searchData()
    }
  },
  watch: {
    // 监听id的变化
    warninglevel (warninglevel, oldwarninglevel) {
      // 这里写你的业务逻辑
      if (warninglevel === '2') {
        this.showYstype = true
      } else {
        this.showYstype = false
      }
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css"
</style>
