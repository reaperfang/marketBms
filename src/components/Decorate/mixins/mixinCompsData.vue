<script>
import componentButton from '../tools/componentButton';
import mixinCompsBase from './mixinCompsBase';
export default {
  name: "componentMixin",
  extends: mixinCompsBase,
  components: {componentButton},
  data() {
    return {
      events: [],  //事件列表
      hasRealData: false,  //组件内有真数据
      hasFakeData: false   //组件内有假数据
    }
  },
  created(){
      this.fetch();
      this.receivePropDataChange('', (componentData)=>{
        this.fetch(componentData);
      });
      this.decoration && this.decoration();
  },
  mounted() {
        this.checkRealData(this.displayList);
        if(this.currentComponentData.data.fakeList && this.currentComponentData.data.fakeList.length) {
          this.checkFakeData(this.currentComponentData.data.fakeList);
        }
        this.decoration && this.decoration();
  },
  watch: {

      /* 装修数据发生改变 */
      'currentComponentData'(){
         this.decoration && this.decoration();
      },
      /* 真数据变更 */
      'displayList': {
          handler(newValue, oldValue) {
            if(!this.utils.isIdsUpdate(newValue, oldValue)) {
              this.checkRealData(newValue);
            }
          },
          deep: true
      },

      /* 假数据变更 */
      'currentComponentData.data.fakeList': {
          handler(newValue, oldValue) {
            if(newValue && newValue.length) {
              if(!this.utils.isIdsUpdate(newValue, oldValue)) {
                this.checkFakeData(newValue);
              }
            }
          },
          deep: true
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
    },

    /* 更新是否需要替换真实数据标识给组件信息 */
    upadteComponentData() {
      this.$store.commit('updateComponent',{
        id: this.currentComponentData.id,
        data: Object.assign(this.currentComponentData.data, {
          needReplace: this.hasFakeData && !this.hasRealData
        })
      })
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
