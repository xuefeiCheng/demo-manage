<template lang="html">
  <Tabs type="card" :animated="false">
    <TabPane label="设备信息展示">
      <Form :label-width="100" :model="tab1.search">
        <Row>
          <Col span="8">
            <FormItem label="运营商">
              <Select style="width: 100%;" placeholder="请选择要切换的运营商" v-model="tab1.search.yys">
                <Option value="0">移动</Option>
                <Option value="1">电信</Option>
                <Option value="2">联通</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="设备类型">
              <Select style="width: 100%;" placeholder="请选择要切换的设备类型" v-model="tab1.search.SBtype">
                <Option value="jizhan">基站</Option>
                <Option value="guankou">关口局</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8" style="text-align: center;">
            <FormItem>
              <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="createBoundary(tab1.search.SBtype)">切换</Button>
              <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="tab1HandleReset()">重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div id="baiduMap" ref="baiduMap" :style="{width: mapWidth, height: mapHeight}"></div>
    </TabPane>
    <TabPane label="移网数据信息展示">
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
    <TabPane label="交换网业务数据展示">
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
              <FormItem label="局方向">
                <Select v-model="tab3.search.type" style="width: 100%;" placeholder="请选择要查询的局方向">
                  <Option v-for="item in tab3.typeList" :value="item.key" :key="item.value">{{ item.value }}</Option>
                </Select>
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
    <TabPane label="传输层数据展示">
      <div class="div-border">
        <!-- 搜索区域 -->
        <Form :model="tab4.search" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="查询时间">
                <DatePicker v-model="tab4.search.time" type="daterange" placement="bottom-end" :options="tab4.endTimeOptions"
                  @on-change="tab4HandleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="传输层">
                <Select v-model="tab4.search.type" style="width: 100%;" placeholder="请选择要查询的传输层">
                  <Option v-for="item in tab4.typeList" :value="item.key" :key="item.value">{{ item.value }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="tab4HandlePage(1)">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="tab4HandleReset">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <Divider/>

        <!-- 数据表格区域 -->
        <Table border highlight-row :loading="tab4.table.loading" :columns="tab4.table.columns" :data="tab4.table.data"></Table>
        <div class="tab_footer">
          <Page :total="tab4.page.total" :current="tab4.page.current" :page-size="tab4.page.size" show-total show-elevator show-sizer
            @on-change.self="tab4HandlePage" @on-page-size-change.self="tab4HandleSize"></Page>
        </div>
      </div>
    </TabPane>
    <TabPane label="人流量热力展示">
      <div id="flowrateMap" ref="flowrateMap" :style="{width: mapWidth, height: mapHeightFull}"></div>
    </TabPane>
    <TabPane label="设备告警热力展示">
      <div id="gxMap" ref="gxMap" :style="{width: mapWidth, height: mapHeightFull}"></div>
    </TabPane>
  </Tabs>
</template>

<script>
export default {
  data () {
    return {
      mapWidth: document.body.clientWidth - 240 + 'px',
      mapHeightFull: document.body.clientHeight - 160 + 'px',
      mapHeight: document.body.clientHeight - 220 + 'px',
      map: null,
      flowratemap: null,
      heatmapOverlay: '',
      tab1: {
        search: {
          yys: '',
          SBtype: ''
        }
      },
      tab2: {
        endTimeOptions: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now()
          }
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
              title: '单基站连接用户数(每小时)',
              key: 'singleStationUser'
            }, {
              title: '单基站话务量(每小时)',
              key: 'singleStationTelephone',
              render: (h, params) => {
                return h('span', params.row.singleStationTelephone + '(erl)')
              }
            }, {
              title: '单基站数据业务量(每小时)',
              key: 'singleStationData'
            }, {
              title: '统计时间',
              key: 'createTime',
              render: (h, params) => {
                return h('span', this.formatTime(params.row.createTime))
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
          disabledDate (date) {
            return date && date.valueOf() > Date.now()
          }
        },
        search: {
          time: ['', ''],
          type: ''
        },
        typeList: [
          {
            key: '1',
            value: '端局'
          }, {
            key: '2',
            value: '关口局'
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
              title: '局方向',
              key: 'type',
              render: (h, params) => {
                let type = params.row.type
                let typeText = '异常数据'

                for (let i = 0; i < this.tab3.typeList.length; i++) {
                  let key = this.tab3.typeList[i].key
                  if (key === type) {
                    typeText = this.tab3.typeList[i].value
                    break
                  }
                }

                return h('span', typeText)
              }
            }, {
              title: '局ID',
              key: 'bureauId'
            }, {
              title: '用户量',
              key: 'userCount'
            }, {
              title: '话务量',
              key: 'telephoneCount'
            }, {
              title: '接通率',
              key: 'connectionRate',
              render: (h, params) => {
                return h('span', params.row.connectionRate + '%')
              }
            }, {
              title: '拥塞率',
              key: 'congestionRate',
              render: (h, params) => {
                return h('span', params.row.congestionRate + '%')
              }
            }, {
              title: '掉线率',
              key: 'droppingRate',
              render: (h, params) => {
                return h('span', params.row.droppingRate + '%')
              }
            }, {
              title: '统计时间',
              key: 'createTime',
              render: (h, params) => {
                return h('span', this.formatTime(params.row.createTime))
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
      tab4: {
        endTimeOptions: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now()
          }
        },
        search: {
          time: ['', ''],
          type: ''
        },
        typeList: [
          {
            key: '1',
            value: '区内长途层'
          }, {
            key: '2',
            value: '本地骨干层'
          }, {
            key: '3',
            value: '汇聚层'
          }
        ],
        stateList: [
          {
            key: '1',
            value: '正常'
          }, {
            key: '2',
            value: '异常'
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
              title: '传输层',
              key: 'type',
              render: (h, params) => {
                let type = params.row.type
                let typeText = '异常数据'

                for (let i = 0; i < this.tab4.typeList.length; i++) {
                  let key = this.tab4.typeList[i].key
                  if (key === type) {
                    typeText = this.tab4.typeList[i].value
                    break
                  }
                }

                return h('span', typeText)
              }
            }, {
              title: '逻辑拓扑图',
              key: 'logicTopo',
              render: (h, params) => {
                let name = params.row.logicTopo
                return h('viewer', [
                  h('img', {
                    attrs: {
                      src: this.axios.defaults.baseURL + '/analysis/transmission/' + name + '?token=' + this.$store.getters.token,
                      key: this.axios.defaults.baseURL + '/analysis/transmission/' + name + '?token=' + this.$store.getters.token,
                      width: 50,
                      height: 50
                    },
                    style: {
                      cursor: 'pointer'
                    }
                  })
                ])
              }
            }, {
              title: '光缆路由图',
              key: 'opticalCable',
              render: (h, params) => {
                let name = params.row.opticalCable
                return h('viewer', [
                  h('img', {
                    attrs: {
                      src: this.axios.defaults.baseURL + '/analysis/transmission/' + name + '?token=' + this.$store.getters.token,
                      key: this.axios.defaults.baseURL + '/analysis/transmission/' + name + '?token=' + this.$store.getters.token,
                      width: 50,
                      height: 50
                    },
                    style: {
                      cursor: 'pointer'
                    }
                  })
                ])
              }
            }, {
              title: '节点工作状态',
              key: 'nodeState',
              render: (h, params) => {
                let state = params.row.nodeState
                let stateText = '异常数据'

                for (var i = 0; i < this.tab4.stateList.length; i++) {
                  let data = this.tab4.stateList[i]
                  if (state === data.key) {
                    stateText = data.value
                    break
                  }
                }

                return h('span', stateText)
              }
            }, {
              title: '链路工作状态',
              key: 'linkState',
              render: (h, params) => {
                let state = params.row.linkState
                let stateText = '异常数据'

                for (var i = 0; i < this.tab4.stateList.length; i++) {
                  let data = this.tab4.stateList[i]
                  if (state === data.key) {
                    stateText = data.value
                    break
                  }
                }

                return h('span', stateText)
              }
            }, {
              title: '统计时间',
              key: 'createTime',
              render: (h, params) => {
                return h('span', this.formatTime(params.row.createTime))
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
      }
    }
  },
  mounted () {
    this.createBoundary()
    this.tab2List()
    this.tab3List()
    this.tab4List()
    this.tab5List()
    this.tab6List()
  },
  methods: {
    tab1HandleReset () {
      // 重置
      this.tab1 = {
        search: {
          yys: '',
          SBtype: ''
        }
      }
      this.createBoundary()
    },
    createMap (name) {
      if (name === 'baiduMap') {
        this.map = new window.BMap.Map(name, {})
        this.map.setCurrentCity('广西') // 创建中心城市
        this.map.centerAndZoom(new window.BMap.Point(109.231816505, 23.7411659265), 8) // 创建中心点
        this.map.enableScrollWheelZoom() // 开启鼠标滚轮缩放
        this.map.setMinZoom(8) // 最小缩放级别
        this.map.setMaxZoom(15) // 最大缩放级别
      } else if (name === 'flowrateMap') {
        this.flowratemap = new window.BMap.Map(name, {})
        this.flowratemap.setCurrentCity('广西') // 创建中心城市
        this.flowratemap.centerAndZoom(new window.BMap.Point(109.231816505, 23.7411659265), 8) // 创建中心点
        this.flowratemap.enableScrollWheelZoom() // 开启鼠标滚轮缩放
        this.flowratemap.setMinZoom(8) // 最小缩放级别
        this.flowratemap.setMaxZoom(15) // 最大缩放级别
      }
    },
    createBoundary (type) {
      this.createMap('baiduMap')

      this.axios.get(this.jsonURL + '/static/map/boundaries/gx/gx.json').then((res) => {
        let count = res.boundaries.length
        let pointArray = []
        for (var i = 0; i < count; i++) {
          let ply = new window.BMap.Polygon(res.boundaries[i], {
            strokeWeight: 2, // 多边形线粗
            strokeOpacity: 1, // 多边形线透明度
            strokeStyle: 'solid', // 多边形线为实线
            strokeColor: '#ff0000', // 多边形线颜色
            fillColor: '#00ffff', // 区域填充颜色
            fillOpacity: 0.001 // 区域填充颜色透明度
          }) // 建立多边形
          this.map.addOverlay(ply)
          pointArray = pointArray.concat(ply.getPath())
        }
        this.map.setViewport(pointArray) // 调整视野
      })

      this.drawPoint(type)
    },
    drawPoint (type) {
      const guankou = {
        station: [],
        telephone: [
          {
            area: '北京市朝阳区',
            id: '4rfv',
            lat: 24.746900452688525,
            lon: 110.23839443300002,
            name: '关口局5',
            state: '退役',
            type: '2'

          },
          {
            area: '北京市',
            id: '41fv',
            lat: 24.646900452688525,
            lon: 109.43839443300002,
            name: '关口局9',
            state: '退役',
            type: '2'

          }
        ]
      }
      const jizhan = {
        station: [
          {
            area: '北京市海淀区知春路',
            id: '1qaz',
            lat: 23.747131263474852,
            lon: 109.23830697135395,
            name: '基站9',
            state: '正常',
            type: '1'
          }
        ],
        telephone: []
      }
      let _this = this

      let opts = {
        width: 200, // 信息窗口宽度
        height: 100, // 信息窗口高度
        title: '未知设备信息', // 信息窗口标题
        enableMessage: true, // 设置允许信息窗发送短息
        message: ''
      }

      this.axios.get('/analysis/device').then((resp) => {
        let code = resp.code
        let stationData
        let phoneData
        if (code === 200) {
          if (type === 'guankou') {
            stationData = guankou.station
            phoneData = guankou.telephone
          } else if (type === 'jizhan') {
            stationData = jizhan.station
            phoneData = jizhan.telephone
          } else {
            stationData = resp.data.station
            phoneData = resp.data.telephone
          }
          // let stationData = resp.data.station
          // let phoneData = resp.data.telephone
          for (let i = 0; i < stationData.length; i++) {
            let type = stationData[i].type
            if (type === '1') {
              opts.title = '2/3G基站信息'
            } else if (type === '2') {
              opts.title = '4G基站信息'
            } else {
              opts.title = '未知设备信息'
            }

            let content = '<div>基站ID: ' + stationData[i].id + '<br/>基站名称: ' +
              stationData[i].name + '<br/>基站地址: ' + stationData[i].area +
              '<br/>基站状态: ' + stationData[i].state + '</div>'

            let infoWindow = new window.BMap.InfoWindow(content, opts)
            let point = new window.BMap.Point(stationData[i].lon, stationData[i].lat)
            var stationIcon = new window.BMap.Icon('../../../../static/img/station.png', new window.BMap.Size(48, 32))
            let marker = new window.BMap.Marker(point, {icon: stationIcon})

            this.map.addOverlay(marker)
            marker.addEventListener('mouseover', function () {
              _this.map.openInfoWindow(infoWindow, point) // 开启信息窗口
            })
          }

          for (let i = 0; i < phoneData.length; i++) {
            let type = phoneData[i].type
            if (type === '1') {
              opts.title = '长途局信息'
            } else if (type === '2') {
              opts.title = '关口局信息'
            } else if (type === '3') {
              opts.title = '端局信息'
            } else {
              opts.title = '未知设备信息'
            }

            let content = '<div>局ID: ' + phoneData[i].id + '<br/>局名称: ' +
              phoneData[i].name + '<br/>局地址: ' + phoneData[i].area +
              '<br/>局状态: ' + phoneData[i].state + '</div>'

            let infoWindow = new window.BMap.InfoWindow(content, opts)
            let point = new window.BMap.Point(phoneData[i].lon, phoneData[i].lat)
            let marker = new window.BMap.Marker(point)

            this.map.addOverlay(marker)
            marker.addEventListener('mouseover', function () {
              _this.map.openInfoWindow(infoWindow, point) // 开启信息窗口
            })
          }
        } else {
          this.$Message.error(resp.msg)
        }
      })
    },
    tab2List () {
      this.tab2.table.loading = true
      let current = this.tab2.page.current - 1
      let size = this.tab2.page.size

      this.axios.post('/analysis/business/' + current + '/' + size, this.getSearchCondition(this.tab2.search.time)).then((resp) => {
        let code = resp.code

        if (code === 200) {
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
    tab4List () {
      this.tab4.table.loading = true
      let current = this.tab4.page.current - 1
      let size = this.tab4.page.size

      let condi = this.getSearchCondition(this.tab4.search.time)
      condi.type = this.tab4.search.type

      this.axios.post('/analysis/transmission/' + current + '/' + size, condi).then((resp) => {
        let code = resp.code

        if (code === 200) {
          let data = resp.data
          this.tab4.page.total = data.count
          this.tab4.table.data = data.list
        } else {
          this.$Message.error(resp.msg)
        }

        this.tab4.table.loading = false
      }).catch((e) => {
        this.tab4.table.loading = false
      })
    },
    tab4HandleTime (time) {
      this.tab4.search.time = time
    },
    tab4HandlePage (page) {
      this.tab4.page.current = page

      this.tab4List()
    },
    tab4HandleSize (size) {
      this.tab4.page.size = size

      this.tab4List()
    },
    tab4HandleReset () {
      this.tab4.search.time = ['', '']
      this.tab4.search.type = ''
      this.tab4.page.current = 1

      this.tab4List()
    },
    tab5List () {
      this.createMap('flowrateMap')
      setTimeout(() => {
        this.tab5Points()
      }, 200)
    },
    tab5Points () {
      const points = [
        {'lng': 110.2858261, 'lat': 23.321984, 'count': 50},
        {'lng': 110.6853332, 'lat': 23.316532, 'count': 51},
        {'lng': 110.2819787, 'lat': 23.330658, 'count': 15},
        {'lng': 110.1858455, 'lat': 23.320921, 'count': 40},
        {'lng': 110.2828843, 'lat': 23.315516, 'count': 100},
        {'lng': 110.382546, 'lat': 23.318503, 'count': 26},
        {'lng': 110.4823289, 'lat': 23.319989, 'count': 18},
        {'lng': 110.2818162, 'lat': 23.315051, 'count': 80},
        {'lng': 110.1822023, 'lat': 23.31782, 'count': 11},
        {'lng': 110.381387, 'lat': 23.317253, 'count': 37},
        {'lng': 110.281773, 'lat': 23.319426, 'count': 42},
        {'lng': 110.4821107, 'lat': 23.316445, 'count': 34},
        {'lng': 110.0817521, 'lat': 23.317943, 'count': 27},
        {'lng': 110.0869812, 'lat': 23.420836, 'count': 23},
        {'lng': 110.0820682, 'lat': 23.51463, 'count': 60},
        {'lng': 110.0865424, 'lat': 23.224675, 'count': 38},
        {'lng': 110.0819242, 'lat': 23.314509, 'count': 15},
        {'lng': 110.0822766, 'lat': 23.521408, 'count': 25},
        {'lng': 110.0851674, 'lat': 23.224236, 'count': 21},
        {'lng': 110.0827268, 'lat': 23.52267, 'count': 31},
        {'lng': 110.0817721, 'lat': 23.320034, 'count': 51},
        {'lng': 110.0812456, 'lat': 23.22667, 'count': 47},
        {'lng': 110.0820432, 'lat': 23.119114, 'count': 11},
        {'lng': 110.0825013, 'lat': 23.521611, 'count': 35},
        {'lng': 110.0868733, 'lat': 23.431037, 'count': 22},
        {'lng': 110.0819336, 'lat': 23.431134, 'count': 44},
        {'lng': 110.0873557, 'lat': 23.323254, 'count': 45},
        {'lng': 110.0818367, 'lat': 23.42943, 'count': 43},
        {'lng': 110.0884312, 'lat': 23.349621, 'count': 100},
        {'lng': 110.0823874, 'lat': 23.359447, 'count': 87},
        {'lng': 110.0824225, 'lat': 23.323091, 'count': 32},
        {'lng': 110.0857801, 'lat': 23.3431854, 'count': 44},
        {'lng': 110.0817129, 'lat': 23.353227, 'count': 21},
        {'lng': 110.0826426, 'lat': 23.312286, 'count': 80},
        {'lng': 110.04841597, 'lat': 23.23948, 'count': 32},
        {'lng': 111.0813895, 'lat': 23.320787, 'count': 26},
        {'lng': 110.2853563, 'lat': 23.321197, 'count': 17},
        {'lng': 110.5837982, 'lat': 23.322547, 'count': 17},
        {'lng': 110.1876126, 'lat': 23.321938, 'count': 25},
        {'lng': 110.231326, 'lat': 23.315782, 'count': 100},
        {'lng': 110.2379223, 'lat': 23.316759, 'count': 23},
        {'lng': 110.4277185, 'lat': 23.329123, 'count': 11},
        {'lng': 110.0247237, 'lat': 23.327518, 'count': 9},
        {'lng': 110.0137784, 'lat': 23.315754, 'count': 47},
        {'lng': 110.0590193, 'lat': 23.317061, 'count': 52},
        {'lng': 110.05312735, 'lat': 23.3141619, 'count': 100},
        {'lng': 110.08528495, 'lat': 23.13158, 'count': 46},
        {'lng': 110.0866292, 'lat': 23.4131106, 'count': 19},
        {'lng': 109.0869916, 'lat': 23.324055, 'count': 18},
        {'lng': 108.085189, 'lat': 23.321308, 'count': 11},
        {'lng': 110.54853765, 'lat': 23.329376, 'count': 13},
        {'lng': 110.0858232, 'lat': 23.320348, 'count': 50},
        {'lng': 110.28187554, 'lat': 23.330511, 'count': 15},
        {'lng': 109.9848568, 'lat': 23.318161, 'count': 23},
        {'lng': 110.2853461, 'lat': 23.126306, 'count': 23},
        {'lng': 110.2287232, 'lat': 23.22161, 'count': 13},
        {'lng': 110.28374, 'lat': 23.128616, 'count': 6},
        {'lng': 110.24834679, 'lat': 23.115499, 'count': 21},
        {'lng': 110.382171, 'lat': 23.415738, 'count': 29},
        {'lng': 110.3817836, 'lat': 23.416998, 'count': 99},
        {'lng': 110.34920755, 'lat': 23.4528001, 'count': 10},
        {'lng': 110.214077, 'lat': 23.330655, 'count': 14},
        {'lng': 110.3926092, 'lat': 23.222995, 'count': 16},
        {'lng': 110.2391535, 'lat': 23.331054, 'count': 15},
        {'lng': 110.4213022, 'lat': 23.321895, 'count': 13},
        {'lng': 110.2415551, 'lat': 23.413373, 'count': 17},
        {'lng': 110.4321191, 'lat': 23.426572, 'count': 21},
        {'lng': 110.3289612, 'lat': 23.517119, 'count': 9},
        {'lng': 110.5288237, 'lat': 23.421337, 'count': 54},
        {'lng': 110.2563776, 'lat': 23.521919, 'count': 26},
        {'lng': 110.3557694, 'lat': 23.42536, 'count': 17},
        {'lng': 110.5335377, 'lat': 23.514137, 'count': 19},
        {'lng': 110.22187434, 'lat': 23.414234, 'count': 43},
        {'lng': 110.521588, 'lat': 23.422622, 'count': 27},
        {'lng': 110.1898345, 'lat': 23.519467, 'count': 83},
        {'lng': 110.2896883, 'lat': 23.517171, 'count': 33},
        {'lng': 110.34853877, 'lat': 23.316659, 'count': 34},
        {'lng': 110.135712, 'lat': 23.415613, 'count': 14},
        {'lng': 110.24719869, 'lat': 23.331416, 'count': 12},
        {'lng': 110.216956, 'lat': 23.325377, 'count': 11},
        {'lng': 110.472066, 'lat': 23.325017, 'count': 38},
        {'lng': 110.42816244, 'lat': 23.320215, 'count': 91},
        {'lng': 110.41929, 'lat': 23.315908, 'count': 54},
        {'lng': 110.2522110, 'lat': 23.319658, 'count': 21},
        {'lng': 110.16183, 'lat': 23.325015, 'count': 15},
        {'lng': 110.2621969, 'lat': 23.313527, 'count': 34},
        {'lng': 110.3622936, 'lat': 23.321854, 'count': 24},
        {'lng': 110.571905, 'lat': 23.329217, 'count': 12},
        {'lng': 110.1824579, 'lat': 23.314987, 'count': 57},
        {'lng': 110.492076, 'lat': 23.315251, 'count': 70},
        {'lng': 110.0825867, 'lat': 23.318989, 'count': 8}]
      this.heatmapOverlay = new window.BMapLib.HeatmapOverlay({radius: 10, opacity: 0.4})
      this.flowratemap.addOverlay(this.heatmapOverlay)
      this.heatmapOverlay.setDataSet({ data: points, max: 50 })
    },
    tab6List () {
      let gxMapEch = this.$echarts.init(this.$refs.gxMap)

      let option = {
        title: {
          text: '设备告警热力展示',
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
          name: '设备告警',
          roam: false,
          label: {
            normal: {
              show: true,
              // position: ['50%', '50%'],
              formatter: function (params) {
                let name = params.name
                return name + '\n\n数量:' + params.value
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
    formatTime (time) {
      let formatTime = time
      if (time.length === 14) {
        formatTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' +
          time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12)
      }

      return formatTime
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

<style lang="css" scoped>
@import "../../../../static/css/base.css"

>>>.ivu-tabs-bar {
  margin-bottom: 0 !important
}

>>>.ivu-tabs-tabpane {
  overflow: hidden;
}
</style>
