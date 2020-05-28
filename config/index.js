'use strict'

/* 
 *合并环境变量
 */


const env = {};
env['dev'] = require('./env.dev.js');
env['prod'] = require('./env.prod.js');
env[process.env.NODE_ENV] = require('./env.'+ process.env.NODE_ENV +'.js');
module.exports = env;
