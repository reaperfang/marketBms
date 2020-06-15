// 模板支付
import request from '@/system/request'


// 获取商品类目列表
export function getOrcode(data) {
	return request({
		apiType: 'goodsOperate',
		method: 'post',
		target: 'PUBLIC-GET-QRCODE-PROCESSOR',
		data
	})
}
