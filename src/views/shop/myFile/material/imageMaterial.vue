<template>
  <div>
    <div class="head">
      <div class="head-wrapper">
        <el-input v-model="searchWord" placeholder="请输入图片名称" class="search_w inline"></el-input>
        <el-button type="primary" @click="search">查询</el-button>
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
                <p class="img_name">{{item.fileName}}</p>
                <div class="operate" ref="operate">
                  <el-button plain class="block mt10 ml10 btn_groups" @click="moveGroup(item.id,item.fileGroupInfoId)">分 组</el-button>
                  <el-button type="primary" plain class="block mt10 btn_tailor" v-if="!item.isSyncWechat" @click="imageTailor(item)">剪 裁</el-button>
                  <el-button plain class="block mt10 btn_delete" @click="deleteImage(item.id,'imageId')">删 除</el-button>
                </div>
              </div>
            </div>
           </div>
           <p class="table-select">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="allChecked">全选</el-checkbox>
            <el-button plain class="border-button" @click="deleteImages">批量删除</el-button>
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
              :total="total*1">
              </el-pagination>
           </p>
        </div>
        <div class="groups">
          <p class="groups_head">全部图片</p>
          <groups :typeName="typeName"  @submit="handleSubmit"></groups>
        </div>
      </div>
    </div>
    <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="data" :arrayData="arrayData" :fromGroupId="fromGroupId" :typeName="typeName" @submit="handleSubmit"></component>
  </div>
</template>

<script>
import groups from './groups'
import dialogCutImage from '@/views/shop/dialogs/materialDialogs/dialogCutImage';
import dialogUploadImage from '@/views/shop/dialogs/materialDialogs/dialogUploadImage';
import dialogSyncImage from '@/views/shop/dialogs/materialDialogs/dialogSyncImage';
import dialogDelete from '@/views/shop/dialogs/materialDialogs/dialogDelete';
import dialogGroups from '@/views/shop/dialogs/materialDialogs/dialogGroups';
import dialogGroupsMove from '@/views/shop/dialogs/materialDialogs/dialogGroupsMove';
import dialogCopyLink from '@/views/shop/dialogs/materialDialogs/dialogCopyLink';
import dialogImageTailor from '@/views/shop/dialogs/materialDialogs/dialogImageTailor';

export default {
  name: 'imageMaterial',
  components: { groups, dialogCutImage, dialogUploadImage,dialogSyncImage,dialogDelete,dialogGroups,dialogGroupsMove,dialogCopyLink,dialogImageTailor},
  data () {
    return {
      searchWord:'',
      data:'',
      arrayData:[],
      dialogVisible: false,
      currentDialog: '',
      checkedAll:false,
      imgsArr:[ ],
      loading:false,
      checked:false,
      list:[],
      currentPage:1,
      pageSize:10,
      total:0,
      groupId:'',
      typeName:'image',
      fromGroupId:'',
      isIndeterminate: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //获取图片列表
    getList(id, cPage){
      id && (this.groupId = id)
      cPage && (this.currentPage = cPage)
      let query ={
        fileGroupInfoId:id || '',
        startIndex:this.currentPage,
        pageSize:this.pageSize,
        sourceMaterialType:'0',
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
        sourceMaterialType:'0',
        fileName:this.searchWord
      }
      this.getData(query)
    },

    //获取图片数据
    getData(query){
      this._apis.file.getMaterialList(query).then((response)=>{
        this.list = []
        if(response && response.list.length != 0){
          response.list.map(item => {
            let data = Object.assign({checked:false}, item)
            this.list.push(data)
          })
        }
        this.checkedAll = false
        this.isIndeterminate = false
        this.total = response.total
      }).catch((error)=>{
        this.$message.error(error);
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
   /**********************************        弹窗相关      **********************/
    //弹窗反馈
    handleSubmit(data){
      for(let key in data){
        switch (key) {
          case 'getGroupImage':
            this.getList(data.getGroupImage.groupId, 1)
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
      this.data = {}
      this.arrayData=[]
      this.list.map(item =>{
        item.checked == true && this.arrayData.push(item.id)                
      })
      if(this.arrayData.length == 0){
        this.$message.warning('请选择图片后再进行批量操作！');
      }else{
        this.dialogVisible = true;
        this.currentDialog = 'dialogDelete'
      }
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
    moveGroup(id,fileGroupInfoId){
      this.dialogVisible = true;
      this.currentDialog = 'dialogGroupsMove'
      this.data = 'image'
      this.arrayData = []
      this.arrayData.push(id)
      this.fromGroupId = fileGroupInfoId
    },

    //移动分组
    moveGroups(){
      this.data = 'image'
      this.arrayData = []
      this.list.map(item =>{
        item.checked == true && this.arrayData.push(item.id)  
         this.fromGroupId = item.fileGroupInfoId 
      })
      if(this.arrayData.length == 0){
        this.$message.warning('请选择图片后再进行批量操作！');
      }else{
        this.dialogVisible = true;
        this.currentDialog = 'dialogGroupsMove'
      }
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
        this.$message.success('移动分组成功！');
        this.getList()
        this.checkedAll = false
      }).catch((error)=>{
        this.$message.error(error);
      })
    },
    //删除
    handleDeleteImage(id){
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

    //上传图片
    uploadImage(query){
      this._apis.file.uploadImage(query).then((response)=>{
        this.$message.success('上传图片成功！');
        this.getList()
      }).catch((error)=>{
        this.$message.error(error);
      })
    },

    //同步图片
    handleSyncImage(query){
      this._apis.file.syncMaterial(query).then((response)=>{
        this.$message.success('同步微信图片成功！');
        this.getList()
      }).catch((error)=>{
        this.$message.error(error);
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
    .imgs{
      display: flex;
      flex-flow: row wrap;
      .item_img{
        border: 1px solid #e6e6e6;
        margin:0px 30px 70px 0px;
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
          .img_name{
            position: absolute;
            left:0px;
            bottom:-50px;
            width: 100%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .operate{
            width: 100%;
            height: 150px;
            position: absolute;
            top:0;
            left:0;
            z-index: 2;
            background-color:rgba(0,0,0,0.6);
            padding: 20px 0px 0px 80px;
            display:none;
          }
        }
      }
    }
  }
  .groups{
    width: 350px;
    border: 1px solid #e6e6e6;
    font-size: 14px;
    color: #44434B;
    padding-bottom:20px;
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
  background: url('../../../../assets/images/shop/wx_icon.png');
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
  margin-top: 40px;
  margin-bottom: 30px;
  text-align: center;
  .page_nav{
    display: inline-block;
  }
}
.search_w{
  width: 210px;
}
.inline{
  display: inline-block;
}
.btn_groups{
  border: 1px solid #fff !important;
  border-radius: 4px;
  background-color:transparent !important;
  color: #fff !important;
}
.btn_groups:hover{
  border: 1px solid #655EFF !important;
  border-radius: 4px;
  background: #655EFF !important;
  color: #fff !important;
}
.btn_tailor{
  border: 1px solid #fff !important;
  border-radius: 4px;
  background-color:transparent !important;
  color: #fff !important;
}
.btn_tailor:hover{
  border: 1px solid #655EFF !important;
  border-radius: 4px;
  background: #655EFF !important;
  color: #fff !important;
}
.btn_delete{
  border: 1px solid #fff !important;
  border-radius: 4px;
  background-color:transparent !important;
  color: #fff !important;
}
.btn_delete:hover{
  border: 1px solid #655EFF !important;
  border-radius: 4px;
  background: #655EFF !important;
  color: #fff !important;
}

</style>
