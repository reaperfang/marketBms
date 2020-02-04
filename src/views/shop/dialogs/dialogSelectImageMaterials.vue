/* 选择图片素材弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'选择图片'" @submit="submit">
    <div class="material_head">
      <div class="select">
        <el-select v-model="ruleForm.group" placeholder="">
          <el-option label="全部" :value="1"></el-option>
          <el-option label="文章配图" :value="2"></el-option>
          <el-option label="封面配图" :value="3"></el-option>
        </el-select>
      </div>
      <el-upload
          :action="uploadUrl"
          :data="{json: JSON.stringify({cid:cid})}"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-remove="beforeRemove"
          :on-change="handleChange"
          :before-upload="beforeUpload"
          @clearFiles="clearUploadFiles"
          multiple
          :on-exceed="handleExceed"
          :file-list="fileList">
           <el-button size="small" type="primary">上传新图片</el-button>
      </el-upload>
    </div>
    <div class="material_wrapper" ref="materialWrapper" v-loading="loading" :style="{'overflow-y': loading ? 'hidden' : 'auto'}">
        <waterfall :col='3' :width="250" :gutterWidth="10"  :data="imgsArr" :isTransition="false" >
          <template >
            <div class="cell-item" v-for="(item,key) in imgsArr" :key="key" @click="selectImg($event, item)">
              <img :src="item.filePath" alt="加载错误" @load="loadImg($event, item)" @error="loadError($event, item)"/> 
              <div class="item-body">
                  <div class="item-desc">{{item.fileName}}</div>
              </div>
            </div>
          </template>
        </waterfall>
    </div>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogSelectImageMaterial",
  components: {DialogBase},
  props: {
      data: {},
      dialogVisible: {
          type: Boolean,
          required: true
      },
  },
  data() {
    return {
      loading: true,
      selectedItem: null,
      imgsArr: [], //维护的图片数据
      fileList: [],  //用来显示进度条的列表
      ruleForm: {
        group: 1
      },
      uploadUrl: `${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      uploadState: []   //本次上传状态列表
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
    }
  },
  created() {
    this.fetch();
  },
  computed:{
      cid(){
          let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
          return shopInfo.id
      }
  },
  methods: {

    fetch() {
      this.loading = true;
      this._apis.file.getMaterialList({
        fileGroupInfoId:"",
        startIndex:"1",
        pageSize:"10",
        sourceMaterialType:"0",
      }).then((response)=>{
        this.imgsArr = response.list;
        this.loading = false;
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
        this.loading = false;
      });
    },

    /**************************** 上传相关  开始 *******************************/

    /* 移除上传队列中的某一条钩子 */
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },

    /* 上传预览钩子 */
    handlePreview(file) {
      console.log(file);
    },

    /* 上传执行钩子 */
    handleExceed(files, fileList) {
      // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },

    /* 移除上传队列中的某一条前的钩子 */
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },

    /* 上传按钮改变钩子 */
    handleChange(file, fileList) {
      if(file.status === 'ready' && !this.uploadState.includes(file)) {
        this.uploadState.push(file);
      }
    },

    /* 上传前钩子 */
    beforeUpload(file) {
      if(!file) {
        this.loading = false;
      }else{
        this.loading = true;
      }
    },

    /* 上传成功钩子 */
    handleSuccess(response, file, fileList) {
      if(file.status == "success"){
          this.allImgUploaded();
          this.imgsArr.push({
            loaded: false,
            href: '',
            title: response.original,
            src: `http://35.201.165.105:8000${response.url}`
          })
      }else{
          this.$message.error(response.msg);
      }
    },

    /* 上传失败钩子 */
    handleError(error, file, fileList) {
      this.allImgUploaded();
      this.imgsArr.push({
        loaded: false,
        href: '',
        title: file.name,
        src: ``
      })
    },

     /* 检测全部图片上传结束 */
    allImgUploaded() {
      let bAllUploaded = true;
      for(let item of this.uploadState){
        if(item.status !== 'success'){
          bAllUploaded = false;
          break;
        }
      }

      if(bAllUploaded) {
        this.clearUploadFiles();
      }
    },

    /* 清除上传进度条 */
    clearUploadFiles() {
      this.uploadState = [];
      const allProgress = document.querySelectorAll('.el-upload-list__item');
      for(let item of allProgress) {
        item.parentNode.removeChild(item);
      }
    },
    /**************************** 上传相关  结束 *******************************/



    /**************************** 瀑布流相关  开始 *******************************/

    /* 选中图片 */
    selectImg(event, item) {
      this.selectedItem = item;

      const imgs = this.$refs.materialWrapper.querySelectorAll('.cell-item');
      for(let item of imgs) {
        item.className = 'cell-item';
      };
      event.currentTarget.className = 'cell-item img_active';
    },


    /* 成功加载图片 */
    loadImg(event, item) {
      this.$set(item, 'loaded', true);
      this.allImgLoaded();
    },

    /* 图片加载失败 */
    loadError(event, item) {
      this.$set(item, 'loaded', true);  //只要加载了都算成功，用来后面统计
      this.allImgLoaded();
    },

    /* 检测全部图片加载结束 */
    allImgLoaded() {
      let loadedLength = 0;
      for(let item of this.imgsArr){
        if(item.loaded){
          loadedLength ++;
        }
      }

      if(loadedLength === this.imgsArr.length) {
        this.loading = false;
      }
    },

    scroll(scrollData){
        console.log(scrollData)
    },
    switchCol(col){
        this.col = col
        console.log(this.col)
    },
    loadmore(index){
        this.data = this.data.concat(this.data)
    },

    /**************************** 瀑布流相关  结束 *******************************/

    /* 向父组件提交选中的数据 */
    submit() {
      this.$emit('imageSelected',  this.selectedItem);
    },


  }
};
</script>

<style lang="scss">
.material_head{
  margin-bottom:20px;
    .select{
      display: flex;
      padding-left: 5px;
    }
    .upload-demo{
      width:100%;
      position:relative;
      .el-upload{
        position: absolute;
        right: 20px;
        top: -65px;
      }
      .el-upload-list{
        .el-upload-list__item {
            width: 100% !important;
            height: 30px !important;
            text-align: left;
            background: #f1efef;
        }
      }
    }
}
.material_wrapper{
  height:390px;
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
    }
    .item-body{
      padding:10px 0;
    }
  }
  .img_active{
    border: 2px dashed $globalMainColor!important;
  }
}
</style>