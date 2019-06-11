<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="添加时间">
            <DatePicker v-model="search.time" type="daterange" placement="bottom-end" :options="endTimeOptions"
              @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8" style="text-align: center;">
          <FormItem>
            <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="init">搜索</Button>
            <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider/>

    <!-- 表格区域 -->
    <Button size="large" type="primary" icon="ios-add-circle-outline" style="margin-bottom: 10px;"
      @click="addModal = true">新增</Button>
    <Table border highlight-row :loading="loading" :columns="columns" :data="data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>

    <!-- 新增关键词区域 -->
    <Modal
      v-model="addModal"
      title="新增检索任务"
      @on-ok="addTask('add')"
      @on-cancel="cancel('add')">
        <Form ref="add" :model="add" :label-width="100">
          <FormItem label="任务类型" prop="tasktype">
            <Select v-model="add.tasktype">
              <Option value="0">号码检索</Option>
              <Option value="1">时间检索</Option>
            </Select>
          </FormItem>
          <FormItem label="主叫号码" v-show="add.tasktype === '0'"  prop="phonenum">
            <Input v-model="add.phonenum" placeholder="请输入号码..."></Input>
          </FormItem>
          <FormItem label="被叫号码" v-show="add.tasktype === '0'"  prop="callednumber">
            <Input v-model="add.callednumber" placeholder="请输入号码..."></Input>
          </FormItem>
          <FormItem label="号码类型" v-show="add.tasktype === '0'"  prop="phonetype">
            <Select v-model="add.phonetype">
              <Option value="0">来话</Option>
              <Option value="1">去话</Option>
            </Select>
          </FormItem>
          <FormItem label="时间段" prop="retrievalTime">
            <DatePicker v-model="add.retrievalTime" type="daterange" placeholder="请选择时间段" style="width: 100%;" @on-change="handleretrievalTime"></DatePicker>
        </FormItem>
        </Form>
    </Modal>

    <Modal v-model="dialListModal" fullscreen title="任务检索结果" footer-hide>
      <div style="height:50%;" class="box-mession">
        <div class="box-mession-sons border-RL" ref="pieOne" style="height:100%;width:100%;"></div>
        <div class="box-mession-sons border-RL border-NotRL" ref="pieTwo" style="height:100%;width:100%;"></div>
        <div class="box-mession-sons border-RL" ref="pieThree" style="height:100%;width:100%;"></div>
      </div>
      <div style="height:50%;" class="box-mession">
        <div class="box-mession-sons border-RL border-NotTop border-NotR" ref="pieFour" style="height:100%;width:100%;"></div>
        <div class="box-mession-sons border-RL border-NotTop" ref="pieFive" style="height:100%;width:100%;"></div>
      </div>
    </Modal>
    <!-- 主被叫折线图 -->
    <Modal v-model="dialListModal_chart" fullscreen title="任务检索结果" footer-hide>
      <div class="box-mession">
        <div class="box-mession-sons border-RL" ref="chartOne" style="height:100%;width:100%;"></div>
        <div class="btn-tongji" @click="drawChart('chartOne', dataZJ, {title: '主叫统计'})">主叫统计</div>
        <div class="btn-tongji btn-tongji-sp" @click="drawChart('chartOne', dataBJ, {title: '被叫统计'})">被叫统计</div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      endTimeOptions: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      dialListModal: false,
      dialListModal_chart: false,
      search: {
        time: ['', '']
      },
      columns: [
        {
          title: '任务ID',
          key: 'id'
        }, {
          title: '任务状态',
          key: 'state',
          render: (h, params) => {
            let resTxt
            let state = params.row.state
            if (state === '0') {
              resTxt = '处理中'
            } else if (state === '1') {
              resTxt = '待处理'
            } else if (state === '2') {
              resTxt = '已完成'
            } else if (state === '3') {
              resTxt = '查询不到数据'
            } else if (state === '4') {
              resTxt = '结果异常'
            } else {
              resTxt = '-'
            }
            return h('span', resTxt)
          }
        }, {
          title: '任务类型',
          key: 'tasktype',
          render: (h, params) => {
            let resTxt
            let tasktype = params.row.tasktype
            if (tasktype === '0') {
              resTxt = '号码检索'
            } else if (tasktype === '1') {
              resTxt = '时间检索'
            } else {
              resTxt = '-'
            }
            return h('span', resTxt)
          }
        }, {
          title: '添加时间',
          key: 'createtime',
          render: (h, params) => {
            let time = params.row.createtime
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
          width: 300,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '10px',
                  display: `${params.row.state === '2' ? '' : 'none'}`
                },
                on: {
                  click: () => {
                    if (params.row.tasktype === '0') {
                      //  号码检索
                      this.getResult(params.row.id)
                    } else if (params.row.tasktype === '1') {
                      // 时间检索
                      this.getResult_chart(params.row.id)
                    }
                  }
                }
              }, '检索结果'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '10px',
                  display: `${params.row.state === '2' && params.row.tasktype === '0' ? '' : 'none'}`
                },
                on: {
                  click: () => {
                    this.downloadFile(params.row.id, params.row.filename)
                  }
                }
              }, '下载'),
              h('span', {
                style: {
                  display: `${params.row.state === '0' ? '' : 'none'}`
                }
              }, '--')
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
        tasktype: '',
        phonetype: '',
        phonenum: '',
        callednumber: '',
        retrievalTime: ''
      },
      addRule: [],
      dataZJ: {
        num: [],
        value: []
      },
      dataBJ: {
        num: [],
        value: []
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () { // 初始化列表
      this.loading = true
      this.axios.post('/dataSta/retrieval/list', this.getSearchCondition()).then((response) => {
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
      this.search.time = ['', '']
      this.page.size = 10
      this.page.current = 1
      this.init()
    },
    handleTime (time) {
      this.search.time = time
    },
    handleretrievalTime (time) {
      this.add.retrievalTime = time
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
        'criterion': {
          'endtime': formatEnd,
          'phonenum': '',
          'phonetype': '',
          'starttime': formatStart,
          'tasktype': ''
        },
        'mode': 'asc',
        'pageIndex': this.page.current,
        'pageSize': this.page.size,
        'sortKey': 'createtime'
      }
    },
    handlePage (page) { // 切换页码/查询
      this.page.current = page
      this.init()
    },
    handleSize (size) { // 改变页大小
      this.page.size = size
      this.init()
    },
    // 新增 数据格式处理
    addTaskOptions () {
      let start = this.add.retrievalTime[0]
      let formatStart = ''
      if (start.length === 10) {
        formatStart = start.substring(0, 4) + start.substring(5, 7) + start.substring(8, 10) + '000000'
      }
      let end = this.add.retrievalTime[1]
      let formatEnd = ''
      if (end.length === 10) {
        formatEnd = end.substring(0, 4) + end.substring(5, 7) + end.substring(8, 10) + '235959'
      }

      return {
        'retrieval_begintime': formatStart,
        'retrieval_endtime': formatEnd,
        'phonenum': this.add.phonenum,
        'callednumber': this.add.callednumber,
        'phonetype': this.add.phonetype,
        'tasktype': this.add.tasktype
      }
    },
    addTask (name) { // 保存新增短信分类
      if (this.add.tasktype === '0') {
        if (!(this.add.phonetype && this.add.retrievalTime)) {
          this.$Message.error('请将信息填写完整')
          this.cancel(name)
          return
        } else {
          if (this.add.callednumber || this.add.phonenum) {

          } else {
            this.$Message.error('主被叫号码至少填写一个')
            this.cancel(name)
            return
          }
        }
      } else if (this.add.tasktype === '1') {
        if (!this.add.retrievalTime) {
          this.$Message.error('请将信息填写完整')
          this.cancel(name)
          return
        }
      } else {
        this.$Message.error('请将信息填写完整')
        this.cancel(name)
        return
      }
      this.axios.post('/dataSta/retrieval/add', this.addTaskOptions()).then((response) => {
        let code = response.code
        if (code === 200) {
          this.$Message.success('新增成功')
          this.init()
          this.addModal = false
          this.cancel(name)
        } else {
          this.$Message.error(response.msg)
        }
      }).catch((e) => {})
    },
    cancel (name) { // 取消新增
      this.$refs[name].resetFields()
    },
    drawChart (ref, data, opt) {
      this.$nextTick(() => {
        let chart = this.$echarts.init(this.$refs[ref])
        let option = {
          title: {
            text: opt.title || '标题',
            left: 20,
            top: 20
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: data.num || [''],
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                show: true,
                interval: 0,
                rotate: -90
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '呼叫次数',
              type: 'bar',
              barWidth: '60%',
              data: data.value || [20]
            }
          ]
        }
        chart.setOption(option)
      })
    },
    // 结果统计 饼图
    drawPie (ref, opt, data) {
      this.$nextTick(() => {
        let chart = this.$echarts.init(this.$refs[ref])
        let option = {
          title: {
            text: opt.title,
            left: 'center',
            top: 15
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: '次数',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }

        // 使用刚指定的配置项和数据显示图表。
        chart.setOption(option)
      })
    },
    getResult_chart (taskid) {
      this.dataZJ = {
        num: [],
        value: []
      }
      this.dataBJ = {
        num: [],
        value: []
      }
      this.dialListModal_chart = true
      this.axios.post('/dataSta/retrieval/getResult/' + taskid, {
        'criterion': {},
        'mode': 'desc',
        'pageIndex': 1,
        'pageSize': 20,
        'sortKey': 'createtime'
      }).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          if (data) {
            data.forEach((item) => {
              if (item.numtype === '0') {
                // 主叫
                this.dataZJ.num.push(item.phonenum)
                this.dataZJ.value.push(item.callsum)
              } else if (item.numtype === '1') {
                // 被叫
                this.dataBJ.num.push(item.phonenum)
                this.dataBJ.value.push(item.callsum)
              }
            })
          }
          this.drawChart('chartOne', this.dataZJ, {title: '主叫统计'})
        } else {
          this.$Message.error(response.msg)
        }
      }).catch((e) => {})
    },
    getResult (taskid) {
      this.dialListModal = true
      this.axios.post('/dataSta/retrieval/getResult/' + taskid, {
        'criterion': {},
        'mode': 'desc',
        'pageIndex': 1,
        'pageSize': 10,
        'sortKey': 'createtime'
      }).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data[0]
          let pieData = {
            pieOne: [
              {name: '闲时次数', value: data.leisure_sum || 0},
              {name: '忙时次数', value: data.busy_sum || 0}
            ],
            pieTwo: [
              {name: '来话次数', value: data.calledsum || 0},
              {name: '去话次数', value: data.callingsum || 0}
            ],
            pieThree: [
              {name: '录音次数', value: data.recordsum || 0},
              {name: '未录音次数', value: (data.callsum - data.recordsum) || 0}
            ],
            pieFour: [
              {name: '0-10次', value: data.distinct_sum1 || 0},
              {name: '10-20次', value: data.distinct_sum2 || 0},
              {name: '20-30次', value: data.distinct_sum3 || 0},
              {name: '30次以上', value: data.distinct_sum4 || 0}
            ],
            pieFive: [
              {name: '10秒以下', value: data.callsum1 || 0},
              {name: '10-100秒', value: data.callsum2 || 0},
              {name: '100秒以上', value: data.callsum3 || 0}
            ]
          }
          this.drawPie('pieOne', {title: '通话次数'}, pieData.pieOne)
          this.drawPie('pieTwo', {title: '通话次数'}, pieData.pieTwo)
          this.drawPie('pieThree', {title: '通话次数'}, pieData.pieThree)
          this.drawPie('pieFour', {title: '号码个数'}, pieData.pieFour)
          this.drawPie('pieFive', {title: '平均通话时长'}, pieData.pieFive)
        } else {
          this.$Message.error(response.msg)
        }
      }).catch((e) => {})
    },
    downloadFile (taskid, filename) { // 下载文件
      this.axios.get('/dataSta/retrieval/download/' + taskid, {
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
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()
        }
      })
    }
  }
}
</script>

<style scoped>
.box-mession {
  display: flex;
  width: 100%;
  height: 100%;
}
.box-mession-sons {
  flex:1;
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.border-RL {
  border: 1px solid #dcdee2;
}
.border-NotRL {
  border-width: 1px 0;
}
.border-NotTop {
  border-top: 0;
}
.border-NotR {
  border-right: 0;
}
.btn-tongji {
  color: rgb(255, 255, 255);
  position: absolute;
  top: 20px;
  right: 20px;
  border: 2px solid #155591;
  padding: 5px;
  border-radius: 5px;
  font-size: 16px;
  width: 100px;
  background-color: #125c9c;
  cursor: pointer;
  text-align:center;
}
.btn-tongji:hover{
  background-color: #0089ff;
}
.btn-tongji-sp {
  right: 125px;
}
</style>

<style lang="css">
@import "../../../../static/css/base.css"
</style>
