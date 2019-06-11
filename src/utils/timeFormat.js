export function dateToString (date) {
  let Y = date.getFullYear()
  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + '' + M + '' + D + '' + h + '' + m + '' + s
}

export function formatDate (stringdate) {
  let y = stringdate.substr(0, 4)
  let m = stringdate.substr(4, 2)
  let d = stringdate.substr(6, 2)
  return y + '.' + m + '.' + d
}

// 获取时间（时钟）
export function gettime () {
  var today = new Date()
  var hh = today.getHours()
  if (hh < 10) hh = '0' + hh
  var mm = today.getMinutes()
  if (mm < 10) mm = '0' + mm
  var ss = today.getSeconds()
  if (ss < 10) ss = '0' + ss
  let timeString = showLocale(today) + hh + ':' + mm + ':' + ss
  return timeString
}
function showLocale (objD) {
  var str
  var yy = objD.getYear()
  if (yy < 1900) yy = yy + 1900
  var MM = objD.getMonth() + 1
  if (MM < 10) MM = '0' + MM
  var dd = objD.getDate()
  if (dd < 10) dd = '0' + dd
  // var ww = objD.getDay()
  // if (ww === 0) ww = '星期日'
  // if (ww === 1) ww = '星期一'
  // if (ww === 2) ww = '星期二'
  // if (ww === 3) ww = '星期三'
  // if (ww === 4) ww = '星期四'
  // if (ww === 5) ww = '星期五'
  // if (ww === 6) ww = '星期六'
  str = yy + '/' + MM + '/' + dd + ' '
  return (str)
}

// 获取今天0 明天1 昨天-1 ····
// 调用方式 GetDateStr(0) - 今天；GetDateStr(-1) - 昨天
// 输出格式为 20190404
export function GetDateStr (AddDayCount) {
  var dd = new Date()
  dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
  var y = dd.getFullYear()
  if (y < 1900) y = y + 1900
  var m = dd.getMonth() + 1 // 获取当前月份的日期
  if (m < 10) m = '0' + m
  var d = dd.getDate()
  if (d < 10) d = '0' + d
  return y + '/' + m + '/' + d
}

export function GetDateStrAll (AddDayCount) {
  var dd = new Date()
  dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
  var y = dd.getFullYear()
  if (y < 1900) y = y + 1900
  var m = dd.getMonth() + 1 // 获取当前月份的日期
  if (m < 10) m = '0' + m
  var d = dd.getDate()
  if (d < 10) d = '0' + d
  var hh = parseInt(Math.random() * (24 - 10 + 1) + 10, 10)
  var mm = parseInt(Math.random() * (60 - 10 + 1) + 10, 10)
  var ss, ss1
  ss = ss1 = parseInt(Math.random() * (50 - 10 + 1) + 10, 10)
  ss1 = ss1 + 10
  return [y + '/' + m + '/' + d + ' ' + hh + ':' + mm + ':' + ss, y + '/' + m + '/' + d + ' ' + hh + ':' + mm + ':' + ss1]
}
