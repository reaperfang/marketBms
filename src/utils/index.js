import * as utils from "./base"; //基础工具方法
import * as eventHub from "./eventHub"; //全局事件中心
import * as validate from "./validate"; //验证工具箱
import * as listManager from "./listManager"; //列表管理器
import * as confirm from "./confirm"; //重新封装确认弹窗
import * as dateTime from "./dateTime"; //日期时间相关
import * as security from "./security"; //安全加解密转码相关
import * as transform from "./transform"; //数据转换相关

export default Object.assign(utils, dateTime, security, transform, {
	eventHub,
	validate,
	listManager,
	confirm
});
