<template>
   <div class="channelBindAndPay">
    <steps class="steps" :step="step"></steps>
    
      <h2>请绑定您的经营渠道</h2>
      <ul style="height: 287px;" v-loading="!isInitCompleted" element-loading-background="rgba(255,255,255,1)" >
        <li v-if="isInitCompleted">
          <p><i :class="[isAuthGzhOrXcx ? 'icon-success' : 'el-icon-error']"></i><span>渠道绑定：</span></p>
          <p class="prompt">绑定微信小程序和公众号，推广您的店铺</p>
          <div class="btn-area">
            <div class="gzh" v-if="isHasBindGzh">
              <el-button class="btn-opeate" :disabled="isBindGzh" @click="goGzh">授权微信公众号</el-button>
              <p class="success" v-if="isBindGzh">公众号授权成功</p>
            </div>
            <div class="xcx" v-if="isHasBindXcx">
              <el-button class="btn-opeate" :disabled="isBindXcx" @click="goXcx">授权微信小程序</el-button>
              <p class="success" v-if="isBindXcx">小程序授权成功</p>
            </div>
          </div>
        </li>
        <li v-if="isInitCompleted" class="pay">
          <p><i :class="[isOpenPay ? 'icon-success' : 'el-icon-error']"></i><span>支付开通：</span></p>
          <div class="btn-area">
              <el-button class="btn-opeate" :disabled="!isAuthGzhOrXcx" @click="setPayInfo">开启支付</el-button>
              <p class="prompt2">请您先进行【渠道绑定】操作后再进行【开启支付】操作</p>
          </div>
        </li>
      </ul>
      <div class="btn">
        <el-button class="prev" @click="goPrev">上一步</el-button>
        <el-button class="next" type="primary" :loading="loading" @click="submit()" :disabled="!isOpenPay">下一步</el-button>
      </div>
    
   </div>
</template>

<script>
import { mapMutations } from "vuex";
import utils from "@/utils";
import Steps from './steps'
export default {
  components: { Steps },
  props: {
    step: {
      type: Number,
      default: 3
    }
  },

  data () {
    return {
      isInitCompleted: false, // 是否完成初始化
      loading: false,
      isDisabled: false,
      isBindGzh: false, // 是否绑定微信成功
      isBindXcx: false, // 是否绑定小程序成功
      businessChannel: null,
      isOpenPay: false
    }
  },

  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
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
    // 是否授权"成功"公众号或者小程序,是否可以进行开启支付功能操作
    isAuthGzhOrXcx() {
      return this.isBindGzh || this.isBindXcx
    }
   },

  watch: {},

  created() {
    this.init()
    // console.log()
    // this.getShopInfo()
    // this.getIsAuth()
    // this.getIsOpenPay()
  },

  mounted() {},

  methods: {
    init() {
      this.isInitCompleted = false
      const p1 = this.getShopInfo()
      const p2 = this.getIsAuth()
      const p3 = this.getIsOpenPay()
      Promise.all([p1, p2, p3]).finally(() => {
        this.isInitCompleted = true
      })
    },
    ...mapMutations(["SETCURRENT"]),
    getIsAuth() {
      // 需要调用微信是否授权接口
      const id = this.cid
      return this._apis.profile.getwxBindStatus({ id }).then(response => {
        // console.log('getwxBindStatus',response)
        this.isBindGzh = response && response.bindWechatAccount === 1 || false
        this.isBindXcx = response && response.bindWechatApplet === 1 || false
      }).catch((err) => {
        console.error(err)
        this.$message.error(err)
      })
    },
    goGzh() {
      // this.utils.addNewApply('/application/channelapp/publicnum', 3)
     const routeData =  this.$router.resolve({
        path:'/apply',
        query:{paths:'/application/channelapp/publicnum',applyId:'3'
      }})
      window.open(routeData.href, '_blank');
      this.SETCURRENT(8)
      this.confirm({
        icon: true,
        text: '请确认您已完成微信公众号授权',
        confirmText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.getIsAuth()
      }).catch(() => {
        
      });
    },
    goXcx() {
      const routeData = this.$router.resolve({
        path:'/apply',
        query:{paths:'/application/channelapp/smallapp',applyId:'3'
      }})
      window.open(routeData.href, '_blank');

      this.SETCURRENT(8)
      this.confirm({
        icon: true,
        text: '请确认您已完成微信小程序授权',
        confirmText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.getIsAuth()
      }).catch(() => {
        
      });
    },
    // 获取是否已经打开支付功能
    getIsOpenPay() {
      let query = {
        mchId:this.cid,
        channelId:'WX_ALL',
      }
      return this._apis.set.getShopPayInfo(query).then(response =>{
        const id = response && response.id
        this.isOpenPay = id ? true : false
      }).catch(error =>{
        this.$message.info('商户未设置支付信息');
        this.isOpenPay = false
      })
      
    },
    setPayInfo() {
      this.confirm({
        icon: true,
        text: '请确认您已开启微信支付并填写支付参数信息',
        confirmText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.getIsOpenPay()
      }).catch(() => {
        
      });
      let routeData = this.$router.resolve({ path: '/set/wxSet' });
      window.open(routeData.href, '_blank');
    },
    getShopInfo() {
      let id = this.cid;
      return this._apis.set
        .getShopInfo({ id: id })
        .then(response => {
        //  console.log('----response--', response)
         this.businessChannel = response && response.businessChannel
        })
        .catch(error => {
          this.$message.error(error || '查询失败');
        });
    },
    goPrev() {
      this.$emit('getStep', 2)
    },
    updateStep() {
      const cid = this.cid;
      const step = 4
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
      if (!this.isOpenPay) return false
      this.updateStep().then(() => {
        this.$message.success("保存成功！");
      }).catch(() => {
        this.$message.error('保存失败');
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.channelBindAndPay {
  padding: 15px 15px 15px 31px;
  background-color: #fff;
  h2 {
    font-size:16px;
    font-weight:500;
    color:rgba(68,67,75,1);
    line-height:22px;
    padding: 42px 0 0 13px;
  }
  ul {
    li {
      padding: 34px 0 0 55px;
      p {
        font-size:14px;
        font-weight:500;
        color:rgba(68,67,75,1);
        line-height:20px;
        display: flex;
        align-items: center;
        i {
          display:inline-block;
          width: 20px;
          height: 20px;
          font-size: 20px;
          &.el-icon-error {
            color:rgba(253, 76, 43, 1);
          }
          &.icon-success {
            background: url('~@/assets/images/profile/icon_success.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        span {
          padding-left: 11px;
          font-weight:500;
        }
        &.prompt {
          padding-top: 17px;
          font-size:13px;
          font-weight:400;
          line-height:18px;
          padding-left: 40px;
        }
        &.success {
          padding-top: 10px;
          font-size:12px;
          font-weight:400;
          color:rgba(253,147,43,1);
          line-height:17px;
        }
      }
      >.btn-area {
        padding-top: 12px;
        padding-left: 40px;
        display: flex;
        button {
          border-radius:4px;
          border:1px solid rgba(101,94,255,1);
          font-size:12px;
          font-weight:400;
          color:rgba(101,94,255,1);
          &.is-disabled {
            background:rgba(244,244,245,1);
            color:rgba(146,146,155,1);
            border-color:rgba(244,244,245,1);
          }
        }
        .btn-opeate {
          margin-right: 30px;
        }
        >.prompt2 {
          padding-top: 12px;
          font-size:12px;
          font-weight:400;
          color:rgba(146,146,155,1);
          line-height:17px;
        }
      }
      &.pay {
        >.btn-area {
          display: block;
        }
      }
    }
  }
  >.btn {
    padding-top: 87px;
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