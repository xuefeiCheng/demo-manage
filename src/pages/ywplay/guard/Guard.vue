<template>
  <div>
    <div class="main-header">
      <Form ref="searchForm" :label-width="80">
        <Row>
        </Row>
      </Form>
    </div>

    <Row class="main-content">
      <Table border size='large'  height='400'  :loading="tableLoading" highlight-row :columns='tableTitle' :data="tableData"></Table>
    </Row>

    <Row>
      <Page :total="pageConfig.total" :current='pageConfig.pageIndex' :page-size="pageConfig.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer show-elevator show-total />
    </Row>
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
      tableLoading: false,
      total: 0,
      tableTitle: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '接入码',
          key: 'accesscode'
        },
        {
          title: '局点编码',
          key: 'frontid'
        },
        {
          title: '主叫号码',
          key: 'callingnumber'
        },
        {
          title: '被叫号码',
          key: 'callednumber'
        },
        {
          title: '呼叫时间',
          key: 'starttime',
          render: (h, params) => {
            return h(
              'span',
              `${params.row.starttime.slice(
                0,
                4
              )}-${params.row.starttime.slice(
                4,
                6
              )}-${params.row.starttime.slice(6, 8)} 
              ${params.row.starttime.slice(
    8,
    10
  )}:${params.row.starttime.slice(
  10,
  12
)}:${params.row.starttime.slice(12, 14)}`
            )
          }
        },
        {
          title: '呼叫结果',
          key: 'callresult'
        },
        {
          title: '操作',
          key: 'filename', // 后台的字段
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.play(params.row.hasrecord, params.row.filename) // 后台的字段
                }
              }
            }, '播放')
          }
        }
      ],
      playInfo: {
        url: '',
        token: '',
        play: false
      },
      audio: null,
      tableData: [],
      // 分页的默认配置
      pageConfig: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.playInfo.url = this.axios.defaults.baseURL
    this.playInfo.token = this.$store.getters.token
    this.searchData()
  },
  computed: {
    // delTimeOption () {
    //   if (this.searchForm.createTime !== '') {
    //     return {
    //       disabledDate: date => {
    //         return date.valueOf() <= this.searchForm.createTime.valueOf()
    //       }
    //     }
    //   }
    // },
    // createTimeOption () {
    //   if (this.searchForm.delTime !== '') {
    //     return {
    //       disabledDate: date => {
    //         return date.valueOf() >= this.searchForm.delTime.valueOf()
    //       }
    //     }
    //   }
    // }
  },
  methods: {
    // initailSearch (formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       this.pageConfig.pageSize = 10
    //       this.pageConfig.pageIndex = 1
    //       this.searchData()
    //     } else {
    //       this.$Message.error('提交的格式错误')
    //     }
    //   })
    // },
    // 搜索数据
    searchData () {
      this.tableLoading = true
      this.axios
        .post('/serviceDisplay/guardData', {
          mode: 'desc',
          pageSize: this.pageConfig.pageSize,
          pageIndex: this.pageConfig.pageIndex,
          criterion: {}
        })
        .then(data => {
          if (data.code === 200) {
            this.tableData = data.data.list
            this.pageConfig.total = data.data.count
          } else {
            this.$Message.error('数据请求失败')
          }
          this.tableLoading = false
        })
    },
    pageChange (pageIndex) {
      this.pageConfig.pageIndex = pageIndex
      this.searchData()
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize
      this.searchData()
    },
    play (flag, id) {
      // flag 是否有录音文件 0：有 1：无
      if (flag === '1') {
        this.$Message.error('暂无音频文件')
        return
      }
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
        this.audio.src = this.playInfo.url + '/serviceDisplay/guardData/shiting/' + id + '?token=' + this.playInfo.token
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

<style>
.main-header {
  padding-top: 1em;
  padding-bottom: 1em;
}
.main-content {
  padding-bottom: 1em;
}
</style>
