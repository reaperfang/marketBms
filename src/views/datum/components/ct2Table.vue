/* 商品交易热销Top5列表 */
<template>
  <div>
    <el-table
      :data="listObj"
      style="width: 100%"
      :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
      :default-sort = "{prop: 'pv', order: 'descending'}"
      >
      <el-table-column
        prop="productName"
        label="商品名称"
        min-width="260" 
        fixed="left" 
        class-name="table-padding"
        width="200px">        
        <template slot-scope="scope">
          <div  style="height:60px; width:180px; display:flex">
            <img :src="scope.row.mainImage" alt="" style="width:60px;height:60px;margin-right:20px;display:inline-block" />
             <span style="line-height:60px;display:inline-block;width:65px;overflow: hidden; text-overflow:ellipsis; white-space: nowrap;" :title="scope.row.productName">{{scope.row.productName}}</span>
            </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="pv"
        label="浏览量"
        align="right"
       >
      </el-table-column>
      <el-table-column
        prop="uv"
        label="访客量"
        align="right"
        >
      </el-table-column>
      <el-table-column
        prop="shoppingCart"
        label="加购人数"
        align="right"
        >
      </el-table-column>
      <el-table-column
        prop="orders"
        label="下单人数"
        align="right"
        >
      </el-table-column>
      <el-table-column
        prop="pays"
        label="支付人数"
        align="right"
        >
      </el-table-column>
      <el-table-column
        prop="rateOrderPay"
        label="下单支付转化率"
        width="150"
        align="right"
        >
        <template slot-scope="scope">
          {{scope.row.rateOrderPay == 0 ? 0 : (scope.row.rateOrderPay*100).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column
        prop="rateRepurchase"
        label="复购率"
        fixed="right"
        min-width="100"
        class-name="table-padding"
        align="right"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.rateRepurchase">
          {{scope.row.rateRepurchase == 0 ? 0 : (scope.row.rateRepurchase*100).toFixed(2)}}%
          </span>
          <span v-else> 0% </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="page_styles">
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
    </div> -->
  </div>
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
export default {
  name: "ct2Table",
  extends: TableBase,
  props:['listObj'],
  data() {
    return {
      pageSize:10
    };
  },
  created() { },
  watch:{
    listObj(newValue,oldValue){
      return newValue
    }
  },
  methods: {
    handleCurrentChange(val){
      this.$emit('getProductDetails',val,this.pageSize)
    },
    handleSizeChange(val){
      this.pageSize = val
      this.$emit('getProductDetails',1,val)
    }
  },
  components: {}
};
</script>

