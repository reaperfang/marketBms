/* 会员分析列表 */
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
        width="80"
        fixed="left"
        class-name="table-padding"
        align="left">
      </el-table-column>
      <el-table-column
        prop="id"
        label="用户ID"
        align="center"
        width="150px">
      </el-table-column>
      <el-table-column
        label="用户类型"
        align="center"
        width="150px">
        <template slot-scope="scope">
          <span style="display:inline-block">{{{0:'非会员',1:'新会员',2:'老会员'}[scope.row.memberType]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码"
      align="center"
      width="150px">
        <template slot-scope="scope">
            <span v-if="!scope.row.phone" class="txtCenter"> - </span>
            <span v-else>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="昵称"
      align="center">
      </el-table-column>
      <el-table-column
        prop="score"
        label="积分"
      align="right">
      </el-table-column>
      <el-table-column
        label="(会员)入会时间"
        width="170"
      align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.joinTime">
            {{Number(scope.row.joinTime) | formatDate('yyyy-MM-dd hh:mm:ss')}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tradeCount"
        label="交易(总)次数"
        align="right"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="orderPaymentCount"
        label="订单(总)金额"
        align="center"
        min-width="150px"
        width="right">
      </el-table-column>
      <el-table-column
        label="最后交易时间"
        width="180"
        class-name="table-padding"
      align="right"
      fixed="right">
        <template slot-scope="scope" style="width:171px;">
          <span>{{Number(scope.row.lastTradeTime) | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_styles" v-show="listObj.totalSize>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(startIndex) || 1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
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
  props:['listObj','totalCount','background','nowPage', 'loading'],
  data() {
    return {
      pageSize:10,
      startIndex: 1,
      loading1: true
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
  watch: {
    nowPage(val) {
      if(val) {
        this.startIndex = val;
      }
    },
    loading(newValue) {
      this.loading1 = newValue;
    }
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
      this.startIndex = val;
      this.$emit('currentChange',val)
    }
    
  },
  components: {}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.txtCenter{
  text-align:center; 
  width:80%;
  display:inline-block
}

.page_styles {
    margin: 40px 0 30px 0;
}
</style>
