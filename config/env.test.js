'use strict'
const merge = require('webpack-merge')
const baseConfig = require('./baseConfig.js')

module.exports = merge(baseConfig, {
	NODE_ENV: '"test"',
	DATA_API: '"//test-omo.aiyouyi.cn"',
	SALE_API: '"//test-omo.aiyouyi.cn/mkt-api/"',
	ZX_API: '"//test-omo.aiyouyi.cn/cms-api"',
	ZX_HELP: '"//test-www.300.cn"',
	BASE_DOMAIN: '"aiyouyi.cn"'



	/* ...其他需要覆写baseConfig的配置 */
})
