'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./production.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"pre"',
	DATA_API: '"//pre-omo.aiyouyi.cn"',
	SALE_API: '"/mkt-api"',
	WEBSOCKET_server: '"ws://127.0.0.1:9000"',
	staticHost: '"//test-m-aiyouyi.yun300.cn/"',
	UPLOAD_SERVER: '"//pre-omo.aiyouyi.cn"',
	APPLY: '"//pre-omo.aiyouyi.cn"',
	ZX_API: '"/cms-api"',
  	ZX_HELP: '"https://www.300.cn"'
})
