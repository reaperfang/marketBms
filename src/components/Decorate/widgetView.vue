<template>
   <div class="module widget" v-calcHeight="widgetCalcHeight">
      <!-- 隐藏的控件不显示 -->
      <div v-if="key != 'hiddenWidget'" class="block" v-for="(item, key) of widgetList" :key="key">
        <template>
          <div class="widget-title">
            <span>{{item.title}}</span>
            <i @click="spreadWidget(key)" class="widget-title-icon" :class="{'icon-bottom': !item.spread, 'icon-top': item.spread}"></i>
          </div>
          <transition name="widget-transition" class="widget-transition">
              <div v-if="item.spread" class="widget-list">
                <ul class="tile-list n4">
                  <li v-for="(item2, key2) of item.list" :key="key2" @click="addComponent(item2)" draggable="true" @dragstart="dragAddComponent($event, item2)">
                    <template v-if="!item2.hideWidget">
                      <i :class="item2.iconClass"></i>
                      <p>{{item2.title}}</p>
                    </template>
                  </li>
                </ul>
              </div>
          </transition>
        </template>
      </div>
    </div>
</template>

<script>
import utils from '@/utils';
import widget from './config/widgetConfig';

export default {
  name: 'widgetView',
  props: {
    componentsConfig: {
      type: Object
    },
    widgetCalcHeight: {
      type: Number
    },
  },
  components: {},
  data () {
    return {
      widgetList: widget.widgetList
    }
  },
  created() {
    this.initConfig(this.componentsConfig);
  },
  mounted() {
    this.$emit('widgetPanelInited');
  },
  computed: {
    currentComponentId() {
      return this.$store.getters.currentComponentId;
    }, 
    basePropertyId() {
      return this.$store.getters.basePropertyId;
    },
    componentDataIds() {
      return this.$store.getters.componentDataIds;
    },
  },
  watch: {
    componentsConfig: {
      handler(newValue) {
        this.initConfig(newValue);
      },
      deep: true
    }
  },
  methods: {

    /* 初始化控件配置表 */
    initConfig(config) {
      let copyConfig = {...this.widgetList};
        for(let k in copyConfig) {
          for(let k2 =0; k2<copyConfig[k].list.length;k2++) {
            const type = copyConfig[k].list[k2].type;
            for(let k3 in config) {
              delete config[k3].type;  //禁止更改type，会导致渲染崩溃
              if(type === k3) {
                this.widgetList[k].list[k2] = Object.assign(copyConfig[k].list[k2], config[k3]);
              }
            }
          }
        }
    },

    /* 选中控件 */
    addComponent: utils.throttle(function(item) {
      const id = uuidv4();

      //当目前选中的是基础组件的时候，先强行选中最后一个组件再执行下文
      if(this.currentComponentId === this.basePropertyId) {
        this.$store.commit('setCurrentComponentId', this.componentDataIds[this.componentDataIds.length - 1]);
      }

      this.$store.commit('addComponent', {
        component: Object.assign(item, {id}),
        targetId: this.currentComponentId,
        after: true
      });

      
      //如果当前是最后一个组件，则直接定位到底部
      if(this.currentComponentId === this.componentDataIds[this.componentDataIds.length - 1]) {
        this.$nextTick(()=>{
          this._globalEvent.$emit('scrollToBottom');
        })
      }else{
        //组件添加自动滚动到组件位置
        let index = this.componentDataIds.indexOf(this.currentComponentId);
        if(index > 0) {
          index--;
        }
        let prev = this.componentDataIds[index];
        this._globalEvent.$emit('autoScrollToComponent', prev);
      }
    }, 300, true),

    /* 拖拽添加组件 */
    dragAddComponent(ev, item) {
      const id = uuidv4();
      ev.dataTransfer.setData("dragAddComponent", JSON.stringify(Object.assign(item, {id})));
    },
    spreadWidget(key) {
      this.widgetList[key].spread = !this.widgetList[key].spread
    }
  }
}
</script>

<style lang="scss" scoped>
  .widget{
    width: 210px;
    height: 835px;
    overflow-y: auto;
    background-color: #fff;
    padding: 25px 15px;
    .block {
      margin-bottom: 20px;
    }
    .widget-title{
      line-height:22px;
      box-sizing: border-box;
      margin-bottom: 16px;
      span {
        &:before {
            content: "";
            position: relative;
            display: inline-block;
            width: 2px;
            height: 12px;
            margin-right: 4px;
            top: 1px;
            border-radius: 2px;
            background: $globalMainColor;
        }
      }
      
      //background:rgba(230,228,255,1);
      .widget-title-icon {
        display: inline-block;
        width: 9px;
        height: 6px;
        margin-left: 2px;
        vertical-align: middle;        
      }
      .icon-top {
          background: url(~@/assets/images/shop/editor/top.png) no-repeat;
          background-size: 9px 6px;
      }
      .icon-bottom {
          background: url(~@/assets/images/shop/editor/bottom.png) no-repeat;
          background-size: 9px 6px;
      }
    }
    .widget-list{
      //margin-top: 16px;
      ul{
        &.n4 {
          li {
            width: 50%;
            margin-right: 0;
          }
        }
        li{
          display:flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
          cursor: pointer;
          i{
            width:40px;
            height:40px;
            background-size: 100% 100%!important;
            &{
              background:url('../../assets/images/shop/editor/widget/fuwenben.png') no-repeat 0 0;
            }
            &.goods{
              background:url('../../assets/images/shop/editor/widget/shangpin.png') no-repeat 0 0;
            }
            &.goods-group{
              background:url('../../assets/images/shop/editor/widget/shangpinfenzu.png') no-repeat 0 0;
            }
            &.article-ad{
              background:url('../../assets/images/shop/editor/widget/tuwenguanggao.png') no-repeat 0 0;
            }
            &.cube{
              background:url('../../assets/images/shop/editor/widget/mofang.png') no-repeat 0 0;
            }
            &.article-nav{
              background:url('../../assets/images/shop/editor/widget/tuwendaohang.png') no-repeat 0 0;
            }
            &.text{
              background:url('../../assets/images/shop/editor/widget/wenben.png') no-repeat 0 0;
            }
            &.title{
              background:url('../../assets/images/shop/editor/widget/biaoti.png') no-repeat 0 0;
            }

            &.coupon{
              background:url('../../assets/images/shop/editor/widget/youhuiquanzu.png') no-repeat 0 0;
            }
            &.multi-person{
              background:url('../../assets/images/shop/editor/widget/duorenpintuan.png') no-repeat 0 0;
            }
            &.second-kill{
              background:url('../../assets/images/shop/editor/widget/miaoshazu.png') no-repeat 0 0;
            }
            &.discount{
              background:url('../../assets/images/shop/editor/widget/xianshizhekou.png') no-repeat 0 0;
            }
            &.discount-package{
              background:url('../../assets/images/shop/editor/widget/youhuitaocan.png') no-repeat 0 0;
            }
            &.full-reduction{
              background:url('../../assets/images/shop/editor/widget/manjianmanzhe.png') no-repeat 0 0;
            }
            &.nyuan{
              background:url('../../assets/images/shop/editor/widget/NyuanNjian.png') no-repeat 0 0;
            }

            &.shop-info{
              background:url('../../assets/images/shop/editor/widget/dianpuxinxi.png') no-repeat 0 0;
            }
            &.enter-shop{
              background:url('../../assets/images/shop/editor/widget/jinrudianpu.png') no-repeat 0 0;
            }
            &.goods-search{
              background:url('../../assets/images/shop/editor/widget/shangpinsousuo.png') no-repeat 0 0;
            }
            &.notice{
              background:url('../../assets/images/shop/editor/widget/gonggao.png') no-repeat 0 0;
            }
            &.help-line{
              background:url('../../assets/images/shop/editor/widget/fuzhuxian.png') no-repeat 0 0;
            }
            &.video{
              background:url('../../assets/images/shop/editor/widget/shipin.png') no-repeat 0 0;
            }
            &.help-blank{
              background:url('../../assets/images/shop/editor/widget/fuzhukongbai.png') no-repeat 0 0;
            }
            &.buy-notice{
              background:url('../../assets/images/shop/editor/widget/goumaigonggao.png') no-repeat 0 0;
            }
            &.location{
              background:url('../../assets/images/shop/editor/widget/weizhixinxi.png') no-repeat 0 0;
            }
          }
          p{
            color:rgba(58,64,72,1);
            margin-top:8px;
          }
        }
      }
    }
  }
.widget-transition{ transition: all ease .2s; }
.widget-transition-enter-active { animation: widgetEnter .2s; overflow: hidden; }
.widget-transition-leave-active { animation: widgetLeave .2s ; overflow: hidden; }
.widget::-webkit-scrollbar {
  width: 6px!important;
}
::-webkit-scrollbar-thumb{
  background-color: #B6B5C8;
}
@keyframes widgetEnter {
  from { 
    height: 0;
  }
  to { 
    height: 272px;
  }
}
@keyframes widgetLeave {
  from { 
    height: 272px; 
  }
  to { 
    height: 0; 
  }
}
</style>
