'use strict'
const merge = require('webpack-merge')
const baseConfig = require('./baseConfig.js')

module.exports = merge(baseConfig, {
	NODE_ENV: '"pre"',
	DATA_API: '"//pre-omo.aiyouyi.cn"',
	SALE_API: '"/mkt-api"',
	ZX_API: '"/cms-api"',
	ZX_HELP: '"//pre-www.300.cn"',
	BASE_DOMAIN: '"aiyouyi.cn"'


	/* ...其他需要覆写baseConfig的配置 */
  
})
