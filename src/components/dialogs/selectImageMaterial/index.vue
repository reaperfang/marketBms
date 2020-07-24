/* 选择图片素材弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'选择图片'" @submit="submit" @close="close" :showFooter="false">

     <el-tabs v-model="currentTab"  style="margin-bottom:40px;">
       <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
    </el-tabs>
    <component :is="currentTab"></component>

    <span class="dialog-footer fcc">
        <el-button type="primary" @click="submit">确 认</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </DialogBase>
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
        default: 6
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
      tabList: [
        {
          "label": "素材图片",
          "name": "material"
        },
        {
          "label": "系统图标",
          "name": "system"
        },
        {
          "label": "本地上传",
          "name": "local"
        }
      ],

      uploadAble: true,  //上传是否可用(用来清上传器缓存)
      imgNow: 0,  //当前预加载的第几张
      preLoadObj: null,  //预加载对象
      isIE: false,  //是否是IE

      selectedArr: [], //素材库/本地上传 多选时的数据集合
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
  created() {
    
  },
  mounted() {
    
  },
  methods: {
  
  }
};
</script>

<style lang="scss" scoped>

.pages{
  text-align: center;
  margin-top: 45px;
}
.empty{
  text-align: center;
  margin-top: 100px;
  color: #b6b5c8;
}
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