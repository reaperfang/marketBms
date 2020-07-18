import { getToken } from '@/system/auth'
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

/* 添加新营销活动 */
export function addNewApply(path, access) {
  let token = getToken('authToken')
  let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
  let userName = JSON.parse(localStorage.getItem('userInfo')) && encodeURI(JSON.parse(localStorage.getItem('userInfo')).userName)
  let tenantId = JSON.parse(localStorage.getItem('userInfo')) && encodeURI(JSON.parse(localStorage.getItem('userInfo')).tenantInfoId)
  let cid = shopInfo && shopInfo.id || ''
  let newUrl = `${process.env.NODE_ENV === 'dev' ? '//127.0.0.1:8080' : process.env.DATA_API}/vue/marketing${path}?access=${access}&token=${token}&businessId=1&loginUserId=1&tenantId=${tenantId}&cid=${cid}&userName=${userName}`
  let newWindow = window.open("about:blank");
  newWindow.location.href = newUrl;
}


export function equalsObj(oldData,newData){
  function  isObject(obj){
      return Object.prototype.toString.call(obj)==='[object Object]';
  };
  /**
   * 判断此类型是否是Array类型
   * @param {Array} arr 
   */
  function isArray(arr){
      return Object.prototype.toString.call(arr)==='[object Array]';
  };
  // 类型为基本类型时,如果相同,则返回true
  if(oldData === newData) return true;
  if(isObject(oldData)&&isObject(newData)&&Object.keys(oldData).length === Object.keys(newData).length){
      // 类型为对象并且元素个数相同

      // 遍历所有对象中所有属性,判断元素是否相同
      for (const key in oldData) {
          if (oldData.hasOwnProperty(key)) {
              if(!equalsObj(oldData[key],newData[key]))
                  // 对象中具有不相同属性 返回false
                  return false;
          }
      }
  }else if(isArray(oldData)&&isArray(oldData)&&oldData.length===newData.length){
      // 类型为数组并且数组长度相同

      for (let i = 0,length=oldData.length; i <length; i++) {
          if(!equalsObj(oldData[i],newData[i]))
          // 如果数组元素中具有不相同元素,返回false
          return false;
      }
  }else{
      // 其它类型,均返回false
      return false;
  }
  
  // 走到这里,说明数组或者对象中所有元素都相同,返回true
  return true;
};

export function isIE() {
    if(!!window.ActiveXObject || "ActiveXObject" in window){
      return true;
    }else{
      return false;
　　 }
}

/* 数组项对比是否相同 */
export function isIdsUpdate(newValue, oldValue) {
    if(!newValue || !oldValue){
      return newValue === oldValue;
    }
    if(Array.isArray(newValue)) {
      return newValue.length==oldValue.length && newValue.every(function(v,i) { return JSON.stringify(v) === JSON.stringify(oldValue[i])});
    }
    return JSON.stringify(newValue) === JSON.stringify(oldValue)
}


// 函数防抖
export function debounce(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
        func.apply(context, args)
    }, wait);
  }
}


// is safari
export function isSafariBrowser() {
  const ua = navigator.userAgent;
  const isSafariBrowser = /Safari\/([\d.]+)/.test(ua) && !/Chrome\/([\d.]+)/.test(ua);
  return isSafariBrowser
}