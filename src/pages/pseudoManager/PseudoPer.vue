<template>
  <div>
    <div class="main-header">
      <Form ref="searchForm" :label-width="80" :model='searchForm' :rules="validateSearchForm">
        <Row>
          <Col span="8">
          <FormItem label="主叫号码" prop="phoneNumber" :label-width="65">
            <Input type="text" placeholder="请选择主叫号码" v-model="searchForm.phoneNumber"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem>
            <Row>
              <Col span="8">
              <Button type="success" icon='ios-search' @click="searchData('searchForm')">搜索</Button>
              </Col>
              <Col span="8">
              <Button type='info' icon='ios-add' @click="addModal=true">新增</Button>
              </Col>
              <Col span="8">
              <Upload action=''>
                <Button type="warning" icon='ios-cloud-upload'>上传</Button>
              </Upload>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>

      </Form>
    </div>
    <Row class="main-content">
      <Table border size='large' width="1200" height='400' :loading="tableLoading" highlight-row :columns='tableTitle' :data="tableData"></Table>
    </Row>

    <Row>
      <Page :total="pageConfig.total" :page-size="pageConfig.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer show-elevator show-total />
    </Row>

    <Modal v-model="addModal" title="新增一条黑名单数据" width='500'>
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
  },
  methods: {
    // 搜索数据
    searchData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
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
                this.tableLoading = false
                this.$Message.success('数据请求成功')
              } else {
                this.$Message.error('数据请求失败')
              }
            })
        } else {
          this.$Message.error('提交的格式错误')
        }
      })
    },
    addSingleData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios.post('/black/add', this.addForm).then(data => {
            // console.log('添加黑名单数据', data)
            if (data.code === 200) {
              this.searchData('searchForm')
              this.$Message.success('数据添加成功')
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
    cancalAddSingleData (formName) {
      this.addModal = false
      this.$refs[formName].resetFields()
    },
    deleteSingleData () {
      this.axios.delete(`/black/${this.deleteIndex}`).then(data => {
        if (data.code === 200) {
          this.searchData('searchForm')
          this.$Message.success('数据删除成功')
        } else {
          this.$Message.error('数据删除失败')
        }
      })
      this.deleteModal = false
    },
    pageChange (pageIndex) {
      this.pageConfig.pageIndex = pageIndex - 1
      this.searchData('searchForm')
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize
      this.searchData('searchForm')
    }
  }
}
</script>

<style>
.main-header {
  padding-top: 1em;
  padding-bottom: 1em;
}
.main-content {
  padding-bottom: 1em;
}
</style>
