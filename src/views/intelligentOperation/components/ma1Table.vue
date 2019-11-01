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
        label="排序">
      </el-table-column>
      <el-table-column
        prop="id"
        label="用户ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="会员昵称">
      </el-table-column>
      <el-table-column
        label="客户类型">
       <template slot-scope="scope">
             <span style="line-height:60px;display:inline-block">{{{1:'非会员',2:'老会员',3:'新会员'}[scope.row.memberType]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="niceGoodsCount"
        label="满意商品数">
      </el-table-column>
      <el-table-column
        prop="niceRatio"
        label="满意率">
      </el-table-column>
      <el-table-column
        prop="badGoodsCount"
        label="差评商品数"
        >
      </el-table-column>
      <el-table-column
        prop="badRatio"
        label="差评率"
        >
      </el-table-column>
      <el-table-column
        prop="goodsCount"
        label="订单商品（总）数"
        >
      </el-table-column>
    </el-table>
    <div class="page_styles">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="sizes, prev, pager, next"
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
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .cell{
            .btns{
                span{
                    color: #655EFF;
                    margin-right: 5px;
                }
            }
        }

</style>
