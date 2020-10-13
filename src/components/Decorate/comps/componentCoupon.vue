<template>
  <!-- 优惠券 -->
  <div class="component_wrapper" v-loading="loading" :style="{cursor: dragable ? 'pointer' : 'text'}">
    <div v-if="currentComponentData && currentComponentData.data" class="componentCoupon">
      <template v-if="hasRealData || hasFakeData">
        <!-- 样式一 -->
        <div class="coupon_first componentCoupon" v-if="hasRealData">
          <ul ref="scrollContent" class="clearfix" :class="'list'+listStyle+' couponStyle'+currentComponentData.data.couponStyle">
            <!-- status:true时候是已领取,hideScrambled:false, -->
            <template v-for="(item, key) in displayList">
              <li v-if="!(currentComponentData.hideScrambled==true&&item.receiveType!=1&&item.receiveType!=8)" :style="item.status=='true'?imgs1:imgs " :class="{'list-received': item.status=='true'}" :key="key">
                <template v-if="listStyle !== 3">
                  <div class="first_money">
                    <span :class="style1">{{getTitle(item)}}</span>
                    <span :class="style1">{{getContent(item)}}</span>
                  </div>
                  <div :class="style2" class="first_present" v-if="item.useCondition!=-1">满{{item.useCondition}}元可使用</div>
                  <div :class="style2" class="first_present" v-else>无门槛限制</div>
                </template>
                <template v-else>
                  <div class="first_money" v-if="getContent(item) == '折'">
                    <span :class="style1">{{getTitle(item)}}</span>
                    <span :class="style1">{{getContent(item)}}</span>
                  </div>
                  <div class="first_moneys" v-else>
                    <span :class="style1">¥</span>
                    <span :class="style1">{{getTitle(item)}}</span>

                  </div>
                  <div class="info">
                    <div class="info-title" :class="style1">优惠券</div>
                    <div :class="style1" class="first_present" v-if="item.useCondition!=-1">购物满{{item.useCondition}}使用</div>
                    <div :class="style1" class="first_present" v-else>无门槛限制</div>
                  </div>
                </template> 
              </li>
            </template>
          </ul>
        </div>
        <div class="coupon_first componentCoupon" v-else>
          <img :src="currentComponentData.data.fakeList[0].fileUrl" alt="" style="width:100%;">
        </div>
      </template>
      <componentEmpty v-else :componentData="currentComponentData"></componentEmpty>
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
      displayList: [],
      maxShowNumber: 20, //优惠券最大显示数量
      loading: false
    }
  },
  computed: {
    listStyle() {
      return this.currentComponentData.data.listStyle || 1;
    },
    style1() {
      // 样式为4的时候，颜色边框是什么就是是什么颜色否则走最外层默认定义的白色字体。同时当颜色为第三种的时候（白底），颜色为红色
      return [
        this.currentComponentData.data.couponStyle === 3 && this.listStyle !== 3 ? "col_" + this.currentComponentData.data.couponColor : "",
        this.currentComponentData.data.couponColor === 4 ? "col_1" : ""
      ];
    },
    style2() {
      // 样式为4的时候，颜色边框是什么就是是什么颜色否则走最外层默认定义的白色字体。同时当颜色为第三种的时候字体为灰色。
      return [
        this.currentComponentData.data.couponStyle === 3 ? "col_" + this.currentComponentData.data.couponColor : "",
        this.currentComponentData.data.couponColor === 4 ? "col_6" : ""
      ];
    },
    imgs() {
      return {
        backgroundImage:
          "url(" +
          require(`@/assets/images/shop/coupon/listStyle${this.listStyle}/style${this.currentComponentData.data.couponStyle}-color${this.currentComponentData.data.couponColor}.png`) +
          ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      }
    },
    imgs1() {
      return {
        backgroundImage:
          "url(" +
          require(`@/assets/images/shop/coupon/listStyle${this.listStyle}/over-style${this.currentComponentData.data.couponStyle}.png`) +
          ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      }
    }
  },
  watch: {
    /* 监听添加类型，自动获取状态则拉取一下数据 */
    'currentComponentData.data.addType'(newValue, oldValue) {
      if(newValue === oldValue) {
        return;
      }
      if(newValue == 2) {
        this.displayList = [];
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
      if(parseFloat(newValue) == parseFloat(oldValue)) {
          return;
      }
      this.fetch();
    },
    /* 监听隐藏已抢完券 */
    'currentComponentData.data.hideScrambled'(newValue, oldValue) {
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
                  couponType: 0,
                  limitedQuantity: this.maxShowNumber
                };
              }else {
                params = {
                  couponType: 0,
                  limitedQuantity: componentData.showNumber === '' ? this.maxShowNumber : componentData.showNumber
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
                this.dataLoaded = true;
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
                this.dataLoaded = true;
            }).catch((error)=>{
                console.error(error);
                this.displayList = [];
                this.loading = false;
                this.dataLoaded = true;
            });
        }
    },

      /* 创建数据 */
    createList(datas) {
      this.displayList = datas;
    },

    /* 获取标题 */
    getTitle(item) {
      return item.useType==0?item.useTypeFullcut:(item.useTypeDiscount * 10).toFixed(1);
    },

    /* 获取内容 */
    getContent(item) {
      return item.useType==0?'元':'折';
    },

    /* 检查真数据 */
    checkRealData(newValue) {
      this.hasRealData = !!newValue.length;
      this.upadteComponentData();
    },

    /* 检查假数据 */
    checkFakeData(newValue) {
      this.hasFakeData = false;
        if(newValue && newValue.length) {
          this.hasFakeData = true;
        }
      this.upadteComponentData();
    }
  }
}
</script>

<style lang="scss" scoped>
.componentCoupon {
  .coupon_first {
    & > ul {
      display: flex;
      padding: 0 10px 10px 10px;
      & > li {
        height: 92px;
        margin-top:10px;
        text-align: center;
        & > .first_money {
          padding-top: 17px;
          & > span:first-child {
            font-size: 30px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
          }
          & > span:last-child {
            font-size: 12px;
            color: rgba(255, 255, 255, 1);
          }
        }
        & > .first_present {
          padding-top: 7.5px;
          font-size: 12px;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
  .list1 {
    overflow-x: scroll;
     & > li {
       flex: 0 0 138px;
       background-size: 128px 100% !important;
       & > .first_money {
         padding-right: 10px;
       }
       & > .first_present {
         padding-right: 10px;
       }
     }
  }
  .list2 {
    padding-right: 0 !important;
    flex-wrap: wrap;
    & > li {
      width: calc(33.33333% - 10px);
      margin-right: 10px !important;
      & > .first_money {
        & > span:first-child {
          font-size: 28px !important;
        }
      }
    }
  }
  .list3 {
    flex-wrap: wrap;
    & > li {
      width: 100%;
      & > .first_money {
        float: left;
        margin-left: 34px;
        padding-top: 16px;
        & > span:first-child {
            font-size: 54px !important;
        }
      }
      & > .first_moneys {
        float: left;
        margin-left: 34px;
        padding-top: 16px;
        & > span:first-child {
            font-size: 20px !important;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
        }
        & > span:last-child {
            font-size: 54px !important;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
        }
      }
      & > .info {
        float: left;
        text-align: left;
        margin-left: 20px;
        .info-title {
          padding-top: 30px;
          padding-bottom: 3px;
          font-size: 16px;
          font-weight:500;
          color:rgba(255,255,255,1);
        }
        .first_present {
          color:rgba(255,255,255,1);
        }
      }
    }
  }
  .list3.couponStyle4 {
    .first_moneys {
      width: 130px;
      margin: 0;
      text-align: center;
    }
    .info {
      width: 185px;
      margin: 0;
      text-align: center;
      .info-title {
        padding-top: 16px;
      }
    }
  }
  .col_1 {
    color: #ff6666 !important;
  }
  .col_2 {
    color: #2A9F3F !important;
  }
  .col_3 {
    color: #F18754 !important;
  }
  .col_4 {
    color: #FF6666 !important;
  }
  .col_5 {
    color: #000 !important;
  }
  .col_6 {
    color: #D3D2D3 !important;
  }
  .list-received {
    .first_money span, .first_moneys span, .info-title, .first_present {
      color: #fff !important;
    }
  }
  .list1.couponStyle3,.list2.couponStyle3 {
    .list-received {
      .first_money span, .first_moneys span, .info-title, .first_present {
        color: #D3D2D3 !important;
      }
    }
  }
}
</style>
