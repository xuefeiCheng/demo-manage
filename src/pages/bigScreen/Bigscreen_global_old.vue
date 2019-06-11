<template>
<!-- 导航第四版 导航是一个整体 -->
  <div class="data relative noback back mapTab_global mapTab inter_mapTab allHeight" id="transform">
    <!-- :transfer="false" :inner="true" -->
    <!-- <Drawer title="Basic Drawer" :width='17' placement="left" :closable="false" v-model="menuModal" class="navDrawer" @on-close="initWin">
      <div slot="header">
        <div class="ivu-drawer-header-inner">快速链接</div>
        <a class="ivu-drawer-close" @click="initWin"><i class="ivu-icon ivu-icon-ios-close"></i></a>
      </div>
      <Collapse accordion simple v-model="checkNum">
        <Panel name="1" :hide-arrow="true" class="no-content">
          <p slot="header">
            <p @click="goto('/bigscreenglobal/map/inter')">互联网诈骗</p>
          </p>
        </Panel>
        <Panel name="2" :hide-arrow="true" class="no-content">
          <p slot="header">
            <p @click="goto('/bigscreenglobal/map/bigdata')">大数据平台系统</p>
          </p>
        </Panel>
        <Panel name="3" class="is-content">
          电话网诈骗
          <p slot="content">
            <ul class="ivu-dropdown-menu" slot="list">
              <li class="ivu-dropdown-item" @click="goto('/bigscreenglobal/map/map')">电话诈骗实时监控</li>
              <li class="ivu-dropdown-item" @click="goto('/bigscreenglobal/map/zpsjgl')">诈骗事件关联</li>
              <li class="ivu-dropdown-item" @click="goto('/bigscreenglobal/map/zpdh')">诈骗电话</li>
              <li class="ivu-dropdown-item" @click="goto('/bigscreenglobal/map/rmsj')">热门事件</li>
              <li class="ivu-dropdown-item" @click="goto('/bigscreenglobal/map/top')">拦截量前五</li>
            </ul>
          </p>
        </Panel>
        <Panel name="4" class="is-content">
          其他
          <p slot="content">
            <ul class="ivu-dropdown-menu" slot="list">
              <li class="ivu-dropdown-item" @click="goto('/bigscreenglobal/map/ljdx')">有害短信</li>
              <li class="ivu-dropdown-item" @click="goto('/bigscreenglobal/map/wjz')">伪基站</li>
            </ul>
          </p>
        </Panel>
      </Collapse>
    </Drawer> -->
    <div :class="[this.isDis?'show':'hidden']" style="display: none;width: 100%;height: 100%;position: fixed;background: #141d3394;z-index: 100;" @click="close">
    <ul :class="[this.isDis?'show':'hidden']" class="drawer">
      <div class="ivu-drawer-header-inner" style="border-top:1px solid #cccccc47;position:relative;color:#fff;height:50px;line-height:35px;text-align:left;font-size:18px;">
        快速链接
        <b style="position:absolute;font-size:12px;top:0;" class="ivu-drawer-close" @click="close"><i class="ivu-icon ivu-icon-ios-close"></i></b>
      </div>
      <li @click="close"><router-link tag="a" to="/bigscreenglobal/map/others/01"><span>电信网前端接入与拦截子系统</span></router-link></li>
      <li @click="close"><router-link tag="a" to="/bigscreenglobal/map/others/02"><span>移动网信令和移动互联网接入子系统</span></router-link></li>
      <li @click="close"><router-link tag="a" to="/bigscreenglobal/map/others/03"><span>固定互联网络接入子系统</span></router-link></li>
      <li @click="close"><router-link tag="a" to="/bigscreenglobal/map/bigdata/index"><span>大数据综合管理系统</span></router-link></li>
      <li @click="close"><router-link tag="a" to="/bigscreenglobal/map/others/04"><span>云计算资源池</span></router-link></li>
      <li>
        <!-- class="active" -->
        <a @click="Noclose"><span>综合分析资源监测系统</span><span style="display:inline-block;float:right;font-size:18px">></span></a>
        <div style="width:100%;">
          <ol  @click="close"><router-link to="/bigscreenglobal/map/others/05"><span>录音型诈骗语音分析检测子系统</span></router-link></ol>
          <ol  @click="close"><router-link to="/bigscreenglobal/map/analysis/thxwtz"><span>基于通话行为特征的诈骗电话分析检测软件</span></router-link></ol>
          <ol  @click="close"><router-link to="/bigscreenglobal/map/analysis/zpdxxfx"><span>诈骗短消息分析检测软件</span></router-link></ol>
          <ol  @click="close"><router-link to="/bigscreenglobal/map/analysis/wjzfx"><span>伪基站分析监测软件</span></router-link></ol>
          <ol  @click="close"><router-link to="/bigscreenglobal/map/inter"><span>互联网诈骗防范拦截系统</span></router-link></ol>
          <ol  @click="close"><router-link to="/bigscreenglobal/map/bigdata/zonghe"><span>互联网综合管理系统</span></router-link></ol>
          <ol  @click="close"><router-link to="/bigscreenglobal/map/analysis/zpsjgl"><span>诈骗事件关联与场景还原软件</span></router-link></ol>
          <ol  @click="close"><router-link to="/bigscreenglobal/map/analysis/rdsjssjk"><span>热点事件实时监控</span></router-link></ol>
        </div>
      </li>
      <li  @click="close"><router-link tag="a" to="/bigscreenglobal/map/zpczzxt"><span>诈骗处置系统</span></router-link></li>
      <li  @click="close"><router-link tag="a" to="/bigscreenglobal/map/map"><span>综合业务管理系统</span></router-link></li>
      <li  @click="close"><router-link tag="a" to="/bigscreenglobal/map/others/15"><span>资源共享和协同联动系统</span></router-link></li>
      <li  @click="close"><router-link tag="a" to="/bigscreenglobal/map/others/18"><span>安全隔离系统</span></router-link></li>
      <li  @click="close"><router-link tag="a" to="/bigscreenglobal/map/others/19"><span>实验验证系统</span></router-link></li>
      <li>
        <a @click="Noclose"><span>智能监控系统</span><span style="display:inline-block;float:right;font-size:18px">></span></a>
        <div style="width:100%">
          <li  @click="close"><router-link to="/bigscreenglobal/map/others/23"><span>大屏参数介绍</span></router-link></li>
          <li  @click="close"><router-link to="/bigscreenglobal/map/others/20"><span>视频会议</span></router-link></li>
        </div>
      </li>
      <li  @click="close"><router-link tag="a" to="/bigscreenglobal/map/others/21"><span>运维支撑系统</span></router-link></li>
      <li>
        <a @click="Noclose"><span>机房配套建设</span><span style="display:inline-block;float:right;font-size:18px">></span></a>
        <div style="width:100%">
          <li  @click="close"><router-link to="/bigscreenglobal/map/others/24"><span>机房配套设施介绍</span></router-link></li>
          <li  @click="close"><router-link to="/bigscreenglobal/map/others/22"><span>机房实时监控</span></router-link></li>
        </div>
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
        <!-- <div class="dividerBox"></div> -->
        <div class="global_left_box">
          <div class="top othersons"><router-view name="leftTop"/></div>
          <div class="middle sons"><router-view name="leftMiddle"/></div>
          <div class="bottom sons"><router-view name="leftBottom"/></div>
        </div>
                  <div ref="topBar" class="top-bar" id="top-bar">
      <div class="bar bar-position">
        <button id="navbox-trigger" class="navbox-trigger" @click="change">
          <!-- windows logo -->
          <!-- <i class="fa iconfont icon-windows"></i> -->
        </button>
      </div>
    </div>
      </div>
      <div class="global_middle"><router-view/></div>
      <div class="global_right">
        <!-- <div class="dividerBox">
          <div class="timeBox timeBox_inter">
            <div>{{localtime}}</div>
            <div>{{localdate}}</div>
          </div>
        </div> -->
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
  data () {
    return {
      menuModal: false,
      checkNum: '1',
      localtime: '',
      localdate: '',
      title: '广西电信诈骗防范拦截系统',
      subtext: 'Guangxi Telecom Fraud Prevention and Interception System',
      fenbianl: '',
      isDis: false // 是否显示
    }
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
    close () {
      this.isDis = false
      event.stopPropagation() // 停止事件的传播
    },
    change ()  {
      this.isDis = !this.isDis
    },
    Noclose () {
      event.stopPropagation() // 停止事件的传播
    },
    openWin () {
      this.menuModal = true
    },
    changeWin () {
      this.menuModal = !this.menuModal
    },
    initWin () {
      // 关闭导航展开部分
      this.menuModal = false
      // 下拉菜单默认关闭
      this.checkNum = '1'
    },
    goto (router) {
      // this.title = '测试'
      this.$router.push(router)
      this.initWin()
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
#transform {
  transform: scale(0.6530612244897959,1);
  transform-origin:top left;
}
/* html,body,#app {height: 100%; min-width: 2940px;} */
</style>
