/* 渠道转化列表 */
<template>
  <div>
    <el-table
      :data="listObj.members"
      style="width: 100%"
      :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      v-loading="loading1"
      >
      <el-table-column
        type="index"
        label="排序"
        align="center">
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
             <span style="line-height:60px;display:inline-block">{{{ 0:'非会员',1:'新会员',2:'老会员'}[scope.row.memberType]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        align="center">
        <template slot-scope="scope">
             <span>{{scope.row.phone ? scope.row.phone : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="niceGoodsCount"
        label="满意商品数"
        align="center">
      </el-table-column>
      <el-table-column
        prop="niceRatio"
        label="满意率"
        align="center">
        <template slot-scope="scope">
          {{(scope.row.niceRatio*100).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column
        prop="badGoodsCount"
        label="差评商品数"
        align="center">
      </el-table-column>
      <el-table-column
        prop="badRatio"
        label="差评率" 
        align="center">
        <template slot-scope="scope">
          {{(scope.row.badRatio*100).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsCount"
        label="订单商品（总）数"
        align="center"
        width="150px">
      </el-table-column>
    </el-table>
    <div class="page_styles" v-show="listObj.totalSize>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="prev, pager, next, sizes"
        :total="listObj.totalSize"
        :background="true">
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
      pageSize:10,
      loading1: true
    };
  },
  props:{
    listObj:{
      type:Object,
      default:{}
    },
    background: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  created() {

  },
  watch: {
    loading(newValue) {
      this.loading1 = newValue;
    }
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

/**
*
* @Author zpw
* @Update 2020/4/17
* @Description  产研-电商中台  bugID: CYDSZT-3505
*
*/

/deep/ .cell{
            .btns{
                span{
                    color: #655EFF;
                    margin-right: 5px;
                }
            }
        }
        .page_styles {
    margin: 40px 0 30px 0;
}

</style>
