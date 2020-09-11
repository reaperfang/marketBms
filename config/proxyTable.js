/* 
 * 代理表配置文件
 */

module.exports = {
    '/data-server/**': {
      target: 'http://test-omo.aiyouyi.cn',//https://test-omo.aiyouyi.cn
      // target: 'http://172.22.146.1:8082',// 梅志文
      // target: 'http://172.22.146.129:8082',// 李文飞
      changeOrigin: true,
      pathRewrite: {
        '^/data-server': ''
      }
    },

    /* 营销服务 */
    '/sale_server/**': {
      target: 'https://pre-omo.aiyouyi.cn/mkt-api/',
      changeOrigin: true,
      pathRewrite: {
        '^/sale_server': ''
      }
    },
    '/upload_server/**': {
      target: 'http://pre-omo.aiyouyi.cn',//https://test-omo.aiyouyi.cn
      changeOrigin: true,
      pathRewrite: {
        '^/upload_server': ''
      }
    },
    '/zx_server/**': {
      target: 'https://pre-cms-api.300.cn',
      changeOrigin: true,
      pathRewrite: {
        '^/zx_server': ''
      }
    }
  }