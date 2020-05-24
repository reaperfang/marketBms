const merge = require('webpack-merge')
const baseConfig = require('./baseConfig.js')

module.exports = merge(baseConfig, {
	NODE_ENV: '"test5"',
	DATA_API: '"//test5-omo.aiyouyi.cn"',
	SALE_API: '"//test5-omo.aiyouyi.cn/mkt-api"',
	UPLOAD_SERVER: '"//test5-omo.aiyouyi.cn"',
	ZX_API: '"//test5-omo.aiyouyi.cn/cms-api"',
	ZX_HELP: '"//test-www.300.cn"',



	/* ...其他需要覆写baseConfig的配置 */
  
})
