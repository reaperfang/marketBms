/* 选择系统内置图标 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'系统内置图标'" @submit="submit">
    <div class="icon_head">
      <span class="title">ICON分组</span>
      <div class="select">
        <el-select v-model="groupId" placeholder="全部">
          <el-option value="">全部</el-option>
          <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="fetch">搜 索</el-button>
    </div>
    <div class="icon_wrapper" ref="materialWrapper" v-loading="loading">
        <ul>
          <li class="cell-item" v-for="(item,key) in imgsArr" :key="key" @click="selectImg($event, item)">
            <img :src="item.address" alt="加载错误" @load="loadImg($event, item)" @error="loadError($event, item)"/> 
            <!-- <p class="item-desc">{{item.id}}</p> -->
          </li>
        </ul>
    </div>
    <p class="pages">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[40, 60, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total*1"
        class="page_nav">
        </el-pagination>
    </p>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogSelectSystemIcon",
  components: {DialogBase},
  props: {
      data: {},
      dialogVisible: {
          type: Boolean,
          required: true
      },
  },
  data() {
    return {
      loading: true,
      selectedItem: null,
      imgsArr: [], //维护的图片数据
      fileList: [],  //用来显示进度条的列表
      uploadState: [],
      currentPage:1,
      pageSize:40,  
      total:0,
      groupId:'',
      groupList:[]
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
    }
  },
  created() {
    this.getGroups();
    this.fetch();
  },
  mounted() {
    this.$nextTick(() => {
      if(this.$parent.$refs.dialog) {
        let zIndex = this.$el.style.zIndex;
        zIndex = Number(zIndex) + 2;
        this.$parent.$el.style.zIndex = zIndex + '';
      }
    })
  },
  methods: {
    fetch() {
      this.loading = true;
      this._apis.goodsOperate.getSystemIconByGroupId({
        groupId:this.groupId || '',
        startIndex:this.currentPage,
        pageSize:this.pageSize,
      }).then((response)=>{
        this.imgsArr = response.list
        this.total = response.total
        this.loading = false
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
        this.loading = false;
      });
    },
    //查询分组
    getGroups(){
      this._apis.goodsOperate.getSystemIconGroup({}).then((response)=>{
        this.groupList = response
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },



    /**************************** 瀑布流相关  开始 *******************************/

    /* 选中图片 */
    selectImg(event, item) {
      this.selectedItem = item;

      const imgs = this.$refs.materialWrapper.querySelectorAll('.cell-item');
      for(let item of imgs) {
        item.className = 'cell-item';
      };
      event.currentTarget.className = 'cell-item img_active';
    },


    /* 成功加载图片 */
    loadImg(event, item) {
      this.$set(item, 'loaded', true);
      this.allImgLoaded();
    },

    /* 图片加载失败 */
    loadError(event, item) {
      this.$set(item, 'loaded', true);  //只要加载了都算成功，用来后面统计
      this.allImgLoaded();
    },

    /* 检测全部图片加载结束 */
    allImgLoaded() {
      let loadedLength = 0;
      for(let item of this.imgsArr){
        if(item.loaded){
          loadedLength ++;
        }
      }

      if(loadedLength === this.imgsArr.length) {
        this.loading = false;
      }
    },

    scroll(scrollData){
        console.log(scrollData)
    },
    switchCol(col){
        this.col = col
        console.log(this.col)
    },
    loadmore(index){
        this.data = this.data.concat(this.data)
    },

    /**************************** 瀑布流相关  结束 *******************************/

    /* 向父组件提交选中的数据 */
    submit() {
      const copyItem = {...this.selectedItem};
      copyItem['filePath'] = copyItem.address;
      this.$emit('imageSelected',  copyItem);
    },

    /**********************************        分页相关      **********************/
    handleSizeChange(val){
      this.pageSize = val || this.pageSize
      this.fetch()
    },
    handleCurrentChange(pIndex){
      this.currentPage = pIndex || this.currentPage
      this.fetch()
    },

  }
};
</script>

<style lang="scss">
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
.pages{
  text-align: center;
  margin-top: 20px;
}
</style>