<template lang="html">
  <div class="div-border">
    <!-- 搜索区域 -->
    <Form :model="search" :label-width="150">
      <Row>
        <!-- <Col span="8">
          <FormItem label="组织机构名称">
            <Input v-model="search.userName" placeholder="请输入要查询的菜单名称..."></Input>
          </FormItem>
        </Col> -->
        <Col span="8">
          <FormItem label="创建时间">
            <DatePicker v-model="search.time" type="daterange" placement="bottom-end" placeholder="请选查询时间段"
              @on-change="handleTime" style="width: 100%;"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8" style="text-align: center;">
          <FormItem>
            <Button type="success" size="large" icon="ios-search" class="searchBtn" @click="handlePage(1)">搜索</Button>
            <Button type="info" size="large" icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
        </Col>
        <!-- <Col span="8">
          <FormItem label="用户状态">
            <Select v-model="search.state">
              <Option v-for="item in stateList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
        </Col> -->
      </Row>
    </Form>

    <Divider />

    <!-- 表格区域 -->
    <Button type="primary" size="large" icon="ios-add-circle-outline" style="margin-bottom: 10px;" @click="showUserModal">新增</Button>
    <Table border highlight-row :loading="loading" :columns="columns" :data="data"></Table>
    <div class="tab_footer">
      <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator show-sizer
        @on-change.self="handlePage" @on-page-size-change.self="handleSize" />
    </div>

    <!-- 新增用户 -->
    <Modal v-model="userModal" title="新增" :loading="saveLoading"  @on-ok="save" @on-cancel="cancel()">
      <!-- <Alert show-icon>新增用户初始密码为：<font color="red">1qaz@WSX</font></Alert> -->
      <Form ref="user" :model="user" :label-width="100" :rules="userRules">
        <FormItem label="监控类型" prop="userName">
          <Input v-model="user.userName" placeholder="请输入监控类型..."></Input>
        </FormItem>
        <FormItem label="监控源" prop="department">
          <Input v-model="user.department" placeholder="请输入监控源..."></Input>
        </FormItem>
      </Form>
    </Modal>

    <!-- 关联角色 -->
    <Modal v-model="roleModal" title="关联角色">
      <Transfer
        :data="roleData"
        :target-keys="ownedRole"
        :titles="['未拥有的角色', '已拥有的角色']"
        @on-change="handleRole"></Transfer>
    </Modal>

  </div>
</template>

<script>
import {jiankong} from 'static/data/staticdata.js'
export default {
  data () {
    return {
      search: {
        userName: '',
        time: ['', ''],
        state: '1'
      },
      stateList: [
        {
          value: '1',
          label: '正常'
        }, {
          value: '2',
          label: '异常'
        }, {
          value: '3',
          label: '已注销'
        }
      ],
      loading: false,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '监控类型',
          render: (h) => {
            let num = parseInt(Math.random() * (3 - 0 + 1) + 0, 10)
            const arr = ['系统网络', '接口', '任务', '数据质量']
            return h('span', arr[num])
          }
        }, {
          title: '监控状态',
          render: (h) => {
            let num = parseInt(Math.random() * (2 - 0 + 1) + 0, 10)
            const arr = ['监控中', '异常', '未开启']
            return h('span', arr[num])
          }
        }, {
          title: '告警状态',
          render: (h) => {
            let num = parseInt(Math.random() * (1 - 0 + 1) + 0, 10)
            const arr = ['已告警', '未告警']
            return h('span', arr[num])
          }
        }, {
          title: '监控时间',
          key: 'createTime',
          render: (h, params) => {
            let time = params.row.createTime
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
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.relateRole(params.row.menuName)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.invalid(params.row.menuName)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data: [],
      page: {
        total: 0,
        size: 10,
        current: 1
      },
      userModal: false,
      user: {
        userName: '',
        validity: 0,
        realName: '',
        department: '',
        phone: ''
      },
      saveLoading: true,
      userRules: {
        userName: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }, {
            type: 'string',
            message: '用户名不能超过25个字符',
            max: 25
          }
        ],
        validity: [
          {
            type: 'number',
            message: '密码有效期过长，请输入0（永久有效）',
            max: 10000
          }
        ],
        realName: [
          {
            type: 'string',
            message: '真实姓名不能超过25个字符',
            max: 25
          }
        ],
        department: [
          {
            type: 'string',
            message: '所属部门不能超过50个字符',
            max: 50
          }
        ],
        phone: [
          {
            type: 'string',
            message: '请输入正确的手机号码',
            pattern: /^1(3|4|5|7|8)\d{9}$/
          }
        ]
      },
      roleModal: false,
      roleData: [],
      ownedRole: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () { // 列表初始化
      this.page.current = 1
      let data = jiankong
      this.data = data.data
      this.page.total = data.count
    },
    handleTime (time) { // 改变时间
      this.search.time = time
    },
    searchCondition () { // 获取查询条件
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
        userName: this.search.userName,
        timeStart: formatStart,
        timeEnd: formatEnd,
        state: this.search.state
      }
    },
    handlePage (pageIdx) { // 查询
      this.page.current = pageIdx
      this.loading = true
      pageIdx -= 1
      this.axios.post('/user/' + pageIdx + '/' + this.page.size, this.searchCondition()).then((res) => {
        let code = res.code
        if (code === 200) {
          let data = res.data
          this.data = data.list
          this.page.total = data.count
        } else {
          this.$Message.error(res.msg)
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    handleReset () { // 重置查询条件
      this.search.userName = ''
      this.search.time = ['', '']
      this.search.state = '1'
      this.page.size = 10
      this.init()
    },
    handleSize (size) { // 改变页大小
      this.page.size = size
      this.handlePage(1)
    },
    showUserModal () { // 展示新增用户模态框
      this.userModal = true
    },
    formatValidity (value) { // 向数字输入框输入值格式化
      value = (value + '').split('.')[0]
      if (value === '0') {
        return '永久'
      } else {
        return value + '天'
      }
    },
    parserValidity (value) { // 从数字输入框取值格式化
      value = value.replace('永久', 0)
      return Number(value.replace('天', ''))
    },
    changeLoading () { // 关闭加载状态
      this.saveLoading = false
      this.$nextTick(() => {
        this.saveLoading = true
      })
    },
    save () { // 新增用户
      this.$refs['user'].validate((valid) => {
        if (valid) {
          this.axios.post('/user', this.user).then((res) => {
            let code = res.code
            if (code === 200) {
              this.$Message.success('保存成功')
              this.init()
              this.userModal = false
              this.cancel()
            } else {
              this.$Message.error(res.msg)
            }
            this.changeLoading()
          }).catch((e) => {
            this.changeLoading()
          })
        } else {
          this.changeLoading()
        }
      })
    },
    cancel () { // 取消新增
      this.$refs['user'].resetFields()
    },
    invalid (userName) { // 注销用户
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认[' + userName + ']？',
        okText: '注销',
        onOk: () => {
          this.axios.get('/user/' + userName).then((response) => {
            let code = response.code
            if (code === 200) {
              this.init()
            } else {
              this.$Message.error(response.msg)
            }
          })
        }
      })
    },
    relateRole (userName) { // 展示关联角色模态框
      this.roleModal = true
    },
    handleRole (newRoles) {
      this.ownedRole = newRoles
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css"
</style>
