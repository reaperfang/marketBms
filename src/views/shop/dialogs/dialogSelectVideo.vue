/* 选择视频素材弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'选择视频'" @submit="submit" @close="close" :showFooter="false">

     <el-tabs v-model="currentTab" style="margin-bottom:40px;">

      <!-- 图片素材 -->
      <el-tab-pane label="素材视频" name="material">
            <div class="material_head">
              <div class="select">
                <el-cascader :props="cascaderProps" @change="cascaderChange" placeholder="全部"></el-cascader>
              </div>
              <el-input v-model="materialName" placeholder="请输入视频名称" clearable></el-input>
              <el-button type="primary" @click="fetchMaterial">搜 索</el-button>
            </div>

            <div class="material_wrapper" ref="materialWrapper" v-loading="materialLoading" :style="{'overflow-y': materialLoading ? 'hidden' : 'auto'}">
              <template v-if="materialResultList.length">
                <ul class="tile-list n3 video_list" v-if="materialResultList.length">
                  <li v-for="(item, key) of materialResultList" :key="key" class="cell-item" @click="selectVideo($event, item)">
                    <div class="video_head">
                      <span>{{item.createTime}}</span>
                      <span>{{(item.fileSize ? Math.floor(item.fileSize / 1024 / 1024 * 100) / 100 + 'MB' : '-- MB')}}</span>
                    </div>
                    <div class="video_body">
                      <p>{{item.name}}</p>
                      <video
                        :src="item.filePath"
                        controls="controls"
                        class="video"
                        :poster="item.fileCover"
                      >您的浏览器不支持 video 标签。</video>
                    </div>
                  </li>
                </ul>
              </template>
              <p class="empty" v-else>暂无数据</p>
            </div>
            <p class="pages" v-if="materialResultList.length">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="materialCurrentPage"
                :page-sizes="[9, 18, 27, 45, 90, 100]"
                :page-size="materialPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="materialTotal*1"
                class="page_nav">
                </el-pagination>
            </p>
      </el-tab-pane>

      <!-- 本地上传 -->
      <el-tab-pane label="本地上传" name="local">
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
                  :on-progress="uploadVideoProcess"
                  :limit="6"
                  :on-exceed="uploadLimit">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="material_wrapper" ref="localWrapper" v-loading="uploadLoading" :style="{'overflow-y': uploadLoading ? 'hidden' : 'auto'}">
                    <ul class="tile-list n3 video_list" v-if="fileList.length" ref="localWrapper">
                      <li v-for="(item, key) of fileList" :key="key" class="cell-item" @click="selectVideo($event, item)">
                        <div class="video_head">
                          <span>{{item.createTime}}</span>
                          <span>{{item.size ? Math.floor(item.size / 1024 / 1024 * 100) / 100 + 'MB' : '-- MB'}}</span>
                        </div>
                        <div class="video_body"> 
                          <p>{{item.original}}</p>
                          <video
                            :src="item.url"
                            controls="controls"
                            class="video"
                            :poster="item.frameUrl"
                          >您的浏览器不支持 video 标签。</video>
                        </div>
                      </li>
                    </ul>
                </div>
            </div>
            <p class="note" style="color: #d3d8df;margin-top:10px;height: 16px;">大小不超过10mb，支持mp4格式 <el-button v-if="!uploadLoading && fileList.length" type="text" style="margin-left:10px;font-size:14px;" @click="clearTempSave">清除上传记录</el-button></p>
      </el-tab-pane>
    </el-tabs>

    <span class="dialog-footer fcc" style="margin-top:40px;">
            <el-button type="primary" @click="submit">确 认</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogSelectVideo",
  components: {DialogBase},
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
  },
  data() {
    return {
      currentTab: 'material',  //来源类型 =>  material:素材库 / local:本地上传  /  system:系统图片
      uploadAble: true,  //上传是否可用(用来清上传器缓存)

      /* 本地上传 */
      uploadUrl:`${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      fileList: [],  //最终用来显示的文件列表
      addList: [],  //添加的文件列表（上传前）
      successList: [],  //上传成功的文件列表(上传后)
      failedList: [],  //上传失败的文件列表（上传后）
      uploadLoading: false,  //上传时的loading
      localTabInited: false,  //本地上传点击tab初始化
      localSelectedItem: null, //本地上传选中的视频对象（最终发送给调用页面的结果）

      /* 素材库 */
      materialLoading: true,  //获取视频列表的loading
      materialResultList: [], //素材库列表数据
      materialCurrentPage:1,  //素材库当前页
      materialPageSize:9,   //素材库一页条数
      materialTotal:0,  //素材库总条数
      materialName: '',  //素材库文件名称，用于检索
      materialGroupId:'',  //素材库分组id
      cascaderProps: {  //级联选择器属性
        lazy: true,  //是否懒加载
        checkStrictly: true,  //是否严格的遵守父子节点不互相关联
        lazyLoad: this.cascaderLazyload
      },
      materialTabInited: true,  //素材库点击tab初始化
      materialSelectedItem: null //素材库选中的视频对象（最终发送给调用页面的结果）

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

    /* 当前tab类型变化 */
    currentTab(newValue) {
      if(newValue == 'material') {
        if(!this.materialTabInited) {
          this.materialTabInited = true;
          this.materialGroupId = '';
          this.fetchMaterial();
        }
      }else if(newValue === 'local') {
        if(!this.localTabInited) {
          this.localTabInited = true;
          const tempSaveFile = localStorage.getItem('localUploadVideoFile');
          if(tempSaveFile) {
            this.fileList = JSON.parse(tempSaveFile);
          }
        }
      }
    }
  },
  created() {
    this.fetchMaterial();
  },
  mounted() {
    const _self = this;
    this.$nextTick(() => {
      if(this.$parent.$refs.dialog) {
        let zIndex = this.$el.style.zIndex;
        zIndex = Number(zIndex) + 2;
        this.$parent.$el.style.zIndex = zIndex + '';
      }
    })
  },
  methods: {

    /**************************** 列表数据拉取相关 *******************************/

    /* 查询素材库图片 */
    fetchMaterial() {
      this.materialLoading = true;
      this._apis.file.getMaterialList({
        fileGroupInfoId:this.materialGroupId || '',
        startIndex:this.materialCurrentPage,
        pageSize:this.materialPageSize,
        sourceMaterialType:"2",
        fileName: this.materialName
      }).then((response)=>{
        this.materialResultList = response.list;
        this.materialTotal = response.total;
        this.materialLoading = false;
      }).catch((error)=>{
        this.$message.error(error);
        this.materialLoading = false;
      });
    },

    //查询素材库分组
    getMaterialGroups(parentId, callback){
      this._apis.file.getGroup({
        type:'1',
        parentId
      }).then((response)=>{
        callback && callback(response);
      }).catch((error)=>{
        this.$message.error(error);
      })
    },

    /**************************** 上传相关 *******************************/

    /* 上传前钩子 */
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      // if (!['video/mp4', 'video/mov', 'video/m4v', 'video/flv', 'video/x-flv', 'video/mkv', 'video/wmv', 'video/avi', 'video/rmvb', 'video/3gp'].includes(file.type) || !isLt10M) {
      if (!['video/mp4'].includes(file.type) || !isLt10M) {
        this.$message.error('请上传正确的视频格式! 且上传视频大小不能超过 10MB!');
        this.failedList.push(file);
        this.uploadLoading = false;
        return false;
      }
      return true;
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
      localStorage.setItem('localUploadVideoFile', JSON.stringify(this.fileList));
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
      localStorage.setItem('localUploadVideoFile', JSON.stringify(this.fileList));
    },

    /* 上传文件改变 */
    handleChange(file, fileList) {
      this.uploadLoading = true;
      if(file.status === 'ready') {
        this.addList.push(file);
      }
      if(file.status === 'success') {
        this.successList.push(file);
      }

      if(this.successList.length + this.failedList.length === this.addList.length) {
        this.uploadLoading = false;
        this.addList = [];
        this.successList = [];
        this.failedList = [];
      }
    },

     /* 上传超过个数的处理 */
    uploadLimit() {
      this.$message.warning('最多支持上传6个视频！');
    },

     //进度条
	  uploadVideoProcess (event, file, fileList) {
        // this.videoFlag = true;
        // this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },

      /* 清除缓存 */
    clearTempSave() {
      localStorage.removeItem('localUploadVideoFile');
      this.fileList = [];
    },

    /**************************** 弹窗相关 *******************************/

     /* 选中视频 */
    selectVideo(event, item) {
      let ref = '';
      if(this.currentTab == 'material') {
       this.materialSelectedItem = item;
        ref = 'materialWrapper';
      }else if(this.currentTab === 'local') {
        this.localSelectedItem = item;
        ref = 'localWrapper';
      }

      const videos = this.$refs[ref].querySelectorAll('.cell-item');
      for(let dom of videos) {
        dom.className = 'cell-item';
      };
      event.currentTarget.className = 'cell-item video_active';
    },

    /* 向父组件提交选中的数据 */
    submit() {
      if(!this.materialSelectedItem && !this.localSelectedItem) {
        this.$message.warning('请选择视频后重试！');
        return;
      };
      let copyItem = {};

      if(this.currentTab == 'material') {
        copyItem = {...this.materialSelectedItem};
        copyItem['filePath'] = copyItem.filePath;
        copyItem['fileCover'] = copyItem.fileCover;
      }else if(this.currentTab === 'local') {
        copyItem = {...this.localSelectedItem};
        copyItem['filePath'] = copyItem.url;
        copyItem['fileCover'] = copyItem.frameUrl;
      }
      this.$emit('videoSelected',  copyItem);
      this.close();
    },

    /* 关闭弹窗 */
    close() {
      this.dialogVisible = false;
      this.visible = false;
    },

    /*************************** 分页相关  ****************************/

    /* 分页大小改变 */
    handleSizeChange(val){
      if(this.currentTab == 'material') {
        this.materialPageSize = val || this.materialPageSize;
        this.fetchMaterial();
      }
    },

    /* 当前页改变 */
    handleCurrentChange(pIndex){
      if(this.currentTab == 'material') {
        this.materialCurrentPage = pIndex || this.materialCurrentPage;
        this.fetchMaterial();
      }
    },

    /************************ 素材库分组，级联选择器分相关   **********************/

    /* 级联选择器选中改变，赋值给分组id，用于获取图片列表 */
    cascaderChange(value) {
      let val=value.length-1;
      this.materialGroupId = value[val] === '0' ? '' : value[val];
    },

    /* 级联选择器懒加载回调 */
    cascaderLazyload(node, resolve) {
      const { level } = node;
      const { data } = node;
      let parentId = data ? data.value : '0';
      this.materialGroupId = data ? data.value: '';
      this.getMaterialGroups(parentId, (response)=>{
        let nodes = level === 0 ?[{
          value: '0',
          label: '全部',
          leaf: true
        }] : [];
        if(response && Array.isArray(response)) {
          for(let item of response) {
            nodes.push({
              value: item.id,
              label: item.name
            })
          }
        }
        // 通过调用resolve将子节点数据返回，通知组件数据加载完成
        resolve(nodes);
      });
    }

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

/* 视频列表区域样式 */
ul.video_list{
  li{
    border: 1px solid #ddd;
    cursor:pointer;
    &.video_active{
      border: 2px dashed $globalMainColor!important;
    }
  }
}
.video_head{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding:5px 20px;
}
.video_body{
  border-top: 1px solid #ddd;
  p{
    text-align:left;
    padding:5px 20px;
  }
  video{
    width: 100%;
    padding: 20px;
    padding-top: 0;
    height: 210px;
  }
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