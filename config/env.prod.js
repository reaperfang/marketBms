'use strict'
const merge = require('webpack-merge')
const baseConfig = require('./baseConfig.js')

module.exports = merge(baseConfig, {
  NODE_ENV: '"prod"',
  DATA_API: '"//omo.aiyouyi.cn"',
  SALE_API: '"/mkt-api"',
  UPLOAD_SERVER: '"//omo.aiyouyi.cn"',
  ZX_API: '"/cms-api"',
  ZX_HELP: '"//www.300.cn"',

  

  /* ...其他需要覆写baseConfig的配置 */

	productionSourceMap: true,   //是否开启sourceMap
	devtool: 'inline-cheap-module-source-map'  //sourceMap模式
})