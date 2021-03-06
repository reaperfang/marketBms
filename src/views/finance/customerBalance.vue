<!--客户ID余额-->
<template>
  <div>
    <div class="top_part head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item label="交易流水号">
          <el-input v-model="ruleForm.tradeDetailSn" placeholder="请输入" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="ruleForm.businessType" placeholder="全部">
            <el-option
              v-for="item in transactionTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易时间">
          <el-date-picker
            v-model="ruleForm.timeValue"
            type="datetimerange"
            align="right"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="utils.globalTimePickerOption.call(this)">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(1)" v-permission="['财务', '用户余额', '默认页面', '查询']">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part bor-radius" v-calcMinHeight="211">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="border_btn"  @click='exportToExcel()' v-permission="['财务', '用户余额', '默认页面', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <!-- <cbTable style="margin-top:20px"></cbTable> -->
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
        :default-sort = "{prop: 'tradeTime', order: 'descending'}"
        @sort-change="changeSort"
        >
        <el-table-column
          prop="tradeDetailSn"
          label="交易流水号"
          fixed="left" class-name="table-padding"
          width="210px">
        </el-table-column>
        <el-table-column
          prop="relationSn"
          label="关联单据编号"
          align="center"
          :render-header="renderRelationSn"
          width="230px">
        </el-table-column>
        <el-table-column
          prop="memberSn"
          label="用户ID"
          align="center"
          width="120px">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="用户昵称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="businessType"
          label="交易类型"
          align="center">
          <template slot-scope="scope">
            {{transactionTypes[scope.row.businessType].label}}
          </template>
        </el-table-column>
        <el-table-column
          prop="changeAmount"
          label="变动金额（元）"
          align="right"
          width="140px">
          <template slot-scope="scope">
            {{scope.row.changeAmount > 0 ? '+'+scope.row.changeAmount : scope.row.changeAmount}}
          </template>
        </el-table-column>
        <el-table-column
          prop="surplusAmount"
          label="剩余金额（元）"
          align="right"
          width="140px">
        </el-table-column>
        <el-table-column
          prop="tradeTime"
          label="交易时间"
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
      <exportTipDialog :data = currentData :dialogVisible.sync="dialogVisible" ></exportTipDialog>
    </div>
  </div>
</template>

<script>
import utils from "@/utils";
import TableBase from "@/components/TableBase";
import financeCons from '@/system/constant/finance'
import exportTipDialog from '@/components/dialogs/exportTipDialog'
export default {
  name: 'customerBalance',
  extends: TableBase,
  components:{
    exportTipDialog
  },
  data() {
    return {
      inline:true,
      ruleForm:{
        tradeDetailSn:'',
        businessType:-1,
        timeValue:'',
        startIndex:1,
        pageSize:10,
        sort:'desc'
      },
      dataList:[ ],
      total:0,
      loading:true,
      dialogVisible:false,
      currentData:{}
    }
  },
  props: {
    background: {
      type: Boolean,
      default: true
    },
  },
  watch: { },
  computed:{
    transactionTypes(){
      return financeCons.transactionTypes;
    },
  },
  created() { },
  methods: {
    renderRelationSn(){
      return(
        <p>
          <span style="font-weight:bold;vertical-align:middle;">关联单据编号</span>
          <el-popover
            placement="top-start"
            title=""
            width="160"
            trigger="hover"
            content="订单编号、售后单编号、提现编号">
            <i slot="reference" class="el-icon-warning-outline" style="vertical-align:middle;"></i>
          </el-popover>
        </p>
      )
    },
    init(){
      let query = {
        tradeDetailSn:this.ruleForm.tradeDetailSn,
        businessType:this.ruleForm.businessType == -1 ? null : this.ruleForm.businessType,
        startTime:'',
        endTime:'',
        startIndex:this.ruleForm.startIndex,
        pageSize:this.ruleForm.pageSize,
        sort:this.ruleForm.sort
      }
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.startTime = timeValue[0]
        query.endTime = timeValue[1]
      }
      return query;
    },

    fetch(num){
      this.ruleForm.startIndex = num || this.ruleForm.startIndex
      let query = this.init();
      this._apis.finance.getListCb(query).then((response)=>{
        this.dataList = response.list
        this.total = response.total || 0
        this.loading = false
      }).catch((error)=>{
        console.error(error);
        this.loading = false
      })
    },

    onSubmit(num){
      this.fetch(num)
    },
    //重置
    resetForm(){
      this.ruleForm = {
        tradeDetailSn:'',
        businessType:'',
        timeValue:'',
        sort:'desc'
      }
      this.fetch()
    },
    //导出
    exportToExcel() {
       let query = this.init();
       if(this.total >1000 ){
         this.dialogVisible = true;
         this.currentData.query = this.init()
         this.currentData.api = "finance.exportCb"
       }else{
         this._apis.finance.exportCb(query).then((response)=>{
         window.location.href = response
      }).catch((error)=>{
        this.$message.error(error)
      })
       }
    },
     //交易时间排序
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
      display: block;
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
