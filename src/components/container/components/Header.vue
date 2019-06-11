<template>
  <Header class="base-header">
    <Menu mode="horizontal" theme="dark" width="auto" :active-name="currentPath.split('/')[1]" ref="menuHead">
      <div class="layout-logo">
        <!-- <img src="static/img/logo4.png" alt="Paris" width="40" height="40"> -->
      <span class="header-logoText">广西移动反诈骗管控系统</span> </div>
      <Icon @click="changeStateCollapsed" :class="rotateIcon" type="md-menu" size="24"></Icon>
      <div class="layout-nav">
        <MenuItem v-bind:name="levelOneMenu.menuId" v-for="levelOneMenu in levelOneMenus" :to="levelOneMenu.url" :key="levelOneMenu.menuId">
         {{levelOneMenu.name}}
        </MenuItem>
      </div>
      <Dropdown style="margin-left: 20px;display:none" @on-click="changeMenu" >
        <Button type="primary" class="dropdown-button">
           <a href="javascript:void(0)" name="zhyw"  v-html='this.MenuText' style="color:#031c55">综合业务</a>
            <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list">
            <DropdownItem name="zhyw">综合业务</DropdownItem>
            <DropdownItem name="bdp">bdp</DropdownItem>
            <DropdownItem name="user">user</DropdownItem>
        </DropdownMenu>
    </Dropdown>
      <div class="user-out">
        <Dropdown @on-click="handleClick" placement="bottom-start">
          <a href="javascript:void(0)" style="color:white">
            <Avatar icon="ios-person" /> <span style="padding-left:10px">{{name}}</span>
          <Icon :size="18" type="md-arrow-dropdown"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="logout">退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Menu>
  </Header>
</template>
<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import sessionStore from '../../../utils/sessionStore'
export default {
  data () {
    return {
      isCollapsed: false,
      MenuText: '综合业务'
    }
  },
  created () {

  },
  mounted () {
    // this.menuList()
  },
  computed: {
    ...mapGetters([
      'name',
      'levelOneMenus',
      'currentPath'
    ]),
    rotateIcon () {
      return ['menu-icon', this.isCollapsed ? 'rotate-icon' : '']
    }
  },
  methods: {
    changeStateCollapsed () {
      this.isCollapsed = !this.isCollapsed
      this.$emit('change-side')
    },
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.axios.get('/auth/logout').then((resp) => {
            this.$store.commit('SET_TOKEN', null)
            this.$store.commit('SET_MENUS', null)
            sessionStore.setItemData('menus', null)
            Cookies.remove('Admin-Token')
            Cookies.remove('user-name')
            this.$store.commit('SET_ADD_ROUTER_MAP', [])
            location.href = this.thirdSys.logout
          })
          break
        default:
          break
      }
    },
    changeMenu (name) {
      if (name === 'bdp') {
        this.MenuText = 'bdp'
        window.location.href = this.thirdSys.bdp
      } else if (name === 'user') {
        this.MenuText = 'user'
        location.href = this.thirdSys.user
      } else {
        this.MenuText = '综合业务'
      }
    }
  }
}
</script>
<style>
.base-header .ivu-menu-dark{
  background: #031c55;
}
.base-header.ivu-layout-header {
    background: #031c55 none repeat scroll 0 0;
    height: 62px;
    line-height: 62px;
    padding: 0 20px;
}
.base-header .ivu-menu-item-active {
  background-color: #0A39AF;
}
.base-header .ivu-btn-primary {
    background-color: #FFF;
    border-color: 1px solid #dddee1;
    color: #031c55;
}
.dropdown-button {
    background-color: #FFF;
    border-color: 1px solid #dddee1;
    color: #031c55;
}
.menu-icon {
  transition: all 0.3s;
  font-size: 24px;
  margin: 0px 20px;
  color: white;
  float: left;
  position: relative;
  top: 19px;
  height: 23px;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.layout-logo {
  width: 16em;
  height: 30px;
  background:#031c55;
  border-radius: 3px;
  float: left;
  position: unset;
  top: 15px;
}
.layout-nav {
  margin: 0 auto;
  float: left;
  margin-left: 0px;
}
.user-out {
  float: right;
  color: white;
}

.header-logoText {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    position: absolute;
    z-index: 1000;
}

</style>
