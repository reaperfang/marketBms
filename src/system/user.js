import { isJsonStr, isObject } from "@/utils/base.js";
import store from '@/store'
// 获取用户信息
export function getUserInfo() {
  store.getters.token
  let userInfo = localStorage.getItem('userInfo')
  if (!isJsonStr(userInfo)) return null
  userInfo = JSON.parse(userInfo);
  return userInfo
}