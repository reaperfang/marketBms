import { isJsonStr, isObject } from "@/utils/base.js";
import store from '@/store'
// 获取用户信息
export function getShopInfo() {
  let shopInfos = store.getters.shopInfos
  if (isObject(shopInfos)) return shopInfos
  if (!isJsonStr(shopInfos)) return null
  shopInfos = JSON.parse(shopInfos);
  return shopInfos
}
