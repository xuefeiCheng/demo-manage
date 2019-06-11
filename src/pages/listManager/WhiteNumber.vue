<template>
  <div class="div-border">
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

     <Table border :loading="tableLoading" highlight-row :columns='tableTitle' :data="tableData"></Table>
     <div class="tab_footer">
      <Page :total="pageConfig.total" :current='pageConfig.pageIndex' :page-size="pageConfig.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer show-elevator show-total />
     </div>

    <Modal v-model="addModal" title="新增一条白名单数据" width='500' :mask-closable="false" :closable="false" >
      <Form ref="addForm" :model="addForm" :label-width="80" :rules="validateAddForm">
        <FormItem label="号码" prop="phonenumber">
          <Input type="text" v-model="addForm.phonenumber"></Input>
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

<!--  详情弹框 -->
    <Modal v-model="detailModal" title="详情" width='900'>
      <Table border :loading="tableLoading" highlight-row :columns='tableTitle1' :data="tableData1"></Table>
    </Modal>

  </div>
</template>

<script>
export default {
  data () {
    return {
      timeEditable: false,
      addModal: false,
      showYstype: false,
      deleteModal: false,
      detailModal: false, // 详情弹框
      deleteIndex: '',
      warninglevel: '',
      tableLoading: false,
      total: 0,
      searchForm: {
        phoneNumber: '',
        warninglevel: ''
      },
      validateSearchForm: {
        phoneNumber: []
      },
      addForm: {
        phonenumber: ''
      },
      validateAddForm: {
        phonenumber: [
          { required: true, message: '该字段不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|8][0-9]\d{4,8}$/,
            message: '号码格式错误',
            trigger: 'blur'
          }
        ]
      },
      tableTitle: [
        {
          title: '受害人号码',
          key: 'phonenumber'
        },
        {
          title: '归属省',
          render: (h) => {
            return h('span', '广西')
          }
        },
        {
          title: '归属市',
          render: (h) => {
            let num = parseInt(Math.random() * (3 - 0 + 1) + 0, 10)
            const arr = ['南宁', '百色', '柳州', '贺州']
            return h('span', arr[num])
          }
        },
        {
          title: '疑似号码',
          key: 'phonenumber',
          render: (h, params) => {
            let num = parseInt(params.row.phonenumber)
            return h('span', num + 102000004)
          }
        },
        {
          title: '恶意发现时间',
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
        },
        {
          title: '接通时间',
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
        },
        {
          title: '主被叫',
          render: (h) => {
            let num = parseInt(Math.random() * (1 - 0 + 1) + 0, 10)
            const arr = ['主叫', '被叫']
            return h('span', arr[num])
          }
        },
        {
          title: '通话时长(s)',
          render: (h) => {
            let num = parseInt(Math.random() * (30 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        },
        {
          title: '疑似类型',
          render: (h) => {
            let num = parseInt(Math.random() * (3 - 0 + 1) + 0, 10)
            const arr = ['虚假兼职诈骗', '网购诈骗', '中奖诈骗', '熟人诈骗']
            return h('span', arr[num])
          }
        },
        {
          title: '通话总次数',
          render: (h, params) => {
            let num = parseInt(Math.random() * (10 - 1 + 1) + 1, 10)
            if (params.row.phonenumber === '13041215155') {
              num = 3
            }
            return h('span', num)
          }
        },
        {
          title: '受害等级',
          key: 'level',
          render: (h, params) => {
            let txt = ''
            if (params.row.phonestatus === 1) {
              txt = '深'
            } else {
              txt = '浅'
            }
            return h('span', txt)
          }
        },
        {
          title: '话单类型',
          render: (h) => {
            return h('span', 'A口')
          }
        },
        {
          title: '数据来源',
          render: (h) => {
            let num = parseInt(Math.random() * (5 - 1 + 1) + 1, 10)
            return h('span', '策略' + num)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            let btns = [
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      // console.log('删除时的一条数据', params.row)
                      this.deleteIndex = params.row.streamnumber
                      this.deleteModal = true
                    }
                  }
                },
                '提醒'
              )
            ]
            if (params.row.phonestatus === 1) {
              btns.push(h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      const arr = [{
                        callnumber: '13041215155',
                        phonenumber: '13143215159',
                        startTime: '2019/04/17 13:06:02',
                        endTime: '2019/04/17 13:06:52',
                        long: '50',
                        direction: '1'
                      }, {
                        callnumber: '13041215155',
                        phonenumber: '13143215159',
                        startTime: '2019/04/07 10:06:02',
                        endTime: '2019/04/07 10:06:33',
                        long: '31',
                        direction: '0'
                      }, {
                        callnumber: '13041215155',
                        phonenumber: '13143215159',
                        startTime: '2019/04/06 21:16:32',
                        endTime: '2019/04/06 21:16:55',
                        long: '23',
                        direction: '0'
                      }]
                      this.tableData1 = arr
                      this.detailModal = true
                    }
                  }
                },
                '详情'
              ))
            }
            return h('div', btns)
          }
        }
      ],
      tableData: [],
      tableTitle1: [
        {
          title: '主叫号码',
          key: 'callnumber'
        },
        {
          title: '被叫号码',
          key: 'phonenumber'
        },
        {
          title: '通话开始时间',
          key: 'startTime',
          width: 150
        },
        {
          title: '通话结束时间',
          key: 'endTime',
          width: 150
        },
        {
          title: '通话时长(s)',
          key: 'long'
        },
        {
          title: '挂断方向',
          key: 'direction'
        }
      ],
      tableData1: [],
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
    delTimeOption () {
      if (this.searchForm.createTime !== '') {
        return {
          disabledDate: date => {
            return date.valueOf() <= this.searchForm.createTime.valueOf()
          }
        }
      }
    },
    createTimeOption () {
      if (this.searchForm.delTime !== '') {
        return {
          disabledDate: date => {
            return date.valueOf() >= this.searchForm.delTime.valueOf()
          }
        }
      }
    }
  },
  methods: {
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
              link.setAttribute('download', '疑似号码_' + this.getCurrentTime() + '.txt')

              document.body.appendChild(link)
              link.click()
            }
          })
        }
      })
    },
    initailSearch (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.pageConfig.pageSize = 10
          this.pageConfig.pageIndex = 1
          this.searchData()
        } else {
          this.$Message.error('提交的格式错误')
        }
      })
    },
    // 搜索数据
    searchData () {
      this.tableLoading = true
      this.axios
        .post('/white/search', {
          mode: 'desc',
          pageSize: this.pageConfig.pageSize,
          pageIndex: this.pageConfig.pageIndex,
          sortKey: 'createtime',
          criterion: { phonenumber: this.searchForm.phoneNumber }
        })
        .then(data => {
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
    addSingleData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios.post('/white/add', this.addForm).then(data => {
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
      this.axios.post('/white/addBaseFile', formData, headers).then(res => {
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
      this.axios.delete(`/white/${this.deleteIndex}`).then(data => {
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
