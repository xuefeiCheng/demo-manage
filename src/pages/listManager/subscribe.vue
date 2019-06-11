<template>
  <div ref="divWidth" class="div-border">
      <Form ref="searchForm"  :model='searchForm' :rules="validateSearchForm"  style="margin-left:0.3rem;display:none">
        <Row>
          <Col span="8" >
            <FormItem label="订阅类型" prop="subtype" :label-width="80">
              <Select v-model="searchForm.subtype">
                <Option value="1">诈骗号码</Option>
                <Option value="2">业务文档</Option>
                <Option value="3">疑似号码</Option>
              </Select>
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

    <!-- <Divider/> -->

    <Button type='info' icon='ios-add-circle-outline' @click="addModal=true" style="margin-bottom:10px">新增</Button>
    <Divider/>
    <Table border size='large'  :loading="tableLoading" highlight-row :columns='tableTitle' :data="tableData"></Table>
    <div style="margin-top:20px"></div>
    <div class="tab_footer" style="display:none">
      <Page :total="pageConfig.total" :current='pageConfig.pageIndex' :page-size="pageConfig.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer show-elevator show-total />
    </div>

    <Modal v-model="addModal" title="新增" width='500' :mask-closable="false" :closable="false">
      <Form ref="addForm" :model="addForm" :label-width="100" :rules="validateAddForm">
        <FormItem label="订阅类型" prop="subtype">
          <Select v-model="addForm.subtype">
            <Option value="1" :disabled='this.subtype.one'>诈骗号码</Option>
            <Option value="2" :disabled='this.subtype.two'>业务文档</Option>
            <Option value="3" :disabled='this.subtype.three'>疑似号码</Option>
          </Select>
        </FormItem>
        <FormItem label="订阅时长" prop="subduration">
          <Select v-model="addForm.subduration">
            <Option value="0">临时</Option>
            <Option value="1">永久</Option>
          </Select>
        </FormItem>
        <FormItem label="订阅截至日期" v-show="addForm.subduration === '0'">
          <DatePicker v-model="addForm.subdate" type="date" placeholder="请选择截止时间" style="width: 100%;" @on-change='handleChange'></DatePicker>
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
      subtype: {
        one: false,
        two: false,
        three: false
      },
      searchForm: {
        subtype: ''
      },
      validateSearchForm: {
        subtype: []
      },
      addForm: {
        subtype: '',
        subduration: '',
        subdate: ''
      },
      validateAddForm: {
        subtype: [
          {
            required: true, message: '请选择订阅类型', trigger: 'change'
          }
        ],
        subduration: [{
          required: true, message: '请选择订阅时长', trigger: 'change'
        }]
      },
      tableTitle: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '订阅类型',
          key: 'subtype',
          render: (h, params) => {
            let status = params.row.subtype
            if (status === '1') {
              return h('span', '诈骗号码')
            } else if (status === '2') {
              return h('span', '业务文档')
            } else if (status === '3') {
              return h('span', '疑似号码')
            }
          }
        },
        {
          title: '订阅时长',
          key: 'subduration',
          render: (h, params) => {
            let status = params.row.subduration
            if (status === '0') {
              return h('span', '临时')
            } else if (status === '1') {
              return h('span', '永久')
            }
          }
        },
        {
          title: '截至时间',
          key: 'subdate',
          render: (h, params) => {
            return h(
              'span',
              `${params.row.subdate.slice(
                0,
                4
              )}-${params.row.subdate.slice(
                4,
                6
              )}-${params.row.subdate.slice(6, 8)}`
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
                      this.deleteIndex = params.row.id
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
        .post('/subscribe/list', {
          mode: 'asc',
          pageSize: this.pageConfig.pageSize,
          pageIndex: this.pageConfig.pageIndex,
          sortKey: 'subtype',
          criterion: {}
        })
        .then(data => {
          if (data.code === 200) {
            this.tableData = data.data.list
            this.pageConfig.total = data.data.count
            if (this.tableData) {
              this.subtype = {
                one: false,
                two: false,
                three: false
              }
              this.tableData.forEach((item, index, self) => {
                if (item.subtype === '1') {
                  this.subtype.one = true
                } else if (item.subtype === '2') {
                  this.subtype.two = true
                } else if (item.subtype === '3') {
                  this.subtype.three = true
                }
              })
            }
          } else {
            this.$Message.error('数据请求失败')
          }
          this.tableLoading = false
        })
    },
    handleChange (date) {
      this.addForm.subdate = date.replace(/-/g, '')
    },
    addSingleData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios.post('/subscribe/add', this.addForm).then(data => {
            if (data.code === 200) {
              this.initailSearch('searchForm')
              this.$refs[formName].resetFields()
            } else {
              this.$Message.error('数据添加失败')
              this.$refs[formName].resetFields()
            }
          })
          this.addModal = false
        } else {
          this.addModal = true
          this.$Message.warning('填写错误，请填写正确再提交')
        }
      })
    },
    handleReset () {
      this.searchForm.subtype = ''
    },
    cancalAddSingleData (formName) {
      this.addModal = false
      this.$refs[formName].resetFields()
    },
    deleteSingleData () {
      this.axios.delete(`/subscribe/${this.deleteIndex}`).then(data => {
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
