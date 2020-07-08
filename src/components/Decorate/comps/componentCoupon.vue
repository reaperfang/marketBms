<template>
  <!-- 优惠券 -->
  <div class="component_wrapper" v-loading="loading" :style="{cursor: dragable ? 'pointer' : 'text'}">
    <div v-if="currentComponentData && currentComponentData.data && hasContent" class="componentCoupon">
      <div class="coupon_first componentCoupon" v-if="showFakeData && currentComponentData.data.fakeList && currentComponentData.data.fakeList.length">
        <img :src="currentComponentData.data.fakeList[0].fileUrl" alt="" style="width:100%;">
      </div>

      <!-- 样式一 -->
      <div class="coupon_first componentCoupon" v-else>
        <ul ref="scrollContent" class="clearfix">
          <!-- status:true时候是已领取,hideScrambled:false, -->
          <template v-for="(item, key) in displayList">
            <li v-if="!(currentComponentData.hideScrambled==true&&item.receiveType!=1&&item.receiveType!=8)" :style="item.status=='true'?imgs1:imgs " :key="key" @click="openCouponLayer(item)">
              <div class="first_money">
                <span :class="style1">{{getTitle(item)}}</span>
                <span :class="style1">{{getContent(item)}}</span>
              </div>
              <div :class="style2" class="first_present" v-if="item.useCondition!=-1">满{{item.useCondition}}元可使用</div>
              <div :class="style2" class="first_present" v-else>无门槛限制</div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <componentEmpty v-else :componentData="currentComponentData"></componentEmpty>
  </div>
</template>



<script>
import mixinCompsData from '../mixins/mixinCompsData';
export default {
  name: 'componentCoupon',
  mixins:[mixinCompsData],
  components: {},
  data () {
    return {
      allLoaded: false,  //因为有异步数据，所以初始化加载状态是false
      displayList: [],
      loading: false,
      showFakeData: true
    }
  },
  computed: {
    style1() {
      // 样式为3的时候，颜色边框是什么就是是什么颜色否则走最外层默认定义的白色字体。同时当颜色为第三种的时候（白底），颜色为红色
      return [
        this.currentComponentData.data.couponStyle === 3 ? "col_" + this.currentComponentData.data.couponColor : "",
        this.currentComponentData.data.couponColor === 3 ? "col_1" : ""
      ];
    },
    style2() {
      // 样式为3的时候，颜色边框是什么就是是什么颜色否则走最外层默认定义的白色字体。同时当颜色为第三种的时候字体为灰色。
      return [
        this.currentComponentData.data.couponStyle === 3 ? "col_" + this.currentComponentData.data.couponColor : "",
        this.currentComponentData.data.couponColor === 3 ? "col_6" : ""
      ];
    },
    imgs() {
      return {
        backgroundImage:
          "url(" +
          require(`@/assets/images/shop/coupon/cou${this.currentComponentData.data.couponStyle}_color${this.currentComponentData.data.couponColor}.png`) +
          ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      }
    },
    imgs1() {
      return {
        backgroundImage:
          "url(" +
          require(`@/assets/images/shop/coupon/cou${this.currentComponentData.data.couponStyle}_color0.png`) +
          ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      }
    },

     /* 检测是否有数据 */
    hasContent() {
        let value = false;
        if((this.displayList && this.displayList.length) || (this.currentComponentData.data.fakeList && this.currentComponentData.data.fakeList.length)) {
            value = true;
        }
        return value;
    }
  },
  watch: {
    /* 监听添加类型，自动获取状态则拉取一下数据 */
    'currentComponentData.data.addType'(newValue, oldValue) {
      if(newValue === oldValue) {
        return;
      }
      if(newValue == 2) {
        this.fetch();
      }else{
        this.displayList = [];
        this.fetch();
      }
    },

    /* 监听显示个数类型 */
    'currentComponentData.data.couponNumberType'(newValue, oldValue) {
      if(newValue === oldValue) {
        return;
      }
      this.fetch();
    },

    /* 监听显示个数 */
    'currentComponentData.data.showNumber'(newValue, oldValue) {
      if(newValue === oldValue) {
        return;
      }
      this.fetch();
    },
    /* 监听隐藏已抢完券 */
    'ruleForm.hideScrambled'(newValue, oldValue) {
      if(newValue === oldValue) {
          return;
      }
      this.fetch();
    },
    'currentComponentData.data.ids': {
        handler(newValue, oldValue) {
            if(!this.utils.isIdsUpdate(newValue, oldValue)) {
                this.fetch();
            }
        },
        deep: true
    },
    'displayList': {
        handler(newValue) {
            this.showFakeData = !newValue.length;
        },
        deep: true
    }
  },
  methods: {
    //根据ids拉取数据
    fetch(componentData = this.currentComponentData.data) {
        if(componentData) {
          let params = {};
            if(componentData.addType == 2) {
              if(componentData.couponNumberType === 1) {
                params = {
                  couponType: 0
                };
              }else {
                params = {
                  couponType: 0,
                  limitedQuantity: componentData.showNumber
                };
              }
            }else{
              if(componentData.ids.length) {
                params = {
                  couponType: 0,
                  ids: componentData.ids
                };
              }else{
                this.displayList = [];
                return;
              }
            }

            if (componentData.hideScrambled) {
              params.remainStockFlag = true
            }else {
              params.remainStockFlag =false
            }

            this.loading = true;
            this.displayList = [];
            this._apis.shop.getCouponListByIds(params).then((response)=>{
                this.createList(response);
                this.loading = false;
            }).catch((error)=>{
                console.error(error);
                this.displayList = [];
                this.loading = false;
            });
        }
    },

      /* 创建数据 */
    createList(datas) {
       this.displayList = datas;
       this.allLoaded = true;
       this.$nextTick(()=>{
          let width = (this.displayList.length + 1) * (128 + 10);
          if(this.$refs.scrollContent) {
            this.$refs.scrollContent.style.width = width + "px";  
          }
       })
    },

    /* 获取标题 */
    getTitle(item) {
      return item.useType==0?item.useTypeFullcut:(item.useTypeDiscount * 10).toFixed(1);
    },

    /* 获取内容 */
    getContent(item) {
      return item.useType==0?'元':'折';
    }
  }
}
</script>

<style lang="scss" scoped>
.componentCoupon {
  .coupon_first {
    & > ul {
      display: -webkit-box;
      overflow-x: scroll;
      padding: 0 15px;
      & > li {
        width: 128px;
        height: 92px;
        margin:10px 0;
        margin-right: 10px;
        text-align: center;
        & > .first_money {
          padding-top: 17px;
          & > span:first-child {
            font-size: 26px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
          }
          & > span:last-child {
            font-size: 9px;
            color: rgba(255, 255, 255, 1);
          }
        }
        & > .first_present {
          padding-top: 7.5px;
          font-size: 10px;
		   transform: scale(0.83);
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
  .col_1 {
    color: #ff6666 !important;
  }
  .col_2 {
    color: #fd8246 !important;
  }
  .col_3 {
    color: #ff6666 !important;
  }
  .col_4 {
    color: #2c2e30 !important;
  }
  .col_5 {
    color: #8ed99c !important;
  }
  .col_6 {
    color: #d3d3d3 !important;
  }
}
</style>
