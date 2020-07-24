/* 本地上传 */
<template>
  <div>
    <!-- 本地上传 -->
    <div class="material_wrapper material_wrapper_2" ref="localWrapper" :style="{'overflow-y': uploadLoading ? 'hidden' : 'auto'}">
      <el-upload
        v-if="uploadAble"
        :multiple="multipleUpload"
        class="avatar-uploader"
        :title="uploadLoading ? '请加载完成后重试' : '点击上传'"
        :disabled="uploadLoading"
        :action="uploadUrl"
        :show-file-list="false"
        :data="{json: JSON.stringify({cid: cid})}"
        :on-error="handleError"
        :before-upload="beforeUpload" 
        :on-success="handleSuccess"
        :on-change="handleChange"
        :limit="100"
        :on-exceed="uploadLimit">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div v-loading="uploadLoading">
        <waterfall :col='3' :width="245" :gutterWidth="10" v-if="!uploadLoading" :data="fileList" :isTransition="false" >
          <template >
            <div class="cell-item" :class="{'img_active': localSelectedItem && localSelectedItem.title === item.title}" v-for="(item,key) in fileList" :key="key" @click="selectImg(item)">
              <img :src="item.url" alt="加载错误"/> 
              <div class="item-body">
                  <div class="item-desc">{{item.original}}</div>
              </div>
              <div class="item-checkbox">
                <el-checkbox>选择</el-checkbox>
              </div>
            </div>
          </template>
        </waterfall>
      </div>
  </div>
  <p class="note" style="color: #d3d8df;margin-top:10px;height: 16px;">仅支持jpg,jpeg,png格式，大小不超过3.0MB <span v-if="!uploadLoading && fileList.length" type="text" style="margin-left:10px;font-size:14px;color:rgb(101,94,255);cursor:pointer;" @click="clearTempSave">清除上传记录</span></p>
  </div>
</template>

<script>

import utils from "@/utils";
export default {
  name: "dialogSelectImageLocal",
  props: ['multipleUpload', 'max', 'isHave', 'isCheckbox', 'cid'],
  data() {
    return {
      uploadAble: true,  //上传是否可用(用来清上传器缓存)
      imgNow: 0,  //当前预加载的第几张
      preLoadObj: null,  //预加载对象

      /* 本地上传 */
      uploadUrl:`${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      fileList: [],  //最终用来显示的文件列表
      addList: [],  //添加的文件列表（上传前）
      successList: [],  //上传成功的文件列表(上传后)
      failedList: [],  //上传失败的文件列表（上传后）
      uploadLoading: false,  //上传时的loading
      localTabInited: false,  //本地上传点击tab初始化
      localSelectedItem: null, //本地上传选中的图片对象（最终发送给调用页面的结果）
    };
  },
  created() {
    
  },
  mounted() {
    this.preLoadObj = new Image();
  },
  methods: {

    /**************************** 多选相关 *******************************/

    //选择切换
    checkboxChange(item) {
      console.log(item.checked)
      console.log(item)
    },

    initHandler() {
      this.imgNow = 0;
      if(!this.localTabInited) {
        this.localTabInited = true;
        this.uploadLoading = true;
        const tempSaveFile = localStorage.getItem('localUploadFile');
        if (tempSaveFile) {
          if(tempSaveFile=="[null]"){
            this.fileList = [];
          }else{
            this.fileList = JSON.parse(tempSaveFile);
          }
        }else{
          this.fileList = [];
        }
        this.preload(this.fileList, 'url');
      }
      //如果是单选，则每次切换后当前选中的数据变为当前tab下的
      if(!this.isCheckbox){
        this.$emit('selectedItemUpdate', this.localSelectedItem, 'url');
      }
    },


    /**************************** 上传相关 *******************************/

    /* 上传前钩子 */
    beforeUpload(file) {

      const isJPG = file.type === 'image/jpg';
      const isJPEG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 3;
      const isNameRight = /\.jpg|\.jpeg|\.png|\.JPG|\.JPEG|\.PNG$/.test(file.name);
      if (!(isJPG || isJPEG || isPNG) || !isLt2M || !isNameRight) {
        this.$message.error('上传图片仅支持jpg,jpeg,png格式! 且上传图片大小不能超过 3MB!');
        this.failedList.push(file);
        this.uploadLoading = false;
      }
      if(this.successList.length + this.failedList.length === this.addList.length) {
        this.preload(this.fileList, 'url');
        this.addList = [];
        this.successList = [];
        this.failedList = [];
      }
      return (isJPG || isJPEG || isPNG) && isLt2M && isNameRight;
    },

    /* 上传成功钩子 */
    handleSuccess(response, file, fileList) {
      this.uploadAble = false;
      this.$nextTick(()=>{
        this.uploadAble = true;
      })
      let list = [];
      for(let item of fileList) {
        if(item.status == 'success') {
          list.push(item.response.data);
        }
      }
      this.fileList = list;
      localStorage.setItem('localUploadFile', JSON.stringify(this.fileList));
    },

    /* 上传失败 */
    handleError(err, file, fileList) {
      this.uploadLoading = true;
      if(file.status === 'fail') {
        this.failedList.push(file);
      }

      let list = [];
      for(let item of fileList) {
        if(item.status == 'success') {
          list.push(item.response.data);
        }
      }
      this.fileList = list;
      localStorage.setItem('localUploadFile', JSON.stringify(this.fileList));
    },

    /* 上传文件改变 */
    handleChange(file, fileList) {
      this.uploadLoading = true;
      this.imgNow = 0;
      if(file.status === 'ready') {
        this.addList.push(file);
      }
      if(file.status === 'success') {
        this.successList.push(file);
      }

      if(this.successList.length + this.failedList.length === this.addList.length) {
        this.preload(this.fileList, 'url');
        this.addList = [];
        this.successList = [];
        this.failedList = [];
      }
    },

    /* 上传超过个数的处理 */
    uploadLimit() {
      this.$message.warning('最多支持上传100张！');
    },

      /* 清除缓存 */
    clearTempSave() {
      localStorage.removeItem('localUploadFile');
      this.fileList = [];
      this.imgNow = 0;
    },


    /**************************** 瀑布流相关 *******************************/

    /* 选中图片 */
    selectImg(item) {
      //如果是多选，则不可选中图片，只能通过checkbox选择
      if(this.isCheckbox){
        return;
      }
      this.localSelectedItem = item;
      this.$emit('selectedItemUpdate', item, 'url');
    },

    /* 预加载 */
    preload(data, name) {
      const _self = this;
      if(!data.length) {
        //全部加载失败 
        _self.uploadLoading = false;
        return;
      }
      this.preLoadObj.src = data[this.imgNow][name];
      this.preLoadObj.onerror = function () {
          console.log("图片加载失败");
          _self.imgNow++;              
            if ( _self.imgNow < data.length ) {  //  如果还没有加载到最后一张
                _self.preload(data, name);          //  递归调用自己
            } else {                            //  已经加载到最后一张
                //全部加载完成 
                _self.uploadLoading = false;
                return;
            }
      }
      this.preLoadObj.onload = function () { 
            _self.imgNow++;              
            if ( _self.imgNow < data.length ) {  //  如果还没有加载到最后一张
                _self.preload(data, name);          //  递归调用自己
            } else {                            //  已经加载到最后一张
                //全部加载完成 
                _self.uploadLoading = false;
                return;
            }
        };

    },

  }
};
</script>

<style lang="scss" scoped>
.material_wrapper{
  max-height:390px;
  min-height:200px;
  overflow-y: auto;
  .cell-item {
    width: 100%;
    background: #fff;
    border: 1px solid #efeaea;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-bottom: 10px;
    cursor: pointer;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      max-width: 100%;
      @media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
        /* 兼容IE10和IE11 */
        height:100%;
      }
    }
    .item-body{
      padding: 10px 0;
      position: relative;
      width: 100%;
      height: 18px;
      background: rgba(0,0,0,0.39);
      .item-desc{
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        height: 100%;
        color: #fff;
        text-align: center;
        line-height: 18px;
        position: absolute;
        bottom: 0;
        left: 0;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .item-checkbox {
      width: 100%;
      height: 30px;
      padding-left: 5px;
      line-height: 30px;
      text-align: left;
    }
  }
  .cell-item-checkbox {
    cursor: default;
  }
  .img_active{
    border: 2px dashed $globalMainColor!important;
  }
  .img-checked-active {
    border: 2px solid $globalMainColor!important;
  }
}
/* *******************************本地上传样式*********************************** */
/deep/ .avatar-uploader{
  width: 80px;
  height: 80px;
  display: inline-block;
  vertical-align: middle;
  margin-bottom:20px;
  // margin-top:20px;
}
/deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
  }
/deep/ .avatar-uploader .el-upload:hover {
    border-color: #655EFF;
  }
/deep/ .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    position: absolute;
    top:10px;
    left:10px;
    z-index: 10;
  }
/deep/ .avatar {
    width: 80px;
    height: 80px;
    display: inline-block;
    vertical-align: middle;
/deep/ img{
      width: 80px;
      height: 80px;
      object-fit:fill;
      display: inline-block;
    }
  }
.txt_center{
  width: 100%;
  text-align: center;
  margin-top:20px;
}
</style>