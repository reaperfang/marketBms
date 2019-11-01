<script>
import utils from "@/utils";
export default {
  name: "decorateMixin",
  data() {
    return {};
  },
  created() {
    this.$store.commit("clearAllData");
    this.fetch();
  },
  computed: {
    baseInfo() {
      return this.$store.getters.baseInfo;
    },
    componentDataIds() {
      return this.$store.getters.componentDataIds;
    },
    componentDataMap() {
      return this.$store.getters.componentDataMap;
    },
    basePropertyId() {
      return this.$store.getters.basePropertyId;
    },
  },

  methods: {

    /* 转换接口获取的装修数据 */
    convertDecorateData(data) {
      
      //还原组件列表
      let componentDataIds = [];
      let componentDataMap = {};
      const string = utils.uncompileStr(data.pageData);
      if(string.indexOf('id') < 0) {
        return;
      }
      let pageData = JSON.parse(string);
      if(!Array.isArray(pageData)) {
        return;
      }
      // console.log('pageData', JSON.stringify(pageData));
      for (let item of pageData) {
        componentDataIds.push(item.id);
        componentDataMap[item.id] = item;
        if(item.isBase) {  //设置为基础信息组件
          this.$store.commit('setBasePropertyId', item.id);
        }
      }
      this.$store.commit("setComponentDataIds", componentDataIds);
      this.$store.commit("setComponentDataMap", componentDataMap);

       //设置全局基础信息
      this.setBaseInfo(data);
      this.$store.commit('setCurrentComponentId', this.basePropertyId);
    },

    /* 保存前收集装修数据 */
    collectData() {
      let result     = this.baseInfo;
      result['id']   = this.id;
      let pageData = [];
      for(let item of this.componentDataIds) {
        const componentData = this.componentDataMap[item];
        if(componentData) {
          pageData.push(componentData);
        }
      }

      result['pageData'] = utils.compileStr(JSON.stringify(pageData));;
      return result;
    }
  }
};
</script>
