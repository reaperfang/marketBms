import { preLocation } from '@/system/appConfig'

module.exports = {
	NODE_ENV: '"testing"',
  	ENV_CONFIG: '"test"',
  	DATA_API: `'${preLocation}'`,
	SALE_API: '"/mkt-api"',
	WEBSOCKET_server:'"ws://127.0.0.1:9000"',
	staticHost: 'https://test-m-aiyouyi.yun300.cn/',
  UPLOAD_SERVER:'"http://test-omo.aiyouyi.cn"',
  APPLY:'"http://test-omo.aiyouyi.cn"'
}
