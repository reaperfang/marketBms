<template>
  <div class="module view" :style="{backgroundColor: baseInfo&&baseInfo.colorStyle}">
    <div class="phone-head" @click="clickTitle(null)" title="点击编辑页面信息">
      <img src="@/assets/images/shop/editor/phone_head.png" alt="">
      <span>{{baseInfo.name || '页面标题'}}</span>
    </div>
    <div class="phone-body" @click="clickTitle($event)" :style="bodyHeight">

      <!-- 可拖拽调整顺序 -->
      <vuedraggable 
      v-if="dragable"
      class="drag-wrap"
      :list='componentDataIds'
      :group='{
          name: "group"
      }'
      v-bind="dragOptions"
      @start="drag=true"
      @end="onEndHandler"
      :disabled='disable'
      :move='onMoveHandler'>
        <template v-for="(item, key) of componentDataIds">
          <div 
          class="component_wrapper" 
          v-if="!getComponentData(item).hidden"
          :key="key" 
          :class="{'actived': item === currentComponentId}"
          @click="selectComponent(item)" 
          @dragstart.self="selectItem = item" 
          @dragend.self="selectItem = {}">
            <component v-if="allTemplateLoaded && getComponentData(item).data" :is='templateList[getComponentData(item).type]' :key="key" :data="getComponentData(item)" ></component>
            <i v-if="item !== basePropertyId" class="delete_btn" @click.stop="deleteComponent(item)" title="移除此组件"></i>
          </div>
        </template>
      </vuedraggable>

      <!-- 不可拖拽调整顺序,可用来预览 -->
      <template v-else>
        <template v-for="(item, key) of componentDataIds">
          <div class="component_wrapper" style="cursor:text"  :key="key" v-if="allTemplateLoaded && !getComponentData(item).hidden">
            <component :is='templateList[getComponentData(item).type]' :key="key" :data="getComponentData(item)" ></component>
          </div>
        </template>
      </template>
    </div>
    <div class="page_mover">
      <i class="default_btn animated fadeIn faster" v-if="defaultBtnShow" @mouseover="btnMouseover($event)"></i>
      <div class="hover_btns animated fadeIn" v-if="pageMoveBtnShow" @mouseleave="btnMouseleave($event)">
        <div class="to_top" @click="scrollToTop">
          <i></i>
        </div>
        <div class="to_bottom" @click="scrollToBottom">
          <i></i>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import utils from '@/utils';
import widget from '@/system/constant/widget';
import vuedraggable from "vuedraggable";

export default {
  name: 'editView',
  props: {
    dragable: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number
    }
  },
  components: {vuedraggable},
  data () {
    return {
      utils,
      dragOptions: {
          animation: 300,
          group: "description",
          ghostClass: "ghost"
      },
      drag: false,
      disable: false,
      selectItem: {},
      allTemplateLoaded: false,  //所有模板加载结束
      templateList: {},  //模板对象列表
      bodyHeight: {},
      defaultBtnShow: true,  //默认圈圈按钮可见
      pageMoveBtnShow: false  //页面移动按钮可见
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
    baseInfo() {
      return this.$store.getters.baseInfo;
    },
    basePropertyId() {
      return this.$store.getters.basePropertyId;
    },
  },
  created() {
    this.loadTemplateLists();
    this._globalEvent.$on('scrollToBottom', ()=>{
      this.scrollToBottom();
    })
  },
  mounted() {
    this.bodyHeight = {
      height: this.height + 'px'
    }
  },
  methods: {

    /* 获取组件数据 */
    getComponentData(id) {
      return this.componentDataMap[id];
    },

    //加载模板列表
    loadTemplateLists() {
      let loadedLength = 0;
      let widgetList = widget.getWidgetList();
      for(let item of widgetList) {
        import(`./comps/component${this.utils.titleCase(item)}.vue`).then(loadedComponent => {
          this.templateList[item] = loadedComponent.default;
          loadedLength ++;
          if(loadedLength >= widgetList.length) {
            this.allTemplateLoaded = true;
          }
        }).catch(e => {
          loadedLength ++;
          if(loadedLength >= widgetList.length) {
            this.allTemplateLoaded = true;
          }
        })
      }
    },

    //选中此组件
    selectComponent(id) {
      this.$store.commit('setCurrentComponentId', id);
    },

    //删除组件
    deleteComponent(id) {
      this.$confirm(`确定删除此组件吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('deleteComponent', id)
      })
    },

    onMoveHandler(evt, originalEvent) {
        // const { relatedContext } = evt;
        // const comp = relatedContext.element;
        // if(!comp) return;
        // if(comp.container) {
        //     this.disable = true;
        // } else {
        //     this.disable = false;
        // }
    },

    onEndHandler() {
        this.drag = false;
        this.disable = false;
    },

    clickTitle(event) {
      if(!this.dragable) {
        return;
      }
      if(!event || (event.target.className.indexOf('phone-head') > -1 || event.target.className.indexOf('phone-body') > -1)) {
       this.$store.commit('setCurrentComponentId',  this.basePropertyId);
      }
    },

    scrollToTop () {
        this.$nextTick(() => {
            var container = this.$el.querySelector(".phone-body");
            let tempScrollHeight = container.scrollHeight;
            setTimeout(()=>{
              container.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            });
        });
    },

    scrollToBottom () {
        this.$nextTick(() => {
            var container = this.$el.querySelector(".phone-body");
            let tempScrollHeight = container.scrollHeight;
            setTimeout(()=>{
              container.scrollTo({
                top: tempScrollHeight,
                behavior: "smooth"
              });
            });
        });
    },

    btnMouseover(ev) {
      this.defaultBtnShow = false;
      this.pageMoveBtnShow = true;
    },

    btnMouseleave(ev) {
      this.defaultBtnShow = true;
      this.pageMoveBtnShow = false;
    }
  }
}
</script>

<style lang="scss" scoped>
 .view {
   position:relative;
    .phone-body {
      .component_wrapper{
        // min-height: 50px;
        &.actived{
          border:2px dashed $globalMainColor;
        }
        i{
          width:20px;
          height:20px;
          border-radius:50%;
          background:url('../../assets/images/shop/editor/delete.png') no-repeat 0 0;
          position:absolute;
          top:0;
          right:0;
          cursor:pointer;
        }
      }
    }
    .page_mover{
      position:absolute;
      bottom:90px;
      .default_btn{
        background:url('../../assets/images/shop/editor/moren.png') no-repeat 0 0;
        width:48px;
        height:48px;
        display: block;
      }
      .hover_btns{
        width:48px;
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .to_top{
          border-radius:50%;
          background:rgb(168,168,173);
          margin-bottom:8px;
          width:48px;
          height:48px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor:pointer;
          transition:all 0.4s;
          &:hover{
            background:rgb(140,140,144);
          }
          i{
            background:url('../../assets/images/shop/editor/toTop.png') no-repeat 0 0;
            width: 22px;
            height: 24px;
            display: block;
          }
        }
        .to_bottom{
          border-radius:50%;
          background:rgb(168,168,173);
          width:48px;
          height:48px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor:pointer;
          transition:all 0.4s;
          &:hover{
            background:rgb(140,140,144);
          }
          i{
            background:url('../../assets/images/shop/editor/toBottom.png') no-repeat 0 0;
            width: 22px;
            height: 24px;
            display: block;
          }
        }
      }
    }
  }
</style>
