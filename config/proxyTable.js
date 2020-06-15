/*
 * 代理表配置文件
 */

module.exports = {
    '/data-server/**': {
      target: 'http://test-omo.aiyouyi.cn',//https://test-omo.aiyouyi.cn
	  // target: 'http://172.22.146.1:8082',//https://test-omo.aiyouyi.cn
      changeOrigin: true,
      pathRewrite: {
        '^/data-server': ''
      }
    },

    /* 营销服务 */
    '/sale_server/**': {
      target: 'https://test3-omo.aiyouyi.cn/mkt-api/',
      changeOrigin: true,
      pathRewrite: {
        '^/sale_server': ''
      }
    },
    '/upload_server/**': {
      target: 'http://test3-omo.aiyouyi.cn',//https://test-omo.aiyouyi.cn
      changeOrigin: true,
      pathRewrite: {
        '^/upload_server': ''
      }
    },
    '/zx_server/**': {
      target: 'https://test-cms-api.300.cn',
      changeOrigin: true,
      pathRewrite: {
        '^/zx_server': ''
      }
    }
  }
