<template>
  <div ref="divWidth" class="div-border">
      <Form ref="searchForm"  :model='searchForm' :rules="validateSearchForm"  style="margin-left:0.3rem">
        <Row>
          <Col span="8">
          <FormItem label="号码" prop="phoneNumber" >
            <Input type="text" placeholder="请选择号码" v-model="searchForm.phoneNumber" style="width:85%"></Input>
          </FormItem>
          </Col>
          <Col span="8" justify="start">
          <FormItem>
              <Button type="success" class="searchBtn" icon='ios-search' @click="initailSearch('searchForm')">搜索</Button>
              <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
          </Col>
        </Row>
    </Form>

    <Divider/>

    <Button type='info' icon='ios-add-circle-outline' @click="addModal=true">新增</Button>
    <Upload :before-upload="handleUpload" action='' style="display:inline-block">
              <Button type="warning"  icon='ios-cloud-upload'>上传</Button>
    </Upload>

    <Table border size='large'  :loading="tableLoading" highlight-row :columns='tableTitle' :data="tableData"></Table>
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
      maxWidth: 0,
      addModal: false,
      deleteModal: false,
      deleteIndex: '',
      tableLoading: false,
      searchForm: {
        phoneNumber: ''
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
          title: '号码',
          key: 'phonenumber'
        },
        {
          title: '加黑原因',
          key: 'remark'
        },
        {
          title: '生成时间',
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
          title: '号码状态',
          key: 'phonestatus',
          render: (h, params) => {
            let status = params.row.phonestatus
            if (status === 0) {
              return h('span', '待同步')
            } else if (status === 1) {
              return h('span', '同步中')
            } else {
              return h('span', '已同步')
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
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
                      this.deleteIndex = params.row.streamnumber
                      this.deleteModal = true
                    }
                  }
                },
                '删除'
              )
            ])
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
    this.initailSearch('searchForm')
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
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css"
</style>
