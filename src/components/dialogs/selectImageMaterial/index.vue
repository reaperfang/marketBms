/* 选择图片素材弹框 */
<template>
  <div>
    <DialogBase :visible.sync="visible" width="816px" :title="'选择图片'" @submit="submit" @close="close" :showFooter="false">

     <el-tabs v-model="currentTab"  style="margin-bottom:40px;">
       <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name">
         <component
          :ref="item.name+'Component'"
          :is="item.name"
          :multipleUpload="multipleUpload"
          :max="max" 
          :isHave="isHave"
          :currentTab="currentTab"
          :isCheckbox="isCheckbox"
          :cid="cid"
          @selectedItemUpdate="selectedItemUpdate"
        ></component>
       </el-tab-pane>
    </el-tabs>
    <span class="dialog-footer fcc">
        <el-button type="primary" @click="submit">确 认</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </DialogBase>
  </div>
  
</template>

<script>
import DialogBase from "@/components/DialogBase";

import material from "./material";
import system from "./system";
import local from "./local";

import utils from "@/utils";
export default {
  name: "dialogSelectImageMaterial",
  components: {
    DialogBase,
    material,
    system,
    local
  },
  props: {
      data: {},
      dialogVisible: {
          type: Boolean,
          required: true
      },
      showSystemIcon: {
          type: Boolean,
          default: false,
          required: false
      },
      multipleUpload: {
          type: Boolean,
          required: false,
          default: true,
      },
      max: { //最大支持上传数量
        type: Number,
        required: false,
        default: 1
      },
      isHave: { //已经存在的数量
        type: Number,
        required: false,
        default: 1
      }
  },
  data() {
    return {
      currentTab: 'material',  //来源类型 =>  material:素材库 / local:本地上传  /  system:系统图片
      tabList: [],

      uploadAble: true,  //上传是否可用(用来清上传器缓存)
      imgNow: 0,  //当前预加载的第几张
      preLoadObj: null,  //预加载对象
      isIE: false,  //是否是IE

      selectedData: null, //单 多选的数据
    };
  },
  computed: {
    visible: {
      get() {
          return this.dialogVisible
      },
      set(val) {
          this.$emit('update:dialogVisible', val)
      }
    },
    isCheckbox() { //是否多选
      return this.max > 1
    },
    cid(){
        let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
        return shopInfo.id
    }
  },
  watch:{
    /* 当前tab类型变化 */
    currentTab(newValue) {
      console.log(newValue)
      this.$refs[newValue+'Component'][0].initHandler();
    },

  },
  created() {
    const tabList = [
      {
        "label": "素材图片",
        "name": "material"
      },
      {
        "label": "本地上传",
        "name": "local"
      }
    ];
    if(this.showSystemIcon) {
      tabList.splice(1, 0, {
        "label": "系统图标",
        "name": "system"
      })
    }
    this.tabList = tabList;
  },
  mounted() {
    this.$nextTick(() => {
      if(this.$parent.$refs.dialog) {
        let zIndex = this.$el.style.zIndex;
        zIndex = Number(zIndex) + 2;
        this.$parent.$el.style.zIndex = zIndex + '';
      }
    })
  },
  methods: {
    /**************************** 弹窗相关 *******************************/
    //单选数据更新
    selectedItemUpdate(item, pathKey) {
      //pathKey为接口返回的各自不同tab下的图片路径的key名称
      //如果有选中，则克隆，并添加filePath
      let copyItem;
      if(item){
        copyItem = {...item};
        copyItem['filePath'] = copyItem[pathKey];
      }else{
        copyItem = item;
      }
      this.selectedData = copyItem;
    },

    /* 向父组件提交选中的数据 */
    submit() {

      if((this.isCheckbox && this.selectedData.length == 0) || (!this.isCheckbox && !this.selectedData)) {
        this.$message.warning('请选择图片后重试！');
        return;
      }

      const data = utils.deepClone(this.selectedData);
      console.log(data)
      this.$emit('imageSelected',  data);
      this.close();
    },

    /* 关闭弹窗 */
    close() {
      this.dialogVisible = false;
      this.visible = false;
    },
  }
};
</script>

<style lang="scss" scoped>
  .dialog-footer .el-button{
    padding: 9px 20px;
    margin-left: 30px;
    span{
      letter-spacing: 5px;
      margin-right: -4px;
    }
  }
  .el-button:first-child {
      display: block;
      margin-left: 0;
  }
</style>