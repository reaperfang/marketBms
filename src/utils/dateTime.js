/* 日期和时间相关工具 */
import uuid from 'uuid/v4';
let timePickerId = '';

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


/* 全局时间选择器配置项逻辑 */
export function globalTimePickerOption(editable = true) {
  const _self = this;
  const prefixInteter = require('./transform').prefixInteter;

  var disableInput = function() {
    this.$children[2].disabled = true;
    this.$children[3].disabled = true;
    this.$children[5].disabled = true;
    this.$children[6].disabled = true;
  }
  return {
    onPick: function ({ maxDate, minDate}) {
      const me = this;

      // 区分修改结束时间
      if (maxDate) {
        this.maxDate = maxDate;
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if(new Date(maxDate).toDateString() != new Date().toDateString()) {
            hours = 23;
            minutes = 59;
            seconds = 59;
            date.setFullYear(maxDate.getFullYear());
            date.setMonth(maxDate.getMonth());
            date.setDate(maxDate.getDate());
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(seconds);
        }

        // 触发最大值选择器更新值
        this.handleMaxTimePick(date, true);

        // 更新日期时间选择器实例的时间区间值
        this.value = [minDate, date];

        // 结束时间下拉选择器的值更新
        this.$children[6].value = `${prefixInteter(hours)}:${prefixInteter(minutes)}:${prefixInteter(seconds)}`;

        //延时重渲染
        setTimeout(()=>{

          //重新渲染整个控件
          this.resetView();

          this.$nextTick(()=>{

            //如果不允许编辑时分秒
            if(!editable) {
              disableInput.call(me);  //设置所有的时间输入框为不可用状态
              this.$el.onclick = function(ev) {  //当面板被点击时重新设置所有的时间输入框为不可用状态
                disableInput.call(me);
              }
            }else{
              //如果允许编辑时分秒
              this.$children[6].$el.onclick = function() {  //点击结束时间输入框时重新打开下拉框的可见状态
                me.$refs.maxTimePicker.visible = true;
              }
            }

            //初始化时，将左右的下拉选择器隐藏
            this.$refs.minTimePicker.visible = false;
            this.$refs.maxTimePicker.visible = false;
          })
        },100)
      }
    },
    disabledDate: (time) => {
        return time.getTime() >= Date.now()
    }
  }
}