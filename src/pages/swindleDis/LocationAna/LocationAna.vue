<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="经度">
            <Input v-model="search.longitude" placeholder="请输入经度"></Input>
          </FormItem>
        </Col>
        <Col span="8">
         <FormItem label="纬度">
            <Input v-model="search.latitude" placeholder="请输入纬度"></Input>
          </FormItem>
        </Col>
        <Col span="8">
         <FormItem label="状态">
           <Select v-model="search.status" >
                <Option value="" default>全部状态</Option>
                <Option value="1">已同步</Option>
                <Option value="0">未同步</Option>
            </Select>
          </FormItem>
        </Col>

      </Row>
      <Row>
          <Col span="24" style="text-align: center;">
            <FormItem>
                <Button type="success"  icon="ios-search" class="searchBtn" @click="handlePage(1)">搜索</Button>
                <Button type="info" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
            </FormItem>
          </Col>
      </Row>
    </Form>

    <Divider/>

    <!-- 表格区域 -->
    <Button  type="primary" icon="ios-add-circle-outline" style="margin-bottom: 10px;"
      @click="addModal = true">新增</Button>
    <Button  type="info" icon="ios-download" style="margin-bottom: 10px;"
      @click="exportTable">导出</Button>
    <Table border highlight-row :loading="loading" :columns="columns" :data="data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>

    <!-- 新增反制号码模块 -->
    <Modal
      v-model="addModal"
      title="新增分类"
      @on-ok="saveSingleData('add')"
      @on-cancel="cancel('add')"
      :loading="addLoading">
        <Form ref="add" :model="add" :label-width="100" :rules="addRule">
          <FormItem label="经度" prop="longitude">
            <Input v-model="add.longitude" placeholder="请输入经度"></Input>
          </FormItem>
           <FormItem label="纬度" prop="latitude">
            <Input v-model="add.latitude" placeholder="请输入纬度"></Input>
          </FormItem>
          <FormItem label="加入原因" prop="reason">
            <Input v-model="add.reason" type="textarea" :rows="6" placeholder="请输入反制原因" ></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: {
        longitude: '',
        latitude: '',
        status: ''
      },
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '经度',
          key: 'longitude'
        }, {
          title: '纬度',
          key: 'latitude'
        }, {
          title: '加入原因',
          key: 'reason'
        }, {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            let status = params.row.status
            if (status === '1') {
              return h('span', '已同步')
            } else {
              return h('span', '未同步')
            }
          }
        }, {
          title: '入库时间',
          key: 'subTime',
          render: (h, params) => {
            let time = params.row.subTime
            let formatTime = time
            if (time.length === 14) {
              formatTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' +
                time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12)
            }
            return h('span', formatTime)
          }
        }, {
          title: '操作',
          key: 'operation',
          width: 150,
          align: 'center',
          render: (h, params) => {
            let renderingContent = ''
            let status = params.row.status
            if (status === '1') {
              renderingContent = '已同步'
            } else {
              renderingContent = '同步'
            }
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.delete(params.row.streamNumber, params.row.longitude, params.row.latitude)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginLeft: '10px'
                },
                on: {
                  click: () => {
                    this.SyncStatus(params.row.streamNumber, params.row.longitude, params.row.latitude, params.row.status)
                  }
                }
              }, renderingContent)
            ])
          }
        }
      ],
      loading: true,
      data: [],
      page: {
        total: 0,
        size: 10,
        current: 1
      },
      addModal: false,
      add: {
        longitude: '',
        latitude: '',
        reason: ''
      },
      addLoading: true,
      addRule: {
        longitude: [
          {
            required: true,
            message: '经度不能为空',
            trigger: 'blur'
          }
        ],
        latitude: [
          {
            required: true,
            message: '纬度不能为空',
            trigger: 'blur'
          }
        ],
        reason: [
          {
            required: true,
            message: '加入原因不呢为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () { // 初始化列表
      this.page.current = 1
      this.loading = true
      this.axios.post('/swindledis/locationana/0/10', {}).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data.list
          this.page.total = data.count
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    handleReset () { // 重置查询条件
      this.search.phoneNumber = ''
      this.page.size = 10
      this.init()
    },
    handleTime (time) {
      this.search.time = time
    },
    exportTable () { // 导出垃圾短信
      this.$Modal.confirm({
        title: '操作确认',
        content: '将按照查询条件导出数据，是否导出？',
        okText: '导出',
        onOk: () => {
          this.axios.post('/swindledis/locationana/export', this.getSearchCondition(), {
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
              link.setAttribute('download', '定位分析_' + this.getCurrentTime() + '.txt')

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
    getSearchCondition () {
      return {
        'longitude': this.search.longitude,
        'latitude': this.search.latitude,
        'status': this.search.status
      }
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      page = page - 1
      this.axios.post('/swindledis/locationana/' + page + '/' + this.page.size, this.getSearchCondition()).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data.list
          this.page.total = data.count
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    handleSize (size) { // 改变页大小
      this.loading = true
      this.page.size = size
      this.axios.post('/swindledis/locationana/0/' + size, this.getSearchCondition()).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data.list
          this.page.total = data.count
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    delete (streamNumber, longitude, latitude) { // 删除记录
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认删除[经度:' + longitude + ', 纬度:' + latitude + ']？',
        okText: '确认删除',
        onOk: () => {
          this.axios.delete('/swindledis/locationana/' + streamNumber).then((response) => {
            let code = response.code
            if (code === 200) {
              this.init()
            } else {
              this.$Message.error(response.msg)
            }
          })
        }
      })
    },
    SyncStatus (streamNumber, longitude, latitude, status) {
      if (status === '1') {
        this.$Message.info('该定位分析数据已同步')
      } else {
        this.$Modal.confirm({
          title: '操作确认',
          content: '确认同步[经度:' + longitude + ', 纬度:' + latitude + ']？',
          okText: '确认同步',
          onOk: () => {
            this.axios.post('/swindledis/locationana/changeStatus',
              {
                'streamNumber': streamNumber,
                'status': '1'
              }).then((response) => {
              let code = response.code
              if (code === 200) {
                this.$Message.success('同步成功')
                this.init()
              } else {
                this.$Message.error(response.msg)
              }
            })
          }
        })
      }
    },
    changeLoading () { // 关闭加载状态
      this.addLoading = false
      this.$nextTick(() => {
        this.addLoading = true
      })
    },
    saveSingleData (name) { // 保存新增短信分类
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.axios.post('/swindledis/locationana/add', {
            'longitude': this.add.longitude,
            'latitude': this.add.latitude,
            'reason': this.add.reason
          }).then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('新增成功')
              this.init()
              this.addModal = false
              this.cancel(name)
            } else {
              this.$Message.error(response.msg)
            }
            this.changeLoading()
          }).catch((e) => {
            this.changeLoading()
          })
        } else {
          this.changeLoading()
        }
      })
    },
    cancel (name) { // 取消新增
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style lang="css">
@import "../../../../static/css/base.css"
</style>
