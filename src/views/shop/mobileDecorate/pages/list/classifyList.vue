<template>
  <div>
    <div class="head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="true">
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
    <div class="table" v-calcHeight="300">
      <p>微页面分类（共{{total || 0}}个）</p>
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="name" label="分类名称">
           <template slot-scope="scope">
            <span class="page_name" @click="_routeTo('m_decorateClassifyPreview', {pageId: scope.row.id})">{{scope.row.name}} </span>
          </template>
        </el-table-column>
        <el-table-column prop="pageNum" label="页面数量"></el-table-column>
        <el-table-column prop="createTime" sortable label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" sortable label="更新时间"></el-table-column>
        <el-table-column prop="updateUserName" label="操作账号"></el-table-column>
        <el-table-column prop="" label="操作" :width="'300px'" fixed="right">
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
        dateSort: '0'
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
        return location.protocol + row.shareUrl.split(':')[1]
      }
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
.page_name{
  cursor: pointer;
  text-decoration:underline;
  &:hover{
    color: $globalMainColor;
  }
}
</style>
