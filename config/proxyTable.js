/*
 * 代理表配置文件
 */

module.exports = {
    '/data-server/**': {
      target: 'https://test-omo.aiyouyi.cn',//https://test-omo.aiyouyi.cn http://172.22.146.129:8082
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
