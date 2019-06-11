<template>
  <div>
    <div class="main-header">
      <Form ref="searchForm" :label-width="80" :model='searchForm' :rules="validateSearchForm">
        <Row>
          <Col span="12">
          <FormItem label="主叫号码" prop="phoneNumber">
            <Input type="text" placeholder="请选择主叫号码" v-model="searchForm.phoneNumber"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="生成时间" prop="createTime">
            <DatePicker type='datetime' :editable="timeEditable" placeholder="请选着时间" style="width:20em;" v-model="searchForm.createTime"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="加黑次数" prop="blackNum">
            <Input type="text" placeholder="请选择加黑次数" v-model="searchForm.blackNum" number></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem>
            <Row>
              <Col span="4">
              <Button type="success" icon='ios-search' @click="searchData('searchForm')">搜索</Button>
              </Col>
              <Col span="4">
                 <Button type='info' icon='ios-add' @click="addModal=true">新增</Button>
              </Col>
              <Col span="4">
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
      <Table border size='large' highlight-row :columns='blackTitle' :data="blackData"></Table>
    </Row>

    <Modal v-model="addModal"  title="新增一条黑名单数据" width='500'>
      <Form ref="addForm" :model="addForm" :label-width="80" :rules="validateAddForm">
        <FormItem label="加黑号码" prop="phoneNumber">
          <Input type="text" v-model="addForm.phoneNumber"></Input>
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
        <Button type="error" size="large" long  @click="deleteSingleData">删除</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import { httpSearchData, httpAddSingleData, httpDeleteSingleData, httpTableData } from '@/api/blackNumber'
export default {
  data () {
    return {
      timeEditable: false,
      addModal: false,
      deleteModal: false,
      deleteIndex: '',
      searchForm: {
        phoneNumber: '',
        createTime: '',
        blackNum: 3
      },
      validateSearchForm: {
        phoneNumber: [ {
          pattern: /^1[3|4|5|8][0-9]\d{4,8}$/,
          message: '号码格式错误',
          trigger: 'blur'
        }],
        blackNum: [{
          type: 'number',
          message: '加黑次数必须是数字',
          trigger: 'blur'
        }]
      },
      addForm: {
        phoneNumber: '',
        createTime: ''
      },
      validateAddForm: {
        phoneNumber: [
          { required: true, message: '该字段不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|8][0-9]\d{4,8}$/,
            message: '号码格式错误',
            trigger: 'blur'
          }
        ]
      },
      blackTitle: [
        {
          title: '被主叫号码',
          key: 'phoneNumber'
        },
        {
          title: '生成时间',
          key: 'createTime'
        },
        {
          title: '加黑次数',
          key: 'blackNum'
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
                      this.deleteIndex = params.row.phoneNumber
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
      blackData: []
    }
  },
  mounted () {
    // 进入获取全部数据
    this.initailTableData()
  },
  methods: {
    // 搜索数据
    searchData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          httpSearchData(this.searchForm).then(data => {
            if (data.code === '200') {
              this.blackData = data.data
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
    initailTableData () {
      httpTableData().then(response => {
        if (response.code === '200') {
          this.blackData = response.data
        }
      })
    },
    addSingleData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          httpAddSingleData(this.addForm).then(data => {
            if (data.code === '200') {
              this.initailTableData()
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
      httpDeleteSingleData(this.deleteIndex).then(data => {
        if (data.code === '200') {
          this.initailTableData()
          this.$Message.success('数据删除成功')
        } else {
          this.$Message.error('数据删除失败')
        }
      })
      this.deleteModal = false
    }
  }
}
</script>

<style>
.main-header {
  width: 100%;
  padding-top: 1em;
  padding-bottom: 1em;
}
.main-content {
  width: 100%;
  height: 40em;
}
</style>
