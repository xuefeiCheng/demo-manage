<template>
    <div>
      <Row>
        <Col style="padding:5px 10px;font-size:16px">
          <span style="font-weight:bold;font-size:18px;">每日统计报告</span>
          <div style="text-indent: 2em">{{text}}</div>
        </Col>
      </Row>
    <Divider/>
        <Row>
            <Col span="12" class="cell_pane"  align="middle">
                 <Form ref="searchForm"   class="search-form" style="padding-top:1rem;height:10%;width:80%">
                     <FormItem label="时间段" prop="interceptionTime" >
                        <DatePicker type="datetimerange" :split-panels="true" @on-ok='getSwindlePro(1)' @on-clear='getSwindlePro(1)' placeholder="请输入拦截时间区间" v-model="searchForm.swindleTime" style="width: 90%"></DatePicker>
                    </FormItem>
                  </Form>
                <div ref="countryMap" class="country_map"></div>
            </Col>
            <Col span="12" class="cell_pane" align='middle'>
                <Form ref="searchForm"   class="search-form" style="padding-top:1rem;height:10%;width:80%">
                    <FormItem label="时间段" prop="interceptionTime" >
                      <DatePicker type="datetimerange"  :split-panels="true" @on-ok='getSwindlePro(4)' @on-clear='getSwindlePro(4)' placeholder="请输入拦截时间区间" v-model="searchForm.beSwindleTime" style="width: 90%"></DatePicker>
                    </FormItem>
                </Form>
                <div ref="gxMap" class="gx_map"></div>
            </Col>
        </Row>

        <Modal
            v-model="swindlePro.swindleProMod"
            title="省诈骗号码详细信息"
            fullscreen>
           <Table border highlight-row  :columns="swindlePro.columns" :data="allData.data2"></Table>
         </Modal>

         <Modal
          v-model="swindleInfo.model"
          title="诈骗号码详细信息"
          fullscreen
         >
           <Table border highlight-roe :columns="swindleInfo.columns" :data="allData.data3"  ></Table>
          <div class="tab_footer">
              <Page :total="allPage.page3.total" :current="allPage.page3.current" :page-size="allPage.page3.size" show-total show-elevator show-sizer
                @on-change.self="handlePage3" @on-page-size-change.self="handleSize3"/>
            </div>
         </Modal>
          <Modal
            v-model="beSwindleCit.bscModel"
            title="省受骗号码详细信息"
            fullscreen   >
            <Table border highlight-row  :columns="beSwindleCit.columns" :data="allData.data5"></Table>

         </Modal>

         <Modal v-model="beSwindleInfo.model" title="受骗号码详细信息" fullscreen>
           <Table border highlight-row :columns="beSwindleInfo.columns" :data="allData.data6"></Table>
            <div class="tab_footer">
              <Page :total="allPage.page6.total" :current="allPage.page6.current" :page-size="allPage.page6.size" show-total show-elevator show-sizer
                @on-change.self="handlePage6" @on-page-size-change.self="handleSize6"/>
            </div>
         </Modal>
    </div>
</template>

<script>
import 'echarts/map/js/china.js'
import 'echarts/map/js/province/guangxi.js'
import { dateToString } from '@/utils/timeFormat'

export default {
  data () {
    return {
      // 每日统计报告
      text: `2019年2月21日（前一天），总计识别诈骗号码***个，诈骗案件***个，伪基站***个。
      受灾影响最为严重的区域为广西省南宁市，受骗用户***个，玉林市的受害用户增加***个。
      诈骗号码来源有天津市、广东省、广西省北海市等，与前10日的诈骗号码相比，
      天津市的诈骗用户增加***个，诈骗电话增加***通，而相反，北海市的诈骗号码则减少了****个。`,
      searchForm: {
        swindleTime: ['', ''],
        beSwindleTime: ['', '']
      },
      swindlePro: {
        swindleProMod: false,
        columns: [{
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '诈骗号码',
          key: 'fraudPhonenum'
        }, {
          title: '归属省',
          key: 'provinceName'
        }, {
          title: '加入时间',
          key: 'addtime',
          render: (h, params) => {
            let time = params.row.addtime
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
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginLeft: '10px'
                },
                on: {
                  click: () => {
                    this.infoData.page3.phoneNum = params.row.fraudPhonenum
                    this.swindleInfo.model = true
                    this.getSwindlePro(3)
                  }
                }
              }, '详情')
            ])
          }
        }]
      },
      beSwindleCit: {
        bscModel: false,
        columns: [{
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '受骗号码',
          key: 'fraudPhonenum'
        }, {
          title: '归属省',
          key: 'provinceName'
        }, {
          title: '归属地市',
          key: 'cityName'
        }, {
          title: '加入时间',
          key: 'addtime',
          render: (h, params) => {
            let time = params.row.addtime
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
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginLeft: '10px'
                },
                on: {
                  click: () => {
                    this.infoData.page6.phoneNum = params.row.fraudPhonenum
                    this.beSwindleInfo.model = true
                    this.getSwindlePro(6)
                  }
                }
              }, '详情')
            ])
          }
        }]
      },
      swindleInfo: {
        model: false,
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          }, {
            title: '主叫号码',
            key: 'callingnumber'
          },
          {
            title: '被叫号码',
            key: 'callednumber'
          },
          {
            title: '加入时间',
            key: 'starttime',
            render: (h, params) => {
              let time = params.row.starttime
              let formatTime = time
              if (time.length === 14) {
                formatTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' +
                time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12)
              }
              return h('span', formatTime)
            }
          }
        ]
      },
      beSwindleInfo: {
        model: false,
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          }, {
            title: '主叫号码',
            key: 'callingnumber'
          },
          {
            title: '被叫号码',
            key: 'callednumber'
          },
          {
            title: '加入时间',
            key: 'starttime',
            render: (h, params) => {
              let time = params.row.starttime
              let formatTime = time
              if (time.length === 14) {
                formatTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' +
                time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12)
              }
              return h('span', formatTime)
            }
          }
        ]
      },
      allData: {
        data1: [],
        data2: [],
        data3: [],
        data4: [],
        data5: [],
        data6: []
      },
      allPage: {
        page3: {
          total: 20,
          size: 10,
          current: 1
        },
        page6: {
          total: 0,
          size: 10,
          current: 1
        }
      },
      infoData: {
        page2: {
          provinceName: ''
        },
        page3: {
          phoneNum: ''
        },
        page5: {
          cityName: ''
        },
        page6: {
          phoneNum: ''
        }
      }
    }
  },
  mounted () {
    this.getSwindlePro(1)
    this.getSwindlePro(4)
  },
  methods: {
    // 1省诈骗数量 2省诈骗详细信息 3 诈骗号码详细信息 4受骗省数量 5 受骗详细信息 6 受骗号码详细信息
    getSwindlePro (requiredType) {
      let requiredUrl = ''
      let requiredConditon = {}
      switch (requiredType) {
        case 1:
          requiredUrl = '/serviceDisplay/situation/fraudPhone'
          requiredConditon = this.getSearchTime('1')
          break
        case 2:
          requiredUrl = `/serviceDisplay/situation/fraudPrivinceDetails`
          requiredConditon = this.getSearchTime('1')
          requiredConditon.areaName = this.infoData.page2.provinceName
          break
        case 3:
          requiredUrl = '/serviceDisplay/situation/fraudPrivinceRecords'
          let criterion = this.getSearchTime('1')
          criterion.phonenum = this.infoData.page3.phoneNum
          requiredConditon.mode = 'desc'
          requiredConditon.pageIndex = this.allPage.page3.current
          requiredConditon.pageSize = this.allPage.page3.size
          requiredConditon.sortKey = 'starttime'
          requiredConditon.criterion = criterion
          break
        case 4:
          requiredUrl = '/serviceDisplay/situation/victimPhone'
          requiredConditon = this.getSearchTime('2')
          break
        case 5:
          requiredUrl = '/serviceDisplay/situation/victimPrivinceDetails'
          requiredConditon = this.getSearchTime('2')
          requiredConditon.areaName = this.infoData.page5.cityName
          break
        case 6:
          requiredUrl = '/serviceDisplay/situation/victimPrivinceRecords'
          let criterion6 = this.getSearchTime('2')
          criterion6.phonenum = this.infoData.page6.phoneNum
          requiredConditon.mode = 'desc'
          requiredConditon.pageIndex = this.allPage.page6.current
          requiredConditon.pageSize = this.allPage.page6.size
          requiredConditon.sortKey = 'starttime'
          requiredConditon.criterion = criterion6
          break
      }

      this.axios.post(requiredUrl, requiredConditon).then((response) => {
        let code = response.code
        if (code === 200) {
          switch (requiredType) {
            case 1:
              let countryData = [
                {name: '北京', value: 0},
                {name: '天津', value: 0},
                {name: '上海', value: 0},
                {name: '重庆', value: 0},
                {name: '河北', value: 0},
                {name: '河南', value: 0},
                {name: '云南', value: 0},
                {name: '辽宁', value: 0},
                {name: '黑龙江', value: 0},
                {name: '湖南', value: 0},
                {name: '安徽', value: 0},
                {name: '山东', value: 0},
                {name: '新疆', value: 0},
                {name: '江苏', value: 0},
                {name: '浙江', value: 0},
                {name: '江西', value: 0},
                {name: '湖北', value: 0},
                {name: '广西', value: 0},
                {name: '甘肃', value: 0},
                {name: '山西', value: 0},
                {name: '内蒙古', value: 0},
                {name: '陕西', value: 0},
                {name: '吉林', value: 0},
                {name: '福建', value: 0},
                {name: '贵州', value: 0},
                {name: '广东', value: 0},
                {name: '青海', value: 0},
                {name: '西藏', value: 0},
                {name: '四川', value: 0},
                {name: '宁夏', value: 0},
                {name: '海南', value: 0},
                {name: '台湾', value: 0},
                {name: '香港', value: 0},
                {name: '澳门', value: 0}
              ]
              let data1 = response.data
              countryData.forEach((item) => {
                data1.forEach((current) => {
                  if (item.name === current.provinceName) {
                    item.value = current.fraudsum
                  }
                })
              })
              this.allData.data1 = countryData
              this.drawCountryMap()
              break
            case 2:
              this.allData.data2 = response.data
              break
            case 3:
              this.allData.data3 = response.data.list
              this.allPage.page3.total = response.data.count
              break
            case 4:
              let cityData = [
                {name: '百色市', value: 0},
                {name: '河池市', value: 0},
                {name: '柳州市', value: 0},
                {name: '桂林市', value: 0},
                {name: '崇左市', value: 0},
                {name: '南宁市', value: 0},
                {name: '来宾市', value: 0},
                {name: '贵港市', value: 0},
                {name: '贺州市', value: 0},
                {name: '梧州市', value: 0},
                {name: '玉林市', value: 0},
                {name: '钦州市', value: 0},
                {name: '北海市', value: 0},
                {name: '防城港市', value: 0}
              ]
              let data4 = response.data
              cityData.forEach(item => {
                data4.forEach(current => {
                  if (current.provinceName === item.name) {
                    item.value = current.fraudsum
                  }
                })
              })

              this.allData.data4 = cityData
              this.drawGXMap()
              break
            case 5:
              this.allData.data5 = response.data
              break
            case 6:
              this.allData.data6 = response.data.list
              this.allPage.page6.total = response.data.count
              break
          }
        } else {
          this.$Message.error(response.msg)
          return false
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    getSearchTime (timeStyle) {
      let timeCondition = {}
      let timeData = {}
      if (timeStyle === '1') {
        timeData = this.searchForm.swindleTime
      }
      if (timeStyle === '2') {
        timeData = this.searchForm.beSwindleTime
      }

      if (timeData[0] !== '') {
        timeCondition.starttime = dateToString(timeData[0]).slice(0, 14)
        timeCondition.endtime = dateToString(timeData[1]).slice(0, 14)
      } else {
        const date = new Date()
        const YY = date.getFullYear()
        const MM = date.getMonth() + 1
        const newMM = MM > 9 ? MM : '0' + MM
        const DD = date.getDate()
        const newDD = DD > 9 ? DD : '0' + DD
        timeCondition.starttime = YY + '' + newMM + '' + newDD + '000000'
        timeCondition.endtime = YY + '' + newMM + '' + newDD + '235959'
      }
      return timeCondition
    },
    handlePage3 (page) { // 切换页码/查询
      this.loading = true
      this.allPage.page3.current = page
      this.getSwindlePro(3)
    },
    handlePage6 (page) { // 切换页码/查询
      this.loading = true
      this.allPage.page6.current = page
      this.getSwindlePro(6)
    },
    handleSize3 (size) { // 改变页大小
      this.loading = true
      this.allPage.page3.size = size
      this.getSwindlePro(3)
    },
    handleSize6 (size) { // 改变页大小
      this.loading = true
      this.allPage.page6.size = size
      this.getSwindlePro(6)
    },
    drawCountryMap () {
      let countryMapEch = this.$echarts.init(this.$refs.countryMap)

      let option = {
        title: {
          text: '诈骗号码分布图',
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
          max: 1000,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [{
          type: 'map',
          map: 'china',
          name: '诈骗号码分布图',
          roam: false,
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: true
            }
          },
          data: this.allData.data1
        }]
      }
      countryMapEch.setOption(option)
      countryMapEch.on('click', (params) => {
        this.swindlePro.swindleProMod = true
        this.infoData.page2.provinceName = params.name
        this.getSwindlePro(2)
      })
      window.addEventListener('resize', function () {
        countryMapEch.resize()
      })
    },
    drawGXMap () {
      let gxMapEch = this.$echarts.init(this.$refs.gxMap)

      let option = {
        title: {
          text: '被骗用户分布图',
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
          max: 1000,
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
          name: '被骗用户分布图',
          roam: false,
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: true
            }
          },
          data: this.allData.data4
        }]
      }
      gxMapEch.setOption(option)
      gxMapEch.on('click', (params) => {
        this.beSwindleCit.bscModel = true
        this.infoData.page5.cityName = params.name
        this.getSwindlePro(5)
      })
      window.addEventListener('resize', function () {
        gxMapEch.resize()
      })
    }
  }
}
</script>

<style>
.cell_pane{
    height: 60rem;
    /* height: 70rem; */
    align-items: center;
    border: 0.1em solid #C0C0C0;
}
.country_map{
    flex:none;
    width: 90%;
    height: 90%;
}
.gx_map{
    flex:none;
    width: 90%;
    height: 90%;
}
</style>
<style lang="css">
@import "../../../../static/css/base.css"
</style>
