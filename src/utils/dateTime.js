/* 日期和时间相关工具 */
import uuid from 'uuid/v4';

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

// 计算日期时间差 计算毫秒
export function dateDifference(endTime){
	var endTimeYear = parseInt(endTime.split(" ")[0].split("-")[0]);
	var endTimeMonth = parseInt(endTime.split(" ")[0].split("-")[1]);
	var endTimeDay = parseInt(endTime.split(" ")[0].split("-")[2]);
	var endTimeHour = parseInt(endTime.split(" ")[1].split(":")[0]);
	var endTimeMinute = parseInt(endTime.split(" ")[1].split(":")[1]);
	var endTimeSecond = parseInt(endTime.split(" ")[1].split(":")[2]);
	var cks = Date.UTC(endTimeYear,endTimeMonth-1,endTimeDay,endTimeHour,endTimeMinute,endTimeSecond) - new Date().getTime()+new Date().getTimezoneOffset() * 60000;
	if(!(cks>0)){
		cks=0;
	}
	return cks;
}

/* 添加0 */
export function addZero(num) {
  if(!num) {
    return '00'
  }
  if(Number(num) >= 10) {
    return num;
  }else {
    if(Number(num) > 0) {
      return '0' + Number(num);
    }else{
      return '00'
    }
  }
}

/* 
*时间选择器结束时间处理 
* endTime  结束时间对象
* canSelectFuture  是否可选择未来
*/
export function endTimeHandle(endTime, canSelectFuture = true) {
  if(endTime) {
    if(endTime.getTime() >= new Date().getTime()) {  //如果结束时间大于或等于当前时间
      if(!canSelectFuture) {  //如果不允许选择未来
        return new Date();  //返回当前时间
      }else {
        return endTime;
      }
    }else { //如果结束时间小于当前时间
      if(endTime.getFullYear() === new Date().getFullYear() && endTime.getMonth() === new Date().getMonth() && endTime.getDate() === new Date().getDate()) {  //如果是当天
        return new Date();  //返回当前时间
      }else {  //如果是今天以前，则返回那一天的23:59:59
        return endTime.getTime() + 24 * 60 * 60 * 1000 - 1;
      }
    }
  }else {
    return new Date();
  }
}

/* 
*日期选择器配置项 
* canSelectFuture  是否可选择未来
*/
export function pickerOptions(params) {
    if(params.canSelectFuture == undefined || params.canSelectFuture == null) {
      params.canSelectFuture = true;
    }
    return {
      disabledDate(time) {
        if(!params.canSelectFuture) { 
          return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的 
        }else {
          return false;
        }
      }
    }
}

/* 
*获取某一天的00:00:00时间对象
*/
export function dayStart(startTime) {
  let time = new Date(startTime);
  let firstDay = new Date(startTime);
  time.setFullYear(firstDay.getFullYear());
  time.setMonth(firstDay.getMonth());
  time.setDate(firstDay.getDate());
  time.setHours(0);
  time.setMinutes(0);
  time.setSeconds(0);
  return time;
}

/* 
*获取某一天的23:59:59时间对象
*/
export function dayEnd(endTime) {
  let time = new Date(endTime);
  let lastDay = new Date(endTime);
  time.setFullYear(lastDay.getFullYear());
  time.setMonth(lastDay.getMonth());
  time.setDate(lastDay.getDate());
  time.setHours(23);
  time.setMinutes(59);
  time.setSeconds(59);
  return time;
}

export function globalTimePickerOption() {
  const id = uuid();
  return {
    onPick: ({ maxDate, minDate }) => {
      if (maxDate) {
        document.getElementsByClassName('el-date-range-picker__time-picker-wrap')[3].getElementsByClassName("el-input__inner")[0].setAttribute('id', id);
        if(new Date(maxDate).toDateString() == new Date().toDateString()) {
            let hours = this.prefixInteter(new Date().getHours());
            let minute = this.prefixInteter(new Date().getMinutes());
            let seconds = this.prefixInteter(new Date().getSeconds());
            document.getElementById(id).value=`${hours}:${minute}:${seconds}`
        }else{
            document.getElementById(id).value = "23:59:59";
        }
      }
    },
    disabledDate: (time) => {
        return time.getTime() >= Date.now()
    },
    id: id
  }
}

export function timeChange(value) {
  const id = this;
  document.getElementsByClassName('el-date-range-picker__time-picker-wrap')[3].getElementsByClassName("el-input__inner")[0].setAttribute('id', 'date1');
  let date = document.getElementsByClassName('el-date-range-picker__time-picker-wrap')[2].getElementsByClassName("el-input__inner")[0].value;
  let time = document.getElementById('date1').value;
  value[1] = `${date} ${time}`;
}