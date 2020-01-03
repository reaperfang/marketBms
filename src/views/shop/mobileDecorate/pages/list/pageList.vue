<template>
  <div>
    <div class="head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" label-width="80px" :inline="true">
        <el-form-item label="" prop="pageCategoryInfoId">
          <el-select v-if="classifyList.length" v-model="ruleForm.pageCategoryInfoId" placeholder="请选择分类">
            <el-option label="全部分类" value=""></el-option>
            <el-option v-for="(item, key) of classifyList" :key="key" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入页面名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="fetch">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" @click="_routeTo('m_templateManageIndex')">新建页面</el-button>
        <el-popover
          ref="popover4"
          placement="right"
          width="400"
          title="修改分类"
          v-model="visible"
          trigger="click">
          <el-radio-group v-model="seletedClassify">
            <div v-for="(item, key) of classifyList" :key="key">
              <el-radio :label="item.id">{{item.name}}</el-radio>
            </div>
          </el-radio-group>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="visible = false; modifyClassify()">确定</el-button>
          </div>
        </el-popover>
        <el-button type="primary" plain v-popover:popover4 :disabled="!this.multipleSelection.length">批量改分类</el-button>

        <el-button type="warning" plain @click="batchDeletePage"  :disabled="!this.multipleSelection.length">批量删除</el-button>
      </div>
    </div>
    <div class="table">
      <p>微页面（共{{total || 0}}个）</p>
      <el-table :data="tableList" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column
          type="selection"
          :selectable='selectInit'
          width="30">
        </el-table-column>
        <el-table-column prop="name" label="页面名称">
          <template slot-scope="scope">
            <span class="page_name" @click="_routeTo('m_decoratePreview', {pageId: scope.row.id})">{{scope.row.name}} </span>
            <span class="index_page_flag" v-if="scope.row.isHomePage == 1">首页</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="页面标题"></el-table-column>
        <el-table-column prop="pageCategoryName" label="所属分类">
          <template slot-scope="scope">
            <span v-if="scope.row.pageCategoryInfoId == '-1'">未分类</span>
            <span v-else>{{scope.row.pageCategoryName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="vv" label="访客数"></el-table-column>
        <el-table-column prop="pv" label="浏览数"></el-table-column>
        <el-table-column prop="createTime" sortable label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" sortable label="更新时间"></el-table-column>
        <el-table-column prop="updateUserName" label="操作账号"></el-table-column>
        <el-table-column prop="" label="操作" :width="'250px'">
          <template slot-scope="scope">
            <span class="table-btn" @click="copyPage(scope.row)">复制</span>
            <span class="table-btn" @click="_routeTo('m_shopEditor', {pageId: scope.row.id})">编辑</span>
            <span class="table-btn" @click="deletePage(scope.row)" v-if="scope.row.isHomePage !== 1">删除</span>
            <span class="table-btn" @click="spread(scope.row)">推广</span>
            <span class="table-btn" @click="setIndex(scope.row)" v-if="scope.row.isHomePage !== 1">设为首页</span>
          </template>
        </el-table-column>
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
    </div>
     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :pageId="currentItem.id" :pageLink="currentItem.shareUrl"></component>
  </div>
</template>

<script>
import tableBase from '@/components/TableBase';
import uuid from 'uuid/v4';
import dialogPopularize from '@/views/shop/dialogs/decorateDialogs/dialogPopularize';
export default {
  name: 'pageList',
  extends: tableBase,
  components: {dialogPopularize},
  data () {
    return {
      tableList:[],
      classifyList: [],
      dialogVisible: false,
      currentDialog: '',
      currentItem: {},
      ruleForm: {
        status: '0',
        pageCategoryInfoId: '',
        name: ''
      },
      seletedClassify: '',   //选中的分类
      visible: false  //是否显示批量该分类浮层
    }
  },
  created() {
    this.getClassifyList();
  },
  methods: {

    /* 复制页面 */
    copyPage(item) {
      this.currentItem = item;
      this.$confirm(`确定复制 [ ${item.name} ] 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._apis.shop.copyPage({id: item.id}).then((response)=>{
            this.$notify({
              title: '成功',
              message: '复制成功！',
              type: 'success'
            });
            this.fetch();
          }).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: error
            });
          });
        })
    },

    /* 删除页面 */
    deletePage(item) {
       this.currentItem = item;
       this.$confirm(`确定删除 [ ${item.name} ] 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._apis.shop.deletePages({ids: [item.id]}).then((response)=>{
            this.$notify({
              title: '成功',
              message: '删除成功！',
              type: 'success'
            });
            this.fetch();
          }).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: error
            });
          });
        })
    },

    /* 批量删除页面 */
    batchDeletePage(item) {
       this.$confirm(`确定删除吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = [];
          for(let item of this.multipleSelection) {
            ids.push(item.id);
          }
          this._apis.shop.deletePages({ids}).then((response)=>{
            this.$notify({
              title: '成功',
              message: '删除成功！',
              type: 'success'
            });
            this.fetch();
          }).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: error
            });
          });
        })
    },

    /* 推广 */
    spread(item) {
       this.currentItem = item;
       this.dialogVisible=true; 
       this.currentDialog='dialogPopularize';
    },

    /* 设为首页 */
    setIndex(item) {
       this.currentItem = item;
       this.$confirm(`确定将 [ ${item.name} ] 设为首页吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._apis.shop.setIndex({id: item.id}).then((response)=>{
            this.$notify({
              title: '成功',
              message: '设置成功！',
              type: 'success'
            });
            this.fetch();
          }).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: error
            });
          });
        })
    },

    fetch() {
      this.loading = true;
      this._apis.shop.getPageList(this.ruleForm).then((response)=>{
        this.tableList = response.list;
        this.total = response.total;
        this.loading = false;
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
        this.loading = false;
      });
    },

    
    //获取分类列表
    getClassifyList() {
      this._apis.shop.selectAllClassify({}).then((response)=>{
        this.classifyList = response;
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
      });
    },

    // 修改分类
    modifyClassify() {
      const ids = [];
      for(let item of this.multipleSelection) {
        ids.push(item.id);
      }
      this._apis.shop.modifyClassify({
        status: '0',
        ids,
        pageCategoryInfoId: this.seletedClassify
      }).then((response)=>{
        this.$notify({
          title: '成功',
          message: '修改成功！',
          type: 'success'
        });
        this.fetch();
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      });
    },

    // 修改禁用
    selectInit(row, index){
      return (row.isHomePage != 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.head-wrapper{
  background:#fff;
  padding:20px;
  padding-top:0;
}
/deep/ .table{
  margin-top:20px;
  background:#fff;
  padding:20px;
  p{
    margin-bottom:20px;
  }
}
/deep/ thead th{
  background: rgba(230,228,255,1)!important;
  color:#837DFF!important;
}
.index_page_flag{
  color:rgba(182,130,255,1);
  padding:0px 5px;
  border:1px solid rgba(182,130,255,1);
  font-size:12px;
}
.page_name{
  cursor: pointer;
  &:hover{
    color: $globalMainColor;
  }
}
</style>
