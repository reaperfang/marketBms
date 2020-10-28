<!--三方配送-->
<template>
  <div>
    <div class="top_part head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item label="订单编号">
          <el-input v-model="ruleForm.orderCode" placeholder="请输入" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item label="配送公司">
          <el-input v-model="ruleForm.deliveryCompany" placeholder="请输入" style="width:210px;"></el-input>
        </el-form-item>
         <el-form-item label="发货时间">
          <el-date-picker
            v-model="ruleForm.timeValue"
            type="datetimerange"
            align="right"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="utils.globalTimePickerOption.call(this)">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(1)" v-permission="['财务', '物流对账', '三方配送', '查询']">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part bor-radius" v-calcMinHeight="301">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="border_btn"  @click='exportToExcel()' v-permission="['财务', '物流对账', '三方配送', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
        :default-sort = "{prop: 'sendTime', order: 'descending'}"
        @sort-change="changeSort"
        >
        <el-table-column
          prop="orderCode"
          label="订单编号"
          fixed="left" class-name="table-padding"
          width="200px">
        </el-table-column>
        <el-table-column
          prop="deliveryCompany"
          label="配送公司"
          align="center">
          <template slot-scope="scope">
            {{scope.row.deliveryCompany}}
          </template>  
        </el-table-column>
        <el-table-column
          prop="deliveryMoney"
          label="费用"
          width="150px"
          align="right">
        </el-table-column>
        <el-table-column
          prop="operator"
          label="操作人"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sendTime"
          label="发货时间"
          sortable = "custom"
          align="center"
          class-name="table-padding"
          width="190px"
          fixed="right">
        </el-table-column>
      </el-table>
      <div class="page_styles">
        <el-pagination
          v-if="dataList.length != 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(ruleForm.startIndex) || 1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="ruleForm.pageSize*1"
          layout="prev, pager, next, sizes"
          :total="total*1"
          :background="true">
        </el-pagination>
      </div>
    </div>
	  <exportTipDialog :data="currentData" :dialogVisible.sync="dialogVisible"></exportTipDialog>
  </div>
</template>

<script>
import utils from "@/utils";
import TableBase from "@/components/TableBase";
import exportTipDialog from '@/components/dialogs/exportTipDialog'
export default {
  name: 'logisticsInquiry',
  extends: TableBase,
  components:{ exportTipDialog },
  data() {
    return {
      inline:true,
      ruleForm:{
        orderCode:'',//订单号
        deliveryCompany:'',//配送公司
        deliveryMoney:'',//配送费
        operator:'',//操作人
        timeValue:'',//发货时间
        startIndex:1,
        pageSize:10,
        sort:'desc'
      },
      dataList:[ ],
      total:0,
      loading:true,
      currentData:{},
      dialogVisible:false
    }
  },
  props: {
    background: {
      type: Boolean,
      default: true
    },
  },
  watch: { },
  computed:{ },
  created() { },
  methods: {
    init(){
      let query = {
        orderCode:'',//订单号
        deliveryCompany:'',//配送公司
        deliveryMoney:'',//配送费
        operator:'',//操作人
        startCreateTime:'',//发货开始日期
        endCreateTime:'',//发货结束日期
        startIndex:this.ruleForm.startIndex,
        pageSize:this.ruleForm.pageSize,
        sort:'desc'
      }
      for(let key  in query){
        for(let item in this.ruleForm){
          if(item == key){
            query[key] = this.ruleForm[item]
          }
        }
      }
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.startCreateTime = timeValue[0]
        query.endCreateTime = timeValue[1]
      }
      return query;
    },

    fetch(num){
      this.ruleForm.startIndex = num || this.ruleForm.startIndex
      let query = this.init();
      this._apis.finance.getListTd(query).then((response)=>{
        this.dataList = response.list
        this.total = response.total || 0
        this.loading = false
      }).catch((error)=>{
        this.loading = false
      })
    },

    //搜索
    onSubmit(num){
      this.fetch(num)
    },
    //重置
    resetForm(){
      this.ruleForm = {
        orderCode:'',//订单号
        deliveryCompany:'',//配送公司
        deliveryMoney:'',//配送费
        operator:'',//操作人
        timeValue:'',//发货时间
        startIndex:1,
        pageSize:10,
        sort:'desc'
      },
      this.fetch()
    },
    //导出
    exportToExcel() {
      let query = this.init();
      if(this.total >1000){
         this.dialogVisible = true;
         this.currentData.query = this.init()
         this.currentData.api = "finance.exportTd"
      }else{
        this._apis.finance.exportTd(query).then((response)=>{
        window.location.href = response
      }).catch((error)=>{
         this.$message.error(error);
      })
      }
    },
    //操作时间排序
     changeSort(val){
      if(val && val.order == 'ascending') {
        this.ruleForm.sort = 'asc'
      }else if(val && val.order == 'descending'){
        this.ruleForm.sort = 'desc'
      }else{
        return 
      }
      this.fetch()
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.top_part{
  width: 100%;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
}
.under_part{
  width: 100%;
  background: #fff;
  margin-top: 20px;
  padding: 20px;
  .total{
    display: flex;
    justify-content: space-between;
    span{
      font-size: 16px;
      color: #B6B5C8;
      display:block;
      // margin-top:15px;
      em{
        font-style: normal;
        color: #000;
      }
    }
  }
}
.table{
  width: 100%; 
  margin-top:20px;
}
/deep/.el-table .descending .sort-caret.descending{
  border-top-color:#44434B;
}
/deep/.el-table .ascending .sort-caret.ascending{
  border-bottom-color:#44434B;
}
</style>
