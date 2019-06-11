<template>
<!-- 诈骗处置子系统 -->
  <div class="data mapTab noback inter_mapTab inter_margin analysis">
      <!-- title 部分 -->
      <div class="border-self analysis_title">
        <div class="inter_title">{{title}}</div>
        <div class="des">?</div>
        <div class="des_content">{{des}}</div>
      </div>
      <!-- 主体部分 -->
      <div class="zpcz_content border-self">
          <div class="zpcz_sons border-self">
            <div class="zpcz_son_title border-self-bottom">定位分析模块</div>
            <div class="zpcz_son_content" style="text-align:center;color:#fff;overflow:hidden">
              <h3>cdr话单</h3>
              <h3 class="triangle">↓</h3>
              <h3>获取位置信息</h3>
              <h3 class="triangle">↓</h3>
              <div id="small_baiduMap" ref="small_baiduMap" class="hideLogo" style="width: 100%; height:600px"></div>
            </div>
          </div>
          <div class="zpcz_sons border-self">
            <div class="zpcz_son_title border-self-bottom">处置提醒模块</div>
            <div class="zpcz_son_content" style="text-align:center;color:#fff;overflow:hidden">
              <img src="static/img/bigscreen/zpczIMG.png" alt="" style="height:100%;width:100%">
              <!-- <h3>选择模板 创建提醒任务</h3>
              <h3 class="triangle">↓</h3>
              <Form ref="add" :label-width="90" class="fraudhandle border-self">
                <FormItem label="任务名称">
                  <Input placeholder="请输入任务名称..."></Input>
                </FormItem>
                <FormItem label="模板名称">
                  <Select style="width: 100%;" placeholder="请选择模板">
                    <Option value=""></Option>
                  </Select>
                </FormItem>
                <FormItem label="运行商">
                  <Select style="width: 100%;" placeholder="请选择运营商">
                    <Option value=""></Option>
                  </Select>
                </FormItem>
                <FormItem label="号码文件">
                  <Upload  action="">
                    <Button icon="ios-cloud-upload-outline">请选择号码文件</Button>
                    <span style=" color: red;">(每行一个号码的.txt文件)</span>
                    <Button type="warning" style="margin-left:10px;">取消</Button>
                    <Button type="primary" style="margin-left:10px;">确定</Button>
                  </Upload>
                </FormItem>
              </Form>
              <h3 class="triangle">↓</h3>
              <h3>调用信大接口完成下发</h3>
              <h3 class="triangle">↓</h3>
              <Table border highlight-row :columns="table.columns" :data="table.data" height="200" style="width:650px;" class="fraudtable"></Table> -->
            </div>
          </div>
          <div class="zpcz_sons border-self" style="display:none">
              <div style="height:100%;position:relative">
                <div class="zpcz_son_title border-self-bottom">自动反置</div>
                <div class="zpcz_son_content" style="text-align:center;color:#fff;overflow:hidden">
                  <h3>获取有危害的号码</h3>
                  <h3 class="triangle">↓</h3>
                  <Table border highlight-row :columns="columns" :data="data" height="200" style="width:650px;" class="fraudtable"></Table>
                  <h3 class="triangle">↓</h3>
                  <h3>采用呼死你的模式对主叫发起呼叫反制</h3>
                  <h3 class="triangle">↓</h3>
                  <div style="height:30%;background:url('static/img/bigscreen/fraudhandle.png') no-repeat center center;background-size: 90% 60%;">
                    <!-- <img src="static/img/bigscreen/fraudhandle.png" alt="" style="height:100%;width:100%"> -->
                  </div>
                </div>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'zpczzxt',
  data () {
    return {
      title: '诈骗处置子系统',
      des: '诈骗处置系统提供多样化的诈骗电话和信息处置方法和策略。一方面，通过接入IMS核心网进行回拨取证，对检测出的有害电话进行实时拦截和阻断；另一方面，以各种形式对受害用户进行短信提醒。处置系统可以接受综合业务管理系统的处置指令及策略，实施相应处置操作并反馈处置结果。',
      map: null,
      templateList: [],
      operatorList: [
        {
          id: '1',
          name: '中国移动'
        }, {
          id: '2',
          name: '中国联通'
        }, {
          id: '3',
          name: '中国电信'
        }
      ],
      table: {
        columns: [
          {
            type: 'index',
            width: 50,
            align: 'center'
          }, {
            title: '任务名称',
            key: 'taskName'
          }, {
            title: '模板名称',
            key: 'templateId',
            render: (h, params) => {
              let id = params.row.templateId
              let name = ''

              let template = this.templateList
              for (let i = 0; i < template.length; i++) {
                if (template[i].id === id) {
                  name = template[i].templateName
                  break
                }
              }
              if (name === '') {
                name = '<span style="color: red;">该模板已删除</span>'
              }

              return h('span', {
                domProps: {
                  innerHTML: name
                }
              })
            }
          }, {
            title: '运营商',
            key: 'operator',
            render: (h, params) => {
              let operator = params.row.operator
              let operatorText

              for (let i = 0; i < this.operatorList.length; i++) {
                if (this.operatorList[i].id === operator) {
                  operatorText = this.operatorList[i].name
                  break
                }
              }

              return h('span', operatorText)
            }
          }, {
            title: '状态',
            key: 'state',
            render: (h, params) => {
              let state = params.row.state
              let stateText

              if (state === '1') {
                stateText = '待执行'
              } else if (state === '2') {
                stateText = '执行完成'
              } else {
                stateText = '执行失败'
              }

              return h('span', stateText)
            }
          }, {
            title: '总数量',
            key: 'total'
          }, {
            title: '任务创建时间',
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
          }
        ],
        data: []
      },
      columns: [
        {
          type: 'index',
          width: 50,
          align: 'center'
        }, {
          title: '反制号码',
          key: 'phoneNumber'
        }, {
          title: '反制原因',
          width: 100,
          key: 'reason'
        }, {
          title: '入库时间',
          key: 'subTime',
          render: (h, params) => {
            let time = params.row.subTime
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
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {}
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginLeft: '10px'
                },
                on: {
                  click: () => {}
                }
              }, '反制')
            ])
          }
        }
      ],
      data: []
    }
  },
  mounted () {
    this.createMap()
    this.init()
    this.list()
  },
  methods: {
    init () { // 反制列表
      this.axios.post('/swindledis/counterspell/0/10', {}).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.data = data.list
        } else {
          this.$Message.error(response.msg)
        }
        // this.loading = false
      }).catch((e) => {
        // this.loading = false
      })
    },
    list () { // 查询列表数据
      this.axios.get('/swindledis/remind/0/10', {name: ''}).then((response) => {
        let code = response.code
        if (code === 200) {
          let data = response.data
          this.templateList = data.template
          this.table.data = data.list
        } else {
          this.$Message.error(response.msg)
        }
      }).catch((e) => {
      })
    },
    createMap (Ename, Cname) { // 创建百度地图
      this.map = new window.BMap.Map('small_baiduMap', {})
      this.map.setCurrentCity('广西') // 创建中心城市
      this.map.centerAndZoom(new window.BMap.Point(109.231816505, 23.7411659265), 8) // 创建中心点
      var marker = new window.BMap.Marker(new window.BMap.Point(109.231816505, 23.7411659265))
      this.map.addOverlay(marker)
      this.map.enableScrollWheelZoom() // 开启鼠标滚轮缩放
      this.map.setMinZoom(8) // 最小缩放级别
      this.map.setMaxZoom(15) // 最大缩放级别
    }
  }
}
</script>

<style scoped>
  .border-self {box-shadow: none !important;}
  .border-self-bottom {
    border:0;
    border-bottom: 1px solid #269fed73;
  }
  /* 诈骗处置子系统 */
  .zpcz_content{
    height: calc(100% - 100px);width:100%;box-sizing:border-box;display:flex;
  }
  .zpcz_sons{
    flex:1;margin:15px;
  }
  .zpcz_son_title{
    width:100%;height:15%;font-size:26px;color:#fff;text-align:center;padding:25px 0;box-sizing: border-box;
  }
  .zpcz_son_content{
    height: 85%;
    box-sizing: border-box;
    padding: 10px;
  }
  .triangle {
    padding: 0 0 5px 0;
    margin: 0;
  }
  .fraudhandle {
    text-align:left;
    background:#0b1f57;
    padding:10px 10px 0 10px;
    border-radius: 5px;
  }
  .fraudhandle .ivu-form-item {
    margin-bottom: 5px;
  }
</style>
<style>
.fraudhandle  .ivu-form-item-label {
  color: #fff
}
.fraudtable .ivu-table, .fraudtable .ivu-table td{
  background: none;
}
.fraudtable .ivu-table th{
  background: #053c6b;
}
.fraudtable .ivu-table{
  color:#fff;
}
.fraudtable .ivu-table-row-hover {
  background: #053c6b;
}
</style>
