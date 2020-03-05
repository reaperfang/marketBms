/* 选择系统内置图标 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'系统内置图标'" @submit="submit">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true">
      <div class="inline-head">
      <el-form-item label="链接地址" prop="groupId">
          <el-select style="width:150px" v-model="groupId" placeholder="选择系统链接">
               <el-option v-for="(item, key) of classifyList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-button type="primary" @click="seleteOneLink" v-if="['7','8','9','10','11'].includes(currentNav.systemNavLinkUrl)">选择</el-button>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-button type="primary" @click="fetch">搜  索</el-button>
          <el-button type="primary" @click="fetch($event, true)">刷 新</el-button>
        </el-form-item>
        groupList
      </div>
    </el-form>
    <el-table
    stripe
    :data="tableList"
    :row-key="getRowKey"
    ref="multipleTable"
    @selection-change="handleSelectionChange"
    v-loading="loading">
        <el-table-column
          type="selection"  
          :selectable="itemSelectable"
          :reserve-selection="true"
          width="55">
        </el-table-column>
        <el-table-column prop="name" label="活动标题">
          <template slot-scope="scope">
            <div class="name_wrapper">
              <img :src="scope.row.activityPic" alt="">
              <p>{{scope.row.name}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">  <!-- 0是未生效  1是生效中 2是已失效-->
           <template slot-scope="scope">
            <span v-if="scope.row.status === 0">未生效</span>
            <span v-else-if="scope.row.status === 1">生效中</span>
            <span v-else-if="scope.row.status === 2">已失效</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <div slot="empty" class="table_empty">
          <img src="../../../../assets/images/table_empty.png" alt="">
          <div class="tips">暂无数据<span @click="addNewApply('/application/promotion/addPackbuy')">去创建？</span><i>创建后，请回到此页面选择数据</i></div>
        </div>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(startIndex) || 1"
          :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
          :page-size="pageSize*1"
          :total="total*1"
          layout="total, sizes, prev, pager, next, jumper"
          >
        </el-pagination>
      </div>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import tableBase from '@/components/TableBase';
import utils from "@/utils";
import uuid from 'uuid/v4';
import { getToken } from '@/system/auth'
export default {
  name: "dialogSelectSystemIcon",
  extends: tableBase,
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
      pageSize: 5,
      tableList: [],
      multipleSelection: [],
      pageNum: 1,
      ruleForm: {
        groupId: -1
      },
      rules: {}
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
  watch:{
    groupId(){
      this.fetch()
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
      this._apis.goodsOperate.getSystemIconByGroupId(this.ruleForm).then((response)=>{
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
      let query ={
        type:'0'
      }
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
      this.$emit('imageSelected',  this.selectedItem);
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
.material_head{
  margin-bottom:20px;
    .select{
      display: flex;
      padding-left: 5px;
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
  height:390px;
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
.pages{
  text-align: center;
  margin-top: 20px;
}
</style>