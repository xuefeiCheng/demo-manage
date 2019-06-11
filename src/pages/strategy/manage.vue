<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="策略名称">
            <Input v-model="search.name" placeholder="请输入要查询的策略名称..."></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem>
            <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="handlePage(1)">搜索</Button>
            <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider/>

    <!-- 数据表格区域 -->
    <Button size="large" type="primary" icon="ios-add-circle-outline" style="margin-bottom: 10px" @click="addModal = true">新增</Button>
    <Table border highlight-row :loading="table.loading" :columns="table.columns" :data="table.data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"></Page>
    </div>

    <!-- 审核模态框 -->
    <Modal v-model="auditModal" title="策略审核" @on-ok="auditOK('audit')" @on-cancel="auditCancel('audit')" :loading="audit.loading">
      <Form ref="audit" :model="audit.data" :label-width="100">
        <FormItem label="策略名称" prop="name">
          {{audit.data.name}}
        </FormItem>
        <FormItem label="策略状态" prop="state">
          <Select v-model="audit.data.state" style="width: 100%;" placeholder="请选择策略状态">
            <Option v-for="item in audit.stateList" :value="item.key" :key="item.value">{{ item.value }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <!-- 新增模态框 -->
    <Modal v-model="addModal" title="新增策略" @on-ok="addOK('audit')" @on-cancel="addCancel('audit')" :loading="add.loading" width="60%">
      <Form ref="add" :model="add.data" :label-width="100">
        <Row>
          <Col span="12">
            <FormItem label="策略名称" prop="name">
              <Input v-if="add.type == 'add'" v-model="add.data.name" style="width: 80%;" placeholder="请输入模板名称..."></Input>
              <span v-else>
                {{add.data.name}}
              </span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="策略处置方式" prop="type">
              <Select v-model="add.data.type" style="width: 80%;" placeholder="请选择策略处置方式">
                <Option v-for="item in ruleList" :value="item.key" :key="item.value">{{ item.value }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="执行周期" prop="circle">
              <Select v-model="add.data.circle" style="width: 80%;" placeholder="请选择执行周期">
                <Option v-for="item in cycleList" :value="item.key" :key="item.value">{{ item.value }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="分析时长" prop="period">
              <Select v-model="add.data.period" style="width: 80%;" placeholder="请选择分析时长">
                <Option v-for="item in periodList" :value="item.key" :key="item.value">{{ item.value }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12" v-if="add.type == 'update'">
            <FormItem label="策略状态" prop="state">
              <Select v-model="add.data.state" style="width: 80%;" placeholder="请选择策略状态">
                <Option v-for="item in stateList" :value="item.key" :key="item.value">{{ item.value }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="指标选择" prop="norm">
              <Select v-model="add.norm" style="width: 80%;" placeholder="请选择指标">
                <Option v-for="item in normList" :value="item.id" :key="item.normDesc" :disabled="item.disabled">{{ item.normDesc }}</Option>
              </Select>
              <Icon type="md-add" size="30" color="#2d8cf0" style="cursor: pointer" @click.native="addNorm"/>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <Divider />

      <Table border highlight-row :columns="normTable.columns" :data="normTable.data"></Table>
    </Modal>
  </div>
</template>

<script>
import '../../../static/js/customValidate.js'

export default {
  data () {
    return {
      search: {
        name: ''
      },
      stateList: [
        {
          key: 1,
          value: '正常'
        }, {
          key: 2,
          value: '待审'
        }, {
          key: 3,
          value: '无效'
        }
      ],
      opList: [
        {
          key: '>=',
          value: '>='
        }, {
          key: '<=',
          value: '<='
        }
      ],
      normList: [],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      ruleList: [
        {
          key: 1,
          value: '拦截'
        }, {
          key: 2,
          value: '取证'
        }, {
          key: 3,
          value: '高频'
        }, {
          key: 4,
          value: '仅输出'
        }
      ],
      cycleList: [
        {
          key: 5,
          value: '5分钟'
        }, {
          key: 10,
          value: '10分钟'
        }, {
          key: 15,
          value: '15分钟'
        }, {
          key: 30,
          value: '30分钟'
        }, {
          key: 60,
          value: '1小时'
        }, {
          key: 360,
          value: '6小时'
        }, {
          key: 720,
          value: '12小时'
        }, {
          key: 1440,
          value: '24小时'
        }
      ],
      periodList: [
        {
          key: 60,
          value: '1小时'
        }, {
          key: 120,
          value: '2小时'
        }, {
          key: 180,
          value: '3小时'
        }, {
          key: 360,
          value: '6小时'
        }, {
          key: 720,
          value: '12小时'
        }, {
          key: 1440,
          value: '24小时'
        }
      ],
      table: {
        loading: true,
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          }, {
            title: '策略名称',
            key: 'strategyName'
          }, {
            title: '策略处置方式',
            key: 'rule',
            render: (h, params) => {
              let rule = params.row.rule
              let ruleTxt = '异常数据'

              if (rule === 1) {
                ruleTxt = '拦截'
              } else if (rule === 2) {
                ruleTxt = '取证'
              } else if (rule === 3) {
                ruleTxt = '高频'
              } else if (rule === 4) {
                ruleTxt = '仅输出'
              }

              return h('span', ruleTxt)
            }
          }, {
            title: '策略状态',
            key: 'state',
            render: (h, params) => {
              let state = params.row.state
              let stateText = '异常数据'

              if (state === 1) {
                stateText = '正常'
              } else if (state === 2) {
                stateText = '待审'
              } else if (state === 3) {
                stateText = '无效'
              }

              return h('span', stateText)
            }
          }, {
            title: '执行周期',
            key: 'cycle',
            render: (h, params) => {
              let cycle = params.row.cycle
              let cycleText = '异常数据'

              for (var i = 0; i < this.cycleList.length; i++) {
                let key = this.cycleList[i].key
                if (key === cycle) {
                  cycleText = this.cycleList[i].value
                  break
                }
              }

              return h('span', cycleText)
            }
          }, {
            title: '分析时长',
            key: 'period',
            render: (h, params) => {
              let period = params.row.period
              let periodText = '异常数据'

              for (var i = 0; i < this.periodList.length; i++) {
                let key = this.periodList[i].key
                if (key === period) {
                  periodText = this.periodList[i].value
                  break
                }
              }

              return h('span', periodText)
            }
          }, {
            title: '创建时长',
            key: 'createTime',
            render: (h, params) => {
              let time = params.row.createTime

              return h('span', this.formatTime(time))
            }
          }, {
            title: '更新时间',
            key: 'lastdata',
            render: (h, params) => {
              let time = params.row.lastdata

              return h('span', this.formatTime(time))
            }
          }, {
            title: '操作',
            key: 'operation',
            width: 350,
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
                      this.update(params.row)
                    }
                  }
                }, '修改'),
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
                      this.auditModal = true
                      this.audit.data.name = params.row.strategyName
                    }
                  }
                }, '审核'),
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
                      this.delete(params.row.strategyName)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.delivery(params.row.strategyName)
                    }
                  }
                }, '下发')
              ])
            }
          }
        ],
        data: []
      },
      auditModal: false,
      audit: {
        loading: true,
        stateList: [
          {
            key: 1,
            value: '正常'
          }, {
            key: 3,
            value: '无效'
          }
        ],
        data: {
          name: '',
          state: 1
        }
      },
      addModal: false,
      add: {
        loading: true,
        norm: '',
        type: 'add',
        data: {
          name: '',
          type: '',
          circle: '',
          period: '',
          state: '2',
          norms: []
        }
      },
      normTable: {
        columns: [
          {
            type: 'index',
            key: 'normId'
          }, {
            title: '指标',
            key: 'normDesc'
          }, {
            title: '规则',
            key: 'relation',
            render: (h, params) => {
              let relation = params.row.relation

              if (relation === 1) {
                let id = params.row.normId
                let normData = {}
                let idx
                for (let i = 0; i < this.normDatas.length; i++) {
                  let normId = this.normDatas[i].normId
                  if (id === normId) {
                    normData = this.normDatas[i]
                    idx = i
                    break
                  }
                }

                return h('Select', {
                  props: {
                    value: normData.relation
                  },
                  on: {
                    'on-change': (val) => {
                      this.normDatas[idx].relation = val
                    }
                  }
                }, this.opList.map((item) => {
                  return h('Option', {
                    props: {
                      value: item.value,
                      label: item.key
                    }
                  })
                }))
              }
            }
          }, {
            title: '指标值',
            key: 'value',
            render: (h, params) => {
              let id = params.row.normId
              let normData = {}
              let idx
              for (let i = 0; i < this.normDatas.length; i++) {
                let normId = this.normDatas[i].normId
                if (id === normId) {
                  normData = this.normDatas[i]
                  idx = i
                  break
                }
              }

              return h('Input', {
                props: {
                  value: normData.value,
                  size: 'small'
                },
                on: {
                  input: (val) => {
                    this.normDatas[idx].value = val
                  }
                }
              })
            }
          }, {
            title: '说明',
            key: 'normRemark'
          }, {
            title: '删除',
            key: 'operation',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    let id = params.row.normId

                    for (let i = 0; i < this.normDatas.length; i++) {
                      if (this.normDatas[i].normId === id) {
                        this.normDatas.splice(i, 1)
                      }
                    }

                    for (let i = 0; i < this.normTable.data.length; i++) {
                      if (this.normTable.data[i].normId === id) {
                        this.normTable.data.splice(i, 1)
                      }
                    }

                    for (let i = 0; i < this.normList.length; i++) {
                      if (this.normList[i].id === id) {
                        this.normList[i].disabled = false
                      }
                    }
                  }
                }
              }, '删除')
            }
          }
        ],
        data: []
      },
      normDatas: []
    }
  },
  mounted () {
    this.list()
  },
  methods: {
    list () {
      this.table.loading = true
      let current = this.page.current - 1
      let pageSize = this.page.size

      this.axios.get('/strategy/manage/' + current + '/' + pageSize, {params: this.search}).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.page.total = data.count
          this.table.data = data.list
          this.normList = data.normList
        } else {
          this.$Message.error(response.msg)
        }

        this.table.loading = false
      }).catch((e) => {
        this.table.loading = false
      })
    },
    handlePage (current) {
      this.page.current = current

      this.list()
    },
    handleSize (size) {
      this.page.size = size

      this.list()
    },
    handleReset () {
      this.search.name = ''
      this.page.size = 10
      this.page.current = 1

      this.list()
    },
    delete (name) {
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认删除策略[' + name + ']？',
        okText: '确认',
        onOk: () => {
          this.axios.delete('/strategy/manage/' + name).then((response) => {
            let code = response.code
            if (code === 200) {
              this.$Message.success('删除成功')

              this.list()
            } else {
              this.$Message.error(response.msg)
            }
          })
        }
      })
    },
    delivery (name) {
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认下发策略[' + name + ']？',
        okText: '确认',
        onOk: () => {
          this.$Message.success('下发成功')
        }
      })
    },
    auditOK (name) {
      let strategyName = this.audit.data.name
      let state = this.audit.data.state

      this.axios.post('/strategy/manage/' + strategyName + '/' + state).then((resp) => {
        let code = resp.code
        if (code === 200) {
          this.$Message.success('审核成功')

          this.auditModal = false
          this.auditCancel(name)
          this.list()
        } else {
          this.$Message.error(resp.msg)
        }

        this.changeAuditLoading()
      }).catch((e) => {
        this.changeAuditLoading()
      })
    },
    auditCancel (name) {
      this.$refs[name].resetFields()

      this.audit.data.name = ''
      this.audit.data.state = 1
    },
    changeAuditLoading () {
      this.audit.loading = false

      this.$nextTick(() => {
        this.audit.loading = true
      })
    },
    addNorm () {
      let norm = this.add.norm
      if (norm === '') {
        this.$Message.error('请先选择指标')
      } else {
        let normData = {}
        let addFlag = true
        for (var i = 0; i < this.normList.length; i++) {
          let id = this.normList[i].id
          if (id === norm) {
            normData = this.normList[i]
            let disabled = this.normList[i].disabled

            if (!disabled) {
              this.normList[i].disabled = true
            } else {
              addFlag = false
            }
            break
          }
        }

        if (addFlag) {
          let data = {
            normId: norm,
            normDesc: normData.normDesc,
            normRemark: normData.normRemark,
            relation: normData.normRelation
          }

          this.normTable.data.push(data)

          let realData = {
            normId: norm,
            relation: '>=',
            value: ''
          }
          this.normDatas.push(realData)
        }
      }
    },
    addOK (name) {
      let normData = this.normDatas
      if (normData.length === 0) {
        this.$Message.error('请选择至少一个指标')

        this.changeAddLoading()
        return false
      }
      for (let i = 0; i < normData.length; i++) {
        let value = normData[i].value
        if (value === '') {
          this.$Message.error('指标值不能为空')

          this.changeAddLoading()
          return false
        }
      }

      this.add.data.norms = normData

      let url = '/strategy/manage'
      if (this.add.type === 'update') {
        url = '/strategy/manage/update'
      }

      this.axios.post(url, this.add.data).then((resp) => {
        let code = resp.code
        if (code === 200) {
          this.$Message.success('操作成功')

          this.addModal = false
          this.addCancel(name)
          this.list()
        } else {
          this.$Message.error(resp.msg)
        }

        this.changeAddLoading()
      }).catch((e) => {
        this.changeAddLoading()
      })
    },
    addCancel (name) {
      this.$refs[name].resetFields()

      this.normDatas = []
      this.normTable.data = []
      this.add.norm = ''
      this.add.type = 'add'
      this.add.data.name = ''
      this.add.data.type = ''
      this.add.data.circle = ''
      this.add.data.period = ''
      this.add.data.state = '2'
      this.add.data.norms = []

      for (let i = 0; i < this.normList.length; i++) {
        this.normList[i].disabled = false
      }
    },
    changeAddLoading () {
      this.add.loading = false

      this.$nextTick(() => {
        this.add.loading = true
      })
    },
    formatTime (time) {
      if (time !== undefined && time.length === 14) {
        return time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) +
          ' ' + time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12)
      }
      return time
    },
    update (row) {
      this.addModal = true

      let norms = []
      let realData = []
      this.axios.get('/strategy/relation/' + row.id).then((resp) => {
        let code = resp.code
        if (code === 200) {
          let data = resp.data

          for (let i = 0; i < data.length; i++) {
            let normId = data[i].normId
            for (let i = 0; i < this.normList.length; i++) {
              if (this.normList[i].id === normId) {
                let norm = {
                  normId: this.normList[i].id,
                  normDesc: this.normList[i].normDesc,
                  normRemark: this.normList[i].normRemark,
                  relation: this.normList[i].normRelation
                }
                norms.push(norm)
                break
              }
            }

            let realNorm = {
              normId: normId,
              relation: data[i].dataRelation,
              value: data[i].dataValue
            }
            realData.push(realNorm)
          }
        }
      })
      this.normTable.data = norms
      this.normDatas = realData

      let data = {
        name: row.strategyName,
        type: row.rule,
        circle: row.cycle,
        period: row.period,
        state: row.state
      }

      this.add.type = 'update'
      this.add.data = data
    }
  }
}
</script>

<style lang="css" scoped>
@import "../../../static/css/base.css"

.ivu-table-tip {
  overflow-x: hidden !important;
}

element.style {
  width: auto !important
}
</style>
