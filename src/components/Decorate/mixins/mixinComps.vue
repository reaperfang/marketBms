<script>
import componentEmpty from '../tools/componentEmpty';
import componentButton from '../tools/componentButton';
export default {
  name: "componentMixin",
  components: {componentEmpty, componentButton},
  props: ["data"],
  data() {
    return {
      allLoaded: true,  //全部加载完成
      events: []  //事件列表
    }
  },
  computed: {
    currentComponentId() {
      return this.data.id;
    },
    componentDataMap() {
      return this.$store.getters.componentDataMap || {};
    },
    currentComponentData() {
      return this.componentDataMap[this.currentComponentId] || {};
    }
  },
  created(){
      this.receivePropDataChange('', (componentData)=>{
        this.fetch(componentData);
      });
      this.decoration && this.decoration();
  },
  watch: {
      currentComponentData(){
         this.decoration && this.decoration();
      },
      allLoaded (newValue) {
        this.$emit("loadStatusChange", {
          id: this.data.id,
          loadStatus: newValue
        });
      }
  },
  methods: {
    /* 接收来自属性面板的数据变更 */
    receivePropDataChange(componentType, callback) {
      const _self = this;
      componentType = componentType || this.currentComponentData.type || '';
      this._globalEvent.$on(`fetch${this.utils.titleCase(componentType)}`,  (componentData, componentId) => {
            if(_self.currentComponentId === componentId) {
               callback && callback(componentData);
            }
        });
    },

    /* 同步到其他组件 (若传入组件type和数据则按照传入的组件类型触发，否则按照当前组件类型触发) */
    syncToOther(componentType, data) {
      componentType = componentType || this.currentComponentData.type || '';
      data = data || this.ruleForm || {};
      this._globalEvent.$emit(`fetch${this.utils.titleCase(componentType)}`, data, this.currentComponentId);
      this.$store.commit('addEvent', `fetch${this.utils.titleCase(componentType)}`);
    }

  },
  destroyed() {
    //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
    this.$store.getters.decorateEvents.forEach((item) => {
      this._globalEvent.$off(item);
    })
  }
};
</script>	
