/* 批量导入客户列表 */
<template>
  <div>
    <el-table
      :data="importList"
      style="width: 100%"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      v-loading="loading"
      >
      <el-table-column
        prop="importTime"
        label="导入时间">
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
      <el-table-column label="操作">
        <template slot-scope="scope">
            <div class="btns clearfix">
                <span @click="addTag(scope.row)">添加标签</span>
                <span @click="modify(scope.row)">修改身份等级</span>
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
      }
    },
    modify(row) {
      this.hackReset = false;
      this.$nextTick(() => {
        this.hackReset = true;
      })
      this.dialogVisible = true;
      this.currentDialog = "changeIdentityDialog";
      this.currentData.successNum = row.successNum;
      this.currentData.id = row.id;
    }
  },
  watch: {
    params(val) {
      this.getImportList(1, this.pageSize);
    }
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .cell{
            .btns{
                span{
                    color: #655EFF;
                    margin-right: 5px;
                    cursor: pointer;
                }
            }
        }

</style>
