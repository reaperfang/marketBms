/*
 * 代理表配置文件
 */

module.exports = {

    /* 电商服务 */
    '/data-server/**': {
      target: 'https://test3-omo.aiyouyi.cn',
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

    /* 300官网 */
    '/zx_server/**': {
      target: 'https://test-cms-api.300.cn',  //此地址不分test几，只有test/pre和空前缀
      changeOrigin: true,
      pathRewrite: {
        '^/zx_server': ''
      }
    }
  }
