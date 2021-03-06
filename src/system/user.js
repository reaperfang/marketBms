import { isJsonStr, isObject } from "@/utils/base.js";
import { getToken } from "@/system/auth.js";
import store from '@/store'

// 是否登录
export function isLogin() {
  const user = store.getters.userInfo
  const shopInfo = store.getters.shopInfos
  const token = getToken()
  if (user && token && shopInfo) return true
  return false
}
/**
 * 根据层级来判断是否有此权限
 * @param { Array } authList "['设置','同城配送','商家配送']"
 * @returns { boolean }
 */
export function isExistAuth(authList = []) {
  let msfList = getLevelAuthList()
  if (msfList.length > 0 && isExistAuthInData(msfList[0].children, authList)) return true
  return false
}
/**
 * 递归判断 data权限列表中 中存在 层级列表 authList中的权限
 * @param { Array } data [{name: '设置', children: [{...}]}]
 * @param { Array } authList  "['设置','同城配送','商家配送']" 单一权限，不支持多个
 * @param { Number } index 0
 */
export function isExistAuthInData(data = [], authList = [], index = 0) {
  if (index === authList.length) return true
  let count = 0
  let isAuth = false
  while(count < data.length) {
    if (authList[index] === data[count].name) {
      isAuth = true
      break
    }
    count++
  }
  if (!isAuth) return false
  return isExistAuthInData(data[count].children, authList, ++index)
}
// 获取权限列表
export function getAuthList() {
  let authList = []
  const shopInfo = store.getters.shopInfos
  if(shopInfo && shopInfo.data && shopInfo.data.msfList) {
    authList = shopInfo.data.msfList
  }
  return authList
}
// 获取层级权限列表
export function getLevelAuthList() {
  let authList = []
  const shopInfo = store.getters.shopInfos
  if(shopInfo && shopInfo.data && shopInfo.data.functions) {
    authList = shopInfo.data.functions
  }
  return authList
}