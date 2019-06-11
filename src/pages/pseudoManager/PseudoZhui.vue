<template lang="html">
  <div class="classify" ref="divWidth">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="分类名称">
            <Input v-model="search.psoname" placeholder="请输入要查询的基站名称..."></Input>
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
    <Table border highlight-row :loading="loading" :columns="columns" :data="data" :width="maxWidth"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>
    <Modal v-model="modal11" fullscreen footer-hide :closable="false">
        <p slot="header" style="width: 100%;">
          <a style="float: right;" @click='closeModal'>关闭</a>
        </p>
        <div id="baiduMap" ref="baiduMap" style="width: 100%; height: 100%;"></div>
    </Modal>
  </div>
</template>

<script>
import {pslistManager} from 'static/data/staticdata.js'
export default {
  data () {
    return {
      modal11: false,
      maxWidth: 0,
      search: {

        psoname: ''
      },
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '基站名称',
          key: 'psoname'
        }, {
          title: 'cellid',
          key: 'cellid'
        }, {
          title: 'lacid',
          key: 'lacid'
        }, {
          title: '5分钟受影响用户个数',
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (20 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '5分钟内位置更新次数',
          render: (h) => {
            // let num = parseInt(Math.random() * (max - min + 1) + min, 10)
            let num = parseInt(Math.random() * (20 - 10 + 1) + 10, 10)
            return h('span', num)
          }
        }, {
          title: '发现时间',
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
          title: '伪基站ID',
          key: 'staid'
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
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.findByStaid(params.row.staid, params.row.lat, params.row.lng)
                    }
                  }
                },
                '轨迹查看'
              )
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
      timeout: null
    }
  },
  mounted () {
    this.maxWidth = this.$refs.divWidth.offsetWidth - 10
    this.init()
  },
  methods: {
    init () { // 初始化列表
      this.page.current = 1
      this.loading = true
      this.axios.get('/pathTrancking').then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data.list.concat(pslistManager)
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
      this.search.psoname = ''
      this.page.size = 10
      this.init()
    },
    handleTime (time) {
      this.search.time = time
    },
    getSearchCondition () {
      return {
        'psoname': this.search.psoname
      }
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      page = page - 1
      this.axios.post('/pathTrancking/' + page + '/' + this.page.size, this.getSearchCondition()).then((response) => {
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
      this.axios.post('/pathTrancking/0/' + size, this.getSearchCondition()).then((response) => {
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
    findByStaid (id, lat, lng) {
      this.modal11 = true
      this.createMap(id, lat, lng)
    },
    changeLoading () { // 关闭加载状态
      this.addLoading = false
      this.$nextTick(() => {
        this.addLoading = true
      })
    },
    createMap (id, lat, lng) {
      this.axios.post('/pathTrancking/queryByStaid/' + id, this.getSearchCondition()).then((response) => {
        let code = response.code
        if (code === 200) {
          let datagj = response.data
          let i = 0
          let points = []
          let bPoints = []
          this.timeout = setInterval(() => {
            if (i < datagj.length) {
              let lng = datagj[i].lng
              let lat = datagj[i].lat
              this.dynamicLine(lng, lat, points, bPoints)
              i++
            } else {
              window.clearInterval(this.timeout)
            }
          }, 1000)
          this.map = new window.BMap.Map('baiduMap', {})
          // this.map.setCurrentCity('南宁') // 创建中心城市
          // this.map.centerAndZoom(new window.BMap.Point(108.368855, 22.821808), 13) // 创建中心点
          this.map.centerAndZoom(new window.BMap.Point(lng, lat), 14) // 创建中心点
          // this.map.panTo(new window.BMap.Point(lng, lat))
          this.map.enableScrollWheelZoom() // 开启鼠标滚轮缩放
          this.map.setMinZoom(8) // 最小缩放级别
          this.map.setMaxZoom(15) // 最大缩放级别
          this.map.setViewport(bPoints)
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    dynamicLine (lng, lat, points, bPoints) {
      let point = {'lng': lng, 'lat': lat}
      let makerPoints = []
      let newLinePoints = []
      let len
      makerPoints.push(point)
      this.addMarker(makerPoints)
      points.push(point)
      bPoints.push(new window.BMap.Point(lng, lat))
      len = points.length
      newLinePoints = points.slice(len - 2, len)
      this.addLine(newLinePoints)
    },
    addLine (points) {
      let linePoints = []
      let pointsLen = points.length
      for (var i = 0; i < pointsLen; i++) {
        linePoints.push(new window.BMap.Point(points[i].lng, points[i].lat))
      }
      let polyline = new window.BMap.Polyline(linePoints, {strokeColor: 'green', strokeWeight: 5, strokeOpacity: 1})
      this.map.addOverlay(polyline)
    },
    addMarker (points) {
      for (var i = 0, pointsLen = points.length; i < pointsLen; i++) {
        var point = new window.BMap.Point(points[i].lng, points[i].lat)
        var marker = new window.BMap.Marker(point)
        this.map.addOverlay(marker)
      }
    },
    closeModal () {
      this.modal11 = false
      this.map.clearOverlays() // 清除覆盖物
      this.datagj = null
      window.clearInterval(this.timeout)
    }
  }
}
</script>

<style lang="css">
/*面板分割*/
.classify {
  border: 1px solid #dcdee2;
  padding: 10px;
}

/*左右向滚动条隐藏*/
.ivu-table-tip {
  overflow-x: hidden;
}

/*搜索按钮*/
.searchBtn {
  margin: 0 25px;
}

/*分割线*/
.ivu-divider-horizontal {
  height: 2px;
}

/*分页控件*/
.tab_footer {
  margin-top: 10px;
  text-align: center;
  overflow: hidden;
}
.ivu-page-total {
  float: left;
  margin-left: 15px;
}
.ivu-page-options {
  float: right;
  margin-right: 15px;
}
</style>
