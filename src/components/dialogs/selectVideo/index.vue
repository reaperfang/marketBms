/* 选择视频素材弹框 */
<template>
  <div class="select-wrap">
    <DialogBase :visible.sync="visible" width="816px" :title="'选择视频'" @submit="submit" @close="close" :showFooter="false" :appendToBody="true" class="select-wrap">
     <el-tabs v-model="currentTab">
       <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component
        ref="tab"
        :is="currentTab"
        :multipleUpload="multipleUpload"
        :max="videoMax" 
        :isHave="isVideoHave"
        :isCheckbox="isCheckbox"
        :cid="cid"
        :selectedData="selectedData"
        @selectedItemUpdate="selectedItemUpdate"
      ></component>
    </keep-alive>
    <span class="dialog-footer fcc">
        <el-button type="primary" @click="submit">确 认</el-button>
        <el-button @click="visible = false">取 消</el-button>
    </span>
  </DialogBase>
  </div>
  
</template>

<script>
import DialogBase from "@/components/DialogBase";

import material from "./material";
import local from "./local";

import utils from "@/utils";
export default {
  name: "dialogSelectVideo",
  components: {
    DialogBase,
    material,
    local
  },
  props: {
      data: {},
      dialogVisible: {
          type: Boolean,
          required: true
      },
      multipleUpload: {
          type: Boolean,
          required: false,
          default: true,
      },
      videoMax: { //最大支持上传数量
        type: Number,
        required: false,
        default: 1
      },
      isVideoHave: { //已经存在的数量
        type: Number,
        required: false,
        default: 0
      }
  },
  data() {
    return {
      currentTab: 'material',  //来源类型 =>  material:素材库 / local:本地上传
      tabList: [],
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
      return this.videoMax > 1
    },
    cid(){
        let shopInfo = this.$store.getters.shopInfos
        return shopInfo.id
    }
  },
  watch:{
    currentTab(newValue) {
      //切换时先记录其wrapper容器的scrollTop，以便在切换回来时保持滚动到的位置
      this.$refs.tab.scrollTop = this.$refs.tab.$refs.wrapper.scrollTop;
    }
  },
  created() {
    const tabList = [
      {
        "label": "素材视频",
        "name": "material"
      },
      {
        "label": "本地上传",
        "name": "local"
      }
    ];
    this.tabList = tabList;

    //如果是多选，则selectedData初始化为空数组
    if(this.isCheckbox){
      this.selectedData = [];
    }
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
    //数据更新
    selectedItemUpdate(item, keyObj, checked) {

      //单选数据更新
      if(!this.isCheckbox){
        //pathKey为接口返回的各自不同tab下的图片路径的key名称
        //如果有选中，则克隆，并添加filePath
        let copyItem;
        if(item){
          copyItem = {...item};
          copyItem['filePath'] = copyItem[keyObj.pathKey];
          copyItem['fileCover'] = copyItem[keyObj.coverKey];
        }else{
          copyItem = item;
        }
        this.selectedData = copyItem;
      }else{ //多选数据更新
        if(checked){ //如果是选中
          let copyItem = {...item};
          copyItem['filePath'] = copyItem[keyObj.pathKey];
          copyItem['fileCover'] = copyItem[keyObj.coverKey];
          this.selectedData.push(copyItem);
        }else{ //如果不选中
          if(item.id){
            this.selectedData = this.selectedData.filter((val) => val.id !== item.id)
          }else{
            this.selectedData = this.selectedData.filter((val) => val.filePath !== item[keyObj.pathKey])
          }
        }
      }
      
    },

    /* 向父组件提交选中的数据 */
    submit() {

      if((this.isCheckbox && this.selectedData.length == 0) || (!this.isCheckbox && !this.selectedData)) {
        this.$message.warning('请选择视频后重试！');
        return;
      }

      const data = utils.deepClone(this.selectedData);
      this.$emit('videoSelected',  data);
      this.close();
    },

    /* 关闭弹窗 */
    close() {
      this.visible = false;
    },
  }
};
</script>

<style lang="scss" scoped>
  .dialog-footer {
    margin-top:40px;
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
  .select-wrap {
    /deep/ .el-dialog__body {
      padding-top: 0;
    }
    /deep/ .el-tabs__header {
      margin-bottom: 15px !important;
    }
  }
</style>