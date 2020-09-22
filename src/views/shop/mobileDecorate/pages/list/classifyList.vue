<template>
  <div>
    <div class="head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="true" class="input_style">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入分类名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="startIndex = 1;ruleForm.startIndex = 1;fetch()">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" @click="_routeTo('m_classifyEditor')">新建分类</el-button>
      </div>
    </div>
    <div class="table" v-calcMinHeight="313">
      <p>微页面分类（共{{total || 0}}个）</p>
      <el-table :data="tableData" stripe v-loading="loading" :default-sort = "{prop: 'date', order: 'descending'}" @sort-change="changeSort">
        <el-table-column prop="name" label="分类名称" min-width="150" fixed="left" class-name="table-padding">
           <template slot-scope="scope">
            <span class="page_name" @click="_routeTo('m_decorateClassifyPreview', {pageId: scope.row.id})">{{scope.row.name}} </span>
          </template>
        </el-table-column>
        <el-table-column prop="pageNum" label="页面数量" align="right"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" min-width="160"></el-table-column>
        <el-table-column prop="updateTime" sortable="custom" label="最后编辑时间" align="center" min-width="160"></el-table-column>
        <el-table-column prop="updateUserName" label="操作账号" align="center"></el-table-column>
        <el-table-column prop="" label="操作" width="154" fixed="right" align="left" class-name="table-padding table-th-center">
          <template slot-scope="scope">
            <span class="table-btn" @click="_routeTo('m_classifyEditor', {pageId: scope.row.id})">编辑</span>
            <span class="table-btn" @click="deleteClassify(scope.row)">删除</span>
            <el-popover
              placement="right"
              width="400"
              trigger="click">
              <div style="display:flex;">
                <el-input :value="getPageLink(scope.row)" style="margin-right:10px"></el-input>
                <el-button type="primary" v-clipboard:copy="getPageLink(scope.row)" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</el-button>
              </div>
              <span class="table-btn" slot="reference" @click="link(scope.row)">链接</span>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-if="tableData.length">
        <el-pagination
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(startIndex) || 1"
          :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
          :page-size="pageSize*1"
          :total="total*1"
          layout="prev, pager, next, sizes"
          >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import tableBase from '@/components/TableBase';
export default {
  name: 'classifyList',
  extends: tableBase,
  components: {},
  data () {
    return {
      tableData:[],
      currentItem: {},
      ruleForm: {
        status: '1',
        name: '',
        dateSort: 0
      }
    }
  },
  created() {
  },
  methods: {

    /* 删除分类 */
    deleteClassify(item) {
      this.currentItem = item;
      this.confirm({
        title: '提示', 
        customClass: 'goods-custom', 
        icon: true, 
        text: `确定删除 [ ${item.name} ] 吗？`
      }).then(() => {
          this._apis.shop.deleteClassifys({id: item.id}).then((response)=>{
            this.$message.success('删除成功！');
            this.fetch();
          }).catch((error)=>{
            this.$message.error(error);
          });
        })
    },

    /* 链接 */
    link(item) {
      this.currentItem = item;
    },

    fetch() {
       this.loading = true;
       this._apis.shop.getClassifyList(this.ruleForm).then((response)=>{
        this.tableData = response.list;
        this.total = response.total;
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    onCopy () {
      this.$message({
        message: `复制成功！`,
        type: 'success'
      });
    //   this.snackBar.info(this.$t('prompt.copySuccess'))
    },
    onError () {
      this.$message.error(this.$t('prompt.copyFail'))
    },

    getPageLink(row) {
      if(row.shareUrl) {
        return 'https:' + row.shareUrl.split(':')[1]
      }
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
  border-radius: 0 0 4px 4px;
}
/deep/ .table{
  // overflow-y: auto;
  margin-top:20px;
  background:#fff;
  padding:20px;
  padding-bottom:50px;
  border-radius: 4px;
  p{
    margin-bottom:20px;
  }
}
/deep/ thead th{
  background: #f6f7fa!important;
  color:#44434B!important;
}
.table-btn{
  padding-right: 5px;
  border-right: 1px solid #dadae3;
  &:last-child{
    border-right: none;
  }
}
.page_name{
  cursor: pointer;
  text-decoration:underline;
  &:hover{
    color: $globalMainColor;
  }
}
</style>
