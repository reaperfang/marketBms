'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./production.env')

module.exports = merge(prodEnv,{
	NODE_ENV: '"test3"',
  	ENV_CONFIG: '"test3"',
  	DATA_API: '"//test3-omo.aiyouyi.cn"',
	SALE_API: '"/mkt-api"',
	WEBSOCKET_server:'"ws://127.0.0.1:9000"',
	staticHost: '//test3-m-aiyouyi.yun300.cn/',
	UPLOAD_SERVER:'"//test3-omo.aiyouyi.cn"',
	APPLY: '"//test3-omo.aiyouyi.cn"'
})
