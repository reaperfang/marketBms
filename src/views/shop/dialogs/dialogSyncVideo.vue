<template>
  <DialogBase :visible.sync="visible" width="1000px" :title="'同步微信视频素材'" @submit="submit">
      <div class="content">
        <el-checkbox v-model="checkedAll" @change="allChecked">全选</el-checkbox>
        <div class="list_main">
          <div class="list_img">
            <div class="imgs">
              <div class="item_img" v-for="item in list" :key="item.id">
                <p class="img_head">
                  <span>
                    <el-checkbox v-model="item.checked" @change="handleChecked"></el-checkbox>
                    {{item.update_time | formatDate('yyyy-MM-dd hh:mm:ss')}}
                    </span>
                </p>
                <div class="img_body">
                  <p class="title">{{item.title}}</p>
                  <video v-if="item.down_url !=''"  
                  :src="item.down_url"
                  class="avatar video-avatar"
                  controls="controls">您的浏览器不支持视频播放</video> 
                  <!-- <img :src="item.filePath" class="imgs"> -->
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
        </div>
      </div>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogSyncImage",
  components: {DialogBase},
  data() {
    return {
      checkedAll:false,
      checked:false,
      list:[],
      currentPage:1,
      pageSize:10,
      total:0,
    }
  },
  props: {
      dialogVisible: {
          type: Boolean,
          required: true
      },
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
  created(){
    this.getList()
  },
  methods: {
    //获取微信图片列表
    getList(){
      let query ={
        startIndex:this.currentPage,
      }
      this._apis.file.getWxVideo(query).then((response)=>{
        this.list = []
        response.item.map(item => {
          let data = Object.assign({checked:false}, item)
          this.list.push(data)
        })
        this.total = response.total
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
    submit() {
      let datas = []
      this.list.map(item =>{
        if(item.checked == true){
          let obj = {
            cid:this.cid,
            mediaId:item.media_id,
            sourceMaterialType:'2',
            filePath:escape(item.down_url),
            fileSize:'',
            name:item.name,
            fileover:'',
            isSyncWechat:'1'
          }
          datas.push(obj)
        }        
      })
      let query = {
        fileGroupInfoId:'-1',
        data:datas
      }
      this.$emit('submit',{syncImage:{query:query}})
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

  },
}
</script>

<style lang="scss" scoped>
.content{
  line-height: 30px;
  font-size: 14px;
  color: #443D4A;
  // text-align: center;
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
        width: 250px;
        border: 1px solid #e6e6e6;
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
          // .wx_icon{
          //   width: 20px;
          //   height: 20px;
          //   display: inline-block;
          //   vertical-align: middle;
          //   background: url('../../../../../assets/images/shop/wx_icon.png');
          // }
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
      }
    }
  }
  .groups{
    width: 200px;
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
  margin-top: 50px;
  text-align: right;
  .page_nav{
    display: inline-block;
  }
}
.ml10{
  margin-left: 10px;
}
</style>
