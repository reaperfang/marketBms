/* 
 * 代理表配置文件
 */

module.exports = {
    '/data-server/**': {
<<<<<<< HEAD
      target: 'http://test4-omo.aiyouyi.cn',//https://test-omo.aiyouyi.cn
=======
      target: 'http://test3-omo.aiyouyi.cn',//https://test-omo.aiyouyi.cn
>>>>>>> boom_v1.4.9/v1.5
      changeOrigin: true,
      pathRewrite: {
        '^/data-server': ''
      }
    },

    /* 营销服务 */
    '/sale_server/**': {
<<<<<<< HEAD
      target: 'https://test4-omo.aiyouyi.cn/mkt-api/',
=======
      target: 'https://test3-omo.aiyouyi.cn/mkt-api/',
>>>>>>> boom_v1.4.9/v1.5
      changeOrigin: true,
      pathRewrite: {
        '^/sale_server': ''
      }
    },
    '/upload_server/**': {
<<<<<<< HEAD
      target: 'http://test4-omo.aiyouyi.cn',//https://test-omo.aiyouyi.cn
=======
      target: 'http://test3-omo.aiyouyi.cn',//https://test-omo.aiyouyi.cn
>>>>>>> boom_v1.4.9/v1.5
      changeOrigin: true,
      pathRewrite: {
        '^/upload_server': ''
      }
    },
    '/zx_server/**': {
<<<<<<< HEAD
      target: 'https://test4-cms-api.300.cn',
=======
      target: 'https://test3-cms-api.300.cn',
>>>>>>> boom_v1.4.9/v1.5
      changeOrigin: true,
      pathRewrite: {
        '^/zx_server': ''
      }
    }
  }