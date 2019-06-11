
const userSuccessData = {
  code: 200,
  msg: 'Ok',
  data: {
    menu: [
      {menuId: 'systemManager', menuName: '系统管理', url: '#'},
      {menuId: 'roleManager', menuName: '角色管理', url: '/role', parentMenu: 'systemManager'},
      {menuId: 'permissionManager', menuName: '权限管理', url: '/permission', parentMenu: 'systemManager'},
      {menuId: 'logManager', menuName: '日志管理', url: '/log', parentMenu: 'systemManager'},
      {menuId: 'listManager', menuName: '名单管理', url: '#'},
      {menuId: 'blackManager', menuName: '黑名单管理', url: '/black', parentMenu: 'listManager'},
      {menuId: 'whiteManager', menuName: '白名单管理', url: '/white', parentMenu: 'listManager'},
      {menuId: 'councilManager', menuName: '局方管理', url: '/council', parentMenu: 'listManager'},
      {menuId: 'documentManager', menuName: '业务文档管理', url: '/document', parentMenu: 'listManager'},
      {menuId: 'warningManager', menuName: '异常告警管理', url: '/warning', parentMenu: 'listManager'},
      {menuId: 'voiceManager', menuName: '语音模板管理', url: '/voice', parentMenu: 'listManager'},
      {menuId: 'dbtConfireManager', menuName: '疑似号码取证管理', url: '/dbtConfire', parentMenu: 'listManager'},
      {menuId: 'spamsms', menuName: '垃圾短信管理', url: '#'},
      {menuId: 'spamsms_keywords', menuName: '关键词管理', url: '/keywords', parentMenu: 'spamsms'},
      {menuId: 'spamsms_classify', menuName: '短信分类管理', url: '/classify', parentMenu: 'spamsms'}
    ],
    token: '71afcddc-b480-433e-aaf2-4e6ba0fa3834'
  }
}
const zycSuccessData = {
  code: 200,
  msg: 'Ok',
  data: {
    menu: [
      {menuId: 'listManager', menuName: '名单管理', url: '#'},
      {menuId: 'blackManager', menuName: '黑名单管理', url: '/black', parentMenu: 'listManager'}],
    token: 'zyc'
  }
}
const userErrorData = {
  code: 403,
  msg: '登录失败'
}

export default {
  loginByEmail: config => {
    // console.log('使用mock，前台传递的参数', config)
    const { email, password } = JSON.parse(config.body)
    if (email.split('@')[0] === 'admin' && password === '123456') {
      return userSuccessData
    } else if (email.split('@')[0] === 'zyc' && password === '123456') {
      return zycSuccessData
    } else {
      return userErrorData
    }
  },
  loginOut: () => {
    return 'success'
  }
}
