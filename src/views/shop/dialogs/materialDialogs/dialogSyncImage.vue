<template>
  <DialogBase :visible.sync="visible" width="1000px" :title="'同步微信图片素材'" :showFooter="false">
      <div class="content">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="allChecked">全选</el-checkbox>
        <div class="list_main">
          <div class="list_img">
            <div class="imgs">
              <div class="item_img" v-for="(item) in list" :key="item.id">
                <div class="img_info">
                  <img :src="item.urls">
                  <div class="img_bottom">
                    <p>
                      <span>
                        <el-checkbox v-model="item.checked" @change="handleChecked"></el-checkbox>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p class="pages">
              <el-pagination
              :background="true"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[20]"
              layout="prev, pager, next, sizes"
              :total="total*1"
              class="page_nav">
              </el-pagination>
            </p>
          </div>
        </div>
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
      disNum:true,
      isIndeterminate: false
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
      let shopInfo = this.$store.getters.shopInfos
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
        pageSize: this.pageSize
      }
      this._apis.file.getWxImage(query).then((response)=>{
        this.list = []
        response.item.map(item => {
          let urls = location.protocol + `${process.env.DATA_API}/api-decoration-web/notify/image.do?wxp=`+ item.url
          let data = Object.assign({checked:false,urls:urls}, item)

          this.list.push(data)

        })
        this.checkedAll = false;
        this.isIndeterminate = false;
        this.disNum = true;
        this.total = response.total
      }).catch((error)=>{
        this.$message.error(error);
      })
    },
    submit() {
      let datas = []
      this.list.map(item =>{
        if(item.checked == true){
          let obj = {
            cid:this.cid,
            mediaId:item.media_id,
            sourceMaterialType:'0',
            fileName:'微信同步图片',
            filePath:escape(location.protocol + `${process.env.DATA_API}/api-decoration-web/notify/image.do?wxp=`+ item.url),
            imgPixelWidth:'',
            imgPixelHeight:'',
            fileSize:'',
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
      this.isIndeterminate = false;
    },
    handleChecked(val){
      if(val){
        this.checkedAll = this.list.every(item => {
          return item.checked == true
        })
         this.disNum = !this.list.some(item => {
          return item.checked == true
        })
        if(this.checkedAll) {
          this.isIndeterminate = false;
        }else{
          this.isIndeterminate = true;
        }
      }else{
        this.checkedAll = false
        this.disNum = true
        
        if(this.list.filter(item => item.checked == true).length != 0){
          this.isIndeterminate = true;
        }else{
          this.isIndeterminate = false;
        }
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
    width: 200px;
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
  text-align: right;
}
.txt_center{
  width: 100%;
  text-align: center;
  margin-top:20px;
}
</style>
