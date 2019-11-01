/* 商品交易热销Top5列表 */
<template>
  <div>
    <el-table
      :data="hotData"
      style="width: 100%"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      >
      <el-table-column
        prop="productName"
        label="商品名称">
        <template slot-scope="scope">
          <div  style="height:60px; display:flex">
            <img :src="scope.row.mainImage" alt="" style="width:60px;height:60px;display:inline-block;object-fit:fill;" />
             <span style="line-height:60px;display:inline-block">{{scope.row.productName}}</span>
            </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="uv"
        label="访问人数">
      </el-table-column>
      <el-table-column
        prop="pays"
        label="支付人数">
      </el-table-column>
      <el-table-column
        prop="rateUvPays"
        label="访问支付转化率"
      >
      <template slot-scope="scope">
        {{scope.row.rateUvPays == 0 ? 0 : (scope.row.rateUvPays*100).toFixed(2)}}%
      </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
export default {
  name: "ct1Table",
  extends: TableBase,
  props:{
    hotData:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      dataList:[
        {
            choose: true,
            importTime:"",
            channel:"",
            importNum:"",
            successNum:"",
            failNum:"",
            buyTime:"",
            operator:""
        },
      ],
    };
  },
  created() {

  },
  methods: {
    
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
