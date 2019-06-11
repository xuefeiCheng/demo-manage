import {gettime, GetDateStr} from '../../src/utils/timeFormat.js'
export const pslistManager = [
  {
    cellid: "14103",
    city: "yl",
    createtime: "20181221101010",
    domain: null,
    drowsta: null,
    lacid: "30279",
    lat: "22.51618028",
    lng: "109.93614393",
    pas_ci: null,
    pas_lac: null,
    psoname: "广西自治区玉林市兴业县大平山镇324国道",
    staid: 1,
    streamnumber: 1281
  },
  {
    cellid: "13203",
    city: "yl",
    createtime: "20181221101010",
    domain: null,
    drowsta: null,
    lacid: "30579",
    lat: "22.51618028",
    lng: "109.93614393",
    pas_ci: null,
    pas_lac: null,
    psoname: "广西自治区玉林市福绵区新桥镇216省道",
    staid: 2,
    streamnumber: 1281
  },
  {
    cellid: "10393",
    city: "yl",
    createtime: "20181221101010",
    domain: null,
    drowsta: null,
    lacid: "12579",
    lat: "22.51618028",
    lng: "109.93614393",
    pas_ci: null,
    pas_lac: null,
    psoname: "广西自治区玉林市福绵区新桥镇372县道",
    staid: 3,
    streamnumber: 1281
  },
  {
    cellid: "13103",
    city: "yl",
    createtime: "20181221101010",
    domain: null,
    drowsta: null,
    lacid: "21579",
    lat: "22.51618028",
    lng: "109.93614393",
    pas_ci: null,
    pas_lac: null,
    psoname: "广西自治区玉林市兴业县大平山镇057乡道",
    staid: 4,
    streamnumber: 1281
  },
  {
    cellid: "11243",
    city: "yl",
    createtime: "20181221101010",
    domain: null,
    drowsta: null,
    lacid: "21579",
    lat: "22.51618028",
    lng: "109.93614393",
    pas_ci: null,
    pas_lac: null,
    psoname: "广西自治区玉林市福绵区成均镇青菜塘",
    staid: 5,
    streamnumber: 1281
  },
  {
    cellid: "12403",
    city: "yl",
    createtime: "20181221101010",
    domain: null,
    drowsta: null,
    lacid: "33279",
    lat: "22.51618028",
    lng: "109.93614393",
    pas_ci: null,
    pas_lac: null,
    psoname: "广西自治区玉林市福绵区成均镇219乡道",
    staid: 6,
    streamnumber: 1281
  }
]
export const LACManagerTab1 = {
  code: 200,
  data: {
    count: 6,
    list: [
      {timeString: GetDateStr(0)},
      {timeString: GetDateStr(-1)},
      {timeString: GetDateStr(-2)},
      {timeString: GetDateStr(-3)},
      {timeString: GetDateStr(-4)},
      {timeString: GetDateStr(-5)}
    ]
  },
  msg: 'OK'
}
export const LACManagerTab2 = {
  code: 200,
  data: {
    count: 4,
    list: [
      {
        bureauId: 0,
        createTime: gettime()
      },
      {
        bureauId: 1,
        createTime: gettime()
      },
      {
        bureauId: 2,
        createTime: gettime()
      },
      {
        bureauId: 3,
        createTime: gettime()
      }
    ]
  },
  msg: 'OK'
}

export const menu = {
  code: 200,
  data: [
  {
    createTime: "20190328124701",
    menuId: "userManage_updateState",
    menuName: "菜单管理",
    menuType: "2",
    parentMenu: "系统管理",
    url: "POST:user/updateState"
  },
  {
    createTime: "20190328124701",
    menuId: "userManage_add",
    menuName: "日志管理",
    menuType: "2",
    parentMenu: "系统管理",
    url: "POST:user/add"
  },
  {
    createTime: "20190328124701",
    menuId: "userManage_allRoles",
    menuName: "用户管理",
    menuType: "2",
    parentMenu: "系统管理",
    url: "GET:role"
  },
  {
    createTime: "20190328124701",
    menuId: "userManage_roles",
    menuName: "角色管理",
    menuType: "2",
    parentMenu: "系统管理",
    url: "GET:user/role/*"
  }
  ],
  count: 4,
  msg: "OK"
}

export const role = {
  code: 200,
  count: 3,
  list: [
    {
      createTime: "20190328110656",
      roleId: "admin",
      roleName: "系统管理员"
    },
    {
      rceateTime: "20190328110656",
      roleId: "base",
      roleName: "基础操作员"},
    {
      createTime: "20190328110942",
      roleId: "eee",
      roleName: "新角色"
    }
  ],
  msg: "OK"
}
export const log = {
  code: 200,
  count: 747,
  list: [
    {
      createTime: "20190328110725",
      description: "用户root尝试登录本系统",
      error: "验证码错误，请重新输入",
      execTime: 5,
      ip: "0:0:0:0:0:0:0:1",
      method: "POST",
      operator: null,
      result: "2",
      url: "/auth/login"
    },
    {
      createTime: "20190328110725",
      description: "用户root尝试登录本系统",
      error: "验证码错误，请重新输入",
      execTime: 5,
      ip: "0:0:0:0:0:0:0:1",
      method: "POST",
      operator: null,
      result: "2",
      url: "/auth/login"
    },
    {
      createTime: "20190328110735",
      description: "用户root尝试登录本系统",
      error: "",
      execTime: 86,
      ip: "0:0:0:0:0:0:0:1",
      method: "POST",
      operator: "root",
      result: "1",
      url: "/auth/login"
    },
  ],
  msg: "OK"
}

export const zuzhi = {
  code: 200,
  data: [
  {
    createTime: "20190328124701",
    menuId: "userManage_updateState",
    menuName: "技术部",
    menuType: "2",
    parentMenu: "事业中心",
    url: "POST:user/updateState"
  }
  ],
  count: 1,
  msg: "OK"
}
export const jiankong = {
  code: 200,
  data: [
  {createTime: "20190328124701"},
  {createTime: "20190328124701"},
  {createTime: "20190328124701"},
  {createTime: "20190328124701"},
  {createTime: "20190328124701"},
  {createTime: "20190328124701"},
  {createTime: "20190328124701"}
  ],
  count: 7,
  msg: "OK"
}