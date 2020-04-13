'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./production.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"testing2"',
	DATA_API: '"//test2-omo.aiyouyi.cn"',
	SALE_API: '"//test2-omo.aiyouyi.cn/mkt-api/"',
	WEBSOCKET_server: '"ws://127.0.0.1:9000"',
	staticHost: '//test-m-aiyouyi.yun300.cn/',
	UPLOAD_SERVER: '"//test2-omo.aiyouyi.cn"',
	APPLY: '"//test2-omo.aiyouyi.cn"'
})
