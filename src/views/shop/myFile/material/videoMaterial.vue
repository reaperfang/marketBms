<template>
  <div>
    <div class="head">
      <div class="head-wrapper">
        <el-input v-model="searchWord" placeholder="请输入视频名称" class="search_w inline"></el-input>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
      <div>
        <el-button type="primary" plain @click="syncImage">同步微信</el-button>
        <el-button type="primary" plain @click="uploadImage">上传视频</el-button>
      </div>
    </div>
    <div class="list">
      <p class="list_top">视频素材<span>{{total*1}}</span>条</p>
      <div class="list_main">
        <div class="list_img">
           <div class="imgs">
            <div class="item_img" v-for="item in list" :key="item.id">
              <p class="img_head">
                <span>
                  <el-checkbox v-model="item.checked" @change="handleChecked"></el-checkbox>
                  {{item.updateTime}}
                  </span>
                  <span>
                    <i class="wx_icon" v-if="item.isSyncWechat"></i>
                    <!-- {{item.fileSize || 0}} MB -->
                  </span>
              </p>
              <div class="img_body">
                <p class="title">{{item.title}}</p>
                <!-- <video v-if="item.filePath !=''"  
                :src="item.filePath"
                class="avatar video-avatar"
                controls="controls">您的浏览器不支持视频播放</video>  -->
                <img :src="getCover(item)" class="imgs" v-if="item.fileCover">
                <div v-else class="imgs_cover"></div>
                <span class="btn" @click="openVideo(item)"></span>
              </div>
              <p class="img_bottom">
                <!-- <span @click="uploadImage(item.id,'videoId')"><i class="el-icon-edit"></i></span> -->
                <span @click="moveGroup(item.id,item.fileGroupInfoId)"><i class="el-icon-folder"></i></span>
                <span @click="downVideo(item.filePath,item.fileName)"><i class="el-icon-video-camera"></i></span>
                <span @click="deleteImage(item.id,'videoId')"><i class="el-icon-delete"></i></span>
              </p>
              <p class="img_name">{{item.fileName}}</p>
            </div>
           </div>
           <p style="margin-top: -30px;" class="table-select">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="allChecked">全选</el-checkbox>
            <el-button class="border-button" plain @click="deleteImages">批量删除</el-button>
            <el-button class="border-button" plain @click="moveGroups">移动分组</el-button>
           </p>
           <p class="pages">
              <el-pagination
              :background="true"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="prev, pager, next, sizes"
              :total="total*1"
              class="page_nav">
              </el-pagination>
           </p>
        </div>
        <div class="groups">
          <p class="groups_head">全部视频</p>
          <groups :typeName="typeName" @submit="handleSubmit"></groups>
        </div>
        <!-- <div class="groups">
          <p class="groups_head">全部视频</p>
          <p class="item" v-for="item in groupList" :key="item.id">
            <span @click="getList(item.id)" class="group_name">{{item.name}}</span>
            <span v-if="item.id != -1">
              <i class="el-icon-edit" @click="newGroup(item.id,item.name,'edit')"></i>
              <i class="el-icon-delete" @click="deleteImage(item.id,'groupId')"></i>
            </span>
          </p>
          <span class="newClass" @click="newGroup('','','new')">+ 新建分组</span>
        </div> -->
      </div>
    </div>
    <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="data" :arrayData="arrayData" :fromGroupId="fromGroupId" :typeName="typeName" @submit="handleSubmit"></component>
  </div>
</template>

<script>
import groups from './groups'
import dialogVideo from '@/views/shop/dialogs/materialDialogs/dialogVideo';
import dialogUploadVideo from '@/views/shop/dialogs/materialDialogs/dialogUploadVideo';
import dialogSyncVideo from '@/views/shop/dialogs/materialDialogs/dialogSyncVideo';
import dialogDelete from '@/views/shop/dialogs/materialDialogs/dialogDelete';
import dialogGroups from '@/views/shop/dialogs/materialDialogs/dialogGroups';
import dialogGroupsMove from '@/views/shop/dialogs/materialDialogs/dialogGroupsMove';
export default {
  name: 'videoMaterial',
  components: {groups,dialogVideo,dialogUploadVideo,dialogSyncVideo,dialogDelete,dialogGroups,dialogGroupsMove},
  data () {
    return {
      typeName:'video',
      searchWord:'',
      dialogVisible: false,
      currentDialog: '',
      num:10,
      checked:false,
      currentPage:1,
      total:0,

      data:'',
      arrayData:[],
      dialogVisible: false,
      currentDialog: '',
      checkedAll:false,
      imgsArr:[ ],
      loading:false,
      checked:false,
      list:[],
      groupList:[],
      currentPage:1,
      pageSize:10,
      total:0,
      groupId:'',
      fromGroupId:'',
      isIndeterminate: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getCover(item) {
      return location.protocol + `${process.env.DATA_API}/api-decoration-web/notify/image.do?wxp=`+item.fileCover.replace(/\&/g, "%26");
    },
    //获取视频列表
    getList(id, cPage){
      id && (this.groupId = id)
      cPage && (this.currentPage = cPage)
      let query ={
        fileGroupInfoId:id || '',
        startIndex:this.currentPage,
        pageSize:this.pageSize,
        sourceMaterialType:'2',
        fileName:this.searchWord
      }
      this.getData(query)
    },

    //查询
    search(){
      this.currentPage = 1; // 查询前将条件页码置为1
      let query ={
        fileGroupInfoId:this.groupId || '',
        startIndex:this.currentPage,
        pageSize:this.pageSize,
        sourceMaterialType:'2',
        fileName:this.searchWord
      }
      this.getData(query)
    },

    //获取视频数据
    getData(query){
      this._apis.file.getMaterialList(query).then((response)=>{
        this.list = []
        response.list.map((item) => {
          item.updateTime = item.updateTime.slice(0,10)
          let data = Object.assign({checked:false}, item)
          this.list.push(data)
        })
        this.checkedAll = false
        this.isIndeterminate = false
        this.total = response.total
      }).catch((error)=>{
        this.$message.error(error);
      })
    },
    //下载视频
    downVideo(filepath,fileName){
      let a = document.createElement('a')
          a.download = fileName || '视频名称'
          a.href = filepath;
          a.click();
    },

  /**********************************        弹窗相关      **********************/
    //弹窗反馈
    handleSubmit(data){
      for(let key in data){
        switch (key) {
          case 'getGroupVideo':
            this.getList(data.getGroupVideo.groupId, 1)
          break;
          case 'moveGroup':
            this.handleMoveGroup(data.moveGroup.imageId,data.moveGroup.groupId)
          break;
          case 'deleteImage':
            this.deleteVideo(data.deleteImage.imageId)
          break;
          case 'syncImage':
            this.handleSyncImage(data.syncImage.query)
          break;
          case 'uploadVideo':
            this.uploadVideo(data.uploadVideo.query)
          break;
        }
      }
    },

    //删除分组或是视频
    deleteImage(id,type){
      this.dialogVisible = true;
      this.currentDialog = 'dialogDelete'
      if(type == 'groupId'){
        this.data = {
          id:id || '',
          type:type
        }
      }else{
        this.arrayData=[]
        this.arrayData.push(id)
      }
    },
    //批量删除
    deleteImages(){
      this.data = {}
      this.arrayData=[]
      this.list.map(item =>{
        item.checked == true && this.arrayData.push(item.id)       
      })
      if(this.arrayData.length == 0){
        this.$message.warning('请选择视频后再进行批量操作！');
      }else{
        this.dialogVisible = true;
        this.currentDialog = 'dialogDelete'
      }
    },

    //分组
    moveGroup(id,fileGroupInfoId){
      this.dialogVisible = true;
      this.currentDialog = 'dialogGroupsMove'
      this.data = 'video'
      this.arrayData = []
      this.arrayData.push(id)
      this.fromGroupId = fileGroupInfoId
    },

    //移动分组
    moveGroups(){
      this.data = 'video'
      this.arrayData = []
      this.list.map(item =>{
        item.checked == true && this.arrayData.push(item.id) 
        this.fromGroupId = item.fileGroupInfoId        
      })
      if(this.arrayData.length == 0){
        this.$message.warning('请选择视频后再进行批量操作！');
      }else{
        this.dialogVisible = true;
        this.currentDialog = 'dialogGroupsMove'
      }
    },

    //上传视频
    uploadImage(id,type){
      this.dialogVisible = true;
      this.currentDialog = 'dialogUploadVideo'
    },
    //同步视频
    syncImage(){
      this.dialogVisible = true;
      this.currentDialog = 'dialogSyncVideo'
    },

    //播放视频
    openVideo(item){
      this.dialogVisible = true;
      this.currentDialog = 'dialogVideo'
      this.data = item
    },

    handleSyncImage(query){
      this._apis.file.syncMaterial(query).then((response)=>{
        this.$message.success('同步微信视频成功！');
        this.getList()
      }).catch((error)=>{
        this.$message.error(error);
      })
    },
    /**********************************        单个视频      **********************/
    
    //分组
    handleMoveGroup(id,groupId){
      let query ={
        ids:id,
        toFileGroupInfoId:groupId
      }
      this._apis.file.moveGroup(query).then((response)=>{
        this.$message.success('移动分组成功！');
        this.getList()
        this.checkedAll = false
      }).catch((error)=>{
        this.$message.error(error);
      })
    },
    //删除视频
    deleteVideo(id){
      let query ={
        ids:id,
      }
      this._apis.file.deleteMaterial(query).then((response)=>{
        this.$message.success('删除成功！');
        this.getList()
        this.checkedAll = false
      }).catch((error)=>{
        this.$message.error(error);
      })
    },
    //上传视频
    uploadVideo(query){
      this._apis.file.uploadVideo(query).then((response)=>{
        this.$message.success('上传视频成功！');
        this.getList()
      }).catch((error)=>{
        this.$message.error(error);
      })
    },
    /**********************************        分页相关      **********************/
    //分页相关
    handleSizeChange(val){
      this.pageSize = val || this.pageSize
      this.getList(this.groupId)
    },
    handleCurrentChange(pIndex){
      this.currentPage = pIndex || this.currentPage
      this.getList(this.groupId)
    },
    /**********************************        全选相关      **********************/
    allChecked(val){
      if(val){
        this.list.map(item =>{
          item.checked = true
          return this.list
        })
      }else{
        this.list.map(item =>{
          item.checked = false
          return this.list
        })
      }
      this.isIndeterminate = false
    },
    handleChecked(val){
      if(val){
        this.checkedAll = this.list.every(item => {
          return item.checked == true
        })
      }else{
        this.checkedAll = false
      }

      if(this.checkedAll){
        this.isIndeterminate = false
      }else{
        const arr=[]
        this.list.map(item =>{
          item.checked == true && arr.push(item.id)                
        })
        if(arr.length == 0){
          this.isIndeterminate = false
        }else{
          this.isIndeterminate = true
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.head{
  display: flex;
  justify-content: space-between;
}
.list_top{
  height: 80px;
  line-height: 80px;
  font-size: 14px;
  color: #92929B;
  span{
    color: #44434B;
    margin: 0 5px;
  }
}
.list_main{
  display: flex;
  justify-content: space-between;
  .list_img{
    width: 100%;
    padding-bottom:30px;
    .imgs{
      display: flex;
      flex-flow: row wrap;
      .item_img{
        width: 250px;
        border: 1px solid #e6e6e6;
        margin:0px 20px 50px 0px;
        .img_head{
          height: 25px;
          line-height: 25px;
          padding: 0 10px;
          border-bottom: 1px solid #e6e6e6;
          display: flex;
          flex: 1;
          justify-content: space-between;
          span{
            font-size: 14px;
            color: #92929B;
          }
          .wx_icon{
            width: 20px;
            height: 20px;
            display: inline-block;
            vertical-align: middle;
            background: url('../../../../assets/images/shop/wx_icon.png');
          }
        }
        .img_body{
          width:100%;
          padding:10px 10px;
          font-size: 14px;
          color: #44434B;
          position: relative;
          .title{
            height: 25px;
            line-height: 25px;
          }
          .imgs{
            width: 240px;
            height:150px;
            object-fit: contain;
          }
          .imgs_cover{
            width: 240px;
            height:150px;
            background: #44434B;
          }
          .btn{
            position:absolute;
            top:85px;
            left:110px;
            width: 40px;
            height: 40px;
            background: url('../../../../assets/images/shop/bofang.png');
            background-size: cover;
            &:hover{
              cursor: pointer;
            }
          }
        }
        .img_bottom{
          height: 25px;
          line-height: 25px;
          display: flex;
          justify-content:space-between;
          span{
            width: 33%;
            display: inline-block;
            background: #DDDDDD;
            text-align: center;
            color: #fff;
            cursor: pointer;
          }
          span:nth-of-type(n+2){
            border-left:1px solid #fff;
          }
        }
        .img_name{
          padding: 5px 0px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .groups{
    width: 350px;
    border: 1px solid #e6e6e6;
    font-size: 14px;
    color: #44434B;
    margin-left: 30px;
    .groups_head{
      height: 30px;
      line-height: 30px;
      background: #EFEFEF;
      padding-left: 20px;
    }
    .item{
      height: 35px;
      line-height: 35px;
      padding:0 20px;
      display: flex;
      justify-content: space-between;
      .group_name{
        width:95px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      i{
        margin: 0 5px;
        cursor: pointer;
      }
    }
    .item:hover{
      background: #E0E0fc;
      cursor: pointer;
    }
    .newClass{
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      cursor: pointer;
    }
  }
}
.pages{
  width: 100%;
  margin-top: 40px;
  text-align: center;
  .page_nav{
    display: inline-block;
  }
}
.ml10{
  margin-left: 10px;
}
.search_w{
  width: 210px;
}
.inline{
  display: inline-block;
}
</style>
