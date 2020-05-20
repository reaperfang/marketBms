'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./production.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"test"',
	DATA_API: '"//test-omo.aiyouyi.cn"',
	SALE_API: '"//test-omo.aiyouyi.cn/mkt-api/"',
	WEBSOCKET_server: '"ws://127.0.0.1:9000"',
	staticHost: '"//test-m-aiyouyi.yun300.cn/"',
	UPLOAD_SERVER: '"//test-omo.aiyouyi.cn"',
	APPLY: '"//test-omo.aiyouyi.cn"',
	ZX_API: '"//test-cms-api.300.cn/"',
  	ZX_HELP: '"https://test-m.300.cn"'

})
