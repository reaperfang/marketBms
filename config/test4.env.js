'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./production.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"test4"',
  	ENV_CONFIG: '"test4"',
  	DATA_API: '"//test4-omo.aiyouyi.cn"',
	SALE_API: '"/mkt-api"',
	WEBSOCKET_server:'"ws://127.0.0.1:9000"',
	staticHost: '//test4-m-aiyouyi.yun300.cn/',
	UPLOAD_SERVER:'"//test4-omo.aiyouyi.cn"',
	APPLY: '"//test4-omo.aiyouyi.cn"'
})
