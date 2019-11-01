<template>
  <!-- 购买公告 -->
  <div class="componentBuyNotice" v-if="currentComponentData && currentComponentData.data" v-loading="loading">
    <ul :style="{'backgroundColor':currentComponentData.data.backgroundColor}">
      <li>
        <!-- <img src="http://35.201.165.105:8000/storage/image/20190809/1565333783849805.png" alt /> -->
        <i class="van-icon van-icon-volume-o van-notice-bar__left-icon" style="color: #fc3d42;"><!----></i>
      </li>
      <li class="ellipsis">
        <div class="nwwest-roll" id="nwwest-roll">
          <ul id="roll-ul" :style="{'color':currentComponentData.data.fontColor}">
            <li ref="rollul" v-for="item in list" class="ellipsis" :class="{anim:animate===true}">
              <img :src="item.member" alt="">
              <span class="name">{{item.content}}</span>
            </li>
          </ul>
        </div>
      </li>
      <li :style="{'color':currentComponentData.data.fontColor}">刚刚</li>
    </ul>
  </div>
</template>

<script>
import componentMixin from "../mixins/mixinComps";
export default {
  name: "componentBuyNotice",
  mixins: [componentMixin],
  components: {},
  data() {
    return { 
      animate: true, 
      list: [],
      timer: null ,
      loading: false
    };
  },
  created() {
    this.fetch();
    this._globalEvent.$on('fetchBuyNotice', (componentData, componentId) => {
      if(this.currentComponentId === componentId) {
        this.fetch(componentData);
      }
    });
  },
  methods: {
    scroll() {
      let con1 = this.$refs.rollul;
      if(con1) {
        con1[0].style.marginTop = "30px";
        this.animate = !this.animate;
        var that = this; // 在异步函数中会出现this的偏移问题，此处一定要先保存好this的指向
        setTimeout(function() {
          that.list.push(that.list[0]);
          that.list.shift();
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
          }else{
            this.list = [];
          }
        }
    },

      /* 创建数据 */
    createList(datas) {
      this.list = datas;
    },

  },
  mounted() {
    this.timer = setInterval(this.scroll, 2000);
  },
  beforeDestroy() {
      //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
      this._globalEvent.$off('fetchBuyNotice');
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped>
.nwwest-roll {
  padding-left: 15px;
  margin: 0 auto;
  overflow: hidden;
  transition: all 0.5s;
  & > ul {
    height: 35px;
    overflow: hidden;
    & > li {
      height: 35px;
      line-height: 35px;
      display:flex;
      img{
        width:35px;
        height:35px;
        margin-right:10px;
      }
    }
  }
}
.anim {
  transition: all 0.5s;
}
.componentBuyNotice {
  // height: 29px;
  // line-height: 29px;
  & > ul {
    padding: 0px 10px;
    display: flex;
    align-items: center;
    & > li:nth-child(1) {
      width: 22px;
      height: 22px;
      & > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    & > li:nth-child(2) {
      flex: 1;
    }
    & > li:nth-child(3) {
      flex: 0 0 50px;
      text-align: right;
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
