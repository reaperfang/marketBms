<template>
  <div>
    <div class="head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="true" class="input_style">
        <el-form-item label="资讯标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入资讯标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-select  v-model="ruleForm.type" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="未发布" :value="0"></el-option>
            <el-option label="已下线" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="startIndex = 1;ruleForm.startIndex = 1;fetch()">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" @click="_routeTo('p_createInfo')">新建资讯</el-button>
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" :default-sort = "{prop: 'date', order: 'descending'}" @sort-change="changeSort">
        <el-table-column
          type="selection"
          :selectable='selectInit'
          width="28">
        </el-table-column>
        <el-table-column prop="title" label="标题" :width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.title && scope.row.title.length >=15" :title="scope.row.title">{{scope.row.title.substring(0,15) + '...' || '--'}}</span>
            <span v-else :title="scope.row.title">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">未发布</span>
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
            <img v-if="scope.row.authorHeadPath" class="author_img" :src="scope.row.authorHeadPath" alt="失败">
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="channelType" label="展示渠道">
          <template slot-scope="scope">
            <span v-if="scope.row.channelType == 3">PC端</span>
            <span v-else-if="scope.row.channelType == 4">WAP端</span>
          </template>
        </el-table-column>   -->
        <el-table-column prop="createTime" label="创建时间">
           <template slot-scope="scope">
            <span>{{scope.row.createTime || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" sortable="custom" label="最后编辑时间" :width="150">
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

            <span class="table-btn" @click="release(scope.row)">发布</span>

            <span class="table-btn" @click="deleteInfo(scope.row)" v-if="scope.row.type !== 1">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="multiple_selection" v-if="tableData.length">
        <el-checkbox class="selectAll" @change="selectAll" v-model="selectStatus">全选</el-checkbox>
        <el-button type="warning" plain @click="batchDeleteInfo"  :disabled="!this.multipleSelection.length">批量删除</el-button>
      </div>
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
  name: 'pageList',
  extends: tableBase,
  data () {
    return {
      tableData:[
        {
          name: '表格适合各项字段长度',
          coverStatus: 1,
          showChannel: 1,
          status: 0,
          updateTime: '2016-09-21  08:50:08',
          updateUserName: 'admin'
        },
        {
          name: '本模版相对报表模板',
          coverStatus: 2,
          showChannel: 1,
          status: 1,
          updateTime: '2016-09-21  08:50:08',
          updateUserName: 'admin'
        },
        {
          name: '以适用于更广泛的场景',
          coverStatus: 2,
          showChannel: 1,
          status: 2,
          updateTime: '2016-09-21  08:50:08',
          updateUserName: 'admin'
        }
      ],
      ruleForm: {
        type: '',
        title: '',
        status: 1,
        sort: 0
      },
      visible: false,  //是否显示批量该分类浮层
      isFindPrev: false//是否向上查询了一页
    }
  },
  created() {

  },
  methods: {

    /* 删除 */
    deleteInfo(item) {
      this.confirm({
        customClass: 'goods-custom', 
        icon: true, 
        text: `确定删除 [ ${item.title} ] 吗？`
      }).then(() => {
          this._apis.shop.deleteInfos({ids: [item.id], status: 1}).then((response)=>{
            this.$message.success('删除成功！');
            this.fetch();
          }).catch((error)=>{
            this.$message.error(error);
          });
        })
    },
    
    /* 发布 */
    release(item) {
      this.confirm({
        customClass: 'goods-custom', 
        icon: true, 
        text: `确定发布 [ ${item.title} ] 吗？`
      }).then(() => {
           this._apis.shop.modifyInfoType({id: item.id, type: 1}).then((response)=>{
            this.$message.success('发布成功！');
            this.fetch();
          }).catch((error)=>{
            this.$message.error(error);
          });
        })
    },

    /* 批量删除 */
    batchDeleteInfo(item) {
      this.confirm({
        customClass: 'goods-custom', 
        icon: true, 
        text: `确定删除吗？`
      }).then(() => {
          const ids = [];
          for(let item of this.multipleSelection) {
            ids.push(item.id);
          }
          this._apis.shop.deleteInfos({ids, status: 1}).then((response)=>{
            this.$message.success('删除成功！');
            this.fetch();
          }).catch((error)=>{
            this.$message.error(error);
          });
        })
    },

    fetch() {
      this.loading = true;
      this._apis.shop.getInfoList(this.ruleForm).then((response)=>{
        this.tableData = response.list;
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
        console.error(error);
        this.loading = false;
      });
    },

    // 修改禁用
    selectInit(row, index){
      // return (row.isHomePage != 1)
    },

    //时间排序
    changeSort(val){
      if(val && val.order == 'ascending') {
        this.ruleForm.sort = 1
      }else if(val && val.order == 'descending'){
        this.ruleForm.sort = 0
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
