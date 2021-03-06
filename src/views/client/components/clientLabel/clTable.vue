/* 用户标签列表 */
<template>
  <div>
    <el-table
      :data="tagList"
      style="width: 100%"
      ref="clientLabelTable"
      :header-cell-style="{background:'#f6f7fa', color:'#44434B', height: '46px'}"
      :default-sort="{prop: 'date', order: 'descending'}"
      v-loading="loading"
      @select-all="handleSelectAll"
      @selection-change="handleSelectChange"
    >
      <el-table-column type="selection" width="34"></el-table-column>
      <el-table-column prop="tagName" label="标签名称" min-width="180" fixed="left" class-name="table-padding"></el-table-column>
      <el-table-column prop="tagType" label="标签类型" align="center"></el-table-column>
      <el-table-column label="包含人数" align="right" min-width="120">
        <template slot-scope="scope">
          <span
            class="edit_span"
            @click="_routeTo('allClient', {memberLabels: scope.row.id})"
            v-if="scope.row.labelContains !== 0"
          >{{scope.row.labelContains}}</span>
          <span class="edit_span" v-else style="color:#000">{{scope.row.labelContains}}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签条件" align="center" min-width="200">
        <template slot-scope="scope">
          <div>
            {{scope.row.labelCondition?scope.row.labelCondition.substring(0,scope.row.labelCondition.lastIndexOf(',')):""}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" min-width="160"></el-table-column>
      <el-table-column label="操作" width="122" fixed="right" header-align="center" class-name="table-padding">
        <template slot-scope="scope">
          <div class="table-operate">
            <span
              class="edit_span table-btn"
              @click="edit(scope.row)"
              v-permission="['用户', '用户标签', '默认页面', '查看标签']"
            >
              编辑
            </span>
            <span class="edit_span table-btn table-warning" @click="deleteRow(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="a_line table-select">
      <el-checkbox v-model="checkAll" @change="handleChange" :indeterminate="isIndeterminate">全选</el-checkbox>
      <el-button @click="batchDelete" class="border-button">批量删除</el-button>
    </div>
    <div class="page_styles">
      <el-pagination
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(startIndex) || 1"
        :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
        :page-size="pageSize*1"
        :total="total*1"
        layout="prev, pager, next, sizes"
      ></el-pagination>
    </div>
  </div>
</template>

<script type='es6'>
import clientApi from "@/api/client";
import TableBase from "@/components/TableBase";
export default {
  name: "clTable",
  extends: TableBase,
  props: ["params"],
  data() {
    return {
      checkAll: false,
      tagList: [],
      loading: false,
      canDelete: true,
      isIndeterminate: false
    };
  },
  computed: {},
  created() {},
  methods: {
    handleSelectChange(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.tagList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tagList.length;
    },
    handleSelectAll(val) {
      if(!val.length) {
        this.checkAll = false
      }else{
        this.checkAll = true;
      }
    },
    deleteRow(row) {
      this.confirm({
        customClass: "goods-custom",
        icon: true,
        text: "确认删除标签？"
      }).then(() => {
        if (row.labelContains == 0) {
          this._apis.client
            .batchDeleteTag({ labelIds: [row.id] })
            .then(response => {
              this.$message({
                message: "删除标签成功",
                type: "success"
              });
              this.getLabelList(this.startIndex, this.pageSize);
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          this.$message({
            message: "有包含人数的标签不能删除",
            type: "warning"
          });
        }
      });
    },
    handleSizeChange(val) {
      this.$nextTick(() => {
        this.checkAll = false;
      });
      this.getLabelList(1, val);
      this.pageSize = val;
      this.$refs.clientLabelTable.clearSelection();
    },
    handleCurrentChange(val) {
      this.$nextTick(() => {
        this.checkAll = false;
      })
      this.getLabelList(val, this.pageSize);
      this.startIndex = val;
      this.$refs.clientLabelTable.clearSelection();
    },
    handleChange(val) {
      this.tagList.forEach(row => {
        this.$refs.clientLabelTable.toggleRowSelection(row, val);
      });
    },
    getLabelList(startIndex, pageSize) {
      this.loading = true;
      this._apis.client
        .getLabelList(Object.assign(this.params, { startIndex, pageSize }))
        .then(response => {
          this.loading = false;
          this.$emit("stopLoading");
          response.list.map(v => {
            v.tagType = v.tagType == 0 ? "手工" : "自动";
          });
          this.tagList = [].concat(response.list);
          this.total = response.total;
        })
        .catch(error => {
          this.loading = false;
          console.error(error);
        });
    },
    edit(row) {
      this._routeTo("batchImport", { id: row.id });
    },
    batchDelete() {
      this.canDelete = true;
      let rows = this.$refs.clientLabelTable.selection;
      let removeArrs = [];
      rows.map(v => {
        if (v.labelContains !== 0) {
          this.canDelete = false;
        } else {
          removeArrs.push(v);
        }
      });
      if (!this.canDelete) {
        this.$message({
          message: "有包含人数的标签不能删除",
          type: "warning"
        });
      }
      if (rows.length == 0) {
        this.$message({
          message: "请选择要删除的标签",
          type: "warning"
        });
      } else {
        let arr = [];
        removeArrs.map(v => {
          arr.push(v.id);
        });
        if (arr.length > 0) {
          this._apis.client
            .batchDeleteTag({ labelIds: arr })
            .then(response => {
              this.$message({
                message: "批量删除标签成功",
                type: "success"
              });
              this.getLabelList(this.startIndex, this.pageSize);
              this.checkAll = false;
            })
            .catch(error => {
              console.error(error);
            });
        }
      }
    }
  },
  watch: {
    params() {
      this.getLabelList(1, this.pageSize);
    }
  },
  mounted() {
    this.getLabelList(1, this.pageSize);
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-table--small td, .el-table--small th{
  padding: 16px 0;
}
.marL20 {
  margin-left: 20px;
}
.edit_span {
  color: #655eff;
  cursor: pointer;
}
.a_line {
  margin: 20px 0 40px 16px;
}
.page_styles{
  text-align: center;
  margin-bottom: 30px;
}
</style>
