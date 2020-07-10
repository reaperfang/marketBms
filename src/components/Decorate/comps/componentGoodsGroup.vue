<template>
<!-- 组件-商品分类 -->
    <div class="component_wrapper" v-loading="loading" :style="{cursor: dragable ? 'pointer' : 'text'}">
      <div class="componentGoodsGroup" :class="{showTemplate:showTemplate!=1}" id="componentGoodsGroup" v-if="currentComponentData && currentComponentData.data">
          <template v-if="hasRealData || hasFakeData">
            <template v-if="hasRealData">
              <div class="componentGoodsGroup_tab" id="componentGoodsGroup_tab" :class="'menuStyle'+menuStyle" :style="{width:componentGoodsGroup_tabWidth}">


                <!-- 原来的 -->
                <!-- <div class="scroll_wrapper">
                  <div class="scroll_inner clearfix" ref="scrollContent">
                    <p :class="{active:activeGoodId==''&&showAllGroup==1}" v-if="showAllGroup==1" @click="currentCatagory=null;getIdData('')">全部</p>
                    <p v-for="(item,key) of displayList" :class="{active:activeGoodId==item.id}" :key="key" 
                    @click="currentCatagory=item;getIdData(item.id)">{{item.name}}</p>
                  </div>
                </div> -->
                <!-- 原来的 -->


                  <template v-if="menuStyle==1">
                    <p :class="{active:activeGoodId=='all'}" v-if="showAllGroup==1" @click="currentCatagory=null;selectCatagory('all')" :style="{color:activeGoodId=='all'?color1:''}">
                        全部
                        <font class="activeLine" :style="{background:color1}"></font>
                    </p>
                  </template>
                  <template v-else-if="menuStyle==2">
                    <p :class="{active:activeGoodId=='all'}" v-if="showAllGroup==1" @click="currentCatagory=null;selectCatagory('all')" :style="{background:activeGoodId=='all'?color1:''}">
                        全部
                    </p>
                  </template>
                  <template v-else-if="menuStyle==3">
                    <p :class="{active:activeGoodId=='all'}" v-if="showAllGroup==1" @click="currentCatagory=null;selectCatagory('all')" :style="{background:activeGoodId=='all'?color1:''}">
                        全部
                        <font class="activeLine" v-if="showTemplate!=1" :style="{borderLeft:activeGoodId=='all'?'6px solid '+ color1:''}"></font>
                        <font class="activeLine" v-else :style="{borderTop:activeGoodId=='all'?'6px solid '+ color1:''}"></font>
                    </p>
                  </template>

                  <template v-if="menuStyle==1">
                    <p v-for="(item,key) of displayList" :class="{active:activeGoodId==item.id}" :key="key" @click="currentCatagory=item;selectCatagory(item.id)" :style="{color:activeGoodId==item.id?color1:''}">
                        {{item.name}}
                        <font class="activeLine" :style="{background:color1}"></font>
                    </p>
                  </template>
                  <template v-else-if="menuStyle==2">
                    <p v-for="(item,key) of displayList" :class="{active:activeGoodId==item.id}" :key="key" @click="currentCatagory=item;selectCatagory(item.id)" :style="{background:activeGoodId==item.id?color1:''}">
                        {{item.name}}
                    </p>
                  </template>
                  <template v-else-if="menuStyle==3">
                    <p v-for="(item,key) of displayList" :class="{active:activeGoodId==item.id}" :key="key" @click="currentCatagory=item;selectCatagory(item.id)" :style="{background:activeGoodId==item.id?color1:''}">
                        {{item.name}}
                        <font class="activeLine" v-if="showTemplate!=1" :style="{borderLeft:activeGoodId==item.id?'6px solid '+ color1:''}"></font>
                        <font class="activeLine" v-else :style="{borderTop:activeGoodId==item.id?'6px solid '+ color1:''}"></font>
                    </p>
                  </template>
                </div>
              <div class="componentGoodsGroup_content">
                  <componentGoods :data='currentComponentData' :currentCatagoryId="currentCatagory? currentCatagory.id : showAllGroup === 2 ? displayList[0] && displayList[0].id : 'all'"></componentGoods>
              </div> 
            </template>
            <div class="componentGoodsGroup_tab" id="componentGoodsGroup_tab" :class="'menuStyle'+menuStyle" :style="{width:componentGoodsGroup_tabWidth}" v-else>
              <img :src="currentComponentData.data.fakeList[listStyle - 1].fileUrl" alt="" style="width:100%;">
            </div>
          </template>
          <componentEmpty v-else :componentData="currentComponentData"></componentEmpty>
      </div>
      <componentEmpty v-else :componentData="currentComponentData"></componentEmpty>
    </div>
</template>
<script>
import componentGoods from './componentGoods';
import mixinCompsData from '../mixins/mixinCompsData';
export default {
    name:"componentGoodsGroup",
    mixins:[mixinCompsData],
    data() {
      return {
        allLoaded: false,  //因为有异步数据，所以初始化加载状态是false
        // 商品列表
        componentGoodsItemData: {},
        // 商品分类列表
        displayList: [],
        // 样式属性
        listStyle: "",
        showAllGroup: "",
        showTemplate: "",
        menuStyle: "",
        menuPosition: "",
        componentGoodsGroup_tabWidth: "",
        currentCatagory: null,
        loading: false,
        // 当前分类id
        activeGoodId:'all',
        // 商品请求分类id集合
        allGoodClassId:[],
        allGoodClassId1:[]
      }
    },
    components: {
      componentGoods
    },
    created() {
      this.$store.dispatch('getShopStyle');
    },
    watch: {
      data: {
        handler(newValue) {
          this.calcScroll();
          this.decoration();
        },
        deep: true
      },
      currentComponentData(){
         this.calcScroll();
         this.decoration();
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
    computed: {
        colorStyle() {
          return this.$store.getters.colorStyle || {colors:[]};
        },
        color1(){
            return this.colorStyle.colors && this.colorStyle.colors[0]
        },
        color2(){
            return this.colorStyle.colors && this.colorStyle.colors[1]
        },
        color3(){
            return this.colorStyle.colors && this.colorStyle.colors[2]
        }

        
    },
    // mounted: function() {
    //   window.addEventListener("scroll", this.handleScroll, true);
    // },
    methods:{
        decoration(){
            // 把数据传给商品列表
            if(!this.currentComponentData || !this.currentComponentData.data) {
              return;
            }
            this.listStyle = this.currentComponentData.data.listStyle;
            this.goodsGroups = this.currentComponentData.data.goodsGroups;
            this.showAllGroup = this.currentComponentData.data.showAllGroup;
            this.showTemplate = this.currentComponentData.data.showTemplate;
            if(this.showTemplate!=1){
                this.componentGoodsGroup_tabWidth = 100
            }
            this.menuStyle = this.currentComponentData.data.menuStyle;
            this.menuPosition = this.currentComponentData.data.menuPosition;
        },

        //根据ids拉取数据
        fetch(componentData = this.currentComponentData.data) {
          const _self = this;
          if(componentData) {
              if(componentData.ids) {
                let ids = [];
                for(let item in componentData.ids) {
                  ids.push(item);
                }
                if(!ids.length) {
                  this.displayList = [];
                  this.syncToOther('goods', componentData);
                  return;
                }
                this.loading = true;
                this._apis.goods.fetchCategoryList({ids}).then((response)=>{
                    this.displayList = response;
                    if(response && response[0] && _self.currentComponentData.data.showAllGroup == 2) {
                      _self.activeGoodId = response[0].id;
                    }else {
                      _self.activeGoodId = 'all';
                    }
                    this.calcScroll();
                    this.syncToOther('goods', componentData);
                    this.loading = false;
                    this.allLoaded = true;
                }).catch((error)=>{
                    console.error(error);
                    this.displayList = [];
                    this.syncToOther('goods', componentData);
                    this.loading = false;
                });
          }
          }
        },
        // getIdData(id){
        //   this.activeGoodId = id;
        //   if(id!=''){
        //     this.allGoodClassId = [];  
        //     this.allGoodClassId.push(id);
        //   }
        //   else{
        //     this.allGoodClassId = this.allGoodClassId1;
        //   }
        // },

        /* 选择当前分类 */
        selectCatagory(id) {
          this.activeGoodId = id;
          this.currentCatagoryId = id;
        },


        // handleScroll(){
        //     let componentGoodsGroupHeight = document.getElementById("componentGoodsGroup").clientHeight;  
        //     // let scrollObj = document.getElementById("componentGoodsGroup_tab");
        //     // let scrollTop = scrollObj.scrollTop; 
        //     // let scrollHeight = scrollObj.scrollHeight;
        //     // if(scrollTop+clientHeight == scrollHeight){
                
        //     // }  
        // }

        /* 计算横向滚动宽度 */
        calcScroll() {
          this.$nextTick(()=>{
            if(this.$refs.scrollContent && this.showTemplate == 1) {
              let allPs = this.$refs.scrollContent.querySelectorAll('p');
              let width = 0;
              for(let i=0; i< allPs.length; i++) {
                width += allPs[i].clientWidth;
              }
              this.$refs.scrollContent.style.width = width + 85 + "px";
            }else{
              if(this.$refs.scrollContent) {
                this.$refs.scrollContent.style.width ='auto'
              }
            }
          })
        },

        /* 检查真数据 */
        checkRealData(newValue) {
            if(newValue) {
              if(Object.prototype.toString.call(newValue) === '[object Object]') {
                this.hasRealData = !!Object.keys(newValue).length;
              }else if(Array.isArray(newValue)) {
                this.hasRealData = !!newValue.length;
              }
            }else {
              this.hasRealData = false;
            }
            this.upadteComponentData();
        },

        /* 检查假数据 */
        checkFakeData(newValue) {
            this.hasFakeData = false;
            for(let item of newValue) {
                if(item && Object.prototype.toString.call(item) === '[object Object]' && !!Object.keys(item).length) {
                  this.hasFakeData = true;
                  break;
                }else if(item && Array.isArray(item) && !!item.length) {
                  this.hasFakeData = true;
                  break;
                }else if(item && item.length) {
                    this.hasFakeData = true;
                    break;
                }
            }
            this.upadteComponentData();
        }

    }
}
</script>
<style lang="scss" scoped>
.componentGoodsGroup.showTemplate{
    .componentGoodsGroup_tab{
        float:left;
        width:100px;
        flex-direction:column;
        overflow-x:visible;
        p{
            width:100%;
            margin:0;
            white-space:normal;
        }
    }
    .componentGoodsGroup_tab.menuStyle1 {
      padding: 0;
      // border-right: 1px solid #eee;
      p {
        width: 100%;
        color:rgba(102,102,102,1);
        line-height:20px;
        @extend .flexCenterMiddle;
        height:44px;
      }
      p.active {
        color:#fff;
        .activeLine{
          right: 0;
          height: 44px;
          width: 3px;
          top: 50%;
          margin-top: -22px;
          margin-left: auto;
          left: auto;
          display:block;
          background:#fc3d42;
        }
      }
    }
    .componentGoodsGroup_tab.menuStyle2 {
        padding: 0 10px;
        // border-right: 1px solid #eee;
        p {
          width: 100%;
          margin-top: 10px;
          background:#efefef;
          color:rgba(102,102,102,1);
          &:first-child {
            margin-top: 0;
          }
        }
        p.active{
          background:#fc3d42;
        }
    }
    .componentGoodsGroup_tab.menuStyle3 {
        p {
          width: 100%;
          margin-top: 10px;
          background:#efefef;
          &:first-child {
            margin-top: 0;
          }
        }
        p.active{
          background:#fc3d42;
          .activeLine {
            position: absolute;
            right: -12px;
            left: auto;
            top:50%;
            margin-top: -6px;
            width: 12px;
            height: 6px;
            border: 6px solid transparent;
            border-right: 0;
            border-left: 6px solid #fc3d42;
            display:block;
          }
        }
    }
    .componentGoodsGroup_content{
      /deep/.componentGoods.listStyle4{
        ul{
            li.goodsRatio1{
                .text{
                    .title{
                        height:17px;
                        @include lineClamp(1);
                        margin-top:2.5px;
                    }
                    .fTitle{
                        margin-top:5px;
                    }
                    .priceLine{
                        margin-top:10px;
                    }
                }
            }
            li.goodsRatio2{
                .text{
                    .title{
                        height:17px;
                        @include lineClamp(1);
                        margin-top:2.5px;
                    }
                    .fTitle{
                        margin-top:7.5px;
                    }
                    .priceLine{
                        margin-top:10px;
                    }
                }
            }
            li.goodsRatio3{
                .text{
                    .title{
                        height:34px;
                        @include lineClamp(2);
                    }
                    .fTitle{
                        margin-top:10px;
                    }
                    .priceLine{
                        margin-top:18px;
                    }
                }
            }
            li.goodsRatio4{
                .text{
                    .title{
                        margin-top:0;
                        height:17px;
                        @include lineClamp(1);
                    }
                    .fTitle{
                        margin-top:4px;
                    }
                    .priceLine{
                        margin-top:1.5px;
                    }
                }
            }  
        }
      }
    }
      
}
.componentGoodsGroup {
  overflow: hidden;
  background:#fff;
    .componentGoodsGroup_tab {
        padding: 0 5px;
        display: flex;
        display: -webkit-box;
        overflow-x: scroll;
        p {
            font-size: 14px;
            padding: 0 10px;
            text-align: center;
            position: relative;
            margin: 0 5px;
            white-space:nowrap;
            .activeLine{
              display:none;
            }
        }
    }
    .componentGoodsGroup_tab.menuStyle1 {
        background: #fff;
        p {
          color: rgba(102,102,102,1);
          line-height: 44px;
          min-width: 70px;
        }
        p.active {
          color: #fc3d42;
          .activeLine {
            content: "";
            width: 50px;
            height: 3px;
            background: #fc3d42;
            position: absolute;
            left: 50%;
            margin-left: -25px;
            bottom: 0;
            display:block;
          }
        }
    }
    .componentGoodsGroup_tab.menuStyle1.fixed ~ .componentGoodsGroup_content {
        padding-top: 44px;
    }
    .componentGoodsGroup_tab.menuStyle2 {
        padding-top: 9px;
        padding-bottom: 9px;
        p {
          background: rgba(236,236,236,1);
          font-weight:400;
          color:rgba(102,102,102,1);
          min-width: 60px;
          line-height: 34px;
          @include borderRadius(50px);
        }
        p.active {
          background: #efefef;
          color: #fff !important;
        }
    }
    .componentGoodsGroup_tab.menuStyle2.fixed ~ .componentGoodsGroup_content {
        padding-top: 52px;
    }
    .componentGoodsGroup_tab.menuStyle3 {
        padding-top: 9px;
        padding-bottom: 9px;
        p {
          color:rgba(102,102,102,1);
          min-width: 60px;
          background: #ececec;
          line-height: 33px;
        }
        p.active {
          background: #fc3d42;
          color: #fff;
          .activeLine {
            content: "";
            position: absolute;
            bottom: -6px;
            left: 50%;
            margin-left: -6px;
            width: 12px;
            height: 6px;
            border: 6px solid transparent;
            border-bottom: 0;
            border-top: 6px solid #fc3d42;
            display:block;
          }
        }
    }
    .componentGoodsGroup_tab.menuStyle3.fixed ~ .componentGoodsGroup_content {
        padding-top: 51px;
    }
    .componentGoodsGroup_content {
        overflow: hidden;
        background: rgb(247,247,247);
    }
}
</style>
