<template>
<!-- 组件-商品分类 -->
    <div class="componentGoodsGroup" :class="{showTemplate:showTemplate!=1}" id="componentGoodsGroup" v-if="currentComponentData && currentComponentData.data" v-loading="loading">
      <template v-if="hasContent">
          <div class="componentGoodsGroup_tab" id="componentGoodsGroup_tab" :class="'menuStyle'+menuStyle" :style="{width:componentGoodsGroup_tabWidth}">
              <p :class="{active:activeGoodId==''&&showAllGroup==1}" v-if="showAllGroup==1" @click="currentCatagory=null;getIdData('')">全部</p>
              <p v-for="(item,key) of list" :class="{active:showAllGroup!=1&&key==0||activeGoodId==item.id}" :key="key" 
              @click="currentCatagory=item;getIdData(item.id)">{{item.name}}</p>
          </div>
          <div class="componentGoodsGroup_content">
              <componentGoods :data='currentComponentData' :currentCatagoryId="currentCatagory? currentCatagory.id : 'all'"></componentGoods>
          </div> 
      </template>
      <div v-else class="temp_block">
          <img class="empty_data_img" src="../../../assets/images/shop/emptyData.png" alt="">
      </div>
    </div>
</template>
<script>
import componentButton from './componentButton';
import componentGoods from './componentGoods';
import componentMixin from '../mixins/mixinComps';
export default {
    name:"componentGoodsGroup",
    mixins:[componentMixin],
    data() {
      return {
        allLoaded: false,  //因为有异步数据，所以初始化加载状态是false
        // 商品列表
        componentGoodsItemData: {},
        // 商品分类列表
        list: [],
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
        activeGoodId:'',
        // 商品请求分类id集合
        allGoodClassId:[],
        allGoodClassId1:[]
      }
    },
    components: {
      componentGoods
    },
    created() {
      this.fetch();
      this._globalEvent.$on('fetchGoodsGroup', (componentData, componentId) => {
        if(this.currentComponentId === componentId) {
          this.fetch(componentData);
        }
      });
    },
    mounted() {
        this.decoration();
    },
    watch: {
      data: {
        handler(newValue) {
          this.decoration();
        },
        deep: true
      },
      currentComponentData(){
         this.decoration();
      }
    },
    computed: {
        /* 检测是否有数据 */
        hasContent() {
            let value = false;
            if(this.list && this.list.length) {
               value = true;
            }
            return value;
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
          if(componentData) {
              if(componentData.ids) {
                let ids = [];
                for(let item in componentData.ids) {
                  ids.push(item);
                }
                if(!ids.length) {
                  this.list = [];
                  this._globalEvent.$emit('fetchGoods', componentData, this.currentComponentId);
                  return;
                }
                this.loading = true;
                this._apis.goods.fetchCategoryList({ids}).then((response)=>{
                    this.list = response;
                    this._globalEvent.$emit('fetchGoods', componentData, this.currentComponentId);
                    this.loading = false;
                    this.allLoaded = true;
                }).catch((error)=>{
                    // this.$notify.error({
                    //   title: '错误',
                    //   message: error
                    // });
                    console.error(error);
                    this.list = [];
                    this._globalEvent.$emit('fetchGoods', componentData, this.currentComponentId);
                    this.loading = false;
                });
          }
          }
        },
        getIdData(id){
          this.activeGoodId = id;
          if(id!=''){
            this.allGoodClassId = [];  
            this.allGoodClassId.push(id);
          }
          else{
            this.allGoodClassId = this.allGoodClassId1;
          }
        }

        // handleScroll(){
        //     let componentGoodsGroupHeight = document.getElementById("componentGoodsGroup").clientHeight;  
        //     // let scrollObj = document.getElementById("componentGoodsGroup_tab");
        //     // let scrollTop = scrollObj.scrollTop; 
        //     // let scrollHeight = scrollObj.scrollHeight;
        //     // if(scrollTop+clientHeight == scrollHeight){
                
        //     // }  
        // }

    },
    beforeDestroy() {
        //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
        this._globalEvent.$off('fetchGoodsGroup');
    },
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
        }
    }
    .componentGoodsGroup_tab.menuStyle1 {
      padding: 0;
      border-right: 1px solid #eee;
      p {
        width: 100%;
      }
      p.active {
          &:after {
            content:"";
            right: 0;
            height: 44px;
            width: 3px;
            top: 50%;
            margin-top: -22px;
            margin-left: auto;
            left: auto;
          }
      }
    }
    .componentGoodsGroup_tab.menuStyle2 {
        padding: 0 10px;
        border-right: 1px solid #eee;
        p {
          width: 100%;
          margin-top: 10px;
          &:first-child {
            margin-top: 0;
          }
        }
    }
    .componentGoodsGroup_tab.menuStyle3 {
        p {
          width: 100%;
          margin-top: 10px;
          &:first-child {
            margin-top: 0;
          }
        }
        p.active{
          &:after {
            content: "";
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
          }
        }
    }
    .componentGoodsGroup{
        overflow:hidden;
        background:#f7f7f7;
        .componentGoodsGroup_tab{
            padding:0 5px;
            display:flex;
            display:-webkit-box;
            overflow-x:scroll;
            p{
                font-size:14px;
                padding:0 10px;
                text-align:center;
                position:relative;
                margin:0 5px;
            }
        }
        p.active {
            &:after {
              content: "";
              position: absolute;
              right: -6px;
              left: auto;
              margin-left: auto;
              top: 50%;
              margin-top: -7px;
              width: 6px;
              height: 12px;
              border: 6px solid transparent;
              border-right: 0;
              border-left: 6px solid #fc3d42;
            }
        }
    }
}
.componentGoodsGroup {
  overflow: hidden;
  background: #f7f7f7;
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
        }
    }
    .componentGoodsGroup_tab.menuStyle1 {
        background: #fff;
        p {
          color: #333;
          line-height: 44px;
          min-width: 70px;
        }
        p.active {
          color: #fc3d42;
          &:after {
            content: "";
            width: 50px;
            height: 3px;
            background: #fc3d42;
            position: absolute;
            left: 50%;
            margin-left: -25px;
            bottom: 0;
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
          min-width: 60px;
          background: #ccc;
          color: #666;
          line-height: 34px;
          @include borderRadius(50px);
        }
        p.active {
          background: #fc3d42;
          color: #fff;
        }
    }
    .componentGoodsGroup_tab.menuStyle2.fixed ~ .componentGoodsGroup_content {
        padding-top: 52px;
    }
    .componentGoodsGroup_tab.menuStyle3 {
        padding-top: 9px;
        padding-bottom: 9px;
        p {
          min-width: 60px;
          background: #ececec;
          line-height: 33px;
        }
        p.active {
          background: #fc3d42;
          color: #fff;
          &:after {
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
          }
        }
    }
    .componentGoodsGroup_tab.menuStyle3.fixed ~ .componentGoodsGroup_content {
        padding-top: 51px;
    }
    .componentGoodsGroup_content {
        overflow: hidden;
    }
}
</style>
