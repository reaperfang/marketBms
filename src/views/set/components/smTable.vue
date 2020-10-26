/* 店铺列表 */
<template>
  <div>
    <el-table
      :data="dataList"
      style="width: 100%"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      :default-sort = "{prop: 'name9', order: 'descending'}"
      >
      <el-table-column
        prop="shopName"
        label="店铺姓名">
      </el-table-column>
      <el-table-column
        prop="shopStatus"
        label="店铺状态">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="分配状态">
      </el-table-column>
      <el-table-column
        prop="status"
        label="负责人姓名">
      </el-table-column>
      <el-table-column
      label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">变更负责人</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_styles">
      <el-pagination
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="prev, pager, next, sizes"
        :total="100">
      </el-pagination>
    </div>
  </div>
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
export default {
  name: "smTable",
  extends: TableBase,
  data() {
    return {
      dataList:[
        {
          shopName:'123213',
          shopStatus:'123123',
          amount:'123123',
          status:'1',
        },
      ],
    };
  },
  created() {

  },
  methods: {
    handleClick(row){

    }
  },
  components: {}
};
</script>
