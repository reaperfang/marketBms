<template>
  <!-- 优惠券 -->
  <div class="componentCoupon" v-if="currentComponentData && currentComponentData.data" v-loading="loading">
    <!-- 样式一 -->
    <div class="coupon_first">
       <ul>
        <!-- status:true时候是已领取,hideScrambled:false, -->
        <template v-for="(item, key) in list">
          <li v-if="!(currentComponentData.hideScrambled==true&&item.receiveType!=1&&item.receiveType!=8)" :style="item.status=='true'?imgs1:imgs " :key="key" @click="openCouponLayer(item)">
            <div class="first_money">
              <span :class="style1">{{item.useType==0?item.useTypeFullcut:(item.useTypeDiscount * 10).toFixed(1)}}</span>
              <span :class="style1">{{item.useType==0?'元':'折'}}</span>
            </div>
            <div :class="style2" class="first_present" v-if="item.useCondition!=-1">满{{item.useCondition}}元可使用</div>
          </li>
          <!-- <li v-else-if="item.status=='false'" :style="item.status=='true'?imgs1:imgs " :key="key">
            <div class="first_money">
              <span :class="style1">{{item.useType==0?item.useTypeFullcut:item.useTypeDiscount * 10}}</span>
              <span :class="style1">{{item.useType==0?'元':'折'}}</span>
            </div>
            <div :class="style2" class="first_present" v-if="item.useCondition!=-1">满{{item.useCondition}}元可使用</div>
          </li> -->
        </template>
        <!-- <template  v-for="(item, key) in list">
          <li
            v-if="currentComponentData.data.hideScrambled===false"
            :style="item.status===2?imgs1:imgs "
            :key="key"
            >
            <div class="first_money">
              <span :class="style1">{{item.useType === 0 ? Number(item.useTypeFullcut).toFixed(2) : ( Number(item.useTypeDiscount)  * 10).toFixed(1)}}
                {{item.useType === 0 ? '元' : '折'}}</span>
              <span :class="style1"></span>
            </div>
            <div :class="style2" class="first_present">
              <span v-if="item.useCondition > -1">
                满{{ Number(item.useCondition).toFixed(2)}},减{{ Number(item.useTypeFullcut).toFixed(2)}}
              </span>
              <span v-else>
                减{{ Number(item.useTypeFullcut).toFixed(2)}}
              </span>
            </div>
          </li>
          <li
            v-else-if="currentComponentData.data.hideScrambled===true && (item.status=== 0 || item.status=== 1)"
            :style="item.status===2?imgs1:imgs "
            :key="key"
            >
            <div class="first_money">
              <span :class="style1">{{item.useType === 0 ?  Number(item.useTypeFullcut).toFixed(2) : ( Number(item.useTypeDiscount)  * 10).toFixed(1)}}
                {{item.useType === 0 ? '元' : '折'}}</span>
              <span :class="style1"></span>
            </div>
            <div :class="style2" class="first_present">
              <span v-if="item.useCondition > -1">
                满{{ Number(item.useCondition).toFixed(2)}},减{{ Number(item.useTypeFullcut).toFixed(2)}}
              </span>
              <span v-else>
                减{{ Number(item.useTypeFullcut).toFixed(2)}}
              </span>
            </div>
          </li> -->
          <!-- <li :style="imgs">
            <div class="first_money">
              <span
                :class="[currentComponentData.data.couponStyle===3?'col_'+currentComponentData.data.couponColor:'',currentComponentData.data.couponColor===3?'col_1':'']"
              >100.01</span>
              <span
                :class="[currentComponentData.data.couponStyle===3?'col_'+currentComponentData.data.couponColor:'',currentComponentData.data.couponColor===3?'col_1':'']"
              >元</span>
            </div>
            <div
              :class="[currentComponentData.data.couponStyle===3?'col_'+currentComponentData.data.couponColor:'',currentComponentData.data.couponColor===3?'col_6':'']"
              class="first_present"
            >无门开使用</div>
          </li>-->
        <!-- </template> -->
      </ul>
    </div>
  </div>
</template>



<script>
import componentMixin from '../mixins/mixinComps';
export default {
  name: 'componentCoupon',
  mixins:[componentMixin],
  components: {},
  data () {
    return {
      list: [],
      loading: false
    }
  },
  created() {
    this.fetch();
    this._globalEvent.$on('fetchCoupon', (componentData, componentId) => {
      if(this.currentComponentId === componentId) {
        this.fetch(componentData);
      }
    });
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
    }
  },
  watch: {
    /* 监听添加类型，自动获取状态则拉取一下数据 */
    'currentComponentData.data.addType'(newValue) {
      if(newValue == 2) {
        this.fetch();
      }else{
        this.list = [];
        this.fetch();
      }
    },

    /* 监听显示个数类型 */
    'currentComponentData.data.couponNumberType'(newValue) {
      this.fetch();
    },

    /* 监听显示个数 */
    'currentComponentData.data.showNumber'(newValue) {
      this.fetch();
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
                this.list = [];
                return;
              }
            }

            this.loading = true;
            this.list = [];
            this._apis.shop.getCouponListByIds(params).then((response)=>{
                this.createList(response);
                this.loading = false;
            }).catch((error)=>{
                // this.$notify.error({
                //     title: '错误',
                //     message: error
                // });
                console.error(error);
                this.list = [];
                this.loading = false;
            });
        }
    },

      /* 创建数据 */
    createList(datas) {
       this.list = datas;
    },
  },
  beforeDestroy() {
      //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
      this._globalEvent.$off('fetchCoupon');
  },
}
</script>

<style lang="scss" scoped>
.componentCoupon {
  // background: #f1f1f1;
  .coupon_first {
    & > ul {
      display: -webkit-box;
      overflow-x: scroll;
      padding: 10px 15px;
      border-radius: 5px;
      margin-bottom: 10px;
      margin: 10px;
      box-shadow: 0px 0px 9px rgba(0,0,0,0.1);
      & > li {
        width: 128px;
        height: 92px;
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
			transform: scale(0.75);
            color: rgba(255, 255, 255, 1);
          }
        }
        & > .first_present {
          padding-top: 8px;
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
