<template>
  <!-- 满减瞒折 -->
  <div class="componentFullReduction" v-if="currentComponentData && currentComponentData.data" v-loading="loading">
    <template v-if="hasContent">
      <div class="reduction"  v-for="(item, key) in list" :key="key">
        <div class="reduction_first">
          <span>减</span>
          <span>{{item.name}}</span>
          <span>{{item.startTime}}至{{item.endTime}}</span>
        </div>
        <div class="reduction_two">
          <ul>
            <li
            v-for="(item2, key2) in item.typeList " :key="key2"
            v-if="item2.orderRewardType"
              class="ellipsis"
              :class="reductionStyle"
            >
              <span v-if="item2.orderRewardType == 1" :title="reduceData(item2)">{{reduceData(item2)}}</span>
              <span v-else-if="item2.orderRewardType == 2" :title="discountData(item2)">{{discountData(item2)}}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <div v-else class="temp_block">
        <img class="empty_data_img" src="../../../assets/images/shop/emptyData.png" alt="">
    </div>
  </div>
</template>

<script>
import componentMixin from "../mixins/mixinComps";
export default {
  name: "componentFullReduction",
  mixins: [componentMixin],
  components: {},
  data() {
    return {
      allLoaded: false,  //因为有异步数据，所以初始化加载状态是false
      list: [],
      loading: false
    };
  },
  created() {
    this.fetch();
    this._globalEvent.$on('fetchFullReduction', (componentData, componentId) =>{
      if(this.currentComponentId === componentId) {
        this.fetch(componentData);
      }
    });
  },
  computed: {
    reductionStyle() {
      return `style${this.currentComponentData.data.displayStyle}`;
    },
    /* 检测是否有数据 */
    hasContent() {
        let value = false;
        if(this.list && this.list.length) {
            value = true;
        }
        return value;
    }
  },
  methods: {
    reduceData(item2) {
      return `满${item2.useCondition}${item2.unit == 1 ? '元' : '件'}减${item2.reduceMoney}元`;
    },

    discountData(item2) {
      return `满${item2.useCondition}${item2.unit == 1 ? '元' : '件'}打${item2.discount * 10}折`;
    },

    //根据ids拉取数据
    fetch(componentData = this.currentComponentData.data) {
      if(componentData) {
          if(Array.isArray(componentData.ids) && componentData.ids.length){
              this.loading = true;
              this._apis.shop.getFullReductionListByIds({
                  ids: componentData.ids.join(',')
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
        this.allLoaded = true;
    },
  },
  beforeDestroy() {
      //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
      this._globalEvent.$off('fetchFullReduction');
  },
};
</script>

<style lang="scss" scoped>
.componentFullReduction {
  & > .reduction {
    padding: 10px 20px;
    border-radius: 5px;
    margin-bottom: 10px;
    margin: 10px;
    box-shadow: 0px 0px 9px rgba(0,0,0,0.1);
    & > .reduction_first {
      position: relative;
      & > span {
        margin-right: 8px;
        margin-right: 8px;
        color: rgba(171,171,171,1);
        font-size: 11px;
      }
      & > span:first-child {
        width: 19px;
        height: 19px;
        line-height: 19px;
        border-radius: 5px;
        text-align: center;
        color: #fff;
        font-size: 12px;
        background: #fc3d42;
        display: inline-block;
        position: absolute;
        top: 2px;
      }
      & > span:nth-child(2) {
        font-size: 16px;
        color: #333;
        padding-left: 28px;
      }
      & > span:last-child(3) {
        font-size: 11px;
        transform: scale(0.92);
        color: #7c7c7c;
      }
    }
    & > .reduction_two {
      padding-top: 15px;
      & > ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        & > li {
          width: 78px;
          height: 20px;
          line-height: 20px;
          background: rgba(255, 255, 255, 1);
          text-align: center;
          color: #fc3d42;
          margin-right: 18px;
          margin-bottom: 10px;
          font-size: 11px;
          transform: scale(0.92);
        }
        & > .style1 {
          border: 1px solid #fc3d42;
          border-radius: 4px;
        }
        & > .style2 {
          border: 1px solid #fc3d42;
        }
        & > .style3 {
          border: 1px dashed #fc3d42;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
