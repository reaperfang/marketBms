<template>
  <div class="module props" v-calcHeight="propCalcHeight">
      <div class="props-content">
        <!-- 头部标题栏 -->
        <div class="block header">
          <p class="title" v-if="componentDataMap[currentComponentId]">
            {{componentDataMap[currentComponentId].title}}
            <span class="component_desc" v-if="componentDataMap[currentComponentId].describe">{{componentDataMap[currentComponentId].describe}}</span>
          </p>
          <p class="title" v-else>
            编辑
          </p>
        </div>

        <!-- 属性渲染区 -->
        <div v-calcHeight="componentDataMap[currentComponentId].describe ? propCalcHeight + 24+64+92 : propCalcHeight + 64+92" class="props_form">
          <transition name="fade" :duration="{ enter: 200, leave: 100 }">
            <component :is='currentComponent' @change="propsChange" v-bind="componentDataMap[currentComponentId]" key="components"></component>
          </transition>
        </div>
      </div>

      <!-- 底部按钮区 -->
      <div class="block button">
        <!-- <div class="help_blank"></div> -->
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
export default {
  name: 'propView', 
  props: {
    buttons: {
      type: Object
    },
    propCalcHeight: {
      type: Number
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
            this.$emit('propsInited', this);
          })
        }).catch(e => {
          console.error(e);
        })
      }
    },

    /* 更新组件数据 */
    propsChange(params) {
      this.$store.commit('updateComponent', params);
      this.$emit('dataChanged', params.id, params.data)
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
    .help_blank {
      background-color: #fff!important;
    }
  }
.props-content form{
  padding-right: 5px;
}
.props_form{
  overflow-y: auto;
}
.props_form::-webkit-scrollbar {
  width: 6px!important;
}
::-webkit-scrollbar-thumb{
  background-color: #B6B5C8;
}
</style>
