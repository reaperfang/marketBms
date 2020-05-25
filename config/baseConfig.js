/* 
 * 公共环境变量配置,可在各环境变量文件中覆写，可参考prod环境
 */

const path = require('path')

module.exports = {
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
	devtool: 'cheap-module-source-map',

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