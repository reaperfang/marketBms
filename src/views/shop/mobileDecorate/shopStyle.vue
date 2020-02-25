<template>
  <div class="shop_style_wrapper">
    <h3>风格配色<span class="tips">设置成功后将替换小程序和公众号现有风格（全部页面）</span></h3>
    <div class="style_btns">
      <span>选择店铺整体配色： </span>
      <ul class="style_list" ref="styleList">
        <template v-for="(item, key) of styleList">
          <li v-if="!item.hidden" :key="key" class="cell-item" @click="selectedStyle($event, item)">
            <div class="style_block" v-for="(item2, key2) of item.colors" :key="key2" :style="{'backgroundColor': item2}"></div>
          </li>
        </template>
      </ul>
    </div>

    <ul class="demo_list tile-list n3" v-if="selectedItem" v-calcHeight="160+78+40+22">
      <li>
        <img :src="require('@/assets/images/shop/style/goodsDetail'+ selectedItem.type +'.png')" alt="">
        <p>商品详情</p>
      </li>
      <li>
        <img :src="require('@/assets/images/shop/style/shoppingCar'+ selectedItem.type +'.png')" alt="">
        <p>购物车</p>
      </li>
      <li>
        <img :src="require('@/assets/images/shop/style/orderDetail'+ selectedItem.type +'.png')" alt="">
        <p>订单详情</p>
      </li>
    </ul>

    <div class="confirm_btn">
      <el-button type="primary" @click="submit" :loading="submitLoadinig">保  存</el-button>
    </div>
  </div>
</template>

<script>
import utils from '@/utils';
export default {
  name: 'shopStyle',
  components: {},
  data () {
    return {
      submitLoadinig: false,
      styleList: [
        {
          type: 1,
          mainColor:'',
          colors: ['rgba(251,68,67,1)', 'rgba(253,135,84,1)', 'rgba(255,255,255,1)'],
        },
        {
          type: 2,
          colors: ['rgba(251,95,39,1)', 'rgba(253,146,37,1)', 'rgba(255,255,255,1)'],
        },
        {
          type: 3,
          colors: ['rgba(252,87,124,1)', 'rgba(254,230,232,1)', 'rgba(255,255,255,1)'],
        },
        {
          type: 4,
          colors: ['rgba(252,70,75,1)', 'rgba(85,85,85,1)', 'rgba(255,255,255,1)'],
        },
        {
          type: 5,
          colors: ['rgba(251,197,44,1)', 'rgba(29,38,46,1)', 'rgba(255,255,255,1)'],
        },
        {
          type: 6,
          colors: ['rgba(102,196,170,1)', 'rgba(221,242,236,1)', 'rgba(255,255,255,1)'],
          hidden: true
        },
        {
          type: 7,
          colors: ['rgba(8,187,7,1)', 'rgba(56,56,56,1)', 'rgba(255,255,255,1)'],
        },
        {
          type: 8,
          colors: ['rgba(105,192,112,1)', 'rgba(225,245,226,1)', 'rgba(255,255,255,1)'],
          hidden: true
        },
        {
          type: 9,
          colors: ['rgba(75,144,226,1)', 'rgba(218,233,249,1)', 'rgba(255,255,255,1)'],
          hidden: true
        },
        {
          type: 10,
          colors: ['rgba(195,167,105,1)', 'rgba(0,0,0,1)', 'rgba(255,255,255,1)'],
        },
        {
          type: 11,
          colors: ['rgba(51,51,51,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)'],
          hidden: true
        },
        {
          type: 12,
          colors: ['rgba(136,76,255,1)', 'rgba(199,171,255,1)', 'rgba(255,255,255,1)'],
        }, 
        {
          type: 13,
          colors: ['#03555C', '#D5A58B', 'rgba(255,255,255,1)'],
        }
      ],
      selectedItem: null  //当前选中的样式
    }
  },
  created() {
    this.$store.dispatch('getShopStyle');
  },
  computed: {
     colorStyle() {
      this.setSeletedItem(this.$store.getters.colorStyle);
      return this.$store.getters.colorStyle || {};
    },
  },
  watch: {
    colorStyle: {
      handler (newValue){
        this.setSeletedItem(newValue);
      },
      deep: true
    }
  },
  methods: {

    /* 设置选中风格 */
    setSeletedItem(item) {
      if(item && item.type){
        this.selectedItem = this.styleList[Number(item.type) - 1]
      }else{
        this.selectedItem = this.styleList[0];
      }
    },

    /* 选中风格 */
    selectedStyle(event, item) {
      this.selectedItem = item;
      this.$store.commit('setColorStyle', this.selectedItem);
      const styles = this.$refs.styleList.querySelectorAll('.cell-item');
      for(let dom of styles) {
        dom.className = 'cell-item';
      };
      event.currentTarget.className = 'cell-item style_active';
    },

    submit() {
      this.submitLoadinig = true;
      this._apis.shop.setShopStyle({colorStyle: utils.compileStr(JSON.stringify(this.selectedItem))}).then((response)=>{
         this.$notify({
          title: '成功',
          message: '设置成功！',
          type: 'success'
        });
        this.submitLoadinig = false;
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
        this.submitLoadinig = false;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.shop_style_wrapper{
  background:#fff;
  padding:20px;
  height: 100%;
  h3{
    margin-bottom:20px;
    .tips{
      font-size:14px;
      color:red;
      margin-left:20px;
    }
  }
  .style_btns{
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    span{
      color:rgba(68,67,75,1);
    }
    ul.style_list{
      display:flex;
      flex-direction: row;
      justify-content: flex-start;
      li{
        margin-right:20px;
        display:flex;
        flex-direction: row;
        justify-content: flex-start;
        cursor:pointer;
        border: 2px dashed transparent;
        &.style_active{
          border: 2px dashed $globalMainColor!important;
        }
        .style_block{
          width:18px;
          height:18px;
        }
      }
    }
  }
  ul.demo_list{
    margin-top:33px;
    overflow-y: auto;
    li{
      width: 252px;
      margin-right: 28px;
      img{
        border: 1px solid #e8e7e7;
        box-shadow: 5px 7px 17px rgba(0,0,0,0.1);
        width:100%;
      }
      p{
        margin-top:20px;
        text-align:center;
      }
    }
  }
  .confirm_btn{
    display:flex;
    flex-direction: row;
    justify-content: center;
    padding-bottom: 20px;
    padding-top: 20px;
  }
}
</style>
