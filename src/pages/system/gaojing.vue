<template lang="html">
  <Tabs type="card" :animated="false">
    <TabPane label="告警自动响应" style='min-height:400px'>
      <div class="div-border">
        <!-- 搜索区域 -->
        <Form :model="tab2.search" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="查询时间">
                <DatePicker v-model="tab2.search.time" type="daterange" placement="bottom-end" :options="tab2.endTimeOptions"
                  @on-change="tab2HandleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="tab2HandlePage(1)">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="tab2HandleReset">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <Divider/>

        <!-- 数据表格区域 -->
        <Table border highlight-row :loading="tab2.table.loading" :columns="tab2.table.columns" :data="tab2.table.data"></Table>
        <div class="tab_footer">
          <Page :total="tab2.page.total" :current="tab2.page.current" :page-size="tab2.page.size" show-total show-elevator show-sizer
            @on-change.self="tab2HandlePage" @on-page-size-change.self="tab2HandleSize"></Page>
        </div>
      </div>
    </TabPane>
    <TabPane label="告警关联分析">
      <div class="div-border">
        <!-- 搜索区域 -->
        <Form :model="tab3.search" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="查询时间">
                <DatePicker v-model="tab3.search.time" type="daterange" placement="bottom-end" :options="tab3.endTimeOptions"
                  @on-change="tab3HandleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="tab3HandlePage(1)">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="tab3HandleReset">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <Divider/>

        <!-- 数据表格区域 -->
        <Table border highlight-row :loading="tab3.table.loading" :columns="tab3.table.columns" :data="tab3.table.data"></Table>
        <div class="tab_footer">
          <Page :total="tab3.page.total" :current="tab3.page.current" :page-size="tab3.page.size" show-total show-elevator show-sizer
            @on-change.self="tab3HandlePage" @on-page-size-change.self="tab3HandleSize"></Page>
        </div>
      </div>
    </TabPane>
  </Tabs>
</template>

<script>
import {LACManagerTab1, LACManagerTab2} from 'static/data/staticdata.js'
export default {
  data () {
    return {
      map: null,
      heatmapOverlay: '',
      tab2: {
        endTimeOptions: {
          // disabledDate (date) {
          //   return date && date.valueOf() > Date.now()
          // }
        },
        search: {
          time: ['', '']
        },
        table: {
          loading: true,
          columns: [
            {
              type: 'index',
              width: 60,
              align: 'center'
            }, {
              title: '告警原因',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (2 - 0 + 1) + 0, 10)
                const arr = ['系统异常', '数据异常', '任务异常']
                return h('span', arr[num])
              }
            }, {
              title: '告警方式',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (2 - 0 + 1) + 0, 10)
                const arr = ['E-mail', '执行声音', '短信']
                return h('span', arr[num])
              }
            }, {
              title: '告警人',
              render: (h) => {
                let num = parseInt(Math.random() * (2 - 0 + 1) + 0, 10)
                const arr = ['admin', 'root', 'system']
                return h('span', arr[num])
              }
            }, {
              title: '处理结果',
              render: (h) => {
                let num = parseInt(Math.random() * (2 - 0 + 1) + 0, 10)
                const arr = ['已处理', '处理中', '未处理']
                return h('span', arr[num])
              }
            }, {
              title: '告警时间',
              key: 'timeString'
            }
          ],
          data: []
        },
        page: {
          current: 1,
          size: 10,
          total: 0
        }
      },
      tab3: {
        endTimeOptions: {
          // disabledDate (date) {
          //   return date && date.valueOf() > Date.now()
          // }
        },
        search: {
          time: ['', ''],
          type: ''
        },
        table: {
          loading: true,
          columns: [
            {
              type: 'index',
              width: 60,
              align: 'center'
            }, {
              title: '告警ID',
              key: 'bureauId'
            }, {
              title: '从属告警',
              render: (h) => {
                let num = parseInt(Math.random() * (2 - 0 + 1) + 0, 10)
                const arr = ['系统告警', '数据告警', '网络告警']
                return h('span', arr[num])
              }
            }, {
              title: '业务影响力',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (30 - 10 + 1) + 10, 10)
                return h('span', num)
              }
            }, {
              title: '用户影响力',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (50 - 10 + 1) + 10, 10)
                return h('span', num)
              }
            }, {
              title: '分析时间',
              key: 'createTime'
            }
          ],
          data: []
        },
        page: {
          current: 1,
          size: 10,
          total: 0
        }
      }
    }
  },
  mounted () {
    this.tab2List()
    this.tab3List()
  },
  methods: {
    tab2List () {
      this.tab2.table.loading = true
      let current = this.tab2.page.current - 1
      let size = this.tab2.page.size

      this.axios.post('/analysis/business/' + current + '/' + size, this.getSearchCondition(this.tab2.search.time)).then((resp) => {
        let code = resp.code

        if (code === 200) {
          resp = LACManagerTab1
          let data = resp.data
          this.tab2.page.total = data.count
          this.tab2.table.data = data.list
        } else {
          this.$Message.error(resp.msg)
        }

        this.tab2.table.loading = false
      }).catch((e) => {
        this.tab2.table.loading = false
      })
    },
    tab2HandleTime (time) {
      this.tab2.search.time = time
    },
    tab2HandlePage (page) {
      this.tab2.page.current = page

      this.tab2List()
    },
    tab2HandleSize (size) {
      this.tab2.page.size = size

      this.tab2List()
    },
    tab2HandleReset () {
      this.tab2.search.time = ['', '']
      this.tab2.page.current = 1

      this.tab2List()
    },
    tab3List () {
      this.tab3.table.loading = true
      let current = this.tab3.page.current - 1
      let size = this.tab3.page.size

      let condi = this.getSearchCondition(this.tab3.search.time)
      condi.type = this.tab3.search.type

      this.axios.post('/analysis/switch/' + current + '/' + size, condi).then((resp) => {
        let code = resp.code

        if (code === 200) {
          resp = LACManagerTab2
          let data = resp.data
          this.tab3.page.total = data.count
          this.tab3.table.data = data.list
        } else {
          this.$Message.error(resp.msg)
        }

        this.tab3.table.loading = false
      }).catch((e) => {
        this.tab3.table.loading = false
      })
    },
    tab3HandleTime (time) {
      this.tab3.search.time = time
    },
    tab3HandlePage (page) {
      this.tab3.page.current = page

      this.tab3List()
    },
    tab3HandleSize (size) {
      this.tab3.page.size = size

      this.tab3List()
    },
    tab3HandleReset () {
      this.tab3.search.time = ['', '']
      this.tab3.search.type = ''
      this.tab3.page.current = 1

      this.tab3List()
    },
    getSearchCondition (time) {
      let start = time[0]
      let formatStart = ''
      if (start.length === 10) {
        formatStart = start.substring(0, 4) + start.substring(5, 7) + start.substring(8, 10) + '000000'
      }
      let end = time[1]
      let formatEnd = ''
      if (end.length === 10) {
        formatEnd = end.substring(0, 4) + end.substring(5, 7) + end.substring(8, 10) + '235959'
      }

      return {
        'startTime': formatStart,
        'endTime': formatEnd
      }
    }
  }
}
</script>
