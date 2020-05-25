'use strict'
const merge = require('webpack-merge')
const baseConfig = require('./baseConfig.js')

module.exports = merge(baseConfig, {
	NODE_ENV: '"pre"',
	DATA_API: '"//pre-omo.aiyouyi.cn"',
	SALE_API: '"/mkt-api"',
	UPLOAD_SERVER: '"//pre-omo.aiyouyi.cn"',
	ZX_API: '"/cms-api"',
	ZX_HELP: '"https://www.300.cn"',


	/* ...其他需要覆写baseConfig的配置 */
  
})
