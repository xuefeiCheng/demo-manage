<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search"  style="margin-left:0.3rem">
      <Row>
        <Col span="8">
          <FormItem label="时间段" >
            <DatePicker type="daterange" :clearable="false"   :editable="false" :split-panels='true' v-model="search.time"
             placeholder="请输入时间" style="width:85%" ></DatePicker>
          </FormItem>
        </Col>
        <Col span="8" justify="start">
          <FormItem>
            <Button type="success"  icon="ios-search" class="searchBtn" @click="handlePage(1)">搜索</Button>
            <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset()">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider/>

    <Table border highlight-row :loading="loading" :columns="columns" :data="data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>

  </div>
</template>

<script>
import { dateToString } from '@/utils/timeFormat'
export default {
  data () {
    return {
      search: {
        time: ''
      },
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '统计时间',
          key: 'reportTime',
          render: (h, params) => {
            let dateStr = params.row.reportTime
            let dateFormat = dateStr.substring(0, 4) + '-' + dateStr.substring(4, 6) + '-' + dateStr.substring(6, 8)
            return h('span', dateFormat)
          }
        }, {
          title: '操作时间',
          key: 'operTime',
          render: (h, params) => {
            let time = params.row.operTime
            let formatTime = time
            if (time.length === 14) {
              formatTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' +
                time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12)
            }
            return h('span', formatTime)
          }
        }, {
          title: '操作表名',
          key: 'operTableName'
        }, {
          title: '操作文件名',
          key: 'operFileName'

        },
        {
          title: '操作粒度',
          key: 'operType',
          render: (h, params) => {
            let styleName = ''
            let fontColor = ''
            switch (params.row.operType) {
              case '1':
                styleName = '日报'
                fontColor = '#FF3030'
                break
              case '2':
                styleName = '周报'
                fontColor = '#FF1493'
                break
              case '3':
                styleName = '月报'
                fontColor = '#B23AEE'
                break
            }

            return h('span', {style: {color: fontColor}}, styleName)
          }
        },
        {
          title: '操作',
          key: 'operation',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.downloadFile(params.row.reportTime, params.row.operType, params.row.operFileName)
                  }
                }
              }, '下载')
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
    init () { // 初始化列表
      this.page.current = 1
      this.loading = true
      this.axios.post('/dataSta/reportSta/0/10', {}).then((response) => {
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
      this.search.time = ''
      this.page.size = 10
      this.init()
    },
    getSearchCondition () {
      let searchData = {beginTime: '', endTime: ''}

      if (this.search.time[0] !== '' && this.search.time !== '') {
        searchData.beginTime = dateToString(this.search.time[0]).slice(0, 8)
        searchData.endTime = dateToString(this.search.time[1]).slice(0, 8)
      } else {
        searchData = {}
      }
      return searchData
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      page = page - 1
      this.axios.post('/dataSta/reportSta/' + page + '/' + this.page.size, this.getSearchCondition()).then((response) => {
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
      this.axios.post('/dataSta/reportSta/0/' + size, this.getSearchCondition()).then((response) => {
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
    downloadFile (reportTime, operType, operFileName) { // 删除记录
      this.axios.get('/dataSta/reportSta/download/' + reportTime + '/' + operType, {
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
          link.setAttribute('download', operFileName + '.txt')
          document.body.appendChild(link)
          link.click()
        }
      })
    },
    changeLoading () { // 关闭加载状态
      this.addLoading = false
      this.$nextTick(() => {
        this.addLoading = true
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
