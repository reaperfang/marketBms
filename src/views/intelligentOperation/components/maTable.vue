/* 会员分析列表 */
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
        label="客户ID">
      </el-table-column>
      <el-table-column
        label="客户类型">
        <template slot-scope="scope">
            <span v-if="!scope.row.memberType" class="txtCenter"> - </span>
             <span v-else style="line-height:60px; display:inline-block">{{{0:'非会员',1:'新会员',2:'老会员'}[scope.row.memberType]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码"
      >
        <template slot-scope="scope">
            <span v-if="!scope.row.phone" class="txtCenter"> - </span>
            <span v-else>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="昵称"
      >
      </el-table-column>
      <el-table-column
        prop="score"
        label="积分"
      >
      </el-table-column>
      <el-table-column
        label="（会员）入会时间"
        width="150"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.joinTime">
            {{Number(scope.row.joinTime) | formatDate('yyyy-MM-dd hh:mm:ss')}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tradeCount"
        label="交易次数（总）"
      >
      </el-table-column>
      <el-table-column
        prop="orderPaymentCount"
        label="订单（总）金额"
      >
      </el-table-column>
      <el-table-column
        label="最后交易时间"
      >
        <template slot-scope="scope">
          <span>{{Number(scope.row.lastTradeTime) | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_styles">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="listObj.totalSize">
      </el-pagination>
    </div>
  </div>
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
export default {
  name: "mcTable",
  extends: TableBase,
  props:['listObj','totalCount'],
  data() {
    return {
      pageSize:10,
      // dataList:[
      //   {
      //       choose: true,
      //       importTime:"",
      //       channel:"",
      //       importNum:"",
      //       successNum:"",
      //       failNum:"",
      //       buyTime:"",
      //       operator:""
      //   },
      // ],
    };
  },
  computed:{

  },
  created() {

  },
  methods: {
    //更改每页条数
    handleSizeChange(val){
      this.pageSize = val;
      this.$emit('sizeChange',val)
    },
    //选择页数
    handleCurrentChange(val){
      console.log(val)
      this.$emit('currentChange',val)
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
.txtCenter{
  text-align:center; 
  width:80%;
  display:inline-block
}
</style>
