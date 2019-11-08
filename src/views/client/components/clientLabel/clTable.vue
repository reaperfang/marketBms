/* 客户标签列表 */
<template>
  <div>
    <el-table
      :data="tagList"
      style="width: 100%"
      ref="clientLabelTable"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      v-loading="loading"
      >
      <el-table-column
        type="selection"
      >
      </el-table-column>
      <el-table-column
        prop="tagName"
        label="标签名称">
      </el-table-column>
      <el-table-column
        prop="tagType"
        label="标签类型">
      </el-table-column>
      <el-table-column label="包含人数">
        <template slot-scope="scope">
            <span class="edit_span" @click="_routeTo('allClient', {memberLabels: scope.row.id})" v-if="scope.row.labelContains !== 0">{{scope.row.labelContains}}</span>
            <span class="edit_span" v-else style="color:#000">{{scope.row.labelContains}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="labelCondition"
        label="标签条件">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <span class="edit_span" @click="edit(scope.row)" v-permission="['客户', '客户标签', '默认页面', '查看标签']">
                <!-- <i class="edit_i"></i> -->
                查看&编辑
            </span>
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
    <div class="a_line">
      <el-checkbox v-model="checkAll" @change="handleChange"></el-checkbox>
      <el-button type="primary" @click="batchDelete" class="marL20">批量删除</el-button>
    </div>
  </div>
</template>

<script type='es6'>
import clientApi from '@/api/client'
import TableBase from "@/components/TableBase";
export default {
  name: "clTable",
  extends: TableBase,
  props: ['params'],
  data() {
    return {
      checkAll: false,
      tagList: [],
      loading: false,
      canDelete: true
    };
  },
  computed: {
  
  },
  created() {

  },
  methods: {
    checkSelectable(row,index) {
      if(row.labelContains==0) {
        return 1;
      }else{
        return 0;
      }
    },
    handleSizeChange(val) {
      this.getLabelList(1, val);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.getLabelList(val, this.pageSize);
    },
    handleChange(val) {
      this.tagList.forEach(row => {
        this.$refs.clientLabelTable.toggleRowSelection(row,val)
      });
    },
    getLabelList(startIndex, pageSize) {
      this.loading = true;
      this._apis.client.getLabelList(Object.assign(this.params, {startIndex, pageSize})).then((response) => {
        this.loading = false;
        this.$emit('stopLoading');
        response.list.map((v) => {
          v.tagType = v.tagType == 0 ? '手工':'自动';
        })
        this.tagList = [].concat(response.list);
        this.total = response.total;
      }).catch((error) => {
        this.loading = false;
        console.log(error);
      })
    },
    edit(row) {
      this._routeTo('batchImport',{id: row.id});
    },
    batchDelete() {
      this.canDelete = true;
      let rows = this.$refs.clientLabelTable.selection;
      let removeArrs = [];
      rows.map((v) => {
        if(v.labelContains !== 0) {
          this.canDelete = false;
        }else{
          removeArrs.push(v);
        }
      })
      if(!this.canDelete) {
        this.$notify({
            title: '警告',
            message: '有包含人数的标签不能删除',
            type: 'warning'
          });
      }
      if(rows.length == 0) {
        this.$notify({
          title: '警告',
          message: '请选择要删除的标签',
          type: 'warning'
        });
      }else{
        let arr = [];
        removeArrs.map((v) => {
          arr.push(v.id);
        });
        if(arr.length > 0) {
          this._apis.client.batchDeleteTag({ labelIds: arr }).then((response) => {
            this.$notify({
              title: '成功',
              message: "批量删除标签成功",
              type: 'success'
            });
            this.getLabelList(this.startIndex, this.pageSize);
            this.checkAll = false;
          }).catch((error) => {
            console.log(error);
          })
        }
      }
    }
  },
  watch: {
    params() {
      this.getLabelList(this.startIndex, this.pageSize);
    }
  },
  mounted() {
    this.getLabelList(this.startIndex, this.pageSize);
  } 
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.marL20{
  margin-left: 20px;
}
.edit_span{
    color: #655EFF;
    cursor: pointer;
    .edit_i{
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-right: 8px;
        background: url("../../../../assets/images/client/icon_edit.png") 0 0 no-repeat;
    }
}
.a_line{
  padding-left: 17px;
}
</style>
