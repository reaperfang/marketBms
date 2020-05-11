'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./production.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"test2"',
  	ENV_CONFIG: '"test2"',
  	DATA_API: '"http://test2-omo.aiyouyi.cn"',
	SALE_API: '"/mkt-api"',
	WEBSOCKET_server:'"ws://127.0.0.1:9000"',
	staticHost: 'https://test2-m-aiyouyi.yun300.cn/',
	UPLOAD_SERVER:'"http://test2-omo.aiyouyi.cn"',
	APPLY: '"//test2-omo.aiyouyi.cn"'
})
