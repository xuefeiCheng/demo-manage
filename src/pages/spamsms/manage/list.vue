<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="短信内容">
            <Input v-model="search.content" placeholder="请输入要查询的短信内容关键字..."></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="发现时间">
            <DatePicker v-model="search.time" type="daterange" placement="bottom-end" :options="endTimeOptions"
              @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="有害短信分类">
            <Select v-model="search.type" style="width: 100%;" placeholder="请选择要查询的有害短信分类">
              <Option v-for="item in typeList" :value="item.classifyType" :key="item.classifyType">{{ item.classifyName }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="发送号码">
            <Input v-model="search.calling" placeholder="请输入发送号码..."></Input>
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
    <Button size="large" type="primary" icon="ios-add-circle-outline" style="margin-bottom: 10px;"
      @click="exportTable">导出</Button>
    <Table border highlight-row :loading="loading" :columns="columns" :data="data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>
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
      search: {
        content: '',
        time: [new Date(), new Date()],
        type: '',
        calling: ''
      },
      typeList: [],
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '短信内容',
          key: 'smscontent',
          render: (h, params) => {
            let innerHTML = params.row.smscontent
            let keys = params.row.keywords
            if (keys != null) {
              let keyArr = keys.split('、')
              keyArr.map((item) => {
                item = this.escapeExprSpecialWord(item)
                innerHTML = innerHTML.replace(new RegExp(item, 'gm'), '<font color=\'red\'>' + item + '</font>')
              })
            }
            return h('span', {
              domProps: {
                innerHTML: innerHTML
              }
            })
          }
        }, {
          title: '短信类别',
          key: 'classtype',
          render: (h, params) => {
            let type = params.row.classtype
            let typeList = this.typeList
            let value = '其他'
            for (let i = 0; i < typeList.length; i++) {
              if (typeList[i].classifyType === type) {
                value = typeList[i].classifyName
                break
              }
            }
            return h('span', value)
          }
        }, {
          title: '关键词',
          key: 'keywords'
        }, {
          title: '发送号码',
          key: 'send',
          render: (h, params) => {
            let send = params.row.send
            send = send.substr(0, 3) + '****' + send.substr(-3)
            return h('span', send)
          }
        }, {
          title: '创建时间',
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
      this.axios.get('/spamsms/manage').then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.typeList = data.type
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
      this.search.content = ''
      this.search.type = ''
      this.search.calling = ''
      this.search.time = [new Date(), new Date()]
      this.page.size = 10
      this.init()
    },
    handleTime (time) {
      this.search.time = time
    },
    getSearchCondition () {
      let start = this.search.time[0]
      if (typeof start === 'object') {
        start = this.getDateStr(start)
      }
      let formatStart = ''
      if (start.length === 10) {
        formatStart = start.substring(0, 4) + start.substring(5, 7) + start.substring(8, 10) + '000000'
      }

      let end = this.search.time[1]
      if (typeof end === 'object') {
        end = this.getDateStr(end)
      }
      let formatEnd = ''
      if (end.length === 10) {
        formatEnd = end.substring(0, 4) + end.substring(5, 7) + end.substring(8, 10) + '235959'
      }

      return {
        'timeStart': formatStart,
        'timeEnd': formatEnd,
        'type': this.search.type,
        'content': this.search.content,
        'calling': this.search.calling
      }
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      page = page - 1
      this.axios.post('/spamsms/manage/' + page + '/' + this.page.size, this.getSearchCondition()).then((response) => {
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
      this.axios.post('/spamsms/manage/0/' + size, this.getSearchCondition()).then((response) => {
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
    changeLoading () { // 关闭加载状态
      this.addLoading = false
      this.$nextTick(() => {
        this.addLoading = true
      })
    },
    exportTable () { // 导出垃圾短信
      this.$Modal.confirm({
        title: '操作确认',
        content: '将按照查询条件导出数据，是否导出？',
        okText: '导出',
        onOk: () => {
          this.axios.post('/spamsms/manage/export', this.getSearchCondition(), {
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
              link.setAttribute('download', '垃圾短信_' + this.getCurrentTime() + '.txt')

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
    escapeExprSpecialWord (keyword) {
      // 转义正则特殊字符 * . ? + $ ^ [ ] ( ) { } | \ /
      let fbsArr = ['\\', '$', '(', ')', '*', '+', '.', '[', ']', '?', '^', '{', '}', '|']
      fbsArr.map((key) => {
        if (keyword.indexOf(key) >= 0) {
          keyword = keyword.replace(key, '\\' + key)
        }
      })
      return keyword
    },
    getDateStr (date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1 // js中是从0开始所以要加1
      month = month < 10 ? '0' + month : month
      let day = date.getDate()
      day = day < 10 ? '0' + day : day

      let now = year + '-' + month + '-' + day
      return now
    }
  }
}
</script>

<style lang="css">
@import "../../../../static/css/base.css"
</style>
