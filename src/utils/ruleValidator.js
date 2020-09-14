//element-ui 表单验证rules自定义的验证规则validator

//required必填验证
export function validateRequired(rule, value, callback) {
  if (value === '') {
    return callback(new Error(rule.message));
  } else {
    callback();
  }
}

//长度验证
export function validateMax(rule, value, callback) {
  if (value.length > rule.max) {
    return callback(new Error(rule.message));
  } else {
    callback();
  }
}
