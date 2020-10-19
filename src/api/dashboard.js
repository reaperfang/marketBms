import request from "@/system/request";

//  渠道会员转化指标接口
export function member(data) {
	return request({
		target: "BDSC-CHANNEL-CONVERSION-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}
//  接口名称: 商品交易来源top3
export function top3(data) {
	return request({
		target: "BDSC-GOOD-TS-SOURCE-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}

//  用户渠道分布指标接口
export function userdistributed(data) {
	return request({
		target: "BDSC-USER-CHANNEL-DISTRIBUTION-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}

// 总交易金额分布
export function totalamount(data) {
	return request({
		target: "BDSC-TS-AMOUNT-DISTRIBUTION-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}

// 性别年龄分布
export function sexage(data) {
	return request({
		target: "BDSC-GENDER-AGE-DISTRIBUTION-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}

//  商品访客(最近7天
export function vistor(data) {
	return request({
		target: "BDSC-MAIL-VISITORS-LAST7D-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}
//  商城浏览(最近7天)
export function mail(data) {
	return request({
		target: "BDSC-MAIL-PV-LAST7D-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}

//  下单转化漏斗(最近7天)
export function order(data) {
	return request({
		target: "BDSC-SUBMITORDER-CS-FUNNEL-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}

// 支付金额(最近7天)
export function payamount(data) {
	return request({
		target: "BDSC-PAYMENT-LAST7D-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}

// 客单价（最近7天
export function price(data) {
	return request({
		target: "BDSC-PRICE-PERCUSTOMER-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}

//  实时交易金额指标接口
export function realtimedealamount(data) {
	return request({
		target: "BDSC-RT-TS-AMOUNT-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}
//  实时交易用户
export function realdealuser(data) {
	return request({
		target: "BDSC-RT-TS-USER-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}

//  统计分析指标接口（ 统计指标，用户交易偏好，手机 号）
export function statistics(data) {
	return request({
		target: "BDSC-STATISTICS-MORE-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}

//  用户交易分布
export function realTimeUser(data) {
	return request({
		target: "RTOV-TRANSACTION-DISTRIBUTION-PROCESSOR",
		method: "post",
		apiType: "data",
		data
	});
}

