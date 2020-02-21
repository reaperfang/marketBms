<template>
  <div>
    <div class="head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" label-width="80px" :inline="true">
        <el-form-item label="资讯标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入资讯标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="fetch">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" @click="_routeTo('p_createInfo')">新建资讯</el-button>
        <!-- <el-button type="warning" plain @click="batchDeleteInfo"  :disabled="!this.multipleSelection.length">批量删除</el-button> -->
      </div>
    </div>
    <div class="table">
      <el-table :data="tableList" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
        <!-- <el-table-column
          type="selection"
          :selectable='selectInit'
          width="30">
        </el-table-column> -->
        <el-table-column prop="title" label="标题" :width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.title && scope.row.title.length >=15" :title="scope.row.title">{{scope.row.title.substring(0,15) + '...' || '--'}}</span>
            <span v-else :title="scope.row.title">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">已保存</span>
            <span v-else-if="scope.row.type == 1">已发布</span>
            <span v-else-if="scope.row.type == 2">已下线</span>
          </template>
        </el-table-column>
        <el-table-column prop="cover" label="封面状态">
          <template slot-scope="scope">
            <span v-if="scope.row.cover">已上传</span>
            <span v-else>未上传</span>
          </template>
        </el-table-column>  
        <el-table-column prop="author" label="作者名称">
          <template slot-scope="scope">
            <span>{{scope.row.author || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="authorHeadPath" label="作者头像">
           <template slot-scope="scope">
             <img v-if="scope.row.authorHeadPath" class="author_img" :src="scope.row.authorHeadPath" alt="">
             <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="channelType" label="展示渠道">
          <template slot-scope="scope">
            <span v-if="scope.row.channelType == 1">小程序</span>
            <span v-else-if="scope.row.channelType == 2">公众号</span>
            <span v-else-if="scope.row.channelType == 3">PC端</span>
            <span v-else-if="scope.row.channelType == 4">WAP端</span>
            <span v-else>PC端</span>
          </template>
        </el-table-column>  
        <el-table-column prop="createTime" sortable label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" sortable label="最后编辑时间" :width="150">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateUserName" label="最后操作人">
          <template slot-scope="scope">
            <span>{{scope.row.updateUserName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" :width="'150px'">
          <template slot-scope="scope">
            <span class="table-btn" @click="_routeTo('p_previewInfo', {id: scope.row.id})">查看</span>
            <span class="table-btn" @click="_routeTo('p_createInfo', {id: scope.row.id})">编辑</span>
            <span class="table-btn" @click="offline(scope.row)">下线</span>
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
  </div>
</template>

<script>
import tableBase from '@/components/TableBase';
import uuid from 'uuid/v4';
export default {
  name: 'pageList',
  extends: tableBase,
  data () {
    return {
      tableList:[],
      ruleForm: {
        title: '',
        type: '',
        status: 0
      },
      visible: false,  //是否显示批量该分类浮层
      isFindPrev: false  //是否向上查询了一页
    }
  },
  created() {

  },
  methods: {

    /* 删除 */
    deleteInfo(item) {
       this.$confirm(`确定删除 [ ${item.title} ] 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._apis.shop.deleteInfos({ids: [item.id], status: 0}).then((response)=>{
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
    
    /* 下线 */
    offline(item) {
       this.$confirm(`确定下线 [ ${item.title} ] 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._apis.shop.modifyInfoType({id: item.id, type: 2}).then((response)=>{
            this.$notify({
              title: '成功',
              message: '下线成功！',
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

    /* 批量删除 */
    batchDeleteInfo(item) {
       this.$confirm(`确定删除吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = [];
          for(let item of this.multipleSelection) {
            ids.push(item.id);
          }
          this._apis.shop.deleteInfos({ids, status: 0}).then((response)=>{
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

    fetch() {
      this.loading = true;
      this._apis.shop.getInfoList(this.ruleForm).then((response)=>{
        this.tableList = response.list;
        this.total = response.total;
        this.loading = false;

        if(!this.isFindPrev) {
          if(Array.isArray(response.list) && !response.list.length) {
            this.ruleForm.startIndex = this.ruleForm.startIndex-1 > 1 ? this.ruleForm.startIndex-1 : 1;
            this.fetch();
            this.isFindPrev = true;
          }
        }
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
        this.loading = false;
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
.author_img{
  width: 50px;
  height: 40px;
  object-fit: contain;
}
</style>
