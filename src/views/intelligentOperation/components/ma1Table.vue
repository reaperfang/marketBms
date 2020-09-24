/* 渠道转化列表 */
<template>
  <div>
    <el-table
      :data="listObj.members"
      style="width: 100%"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      >
      <el-table-column
        type="index"
        label="排序"
        width="80"
        fixed="left" class-name="table-padding">
      </el-table-column>
      <el-table-column
        prop="id"
        label="用户ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="会员昵称"
        align="center">
      </el-table-column>
      <el-table-column
        label="用户类型"
        align="center">
       <template slot-scope="scope">
             <span style="line-height:60px;display:inline-block">{{{1:'非会员',2:'老会员',3:'新会员'}[scope.row.memberType]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        width="150"
        align="center">
      </el-table-column>
      <el-table-column
        prop="niceGoodsCount"
        label="满意商品数"
        min-width="120"
        align="right">
      </el-table-column>
      <el-table-column
        prop="niceRatio"
        label="满意率"
        align="right">
      </el-table-column>
      <el-table-column
        prop="badGoodsCount"
        label="差评商品数"
        min-width="120"
        align="right"
        >
      </el-table-column>
      <el-table-column
        prop="badRatio"
        label="差评率"
        align="right"
        >
      </el-table-column>
      <el-table-column
        prop="goodsCount"
        label="订单商品（总）数"
        align="right"
        fixed="right" class-name="table-padding"
        width="170px"
        >
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
        :total="listObj.totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
export default {
  name: "mcTable",
  extends: TableBase,
  data() {
    return { 
      pageSize:10
    };
  },
  props:{
    listObj:{
      type:Object,
      default:{}
    }
  },
  created() {

  },
  methods: {
    handleSizeChange(val){
      this.pageSize = val;
      this.$emit('getEvaluation',1,val)
    },
    handleCurrentChange(val){
      this.$emit('getEvaluation',val,this.pageSize)
    }
  },
 
  components: {}
};
</script>
