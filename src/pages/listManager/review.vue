<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="疑似号码">
            <Input v-model="search.phone" placeholder="请输入要查询的疑似号码..."></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="中标时间">
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
    <Table border highlight-row :loading="loading" :columns="columns" :data="data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>

    <!-- 回拨列表 -->
    <Modal v-model="dialListModal" fullscreen title="号码审核" footer-hide @on-visible-change="visibleModal">
      <Table border highlight-row :loading="dialLoading" :columns="dialColumns" :data="dialData"></Table>
      <div class="tab_footer">
        <span v-for="item in status" :key="item.value" style="display: inline">
          <Button size="large" type="primary" style="margin-right: 10px;" @click="submit(item.value)">{{item.label}}</Button>
        </span>
      </div>
    </Modal>

    <!-- 播放器 -->
    <Modal v-model="playInfo.play" title="录音试听" footer-hide draggable style="text-align: center;" @on-visible-change="visibleModal">
      <audio ref="audio" controls autoplay>
        您的浏览器不支持 audio 元素。
      </audio>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
          title: '疑似号码',
          key: 'phoneNumber'
        }, {
          title: '中标时间',
          key: 'bidTime',
          render: (h, params) => {
            return h('span', this.formatTime(params.row.bidTime))
          }
        }, {
          title: '中标策略',
          key: 'strategy'
        }, {
          title: '中标次数',
          key: 'signNum'
        }, {
          title: '号码状态',
          key: 'phonestatus',
          render: (h, params) => {
            let status = params.row.phonestatus
            if (status === 0) {
              return h('spane', '待同步')
            } else if (status === 1) {
              return h('span', '同步中')
            } else {
              return h('span', '已同步')
            }
          }
        }, {
          title: '操作',
          key: 'operation',
          width: 400,
          align: 'center',
          render: (h, params) => {
            return h('div', [
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
                    this.dialList(params.row.phoneNumber)
                  }
                }
              }, '审核'),
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
                    this.dialBack(params.row.phoneNumber)
                  }
                }
              }, '回拨'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.failure(params.row.phoneNumber)
                  }
                }
              }, '取证失败'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.again(params.row.phoneNumber)
                  }
                }
              }, '重新取证')
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
      dialPhone: '',
      dialListModal: false,
      dialLoading: true,
      dialColumns: [
        {
          title: '回拨次数',
          type: 'index',
          align: 'center'
        }, {
          title: '号码',
          key: 'phoneNumber'
        }, {
          title: '回拨结果',
          key: 'result',
          render: (h, params) => {
            let result = params.row.result
            let desc = '其他'
            if (result === 0) {
              desc = '外呼失败，空号'
            } else if (result === 1) {
              desc = '外呼失败，非空'
            } else if (result === 2) {
              desc = '外呼成功，录音未比对'
            } else if (result === 3) {
              desc = '外呼成功，录音关键字比对成功'
            } else if (result === 4) {
              desc = '外呼成功，录音比对失败'
            } else if (result === 5) {
              desc = '外呼成功，录音波形比对成功'
            }
            return h('span', desc)
          }
        }, {
          title: '回拨类型',
          key: 'fromType',
          render: (h, params) => {
            let type = params.row.fromType
            let desc = '自动'
            if (type === 1) {
              desc = '人工'
            }
            return h('span', desc)
          }
        }, {
          title: '外呼返回码',
          key: 'returnCode',
          render: (h, params) => {
            let code = params.row.returnCode
            let desc = code
            if (code === '486') {
              desc += ':忙'
            } else if (code === '480') {
              desc += ':关机/无法接通'
            } else if (code === '404') {
              desc += ':空号'
            } else if (code === '430') {
              desc += ':呼叫受限'
            }
            return h('span', desc)
          }
        }, {
          title: '外呼时间',
          key: 'callTime',
          render: (h, params) => {
            return h('span', this.formatTime(params.row.callTime))
          }
        }, {
          title: '播放',
          key: 'recordFilename',
          render: (h, params) => {
            let result = params.row.result
            if (result !== 0 && result !== 1) {
              return h('a', {
                on: {
                  click: () => {
                    this.play(params.index, params.row.recordFilename)
                  }
                }
              }, '播放')
            }
          }
        }, {
          title: '录音内容',
          key: 'ps',
          render: (h, params) => {
            this.initAuditData(params)
            let result = params.row.result
            let idx = params.index
            if (result !== 0 && result !== 1) {
              return h('Input', {
                props: {
                  placeholder: '请输入录音内容...'
                },
                on: {
                  input: (val) => {
                    this.auditData[idx].ps = val
                  }
                }
              })
            } else {
              this.auditData[idx].id = null
            }
          }
        }, {
          title: '审核结果',
          key: 'audit_result',
          render: (h, params) => {
            this.initAuditData(params)
            let result = params.row.result
            if (result !== 0 && result !== 1) { // 外呼成功
              return h('Select', {
                on: {
                  'on-change': (val) => {
                    let idx = params.index
                    this.auditData[idx].result = val
                  }
                }
              }, this.status.map((item) => {
                return h('Option', {
                  props: {
                    value: item.value,
                    label: item.label
                  }
                })
              }))
            }
          }
        }
      ],
      dialData: [],
      status: [
        {
          value: 2,
          label: '正常'
        }, {
          value: 3,
          label: '骚扰'
        }, {
          value: 4,
          label: '取证失败'
        }, {
          value: 5,
          label: '诈骗'
        }, {
          value: 6,
          label: '涉政'
        }, {
          value: 7,
          label: '色情'
        }, {
          value: 8,
          label: '涉黑'
        }, {
          value: 9,
          label: '网间虚假'
        }, {
          value: 10,
          label: '回拨两次以上为空'
        }
      ],
      auditData: [],
      playInfo: {
        url: '',
        token: '',
        play: false
      },
      audio: null
    }
  },
  mounted () {
    this.playInfo.url = this.axios.defaults.baseURL
    this.playInfo.token = this.$store.getters.token
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
    init () { // 初始化列表
      this.page.current = 1
      this.loading = true
      this.axios.get('/business/review').then((response) => {
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
      this.init()
    },
    handleTime (time) {
      this.search.time = time
    },
    getSearchCondition () {
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
        'timeStart': formatStart,
        'timeEnd': formatEnd,
        'phone': this.search.phone
      }
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      page = page - 1
      this.axios.post('/business/review/' + page + '/' + this.page.size, this.getSearchCondition()).then((response) => {
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
      this.axios.post('/business/review/0/' + size, this.getSearchCondition()).then((response) => {
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
    dialList (phone) {
      this.dialListModal = true
      this.axios.get('/business/review/audit/' + phone).then((response) => {
        let code = response.code
        if (code === 200) {
          this.dialData = response.data
          this.dialPhone = phone
        } else {
          this.$Message.error(response.msg)
        }
        this.dialLoading = false
      }).catch((e) => {
        this.dialLoading = false
      })
    },
    dialBack (phone) {
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认回拨号码[' + phone + ']？',
        okText: '确认回拨',
        onOk: () => {
          this.axios.get('/business/review/audit/' + phone + '/dialback').then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('操作成功')
              this.init()
            } else {
              this.$Message.error(response.msg)
            }
          })
        }
      })
    },
    failure (phone) {
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认设置号码[' + phone + ']取证失败？',
        okText: '确认',
        onOk: () => {
          this.axios.get('/business/review/audit/' + phone + '/failure').then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('操作成功')
              this.init()
            } else {
              this.$Message.error(response.msg)
            }
          })
        }
      })
    },
    again (phone) {
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认对号码[' + phone + ']重新取证？',
        okText: '确认',
        onOk: () => {
          this.axios.get('/business/review/audit/' + phone + '/again').then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('操作成功')
              this.init()
            } else {
              this.$Message.error(response.msg)
            }
          })
        }
      })
    },
    initAuditData (params) {
      if (this.auditData.length < params.index + 1) { // 无值
        this.auditData.push({
          'id': params.row.streamnumber,
          'ps': '',
          'result': '',
          'audio': 0
        })
      }
    },
    submit (val) {
      // 校验
      for (var i = 0; i < this.auditData.length; i++) {
        let data = this.auditData[i]
        if (data.id !== null) {
          if (data.ps === '') {
            this.$Message.error('每条记录的录音内容不能为空')
            return false
          } else if (data.result === '') {
            this.$Message.error('请为每条记录选择审核结果')
            return false
          } else if (data.audio === 0) {
            this.$Message.error('请试听第' + (i + 1) + '条录音')
            return false
          }
        }
      }

      // 保存
      this.axios.post('/business/review/audit/' + this.dialPhone + '/' + val, this.auditData).then((response) => {
        let code = response.code
        if (code === 200) {
          this.dialListModal = false
          this.$Message.success('操作成功')
          this.init()
        } else {
          this.$Message.error(response.msg)
        }
      })
    },
    play (idx, name) {
      this.playInfo.play = true
      this.$nextTick(() => {
        this.auditData[idx].audio += 1
        if (this.audio == null) {
          this.audio = this.$refs.audio
          let _this = this
          this.audio.onerror = function () {
            _this.playInfo.play = false
            _this.$Message.error('音频文件获取失败')
          }
        }
        this.audio.src = this.playInfo.url + '/business/review/play/' + name + '?token=' + this.playInfo.token
      })
    },
    visibleModal (show) {
      if (!show) {
        if (this.audio !== null) {
          this.audio.pause()
          this.audio = null
        }
        this.playInfo.play = false
      }
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css"
</style>
