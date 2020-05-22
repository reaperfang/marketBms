'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./production.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"test5"',
  	ENV_CONFIG: '"test5"',
  	DATA_API: '"//test5-omo.aiyouyi.cn"',
	SALE_API: '"/mkt-api"',
	WEBSOCKET_server:'"ws://127.0.0.1:9000"',
	staticHost: '//test5-m-aiyouyi.yun300.cn/',
	UPLOAD_SERVER:'"//test5-omo.aiyouyi.cn"',
	APPLY: '"//test5-omo.aiyouyi.cn"'
})
