<template>
  <div class="module props">
      <div v-calcHeight="168" class="props-content">
        <!-- 头部标题栏 -->
        <div class="block header">
          <p class="title" v-if="componentDataMap[currentComponentId]">
            {{componentDataMap[currentComponentId].title}}
          </p>
          <p class="title" v-else>
            编辑
          </p>
        </div>

        <!-- 属性渲染区 -->
        <transition name="fade" :duration="{ enter: 200, leave: 100 }">
          <component :is='currentComponent' @change="propsChange" v-bind="componentDataMap[currentComponentId]" key="components"></component>
        </transition>
      </div>

      <!-- 底部按钮区 -->
      <div class="block button">
        <div class="help_blank"></div>
        <div class="buttons">
          <template v-for="(item, key) in buttonList">
            <el-button v-if="item.show() && item.function" :key="key" @click="item.function" :loading="item.loading" :type="item.type">{{item.title}}</el-button>
          </template>
        </div>
      </div>
    </div>
</template>

<script>
import utils from '@/utils';
import dialogDecoratePreview from '@/views/shop/dialogs/decorateDialogs/dialogDecoratePreview';
export default {
  name: 'propView', 
  props: {
    buttons: {
      type: Object
    }
  },
  data () {
    return {
      currentComponent: null,  //当前组件名称
      utils,
      id: this.$route.query.pageId,
      buttonList: this.buttons || {}
    }
  },
  computed:{
    currentComponentId() {
      return this.$store.getters.currentComponentId;
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
    baseInfo() {
      return this.$store.getters.baseInfo;
    }
  },
  watch: {
    'currentComponentId'(newValue, oldValue) {
      this.loadPropTemplate();
    },
    'buttons': {
      handler(newValue) {
        this.buttonList = newValue;
      },
      deep: true
    }
  },
  mounted() {
    this.loadPropTemplate();
  },
  methods: {

    /* 动态加载属性模板 */
    loadPropTemplate() {
      let currentComponentData = this.componentDataMap[this.currentComponentId];
      let type = currentComponentData && currentComponentData.type || '';
      if(type){
        import(`./props/property${this.utils.titleCase(type)}.vue`).then(loadedComponent => {
          this.currentComponent = '';
          this.$nextTick(()=>{  //清除缓存组件以后下一帧处理
            this.currentComponent = loadedComponent.default
          })
        }).catch(e => {
          console.error(e);
        })
      }
    },

    /* 更新组件数据 */
    propsChange(params) {
      this.$store.commit('updateComponent', params);
    }
  }
}
</script>

<style lang="scss" scoped>
  .props {
    background-color: #fff;
    padding: 12px 18px;
    &.module {
      width: 361px;
    }
    .props-content {
      overflow-y: auto;
    }
    .help_blank {
      background-color: #fff!important;
    }
  }
  .props-content::-webkit-scrollbar-thumb {
      background: rgba(101,94,255,0.4) !important;
  }
  .props-content::-webkit-scrollbar {
      width: 8px!important;
      height: 8px!important;
  }
  .props-content::-webkit-scrollbar-thumb {
    background-color: rgba(101,94,255,0.4) !important;
    background-clip: padding-box;
    min-height: 28px;
    border-radius: 7px;
}
</style>
