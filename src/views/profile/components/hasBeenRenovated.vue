<template>
   <div class="hasBeenRenovated">
     <h2>您已设置店铺装修，请您预览店铺：</h2>
    <ul v-loading="isLoading" element-loading-background="rgba(255,255,255,1)">
      <li v-if="!isLoading && isHasBindGzh" class="gzh">
        <p>微信公众号商城</p>
        <div class="img" :class="{ 'no-bind': !isBindGzh, 'no-release': isBindGzh && !isReleaseGZ }">
          <img v-if="isBindGzh && qrCode && isReleaseGZ" :src="qrCode" class="public">
        </div>
        <p class="prompt">{{ getPublicPrompt }}</p>
      </li>
      <li v-if="!isLoading && isHasBindXcx" class="xcx">
        <p>微信小程序商城</p>
        <div class="img" :class="{ 'no-bind': !isBindXcx, 'no-release': isBindXcx && !isReleaseWX }">
          <img v-if="isBindXcx && smallQRcode && isReleaseWX" :src="smallQRcode" class="small">
        </div>
        <p class="prompt">{{ getSmallPrompt }}</p>
      </li>
    </ul>
    <div class="btn">
      <el-button class="prev" @click="goPrev">上一步</el-button>
      <el-button class="next" type="primary" @click="submit()">完成</el-button>
    </div>
   </div>
</template>

<script>
export default {
  components: {},

  props: {
    shareUrl: {
      type: String,
       default: ''
    }
  },

  data () {
    return {
      isLoading: true,
      businessChannel: null, // 
      qrCode: null,
      smallQRcode: '',
      isBindGzh: false, // 是否绑定公众号
      isBindXcx: false, // 是否绑定小程序
      isReleaseWX: false, // 小程序是否发布
      isReleaseGZ: false // 公众号是否发布
    }
  },

  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },
    getPublicPrompt() {
      if (!this.isBindGzh) return '您当前还未授权公众号'
      if (!this.isReleaseGZ) return '您当前还未设置商城首页'
      if (this.qrCode) return '微信扫一扫，预览商城'
      return ''
    },
    getSmallPrompt() {
      if (!this.isBindXcx) return '您当前还未授权小程序'
      if (!this.isReleaseWX) return '您当前还未发布小程序'
      if (this.smallQRcode) return '微信扫一扫，预览商城'
      return ''
    },
    // 判断是否店铺勾选微信公众号
    isHasBindGzh() {
      let isTrue = false
      isTrue = this.businessChannel === 0 || this.businessChannel === 2
      return isTrue
    },
    // 判断是否勾选小程序
    isHasBindXcx() {
      let isTrue = false
      isTrue = this.businessChannel === 0 || this.businessChannel === 1
      return isTrue
    },
  },

  watch: {},

  created() {
    const p1 = this.getShopInfo()
    const p2 = this.getwxBindStatus() // 是否绑定
    const p3 = this.getQrcode()
    const p4 = this.getSmallQRcode()
    const p5 = this.getIsReleaseWX()
    const p6 = this.getIsReleaseGZ()
    Promise.all([p1, p2, p3, p4, p5, p6]).finally(() => {
      this.isLoading = false
    })
  },

  mounted() {},

  methods: {
    //判断公众号是否设置商城首页
    getIsReleaseGZ(){
      return this._apis.shop
        .getHomePage({pageTag:0}).then(response => {
          this.isReleaseGZ = response ? true : false
        })
        .catch(error => {
          console.error(error);
          this.$message({ message: error, type: 'error' });
        });
    },
    //判断小程序是否发布
    getIsReleaseWX(){
      return this._apis.profile
        .getSmallRelease({id:this.cid}).then(response => {
          this.isReleaseWX = response.status === 0 ? true :  false
        })
        .catch(error => {
          console.error(error);
          this.$message({ message: error, type: 'error' });
        });
    },
    //获取二维码
    getQrcode() {
      if (this.shareUrl) {
      // url: 'https:' + this.shareUrl.split(':')[1].replace("&","[^]"),
      const pageLink = 'https:' + this.shareUrl.split(':')[1].replace("&","[^]")
      return this._apis.shop
        .getQrcode({
          url: pageLink,
          width: "120",
          height: "120"
        })
        .then(response => {
          console.log('getQrcode',response)
          this.qrCode = response ? `data:image/png;base64,${response}` : null;
        })
        .catch(error => {
          console.error(error);
          this.$message({ message: error, type: 'error' });
        });
      }
    },
    getwxBindStatus() {
      const id = this.cid
      return this._apis.shopInfo.getwxBindStatus({ id }).then(response => {
        console.log('getwxBindStatus',response)
        this.isBindGzh = response && response.bindWechatAccount === 1 || false
        this.isBindXcx = response && response.bindWechatApplet === 1 || false
      }).catch((err) => {
        console.error(error);
        this.$message({ message: error, type: 'error' });
      })
    },
    getSmallQRcode() {
      const id = this.cid
      return this._apis.shopInfo.getSmallQRcode({ id }).then(response => {
        // console.log('getSmallQRcode',response)
        this.smallQRcode = response ? `data:image/png;base64,${response}` : ''
      }).catch((err) => {
        console.error(error);
        this.$message({ message: error, type: 'error' });
      })
    },
    getShopInfo() {
      let id = this.cid;
      return this.$store.dispatch('getShopInfo').then(response => {
         console.log('----response--', response)
         this.businessChannel = response && response.businessChannel
        })
        .catch(error => {
         this.$message({ message: error, type: 'error' });
          // this.$message.error('查询失败');
        });
    },
    goPrev() {
      this.$emit('getStep', 4)
    },
    setStoreGuide(storeGuide) {
      let id = this.cid
      let data = {
        id,
        storeGuide
      }
      return new Promise((resolve, reject) => {
        this._apis.shopInfo.updateShopInfo(data).then(response =>{
          this.$store.dispatch('getShopInfo');
          this.$store.commit('setStoreGuide', storeGuide)
          resolve(response)
        }).catch(error =>{
          reject(error)
          this.$message({ message: error, type: 'error' });
          // this.$message.error('保存失败');
        })
      })
      
    },
    updateStep() {
      const cid = this.cid;
      const step = 6
      return new Promise((resolve, reject) => {
        this._apis.shop
          .updateStep({ cid, step })
          .then(response => {
            setTimeout(() => {
              this.$emit('getStep', step)
            }, 500)
            resolve(response)
          }).catch((err) => {
            reject(err)
          })
      })
    },
    submit() {
      const p1 = this.updateStep()
      const p2 = this.setStoreGuide(1)
      Promise.all([p1, p2]).then(() => {
        this.$router.push({ path: '/profile/profile'})
      }).catch(() => {
         this.$message.error('保存失败');
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.hasBeenRenovated {
  background: #fff;
  padding: 38px 44px;
  >h2 {
    font-size:16px;
    font-weight:500;
    color:rgba(68,67,75,1);
    line-height:22px;
  }
  >ul {
    padding-top: 85px;
    display: flex;
    justify-content: center;
    min-height: 295px;
    box-sizing: border-box;
    >li {
      &:nth-of-type(2) {
        margin-left: 187px;
      }
      >p {
        text-align: center;
        font-size:15px;
        font-weight:500;
        color:rgba(68,67,75,1);
        line-height:21px;
        &.prompt {
          font-size:13px;
          font-weight:400;
          color:rgba(146,146,155,1);
        }
      }
      >.img {
        box-sizing: content-box;
        width: 120px;
        min-height: 120px;
        padding: 21px 0 27px 0;
        margin: 0 auto;
        img {
          width: 100%;
          height: auto;
          border:0;
          display: block;
        }
      }
      &.gzh, &.xcx {
        >.no-bind {
          background: url('~@/assets/images/profile/no_empower.jpg') no-repeat center;
        }
      }
      &.gzh {
        >.no-release {
          background: url('~@/assets/images/profile/no_release_gz.png') no-repeat center;
        }
      }
      &.xcx {
        >.no-release {
          background: url('~@/assets/images/profile/no_release_wx.png') no-repeat center;
        }
      }
    }
  }
  >.btn {
    padding-top: 108px;
    padding-bottom: 202px;
    text-align: center;
    .prev {
      margin-right: 45px;
      border-radius:4px;
      border:1px solid rgba(101,94,255,1);
      font-size:12px;
      font-weight:400;
      color:rgba(101,94,255,1);
    }
    .next {
      width: 68px;
    }
  }
}
</style>