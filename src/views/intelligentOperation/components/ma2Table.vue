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
        prop="orderNumber"
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id ? scope.row.id : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="客户类型">
        <template slot-scope="scope">
            <span  v-if="scope.row.memberType" style="line-height:60px;display:inline-block">{{{0:'非会员',1:'新会员',2:'老会员'}[scope.row.memberType]}}</span>
            <span v-else> - </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="会员昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.name ? scope.row.name : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone ? scope.row.phone : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="维权时间"
        width="150">
        <template slot-scope="scope">
          <span>{{scope.row.tradeTime && Number(scope.row.tradeTime) | time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="protectionGoodsCount"
        label="维权商品数">
      </el-table-column>
      <el-table-column
        label="维权类型"
        >
        <template slot-scope="scope">
             <span style="line-height:60px;display:inline-block" v-if="scope.row.protectionType">{{{1:'退款（仅退款不退货）',2:'退款退货',3:'换货'}[scope.row.protectionType]}}</span>
             <span style="line-height:60px;display:inline-block" v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="维权原因"
        >
        <template slot-scope="scope">
             <span style="line-height:60px;display:inline-block" v-if="scope.row.protectionReason">{{{1:'不想要了',2:'卖家缺货',3:'拍错了订单信息错误',4:'其他'}[scope.row.protectionReason]}}</span>
             <span style="line-height:60px;display:inline-block" v-else>-</span>
        </template>
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
   filters:{
      //时间戳过滤
       time:function(value) {
        let date = new Date(value)
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
        let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
        let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + '' : date.getMinutes()
        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return Y + M + D + h + m
      }
    },
  methods: {
    handleSizeChange(val){
      this.pageSize = val;
      this.$emit('getRightsProtection',1,val)    
    },
    handleCurrentChange(val){
      this.$emit('getRightsProtection',val,this.pageSize)
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
