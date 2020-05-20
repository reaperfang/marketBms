'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
let test = require('./test.env.js');
let test2 = require('./test2.env.js');
let test3 = require('./test3.env.js');
module.exports = {
	dev: {

		// Paths
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		host: '0.0.0.0', // can be overwritten by process.env.HOST
		host: '127.0.0.1', // can be overwritten by process.env.HOST
		port: 9001, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
		autoOpenBrowser: false,
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
				target: 'http://test3-omo.aiyouyi.cn',//https://test-omo.aiyouyi.cn
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
		}
	},

	test: {
    ...test,
		// Template for index.html
		index: path.resolve(__dirname, '../dist/index.html'),

		// Paths
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: './',

		/**
		 * Source Maps
		 */

		productionSourceMap: true,
		// https://webpack.js.org/configuration/devtool/#production
		devtool: 'cheap-module-eval-source-map',

		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: true,
		productionGzipExtensions: ['js', 'css'],

		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
  },
  test2: {
    ...test2,
		// Template for index.html
		index: path.resolve(__dirname, '../dist/index.html'),

		// Paths
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: './',

		/**
		 * Source Maps
		 */

		productionSourceMap: true,
		// https://webpack.js.org/configuration/devtool/#production
		devtool: 'cheap-module-eval-source-map',

		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: true,
		productionGzipExtensions: ['js', 'css'],

		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	},
	test3: {
    ...test3,
		// Template for index.html
		index: path.resolve(__dirname, '../dist/index.html'),

		// Paths
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: './',

		/**
		 * Source Maps
		 */

		productionSourceMap: true,
		// https://webpack.js.org/configuration/devtool/#production
		devtool: 'cheap-module-eval-source-map',

		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: true,
		productionGzipExtensions: ['js', 'css'],

		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	},
	pre: {
		// Template for index.html
		index: path.resolve(__dirname, '../dist/index.html'),

		// Paths
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: './',

		/**
		 * Source Maps
		 */

		productionSourceMap: true,
		// https://webpack.js.org/configuration/devtool/#production
		devtool: 'cheap-module-eval-source-map',

		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: true,
		productionGzipExtensions: ['js', 'css'],

		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	},

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
		devtool: '#source-map',

		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: true,
		productionGzipExtensions: ['js', 'css'],

		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	}
}
