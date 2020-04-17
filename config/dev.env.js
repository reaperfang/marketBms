'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./production.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DATA_API: '"/data-server"', // "/data-server" "http://test-omo.aiyouyi.cn"
  SALE_API: '"/sale_server"', // "/sale_server" "http://test-mkt.xinmt.com"
  WEBSOCKET_server: '"ws://127.0.0.1:9000"',
  staticHost: 'https://test-m-aiyouyi.yun300.cn/',
  UPLOAD_SERVER: '"/upload_server"', // "/upload_server"
  APPLY: '"/data-server"'
})
