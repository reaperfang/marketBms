<template>
  <!-- 满减瞒折 -->
  <div class="component_wrapper" v-loading="loading">
    <div class="componentFullReduction" v-if="currentComponentData && currentComponentData.data && hasContent">

        <div class="coupon_first componentFullReduction" v-if="showFakeData && currentComponentData.data.fakeList && currentComponentData.data.fakeList.length">
          <img :src="currentComponentData.data.fakeList[0].fileUrl" alt="" style="width:100%;">
        </div>

        <div class="reduction"  v-for="(item, key) in displayList" :key="key"  v-else>
          <div class="reduction_first">
            <span>减</span>
            <span>{{item.name}}</span>
            <span>{{item.startTime.slice(0,10)}}至{{item.endTime.slice(0,10)}}</span>
          </div>
          <div class="reduction_two">
            <ul>
              <template v-for="(item2, key2) in item.typeList ">
                <li
                :key="key2"
                v-if="item2.orderRewardType"
                  class="ellipsis"
                  :class="reductionStyle"
                >
                  <span v-if="item2.orderRewardType == 1" :title="reduceData(item2)">{{reduceData(item2)}}</span>
                  <span v-else-if="item2.orderRewardType == 2" :title="discountData(item2)">{{discountData(item2)}}</span>
                </li>
              </template>
            </ul>
          </div>
        </div>
    </div>
    <componentEmpty v-else :componentData="currentComponentData"></componentEmpty>
  </div>
</template>

<script>
import mixinCompsData from "../mixins/mixinCompsData";
export default {
  name: "componentFullReduction",
  mixins: [mixinCompsData],
  components: {},
  data() {
    return {
      allLoaded: false,  //因为有异步数据，所以初始化加载状态是false
      displayList: [],
      loading: false,
      showFakeData: true
    };
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
    'displayList': {
        handler(newValue) {
            this.showFakeData = !newValue.length;
        },
        deep: true
    }
  },
  computed: {
    reductionStyle() {
      return `style${this.currentComponentData.data.displayStyle}`;
    },
    /* 检测是否有数据 */
    hasContent() {
        let value = false;
        if((this.displayList && this.displayList.length) || (this.currentComponentData.data.fakeList && this.currentComponentData.data.fakeList.length)) {
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
                  console.error(error);
                  this.displayList = [];
                  this.loading = false;
              });
          }else{
              this.displayList = [];
          }
      }
    },

      /* 创建数据 */
    createList(datas) {
        this.displayList = datas;
        this.allLoaded = true;
    },
  }
};
</script>

<style lang="scss" scoped>
.componentFullReduction {
  padding: 0 10px;
  & > .reduction {
    padding: 5px 10px;
    border-radius: 5px;
    // margin: 10px;
    margin: 10px 0 10px;
    box-shadow: 0 0 4.5px rgba(0,0,0,.1);
    background:#fff;
    & > .reduction_first {
      position: relative;
      overflow:hidden;
      & > span {
        margin-right: 7.5px;
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
        display:block;
        float:left;
      }
      & > span:nth-child(2) {
        font-size: 16px;
        color: #333;
        line-height:19px;
        display:block;
        float:left;
      }
      & > span:nth-child(3) {
        font-size: 11px;
        transform: scale(0.92);
        color: #7c7c7c;
        display:block;
        line-height:19px;
        float:left;
      }
    }
    & > .reduction_two {
      padding-top: 15px;
      & > ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        & > li {
          height: 20px;
          line-height: 20px;
          background: rgba(255, 255, 255, 1);
          text-align: center;
          color: #fc3d42;
          margin-right: 17.5px;
          margin-bottom: 10px;
          padding:0 5px;
          font-size:11px;
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
