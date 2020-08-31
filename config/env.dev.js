'use strict'
const proxyTable = require('./proxyTable.js')

module.exports = {
  NODE_ENV: '"dev"',
  DATA_API: '"/data-server"', // "/data-server" "http://test-omo.aiyouyi.cn"
  SALE_API: '"/sale_server"', // "/sale_server" "http://test-mkt.xinmt.com"
  UPLOAD_SERVER: '"/upload_server"', // "/upload_server"
  ZX_API: '"/zx_server"',
  ZX_HELP: '"//test-www.300.cn"',//链接

	/*NODE_ENV: '"test3"',
	DATA_API: '"//test3-omo.aiyouyi.cn"',
	SALE_API: '"//test3-omo.aiyouyi.cn/mkt-api"',
	UPLOAD_SERVER: '"//test3-omo.aiyouyi.cn"',
	ZX_API: '"//test3-omo.aiyouyi.cn/cms-api"',
	ZX_HELP: '"//test-www.300.cn"',*/


  /* ...其他配置(开发环境配置表特殊，有热更新和本地服务，走自己单独的一套) */

  // Paths
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  // host: '0.0.0.0',
  host: '127.0.0.1',
  port: 9001,
  autoOpenBrowser: false,
  errorOverlay: true,
  notifyOnErrors: false,
  poll: false,
  useEslint: false,
  showEslintErrorsInOverlay: true,
  devtool: 'cheap-module-eval-source-map',
  cssSourceMap: true,
  proxyTable: proxyTable
}
