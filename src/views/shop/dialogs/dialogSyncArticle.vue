<template>
  <DialogBase :visible.sync="visible" width="1000px" :title="'同步微信图文素材'" :showFooter="false">
      <div>
        <el-checkbox v-model="checkedAll" @change="allChecked">全选</el-checkbox>
        <div class="list_main">
          <div class="list_img">
              <div class="item_img" v-for="item in list" :key="item.id">
                <p class="img_head">
                  <el-checkbox v-model="item.checked" @change="handleChecked"></el-checkbox>
                  <span>{{item.update_time}}</span>
                </p>
                <div class="img_body">
                  <p class="title">{{item.title}}</p>
                  <img :src="item.thumb_url" class="imgs">
                  <p class="content" v-html="item.content">
                  </p>
                </div>
              </div>
          </div>
        </div>
        <p class="pages">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total*1"
            class="page_nav">
            </el-pagination>
        </p>
        <p class="txt_center">
            <el-button type="primary" @click="submit()" :disabled="disNum">确 认</el-button>
            <el-button  @click="visible = false">取 消</el-button>
        </p>
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
      pageSize:20,
      total:0,
      disNum:true
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
      this._apis.file.getWxArticle(query).then((response)=>{
        this.list = []
        response.item.map(item => {
          let data = Object.assign({checked:false}, item)
          data.thumb_url = "http://img01.store.sogou.com/net/a/04/link?appid=100520029&url=" + data.thumb_url;
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
            sourceMaterialType:'1',
            linksOriginal:escape(item.url),
            isCover:'',
            summary:item.digest,
            author:item.author,
            title:item.title,
            sourceMaterial:item.content,
            isSyncWechat:'1',
            fileCover: escape(item.thumb_url)
          }
          datas.push(obj)
          
        }        
      })
      let query = {
        fileGroupInfoId:'-1',
        data:datas
      }
      this.$emit('submit',{syncImage:{query:query}})
      this.visible = false
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
          this.disNum = false
          return this.list
        })
      }else{
        this.list.map(item =>{
          item.checked = false
          this.disNum = true
          return this.list
        })
      }
    },
    handleChecked(val){
      if(val){
        this.checkedAll = this.list.every(item => {
          return item.checked == true
        })
        this.disNum = !this.list.some(item => {
          return item.checked == true
        })
      }else{
        this.checkedAll = false
        this.disNum = true
      }
    },

  },
}
</script>

<style lang="scss" scoped>
// .content{
//   line-height: 30px;
//   font-size: 14px;
//   color: #443D4A;
//   // text-align: center;
// }
.list_main{
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
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
        .content{
          line-height: 20px;
          height: 60px;
          overflow: hidden;
        }
      }
      .img_bottom{
        height: 25px;
        line-height: 25px;
        padding-left: 10px;
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
.pages{
  width: 100%;
  text-align: right;
}
.txt_center{
  width: 100%;
  text-align: center;
  margin-top:20px;
}
</style>
