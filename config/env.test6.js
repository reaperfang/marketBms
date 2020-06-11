const merge = require('webpack-merge')
const baseConfig = require('./baseConfig.js')

module.exports = merge(baseConfig, {
	NODE_ENV: '"test6"',
	DATA_API: '"//test6-omo.aiyouyi.cn"',
	SALE_API: '"//test6-mkt.aiyouyi.cn"',
	UPLOAD_SERVER: '"//test6-omo.aiyouyi.cn"',
	ZX_API: '"//test6-omo.aiyouyi.cn/cms-api"',
	ZX_HELP: '"//test-www.300.cn"',



	/* ...其他需要覆写baseConfig的配置 */
  
})
