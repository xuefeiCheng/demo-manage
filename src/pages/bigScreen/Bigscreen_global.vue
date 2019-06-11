<template>
<!-- 导航第四版 导航是一个整体 -->
  <div class="data relative noback back mapTab_global mapTab inter_mapTab allHeight" id="transform">
    <div :class="[this.isDis?'show':'hidden']" style="display: none;width: 100%;height: 100%;position: fixed;background: #141d3394;z-index: 100;" @click="close">
    <ul :class="[this.isDis?'show':'hidden']" class="drawer">
      <div class="ivu-drawer-header-inner" style="border-top:1px solid #cccccc47;position:relative;color:#fff;height:50px;line-height:35px;text-align:left;font-size:18px;">
        快速链接
        <b style="position:absolute;font-size:12px;top:0;" class="ivu-drawer-close" @click="close"><i class="ivu-icon ivu-icon-ios-close"></i></b>
      </div>
      <li v-for="menu in menus" :key="menu.id" :class="menu.active ? 'active' : ''" @click="setActive(menu.id)">
        <!-- @click="Noclose" -->
        <a v-if="menu.hasChild"><span>{{menu.title}}</span><span style="display:inline-block;float:right;font-size:18px">></span></a>
        <div v-if="menu.hasChild" style="width:100%;">
          <ol v-for="m in menu.child" :key="m.title" @click="Noclose">
            <!-- a标签的阻止冒泡事件 无效 -->
            <router-link :to="m.url" :class="isActive === m.url ? 'actived' : ''"><span>{{m.title}}</span></router-link>
          </ol>
        </div>
        <router-link v-else-if='!menu.hasChild' tag="a" :to="menu.url"><span>{{menu.title}}</span></router-link>
      </li>
    </ul>
    </div>
    <div class="data-title">
      <div class="title-new fl" style="position:relative">
        <div>
          <div class="inter_title">{{title}}</div>
          <div class="inter_desctitle">{{subtext}}</div>
        </div>
        <div class="timeBox timeBox_inter">
          <div>{{localtime}}</div>
          <div>{{localdate}}</div>
        </div>
      </div>
    </div>
    <div class="global_box">
      <div class="global_left">
        <div class="global_left_box">
          <div class="top othersons"><router-view name="leftTop"/></div>
          <div class="middle sons"><router-view name="leftMiddle"/></div>
          <div class="bottom sons"><router-view name="leftBottom"/></div>
        </div>
      <div ref="topBar" class="top-bar" id="top-bar">
        <div class="bar bar-position">
          <button id="navbox-trigger" class="navbox-trigger" @click="change"></button>
        </div>
      </div>
      </div>
      <div class="global_middle"><router-view v-if="isRouterAlive" /></div>
      <div class="global_right">
        <div class="global_left_box">
          <div class="top othersons"><router-view name="rightTop"/></div>
          <div class="middle sons"><router-view name="rightMiddle"/></div>
          <div class="bottom sons"><router-view name="rightBottom"/></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="static/js/prefixfree.min.js"></script>
<script>
export default {
  name: 'bigscreenGlobal',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      menuModal: false,
      checkNum: '1',
      localtime: '',
      localdate: '',
      title: '系 统 介 绍',
      // subtext: 'Guangxi Telecom Fraud Prevention and Interception System',
      subtext: '',
      fenbianl: '',
      isDis: false, // 是否显示
      isRouterAlive: true,
      menus: [
        {
          id: 1,
          active: false,
          url: '/bigscreenglobal/map/dxwqdjr',
          title: '电信网前端接入与拦截子系统',
          hasChild: false,
          child: []
        },
        // {
        //   id: 2,
        //   active: false,
        //   url: '/bigscreenglobal/map/mobile',
        //   title: '移动网信令和移动互联网接入子系统',
        //   hasChild: false,
        //   child: []
        // },
        // {
        //   id: 3,
        //   active: false,
        //   url: '/bigscreenglobal/map/fixInter',
        //   title: '固定互联网络接入子系统',
        //   hasChild: false,
        //   child: []
        // },
        {
          id: 4,
          active: false,
          url: '/bigscreenglobal/map/bigdata/index',
          title: '大数据综合管理系统',
          hasChild: false,
          child: []
        },
        {
          id: 5,
          active: false,
          url: '/bigscreenglobal/map/bigdata/cloud',
          title: '云计算资源池',
          hasChild: false,
          child: []
        },
        {
          id: 6,
          active: true,
          url: '',
          title: '综合分析检测系统',
          hasChild: true,
          child: [
            {
              // url: '/bigscreenglobal/map/others/05',
              url: '/bigscreenglobal/map/analysis/luyin',
              title: '录音型诈骗语音分析检测子系统'
            },
            {
              url: '/bigscreenglobal/map/analysis/thxwtz',
              title: '基于通话行为特征的诈骗电话分析检测软件'
            },
            {
              url: '/bigscreenglobal/map/analysis/zpdxxfx',
              title: '诈骗短消息分析检测软件'
            },
            {
              url: '/bigscreenglobal/map/analysis/wjzfx',
              title: '伪基站分析监测软件'
            },
            {
              url: '/bigscreenglobal/map/bigdata/zonghe',
              title: '互联网诈骗防范拦截系统'
            },
            {
              url: '/bigscreenglobal/map/inter',
              title: '互联网综合管理系统'
            },
            {
              url: '/bigscreenglobal/map/analysis/zpsjgl',
              title: '诈骗事件关联与场景还原软件'
            },
            {
              url: '/bigscreenglobal/map/analysis/rdsjssjk',
              title: '热点事件实时监控'
            },
            {
              url: '/bigscreenglobal/map/analysis/rddqssjk',
              title: '重点地区实时监控'
            }
            // {
            //   url: '/bigscreenglobal/map/analysis/orbit',
            //   title: '宾阳用户轨迹'
            // }
          ]
        },
        {
          id: 7,
          active: false,
          url: '/bigscreenglobal/map/fraudHandle',
          // url: '/bigscreenglobal/map/others/14',
          title: '诈骗处置系统',
          hasChild: false,
          child: []
        },
        {
          id: 8,
          active: false,
          // url: '/bigscreenglobal/map/map',
          url: '/bigscreenglobal/map/bigdata/analysis',
          title: '综合业务管理系统',
          hasChild: false,
          child: []
        },
        {
          id: 9,
          active: false,
          url: '/bigscreenglobal/map/resourceShare',
          title: '资源共享和协同联动系统',
          hasChild: false,
          child: []
        },
        {
          id: 10,
          active: false,
          url: '/bigscreenglobal/map/safety',
          title: '安全隔离系统',
          hasChild: false,
          child: []
        },
        {
          id: 11,
          active: false,
          url: '/bigscreenglobal/map/testConfirm',
          title: '试验验证系统',
          hasChild: false,
          child: []
        },
        {
          id: 12,
          active: false,
          url: '/bigscreenglobal/map/canshu',
          title: '智能监控系统',
          hasChild: false,
          child: []
          // child: [
          //   {
          //     url: '/bigscreenglobal/map/canshu',
          //     title: '大屏参数介绍'
          //   },
          //   {
          //     url: '/bigscreenglobal/map/others/20',
          //     title: '视频会议'
          //   }
          // ]
        },
        {
          id: 13,
          active: false,
          url: '/bigscreenglobal/map/bigdata/support',
          title: '运维支撑系统',
          hasChild: false,
          child: []
        },
        {
          id: 14,
          active: false,
          url: '',
          title: '机房配套建设',
          hasChild: true,
          child: [
            {
              url: '/bigscreenglobal/map/generatorroom',
              title: '机房配套设施介绍'
            },
            {
              url: '/bigscreenglobal/map/others/22',
              title: '机房实时监控'
            }
          ]
        }
      ]
    }
  },
  computed: {
    isActive () {
      return this.$route.fullPath
    }
  },
  created: function() {
    // 热键 shift + A
    // var _this = this
    // document.onkeydown = function(e) {
    //   let key = window.event.keyCode
    //   let shiftKey = window.event.shiftKey
    //   if (key == 65 && shiftKey) {
    //     _this.$router.push({path: '/bigscreenglobal/map/inter'})
    //   }
    // }
  },
  mounted () {
    this.settimeIntervalid = setInterval(() => {
      this.gettime()
    }, 2000)
    this.initSize()
    window.onresize = () => {
      return (() => {
        this.$nextTick(() => {
          this.initSize()
        })
      })()
    }
    this.fenbianl = document.body.clientWidth + '*' + document.body.clientHeight
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    initSize () {
      const allHeight = document.getElementsByClassName('allHeight')[0].offsetHeight
      const sonHeight = allHeight * (1 / 3)
      const otherHeight = allHeight * (1 / 3) - 111
      const sons = document.getElementsByClassName('sons')
      const othersons = document.getElementsByClassName('othersons')
      for (let i = 0, le = sons.length; i < le; i++) {
        sons[i].style.height = sonHeight + 'px'
      }
      for (let i = 0, le = othersons.length; i < le; i++) {
        othersons[i].style.height = otherHeight + 'px'
      }
    },
    setActive (val) {
      this.menus.forEach((item, index, self) => {
        if (item.id == val) {
          item.active = !item.active
        } else {
          item.active = false
        }
        // item.id == val ? item.active = true : item.active = false
      })
      event.stopPropagation()
    },
    close () {
      this.isDis = false
      event.stopPropagation() // 停止事件的传播
    },
    change ()  {
      this.isDis = !this.isDis
    },
    Noclose () {
      event.preventDefault()
      event.stopPropagation() // 停止事件的传播
    },
    gettime () {
      var today = new Date()
      var hh = today.getHours()
      if (hh < 10) hh = '0' + hh
      var mm = today.getMinutes()
      if (mm < 10) mm = '0' + mm
      var ss = today.getSeconds()
      if (ss < 10) ss = '0' + ss
      this.localtime = hh + ':' + mm + ':' + ss
      this.localdate = this.showLocale(today)
    },
    showLocale (objD) {
      var str
      var yy = objD.getYear()
      if (yy < 1900) yy = yy + 1900
      var MM = objD.getMonth() + 1
      if (MM < 10) MM = '0' + MM
      var dd = objD.getDate()
      if (dd < 10) dd = '0' + dd
      var ww = objD.getDay()
      if (ww === 0) ww = '星期日'
      if (ww === 1) ww = '星期一'
      if (ww === 2) ww = '星期二'
      if (ww === 3) ww = '星期三'
      if (ww === 4) ww = '星期四'
      if (ww === 5) ww = '星期五'
      if (ww === 6) ww = '星期六'
      str = yy + '/' + MM + '/' + dd + ' ' + ww
      return (str)
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.settimeIntervalid)
  }
}
</script>
<style>
/* 是否显示 */
.hidden {display: none}
.show {display: block;}
.navDrawer .ivu-drawer-content, .navDrawer .ivu-collapse-simple {
  background-color: #484747 !important;
  background-color: #253c6f !important;
  font-size: 2vh;
}
.navDrawer .ivu-drawer-header-inner{color: #ccc !important;
font-size: 2vh;
}
.navDrawer .ivu-collapse-header {
  color: #fff !important;
}
.no-content .ivu-collapse-content-box{
  display: none !important;
}
.no-content .ivu-collapse-header {
  padding-left: 42px !important;
}
.is-content .ivu-dropdown-item{
  padding: 7px 32px !important;
  padding: 7px 5vh !important;
  color: #fff !important;
  height: 4.5vh;
  line-height: 3vh;
}
.is-content .ivu-dropdown-item:hover{
    background-color: #5f5f5f !important;
    background-color: #14213c !important;
}
.is-content .ivu-collapse-content{
    background-color: #484747 !important;
    background-color: #213560 !important;
}
/* 字体 */
.navDrawer .ivu-dropdown-item{
  font-size: 1.5vh !important;
}
/* 导航 */
.navDrawer .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
  height: 4vh;
  line-height: 4vh;
  padding-left: 1vh;
}
.navDrawer .ivu-drawer-content{
  box-sizing: border-box;
  /* padding-top: 167%; */
}
.navDrawer .ivu-drawer-header{
  position: relative;
}
</style>
