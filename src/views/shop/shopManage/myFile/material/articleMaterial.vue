<template>
  <div>
    <div>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="form.timeValue"
            type="daterange"
            value-format="yyyy-MM-dd hh:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerNowDateBefore">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.name" placeholder="请填写标题、描述或作者"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button type="primary" plain @click="_routeTo('generalArticle')">新建图文素材</el-button>
      <el-button type="primary" plain @click="syncImage">同步图文</el-button>
    </div>
    <div class="list">
      <p class="list_top">图文素材<span>{{total*1}}</span>条</p>
      <div class="list_main">
        <div class="list_img">
            <div class="item_img" v-for="(item,index) in list" :key="item.id" @mouseenter="onMouseOver(index,item.isSyncWechat)" @mouseleave="onMouseOut(index)">
              <p class="img_head">
                <span>{{item.updateTime}}</span>
                <i class="wx_icon" v-if="item.isSyncWechat"></i>
              </p>
              <div class="img_body">
                <p class="title">{{item.title}}</p>
                <img :src="item.fileCover" class="imgs">
                <p class="content">
                  {{item.sourceMaterialNoHtml}}
                </p>
              </div>
              <p class="img_bottom">
                <span><i class="el-icon-edit" @click="_routeTo('generalArticle',{id:item.id})"></i></span>
                <span><i class="el-icon-delete" @click="handleDeleteArticle(item.id,'articleId')"></i></span>
              </p>
              <div ref="operate" class="operate">
                <i class="el-icon-view" @click="lookArticle(item.linksOriginal)"> 预览文章</i>
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
    <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :arrayData="arrayData" :data="data" @submit="handleSubmit"></component>
  </div>
</template>

<script>
import utils from "@/utils";
import dialogSyncArticle from '../../../dialogs/dialogSyncArticle';
import dialogDelete from '../../../dialogs/dialogDelete';
import dialogQRcode from '../../../dialogs/dialogQRcode';
export default {
  name: 'articleMaterial',
  components: {dialogSyncArticle,dialogDelete,dialogQRcode},
  data () {
    return {
      pickerNowDateBefore: {
        onPick: ({ maxDate, minDate }) => {
              this.pickerMinDate = minDate.getTime()
              if (maxDate) {
                  this.pickerMinDate = ''
              }
          },
        disabledDate: (time) => {
          if (this.pickerMinDate !== '') {
            return time.getTime() == this.pickerMinDate
          }
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      form:{
        timeValue:'',
        name:''
      }, 
      data:'',
      arrayData:[],
      dialogVisible: false,
      currentDialog: '',
      imgsArr:[

      ],
      loading:false,
      checked:false,
      list:[],
      groupList:[],
      currentPage:1,
      pageSize:10,
      total:0,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //获取图文列表
    getList(){
      let startDate = '',
          endDate = '',
          timeValue = this.form.timeValue

      if(timeValue){
        startDate = timeValue[0]
        endDate = timeValue[1]
      }

      let query ={
        startIndex:this.currentPage,
        pageSize:this.pageSize,
        startTime :startDate,
        endTime:endDate,
        title:this.form.name,
        sourceMaterialType:'1'
      }
      this._apis.file.getMaterialList(query).then((response)=>{
        this.list = response.list
        this.total = response.total
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
    //弹窗反馈
    handleSubmit(data){
      for(let key in data){
        switch (key) {
          case 'deleteActicle':  
            this.deleteActicle(data.deleteActicle.articleId) 
          break;
          case 'syncImage':
            this.handleSyncImage(data.syncImage.query)
          break;
        }
      }
    },

    //同步图片
    syncImage(){
      this.dialogVisible = true;
      this.currentDialog = 'dialogSyncArticle'
    },

    handleSyncImage(query){
      this._apis.file.syncMaterial(query).then((response)=>{
        this.$notify.success({
          title: '成功',
          message: '同步微信图文成功！'
        });
        this.getList()
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },

    handleDeleteArticle(id,type){
      this.dialogVisible = true;
      this.currentDialog = 'dialogDelete'
      let arrayId = []
      arrayId.push(id)
      this.data = {
        id:arrayId,
        type:type
      }
    },
    //删除图文素材
    deleteActicle(id){
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
    onMouseOver(index,isSyncWechat){
      if(isSyncWechat){
        this.$refs.operate[index].style.display="block"
      }else{
        this.$refs.operate[index].style.display="none"
      }
    },
    onMouseOut(index){
      this.$refs.operate[index].style.display="none"
    },
   /**********************************        分页相关      **********************/
    handleSizeChange(val){
      this.pageSize = val || this.pageSize
      this.getList()
    },
    handleCurrentChange(pIndex){
      this.currentPage = pIndex || this.currentPage
      this.getList()
    },
    //预览文章
    lookArticle(url){
      this.dialogVisible = true;
      this.currentDialog = 'dialogQRcode'
      this.data = {
        url:url
      }
    },
  }
}
</script>

<style lang="scss" scoped>
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
    display: flex;
    flex-flow: row wrap;
    .item_img{
      width: 250px;
      border: 1px solid #e6e6e6;
      position: relative;
      margin:0px 30px 50px 0px;
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
          background: url('../../../../../assets/images/shop/wx_icon.png');
        }
      }
      .img_body{
        width:100%;
        padding:10px 10px;
        font-size: 14px;
        color: #44434B;
        .title{
          height: 25px;
          line-height: 25px;
        }
        .imgs{
          width: 100%;
          height:85px;
          object-fit: cover;
        }
        .content{
          line-height: 20px;
          height: 60px;
        }
      }
      .img_bottom{
        height: 25px;
        line-height: 25px;
        display: flex;
        justify-content:space-between;
        span{
          width: 50%;
          display: inline-block;
          background: #DDDDDD;
          text-align: center;
          color: #fff;
          cursor: pointer;
        }
        span:nth-of-type(2){
          border-left:1px solid #fff;
        }
      }
      .operate{
        width: 100%;
        height: 218px;
        position: absolute;
        top:0;
        left:0;
        z-index: 2;
        background-color:rgba(0,0,0,0.2);
        padding: 90px 0px 0px 80px;
        color: #fff;
        cursor: pointer;
        display:none;
      }
    }
  }
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
