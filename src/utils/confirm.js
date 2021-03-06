/* 全局确认弹窗工具 */

export default function({title, icon, iconSuccess, showClose, closeOnClickModal, text, cancel, width, confirmText, customClass, showCancelButton, showConfirmButton, beforeClose, cancelButtonText = '取消', iconWarning, distinguishCancelAndClose = false}) {
  return new Promise((resolve, reject) => {
    let str = ''
    let _customClass

    if(icon) {
      str += '<i class="el-icon-warning"></i>'
    }
    if(iconWarning) {
      str += '<i class="el-icon-warning" style="color:RGBA(253, 147, 43, 1)"></i>'
    }
    if(iconSuccess) {
      str += '<i class="el-icon-success"></i>'
    }
    str += `<p class="content-text">${text}</p>`
    let _showCancelButton

    _showCancelButton = showCancelButton != undefined ? showCancelButton : true
    if(customClass) {
      if(_showCancelButton) {
        _customClass = customClass + ' confirm confirm-big'
      } else {
        _customClass = customClass + ' confirm confirm-big no-cancel'
      }
    } else {
      if(_showCancelButton) {
        _customClass = 'confirm confirm-big'
      } else {
        _customClass = 'confirm confirm-big no-cancel'
      }
    }

    this.$confirm(str, title, {
      showCancelButton: _showCancelButton,
      showConfirmButton: showConfirmButton != undefined ? showConfirmButton : true,
      confirmButtonText: confirmText || '确认',
      cancelButtonText: cancelButtonText,
      dangerouslyUseHTMLString: true,
      width: width,
      customClass: _customClass,
      beforeClose: beforeClose,
      distinguishCancelAndClose: distinguishCancelAndClose,
      showClose,
      closeOnClickModal
    }).then(() => {
      resolve()
    }).catch((error) => {
      reject(error)
    });
  })
}