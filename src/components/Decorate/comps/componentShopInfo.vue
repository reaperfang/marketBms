<template>
  <!-- 店铺信息 -->
  <div class="componentShoplnfo" v-if="currentComponentData && currentComponentData.data">
    <!-- 样式一 -->
    <div v-if="displayStyle1" class="shopinfo1" :style="background">
      <div class="shopinfo_cont">
        <div class="shopinfo_img">
          <img :src="shopInfo.logoCircle || shopInfo.logo" alt />
        </div>
        <div class="shopinfo_introduce">
          <p class="shopinfo_title">{{shopInfo.shopName || '店铺名称'}}</p>
          <!-- <div class="shopinfo_explain">
            <p>
              <span>满减</span>
            </p>
            <span>满减优惠活动展示</span>
          </div> -->
        </div>
      </div>
    </div>
    <!-- 样式二 -->
    <div v-if="displayStyle2" class="shopinfo2">
      <div class="shopinfo2_bg" :style="background">
        <div>{{shopInfo.shopName || '店铺名称'}}</div>
      </div>
      <div class="shopinfo2_two">
        <div class="shopinfo2_img">
          <img :src="shopInfo.logoCircle || shopInfo.logo" alt />
        </div>
        <div class="shopinfo2_introduce">
          <span>全部商品999</span>
          <span></span>
          <span>上新30</span>
        </div>
      </div>
    </div>
    <!-- 样式三 -->
    <div v-if="displayStyle3" class="shopinfo3" :style="background">
      <div class="shopinfo3_cont">
        <div class="shopinfo3_img">
          <img :src="shopInfo.logoCircle || shopInfo.logo" alt />
        </div>
        <div class="shopinfo3_introduce">
          <p>{{shopInfo.shopName || '店铺名称'}}</p>
          <div>
            <span>全部商品999</span>
            <span></span>
            <span>上新30</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 样式四 -->
    <div v-if="displayStyle4" class="shopinfo4">
      <div class="shopinfo4_bg" :style="background"></div>
      <div class="shopinfo4_two">
        <div class="shopinfo4_img">
          <img :src="shopInfo.logoCircle || shopInfo.logo" alt />
        </div>
        <div class="shopinfo4_introduce">
          <div class="shopinfo4_title">{{shopInfo.shopName || '店铺名称'}}</div>
          <div class="shopinfo4_conts">
            <span>全部商品999</span>
            <span></span>
            <span>上新30</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 样式五 -->
    <div v-if="displayStyle5" class="shopinfo5" :style="background">
      <div class="shopinfo5_img">
        <img :src="shopInfo.logoCircle || shopInfo.logo" alt />
      </div>
      <div class="shopinfo5_title">{{shopInfo.shopName || '店铺名称'}}</div>
      <div class="shopinfo5_line"></div>
      <div class="shopinfo5_conts">
        <span>全部商品999</span>
        <span></span>
        <span>上新30</span>
      </div>
    </div>
  </div>
</template>

<script>
import componentMixin from '../mixins/mixinComps';
export default {
  name: 'componentShopInfo',
  mixins:[componentMixin],
  components: {},
  data () {
    return {
      // imgs1: {
      //   backgroundImage: "url(" + this.currentComponentData.data.backgroundImage || require("@/assets/images/shop/bg.png") + ")",
      //   backgroundRepeat: "no-repeat",
      //   backgroundSize: "100% 100%"
      // }
    }
  },
  created() {
    this.$store.dispatch('getShopInfo');
  },
  computed: {
    displayStyle1() {
      return this.currentComponentData.data.displayStyle == 1;
    },
    displayStyle2() {
      return this.currentComponentData.data.displayStyle == 2;
    },
    displayStyle3() {
      return this.currentComponentData.data.displayStyle == 3;
    },
    displayStyle4() {
      return this.currentComponentData.data.displayStyle == 4;
    },
    displayStyle5() {
      return this.currentComponentData.data.displayStyle == 5;
    },
    shopInfo() {
      return this.$store.getters.shopInfo || {};
    },
    background() {
      let url = require('@/assets/images/shop/bg.png');
      if(this.currentComponentData.data.backgroundImage) {
        url = this.currentComponentData.data.backgroundImage
      }
      return {
        'backgroundImage': `url(${url})`,
        'backgroundRepeat': 'no-repeat',
        'backgroundSize': 'cover'
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.componentShoplnfo {
  .shopinfo1 {
    width: 100%;
    height: 180px;
    position: relative;
    & > .shopinfo_cont {
      height: 60px;
      padding-left: 15px;
      position: absolute;
      bottom: 10px;
      display: flex;
      & > .shopinfo_img {
        width: 60px;
        height: 60px;
        & > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      & > .shopinfo_introduce {
        padding-left: 15px;
        & > .shopinfo_title {
          font-size: 18px;
          font-weight: 500;
          color: #fff;
          padding-top: 13px;
        }
        & > .shopinfo_explain {
          color: #fff;
          padding-top: 5px;
          & > p {
            width: 28px;
            height: 14px;
            line-height: 15px;
            background: #e94141;
            text-align: center;
            display: inline-block;
            & > span {
              font-size: 11px;
              transform: scale(0.92);
              display: inline-block;
            }
          }
          & > span {
            font-size: 11px;
            transform: scale(0.92);
            display: inline-block;
          }
        }
      }
    }
  }
  .shopinfo2 {
    & > .shopinfo2_bg {
      height: 160px;
      position: relative;
      & > div {
        font-size: 18px;
        font-weight: 500;
        color: #fff;
        position: absolute;
        left: 86px;
        bottom: 0px;
      }
    }
    & > .shopinfo2_two {
      height: 32px;
      line-height: 32px;
      padding: 0px 15px;
      position: relative;
      & > .shopinfo2_img {
        width: 60px;
        height: 60px;
        position: absolute;
        bottom: 0px;
        & > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border:1px solid #ddd;
        }
      }
      & > .shopinfo2_introduce {
        padding-left: 70px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        & > span:nth-child(1) {
          color: #999999;
          font-size: 11px;
          transform: scale(0.92);
          display: inline-block;
          padding-right: 10px;
        }
        & > span:nth-child(2) {
          width: 3px;
          height: 16px;
          display: inline-block;
          background: #cccccc;
          // position: absolute;
          // top: 7px;
          // margin-left: 5px;
        }
        & > span:nth-child(3) {
          color: #999999;
          font-size: 11px;
          transform: scale(0.92);
          display: inline-block;
          padding-left: 10px;
        }
      }
    }
  }
  .shopinfo3 {
    width: 100%;
    height: 180px;
    position: relative;
    & > .shopinfo3_cont {
      position: absolute;
      bottom: 10px;
      display: flex;
      padding-left: 15px;
      & > .shopinfo3_img {
        width: 60px;
        height: 60px;

        & > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      & > .shopinfo3_introduce {
        padding-left: 15px;
        & > p {
          font-size: 18px;
          font-weight: 500;
          color: #fff;
          padding-top: 13px;
        }
        & > div {
          color: #ffffff;
          padding-top: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          & > span:nth-child(1) {
            font-size: 11px;
            transform: scale(0.92);
            display: inline-block;
            padding-right: 10px;
          }
          & > span:nth-child(2) {
            width: 3px;
            height: 16px;
            display: inline-block;
            background: #fff;
          }
          & > span:nth-child(3) {
            font-size: 11px;
            transform: scale(0.92);
            display: inline-block;
            padding-left: 10px;
          }
        }
      }
    }
  }
  .shopinfo4 {
    & > .shopinfo4_bg {
      height: 110px;
      width: 100%;
    }
    & > .shopinfo4_two {
      height: 100px;
      background: #fff;
      position: relative;
      & > .shopinfo4_img {
        width: 60px;
        height: 60px;
        position: absolute;
        top: -30px;
        left: 50%;
        margin-left: -30px;
        & > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border:1px solid #ddd;
        }
      }
      & > .shopinfo4_introduce {
        padding-top: 40px;
        text-align: center;
        & > .shopinfo4_title {
          font-size: 18px;
          color: #1c1d1f;
          font-weight: 500;
        }
        & > .shopinfo4_conts {
          color: #999999;
          padding-top: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          & > span:nth-child(1) {
            font-size: 11px;
            transform: scale(0.92);
            display: inline-block;
            padding-right: 10px;
          }
          & > span:nth-child(2) {
            width: 3px;
            height: 16px;
            display: inline-block;
            background: #cccccc;
          }
          & > span:nth-child(3) {
            font-size: 11px;
            transform: scale(0.92);
            display: inline-block;
            padding-left: 10px;
          }
        }
      }
    }
  }
  .shopinfo5 {
    height: 250px;
    padding-top: 47px;
    text-align: center;
    & > .shopinfo5_img {
      width: 60px;
      height: 60px;
      margin: 0 auto;
      & > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border:1px solid #ddd;
        object-fit: cover;
      }
    }
    & > .shopinfo5_title {
      font-size: 18px;
      font-weight: 500;
      color: #fff;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    & > .shopinfo5_line {
      margin: 0 auto;
      width: 80px;
      height: 1px;
      background: #ffffff;
    }
    & > .shopinfo5_conts {
      color: #ffffff;
      padding-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      & > span:nth-child(1) {
        font-size: 11px;
        transform: scale(0.92);
        display: inline-block;
        padding-right: 10px;
      }
      & > span:nth-child(2) {
        width: 3px;
        height: 16px;
        display: inline-block;
        background: #ffffff;
      }
      & > span:nth-child(3) {
        font-size: 11px;
        transform: scale(0.92);
        display: inline-block;
        padding-left: 10px;
      }
    }
  }
}
</style>
