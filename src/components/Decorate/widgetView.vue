<template>
   <div class="module widget" :style="bodyHeight">
      <div class="block" v-for="(item, key) of widgetList" :key="key">
        <!-- 隐藏的控件不显示 -->
        <template v-if="key != 'hiddenWidget'">
          <div class="widget-title">{{item.title}}</div>
          <div class="widget-list">
            <ul class="tile-list n4">
              <li v-for="(item2, key2) of item.list" :key="key2" @click="addComponent(item2)">
                <i :class="item2.iconClass"></i>
                <p>{{item2.title}}</p>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
</template>

<script>
import widget from '@/system/constant/widget';
import uuid from 'uuid/v4';
export default {
  name: 'widgetView',
  components: {},
  data () {
    return {
     widgetList: widget.widgetList,
     bodyHeight: {}
    }
  },
  created() {
  },
  mounted() {
    this.bodyHeight = {
      height: document.body.clientHeight - 80 + 'px'
    }
  },
  computed: {
    currentComponentId() {
      return this.$store.getters.currentComponentId;
    }
  },
  methods: {

    /* 选中控件 */
    addComponent(item) {
      const id = uuid();
      this.$store.commit('addComponent', Object.assign(item, {
        id,
        isBase: false,
        hidden: false,
      }));
    }
  }
}
</script>

<style lang="scss" scoped>
  .widget{
    width: 320px;
    height: 835px;
    overflow-y: auto;
    .widget-title{
      height:40px;
      line-height:22px;
      padding:10px 20px;
      box-sizing: border-box;
      background:rgba(230,228,255,1);
    }
    .widget-list{
      padding:30px 20px;
      ul{
        li{
          display:flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          i{
            width:30px;
            height:30px;
            &{
              background:url('../../assets/images/shop/editor/fuwenben.png') no-repeat 0 0;
            }
            &.goods{
              background:url('../../assets/images/shop/editor/shangpin.png') no-repeat 0 0;
            }
            &.goods-group{
              background:url('../../assets/images/shop/editor/shangpinfenzu.png') no-repeat 0 0;
            }
            &.article-ad{
              background:url('../../assets/images/shop/editor/tuwenguanggao.png') no-repeat 0 0;
            }
            &.cube{
              background:url('../../assets/images/shop/editor/mofang.png') no-repeat 0 0;
            }
            &.article-nav{
              background:url('../../assets/images/shop/editor/tuwendaohang.png') no-repeat 0 0;
            }
            &.text{
              background:url('../../assets/images/shop/editor/wenben.png') no-repeat 0 0;
            }
            &.title{
              background:url('../../assets/images/shop/editor/biaoti.png') no-repeat 0 0;
            }

            &.coupon{
              background:url('../../assets/images/shop/editor/youhuiquanzu.png') no-repeat 0 0;
            }
            &.multi-person{
              background:url('../../assets/images/shop/editor/duorenpintuan.png') no-repeat 0 0;
            }
            &.second-kill{
              background:url('../../assets/images/shop/editor/miaoshazu.png') no-repeat 0 0;
            }
            &.discount{
              background:url('../../assets/images/shop/editor/xianshizhekou.png') no-repeat 0 0;
            }
            &.discount-package{
              background:url('../../assets/images/shop/editor/youhuitaocan.png') no-repeat 0 0;
            }
            &.full-reduction{
              background:url('../../assets/images/shop/editor/manjianmanzhe.png') no-repeat 0 0;
            }
            &.nyuan{
              background:url('../../assets/images/shop/editor/NyuanNjian.png') no-repeat 0 0;
            }

            &.shop-info{
              background:url('../../assets/images/shop/editor/dianpuxinxi.png') no-repeat 0 0;
            }
            &.enter-shop{
              background:url('../../assets/images/shop/editor/jinrudianpu.png') no-repeat 0 0;
            }
            &.goods-search{
              background:url('../../assets/images/shop/editor/shangpinsousuo.png') no-repeat 0 0;
            }
            &.notice{
              background:url('../../assets/images/shop/editor/gonggao.png') no-repeat 0 0;
            }
            &.help-line{
              background:url('../../assets/images/shop/editor/fuzhuxian.png') no-repeat 0 0;
            }
            &.video{
              background:url('../../assets/images/shop/editor/shipin.png') no-repeat 0 0;
            }
            &.help-blank{
              background:url('../../assets/images/shop/editor/fuzhukongbai.png') no-repeat 0 0;
            }
            &.buy-notice{
              background:url('../../assets/images/shop/editor/goumaigonggao.png') no-repeat 0 0;
            }
          }
          p{
            color:rgba(58,64,72,1);
            margin-top:10px;
          }
        }
      }
    }
  }
</style>
