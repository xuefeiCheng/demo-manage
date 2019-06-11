<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="施骗号码">
            <Input v-model="search.phone" placeholder="请输入要查询的施骗号码..."></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="案件发生时间">
            <DatePicker v-model="search.time" type="daterange" placement="bottom-end"
              @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8" style="text-align: center;">
          <FormItem>
            <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="handlePage(1)">搜索</Button>
            <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider/>

    <!-- 表格区域 -->
    <Table border highlight-row :loading="loading" :columns="columns" :data="data" height='650'></Table>
    <div class="tab_footer" style="margin-top:10px">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>

    <!-- 位置 -->
    <Modal v-model="dialListModal" fullscreen title="位置" footer-hide>
      <div id="baiduMap" ref="baiduMap" class="hideLogo" style="width: 100%; height: 100%;"></div>
    </Modal>

    <!-- 研判 弹框 -->
    <Modal
      v-model="auditModal"
      title="人工研判"
      @on-ok="auditHandle('audit')"
      @on-cancel="cancel('audit')"
      @on-visible-change="cancel('audit')"
      :loading="auditLoading"
    >
      <Form ref="audit" :model="audit" :label-width="100" :rules="auditRule">
        <FormItem label="研判结果" prop="result">
          <Select v-model="audit.result">
            <Option value="1">诈骗</Option>
            <Option value="2">非诈骗</Option>
          </Select>
        </FormItem>
        <FormItem label="研判原因" prop="reason">
          <Input type="textarea" :rows="3" v-model="audit.reason" placeholder="请输入研判原因..."></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      auditModal: false, // 研判弹框
      dialListModal: false, // 地图弹框
      auditLoading: true, // 研判loading
      audit: { // 研判
        result: '',
        reason: ''
      },
      auditIndex: '', // 研判id
      auditRule: { // 研判规则
        result: [
          {
            required: true,
            message: '请选择研判结果',
            trigger: 'change'
          }
        ],
        reason: [
          {
            required: true,
            message: '研判原因不能为空',
            trigger: 'blur'
          }
        ]
      },
      search: {
        phone: '',
        time: ['', '']
      },
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '施骗号码',
          key: 'suspectInfo.phones',
          render: (h, params) => {
            return h('span', this.formatNumbers(params.row.suspectInfo.phones))
          }
        }, {
          title: '受害人',
          key: 'victimInfo.phone',
          render: (h, params) => {
            return h('span', params.row.victimInfo.phone)
          }
        }, {
          title: '发生时间',
          key: 'case_date',
          render: (h, params) => {
            return h('span', this.formatTime(params.row.case_date))
          }
        }, {
          title: '案件描述',
          width: 300,
          key: 'description'
        }, {
          title: '研判结果',
          width: 180,
          key: 'audit_result',
          render: (h, params) => {
            let state = params.row.audit_result
            let stateText = '-'

            if (state === '0') {
              stateText = '未研判'
            } else if (state === '1') {
              stateText = '诈骗'
            } else if (state === '2') {
              stateText = '非诈骗'
            }

            return h('span', stateText)
          }
        }, {
          title: '研判原因',
          width: 200,
          key: 'audit_reason'
        }, {
          title: '操作',
          key: 'operation',
          width: 300,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.createMap(params.row.suspectInfo.position)
                  }
                }
              }, '施害人位置'),
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.createMap(params.row.victimInfo.position)
                  }
                }
              }, '受害人位置'),
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  display: `${params.row.audit_result === '0' ? '' : 'none'}`
                },
                on: {
                  click: () => {
                    // 研判操作
                    this.auditModal = true
                    this.auditIndex = params.row.id
                  }
                }
              }, '人工研判')
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
      }
    }
  },
  mounted () {
    this.init()
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
    formatNumbers (numbers) {
      let res
      if (numbers) {
        res = numbers.join(',')
      } else {
        res = ''
      }
      return res
    },
    init () { // 初始化列表
      this.page.current = 1
      this.loading = true
      this.axios.post('/analysis/Fraud', this.getSearchCondition()).then((response) => {
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
      this.search.phone = ''
      this.search.time = ['', '']
      this.page.size = 10
      this.page.current = 1
      this.init()
    },
    handleTime (time) { // change 案件发生时间
      this.search.time = time
    },
    getSearchCondition () { // 获得用户输入信息
      let start = this.search.time[0]
      let formatStart = ''
      if (start.length === 10) {
        formatStart = start.substring(0, 4) + start.substring(5, 7) + start.substring(8, 10) + '000000'
      }
      let end = this.search.time[1]
      let formatEnd = ''
      if (end.length === 10) {
        formatEnd = end.substring(0, 4) + end.substring(5, 7) + end.substring(8, 10) + '235959'
      }

      return {
        criterion: {
          'starttime': formatStart,
          'endtime': formatEnd,
          'phonenum': this.search.phone
        },
        pageIndex: this.page.current,
        pageSize: this.page.size
      }
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      this.init()
    },
    handleSize (size) { // 改变页大小
      this.loading = true
      this.page.size = size
      this.init()
    },
    changeLoading () { // 关闭加载状态
      this.auditLoading = false
      this.$nextTick(() => {
        this.auditLoading = true
      })
    },
    // 取消研判
    cancel (name) { // 取消新增
      this.$refs[name].resetFields()
    },
    auditHandle (name) { // 研判操作
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.axios.post('/analysis/judged/' + this.auditIndex, {
            // 参数
            'audit_reason': this.audit.reason,
            'audit_result': this.audit.result
          }).then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('研判成功')
              this.init()
              this.auditModal = false
              this.cancel(name)
            } else {
              this.$Message.error(response.msg)
            }
            this.changeLoading()
          }).catch((e) => {
            this.changeLoading()
          })
        } else {
          this.$Message.error('请重新填写信息')
          this.changeLoading()
        }
      })
    },
    createMap (pos) { // 创建百度地图
      if (pos.lat === null || pos.lng === null) {
        this.$Message.error('暂无位置信息')
        return
      }
      let lat = parseInt(pos.lat)
      let lng = parseInt(pos.lng)
      let centerlat = lat - 0.1
      let centerlng = lng + 0.06
      this.dialListModal = true
      this.map = new window.BMap.Map('baiduMap', {})
      this.map.centerAndZoom(new window.BMap.Point(centerlat, centerlng), 14) // 创建中心点
      this.map.addOverlay(new window.BMap.Marker(new window.BMap.Point(lat, lng)))
      this.map.enableScrollWheelZoom() // 开启鼠标滚轮缩放
      this.map.setMinZoom(8) // 最小缩放级别
      this.map.setMaxZoom(15) // 最大缩放级别
    }
  }
}
</script>

<style></style>
