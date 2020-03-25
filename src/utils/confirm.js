/* 全局确认弹窗工具 */

export default function({title, icon, iconSuccess, text, cancel, width, confirmText, customClass, showCancelButton, showConfirmButton, beforeClose}) {
  return new Promise((resolve, reject) => {
    let str = ''

    if(icon) {
      str += '<i class="el-icon-warning"></i>'
    }
    if(iconSuccess) {
      str += '<i class="el-icon-success"></i>'
    }
    str += `<p class="content-text">${text}</p>`

    this.$confirm(str, title, {
      showCancelButton: showCancelButton != undefined ? showCancelButton : true,
      showConfirmButton: showConfirmButton != undefined ? showConfirmButton : true,
      confirmButtonText: confirmText || '确认',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      width: width,
      customClass: customClass ? customClass + ' confirm confirm-big' : 'confirm confirm-big',
      beforeClose: beforeClose
    }).then(() => {
      resolve()
    }).catch((error) => {
      reject(error)
    });
  })
}