import axios from 'axios'
const state = {
  geoCoordMap: {
    '上海': [121.4648, 31.2891],
    '广东': [113.8953, 22.901],
    '山西': [111.4783, 36.1615],
    '新疆': [85.9236, 40.5883],
    '河北': [115.0488, 39.0948],
    '甘肃': [103.5901, 36.3043],
    '内蒙古': [110.3467, 41.4899],
    '北京': [116.4551, 40.2539],
    '北海': [109.314, 21.6211],
    '江苏': [119.6062, 32.9208],
    '广西': [108.479, 23.1152],
    '江西': [116.0046, 28.6633],
    '福建': [118.1689, 24.6478],
    '合肥': [117.29, 32.0581],
    '陕西': [108.4131, 34.8706],
    '黑龙江': [127.9688, 47.368],
    '辽宁': [122.2229, 38.6409],
    '天津': [117.4219, 39.4189],
    '安徽': [117.0123, 32.2121],
    '四川': [103.9526, 30.7617],
    '西藏': [91.1865, 30.1465],
    '云南': [102.9199, 25.4663],
    '浙江': [120.5313, 29.1773],
    '湖南': [111.5327, 27.0319],
    '湖北': [112.3896, 30.6628],
    '山东': [117.1582, 36.8701],
    '海南': [110.3893, 19.8516],
    '青海': [96.8038, 36.2207],
    '贵州': [106.6992, 26.7682],
    '河南': [113.4668, 34.1234],
    '重庆': [107.7539, 30.1904],
    '宁夏': [106.3586, 36.8775],
    '吉林': [125.8154, 43.6584],
    '香港': [115.1215, 22.1235],
    '澳门': [112.1211, 22.2111],
    '台北': [120.1111, 23.2435]
  },
  showCityNumber: 5,
  isLoading: true,
  data: [
    [{'name': '河南', 'value': 105}, {'name': '广西'}],
    [{'name': '山东', 'value': 90}, {'name': '广西'}],
    [{'name': '江西', 'value': 80}, {'name': '广西'}],
    [{'name': '广东', 'value': 70}, {'name': '广西'}],
    [{'name': '宁夏', 'value': 40}, {'name': '广西'}],
    [{'name': '内蒙古', 'value': 10}, {'name': '广西'}],
    [{'name': '重庆', 'value': 20}, {'name': '广西'}]
  ],
  gxdata: [
    [{'name': '广西', 'value': 105}, {'name': '河南'}],
    [{'name': '广西', 'value': 90}, {'name': '湖北'}],
    [{'name': '广西', 'value': 80}, {'name': '浙江'}],
    [{'name': '广西', 'value': 70}, {'name': '天津'}],
    [{'name': '广西', 'value': 40}, {'name': '宁夏'}],
    [{'name': '广西', 'value': 10}, {'name': '内蒙古'}],
    [{'name': '广西', 'value': 20}, {'name': '重庆'}]
  ]
}

const getters = {}

const actions = {
  fetchworldData ({state, commit}, chartsObj) {
    axios.get('interbigscreen/getweekcountry')
      .then((res) => {
        let worlddate = []
        let gj = []
        if (res.code === 200) {
          worlddate = res.data
        }
        axios.get('interbigscreen/getjmr')
          .then((res) => {
            if (res.code === 200) {
              gj = res.data
              let series = []
              let convertData = ((gj) => {
                let res = []
                for (let i = 0; i < gj.length; i++) {
                  let dataItem = gj[i]
                  let fromCoord = [dataItem.s_longitude, dataItem.s_latitude]
                  let toCoord = [dataItem.d_longitude, dataItem.d_latitude]
                  res.push({
                    fromName: dataItem.s_city,
                    toName: dataItem.d_city,
                    numValue: dataItem.num,
                    coords: [fromCoord, toCoord]
                  })
                }
                return res
              })(gj)
              // 热力图
              series.push({
                name: '区域',
                type: 'map',
                map: 'world',
                geoIndex: 0,
                data: worlddate
              },
              // 设置轨迹线
              {
                type: 'lines',
                zlevel: 2,
                // symbol: ['none', 'arrow'],
                effect: {
                  show: true,
                  period: 6,
                  trailLength: 0,
                  symbolSize: 15
                },
                lineStyle: {
                  normal: {
                    color: '#9ae5fc',
                    width: 2,
                    opacity: 0.6,
                    curveness: -0.2
                  }
                },
                data: convertData
              }
              )
              // 下面修改  画线
              gj.forEach(function (item, i) {
                series.push(
                  {
                    name: '区域',
                    type: 'effectScatter', // 配置显示方式为用户自定义
                    rippleEffect: {
                      brushType: 'stroke'
                    },
                    symbolSize: 10,
                    coordinateSystem: 'geo',
                    zlevel: 3,
                    itemStyle: {
                      normal: {
                        color: '#9ae5fc'
                      }
                    },
                    data: [{
                      'value': [item.s_longitude, item.s_latitude],
                      'name': item.s_city
                    }]
                  }

                )
              })
              // 终点
              series.push({
                // 终点设置点
                name: '广西',
                type: 'effectScatter',
                zlevel: 2,
                coordinateSystem: 'geo',
                rippleEffect: {
                  brushType: 'stroke'
                },
                symbolSize: 13,
                itemStyle: {
                  normal: {
                    color: 'red'
                  }

                },
                data: [
                  {'name': '广西', 'value': [108.479, 23.1152, '广西']}
                ]
              })

              chartsObj.setOption({
                series: series
              })
            }
          })
      })
  },
  fetchHeatChinaRealData ({state, commit}, chartsObj) {
    axios.get('bigscreen/getProvinceIntercept')
      .then((res) => {
        let privincedata = res.data

        // let data = state.data
        let data = [{'fromPhone': '12212', 'fromProvince': '广西', 'toPhone': '22222', 'toProvince': '安徽'},
          {'fromPhone': '12212', 'fromProvince': '广西', 'toPhone': '22222', 'toProvince': '湖北'},
          {'fromPhone': '12212', 'fromProvince': '北京', 'toPhone': '22222', 'toProvince': '内蒙古'},
          {'fromPhone': '12212', 'fromProvince': '河北', 'toPhone': '22222', 'toProvince': '内蒙古'},
          {'fromPhone': '12212', 'fromProvince': '上海', 'toPhone': '22222', 'toProvince': '甘肃'}]

        let convertData = ((state, data) => {
          let res = []
          for (let i = 0; i < data.length; i++) {
            let dataItem = data[i]
            let fromCoord = state.geoCoordMap[dataItem.fromProvince]
            let toCoord = state.geoCoordMap[dataItem.toProvince]
            if (fromCoord && toCoord) {
              res.push({
                fromName: dataItem.fromProvince,
                toName: dataItem.toProvince,
                // numValue: dataItem[0].value,
                coords: [fromCoord, toCoord]
              })
            }
          }
          return res
        })(state, data)

        let LineColor = ['#ff3333', 'orange', 'lime', 'aqua', '#9ae5fc']
        // let LineColor = ['#F56C7C', '#FD9A36', '#EBE028', '#31CE65', '#20DACD']
        let series = []
        series.push(
          {
            name: '拦截来电总数',
            type: 'map',
            geoIndex: 0,
            data: privincedata
          },
          {
            // 设置飞行线
            // name: item[1],
            type: 'lines',
            zlevel: 1,
            effect: {
              show: true,
              period: 6,
              trailLength: 1.7,
              color: '#fff',
              shadowBlur: 0,
              symbolSize: 0
            },
            lineStyle: {
              normal: {
                color: function (params) {
                  return LineColor[params.dataIndex]
                },
                width: 1,
                curveness: 0.2
              }
            },
            data: convertData
          }, // 设置轨迹线
          {
            // name: item[0],
            type: 'lines',
            zlevel: 2,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbolSize: 10
            },
            lineStyle: {
              normal: {
                color: function (params) {
                  return LineColor[params.dataIndex]
                },
                width: 0.2,
                opacity: 0.4,
                curveness: 0.2
              }
            },
            data: convertData
          }
        )
        data.forEach(function (item, i) {
          series.push(
            {
            // 起点设置点
              name: item.fromProvince,
              type: 'effectScatter',
              zlevel: 2,
              coordinateSystem: 'geo',
              rippleEffect: {
                brushType: 'stroke'
              },
              symbolSize: 10,
              itemStyle: {
                normal: {
                  color: function (params) {
                    return LineColor[i]
                  }
                }

              },
              data: [{
                'value': state.geoCoordMap[item.fromProvince].concat([Math.random()]),
                'name': item.fromProvince
              }]
            },
            {
            // 终点设置点
              name: item.toProvince,
              type: 'effectScatter',
              zlevel: 2,
              coordinateSystem: 'geo',
              rippleEffect: {
                brushType: 'stroke'
              },
              symbolSize: 13,
              itemStyle: {
                normal: {
                  color: function (params) {
                    return LineColor[i]
                  }
                }

              },
              data: [{
                'value': state.geoCoordMap[item.toProvince].concat([Math.random()]),
                'name': item.toProvince
              }]
            })
        })

        if (state.isLoading) {
          chartsObj.hideLoading()
          commit('closeLoading')
        }

        chartsObj.setOption({
          series: series
        })
      })
  },
  fetchGxData ({state, commit}, chartsObj) {
    axios.get('bigscreen/getProvinceIntercept')
      .then((res) => {
        let privincedata = res.data
        let data = state.gxdata
        let convertData = ((state, data) => {
          let res = []
          for (let i = 0; i < data.length; i++) {
            let dataItem = data[i]
            let fromCoord = state.geoCoordMap[dataItem[0].name]
            let toCoord = state.geoCoordMap[dataItem[1].name]
            if (fromCoord && toCoord) {
              res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                numValue: dataItem[0].value,
                coords: [fromCoord, toCoord]
              })
            }
          }
          return res
        })(state, data)

        let LineColor = ['#ff3333', 'orange', 'lime', 'aqua']
        let series = [];
        [['广西', data]].forEach(function (item, i) {
          series.push(
            {
              name: '拦截来电总数',
              type: 'map',
              geoIndex: 0,
              data: privincedata
            },
            {
            // 设置飞行线
              name: item[1],
              type: 'lines',
              zlevel: 1,
              effect: {
                show: true,
                period: 6,
                trailLength: 1.7,
                color: '#fff',
                shadowBlur: 0,
                symbolSize: 0
              },
              lineStyle: {
                normal: {
                  color: function (params) {
                    let num = params.data.numValue
                    if (num > 100) {
                      return LineColor[0]
                    } else if (num > 50) {
                      return LineColor[1]
                    } else if (num > 25) {
                      return LineColor[2]
                    } else {
                      return LineColor[3]
                    }
                  },
                  width: 1,
                  curveness: 0.2
                }
              },
              data: convertData

            },
            // 设置轨迹线
            {
              name: item[0],
              type: 'lines',
              zlevel: 2,
              effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                symbolSize: 10
              },
              lineStyle: {
                normal: {
                  color: function (params) {
                    let num = params.data.numValue
                    if (num > 100) {
                      return LineColor[0]
                    } else if (num > 50) {
                      return LineColor[1]
                    } else if (num > 25) {
                      return LineColor[2]
                    } else {
                      return LineColor[3]
                    }
                  },
                  width: 0.2,
                  opacity: 0.4,
                  curveness: 0.2
                }
              },
              data: convertData
            },
            {
            // 起点设置点
              name: item[0],
              type: 'effectScatter',
              zlevel: 2,
              coordinateSystem: 'geo',
              rippleEffect: {
                brushType: 'stroke'
              },
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: function (params) {
                    var res = params.value[2]
                    return res
                  }

                }
              },
              symbolSize: function (val) {
                return val[2] / 10
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    let num = params.value[2]
                    if (num > 100) {
                      return LineColor[0]
                    } else if (num > 50) {
                      return LineColor[1]
                    } else if (num > 25) {
                      return LineColor[2]
                    } else {
                      return LineColor[3]
                    }
                  }
                }

              },
              data: item[1].map(function (dataItem) {
                return {
                  name: dataItem[1].name,
                  value: state.geoCoordMap[dataItem[1].name].concat([dataItem[0].value])
                }
              })
            })
        })

        if (state.isLoading) {
          chartsObj.hideLoading()
          commit('closeLoading')
        }

        chartsObj.setOption({
          series: series
        })
      })
  },
  toGxData ({state, commit}, chartsObj) {
    let gxdata = [{'name': '柳州市', 'value': 205}, {'name': '河池市', 'value': 105}, {'name': '贺州市', 'value': 333},
      {'name': '百色市', 'value': 605}, {'name': '来宾市', 'value': 105},
      {'name': '贵港市', 'value': 175}, {'name': '崇左市', 'value': 705},
      {'name': '钦州市', 'value': 305}, {'name': '防城港市', 'value': 505},
      {'name': '南宁市', 'value': 905}, {'name': '桂林市', 'value': 290},
      {'name': '梧州市', 'value': 180}, {'name': '北海市', 'value': 470}, {'name': '玉林市', 'value': 40}]
    let pointsSource = [
      {
        'value': [108.80, 23.22, 60],
        'name': '宾阳县'
      }
    ]
    let series = [
      {
        name: '受骗用户数',
        type: 'map',
        geoIndex: 0,
        data: gxdata
      },
      {
        name: '宾阳县受骗用户数',
        type: 'effectScatter', // 配置显示方式为用户自定义
        rippleEffect: { // 涟漪特效相关配置。
          period: 4, // 动画的时间。
          scale: 4, // 动画中波纹的最大缩放比例。
          brushType: 'fill' // 波纹的绘制方式，可选 'stroke' 和 'fill'。
        },
        symbolSize: 13,
        coordinateSystem: 'geo',
        itemStyle: {
          normal: {
            color: 'red'
          }
        },
        data: pointsSource
      }
    ]
    if (state.isLoading) {
      chartsObj.hideLoading()
      commit('closeLoading')
    }

    chartsObj.setOption({
      series: series
    })
  },
  fromGxData ({state, commit}, chartsObj) {
    let gxdata = [{'name': '柳州市', 'value': 205}, {'name': '河池市', 'value': 105}, {'name': '贺州市', 'value': 333},
      {'name': '百色市', 'value': 605}, {'name': '来宾市', 'value': 105},
      {'name': '贵港市', 'value': 565}, {'name': '崇左市', 'value': 75},
      {'name': '钦州市', 'value': 305}, {'name': '防城港市', 'value': 125},
      {'name': '南宁市', 'value': 905}, {'name': '桂林市', 'value': 290},
      {'name': '梧州市', 'value': 180}, {'name': '北海市', 'value': 470}, {'name': '玉林市', 'value': 40}]
    let pointsSource = [
      {
        'value': [108.80, 23.22, 60],
        'name': '宾阳县'
      }
    ]
    let series = [
      {
        name: '施骗用户数',
        type: 'map',
        geoIndex: 0,
        data: gxdata
      },
      {
        name: '宾阳县施骗用户数',
        type: 'effectScatter', // 配置显示方式为用户自定义
        rippleEffect: { // 涟漪特效相关配置。
          period: 4, // 动画的时间。
          scale: 4, // 动画中波纹的最大缩放比例。
          brushType: 'fill' // 波纹的绘制方式，可选 'stroke' 和 'fill'。
        },
        symbolSize: 13,
        coordinateSystem: 'geo',
        itemStyle: {
          normal: {
            color: 'red'
          }
        },
        data: pointsSource
      }
    ]
    if (state.isLoading) {
      chartsObj.hideLoading()
      commit('closeLoading')
    }

    chartsObj.setOption({
      series: series
    })
  }

}

const mutations = {
  closeLoading (state) {
    state.isLoading = false
  },
  openLoading (state) {
    state.isLoading = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
