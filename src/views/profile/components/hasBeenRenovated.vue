<template>
   <div class="hasBeenRenovated">
     <h2>您已设置店铺装修，请您预览店铺：</h2>
     <ul>
       <li v-if="isHasBindGzh">
         <p>微信公众号商城</p>
         <div class="img">
          <img v-if="qrCode" :src="qrCode" class="public">
         </div>
         <p class="prompt">{{ getPublicPrompt }}</p>
       </li>
       <li v-if="isHasBindXcx">
         <p>微信小程序商城</p>
         <div class="img">
          <img v-if="smallQRcode" :src="smallQRcode" class="small">
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
      businessChannel: null, // 
      qrCode: null,
      smallQRcode: null,
      isBindGzh: false, // 是否绑定公众号
      isBindXcx: false // 是否绑定小程序
    }
  },

  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },
    getPublicPrompt() {
      return this.qrCode ? '微信扫一扫，预览商城' : '未成功发布您的公众号'
    },
    getSmallPrompt() {
      return this.smallQRcode ? '微信扫一扫，预览商城' : '未成功发布您的小程序'
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
    this.getShopInfo()
    // this.getwxBindStatus() // 是否绑定
    this.getQrcode()
    this.getSmallQRcode()
  },

  mounted() {},

  methods: {
    //获取二维码
    getQrcode() {
      if (this.shareUrl) {
      // url: 'https:' + this.shareUrl.split(':')[1].replace("&","[^]"),
      const pageLink = 'https:' + this.shareUrl.split(':')[1].replace("&","[^]")
      this._apis.shop
        .getQrcode({
          url: pageLink,
          width: "80",
          height: "80"
        })
        .then(response => {
          console.log('getQrcode',response)
          this.qrCode = response ? `data:image/png;base64,${response}` : null;
        })
        .catch(error => {
          console.error(error);
        });
      }
    },
    getwxBindStatus() {
      const id = this.cid
      this._apis.profile.getwxBindStatus({ id }).then(response => {
        console.log('getwxBindStatus',response)
        this.isBindGzh = response && response.bindWechatAccount === 1 || false
        this.isBindXcx = response && response.bindWechatApplet === 1 || false
      }).catch((err) => {
        console.log(err)
      })
    },
    getSmallQRcode() {
      const id = this.cid
      this._apis.profile.getSmallQRcode({ id }).then(response => {
        console.log('getSmallQRcode',response)
        this.smallQRcode = response ? `data:image/png;base64,${response}` : null
      }).catch((err) => {
        console.log(err)
      })
    },
    getShopInfo() {
      let id = this.cid;
      this._apis.set
        .getShopInfo({ id: id })
        .then(response => {
         console.log('----response--', response)
         this.businessChannel = response && response.businessChannel
        })
        .catch(error => {
          console.log(error)
          // this.$message.error('查询失败');
        });
    },
    goPrev() {
      this.$emit('getStep', 4)
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
      this.updateStep().then(() => {
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
        width: 80px;
        height: 80px;
        padding: 21px 0 27px 0;
        margin: 0 auto;
        background: url('~@/assets/images/profile/no_empower.png') no-repeat center;
        img {
          width: 100%;
          height: 100%;
          border:0;
          display: block;
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
  }
}
</style>