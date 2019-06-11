import Cookies from 'js-cookie'
import { httpLoginByEmail, httpLoginOut, httpLoginByName } from '../../api/login'
import sessionStore from '../../utils/sessionStore'

// 构建用户路由表
function iterateRouteItem (routeTreeNode, routeData) {
  routeData.forEach(menuItem => {
    if (menuItem.parentMenu === routeTreeNode.menuId) {
      routeTreeNode.children.push(menuItem)
      menuItem.children = []
      iterateRouteItem(menuItem, routeData)
    }
  })
}

// 用户状态
const user = {
  state: {
    email: '',
    password: '',
    name: Cookies.get('user-name'), // 用户的名字
    token: Cookies.get('Admin-Token'), // 用户从后端获取的token值,
    // token: '71afcddc-b480-433e-aaf2-4e6ba0fa3834',
    menus: sessionStore.getItemData('menus'), // 保存对应用户的菜单设置
    routeTree: []
  },

  mutations: {
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_PASSWORD: (state, password) => {
      state.password = password
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_ROUTE_TREE: (state, routeTree) => {
      state.routeTree = routeTree
    },
    LOGOUT: (state) => {
      Cookies.remove('Admin-Token')
      state.token = null
      location.reload()
    }
  },

  actions: {
    LoginByEmail ({ commit }, userInfo) {
      console.log('在user表里面commit', commit)
      const email = userInfo.email.trim()
      const password = userInfo.password.trim()
      return new Promise((resolve, reject) => {
        httpLoginByEmail(email, password).then(response => {
          // console.log('返回的数据', response)

          if (response.code === 200) {
            let menusData = response.data.menu
            // 保存token数据到cookie ，vuex
            if (userInfo.token !== '') {
              Cookies.set('Admin-Token', userInfo.token)
              commit('SET_TOKEN', userInfo.token)
            } else {
              Cookies.set('Admin-Token', response.data.token)
              commit('SET_TOKEN', response.data.token)
            }

            // 保存菜单数据到vuex ，sessionStorage
            commit('SET_MENUS', menusData)
            sessionStore.setItemData('menus', menusData)

            // 生成routeTree数据
            let routeTree = menusData.filter(menuItem => {
              if (menuItem.parentMenu) {
                return false
              } else {
                menuItem.children = []
                return true
              }
            })
            routeTree.forEach(menuItem => {
              iterateRouteItem(menuItem, menusData)
            })
            commit('SET_EMAIL', email)
            commit('SET_PASSWORD', password)
            commit('SET_NAME', email.split('@')[0])
            Cookies.set('user-name', email.split('@')[0])
            commit('SET_ROUTE_TREE', routeTree)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 通过用户名登录
    loginByName ({commit, state}, userInfo) {
      const name = userInfo.name.trim()
      const password = userInfo.password.trim()
      return new Promise((resolve, reject) => {
        httpLoginByName(name, password).then(response => {
          // console.log('store user  请求数据', response)
          if (response.code === 200) {
            // 菜单默认
            let menusData = [
              {menuId: 'home', menuName: '首页', url: '#'},
              {menuId: 'index', menuName: '首页', url: '/home', parentMenu: 'home'},
              {menuId: 'systemManage', menuName: '运维管理', url: '#'},
              {menuId: 'userManage', menuName: '用户管理', url: '/userManage', parentMenu: 'systemManage'},
              {menuId: 'roleManager', menuName: '角色管理', url: '/role', parentMenu: 'systemManager'},
              {menuId: 'menuManager', menuName: '菜单管理', url: '/menu', parentMenu: 'systemManager'},
              {menuId: 'zuzhiManager', menuName: '组织机构管理', url: '/zuzhi', parentMenu: 'systemManager'},
              {menuId: 'jiankongManager', menuName: '系统监控', url: '/jiankong', parentMenu: 'systemManager'},
              {menuId: 'gaojingManager', menuName: '告警方式', url: '/gaojing', parentMenu: 'systemManager'},
              {menuId: 'permissionManager', menuName: '权限管理', url: '/permission', parentMenu: 'systemManager'},
              {menuId: 'logManager', menuName: '日志管理', url: '/log', parentMenu: 'systemManager'},
              {menuId: 'business', menuName: '业务管理', url: '#'},
              {menuId: 'black', menuName: '疑似号码管理', url: '/black', parentMenu: 'business'},
              {menuId: 'white', menuName: '疑似受害用户号码', url: '/white', parentMenu: 'business'},
              {menuId: 'roam', menuName: '漫游号码异常管理', url: '/roam', parentMenu: 'business'},
              {menuId: 'exception', menuName: '异常漫入号码管理', url: '/exception', parentMenu: 'business'},
              {menuId: 'local', menuName: '本地异常号码管理', url: '/local', parentMenu: 'business'},
              {menuId: 'base_info', menuName: '基础数据管理', url: '/council', parentMenu: 'business'},
              {menuId: 'ywfile', menuName: '业务文档管理', url: '/document', parentMenu: 'business'},
              {menuId: 'warning', menuName: '异常告警管理', url: '/warning', parentMenu: 'business'},
              {menuId: 'business_voice', menuName: '语音模板管理', url: '/voice', parentMenu: 'business'},
              {menuId: 'business_review', menuName: '疑似号码取证审核', url: '/review', parentMenu: 'business'},
              {menuId: 'cheatnumber', menuName: '诈骗号码管理', url: '/cheatnumber', parentMenu: 'business'},
              {menuId: 'subscribe', menuName: '订阅管理', url: '/subscribe', parentMenu: 'business'},
              {menuId: 'sys_search', menuName: '数据检索', url: '#', parentMenu: 'data_statistics'},
              // {menuId: 'request', menuName: '历史呼叫查询', url: '/request', parentMenu: 'business'},
              {menuId: 'spamsms', menuName: '垃圾短信管理', url: '#'},
              {menuId: 'spamsms_keywords', menuName: '关键词管理', url: '/keywords', parentMenu: 'spamsms'},
              {menuId: 'spamsms_classify', menuName: '短信分类管理', url: '/classify', parentMenu: 'spamsms'},
              {menuId: 'spamsms_template', menuName: '短信模板管理', url: '/template', parentMenu: 'spamsms'},
              {menuId: 'spamsms_manage', menuName: '垃圾短信管理', url: '/manage', parentMenu: 'spamsms'},
              {menuId: 'spamsms_statistic', menuName: '垃圾短信统计', url: '/statistic', parentMenu: 'spamsms'},
              {menuId: 'pseudoManager', menuName: '伪基站管理', url: '#'},
              // {menuId: 'psinfoManager', menuName: '伪基站信息展示', url: '/psinfo', parentMenu: 'pseudoManager'},
              {menuId: 'pslistManager', menuName: '伪基站信息展示', url: '/pslist', parentMenu: 'pseudoManager'},
              {menuId: 'psperManager', menuName: '伪基站疑似受害人展示', url: '/psper', parentMenu: 'pseudoManager'},
              {menuId: 'psokManager', menuName: '基础信息管理', url: '/psok', parentMenu: 'pseudoManager'},
              {menuId: 'LACManager', menuName: '伪基站统计分析', url: '/lac', parentMenu: 'pseudoManager'},
              {menuId: 'UsersStationManager', menuName: '伪基站呈现追踪', url: '/usersStation', parentMenu: 'pseudoManager'},
              {menuId: 'ywplay', menuName: '业务演示', url: '#'},
              {menuId: 'guard', menuName: '防范数据演示', url: '/guard', parentMenu: 'ywplay'},
              {menuId: 'cheat', menuName: '诈骗态势展示', url: '/cheat', parentMenu: 'ywplay'},
              {menuId: 'topic', menuName: '话题内容展示', url: '/topic', parentMenu: 'ywplay'},
              {menuId: 'sourceDIST', menuName: '来源分布展示', url: '/sourceDIST', parentMenu: 'ywplay'},
              {menuId: 'swindle_dispose', menuName: '诈骗处置', url: '#'},
              {menuId: 'counterspell', menuName: '反制功能', url: '/counterspell', parentMenu: 'swindle_dispose'},
              {menuId: 'locationana', menuName: '定位分析', url: '/locationana', parentMenu: 'swindle_dispose'},
              {menuId: 'swindle_template', menuName: '提醒模板管理', url: '/swindle_template', parentMenu: 'swindle_dispose'},
              {menuId: 'swindle_remind', menuName: '处置提醒', url: '/swindle_remind', parentMenu: 'swindle_dispose'},
              {menuId: 'strategy', menuName: '防范策略管理', url: '/strategy', parentMenu: '#'},
              {menuId: 'strategy_manage', menuName: '防范策略管理', url: '/strategy_manage', parentMenu: 'strategy'},
              {menuId: 'strategy_features', menuName: '特征库管理', url: '/strategy_features', parentMenu: 'strategy'},
              {menuId: 'analysis', menuName: '综合分析监测', url: '#'},
              {menuId: 'hotspot', menuName: '诈骗事件关联', url: '/hotspot', parentMenu: 'analysis'},
              {menuId: 'swindle_case', menuName: '热点事件实时监控', url: '/swindle_case', parentMenu: 'analysis'},
              {menuId: 'analysis_device', menuName: 'GIS显示', url: '/analysis_device', parentMenu: 'analysis'},
              {menuId: 'plan_manage', menuName: '预案管理', url: '/plan_manage', parentMenu: 'analysis'},
              {menuId: 'analysis_plan', menuName: '已触发预案', url: '/analysis_plan', parentMenu: 'analysis'},
              {menuId: 'orbit', menuName: '宾阳用户轨迹', url: '/orbit', parentMenu: 'orbit'},
              {menuId: 'analysis_sta', menuName: '统计分析', url: '#', parentMenu: 'analysis'},
              {menuId: 'data_statistics', menuName: '数据统计', url: '#'},
              {menuId: 'inter_sta', menuName: '拦截量统计', url: '#', parentMenu: 'data_statistics'},
              {menuId: 'report_sta', menuName: '自动报表统计', url: '#', parentMenu: 'data_statistics'},
              {menuId: 'sys_warning', menuName: '异常监控及恢复', url: '#', parentMenu: 'data_statistics'}
              // {menuId: 'sys_search', menuName: '数据检索', url: '#', parentMenu: 'data_statistics'},
              // {menuId: 'guarding_rec', menuName: '异常监控及恢复', url: '#', parentMenu: 'data_statistics'}
              // {menuId: 'druid', menuName: 'Druid监控', url: '#'}
            ]
            // 保存token数据到cookie ，vuex
            Cookies.set('Admin-Token', response.data.token)
            commit('SET_TOKEN', response.data.token)
            // 保存菜单数据到vuex ，sessionStorage
            commit('SET_MENUS', menusData)
            sessionStore.setItemData('menus', menusData)
            commit('SET_PASSWORD', password)
            commit('SET_NAME', name)
            Cookies.set('user-name', name)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 退出
    LogOut ({ commit, state }) {
      // console.log('在用户js中的state', state)
      return new Promise((resolve, reject) => {
        httpLoginOut(state.token).then((response) => {
          if (response.code === 200) {
            commit('SET_TOKEN', '')
            Cookies.remove('Admin-Token')
            commit('SET_ADD_ROUTER_MAP', [])
            location.reload()
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
