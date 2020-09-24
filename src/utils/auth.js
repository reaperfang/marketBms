/**
 * 根据层级来判断是否有此权限
 * @param { Array } authList "['设置','同城配送','商家配送']"
 * @returns { boolean }
 */
export function isExistAuth(authList = []) {
  const localMsfList = localStorage.getItem('shopInfos');
  let msfList = [];
  if(localMsfList && JSON.parse(localMsfList) && JSON.parse(localMsfList).data && JSON.parse(localMsfList).data.functions) {
    msfList = JSON.parse(localMsfList).data.functions
  }
  // if (msfList && msfList.length > 0 && )
  if (isExistAuthInData(msfList[0].children, authList)) return true
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