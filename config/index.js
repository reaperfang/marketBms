'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')


module.exports = {

  //开发环境
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    //host: '127.0.0.1',
    host: '0.0.0.0',
    port: 9001,
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: true,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',
    cssSourceMap: true,

    proxyTable: {
      '/data-server/**': {
        // target: 'http://172.22.146.133:8081',  // 店铺 李玟霆
        // target: 'http://172.22.146.117:80',// 许涛
        // target: 'http://172.22.146.3:8080',//
        target:'https://test-omo.aiyouyi.cn',

        changeOrigin: true,
        pathRewrite: {
          '^/data-server': ''
        }
      },

      /* 营销服务 */
      '/sale_server/**': {
        target: 'https://test-mkt.xinmt.com/api/',
        changeOrigin: true,
        pathRewrite: {
          '^/sale_server': ''
        }
      },
      '/upload_server/**': {
        target: 'https://test-omo.aiyouyi.cn/',
        changeOrigin: true,
        pathRewrite: {
          '^/upload_server': ''
        }
      },
    }
  },

  // 测试环境
  testBuild: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist-test/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist-test'),
    assetsSubDirectory: './static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: 'cheap-module-eval-source-map',

    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report || false,

    // `npm run build:prod --generate_report`
    generateAnalyzerReport: process.env.npm_config_generate_report || false
  },

  //生产环境
  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: 'source-map',
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build:prod --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report || false,

    // `npm run build:prod --generate_report`
    generateAnalyzerReport: process.env.npm_config_generate_report || false
  }
}
