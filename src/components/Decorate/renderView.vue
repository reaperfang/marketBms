<template>
  <div class="module view" :style="{backgroundColor: baseInfo&&baseInfo.colorStyle || '#fff'}" v-calcHeight="renderCalcHeight">
    <div class="phone-head" @click="clickTitle(null)" :title="dragable ? '点击编辑页面信息' : ''" :style="{'cursor': dragable ? 'pointer' : 'text'}">
      <img src="@/assets/images/shop/editor/phone_head.png" alt="">
      <span>{{baseInfo.title || baseInfo.name || '页面标题'}}</span>
    </div>
    <div class="phone-body" :class="bodyClass" ref="view_container" @click="clickTitle($event)" v-calcHeight="renderCalcHeight + 64 + 10" @drop="dropAddComponent($event)" @dragover="dragover($event)" @dragleave="dragleave($event)">

      <!-- 可拖拽调整顺序 -->
      <vuedraggable 
      v-if="dragable"
      class="drag-wrap"
      :list='componentDataIds'
      :group='{
          name: "group"
      }'
      v-bind="dragOptions"
      @start="drag=true; popoverDisabled=true"
      @end="onEndHandler"
      :disabled='disable'
      :move='onMoveHandler'>
        <template v-for="(item, key) of componentDataIds">
          <div :key="item">
            <el-popover
            :key="item+key"
            ref="popover"
            :popper-class="'editor-view-popover active'"
            placement="right-start"
            :width="getComponentConfigData(item, key).noDelete ? 0 : 76"
            :popper-options="{boundariesElement: 'viewport', boundariesPadding: 64}"
            :disabled="componentConfigData[key] ? componentConfigData[key].noDelete : getComponentConfigData(item, key).noDelete"
            trigger="hover">
            <div class="arrow-box" @mouseover="componentMouseover(item)" @mouseout="componentMouseleave(item)" @click="deleteComponent(item)">
              <span>{{componentConfigData[key].title}}</span>
              <i v-show="item !== basePropertyId" class="el-icon-delete"></i>
            </div>
            <div 
              slot="reference"
              class="component_wrapper" 
              :data-id="getComponentData(item).id"
              v-if="!componentConfigData[key].hidden"
              :key="key" 
              :class="{'actived': item === currentComponentId}"
              @click="selectComponent(item)" 
              @mouseover="componentMouseover(item)" 
              @mouseout="componentMouseleave(item)"
              @dragstart.self="selectItem = item" 
              @dragend.self="selectItem = {}">
                <component class="animated fadeIn" v-if="allTemplateLoaded && getComponentData(item).data" :is='templateList[getComponentData(item).type]' :key="item" :data="getComponentData(item)" @componentDataLoaded="componentDataLoaded"></component>
                <!--<i v-if="item !== basePropertyId" class="delete_btn" @click.stop="deleteComponent(item)" title="移除此组件"></i>
                <transition name="fade">
                  <div v-show="item === currentMouseOverComponentId" class="title-box">
                    <div class="popper">{{componentConfigData[key].title}}</div>
                  </div>
                </transition>-->
                <div class="border-line border-line-l"></div>
                <div class="border-line border-line-t"></div>
                <div class="border-line border-line-r"></div>
                <div class="border-line border-line-b"></div>
            </div>
          </el-popover>
          </div>
        </template>
      </vuedraggable>

      <!-- 不可拖拽调整顺序,可用来预览 -->
      <template v-else>
        <template v-for="(item, key) of componentDataIds">
          <div class="component_wrapper" style="cursor:text"  :key="key" v-if="allTemplateLoaded && !getComponentConfigData(item, key).hidden">
            <component :is='templateList[getComponentData(item).type]' :key="key" :data="getComponentData(item)" :bodyClass="bodyClass" :dragable="dragable"  @componentDataLoaded="componentDataLoaded"></component>
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
    <!-- <transition name="fade" :duration="{ enter: 200, leave: 100 }">
      <div class="progress" v-if="loadPercent < 100">
        <el-progress type="circle" :percentage="loadPercent"></el-progress>
      </div>
    </transition> -->
  </div>
</template>

<script>
import utils from '@/utils';
import widget from './config/widgetConfig';
import vuedraggable from "vuedraggable";

export default {
  name: 'renderView',
  props: {
    bodyClass: {
      type: String
    },
    dragable: {
      type: Boolean,
      default: true
    },
    renderCalcHeight: {
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
          ghostClass: "ghost",
      },
      drag: false,
      disable: false,
      selectItem: {},
      allTemplateLoaded: false,  //所有模板加载结束
      templateList: {},  //模板对象列表
      defaultBtnShow: true,  //默认圈圈按钮可见
      pageMoveBtnShow: false,  //页面移动按钮可见
      visible: true,
      currentMouseOverComponentId: '',
      popoverDisabled: false,
      loadedComponents: [],  //数据加载完成的组件列表
      loadPercent: 0,
      scrollBottomMark: false, //只有当点击或者拖拽新添加组件时为true，等新的组件加载完成，需要触发滚动至底部事件的标记，然后初始为false
      scrollAutoMark: false, //只有当点击或者拖拽新添加组件时为true，等新的组件加载完成，需要触发滚动至组件位置事件的标记，然后初始为false
      componentConfigData: {}, //配置数据
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
      this.scrollBottomMark = true;
      this.scrollToBottom();
    }) 
    
    this._globalEvent.$on('autoScrollToComponent', (id)=>{
      this.scrollAutoMark =  true;
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

    //获取配置文件对应组件数据
    getComponentConfigData(id, index) {
      let data = widget.getComponentConfigData(this.componentDataMap[id].type);
      if(!data){
        data = this.getComponentData(id);
      }
      this.componentConfigData[index] = data;
      return data;
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
            this.$emit('renderPanelInited', this);
          }
        }).catch(e => {
          loadedLength ++;
          if(loadedLength >= widgetList.length) {
            this.allTemplateLoaded = true;
            this.$emit('renderPanelInited', this);
          }
        })
      }
    },

    //选中此组件
    selectComponent(id) {
      this.$store.commit('setCurrentComponentId', id);
    },

    componentMouseover(id) {
      this.currentMouseOverComponentId = id
    },
    componentMouseleave(id) {
      this.currentMouseOverComponentId = ''
    },
    //删除组件
    deleteComponent(id) {
      
      this.confirm({ 
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
        this.$nextTick(() => {
          this.$refs.popover.forEach(item => {
            item.updatePopper()
            this.popoverDisabled = false
          })
        })
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
      this.$nextTick(()=>{
        var container = this.$el.querySelector(".phone-body");
        const headH = this.$el.querySelector('.phone-head').clientHeight;
        let blocks = this.$refs.view_container.querySelectorAll('.component_wrapper');
        for(let i=0;i< blocks.length;i++) {
          if(id === blocks[i].getAttribute('data-id')) {
            const offsetTop = blocks[i].offsetTop;
            const offsetHeight = blocks[i].offsetHeight;
            if(!container.scrollTo && typeof container.scrollTo !== 'function') {  //无滚动效果，直接到制定位置
              container.scrollTop = offsetTop + offsetHeight - headH
            }else {
              container.scrollTo({
                top: offsetTop + offsetHeight - headH,
                behavior: "smooth"
              });
            }
            break;
          }
        }
      })
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


      //如果当前是最后一个组件，则直接定位到底部
      if(this.currentComponentId === this.componentDataIds[this.componentDataIds.length - 1]) {
        this.$nextTick(()=>{
          this.scrollBottomMark = true;
          this.scrollToBottom();
        })
      }else{
        this.scrollAutoMark = true;
        //组件添加自动滚动到组件位置
        let index = this.componentDataIds.indexOf(this.currentComponentId);
        if(index > 0) {
          index--;
        }
        let prev = this.componentDataIds[index];
        this.autoScrollToComponent(prev);
      }
    },

    /* 组件数据加载结束 */
    componentDataLoaded(componentData) {
      
      for(let item of this.componentDataIds) {
        if(item === componentData.id) {

          if(this.scrollBottomMark){
            this.scrollBottomMark = false;
            this.scrollToBottom();
          }
          if(this.scrollAutoMark && item === this.currentComponentId){ //因存在添加新组件会引起之后的组件重新加载的问题，会存在一些问题，后期考虑优化
            this.scrollAutoMark = false;
            //组件添加自动滚动到组件位置
            let index = this.componentDataIds.indexOf(this.currentComponentId);
            if(index > 0) {
              index--;
            }
            let prev = this.componentDataIds[index];
            this.autoScrollToComponent(prev);
          }
          
          this.loadedComponents.push(componentData);
          this.updateLoadProgress(componentData);
          if(this.loadedComponents.length === this.componentDataIds.length - 1) {  //减1是因为，要过滤掉基础组件，基础组件是不渲染的
            this.$emit('allDataLoaded');  //发送所有数据加载完毕状态给编辑器
            break;
          }
        }
      }
      // console.log(componentData.title + '-组件加载完毕')
    },

    /* 更新加载进度 */
    updateLoadProgress(componentData) {
      const percent = (this.loadedComponents.length / (this.componentDataIds.length - 1)).toFixed(2)*100;
      this.loadPercent = percent;
      this.$emit('dataLoadProgress', percent, componentData);  //发送进度数据给编辑器
    }
  }
}
</script>

<style lang="scss" scoped>
 .view {
   position:relative;
   -webkit-box-shadow: 0 1px 10px rgba(0,0,0,0.1);
    box-shadow: 0 1px 10px rgba(0,0,0,0.1);
    .phone-body {
      // box-shadow: 0 1px 10px rgba(0,0,0,0.1);
      width: 375px;
      overflow-x: hidden;
      overflow-y: scroll;
      scrollbar-width: none;

      .component_wrapper{
        .border-line {
          position: absolute;
          display: none;
        }
        .border-line-l {
          left: 0;
          top: 0;
          width: 2px;
          height: 100%;
          border-left: 2px dashed $globalMainColor;
        }
        .border-line-t {
          left: 0;
          top: 0;
          width: 100%;
          height: 2px;
          border-top: 2px dashed $globalMainColor;
        }
        .border-line-r {
          right: 0;
          top: 0;
          width: 2px;
          height: 100%;
          border-left: 2px dashed $globalMainColor;
        }
        .border-line-b {
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          border-top: 2px dashed $globalMainColor;
        }
        // min-height: 50px;
        &.actived{
          .border-line {
            display: block;
          }
          //  border: 2px dashed $globalMainColor;
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
    .progress{
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      display:flex;
      justify-content: center;
      align-items: center;
      background: rgba(255,255,255,0.8)
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
