'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

// 二次编译缓存
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    disableHostCheck: true,
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    //https:true,
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/env.dev')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'bms',
      templateParameters: {
        BASE_URL: config.dev.assetsPublicPath + config.dev.assetsSubDirectory,
      },
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new HardSourceWebpackPlugin()
    // new HardSourceWebpackPlugin({
    //   // Either an absolute path or relative to webpack's options.context.
    //   cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
    //   // Either a string of object hash function given a webpack config.
    //   configHash: function(webpackConfig) {
    //     // node-object-hash on npm can be used to build this.
    //     return require('node-object-hash')({sort: false}).hash(webpackConfig);
    //   },
    //   // Either false, a string, an object, or a project hashing function.
    //   environmentHash: {
    //     root: process.cwd(),
    //     directories: [],
    //     files: ['package-lock.json', 'yarn.lock'],
    //   },
    //   // An object.
    //   info: {
    //     // 'none' or 'test'.
    //     mode: 'none',
    //     // 'debug', 'log', 'info', 'warn', or 'error'.
    //     level: 'debug',
    //   },
    //   // Clean up large, old caches automatically.
    //   cachePrune: {
    //     // Caches younger than `maxAge` are not considered for deletion. They must
    //     // be at least this (default: 2 days) old in milliseconds.
    //     maxAge: 2 * 24 * 60 * 60 * 1000,
    //     // All caches together must be larger than `sizeThreshold` before any
    //     // caches will be deleted. Together they must be at least this
    //     // (default: 50 MB) big in bytes.
    //     sizeThreshold: 50 * 1024 * 1024
    //   },
    // })
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
