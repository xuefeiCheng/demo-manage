<template lang="html">
  <Tabs type="card" :animated="false">
    <TabPane label="伪基站危害力概况统计" style='min-height:400px'>
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
    <TabPane label="伪基站危害力统计分析">
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
    <TabPane label="各区域伪基站影响程度分析">
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
      <div id="gxMap" ref="gxMap" :style="{width: mapWidth, height: mapHeightFull}"></div>
    </TabPane>
  </Tabs>
</template>

<script>
import {LACManagerTab1, LACManagerTab2} from 'static/data/staticdata.js'
export default {
  data () {
    return {
      mapWidth: document.body.clientWidth - 240 + 'px',
      mapHeightFull: document.body.clientHeight - 280 + 'px',
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
              title: '统计时间',
              key: 'timeString'
            }, {
              title: 'GSM位置更新次数',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (100 - 50 + 1) + 50, 10)
                return h('span', num)
              }
            }, {
              title: 'GSM异常位置更新次数',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (100 - 50 + 1) + 50, 10)
                return h('span', num)
              }
            }, {
              title: '影响用户数',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (30 - 10 + 1) + 10, 10)
                return h('span', num)
              }
            }, {
              title: '总伪基站数量',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (100 - 50 + 1) + 50, 10)
                return h('span', num)
              }
            }, {
              title: '新增危机站数量',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (100 - 50 + 1) + 50, 10)
                return h('span', num)
              }
            }, {
              title: '伪基站影响力',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (100 - 50 + 1) + 50, 10)
                return h('span', num)
              }
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
              title: '伪基站轨迹ID',
              key: 'bureauId'
            }, {
              title: 'GSM位置更新次数',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (50 - 10 + 1) + 10, 10)
                return h('span', num)
              }
            }, {
              title: 'GSM异常位置更新次数',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (50 - 10 + 1) + 10, 10)
                return h('span', num)
              }
            }, {
              title: '影响用户数',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (30 - 10 + 1) + 10, 10)
                return h('span', num)
              }
            }, {
              title: '危害性',
              render: (h) => {
                // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
                let num = parseInt(Math.random() * (50 - 10 + 1) + 10, 10)
                return h('span', num)
              }
            }, {
              title: '统计时间',
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
    this.tab6List()
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
    tab6List () {
      let gxMapEch = this.$echarts.init(this.$refs.gxMap)

      let option = {
        title: {
          text: '各区域伪基站影响程度',
          left: 'center',
          top: '30'
        },
        tooltip: {
          trigger: 'item'
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          min: 0,
          max: 100,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [{
          type: 'map',
          map: '广西',
          name: '影响程度',
          roam: false,
          label: {
            normal: {
              show: true,
              // position: ['50%', '50%'],
              formatter: function (params) {
                let name = params.name
                if (params.value) {
                  return name + '\n\n影响程度:' + params.value
                } else {
                  return name
                }
              }
            },
            emphasis: {
              show: true
            }
          },
          data: [
            {name: '百色市', value: 87},
            {name: '河池市', value: 20},
            {name: '南宁市', value: 66},
            {name: '贵港市', value: 10}
          ]
        }]
      }
      gxMapEch.setOption(option)
      window.addEventListener('resize', function () {
        gxMapEch.resize()
      })
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
