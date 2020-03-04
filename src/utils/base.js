import CryptoJS from 'crypto-js';

/**
 * 合并对象
 * 
 */
export function objectMerge(target, source) {

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}


/**
 * 深克隆
 * 
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}



/**
 * rgb转16进制
 *
 * @export
 * @param {*} color
 * @returns
 */
export function colorRGB2Hex(color) {
  if (!color) {
    return ''
  };
  var rgb = color.split(',');
  var r = parseInt(rgb[0].split('(')[1]);
  var g = parseInt(rgb[1]);
  var b = parseInt(rgb[2].split(')')[0]);

  var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}


/* 格式化数字*/
export function formatNumber(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}


/**
 *格式化日期和时间
 *
 * @export
 * @param {*} value
 * @param {*} fmt
 * @returns
 */
export function formatDate(value, fmt) {
  if (!(value instanceof Date)) {
    value = new Date(value);
  }
  var o = {
    "M+": value.getMonth() + 1,                 //月份   
    "d+": value.getDate(),                    //日   
    "h+": value.getHours(),                   //小时   
    "m+": value.getMinutes(),                 //分   
    "s+": value.getSeconds(),                 //秒   
    "q+": Math.floor((value.getMonth() + 3) / 3), //季度   
    "S": value.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (value.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

/**
 *计算日期
 *
 * @export
 * @param {*} value
 * @param {*} fmt
 * @returns
 */
export function countDate(num) {
  let date1 = new Date();
  let date2 = new Date(date1);
  date2.setDate(date1.getDate() + num);
  // let time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
  let time2 = this.formatDate(date2, "yyyy-MM-dd")
  return time2;
}

/**
*系统内部跳转
*
* @export
* @param {*} pathName
*/
export function routeTo(pathName, query = {}) {
  this.$router.push({
    name: pathName,
    query
  })
}

/**
 * 数值百分比转换
 * @param value 
 * @param fmt string , 转换格式
 * demo ->  {{data | percent(2)}}
 */
export function percent(value, fmt) {
  return `${((value || 0) * 100).toFixed(fmt || 2)}%`;
}

/**
 * 推算日期
 *
 * @export
 * @param {*} dateObj      日期对象 
 * @param {*} range        推算范围  默认7天
 * @param {*} calcType     推算类型  +或者-
 * @returns
 */
export function calcDate(dateObj, calcType, range) {
  range = range === 1 ? 2 : range;
  let tempDateObj = new Date();
  if (calcType === '+') {
    tempDateObj.setTime(dateObj.getTime() + 3600 * 1000 * 24 * (range - 1));
  } else if (calcType === '-') {
    tempDateObj.setTime(dateObj.getTime() - 3600 * 1000 * 24 * (range - 1));
  }
  return tempDateObj
}


/**
 * 动态加载css文件
 *
 * @export
 * @param {*} doc
 * @param {*} path
 */
export function asyncLoadCss(doc, path) {
  return new Promise((resolve, reject) => {
    let node = doc.createElement('link');
    node.rel = 'stylesheet';
    node.href = path;
    doc.getElementsByTagName('head')[0].appendChild(node);
    node.onload = function () {
      resolve();
    };
    node.onerror = function () {
      reject();
    };
  })
}

/**
 * 动态加载js文件
 *
 * @export
 * @param {*} doc
 * @param {*} path
 */
export function asyncLoadJs(doc, path) {
  return new Promise((resolve, reject) => {
    let script = doc.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.src = path;
    doc.body.appendChild(script);
    script.onload = function () {
      resolve();
    };
    script.onerror = function () {
      reject();
    };
  })
}

/**
 * 首字母大写
 *
 * @export
 * @param {*} name
 */
export function titleCase(name) {
  let str = name.replace(/\b\w+\b/g, function (word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
  });
  return str;
}

/**
 * 根据value值获取label
 *
 * @export
 * @param {*} obj 
 * @param {*} group
 * @param {*} value
 */
export function getDictLabel(obj, group, value) {
  const dictList = obj
  const dict = dictList[group]
  let rst = ''
  if (dict && Array.isArray(dict)) {
    for (let i = 0; i < dict.length; i++) {
      if (dict[i].value === value) {
        rst = dict[i].label
        break
      }
    }
  }
  return rst
}

//对字符串进行加密(偏移加密)     
export function compileStr1(code) {
  var c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  }
  return escape(c);
}

//对字符串进行解密(偏移解密)     
export function uncompileStr1(code) {
  code = unescape(code);
  var c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
}
//对字符串进行加密(无偏移)     
export function compileStr(code) {
  return escape(code);
}

//对字符串进行解密(无偏移)     
export function uncompileStr(code) {
  return unescape(code);
}

//订单状态过滤器   
export function orderStatusFilter(status) {
  switch (status) {
    case 0:
      return '待付款'
    case 1:
      return '待成团'
    case 2:
      return '关闭'
    case 3:
      return '待发货'
    case 4:
      return '部分发货'
    case 5:
      return '待收货'
    case 6:
      return '完成'
  }
}

export function goodsSpecsFilter(value) {
  let _value
  if(!value) return ''
  if(typeof value == 'string') {
      _value = JSON.parse(value)
  }
  let str = ''
  for(let i in _value) {
      if(_value.hasOwnProperty(i)) {
          str += i + ':'
          str += _value[i] + ','
      }
  }

  return str
}

//扁平数据解析成为树形结构
export function buildTree(data) {
  let parents = data.filter(value => value.navType == 0)
  let children = data.filter(value => value.navType !== 0)
  let translator = (parents, children) => {
      parents.forEach((parent) => {
          children.forEach((current, index) => {
              if (current.parentId*1 === parent.id) {
                  let temp = JSON.parse(JSON.stringify(children))
                  temp.splice(index, 1)
                  translator([current], temp)
                  typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
              }
          })
      })
  }
  translator(parents, children)
  return parents
}

/**
 * AES加密
 *
 * @export
 * @param {*} string
 * @returns
 */
export function aesEncryption(key= '', string=''){
      var key = CryptoJS.enc.Utf8.parse(key);
      // ECB加密
      var options={
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
      }
      var encryptedData = CryptoJS.AES.encrypt(string, key, options);
      var encryptedBase64Str = encryptedData.toString();
      return encryptedBase64Str;
}

/**
 * AES解密
 *
 * @export
 * @param {*} string
 * @returns
 */
export function aesDecryption(key= '', string=''){
    var encryptedBase64Str = string;
    var options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    };
    var key = CryptoJS.enc.Utf8.parse(key);
    // 解密
    var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, options);
    // 解密后，需要按照Utf8的方式将明文转位字符串
    var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
    return decryptedStr;
}

// 获取url中的参数
export function GetQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}