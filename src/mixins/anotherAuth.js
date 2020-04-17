let mixin = {
    computed: {
        authHide() {
            if(localStorage.getItem('authDebug')) {
                return false
            }
            let enable = +localStorage.getItem('anotherAuthEnable')

            if(enable == 1) {
                return true
            } else if(enable == 0) {
                return false
            }
        }
    }
  }

  export default mixin