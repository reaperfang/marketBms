<template>
  <div>
    <div class="head">
      <div>
        <el-checkbox v-model="checkedAll" @change="allChecked">全选</el-checkbox>
        <el-button type="warning" plain class="ml10" @click="deleteImages">批量删除</el-button>
        <el-button type="warning" plain @click="moveGroups">移动分组</el-button>
      </div>
      <div>
        <el-button type="primary" plain @click="syncImage">同步图片</el-button>
        <el-button type="primary" plain @click="handleUploadImage">上传图片</el-button>
      </div>
    </div>
    <div class="list">
      <p class="list_top">图片素材<span>{{total*1}}</span>条</p>
      <div class="list_main">
        <div class="list_img">
          <div class="imgs">
            <div class="item_img" v-for="(item,index) in list" :key="item.index"  @mouseenter="onMouseOver(index)" @mouseleave="onMouseOut(index)">
              <div class="img_info">
                <img :src="item.filePath">
                <div class="img_bottom">
                  <p>
                    <span>
                      <el-checkbox v-model="item.checked" @change="handleChecked"></el-checkbox>
                      <i class="wx_icon" v-if="item.isSyncWechat"></i>
                    </span>
                    <span v-if="!item.isSyncWechat">
                      {{item.imgPixelWidth || '0'}}*{{item.imgPixelHeight || '0'}}px
                    </span>
                    <span>
                      <i class="el-icon-link oper" @click="copyLink(item.filePath)"></i>
                      <i class="el-icon-download oper" @click="downImage(item.filePath,item.fileName)"></i>
                    </span>
                  </p>
                </div>
                <div class="operate" ref="operate">
                  <el-button type="primary" plain class="block mt10 ml10" @click="moveGroup(item.id)">分组</el-button>
                  <el-button type="primary" plain class="block mt10" v-if="!item.isSyncWechat" @click="imageTailor(item)">剪裁</el-button>
                  <el-button type="primary" plain class="block mt10" @click="deleteImage(item.id,'imageId')">删除</el-button>
                </div>
              </div>
            </div>
           </div>
           <p class="pages">
              <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total*1"
              class="page_nav">
              </el-pagination>
           </p>
        </div>
        <div class="groups">
          <p class="groups_head">全部图片</p>
          <p class="item" v-for="item in groupList" :key="item.id">
            <span @click="getList(item.id)" class="group_name">{{item.name}}</span>
            <span v-if="item.id != -1">
              <i class="el-icon-edit" @click="newGroup(item.id,item.name,'edit')"></i>
              <i class="el-icon-delete" @click="deleteImage(item.id,'groupId')"></i>
            </span>
          </p>
          <span class="newClass" @click="newGroup('','','new')">+ 新建分组</span>
        </div>
      </div>
    </div>
    <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="data" :arrayData="arrayData" @submit="handleSubmit"></component>
  </div>
</template>

<script>
import dialogCutImage from '../../../dialogs/dialogCutImage';
import dialogUploadImage from '../../../dialogs/dialogUploadImage';
import dialogSyncImage from '../../../dialogs/dialogSyncImage';
import dialogDelete from '../../../dialogs/dialogDelete';
import dialogGroups from '../../../dialogs/dialogGroups';
import dialogGroupsMove from '../../../dialogs/dialogGroupsMove';
import dialogCopyLink from '../../../dialogs/dialogCopyLink';
import dialogImageTailor from '../../../dialogs/dialogImageTailor';

export default {
  name: 'imageMaterial',
  components: {dialogCutImage, dialogUploadImage,dialogSyncImage,dialogDelete,dialogGroups,dialogGroupsMove,dialogCopyLink,dialogImageTailor},
  data () {
    return {
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
      groupId:''
    }
  },
  created() {
    this.getList()
    this.getGroups()
  },
  methods: {
    //获取图片列表
    getList(id){
      id && (this.groupId = id)
      let query ={
        fileGroupInfoId:id || '',
        startIndex:this.currentPage,
        pageSize:this.pageSize,
        sourceMaterialType:'0'
      }
      this._apis.file.getMaterialList(query).then((response)=>{
        this.list = []
        if(response && response.list.length != 0){
          response.list.map(item => {
            item.isSyncWechat && (item.filePath = 'http://img01.store.sogou.com/net/a/04/link?appid=100520029&url='+ item.filePath)
            let data = Object.assign({checked:false}, item)
            this.list.push(data)
          })
        }
        this.total = response.total
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
    //下载图片
    downImage(filepath,fileName){
      this.downloadIamge(filepath, fileName)
    },
    downloadIamge(imgsrc, name){
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
    
        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    //复制链接
    copyLink(link){
      this.dialogVisible = true
      this.currentDialog = 'dialogCopyLink'
      this.data = link
    },
  /**********************************        分组相关      **********************/
    //查询分组
    getGroups(){
      let query ={
        type:'0'
      }
      this._apis.file.getGroup(query).then((response)=>{
        this.groupList = response
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
    //添加分组
    addGroup(groupName){
      let query ={
        name:groupName,
        parentId:'0',
        type:'0'
      }
      this._apis.file.newGroup(query).then((response)=>{
        this.$notify.success({
          title: '成功',
          message: '添加成功！'
        });
        this.getGroups()
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })      
    },
    //编辑分组
    editGroup(groupId,groupName){
      let query ={
        id:groupId,
        name:groupName,
        type:'0'
      }
      this._apis.file.editGroup(query).then((response)=>{
        this.$notify.success({
          title: '成功',
          message: '操作成功！'
        });
        this.getGroups()
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })      
    },
    //删除分组
    deleteGroup(id){
      let query ={
        id:id,
        type:0
      }
      this._apis.file.deleteGroup(query).then((response)=>{
        this.$notify.success({
          title: '成功',
          message: '操作成功！'
        });
        this.getGroups()
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
   /**********************************        弹窗相关      **********************/
    //弹窗反馈
    handleSubmit(data){
      for(let key in data){
        switch (key) {
          case 'add':  
            this.addGroup(data.add.groupName) 
          break;
          case 'edit':
            this.editGroup(data.edit.groupId,data.edit.groupName)
          break;
          case 'deleteGroup':
            this.deleteGroup(data.deleteGroup.groupId)
          break;
          case 'moveGroup':
            this.handleMoveGroup(data.moveGroup.imageId,data.moveGroup.groupId)
          break;
          case 'deleteImage':
            this.handleDeleteImage(data.deleteImage.imageId)
          break;
          case 'syncImage':
            this.handleSyncImage(data.syncImage.query)
          break;
          case 'uploadImage':
            this.uploadImage(data.uploadImage.query)
          break;
          case 'imageTailor':
            setTimeout(() =>{
              this.getList()
            },1000)
          break;
        }
      }
    },
    //新建分组
    newGroup(id,name,type){
      this.dialogVisible = true;
      this.currentDialog = 'dialogGroups'
      this.data = {
        type:type,
        id:id || '',
        name:name || ''
      }
    },
    //删除图片或是分组
    deleteImage(id,type){
      this.dialogVisible = true;
      this.currentDialog = 'dialogDelete'
      this.arrayData=[]
      if(type == 'groupId'){
        this.data = {
          id:id || '',
          type:type
        }
      }else{
        this.data = {}
        this.arrayData.push(id)
      }
    },
    //批量删除
    deleteImages(){
      this.dialogVisible = true;
      this.currentDialog = 'dialogDelete'
      this.data = {}
      this.arrayData=[]
      this.list.map(item =>{
        item.checked == true && this.arrayData.push(item.id)                
      })
    },

    //上传图片
    handleUploadImage(){
      this.dialogVisible = true;
      this.currentDialog = 'dialogUploadImage'
    },

    //同步图片
    syncImage(){
      this.dialogVisible = true;
      this.currentDialog = 'dialogSyncImage'
    },

    //分组
    moveGroup(id){
      this.dialogVisible = true;
      this.currentDialog = 'dialogGroupsMove'
      this.data = 'image'
      this.arrayData = []
      this.arrayData.push(id)
    },

    //移动分组
    moveGroups(){
      this.dialogVisible = true;
      this.currentDialog = 'dialogGroupsMove'
      this.data = 'image'
      this.arrayData = []
      this.list.map(item =>{
        item.checked == true && this.arrayData.push(item.id)        
      })
    },

    //图片裁剪
    imageTailor(item){
      this.dialogVisible = true;
      this.currentDialog = 'dialogImageTailor'
      this.data = item.filePath;
      this.arrayData = [];
      this.arrayData.push(item.id);
    },
    /**********************************        单张图片      **********************/
    onMouseOver(index){
      this.$refs.operate[index].style.display="block"
    },
    onMouseOut(index){
      this.$refs.operate[index].style.display="none"
    },
    //分组
    handleMoveGroup(id,groupId){
      let query ={
        ids:id,
        toFileGroupInfoId:groupId
      }
      this._apis.file.moveGroup(query).then((response)=>{
        this.$notify.success({
          title: '成功',
          message: '移动分组成功！'
        });
        this.getList()
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
    //删除
    handleDeleteImage(id){
      let query ={
        ids:id,
      }
      this._apis.file.deleteMaterial(query).then((response)=>{
        this.$notify.success({
          title: '成功',
          message: '删除成功！'
        });
        this.getList()
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },

    //上传图片
    uploadImage(query){
      this._apis.file.uploadImage(query).then((response)=>{
        this.$notify.success({
          title: '成功',
          message: '上传图片成功！'
        });
        this.getList()
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },

    //同步图片
    handleSyncImage(query){
      this._apis.file.syncMaterial(query).then((response)=>{
        this.$notify.success({
          title: '成功',
          message: '同步微信图片成功！'
        });
        this.getList()
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
    /**********************************        分页相关      **********************/
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
    },
    handleChecked(val){
      if(val){
        this.checkedAll = this.list.every(item => {
          return item.checked == true
        })
      }else{
        this.checkedAll = false
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
    .imgs{
      display: flex;
      flex-flow: row wrap;
      .item_img{
        border: 1px solid #e6e6e6;
        margin:0px 30px 50px 0px;
        .img_info{
          width: 240px;
          height:150px;
          position: relative;
          img{
            width: 240px;
            height:150px;
            object-fit: contain;
          }
          .img_bottom{
            width:100%;
            height: 30px;
            line-height: 30px;
            padding:0 10px;
            position: absolute;
            left:0px;
            bottom:-30px;
            z-index: 1;
            background:rgba(0,0,0,1);
            opacity: 0.5;
            p{
              display:flex;
              justify-content: space-between;
              color: #fff;
              font-weight: bold;
              .oper{
                cursor: pointer;
              }
            }
          }
          .operate{
            width: 100%;
            height: 150px;
            position: absolute;
            top:0;
            left:0;
            z-index: 2;
            background-color:rgba(0,0,0,0.2);
            padding: 20px 0px 0px 80px;
            display:none;
          }
        }
      }
    }
  }
  .groups{
    width: 300px;
    border: 1px solid #e6e6e6;
    font-size: 14px;
    color: #44434B;
    margin-left: 30px;
    padding-bottom:20px;
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
// .material_wrapper{
//   height:400px;
//   overflow-y: auto;
//   .cell-item {
//     width: 100%;
//     background: #fff;
//     border: 1px solid #efeaea;
//     overflow: hidden;
//     -webkit-box-sizing: border-box;
//     box-sizing: border-box;
//     margin-bottom: 10px;
//     cursor: pointer;
//     box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     img{
//       max-width: 100%;
//     }
//     .item-body{
//       padding:10px 0;
//     }
//   }
//   .img_active{
//     border: 2px dashed $globalMainColor!important;
//   }
// }
.wx_icon{
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  background: url('../../../../../assets/images/shop/wx_icon.png');
}
.ml10{
  margin-left: 10px;
}
.mt10{
  margin-top: 10px;
}
.block{
  display: block;
}
.pages{
  width: 100%;
  margin-top: 50px;
  text-align: right;
  .page_nav{
    display: inline-block;
  }
}
</style>
