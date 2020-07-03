<template>
  <div>
    <div class="head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="true">
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
          <el-button type="primary" @click="startIndex = 1;ruleForm.startIndex = 1;fetch()">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" @click="_routeTo('m_templateManageIndex', {'tab': 'myTemplate'})">新建页面</el-button>
      </div>
    </div>
    <div class="table" v-calcHeight="300">
      <p>微页面（共{{total || 0}}个）</p>
      <el-table :data="tableData" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" :default-sort = "{prop: 'date', order: 'descending'}" @sort-change="changeSort">
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
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" sortable="custom" label="最后编辑时间"></el-table-column>
        <el-table-column prop="updateUserName" label="操作账号"></el-table-column>
        <el-table-column prop="" label="操作" :width="'300px'" fixed="right">
          <template slot-scope="scope">
            <span class="table-btn" @click="copyPage(scope.row)">复制</span>
            <span class="table-btn" @click="_routeTo('m_shopEditor', {pageId: scope.row.id})">编辑</span>
            <span class="table-btn" @click="deletePage(scope.row)" v-if="scope.row.isHomePage !== 1">删除</span>
            <span class="table-btn" @click="spread(scope.row)">推广</span>
            <span class="table-btn" @click="setIndex(scope.row)" v-if="scope.row.isHomePage !== 1">设为首页</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="multiple_selection" v-if="tableData.length">
        <el-checkbox class="selectAll" @change="selectAll" v-model="selectStatus">全选</el-checkbox>
        <el-button class="border-button" v-popover:popover4 :disabled="!this.multipleSelection.length">批量改分类</el-button>
        <el-button class="border-button" @click="batchDeletePage"  :disabled="!this.multipleSelection.length">批量删除</el-button>
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
      </div>
      <div class="pagination" v-if="tableData.length">
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
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :pageId="currentItem.id" :pageLink="pageLink"></component>
  </div>
</template>

<script>
import tableBase from '@/components/TableBase';
import dialogPopularize from '@/views/shop/dialogs/decorateDialogs/dialogPopularize';
export default {
  name: 'pageList',
  extends: tableBase,
  components: {dialogPopularize},
  data () {
    return {
      tableData:[],
      classifyList: [],
      dialogVisible: false,
      currentDialog: '',
      currentItem: {},
      ruleForm: {
        status: '0',
        pageCategoryInfoId: '',
        name: '',
        dateSort: 0
      },
      seletedClassify: '',   //选中的分类
      visible: false,  //是否显示批量该分类浮层
      pageLink: '',
      disableStatus: [1],  //不可选状态值
      disableKey: 'isHomePage'
    }
  },
  created() {
    this.getClassifyList();
  },
  watch: {
    currentItem: {
      handler(newValue) {
        if(newValue && newValue.shareUrl) {
          this.pageLink = 'https:' + newValue.shareUrl.split(':')[1]
        }
      },
      deep: true
    }
  },
  methods: {

    /* 复制页面 */
    copyPage(item) {
      this.currentItem = item;
      this.confirm({
        title: '提示',
        customClass: 'goods-custom',
        icon: true,
        text: `确定复制 [ ${item.name} ] 吗？`
      }).then(() => {
          this._apis.shop.copyPage({id: item.id}).then((response)=>{
            this.$message.success('复制成功！')
            this.fetch();
          }).catch((error)=>{
            this.$message.error(error);
          });
        })
    },

    /* 删除页面 */
    deletePage(item) {
       this.currentItem = item;
       this.confirm({
        title: '提示',
        customClass: 'goods-custom',
        icon: true,
        text: `确定删除 [ ${item.name} ] 吗？`
      }).then(() => {
          this._apis.shop.deletePages({ids: [item.id]}).then((response)=>{
            this.$message.success('删除成功！')
            this.fetch();
          }).catch((error)=>{
            this.$message.error(error);
          });
        })
    },

    /* 批量删除页面 */
    batchDeletePage(item) {
       this.confirm({
        title: '提示',
        customClass: 'goods-custom',
        icon: true,
        text: `确定删除吗？`
      }).then(() => {
          const ids = [];
          for(let item of this.multipleSelection) {
            ids.push(item.id);
          }
          this._apis.shop.deletePages({ids}).then((response)=>{
            this.$message.success('删除成功！')
            this.fetch();
          }).catch((error)=>{
            this.$message.error(error);
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
      this.confirm({
        title: '提示',
        customClass: 'goods-custom',
        icon: true,
        text: `确定将 [ ${item.name} ] 设为首页吗？`
      }).then(() => {
          this._apis.shop.setIndex({id: item.id}).then((response)=>{
            this.$message.success('设置成功！')
            this.fetch();
          }).catch((error)=>{
            this.$message.error(error);
          });
        })
    },

    fetch() {
      this.loading = true;
      this._apis.shop.getPageList(this.ruleForm).then((response)=>{
        this.tableData = response.list;
        this.total = response.total;
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },


    //获取分类列表
    getClassifyList() {
      this._apis.shop.selectAllClassify({}).then((response)=>{
        this.classifyList = response;
      }).catch((error)=>{
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
        this.$message.success('修改成功！')
        this.fetch();
      }).catch((error)=>{
        this.$message.error(error);
      });
    },

    // 修改禁用
    selectInit(row, index){
      return (row.isHomePage != 1)
    },

    //时间排序
    changeSort(val){
      if(val && val.order == 'ascending') {
        this.ruleForm.dateSort = 1
      }else if(val && val.order == 'descending'){
        this.ruleForm.dateSort = 0
      }else{
        return
      }
      this.fetch()
    },
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
  overflow-y: auto;
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
  text-decoration:underline;
  &:hover{
    color: $globalMainColor;
  }
}
</style>
