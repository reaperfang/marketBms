<template>
  <div class="module view" :style="{backgroundColor: baseInfo&&baseInfo.colorStyle}">
    <div class="phone-head" @click="clickTitle(null)" title="点击编辑页面信息">
      <img src="@/assets/images/shop/editor/phone_head.png" alt="">
      <span>{{baseInfo.title || baseInfo.name || '页面标题'}}</span>
    </div>
    <div class="phone-body" ref="view_container" @click="clickTitle($event)" v-calcHeight="height" @drop="dropAddComponent($event)" @dragover="dragover($event)" @dragleave="dragleave($event)">

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
            :title="getComponentData(item).title"
            class="component_wrapper" 
            :data-id="getComponentData(item).id"
            v-if="!getComponentData(item).hidden"
            :key="key" 
            :class="{'actived': item === currentComponentId}"
            @click="selectComponent(item)" 
            @mouseover="componentMouseover(item)"
            @mouseout="componentMouseleave(item)"
            @dragstart.self="selectItem = item" 
            @dragend.self="selectItem = {}">
              <component class="animated fadeIn" v-if="allTemplateLoaded && getComponentData(item).data" :is='templateList[getComponentData(item).type]' :key="key" :data="getComponentData(item)" @loadStatusChange="loadStatusChange"></component>
              <i v-if="item !== basePropertyId" class="delete_btn" @click.stop="deleteComponent(item)" title="移除此组件"></i>
              <transition name="fade">
                <div v-show="item === currentMouseOverComponentId" class="title-box">
                  <div class="popper">{{getComponentData(item).title}}</div>
                </div>
              </transition>
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
import widget from './config/widgetConfig';
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
      defaultBtnShow: true,  //默认圈圈按钮可见
      pageMoveBtnShow: false  //页面移动按钮可见
    }
  },
  computed:{
    currentComponentId() {
      return this.$store.getters.currentComponentId;
    },
    currentMouseOverComponentId() {
      return this.$store.getters.currentMouseOverComponentId;
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
    
    this._globalEvent.$on('autoScrollToComponent', (id)=>{
      this.autoScrollToComponent(id);
    })
  },
  mounted() {
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
        import(`./comps/component${this.utils.titleCase(item.type)}.vue`).then(loadedComponent => {
          this.templateList[item.type] = loadedComponent.default;
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

    componentMouseover(id) {
      this.$store.commit('setCurrentMouseOverComponentId', id);
    },
    componentMouseleave(id) {
      this.$store.commit('setCurrentMouseOverComponentId', '');
    },
    //删除组件
    deleteComponent(id) {
      
      this.confirm({
        title: '提示', 
        customClass: 'goods-custom', 
        icon: true, 
        text: '确定删除此组件吗？'
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

    /* 滚动到顶部 */
    scrollToTop () {
        this.$nextTick(() => {
            var container = this.$el.querySelector(".phone-body");
            let tempScrollHeight = container.scrollHeight;
            setTimeout(()=>{
              if(!container.scrollTo && typeof container.scrollTo !== 'function') {  //无滚动效果，直接到制定位置
                container.scrollTop = 0
              }else{
                container.scrollTo({
                  top: 0,
                  behavior: "smooth"
                });
              }
            });
        });
    },

    /* 滚动到底部 */
    scrollToBottom () {
        this.$nextTick(() => {
            var container = this.$el.querySelector(".phone-body");
            let tempScrollHeight = container.scrollHeight;
            setTimeout(()=>{
              if(!container.scrollTo && typeof container.scrollTo !== 'function') {  //无滚动效果，直接到制定位置
                container.scrollTop = tempScrollHeight
              }else{
                container.scrollTo({
                  top: tempScrollHeight,
                  behavior: "smooth"
                });
              }
            });
        });
    },

    /* 自动跟踪组件添加滚动到组件位置 */
    autoScrollToComponent(id) {
      // this.$nextTick(()=>{
      //   var container = this.$el.querySelector(".phone-body");
      //   let blocks = this.$refs.view_container.querySelectorAll('.component_wrapper');
      //   for(let i=0;i< blocks.length;i++) {
      //     if(id === blocks[i].getAttribute('data-id')) {
      //       const offsetTop = blocks[i].offsetTop;
      //       const offsetHeight = blocks[i].offsetHeight;
      //       if(!container.scrollTo && typeof container.scrollTo !== 'function') {  //无滚动效果，直接到制定位置
      //         container.scrollTop = offsetTop + offsetHeight
      //       }else {
      //         container.scrollTo({
      //           top: offsetTop + offsetHeight,
      //           behavior: "smooth"
      //         });
      //       }
      //     }
      //   }
      // })
    },

    /* 按钮鼠标移入 */
    btnMouseover(ev) {
      this.defaultBtnShow = false;
      this.pageMoveBtnShow = true;
    },

    /* 按钮鼠标移开 */
    btnMouseleave(ev) {
      this.defaultBtnShow = true;
      this.pageMoveBtnShow = false;
    },

    /* 组件加载状态改变 */
    loadStatusChange(data) {
      //console.log(data);
    },

    /* 允许拖拽进来 */
    dragover(ev) {
      ev.preventDefault();
    }, 
    
    /* 拖拽离开 */
    dragleave(ev) {
      ev.preventDefault();
    },

    /* 拖拽添加组件 */
    dropAddComponent(ev) {
      ev.preventDefault();
      let data= ev.dataTransfer.getData("dragAddComponent");

      if(!data) {
        return;
      }

      //当目前选中的是基础组件的时候，先强行选中最后一个组件再执行下文
      if(this.currentComponentId === this.basePropertyId) {
        this.$store.commit('setCurrentComponentId', this.componentDataIds[this.componentDataIds.length - 1]);
      }

      this.$store.commit('addComponent', {
        component: JSON.parse(data),
        targetId: this.currentComponentId,
        after: true
      });

      //组件添加自动滚动到组件位置
      let index = this.componentDataIds.indexOf(this.currentComponentId);
      if(index > 0) {
        index--;
      }
      let prev = this.componentDataIds[index];
      this.autoScrollToComponent(prev);

      //只有根组件的情况下直接定位到底部
      if(this.currentComponentId === this.componentDataIds[this.componentDataIds.length - 1]) {
        this.$nextTick(()=>{
          this.scrollToBottom();
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .view {
   position:relative;
    .phone-body {
      box-shadow: 0 1px 10px rgba(0,0,0,0.1);
      width: 375px;
      overflow-x: hidden;
      overflow-y: scroll;
      scrollbar-width: none;
      overflow-x: visible;

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
      .drag-wrap {
        .title-box {
          position: absolute;
          right: -160px;
          top: 0px;
          .popper {
            width: 135px;
            height: 56px;
            background: #fff;
            padding: 13px 8px;
            border-radius: 7px;
            color: #92929b;
            &:before {
              content: '';
              position: absolute;
              top: calc(50% - 8px);
              left: -16px;
              width: 16px;
              height: 16px;
              background: url('../../assets/images/shop/editor/arrow.png') no-repeat;
            }
          }
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
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
