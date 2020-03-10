/* 选择图片素材弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'图片素材'" @submit="submit" @close="close" :showFooter="false">

     <el-tabs v-model="currentTab">

      <!-- 图片素材 -->
      <el-tab-pane label="图片素材" name="material">
          <div class="material_head">
            <div class="select">
              <el-select v-model="materialGroupId" placeholder="全部">
                <el-option value="">全部</el-option>
                <el-option
                    v-for="item in materialGroupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
              </el-select>
              </div>
              <el-input v-model="materialName" placeholder="请输入图片名称" clearable></el-input>
              <el-button type="primary" @click="fetchMaterial">搜 索</el-button>
            </div>
            <div class="material_wrapper" ref="materialWrapper" v-loading="loading" :style="{'overflow-y': loading ? 'hidden' : 'auto'}">
                <waterfall :col='3' :width="250" :gutterWidth="10" :data="materialResultList" :isTransition="false" >
                  <template >
                    <div class="cell-item" v-for="(item,key) in materialResultList" :key="key" @click="selectImg($event, item)">
                      <img :src="item.filePath" :lazy-src="item.filePath" alt="加载错误" @load="loadImg($event, item)" @error="loadError($event, item)"/> 
                      <div class="item-body">
                          <div class="item-desc">{{item.fileName}}</div>
                      </div>
                    </div>
                  </template>
                </waterfall>
            </div>
            <p class="pages">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="materialCurrentPage"
                :page-sizes="[40, 60, 100, 200]"
                :page-size="materialPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="materialTotal*1"
                class="page_nav">
                </el-pagination>
            </p>
      </el-tab-pane>


      <!-- 系统素材 -->
      <el-tab-pane label="系统图标" name="system" v-if="showSystemIcon">
        <div class="icon_head">
          <span class="title">ICON分组</span>
          <div class="select">
            <el-select v-model="systemGroupId" placeholder="全部">
              <el-option value="">全部</el-option>
              <el-option
                  v-for="item in systemGroupList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
            </el-select>
          </div>
          <el-button type="primary" @click="fetchSystemIcon">搜 索</el-button>
        </div>
        <div class="icon_wrapper" ref="systemWrapper" v-loading="loading">
            <ul>
              <li class="cell-item" v-for="(item,key) in systemResultList" :key="key" @click="selectImg($event, item)">
                <img :src="item.address" alt="加载错误" @load="loadImg($event, item)" @error="loadError($event, item)"/> 
                <!-- <p class="item-desc">{{item.id}}</p> -->
              </li>
            </ul>
        </div>
        <p class="pages">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="systemCurrentPage"
            :page-sizes="[40, 60, 100, 200]"
            :page-size="systemPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="systemTotal*1"
            class="page_nav">
            </el-pagination>
        </p>
      </el-tab-pane>
      <!-- 本地上传 -->
      <el-tab-pane label="本地上传" name="local">
        <el-form :model="form" class="demo-form-inline" label-width="0px">
          <el-form-item label="">
             <div class="icon_wrapper icon_wrapper_2" ref="localWrapper" v-loading="loading">
                <ul>
                  <li>
                    <el-upload
                      :multiple="multipleUpload"
                      class="avatar-uploader"
                      v-loading="uploadLoading"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :data="{json: JSON.stringify({cid: cid})}"
                      @on-error="uploadLoading = false"
                      :before-upload="beforeAvatarUpload" 
                      :on-success="handleSuccess"
                      :on-progress="handleProgress">
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </li>
                  <li class="cell-item" v-for="(item,key) in fileList" :key="key" @click="selectImg($event, item)">
                    <img :src="item.url" alt="加载错误" @load="loadImg($event, item)" @error="loadError($event, item)"/> 
                    <!-- <p class="item-desc">{{item.id}}</p> -->
                  </li>
                </ul>
            </div>
            <p class="note">仅支持jpg,jpeg,png格式，大小不超过3.0MB <el-button v-if="fileList.length" type="text" style="margin-left:10px;font-size:14px;" @click="clearTempSave">清除上传记录</el-button></p>
          </el-form-item>
          <!-- <el-form-item label="分组">
            <el-select v-model="form.groupValue" placeholder="请选择">
              <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <span class="dialog-footer fcc">
            <el-button type="primary" @click="submit">确 认</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
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
      showSystemIcon: {
          type: Boolean,
          required: false
      },
      multipleUpload: {
          type: Boolean,
          required: false
      },
  },
  data() {
    return {
      loading: true,
      currentTab: 'material',  //  material:素材库 / local:本地上传  /  system:系统图片
      selectedItem: null,

      /* 本地上传 */
      uploadUrl:`${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      fileList: [],  //用来显示进度条的列表
      uploadState: [],
      form:{
        imageUrl:'',
        name:'',
        groupValue:'-1',
        imageUrls:''
      },
      groupList:[],
      uploadLoading: false,

      /* 素材库 */
      materialResultList: [], //素材库列表数据
      materialCurrentPage:1,  //素材库当前页
      materialPageSize:40,   //素材库一页条数
      materialTotal:0,  //素材库总条数
      materialName: '',  //素材库文件名称，用于检索
      materialGroupId:'',  //素材库分组id
      materialGroupList:[],  //素材库分组列表

      /* 系统图库 */
      systemResultList: [], //系统图库列表图片数据
      systemPageSize:40,    //系统图库一页条数
      systemCurrentPage:1,   //系统图库当前页
      systemTotal:0,  //系统图库总条数
      systemGroupId:'',  //系统图库分组id
      systemGroupList:[],  //系统图库分组列表
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

    cid(){
        let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
        return shopInfo.id
    }
  },
  watch:{

    /* 素材库分组id变化 */
    materialGroupId(){
      this.fetchMaterial()
    },

    /* 系统图库分组id变化 */
    systemGroupId() {
      this.getSystemIconGroups();
    },

    /* 当前tab类型变化 */
    currentTab(newValue) {
      if(newValue == 'material') {
        this.getMaterialGroups();
        this.fetchMaterial();
      }else if(newValue == 'system') {
        this.getSystemIconGroups();
        this.fetchSystemIcon();
      }else if(newValue === 'local') {
        // this.fileList = [];
      }
    }
  },
  created() {
    this.getMaterialGroups();
    this.fetchMaterial();
  },
  mounted() {
    this.$nextTick(() => {
      if(this.$parent.$refs.dialog) {
        let zIndex = this.$el.style.zIndex;
        zIndex = Number(zIndex) + 2;
        this.$parent.$el.style.zIndex = zIndex + '';
      }
    })

    const tempSaveFile = localStorage.getItem('localUploadFile');
    if(tempSaveFile) {
      this.fileList = JSON.parse(tempSaveFile);
    }
  },
  methods: {

    /* 查询素材库图片 */
    fetchMaterial() {
      this.loading = true;
      this._apis.file.getMaterialList({
        fileGroupInfoId:this.materialGroupId || '',
        startIndex:this.materialCurrentPage,
        pageSize:this.materialPageSize,
        sourceMaterialType:"0",
        materialName: ''
      }).then((response)=>{
        this.materialResultList = response.list
        this.materialTotal = response.total
        const container = document.querySelector('.material_wrapper');
        if(container) {
          container.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        }
        this.loading = false
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
        this.loading = false;
      });
    },

    /* 查询系统图库 */
    fetchSystemIcon() {
      this.loading = true;
      this._apis.goodsOperate.getSystemIconByGroupId({
        groupId:this.systemGroupId || '',
        startIndex:this.systemCurrentPage,
        pageSize:this.systemPageSize,
      }).then((response)=>{
        this.systemResultList = response.list
        this.systemTotal = response.total
        const container = document.querySelector('.icon_wrapper');
        if(container) {
          container.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        }
        this.loading = false
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
        this.loading = false;
      });
    },

    //查询素材库分组
    getMaterialGroups(){
      this._apis.file.getGroup({
        type:'0',
        parentId: '1'
      }).then((response)=>{
        this.materialGroupList = response
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },

    //查询系统图库分组
    getSystemIconGroups(){
      this._apis.goodsOperate.getSystemIconGroup({}).then((response)=>{
        this.systemGroupList = response
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
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
      console.log(arguments)
      let list = [];
      for(let item of fileList) {
        if(item.status == 'success') {
          list.push(item.response.data);
        }
      }
      this.fileList = list;
      localStorage.setItem('localUploadFile', JSON.stringify(this.fileList));
      this.uploadLoading = false
    },  
    
    /* 上传进度钩子 */
    handleProgress(event, file, fileList) {
      console.log(arguments)
      
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
      let ref = '';
      if(this.currentTab == 'material') {
        ref = 'materialWrapper';
      }else if(this.currentTab == 'system') {
        ref = 'systemWrapper';
      }else if(this.currentTab === 'local') {
        ref = 'localWrapper';
      }

      const imgs = this.$refs[ref].querySelectorAll('.cell-item');
      for(let item of imgs) {
        item.className = 'cell-item';
      };
      event.currentTarget.className = 'cell-item img_active';
    },


    /* 成功加载图片 */
    loadImg(event, item) {
      // this.$set(item, 'loaded', true);
      // this.allImgLoaded();
    },

    /* 图片加载失败 */
    loadError(event, item) {
      // this.$set(item, 'loaded', true);  //只要加载了都算成功，用来后面统计
      // this.allImgLoaded();
    },

    /* 检测全部图片加载结束 */
    allImgLoaded() {
      // let loadedLength = 0;
      // for(let item of this.materialResultList){
      //   if(item.loaded){
      //     loadedLength ++;
      //   }
      // }

      // if(loadedLength === this.materialResultList.length - 1) {
      //   this.loading = false;
      // }
    },

    scroll(scrollData){
        // console.log(scrollData)
    },
    switchCol(col){
        // this.col = col
        // console.log(this.col)
    },
    loadmore(index){
        // this.data = this.data.concat(this.data)
    },

    /**************************** 瀑布流相关  结束 *******************************/

    /* 向父组件提交选中的数据 */
    submit() {
      if(!this.selectedItem) {
        this.$notify({
          title: '提示',
          message: '请选择图片后重试！',
          type: 'warning'
        });
        return;
      };
      const copyItem = {...this.selectedItem};

      if(this.currentTab == 'material') {
        copyItem['filePath'] = copyItem.filePath;
      }else if(this.currentTab == 'system') {
        copyItem['filePath'] = copyItem.address;
      }else if(this.currentTab === 'local') {
        copyItem['filePath'] = copyItem.url;
      }
      this.$emit('imageSelected',  copyItem);
      this.dialogVisible = false;
      this.visible = false;
    },

    close() {
      this.dialogVisible = false;
      this.visible = false;
    },

    /**********************************        分页相关      **********************/
    handleSizeChange(val){
      if(this.currentTab == 'material') {
        this.materialPageSize = val || this.materialPageSize;
        this.fetchMaterial();
      }else if(this.currentTab == 'system') {
        this.systemPageSize = val || this.systemPageSize;
        this.fetchSystemIcon();
      }else if(this.currentTab === 'local') {
        //TODO
      }
    },

    handleCurrentChange(pIndex){
      if(this.currentTab == 'material') {
        this.materialCurrentPage = pIndex || this.materialCurrentPage;
        this.fetchMaterial();
      }else if(this.currentTab == 'system') {
        this.systemCurrentPage = pIndex || this.systemCurrentPage;
        this.fetchSystemIcon();
      }else if(this.currentTab === 'local') {
        //TODO
      }
    },

    handleAvatarSuccess(res, file) {
      this.uploadLoading = false
      this.fileData = res.data
      this.form.imageUrl = res.data.url
    },

    beforeAvatarUpload(file) {
      this.uploadLoading = true
      const isJPG = file.type === 'image/jpg';
      const isJPEG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!(isJPG || isJPEG || isPNG)) {
        this.$message.error('上传图片支持jpg,jpeg,png格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 3MB!');
      }
      return isJPG || isJPEG || isPNG && isLt2M;
    },

    /* 清除缓存 */
    clearTempSave() {
      sessionStorage.removeItem('localUploadFile');
      this.fileList = [];
    }

  }
};
</script>

<style lang="scss" scoped>

.pages{
  text-align: center;
  margin-top: 20px;
}

/* *******************************素材库样式*********************************** */
.material_head{
  margin-bottom:20px;
  display: flex;
    flex-direction: row;
    .select{
      display: flex;
      padding-left: 5px;
      margin-right:20px;
    }
    .el-input{
      margin-right:20px;
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
    }
    .item-body{
      padding:10px 0;
    }
  }
  .img_active{
    border: 2px dashed $globalMainColor!important;
  }
}


/* *******************************系统素材样式*********************************** */
.icon_head{
    margin-bottom:20px;
    display: flex;
    flex-direction: row;
    .title{
      font-size:14px;
      font-family:MicrosoftYaHei;
      color:rgba(68,67,75,1);
      margin-right:10px;
      line-height: 30px;
    }
    .select{
      padding-left: 5px;
      margin-right:20px;
    }
}
.icon_wrapper{
  height:390px;
  overflow-y: auto;
  &.icon_wrapper_2{
    max-height:390px;
    height:auto;
  }
  ul{
    display: grid;
    grid-template-columns: repeat(8,1fr);
    grid-gap: 10px;
    .cell-item {
      width: 100%;
      height: 80px;
      background: rgba(211,211,211,1);
      border: 1px solid transparent;
      cursor: pointer;
      align-items: center;
      position: relative;
      display:flex;
      flex-direction: row;
      justify-content: center;
      img{
        width: 80px;
        height:100%;
        object-fit: scale-down;
      }
      .item-desc{
        width: 100%;
        height:18px;
        background:rgba(0,0,0,0.39);
        color:#fff;
        text-align:center;
        line-height:18px;
        position:absolute;
        bottom:0;
        left:0;
      }
    }
    .img_active{
      border: 2px dashed $globalMainColor!important;
    }
  }
}


/* *******************************本地上传样式*********************************** */
/deep/ .avatar-uploader{
  width: 80px;
  height: 80px;
  display: inline-block;
  vertical-align: middle;
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
    border-color: #409EFF;
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