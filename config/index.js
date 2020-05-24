'use strict'

/* 
 *合并环境变量
 */


let dev = require('./env.dev.js');
let test = require('./env.test.js');
let test2 = require('./env.test2.js');
let test3 = require('./env.test3.js');
let test4 = require('./env.test4.js');
let test5 = require('./env.test5.js');
let pre = require('./env.pre.js');
let prod = require('./env.prod.js');
module.exports = {
	dev,
	test,
	test2,
	test3,
	test4,
	test5,
	pre,
	prod
}
