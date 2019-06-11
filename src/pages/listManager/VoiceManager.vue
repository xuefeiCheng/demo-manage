<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="模板号">
            <Input v-model="search.templateid" placeholder="请输入要查询的模板号..."></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="模板名称">
            <Input v-model="search.templatename" placeholder="请输入要查询的模板名称..."></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="所属话单">
            <Select v-model="search.topicid">
              <Option v-for="item in type" :value="item.topicid" :key="item.topicid">{{ item.topictype }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="text-align: center;">
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
      @click="addModal = true">新增</Button>
    <Table border highlight-row :loading="loading" :columns="columns" :data="data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize"/>
    </div>

    <!-- 播放器 -->
    <Modal v-model="playInfo.play" title="录音试听" footer-hide draggable style="text-align: center;" @on-visible-change="visibleModal">
      <audio ref="audio" controls autoplay>
        您的浏览器不支持 audio 元素。
      </audio>
    </Modal>

    <!-- 新增关键词区域 -->
    <Modal
      v-model="addModal"
      title="新增关键词"
      @on-ok="saveVoice('add')"
      @on-cancel="cancel('add')"
      @on-visible-change="cancel('add')"
      :loading="addLoading">
        <Form ref="add" :model="add" :label-width="100" :rules="addRule">
          <FormItem label="所属话单" prop="topicid">
            <Select v-model="add.topicid">
              <Option v-for="item in type" :value="item.topicid" :key="item.topicid">{{ item.topictype }}</Option>
            </Select>
          </FormItem>
          <FormItem label="模板号" prop="templateid">
            <Input v-model="add.templateid" placeholder="请输入模板号..."></Input>
          </FormItem>
          <FormItem label="模板名称" prop="templatename">
            <Input v-model="add.templatename" placeholder="请输入模板名称..."></Input>
          </FormItem>
          <FormItem label="模板内容" prop="content">
            <Input type="textarea" :rows="3" v-model="add.content" placeholder="请输入模板内容..."></Input>
          </FormItem>
          <FormItem label="模板音名" prop="filename">
            <Input v-model="add.filename" placeholder="请输入模板音名..."></Input>
          </FormItem>
          <FormItem label="样本" prop="file">
            <Upload :before-upload="handleUpload" ref="uploadBtn" action="">
              <Button icon="ios-cloud-upload-outline">选择样本</Button>
            </Upload>
            <div v-if="add.samplename !== null">待上传样本: {{ add.samplename }}</div>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: [],
      search: {
        templateid: '',
        templatename: '',
        topicid: ''
      },
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '模板号',
          key: 'templateid'
        }, {
          title: '模板名称',
          key: 'templatename'
        }, {
          title: '模板内容',
          key: 'content'
        }, {
          title: '所属话单',
          key: 'topicid',
          render: (h, params) => {
            let topicid = params.row.topicid
            let typeList = this.type
            for (let i = 0; i < typeList.length; i++) {
              // console.log(typeList[i] + ' ' + topicid)
              if (typeList[i].topicid === topicid) {
                topicid = typeList[i].topictype
                break
              }
            }
            return h('span', topicid)
          }
        }, {
          title: '试听',
          key: 'operation',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.play(params.row.streamNumber)
                }
              }
            }, '播放')
          }
        },
        {
          title: '模板状态',
          key: 'modelstatus',
          render: (h, params) => {
            let status = params.row.modelstatus
            if (status === 0) {
              return h('span', '待同步')
            } else if (status === 1) {
              return h('span', '同步中')
            } else {
              return h('span', '已同步')
            }
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
        templateid: '',
        templatename: '',
        content: '',
        filename: '',
        file: null,
        samplename: null,
        topicid: ''
      },
      addLoading: true,
      addRule: {
        topicid: [
          {
            required: true,
            message: '请选择所属话单',
            trigger: 'change'
          }
        ],
        templateid: [
          {
            required: true,
            message: '模板号不能为空',
            trigger: 'blur'
          }, {
            type: 'string',
            message: '模板号长度不能超过10个字符',
            max: 10
          }, {
            message: '模板号只能输入数字、字母、下划线',
            pattern: /^\w+$/
          }
        ],
        templatename: [
          {
            required: true,
            message: '模板名称不能为空',
            trigger: 'blur'
          }, {
            type: 'string',
            message: '模板名称长度不能超过50个字符',
            max: 50
          }
        ],
        content: [
          {
            required: true,
            message: '模板内容不能为空',
            trigger: 'blur'
          }, {
            type: 'string',
            message: '模板内容不能超过100个字符',
            max: 100
          }
        ],
        filename: [
          {
            required: true,
            message: '模板音名不能为空',
            trigger: 'blur'
          }, {
            type: 'string',
            message: '模板音名长度不能超过50个字符',
            max: 50
          }
        ]
      },
      playInfo: {
        url: '',
        token: '',
        play: false
      },
      audio: null
    }
  },
  mounted () {
    this.playInfo.url = this.axios.defaults.baseURL
    this.playInfo.token = this.$store.getters.token
    this.init()
  },
  methods: {
    init () { // 初始化列表
      this.page.current = 1
      this.loading = true
      this.axios.get('/voicetemplate').then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data.list
          this.page.total = data.count
          this.type = data.type
        } else {
          this.$Message.error(response.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    handleReset () { // 重置查询条件
      this.search.templateid = ''
      this.search.templatename = ''
      this.page.size = 10
      this.init()
    },
    getSearchCondition () {
      return {
        'criterion': this.search,
        'pageIndex': this.page.current,
        'pageSize': this.page.size
      }
    },
    handlePage (page) { // 切换页码/查询
      this.loading = true
      this.page.current = page
      this.axios.post('/voicetemplate/search', this.getSearchCondition()).then((response) => {
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
      this.axios.post('/voicetemplate/search', this.getSearchCondition()).then((response) => {
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
    handleUpload (file) {
      this.add.file = file
      this.add.samplename = file.name
      return false
    },
    changeLoading () { // 关闭加载状态
      this.addLoading = false
      this.$nextTick(() => {
        this.addLoading = true
      })
    },
    saveVoice (name) { // 保存新增关键词
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.add.file == null) {
            this.changeLoading()
            this.$Message.error('请选择样本')
          } else {
            // 封装form表单
            let formData = new FormData()
            formData.append('templateid', this.add.templateid)
            formData.append('templatename', this.add.templatename)
            formData.append('content', this.add.content)
            formData.append('filename', this.add.filename)
            formData.append('file', this.add.file)
            formData.append('samplename', this.add.samplename)
            formData.append('topicid', this.add.topicid)

            this.axios.post('/voicetemplate/add', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then((response) => {
              let code = response.code
              if (code === 200) {
                this.$Message.success('新增成功')
                this.init()
                this.addModal = false
                this.cancel(name)
              } else {
                this.$Message.error(response.msg)
              }
              this.changeLoading()
            }).catch((e) => {
              this.changeLoading()
            })
          }
        } else {
          this.changeLoading()
        }
      })
    },
    cancel (name) { // 取消新增
      this.$refs[name].resetFields()
      this.add.samplename = null
      this.$refs.uploadBtn.clearFiles()
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
    visibleModal (show) {
      if (!show) {
        if (this.audio !== null) {
          this.audio.pause()
          this.audio = null
        }
        this.playInfo.play = false
      }
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css"
</style>
