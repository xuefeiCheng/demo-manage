import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式

import store from '@/store/index' // 引入全局store

import Bigscreen from '@/pages/Bigscreen'
import Bigscreenljdx from '@/pages/Bigscreen_ljdx'
import Bigscreenwjz from '@/pages/Bigscreen_wjz'
import Bigscreenzpdh from '@/pages/Bigscreen_zpdh'
import Bigscreenrmsj from '@/pages/Bigscreen_rmsj'
import Bigscreenmap from '@/pages/Bigscreen_map'
import Bigscreenzpsjgl from '@/pages/Bigscreen_zpsjgl'
import Bigscreeninter from '@/pages/Bigscreen_inter'
import Bigscreentop from '@/pages/Bigscreen_top'
import MainOne from '@/components/container/MainOne'
import Page404 from '@/pages/errorPages/Page404'
import Page500 from '@/pages/errorPages/Page500'
// import PageOne from '@/pages/PageOne'
// PageTwo from '@/pages/PageTwo'
// import PageThree from '@/pages/PageThree'
// import PageFour from '@/pages/PageFour'

// 伪基站管理
import PseudoZhui from '@/pages/pseudoManager/PseudoZhui'
// import PseudoPer from '@/pages/pseudoManager/PseudoPer'
import PseudoOk from '@/pages/pseudoManager/PseudoOk'

// 大屏重新整理路径
import _Bigscreenglobal from '@/pages/bigScreen/Bigscreen_global'
import _BigscreenglobalB from '@/pages/bigScreen/box/Bigscreen_globalB'

import _Smallscreenljdx from '@/pages/bigScreen/pages/ljdx/Bigscreen_ljdx_small'
import _Smallscreenwjz from '@/pages/bigScreen/pages/wjz/Bigscreen_wjz_small'
import _Smallscreenzpdh from '@/pages/bigScreen/pages/zpdh/Bigscreen_zpdh_small'
import _Smallscreenrmsj from '@/pages/bigScreen/pages/rmsj/Bigscreen_rmsj_small'
// import _Smallscreenzpsjgl from '@/pages/bigScreen/pages/zpsjgl/Bigscreen_zpsjgl_small_test'
import _Smallscreenzpsjgl from '@/pages/bigScreen/pages/zpsjgl/Bigscreen_zpsjgl_small'
import _Smallscreentop from '@/pages/bigScreen/pages/top/Bigscreen_top_small'
// 导入路由模块
Vue.use(Router)

const initialRouteMap = [
  { path: '/login', component: () => import('@/pages/Login') },
  { path: '/tokenLogin', component: () => import('@/pages/TokenLogin') },
  { path: '/bigscreen', component: Bigscreen },
  { path: '/bigscreen/ljdx', component: Bigscreenljdx },
  { path: '/bigscreen/wjz', component: Bigscreenwjz },
  { path: '/bigscreen/zpdh', component: Bigscreenzpdh },
  { path: '/bigscreen/rmsj', component: Bigscreenrmsj },
  { path: '/bigscreen/map', component: Bigscreenmap },
  { path: '/bigscreen/top', component: Bigscreentop },
  { path: '/bigscreen/zpsjgl', component: Bigscreenzpsjgl },
  { path: '/bigscreen/inter', component: Bigscreeninter },
  {
    path: '/bigscreenglobal',
    name: 'BigscreenGlobal',
    redirect: '/bigscreenglobal/map/inter',
    component: _Bigscreenglobal,
    children: [
      {
        path: 'map',
        name: 'Map',
        redirect: '/bigscreenglobal/map/inter',
        components: {
          default: _BigscreenglobalB,
          leftTop: _Smallscreenljdx,
          leftMiddle: _Smallscreenzpsjgl,
          leftBottom: _Smallscreenwjz,
          rightTop: _Smallscreenzpdh,
          rightMiddle: _Smallscreentop,
          rightBottom: _Smallscreenrmsj
        },
        children: [
          {
            path: 'inter',
            // component: () => import('@/pages/bigScreen/pages/inter/Bigscreen_inter_test')
            component: () => import('@/pages/bigScreen/pages/inter/Bigscreen_inter')
          },
          {
            path: 'map',
            component: () => import('@/pages/bigScreen/pages/map/Bigscreen_map.1')
          },
          {
            path: 'oldmap',
            component: () => import('@/pages/bigScreen/pages/map/Bigscreen_map_old')
          },
          {
            path: 'bigdata/:src',
            component: () => import('@/pages/bigScreen/box/Bigscreen_data')
          },
          {
            // 拦截短信 --  更名为 有害短信
            path: 'ljdx',
            component: () => import('@/pages/bigScreen/pages/ljdx/Bigscreen_ljdx')
          },
          {
            // 伪基站
            path: 'wjz',
            component: () => import('@/pages/bigScreen/pages/wjz/Bigscreen_wjz')
          },
          {
            // 诈骗电话
            path: 'zpdh',
            component: () => import('@/pages/bigScreen/pages/zpdh/Bigscreen_zpdh')
          },
          {
            // 热门事件
            path: 'rmsj',
            component: () => import('@/pages/bigScreen/pages/rmsj/Bigscreen_rmsj')
          },
          {
            // top
            path: 'top',
            component: () => import('@/pages/bigScreen/pages/top/Bigscreen_top')
          },
          {
            // 诈骗事件关联
            path: 'zpsjgl',
            component: () => import('@/pages/bigScreen/pages/zpsjgl/Bigscreen_zpsjgl')
          },
          { // 其他
            path: 'others/:xuhao',
            component: () => import('@/pages/bigScreen/pages/others/others')
          },
          {
            // 资源共享和协同联动
            path: 'resourceShare',
            component: () => import('@/pages/bigscreen/pages/resourceShare/index')
          },
          {
            // 大屏参数介绍
            path: 'canshu',
            component: () => import('@/pages/bigscreen/pages/canshu/canshu')
          },
          {
            // 机房配套设施建设
            path: 'generatorroom',
            component: () => import('@/pages/bigscreen/pages/generatorRoom/generatorroom')
          },
          {
            // 安全隔离系统
            path: 'safety',
            component: () => import('@/pages/bigscreen/pages/safety/safety')
          },
          {
            // 实验验证系统
            path: 'testConfirm',
            component: () => import('@/pages/bigscreen/pages/testConfirm/testConfirm')
          },
          {
            // 电信网前端接入与拦截子系统
            path: 'dxwqdjr',
            component: () => import('@/pages/bigscreen/pages/dxwqdjr/dxwqdjr')
          },
          {
            // 移动网信令和移动互联网接入系统
            path: 'mobile',
            component: () => import('@/pages/bigScreen/pages/mobile/mobile')
          },
          {
            // 固定互联网络接入子系统
            path: 'fixInter',
            component: () => import('@/pages/bigScreen/pages/fixInter/fixInter')
          },
          {
            // 诈骗处置子系统
            path: 'fraudHandle',
            component: () => import('@/pages/bigScreen/pages/fraudHandle/fraudHandle')
          },
          { // 综合分析资源监测系统 -- 录音型诈骗语音分析检测子系统大屏界面设计
            path: 'analysis/luyin',
            component: () => import('@/pages/bigScreen/pages/zhfxzyjcxt/luyin')
          },
          { // 综合分析资源监测系统 -- 诈骗短消息分析大屏
            path: 'analysis/zpdxxfx',
            component: () => import('@/pages/bigScreen/pages/zhfxzyjcxt/zpdxxfx')
          },
          {
            path: 'analysis/thxwtz', // 综合分析资源监测系统 --基于通话行为特征的诈骗分析
            component: () => import('@/pages/bigScreen/pages/zhfxzyjcxt/thxwtz')
          },
          {
            path: 'analysis/zpsjgl', // 综合分析资源监测系统 --诈骗事件关联与还原
            component: () => import('@/pages/bigScreen/pages/zhfxzyjcxt/zpsjgl')
          },
          {
            path: 'analysis/wjzfx', // 综合分析资源监测系统 --伪基站分析
            component: () => import('@/pages/bigScreen/pages/zhfxzyjcxt/wjzfx')
          },
          {
            path: 'analysis/rdsjssjk', // 综合分析资源监测系统 --热点事件实时监控
            component: () => import('@/pages/bigScreen/pages/zhfxzyjcxt/rdsjssjk')
          },
          {
            path: 'analysis/rddqssjk', // 综合分析资源监测系统 --热点地区实时监控
            component: () => import('@/pages/bigScreen/pages/zhfxzyjcxt/rddqssjk')
          },
          {
            path: 'analysis/orbit', // 综合分析资源监测系统 --宾阳轨迹
            component: () => import('@/pages/bigScreen/pages/zhfxzyjcxt/orbit')
          }
        ]
      }
    ]
  },
  {
    path: '/pages',
    redirect: '/pages/p404',
    name: 'Pages',
    component: {
      render (c) { return c('router-view') }
    },
    children: [{ path: '404', name: 'Page404', component: Page404 },
      { path: '500', name: 'Page500', component: Page500 }
    ]
  }
]

export const asyncRouterMap = [
  {
    path: '/home',
    name: '首页',
    menuId: 'home',
    component: MainOne,
    children: [
      { path: 'index', name: '首页', icon: 'ios-color-filter', component: () => import('@/pages/demoIndex'), menuId: 'index' }
    ]
  },
  {
    path: '/business',
    redirect: '/business/black',
    name: '电话反诈分析',
    menuId: 'business',
    component: MainOne,
    children: [
      { path: 'black', name: '疑似号码管理', icon: 'ios-color-filter', component: () => import('@/pages/listManager/BlackNumber'), menuId: 'black' },
      { path: 'white', name: '疑似受害用户号码', icon: 'ios-color-filter-outline', component: () => import('@/pages/listManager/WhiteNumber'), menuId: 'white' },
      { path: 'roam', name: '漫游号码异常管理', icon: 'ios-cube', component: () => import('@/pages/listManager/RoamNumber'), menuId: 'roam' },
      { path: 'exception', name: '异常漫入号码管理', icon: 'ios-chatboxes', component: () => import('@/pages/listManager/ExceptionNumber'), menuId: 'exception' },
      { path: 'local', name: '本地异常号码管理', icon: 'ios-color-filter-outline', component: () => import('@/pages/listManager/LocalNumber'), menuId: 'local' }
      // { path: 'base_info', name: '基础数据管理', icon: 'ios-cog', component: () => import('@/pages/listManager/CouncilManager'), menuId: 'base_info' },
      // { path: 'ywfile', name: '业务文档管理', icon: 'ios-document', component: () => import('@/pages/listManager/DocumentManager'), menuId: 'ywfile' },
      // { path: 'warning', name: '异常告警管理', icon: 'ios-warning', component: () => import('@/pages/listManager/WarningManager'), menuId: 'warning' },
      // { path: 'business_voice', name: '语音模板管理', icon: 'ios-mic', component: () => import('@/pages/listManager/VoiceManager'), menuId: 'business_voice' },
      // { path: 'business_review', name: '疑似号码取证审核', icon: 'ios-albums', component: () => import('@/pages/listManager/review'), menuId: 'business_review' },
      // { path: 'cheatnumber', name: '诈骗号码管理', icon: 'ios-cube', component: () => import('@/pages/listManager/Cheatnumber'), menuId: 'cheatnumber' },
      // { path: 'subscribe', name: '订阅管理', icon: 'ios-cube', component: () => import('@/pages/listManager/subscribe'), menuId: 'subscribe' },
      // {
      //   path: 'sys_search',
      //   name: '数据检索',
      //   icon: 'ios-construct-outline',
      //   component: () => import('@/pages/dataStatistics/sysSearch/sysSearch'),
      //   menuId: 'sys_search'
      // }
      // { path: 'request', name: '历史呼叫查询', icon: 'ios-paper', component: () => import('@/pages/listManager/Cdrrequest'), menuId: 'request' }
    ]
  },
  {
    path: '/pseudoManager',
    redirect: '/pseudoManager/psinfo',
    name: '伪基站管理',
    menuId: 'pseudoManager',
    component: MainOne,
    children: [
      // { path: 'psinfo', name: '伪基站信息展示', icon: 'ios-paper', component: PseudoInfo, menuId: 'psinfoManager' },
      // { path: 'pslist', name: '伪基站轨迹追踪', icon: 'ios-paper', component: PseudoZhui, menuId: 'pslistManager' },
      // { path: 'psper', name: '伪基站疑似受害人展示', icon: 'ios-paper', component: PseudoPer, menuId: 'psperManager' },
      // { path: 'psok', name: '正常基站信息展示', icon: 'ios-paper', component: PseudoOk, menuId: 'psokManager' }
      // { path: 'psinfoManager', name: '伪基站信息展示', icon: 'ios-paper', component: () => import('@/pages/pseudoManager/PseudoStationInfo'), menuId: 'psinfoManager' },
      { path: 'psokManager', name: '基础信息管理', icon: 'ios-cube', component: PseudoOk, menuId: 'psokManager' },
      { path: 'pslistManager', name: '伪基站信息展示', icon: 'ios-albums', component: PseudoZhui, menuId: 'pslistManager' },
      // { path: 'psperManager', name: '伪基站疑似受害人展示', icon: 'ios-paper', component: PseudoPer, menuId: 'psperManager' },
      { path: 'LACManager', name: '伪基站统计分析', icon: 'ios-paper', component: () => import('@/pages/pseudoManager/LacStationInfo'), menuId: 'LACManager' },
      { path: 'UsersStationManager', name: '伪基站呈现追踪', icon: 'ios-cog', component: () => import('@/pages/pseudoManager/UsersStationInfo'), menuId: 'UsersStationManager' }
    ]
  },
  {
    path: '/systemManage',
    redirect: '/systemManage/userManage',
    name: '运维管理',
    menuId: 'systemManage',
    component: MainOne,
    children: [
      { path: 'userManage', name: '用户管理', icon: 'ios-cog', component: () => import('@/pages/system/user'), menuId: 'userManage' },
      { path: 'role', name: '角色管理', icon: 'ios-chatboxes', component: () => import('@/pages/system/roleManage'), menuId: 'roleManager' },
      { path: 'log', name: '日志管理', icon: 'ios-paper', component: () => import('@/pages/system/logManage'), menuId: 'logManager' },
      { path: 'menu', name: '菜单管理', icon: 'ios-color-filter-outline', component: () => import('@/pages/system/menu'), menuId: 'menuManager' },
      { path: 'zuzhi', name: '组织机构管理', icon: 'ios-chatboxes', component: () => import('@/pages/system/zuzhi'), menuId: 'zuzhiManager' },
      { path: 'jiankong', name: '系统监控', icon: 'ios-document', component: () => import('@/pages/system/jiankong'), menuId: 'jiankongManager' },
      { path: 'gaojing', name: '告警方式', icon: 'ios-mic', component: () => import('@/pages/system/gaojing'), menuId: 'gaojingManager' }
    ]
  }
  // {
  //   path: '/spamsms',
  //   redirect: '/spamsms/spamsms_keywords',
  //   name: '短信管理',
  //   menuId: 'spamsms',
  //   component: MainOne,
  //   children: [
  //     {path: 'spamsms_keywords', name: '关键词管理', icon: 'logo-wordpress', component: () => import('@/pages/spamsms/keyword/list'), menuId: 'spamsms_keywords'},
  //     {path: 'spamsms_classify', name: '短信分类管理', icon: 'md-reorder', component: () => import('@/pages/spamsms/classify/list'), menuId: 'spamsms_classify'},
  //     {path: 'spamsms_template', name: '短信模板管理', icon: 'md-bookmarks', component: () => import('@/pages/spamsms/template/list'), menuId: 'spamsms_template'},
  //     {path: 'spamsms_manage', name: '短信管理', icon: 'ios-chatboxes', component: () => import('@/pages/spamsms/manage/list'), menuId: 'spamsms_manage'},
  //     {path: 'spamsms_statistic', name: '短信统计', icon: 'ios-paper', component: () => import('@/pages/spamsms/statistic/list'), menuId: 'spamsms_statistic'}
  //   ]
  // },
  // {
  //   path: '/ywplay',
  //   redirect: '/ywplay/topic',
  //   name: '业务演示',
  //   menuId: 'ywplay',
  //   component: MainOne,
  //   children: [
  //     {path: 'guard', name: '防范数据展示', icon: 'ios-cube', component: () => import('@/pages/ywplay/guard/Guard'), menuId: 'guard'},
  //     {path: 'cheat', name: '诈骗态势展示', icon: 'ios-cube', component: () => import('@/pages/ywplay/cheat/Cheat'), menuId: 'cheat'},
  //     { path: 'topic', name: '话题内容展示', icon: 'ios-calendar', component: () => import('@/pages/ywplay/topic/showTopic'), menuId: 'topic' },
  //     { path: 'sourceDIST', name: '来源分布展示', icon: 'logo-buffer', component: () => import('@/pages/ywplay/source/sourceDIST'), menuId: 'sourceDIST' }
  //   ]
  // },
  // {
  //   path: '/swindle_dispose',
  //   redirect: '/swindle_dispose/counterspell',
  //   name: '诈骗处置',
  //   menuId: 'swindle_dispose',
  //   component: MainOne,
  //   children: [
  //     {path: 'counterspell', name: '反制号码', icon: 'ios-alert-outline', component: () => import('@/pages/swindleDis/counterspell/Counterspell'), menuId: 'counterspell'},
  //     {path: 'locationana', name: '定位分析', icon: 'ios-compass', component: () => import('@/pages/swindleDis/locationAna/LocationAna'), menuId: 'locationana'},
  //     {path: 'swindle_template', name: '提醒模板管理', icon: 'ios-list-box-outline', component: () => import('@/pages/swindleDis/template/index'), menuId: 'swindle_template'},
  //     {path: 'swindle_remind', name: '处置提醒', icon: 'ios-alarm-outline', component: () => import('@/pages/swindleDis/remind/index'), menuId: 'swindle_remind'}
  //   ]
  // },
  // {
  //   path: '/strategy',
  //   redirect: '/strategy/manage',
  //   name: '防范策略管理',
  //   menuId: 'strategy',
  //   component: MainOne,
  //   children: [
  //     {path: 'manage', name: '防范策略管理', icon: 'ios-construct-outline', component: () => import('@/pages/strategy/manage'), menuId: 'strategy_manage'},
  //     {path: 'features', name: '特征库管理', icon: 'ios-hammer-outline', component: () => import('@/pages/strategy/features'), menuId: 'strategy_features'}
  //   ]
  // },
  // {
  //   path: '/analysis',
  //   redirect: '/analysis/hotspot',
  //   name: '综合分析监测',
  //   menuId: 'analysis',
  //   component: MainOne,
  //   children: [
  //     {
  //       path: 'hotspot',
  //       name: '诈骗事件关联',
  //       icon: 'ios-cube',
  //       component: () => import('@/pages/analysis/hotspot/hotspot'),
  //       menuId: 'hotspot'
  //     },
  //     {
  //       path: 'swindle_case',
  //       name: '热点事件实时监控',
  //       icon: 'ios-bulb',
  //       component: () => import('@/pages/analysis/swindleCase/SwindleCase'),
  //       menuId: 'swindle_case'
  //     },
  //     {path: 'analysis_device', name: 'GIS显示', icon: 'ios-pin-outline', component: () => import('@/pages/analysis/device/info'), menuId: 'analysis_device'},
  //     {path: 'plan_manage', name: '预案管理', icon: 'ios-bulb', component: () => import('@/pages/analysis/planManage/planManage'), menuId: 'plan_manage'},
  //     {path: 'analysis_plan', name: '已触发预案', icon: 'ios-cube', component: () => import('@/pages/analysis/plan/plan'), menuId: 'analysis_plan'},
  //     {
  //       path: 'analysis_sta',
  //       name: '统计分析',
  //       icon: 'ios-color-filter',
  //       component: () => import('@/pages/dataStatistics/analysisSta/analysisSta'),
  //       menuId: 'analysis_sta'
  //     },
  //     { path: 'orbit', name: '宾阳用户轨迹', icon: 'ios-paper', component: () => import('@/pages/analysis/orbit/orbit'), menuId: 'orbit' }
  //   ]
  // },
  // {
  //   path: '/data_statistics',
  //   redirect: '/data_statistics/inter_sta',
  //   name: '数据统计',
  //   menuId: 'data_statistics',
  //   component: MainOne,
  //   children: [
  //     {
  //       path: 'inter_sta',
  //       name: '拦截量统计',
  //       icon: 'ios-cube',
  //       component: () => import('@/pages/dataStatistics/interceptionSta/InterSta'),
  //       menuId: 'inter_sta'
  //     },
  //     {
  //       path: 'report_sta',
  //       name: '自动报表统计',
  //       icon: 'ios-bulb',
  //       component: () => import('@/pages/dataStatistics/reportSta/ReportSta'),
  //       menuId: 'report_sta'
  //     },
  //     {
  //       path: 'sys_warning',
  //       name: '异常监控及恢复',
  //       icon: 'ios-warning-outline',
  //       component: () => import('@/pages/dataStatistics/sysWarning/SysWarning'),
  //       menuId: 'sys_warning'
  //     }
  //     // {
  //     //   path: 'sys_search',
  //     //   name: '数据检索',
  //     //   icon: 'ios-construct-outline',
  //     //   component: () => import('@/pages/dataStatistics/sysSearch/sysSearch'),
  //     //   menuId: 'sys_search'
  //     // },
  //     // {
  //     //   path: 'guarding_rec',
  //     //   name: '异常监控及恢复',
  //     //   icon: 'ios-cube',
  //     //   component: () => import('@/pages/dataStatistics/guardingRec/GuardingRec'),
  //     //   menuId: 'guarding_rec'
  //     // }
  //   ]
  // }
  /* {
    path: '/druid',
    redirect: '/druid',
    name: 'Druid监控',
    menuId: 'druid',
    component: MainOne,
    children: [
      {path: '', component: () => import('@/pages/druid/index'), menuId: 'druid'}
    ]
  } */
]

const router = new Router({
  routes: initialRouteMap
})

// 简单配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

// 全局路由开始守卫
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.getters.token && store.getters.menus) { // 已登录并且菜单已生成
    if (store.getters.addRouterMap.length === 0) { // 尚未生成一级菜单
      // 根据路由树生成路由、一级菜单
      store.dispatch('generateAddRouterMapAndMenu', store.getters.menus).then(() => {
        // 由于添加的路由表是异步的，在没有填进去之前是重新路由
        router.addRoutes([{path: '/', redirect: store.getters.addRouterMap[0].path}])
        router.addRoutes(store.getters.addRouterMap)
        router.addRoutes([{ path: '*', redirect: '/pages/404' }])
        next({ ...to, replace: true })
      })
    } else { // 已经生成二级菜单
      // 登录进来之后进入添加路由的第一路由或者已经登录成功之后
      if (to.fullPath === '/' || to.fullPath === '/login') {
        next(store.getters.addRouterMap[0].path)
      } else {
        store.dispatch('generateCurrentSiderMenus', to)
        next()
      }
    }
  } else { // 未登录
    if (to.path.indexOf('/bigscreen') !== -1) {
      next()
    } else if (to.path === '/tokenLogin') {
      next()
    } else if (to.path === '/login') {
      next()
    } else {
      // 走其他页面登录
      // location.href = 'http://10.1.62.13:8231'

      // 走登录页面登录
      next('/login')
    }
    NProgress.done()
  }
})

// 全局路由结束守卫
router.afterEach(() => {
  NProgress.done()
})

export default router
