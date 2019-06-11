<template lang="html">
  <div class="voice topic">
    <Tabs :value='Tabflag' @on-click="handleFlag" type="card">
      <TabPane label="话题拦截量Top10" name="name1">
        <Form :model="search" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="时间检索">
                <DatePicker v-model="search.time" type="daterange" placement="bottom-end"
                  :options="options" :value="timeVlaue"
                  @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="handleTimeSearch()">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Divider/>
        <!-- 表格1区域 height='400' -->
        <Table border highlight-row  :loading="loading" :columns="columns" :data="data"></Table>
      </TabPane>
      <TabPane label="话题发现时间Top10" name="name2">
        <!-- 表格2区域 height='400' -->
        <Table border highlight-row :loading="loading" :columns="columns1" :data="data1"></Table>
      </TabPane>
       <TabPane label="被叫号码量Top10" name="name3">
         <Form :model="searchName3" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="时间检索">
                <DatePicker v-model="searchName3.time" type="datetimerange" :value="searchName3.time" :clearable="false" :editable="false" :split-panels='true'
                 :confirm="false"  @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="getTopicPhone()">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset1">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Divider/>
        <Table border highlight-row :loading="loading" :columns="columns2" :data="data2"></Table>
      </TabPane>
       <TabPane label="按宣传面向地排行" name="name4">
         <Form :model="searchName3" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="时间检索">
                <DatePicker v-model="searchName3.time" type="datetimerange" :value="searchName3.time" :clearable="false" :editable="false" :split-panels='true'
                 :confirm="false"  @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="getTopicPhone()">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset1">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Divider/>
        <Table border highlight-row :loading="loading" :columns="columns2" :data="data2"></Table>
      </TabPane>
      <TabPane label="按事件发生地排行" name="name5">
         <Form :model="searchName3" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="时间检索">
                <DatePicker v-model="searchName3.time" type="datetimerange" :value="searchName3.time" :clearable="false" :editable="false" :split-panels='true'
                 :confirm="false"  @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="getTopicPhone()">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset1">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Divider/>
        <Table border highlight-row :loading="loading" :columns="columns2" :data="data2"></Table>
      </TabPane>
      <TabPane label="按重点部门排行" name="name6">
        <Form :model="search" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="时间检索">
                <DatePicker v-model="search.time" type="daterange" placement="bottom-end"
                  :options="options" :value="timeVlaue"
                  @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="handleTimeSearch()">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Divider/>
        <!-- 表格1区域 height='400' -->
        <Table border highlight-row  :loading="loading" :columns="columns" :data="data"></Table>
      </TabPane>
      <TabPane label="按话题种类排行" name="name7">
        <Form :model="search" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="时间检索">
                <DatePicker v-model="search.time" type="daterange" placement="bottom-end"
                  :options="options" :value="timeVlaue"
                  @on-change="handleTime" placeholder="请选择查询时间段" style="width: 100%;"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem>
                <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="handleTimeSearch()">搜索</Button>
                <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Divider/>
        <!-- 表格1区域 height='400' -->
        <Table border highlight-row  :loading="loading" :columns="columns" :data="data"></Table>
      </TabPane>
    </Tabs>
    <!-- 播放器 -->
    <Modal v-model="playInfo.play" title="录音试听" footer-hide draggable style="text-align: center;" @on-visible-change="visibleModal">
      <audio ref="audio" controls autoplay>
        您的浏览器不支持 audio 元素。
      </audio>
    </Modal>
  </div>
</template>

<script>
import { dateToString } from '@/utils/timeFormat'
export default {
  data () {
    let now = this.getYYMMDD('-')
    let nowTime = []
    nowTime[0] = now + ' 23:59:59'
    nowTime[1] = now + ' 00:00:00'

    return {
      type: [],
      search: {
        time: ['', '']
      },
      searchName3: {
        time: [nowTime[1], nowTime[0]]
      },
      timeVlaue: ['', ''],
      Tabflag: 'name1', // tab flag
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '话题名称',
          key: 'name'
        }, {
          title: '拦截量',
          key: 'value',
          sortable: true
        }, {
          title: '内容试听',
          key: 'templateid',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.play(params.row.templateid)
                }
              }
            }, '播放')
          }
        }
      ],
      columns1: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '话题名称',
          key: 'name'
        }, {
          title: '发现时间',
          key: 'createtime',
          sortable: true
        }, {
          title: '内容试听',
          key: 'templateid',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.play(params.row.templateid)
                }
              }
            }, '播放')
          }
        }
      ],
      columns2: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '话题名称',
          key: 'topictype'
        }, {
          title: '被叫号码量',
          key: 'times',
          sortable: true
        }, {
          title: '内容试听',
          key: 'templateid',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.playTopic(params.row.topicid)
                }
              }
            }, '播放')
          }
        }
      ],
      data: [],
      data1: [],
      data2: [],
      loading: true,
      playInfo: {
        url: '',
        token: '',
        play: false
      },
      audio: null,
      options: { // 禁止时间
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  mounted () {
    this.playInfo.url = this.axios.defaults.baseURL
    this.playInfo.token = this.$store.getters.token
    this.init()
  },
  methods: {
    initTime () { // 初始化时间 获取当前时间 yymdd
      const d = this.getYYMMDD('')
      this.search.time = ['', d]
      // const d1 = this.getYYMMDD('-')
      // const date = new Date()
      // const d2 = date.getFullYear() + '' + (date.getMonth() + 1) + '01'
      // this.timeVlaue = [d2, d1] // 默认当前时间前一个月
      // this.handleTime(this.timeVlaue)
    },
    init () { // 初始化列表
      sessionStorage.getItem('Tabflag') === null ? this.Tabflag = 'name1' : this.Tabflag = sessionStorage.getItem('Tabflag')
      this.loading = true
      this.initTime()
      this.getLanjie()
      this.getTopic()
      this.getTopicPhone()
    },
    getLanjie () {
      // 拦截量 话题top10
      this.axios.post('/serviceDisplay/topic/lanjie', {'starttime': this.search.time[0], 'endtime': this.search.time[1]}).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    getTopic () {
      // 发现时间 话题top10
      this.axios.get('/serviceDisplay/topic/new').then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data1 = data
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    getTopicPhone () {
      // 被叫号码量前10
      let queryUrl = '/serviceDisplay/topic/topNumber'
      if (this.searchName3.time[0] !== '') {
        let startTime = dateToString(this.searchName3.time[0]).slice(0, 14)
        let endTime = dateToString(this.searchName3.time[1]).slice(0, 14)
        queryUrl = queryUrl + '?endTime=' + endTime + '&starttime=' + startTime
      }
      this.axios.get(queryUrl).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data2 = data
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    // 切换tab
    handleFlag (f) {
      this.Tabflag = f
      sessionStorage.setItem('Tabflag', this.Tabflag)
    },
    handleTime (time) {
      for (let i = 0; i < 2; i++) {
        time[i] = time[i].replace(/-/g, '')
      }
      this.search.time = time
    },
    handleReset () { // 重置查询条件
      this.initTime()
      this.getLanjie()
    },
    handleReset1 () {
      let now = this.getYYMMDD('-')
      let nowTime = []
      nowTime[0] = now + ' 23:59:59'
      nowTime[1] = now + ' 00:00:00'
      this.searchName3.time = nowTime
    },
    handleTimeSearch () { // 根据时间段 搜索
      this.loading = true
      this.getLanjie()
    },
    // 获取当前时间 yymmdd
    getYYMMDD (type) {
      const date = new Date()
      const YY = date.getFullYear()
      const MM = date.getMonth() + 1
      const DD = date.getDate()
      return YY + type + MM + type + DD
    },
    play (id) {
      this.playInfo.play = true
      this.$nextTick(() => {
        if (this.audio == null) {
          this.audio = this.$refs.audio
          let _this = this
          this.audio.onerror = function () {
            _this.playInfo.play = false
            _this.$Message.error('音频文件获取失败')
          }
        }
        this.audio.src = this.playInfo.url + '/voicetemplate/shiTing/' + id + '?token=' + this.playInfo.token
      })
    },
    playTopic (id) {
      this.playInfo.play = true
      this.$nextTick(() => {
        if (this.audio == null) {
          this.audio = this.$refs.audio
          let _this = this
          this.audio.onerror = function () {
            _this.playInfo.play = false
            _this.$Message.error('音频文件获取失败')
          }
        }
        this.audio.src = this.playInfo.url + '/voicetemplate/shiTingByTop/' + id + '?token=' + this.playInfo.token
      })
    },
    visibleModal (show) {
      if (!show) {
        this.audio.pause()
        this.audio = null
        this.playInfo.play = false
      }
    }
  }
}
</script>

<style lang="css">
/*面板分割*/
.voice{
  border: 1px solid #dcdee2;
  padding: 10px 10px 25px 10px;
}

/*左右向滚动条隐藏*/
.topic .ivu-table-tip,
.topic .ivu-table-overflowX {
  overflow-x: hidden;
}
/*表格默认高度 */
.topic .ivu-table-tip{
  min-height: 200px;
}
/*搜索按钮*/
.topic .searchBtn {
  margin: 0 10px;
}

/*分割线*/
.topic .ivu-divider-horizontal {
  height: 2px;
}
/* 搜索条件 */
.topic .ivu-form-item{
  margin-bottom: 0;
}
.topic .ivu-divider-horizontal{
  margin: 16px 0;
}
/* 时间面板 */
.topic .ivu-select-dropdown{
  left: 0 !important;
}
</style>
