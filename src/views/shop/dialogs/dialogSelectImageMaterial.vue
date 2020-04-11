/* 选择图片素材弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'选择图片'" @submit="submit" @close="close" :showFooter="false">

     <el-tabs v-model="currentTab">

      <!-- 图片素材 -->
      <el-tab-pane label="素材图片" name="material">
            <div class="material_head">
              <div class="select">
                <el-cascader :props="cascaderProps" @change="cascaderChange" placeholder="全部"></el-cascader>
              </div>
              <el-input v-model="materialName" placeholder="请输入图片名称" clearable></el-input>
              <el-button type="primary" @click="search">搜 索</el-button>
            </div>
            <div class="material_wrapper" ref="materialWrapper" v-loading="materialLoading" :style="{'overflow-y': materialLoading ? 'hidden' : 'auto'}">
                <waterfall :col='3' :width="250" :gutterWidth="10" :data="materialResultList" :isTransition="false" v-if="!materialLoading">
                  <template >
                    <div class="cell-item" :class="{'img_active':  materialSelectedItem && materialSelectedItem.id === item.id}" v-for="(item,key) in materialResultList" :key="key" @click="selectImg(item)">
                      <img :src="item.filePath" :style="imgStyle" alt="加载错误"/> 
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
                :page-sizes="[10, 20, 30, 50, 100]"
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
          <span class="title">图标分组</span>
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
        <div class="icon_wrapper" ref="systemWrapper" v-loading="localLoading">
          <div style="display:none">{{systemSelectedItem}}</div>
            <ul v-if="!localLoading">
              <li class="cell-item" :class="{'img_active': systemGroupId === systemLoadedGroupId ?  (systemRecordMap[systemGroupId] && systemRecordMap[systemGroupId].id === item.id) : (systemRecordMap[''] && systemRecordMap[''].id === item.id)}" v-for="(item,key) in systemResultList" :key="key" @click="selectImg(item)">
                <img :src="item.address" alt="加载错误"/> 
                <!-- <p class="item-desc">{{item.id}}</p> -->
              </li>
            </ul>
        </div>
        <p class="pages">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="systemCurrentPage"
            :page-sizes="[48, 96, 144, 240, 480]"
            :page-size="systemPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="systemTotal*1"
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
                  :limit="6"
                  :on-exceed="uploadLimit">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div v-loading="uploadLoading">
                  <waterfall :col='3' :width="250" :gutterWidth="10" v-if="!uploadLoading" :data="fileList" :isTransition="false" >
                    <template >
                      <div class="cell-item" :class="{'img_active': localSelectedItem && localSelectedItem.title === item.title}" v-for="(item,key) in fileList" :key="key" @click="selectImg(item)">
                        <img :src="item.url" alt="加载错误"/> 
                        <div class="item-body">
                            <div class="item-desc">{{item.original}}</div>
                        </div>
                      </div>
                    </template>
                  </waterfall>
                </div>
            </div>
            <p class="note" style="color: #d3d8df;margin-top:20px;">仅支持jpg,jpeg,png格式，大小不超过3.0MB <el-button v-if="!uploadLoading && fileList.length" type="text" style="margin-left:10px;font-size:14px;" @click="clearTempSave">清除上传记录</el-button></p>
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
          default: false,
          required: false
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
      imgNow: 0,  //当前预加载的第几张
      preLoadObj: null,  //预加载对象
      isIE: false,  //是否是IE

      /* 本地上传 */
      uploadUrl:`${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      fileList: [],  //最终用来显示的文件列表
      addList: [],  //添加的文件列表（上传前）
      successList: [],  //上传成功的文件列表(上传后)
      failedList: [],  //上传失败的文件列表（上传后）
      uploadLoading: false,  //上传时的loading
      localTabInited: false,  //本地上传点击tab初始化
      localSelectedItem: null, //本地上传选中的图片对象（最终发送给调用页面的结果）

      /* 素材库 */
      materialLoading: true,  //获取图片列表的loading
      materialResultList: [], //素材库列表数据
      materialCurrentPage:1,  //素材库当前页
      materialPageSize:10,   //素材库一页条数
      materialTotal:0,  //素材库总条数
      materialName: '',  //素材库文件名称，用于检索
      materialGroupId:'0',  //素材库分组id
      cascaderProps: {  //级联选择器属性
        lazy: true,  //是否懒加载
        checkStrictly: true,  //是否严格的遵守父子节点不互相关联
        lazyLoad: this.cascaderLazyload
      },
      materialTabInited: true,  //素材库点击tab初始化
      materialSelectedItem: null, //素材库选中的图片对象（最终发送给调用页面的结果）

      /* 系统图库 */
      localLoading: true, //系统图库loading
      systemResultList: [], //系统图库列表图片数据
      systemPageSize:48,    //系统图库一页条数
      systemCurrentPage:1,   //系统图库当前页
      systemTotal:0,  //系统图库总条数
      systemGroupId:'',  //系统图库分组id
      systemGroupList:[],  //系统图库分组列表
      systemTabInited: false,  //系统图标点击tab初始化
      systemSelectedItem: null, //系统图标选中的图片对象（最终发送给调用页面的结果）
      systemRecordMap: {},  //系统图标库选中记录表,
      systemLoadedGroupId: ''  //加载后确认的系统图标分组Id
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
    },

    imgStyle() {
      if(this.isIE) {
        return {
          height: '100%'
        }
      }else{
        return {}
      }
    }
  },
  watch:{

    /* 当前tab类型变化 */
    currentTab(newValue) {
      this.imgNow = 0;
      if(newValue == 'material') {
        if(!this.materialTabInited) {
          this.materialTabInited = true;
          this.materialGroupId = '0';
          this.fetchMaterial();
        }
      }else if(newValue == 'system') {
        if(!this.systemTabInited) {
          this.systemTabInited = true;
          this.getSystemIconGroups();
          this.fetchSystemIcon();
        }
      }else if(newValue === 'local') {
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
      }
    },

    //切换系统图标分组分页重置
    systemGroupId(newValue) {
      this.systemCurrentPage = 1;
      this.systemTotal = 0;
    }

  },
  created() {
    this.fetchMaterial(this.materialCurrentPage, this.materialPageSize);
  },
  mounted() {
    const _self = this;
    this.isIE = this.utils.isIE();
    this.preLoadObj = new Image();
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
    fetchMaterial(startIndex, pageSize) {
      this.materialLoading = true;
      this.imgNow = 0;
      this._apis.file.getMaterialList({
        fileGroupInfoId:this.materialGroupId == '0'?'':this.materialGroupId || '',
        startIndex: startIndex,
        pageSize: pageSize,
        sourceMaterialType:"0",
        fileName: this.materialName
      }).then((response)=>{
        this.materialSelectedItem = null;
        this.materialResultList = response.list;
        this.preload(response.list, 'filePath');
        this.materialTotal = response.total;
      }).catch((error)=>{
        this.$message.error(error);
        this.materialLoading = false;
      });
    },

    /* 查询系统图库 */
    fetchSystemIcon() {
      this.localLoading = true;
      this.imgNow = 0;
      this._apis.goodsOperate.getSystemIconByGroupId({
        groupId:this.systemGroupId || '',
        startIndex:this.systemCurrentPage,
        pageSize:this.systemPageSize,
      }).then((response)=>{
        this.systemResultList = response.list
        this.systemTotal = response.total
        this.systemLoadedGroupId = this.systemGroupId;
        this.systemSelectedItem = this.systemRecordMap[this.systemGroupId];
        this.preload(this.systemResultList, 'address');
      }).catch((error)=>{
        this.$message.error(error);
        this.localLoading = false;
      });
    },

    //查询素材库分组
    getMaterialGroups(parentId, callback){
      this._apis.file.getGroup({
        type:'0',
        parentId
      }).then((response)=>{
        callback && callback(response);
      }).catch((error)=>{
        this.$message.error(error);
      })
    },

    //查询系统图库分组
    getSystemIconGroups(){
      this._apis.goodsOperate.getSystemIconGroup({}).then((response)=>{
        this.systemGroupList = response
      }).catch((error)=>{
        this.$message.error(error);
      })
    },

    /**************************** 上传相关 *******************************/

    /* 上传前钩子 */
    beforeUpload(file) {

      const isJPG = file.type === 'image/jpg';
      const isJPEG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!(isJPG || isJPEG || isPNG)) {
        this.$message.error('上传图片支持jpg,jpeg,png格式!');
        this.failedList.push(file);
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 3MB!');
        this.failedList.push(file);
      }
      if(this.successList.length + this.failedList.length === this.addList.length) {
        this.preload(this.fileList, 'url');
        this.addList = [];
        this.successList = [];
        this.failedList = [];
      }
      return isJPG || isJPEG || isPNG && isLt2M;
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
      this.$message.warning('最多支持上传6张！');
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
      if(this.currentTab == 'material') {
       this.materialSelectedItem = item;
      }else if(this.currentTab == 'system') {
        this.systemSelectedItem = item;
        this.systemRecordMap[''] = item; 
        this.systemRecordMap[item.groupId] = item;
      }else if(this.currentTab === 'local') {
        this.localSelectedItem = item;
      }
    },

    /* 预加载 */
    preload(data, name) {
      const _self = this;
      if(!data.length) {
        //全部加载失败 
        _self.materialLoading = false;
        _self.uploadLoading = false;
        _self.localLoading = false;
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
                _self.materialLoading = false;
                _self.uploadLoading = false;
                _self.localLoading = false;
                return;
            }
      }
      this.preLoadObj.onload = function () { 
            _self.imgNow++;              
            if ( _self.imgNow < data.length ) {  //  如果还没有加载到最后一张
                _self.preload(data, name);          //  递归调用自己
            } else {                            //  已经加载到最后一张
                //全部加载完成 
                _self.materialLoading = false;
                _self.uploadLoading = false;
                _self.localLoading = false;
                return;
            }
        };

    },


    /**************************** 弹窗相关 *******************************/

    /* 向父组件提交选中的数据 */
    submit() {
      if(!this.materialSelectedItem && !this.systemSelectedItem && !this.localSelectedItem) {
        this.$message.warning('请选择图片后重试！');
        return;
      };
      let copyItem = {};

      if(this.currentTab == 'material') {
        copyItem = {...this.materialSelectedItem};
        copyItem['filePath'] = copyItem.filePath;
      }else if(this.currentTab == 'system') {
        copyItem = {...this.systemSelectedItem};
        copyItem['filePath'] = copyItem.address;
      }else if(this.currentTab === 'local') {
        copyItem = {...this.localSelectedItem};
        copyItem['filePath'] = copyItem.url;
      }
      this.$emit('imageSelected',  copyItem);
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
        this.fetchMaterial(this.materialCurrentPage, this.materialPageSize);
      }else if(this.currentTab == 'system') {
        this.systemPageSize = val || this.systemPageSize;
        this.fetchSystemIcon();
      }
    },

    /* 当前页改变 */
    handleCurrentChange(pIndex){
      if(this.currentTab == 'material') {
        this.materialCurrentPage = pIndex || this.materialCurrentPage;
        this.fetchMaterial(this.materialCurrentPage, this.materialPageSize);
      }else if(this.currentTab == 'system') {
        this.systemCurrentPage = pIndex || this.systemCurrentPage;
        this.fetchSystemIcon();
      }
    },

    /************************ 素材库分组，级联选择器分相关   **********************/

    /* 级联选择器选中改变，赋值给分组id，用于获取图片列表 */
    cascaderChange(value) {
      let val=value.length-1;
      this.materialGroupId = value[val];
    },

    /* 级联选择器懒加载回调 */
    cascaderLazyload(node, resolve) {
      const { level } = node;
      const { data } = node;
      let parentId = data ? data.value : '0';
      this.materialGroupId = data ? data.value: '0';
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
    },
    //搜索
    search() {
      this.materialCurrentPage = 1;
      this.fetchMaterial(this.materialCurrentPage, this.materialPageSize);
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