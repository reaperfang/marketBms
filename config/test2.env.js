'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./production.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"test2"',
  	ENV_CONFIG: '"test2"',
  	DATA_API: '"//test2-omo.aiyouyi.cn"',
	SALE_API: '"/mkt-api"',
	WEBSOCKET_server:'"ws://127.0.0.1:9000"',
	staticHost: '"//test2-m-aiyouyi.yun300.cn/"',
	UPLOAD_SERVER:'"//test2-omo.aiyouyi.cn"',
	APPLY: '"//test2-omo.aiyouyi.cn"',
	ZX_API: '"/zx_server"',
  	ZX_HELP:'"//test-www.300.cn/"'//链接	
})
