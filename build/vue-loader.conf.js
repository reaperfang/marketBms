'use strict'
const utils = require('./utils')
const config = require('../config')

let sourceMap = config[process.env.NODE_ENV][process.env.NODE_ENV === 'dev' ? 'cssSourceMap' : 'productionSourceMap'] || false;
let extract = process.env.NODE_ENV !== 'dev';
let usePostCSS = true;


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
