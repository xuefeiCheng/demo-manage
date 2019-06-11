/*
  自定义长度校验规则：
    1. 中文按两个字符计算
    2. 非中文按两个字符计算
 */
function validateLength (rule, value, callback) { // 自定义校验规则：校验字符串长度(中文按两个字符计算)
  let err
  let maxLen = rule.max

  let len = 0
  for (var i = 0; i < value.length; i++) {
    len = len + ((value.charCodeAt(i) >= 0x4e00 && value.charCodeAt(i) <= 0x9fa5) ? 2 : 1)
  }
  if (len > maxLen) {
    err = '输入值不能超过' + maxLen + '个字符'
  }

  callback(err)
}
