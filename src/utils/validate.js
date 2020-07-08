

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* mp4*/
export function validateMP4(str) {
  const reg = /^.*\.(mp|MP)4$/
  const regUrl = /(http|https):\/\/([\w.]+\/?)\S*/
  return reg.test(str) && regUrl.test(str)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
//获取时间格式  addDayCount 等于-1表示获取昨天
	
export  function GetDateStr(AddDayCount) { 
   var dd = new Date();
   dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
   var y = dd.getFullYear(); 
   var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
   var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
   return y+"-"+m+"-"+d; 
}

/* 合法手机号*/
export function validatePhone(str) {
  const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[0|6|7|8]|18[0-9]|19[8|9])\d{8}$/ 
  return reg.test(str)
}

//验证URL
export  function isURL (url) { 
  var strRegex = '^((https|http|ftp|rtsp|mms)?://)' 
      + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
      + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
      + '|' // 允许IP和DOMAIN（域名） 
      + '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
      + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
      + '[a-z]{2,6})' // first level domain- .com or .museum 
      + '(:[0-9]{1,4})?' // 端口- :80 
      + '((/?)|' // a slash isn't required if there is no file name 
      + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'; 
  var re=new RegExp(strRegex); 
  //re.test() 
  if (re.test(url)) { 
      return true; 
  } else { 
      return false; 
  } 
}

export function isPic(url) {
  return /\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(url)
}