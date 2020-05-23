'use strict'
require('./check-versions')()

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfigTest = require('./webpack.test.conf')
const webpackConfigTest2 = require('./webpack.test2.conf')
const webpackConfigPre = require('./webpack.pre.conf')
const webpackConfigProd = require('./webpack.prod.conf')

const spinner = ora(
  'building for ' + process.env.NODE_ENV + ' environment...'
)
spinner.start()

let webpackConfig = {}, assetsRoot = '', assetsSubDirectory = '';
switch(process.env.NODE_ENV) {
case 'testing':
    webpackConfig = webpackConfigTest
    assetsRoot = config.test.assetsRoot
    assetsSubDirectory = config.test.assetsSubDirectory
    break;
  case 'test':
    webpackConfig = webpackConfigTest
    assetsRoot = config.test.assetsRoot
    assetsSubDirectory = config.test.assetsSubDirectory
    break;
  case 'test2':
    webpackConfig = webpackConfigTest
    assetsRoot = config.test.assetsRoot
    assetsSubDirectory = config.test.assetsSubDirectory
    break;
  case 'test3':
    webpackConfig = webpackConfigTest
    assetsRoot = config.test.assetsRoot
    assetsSubDirectory = config.test.assetsSubDirectory
    break;
  case 'testing2':
    webpackConfig = webpackConfigTest2
    assetsRoot = config.test2.assetsRoot
    assetsSubDirectory = config.test2.assetsSubDirectory
    break;
  case 'pre':
    webpackConfig = webpackConfigPre
    assetsRoot = config.pre.assetsRoot
    assetsSubDirectory = config.pre.assetsSubDirectory
    break;
  case 'production':
    webpackConfig = webpackConfigProd
    assetsRoot = config.build.assetsRoot
    assetsSubDirectory = config.build.assetsSubDirectory
    break;
}

rm(path.join(assetsRoot, assetsSubDirectory), err => {
  if (err) throw err

  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
