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

//商品规格过滤器
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





// 获取url中的参数
export function GetQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}





