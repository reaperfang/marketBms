<template>
  <!-- 购买公告 -->
  <div class="component_wrapper" v-loading="loading" :style="{cursor: dragable ? 'pointer' : 'text'}">
    <div class="componentBuyNotice" v-if="currentComponentData && currentComponentData.data">
      <template v-if="hasRealData || hasFakeData">
        <ul :style="{'backgroundColor':currentComponentData.data.backgroundColor}" v-if="hasRealData">
          <li class="ellipsis">
            <div class="nwwest-roll" id="nwwest-roll">
              <ul id="roll-ul" :style="{'color':currentComponentData.data.fontColor}">
                <li ref="rollul" v-for="(item, key) in displayList" :key="key" class="ellipsis" :class="{anim:animate===true}">
                  <img :src="item.member" alt="">
		              <p :style="{'color':currentComponentData.data.fontColor}">刚刚</p>
                  <span class="name">{{item.content}}</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <div v-else>
          <img :src="currentComponentData.data.fakeList[0].fileUrl" alt="" style="width:100%;height:35px;vertical-align: bottom;">
        </div>
      </template>
      <componentEmpty v-else :componentData="currentComponentData"></componentEmpty>
    </div>
  </div>
</template>

<script>
import mixinCompsData from "../mixins/mixinCompsData";
export default {
  name: "componentBuyNotice",
  mixins: [mixinCompsData],
  components: {},
  data() {
    return { 
      animate: true, 
      displayList: [],
      timer: null ,
      loading: false
    };
  },
  mounted() {
    this.timer = setInterval(this.scroll, 2000);
  },
  watch: {
    'currentComponentData.data.ids': {
          handler(newValue, oldValue) {
              if(!this.utils.isIdsUpdate(newValue, oldValue)) {
                  this.fetch();
              }
          },
          deep: true
      },
  },
  methods: {
  
    scroll() {
      if(!this.$refs.rollul) {
        return;
      }
      let con1 = this.$refs.rollul;
      if (con1.length>0) {
        con1[0].style.marginTop = "30px";
        this.animate = !this.animate;
        var that = this; // 在异步函数中会出现this的偏移问题，此处一定要先保存好this的指向
        setTimeout(function() {
          that.displayList.push(that.displayList[0]);
          that.displayList.shift();
          con1[0].style.marginTop = "0px";
          that.animate = !that.animate; // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
        }, 0);
      }
    },

    //根据ids拉取数据
    fetch(componentData = this.currentComponentData.data) {
        if(componentData) {
          if(Array.isArray(componentData.ids) && componentData.ids.length){
            this.loading = true;
            this._apis.order.getBuyNotice({
                    productIds: componentData.ids,
                }).then((response)=>{
                this.createList(response);
                this.dataLoaded = true;
                this.loading = false;
            }).catch((error)=>{
                console.error(error);
                this.displayList = [];
                this.loading = false;
                this.dataLoaded = true;
            });
          }else{
            this.displayList = [];
            this.dataLoaded = true;
          }
        }
    },

      /* 创建数据 */
    createList(datas) {
      this.displayList = datas;
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

  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped>
.nwwest-roll {
  padding-left: 7.5px;
  margin: 0 auto;
  overflow: hidden;
  transition: all 0.5s;
  & > ul {
    height: 17.5px;
    overflow: hidden;
    & > li {
      height: 17.5px;
      line-height: 17.5px;
    }
  }
}
.anim {
  transition: all 0.5s;
}
.componentBuyNotice {
  & > ul {
    height: 29px;
    line-height: 29px;
    padding: 0px 10px 0 5px;
    display: flex;
    align-items: center;
    li{
      height: 22px;
      width: 100%;
      img {
        height: 17px;
        width:17px;
        border-radius: 50%;
        float:left;
        margin-top:2.5px;
        margin-right:5px;
      }
      span{
        line-height:22px;
        overflow:hidden;
        display:block;
        @extend .ellipsis;
        font-size:12px;
      }
      p{
        float:right;
        margin-right:5px;
        line-height:22px;
        text-align:right;
        font-size:12px;
      }
    }
  }
  .van-notice-bar {
    background: none !important;
    height: 29px;
  }
  /deep/ .van-notice-bar__wrap {
    font-size: 12px;
    padding-left: 10px;
  }
}
</style>
