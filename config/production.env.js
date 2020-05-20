'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./production.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  DATA_API: '"//omo.aiyouyi.cn"',
  SALE_API: '"/mkt-api"',
  WEBSOCKET_server: '"ws://127.0.0.1:9000"',
  staticHost: '"//test-m-aiyouyi.yun300.cn/"',
  UPLOAD_SERVER: '"//omo.aiyouyi.cn"',
  APPLY: '"//omo.aiyouyi.cn"',
  ZX_API: '"/zx_server"',
  ZX_HELP:'"//test-www.300.cn/"'//链接
})
