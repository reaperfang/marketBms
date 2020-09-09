/* 批量导入用户列表 */
<template>
  <div>
    <el-table
      :data="importList"
      style="width: 100%"
      :header-cell-style="{background:'#f6f7fa', color:'#44434B', height: '46px'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      v-loading="loading"
      >
      <el-table-column
        prop="importTime"
        label="导入时间"
        :width="200">
      </el-table-column>
      <el-table-column
        prop="channerlName"
        label="渠道">
      </el-table-column>
      <el-table-column
        prop="totalNum"
        label="导入数量">
      </el-table-column>
      <el-table-column
        prop="successNum"
        label="导入成功数"
      >
      </el-table-column>
      <el-table-column
        prop="failNum"
        label="导入失败数"
      >
      </el-table-column>
      <el-table-column
        prop="createUserName"
        label="操作人"
      >
      </el-table-column>
      <el-table-column label="操作" :width="200">
        <template slot-scope="scope">
            <div class="btns clearfix">
                <span @click="addTag(scope.row)" :class="scope.row.successNum == 0?'gray':''">添加标签</span>
                <span @click="modify(scope.row)" :class="scope.row.successNum == 0?'gray':''">修改身份等级</span>
            </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_styles">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(startIndex) || 1"
        :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
        :page-size="pageSize*1"
        :total="total*1"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <component 
      :is="currentDialog" 
      :dialogVisible.sync="dialogVisible" 
      :data="currentData"
      v-if="hackReset"
    >
    </component>
  </div>
</template>
<script type='es6'>
import TableBase from "@/components/TableBase";
import batchAddTagDialog from '../../dialogs/clientImport/batchAddTagDialog'
import changeIdentityDialog from '../../dialogs/clientImport/changeIdentityDialog';
export default {
  name: "ciTable",
  extends: TableBase,
  props: [ 'params' ],
  components: { batchAddTagDialog, changeIdentityDialog },
  data() {
    return {
      importList: [],
      currentDialog: "",
      dialogVisible: false,
      currentData:{},
      hackReset: false,
      loading: false,
      startIndex: 1,
      pageSize: 10
    };
  },
  computed: {
    
  },
  mounted() {
    this.getImportList();
  },
  created() {

  },
  methods: {
    handleSizeChange(val) {
      this.getImportList(this.startIndex, val);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.getImportList(val, this.pageSize);
      this.startIndex = val;
    },
    getImportList(startIndex, pageSize) {
      this.loading = true;
      this._apis.client.importMemberList(Object.assign(this.params,{startIndex, pageSize})).then((response) => {
        this.loading = false;
        this.importList = [].concat(response.list);
        this.total = response.total;
      }).catch((error) => {
        this.loading = false;
        console.log(error);
      })
    },
    addTag(row) {
      if(row.successNum !== 0) {
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        })
        this.dialogVisible = true;
        this.currentDialog = "batchAddTagDialog";
        this.currentData.successNum = row.successNum;
        this.currentData.id = row.id;
      }else{
        this.$message({
          message: '无导入成功数不能添加标签',
          type: 'warning'
        });
      }
    },
    modify(row) {
      if(row.successNum == 0) {
        this.$message({
          message: '无导入成功数不能修改身份等级',
          type: 'warning'
        });
      }else{
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        })
        this.dialogVisible = true;
        this.currentDialog = "changeIdentityDialog";
        this.currentData.successNum = row.successNum;
        this.currentData.id = row.id;
      }
    }
  },
  watch: {
    params(val) {
      this.startIndex = 1;
      this.getImportList(this.startIndex, this.pageSize);
    }
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .cell{
            .btns{
                span{
                    color: #655EFF;
                    cursor: pointer;
                    &:first-child{
                      padding-right: 5px;
                      border-right: 1px solid #dadae3;
                    }
                    &.gray{
                      color: #c9c9c9;
                    }
                }
            }
        }
/deep/ .el-table td, /deep/ .el-table th {
        text-align: center;
        &:nth-child(1) {
            text-align: left;
            padding-left: 20px;
        }
    }
/deep/ .el-table td{
  &:nth-child(3) {
    text-align: right;
    padding-right: 75px;
  }
  &:nth-child(4) {
    text-align: right;
    padding-right: 75px;
  }
  &:nth-child(5) {
    text-align: right;
    padding-right: 75px;
  }
}
.page_styles{
  margin: 40px 0 34px 0;
}
</style>
