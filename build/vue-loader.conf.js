'use strict'
const utils = require('./utils')
const config = require('../config')

let sourceMap, extract, usePostCSS;
switch(process.env.NODE_ENV) {
  case 'test':
    sourceMap = config.test.productionSourceMap
    extract = true
    usePostCSS =  true
    break;
  case 'test2':
    sourceMap = config.test.productionSourceMap
    extract = true
    usePostCSS =  true
    break;
  case 'test3':
    sourceMap = config.test.productionSourceMap
    extract = true
    usePostCSS =  true
    break;
  case 'test4':
    sourceMap = config.test.productionSourceMap
    extract = true
    usePostCSS =  true
    break;
  case 'test5':
    sourceMap = config.test.productionSourceMap
    extract = true
    usePostCSS =  true
    break;
  case 'pre':
    sourceMap = config.pre.productionSourceMap
    extract = true
    usePostCSS =  true
    break;
  case 'production':
    sourceMap = config.build.productionSourceMap
    extract = true
    usePostCSS =  true
    break;
    default:
    sourceMap = config.dev.cssSourceMap
    extract = false,
    usePostCSS =  true
}


module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMap,
    extract: extract
  }),
  cssSourceMap: sourceMap,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
