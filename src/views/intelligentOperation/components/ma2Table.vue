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
        width="80"
        fixed="left" class-name="table-padding">
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        label="订单号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="id"
        label="用户ID"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id ? scope.row.id : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户类型"
        align="center">
        <template slot-scope="scope">
            <span  v-if="scope.row.memberType" style="line-height:60px;display:inline-block">{{{0:'非会员',1:'新会员',2:'老会员'}[scope.row.memberType]}}</span>
            <span v-else> - </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="会员昵称"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name ? scope.row.name : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        width="150"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone ? scope.row.phone : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="维权时间"
        width="160"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.tradeTime && Number(scope.row.tradeTime) | time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="protectionGoodsCount"
        label="维权商品数"
        min-width="120"
        align="right">
      </el-table-column>
      <el-table-column
        label="维权类型"
        align="center">
        <template slot-scope="scope">
             <span style="line-height:60px;display:inline-block" v-if="scope.row.protectionType">{{{1:'退款（仅退款不退货）',2:'退款退货',3:'换货'}[scope.row.protectionType]}}</span>
             <span style="line-height:60px;display:inline-block" v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="维权原因"
        fixed="right" class-name="table-padding"
        width="150"
        align="center">
        <template slot-scope="scope">
             <span style="line-height:60px;display:inline-block" v-if="scope.row.protectionReason">{{{5:'不想要了',6:'卖家缺货',7:'发票问题',8:'拍错了/订单信息错误',9:'其他'}[scope.row.protectionReason]}}</span>
             <span style="line-height:60px;display:inline-block" v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_styles" v-show="listObj.totalSize>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(startIndex) || 1"
        :page-sizes="[10, 20, 30, 40]"
        layout="prev, pager, next, sizes"
        :page-size="pageSize*1"
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
      loading1: true,
      startIndex: 1
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
    },
    nowPage: {
      type: Number,
      default: 0
    }
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
      this.startIndex = val;
      this.$emit('getRightsProtection',val,this.pageSize)
    }
  },
  components: {}
};
</script>
