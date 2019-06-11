<template>
  <div class="div-border">

      <Form ref="searchForm"  :model='searchForm' :rules="validateSearchForm" style="margin-left:0.3rem">
        <Row>
          <Col span="8">
            <FormItem label="文件名" prop="filename" >
              <Input type="text" placeholder="请输入文件名称" v-model="searchForm.filename" style="width:85%"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem>
                <Button type="primary" icon='ios-search' @click="initialSearch('searchForm')">搜索</Button>
                <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>

  <Divider/>

  <Button type="warning" icon='ios-add-circle-outline' @click="addModal=true" style="margin-bottom: 10px;">添加文件</Button>

  <Table border size='large'   :loading="tableLoading" highlight-row :columns='tableTitle' :data="tableData"></Table>
   <div class="tab_footer">
     <Page :total="pageConfig.total" :current='pageConfig.pageIndex' :page-size="pageConfig.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer show-elevator show-total />
   </div>

    <Modal v-model="addModal" title="上传文件" width='500' :mask-closable="false" :closable="false" >
      <Form ref="addForm" :model="addForm" :label-width="80" :rules="validateAddForm">
        <FormItem label="文件名称" prop="filename">
          <Input type="text" v-model="addForm.filename"></Input>
        </FormItem>
        <FormItem label="文件描述" prop="filedesc">
          <Input type="textarea" :rows="4" v-model="addForm.filedesc"></Input>
        </FormItem>
        <FormItem label="文件名称" prop="file">
          <Row>
            <Col span="6">
            <Upload :before-upload="handleUpload" action="">
              <Button type="primary" icon="ios-cloud-upload-outline">上传</Button>
            </Upload>
            </Col>
            <Col span="12">
            <div v-if="addForm.file!==null">{{addForm.file.name}}</div>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="cancalAddSingleData('addForm')">取消</Button>
        <Button type="primary" @click="addSingleData('addForm')">确认</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
export default {
  data () {
    return {
      addModal: false,
      isClickSearch: false,
      addForm: {
        filename: '',
        filedesc: '',
        file: null
      },
      validateAddForm: {
        filename: [
          { required: true, message: '文件名不能为空', trigger: 'blur' }
        ],
        filedesc: [
          { required: true, message: '文件描述不能为空', trigger: 'blur' }
        ]
      },
      tableLoading: false,
      total: 0,
      searchForm: {
        filename: ''
      },
      validateSearchForm: {},
      tableTitle: [{
        type: 'index',
        width: 60,
        align: 'center'
      },
      { title: '文件名', key: 'filename' },
      {
        title: '上传时间',
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
                    this.downloadfile(params.row.stream_number, params.row.filename)
                  }
                }
              },
              '下载'
            )
          ])
        }
      }
      ],
      tableData: [],
      pageConfig: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.initialTable()
  },
  computed: {
    searchParams: function () {
      if (this.isClickSearch) {
        return {
          url: '/ywfile/search',
          params: {
            'criterion': {
              'filename': this.searchForm.filename
            },
            'mode': 'desc',
            'pageIndex': this.pageConfig.pageIndex,
            'pageSize': this.pageConfig.pageSize,
            'sortKey': 'createtime'
          }}
      } else {
        return {
          url: '/ywfile',
          params: {
            'criterion': {},
            'mode': 'desc',
            'pageIndex': this.pageConfig.pageIndex,
            'pageSize': this.pageConfig.pageSize,
            'sortKey': 'createtime'
          }}
      }
    }
  },
  methods: {
    handleUpload (file) {
      this.addForm.file = file
      return false
    },
    addSingleData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addForm.file !== null) {
            let formData = new FormData()
            let fileName = this.addForm.filename + '.' + this.addForm.file.name.split('.')[1]
            formData.append('file', this.addForm.file)
            formData.append('filename', fileName)
            formData.append('filedesc', this.addForm.filedesc)
            let headers = {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
            this.axios.post('/ywfile/upload', formData, headers).then(res => {
              // console.log('返回值', res)
              if (res.code === 200) {
                this.pageConfig.pageIndex = 1
                this.pageConfig.pageSize = 10
                this.searchData()
              } else {
                this.$Message.error('文件添加失败')
              }
              this.addModal = false
              this.$refs[formName].resetFields()
            })
          } else {
            this.$Message.warning('文件不能为空')
            this.addModal = true
          }
        } else {
          this.addModal = true
          this.$Message.warning('数据格式错误，请填写正确再提交')
        }
      })
    },
    handleReset () {
      this.searchForm.filename = ''
    },
    cancalAddSingleData (formName) {
      this.addModal = false
      this.$refs[formName].resetFields()
    },
    initialTable () {
      this.searchData()
    },
    initialSearch (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isClickSearch = true
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
        .post(this.searchParams.url, this.searchParams.params)
        .then(data => {
          // console.log('文件搜索返回数据', data)
          if (data.code === 200) {
            this.tableData = data.data.list
            this.pageConfig.total = data.data.count
          } else {
            this.$Message.error('数据请求失败')
          }
          this.tableLoading = false
        })
    },
    pageChange (pageIndex) {
      this.pageConfig.pageIndex = pageIndex
      this.searchData()
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize
      this.searchData()
    },
    downloadfile (fileIndex, fileName) {
      let headers = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'blob'
      }
      this.axios.get(`/ywfile/download/${fileIndex}`, headers).then(data => {
        // console.log(fileData)
        let url = window.URL.createObjectURL(data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName.trim())
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css"
</style>
