<template>
  <div class="module props">
      <div class="block header">
        <p class="title" v-if="this.componentDataMap[this.currentComponentId]">
          {{this.componentDataMap[this.currentComponentId].title}}
        </p>
        <p class="title" v-else>
          编辑
        </p>
      </div>
      <transition name="fade" :duration="{ enter: 200, leave: 100 }">
        <component :is='currentComponent' @change="propsChange" v-bind="this.componentDataMap[this.currentComponentId]" key="components"></component>
      </transition>
      <div class="block button" v-loading="loading">
        <div class="help_blank"></div>
        <div class="buttons">
          <el-button @click="resetLoading = true; resetData.call(parentScope)" v-if="resetData" :loading="resetLoading">重   置</el-button>
          <el-button @click="savePropData(parentScope)" type="primary" :loading="saveDataLoading">保   存</el-button>
          <el-button type="primary" @click="saveAndApplyDataLoading = true; saveAndApplyData.call(parentScope)" v-if="saveAndApplyData && id" :loading="saveAndApplyDataLoading">保存并生效</el-button>
          <el-button @click="dialogVisible=true; currentDialog='dialogDecoratePreview'" v-if="id">预    览</el-button>
          <!-- <el-button @click="saveToTemplate.call(parentScope)" v-if="saveToTemplate">保存到模板</el-button> -->
        </div>
      </div>
      <!-- 动态弹窗 -->
      <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :homePageData="homePageData"></component>
    </div>
</template>

<script>
import utils from '@/utils';
import dialogDecoratePreview from '@/views/shop/dialogs/dialogDecoratePreview';
export default {
  name: 'propView', 
  components: {dialogDecoratePreview},
  props: ['saveData', 'saveAndApplyData', 'resetData', 'saveToTemplate', 'parentScope', 'homePageData'],
  data () {
    return {
      currentComponent: null,  //当前组件名称
      dialogVisible: false,
      currentDialog: '',
      utils,
      id: this.$route.query.pageId,
      loading: false,
      resetLoading: false,  //重置loading
      saveDataLoading: false,  //保存loading
      saveAndApplyDataLoading: false  //保存并应用loading
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
    // 'basePropertyId'(newValue, oldValue) {
    //   this.loadPropTemplate();
    // }
  },
  created() {
    const _self = this;

    /* 监听接口操作结束事件，用来响应loading  保存按钮*/
    this._globalEvent.$on('decorateSaveLoading', (status, id) => {
      if(id === _self.id) {
        _self.saveDataLoading = false;
      }
    });

     /* 监听接口操作结束事件，用来响应loading  保存并应用按钮*/
    this._globalEvent.$on('decorateSaveAndApplyLoading', (status, id) => {
      if(id === _self.id) {
        _self.saveAndApplyDataLoading = false;
      }
    });

     /* 监听接口操作结束事件，用来响应loading  重置按钮*/
    this._globalEvent.$on('decorateResetLoading', (status, id) => {
      if(id === _self.id) {
        _self.resetLoading = false;
      }
    });
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
    },

    // 保存数据
    savePropData(parentScope) {
      if (this.baseInfo.vError) {
        this.$message({ message: '请填写正确信息', type: 'warning' });
      } else {
        saveDataLoading = true;
        this.saveData.call(parentScope);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
