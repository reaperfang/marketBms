
<!--收支明细-->
<template>
  <div>
    <div class="top_part head-wrapper">
      <el-form :model="ruleForm" ref="ruleForm" :inline="inline">
        <el-form-item>
          <el-select v-model="ruleForm.searchType" placeholder="交易流水号" style="width:135px;padding-right:4px;">
            <el-option
              v-for="item in revenueExpenditureTerms"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.searchValue" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="ruleForm.businessType" placeholder="全部">
            <el-option
              v-for="item in rebusinessTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="ruleForm.payWay" placeholder="全部">
            <el-option
              v-for="item in payTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收支类型">
          <el-select v-model="ruleForm.tradeType"  placeholder="全部">
            <el-option
              v-for="item in tradeTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易金额">
          <el-input-number v-model="ruleForm.amountMin" :precision="2" :step="0.1" :min="0" placeholder="请输入" style="width:120px;"></el-input-number>
          -
          <el-input-number v-model="ruleForm.amountMax" :precision="2" :step="0.1" :min="0" placeholder="请输入" style="width:120px;"></el-input-number>
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
          <el-button type="primary" @click="onSubmit(1)" v-permission="['财务', '收支明细', '默认页面', '查询']">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part bor-radius" v-calcMinHeight="262">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="border_btn"   @click='exportToExcel()' v-permission="['财务', '收支明细', '默认页面', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <!-- background:'#D0D6E4', -->
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
        :default-sort = "{prop: 'tradeTime', order: 'descending'}"
        @sort-change="sortTable"
        >
        <el-table-column
          prop="tradeDetailSn"
          label="交易流水号"
          :render-header="renderTradeDetailSn"
          align="left"
          width="220px"
          class-name="table-padding"
          fixed="left"
          >
        </el-table-column>
        <el-table-column
          prop="tradeType"
          label="收支类型"
          :render-header="renderTradeTypen"
          align="center"
          width="90px">
          <template slot-scope="scope">
            {{scope.row.tradeType ? '支出' : '收入' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="businessType"
          label="业务类型"
          :render-header="renderBusinessType"
          align="center"
          width="150px">
          <template slot-scope="scope">
            {{rebusinessTypes[scope.row.businessType] ? rebusinessTypes[scope.row.businessType].label : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="relationSn"
          label="关联单据编号"
          :render-header="renderRelationSn"
          align="center"
          width="230px">
        </el-table-column>
        <el-table-column
          prop="payWay"
          label="支付方式"
          align="center"
          width="100px">
          <template slot-scope="scope">
            {{payTypes[scope.row.payWay+1].label}}
          </template>
        </el-table-column>
        <el-table-column
          prop="wechatTradeSn"
          label="第三方流水号"
          align="center"
          width="280px;">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="交易金额（元）"
          align="right"
          width="140px;">
          <template slot-scope="scope">
            <span style="padding-right:10px;">{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="isInvoice"
          label="开票"
          align="center">
          <template slot-scope="scope">
            {{scope.row.isInvoice ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="tradeTime"
          label="交易时间"
          sortable="custom"
          align="center"
          width="180px"
          class-name="table-padding"
          fixed="right"
          >
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
      <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData"></component> 
    </div>
  </div>
</template>

<script>
import utils from "@/utils";
import financeCons from '@/system/constant/finance'
import TableBase from "@/components/TableBase";
import exportTipDialog from './dialogs/exportTipDialog' //导出提示框 
import exportTipDialogVue from '@/components/dialogs/exportTipDialog';
export default {
  name: 'revenueExpenditureDetails',
  extends: TableBase,
  components:{exportTipDialog},
  data() {
    return {
      currentData:{},
      dialogVisible: false,
      currentDialog:"",
      inline:true,
      ruleForm:{
        searchType:'tradeDetailSn',
        searchValue:'',
        businessType:0,
        payWay:-1,
        tradeType:-1,
        amountMin:'',
        amountMax:'',
        timeValue:'',
        startIndex:'1',
        pageSize:'10',
        sort:'desc'
      },
      dataList:[ ],
      total:0,
      loading:true,
      types:[],
    }
  },
  props: {
    background: {
      type: Boolean,
      default: true
    },
  },
  watch: {

  },
  computed:{
    revenueExpenditureTerms(){
      return financeCons.revenueExpenditureTerms;
    },
    rebusinessTypes(){
      return this.types;
    },
    payTypes(){
      return financeCons.payTypes;
    },
    payTypeList(){
      let arr = []
      financeCons.payTypes.map(item =>{
        item.value !== 3 && arr.push(item)
      })
      return arr
    },
    tradeTypes(){
      return financeCons.tradeTypes;
    }
  },
  created() { 
    this.getRebusinessTypes()
  },
  methods: {
    renderTradeDetailSn(){
      return(
        <p>
          <span style="font-weight:bold;vertical-align:middle;">交易流水号</span>
          <el-popover
            placement="top-start"
            title=""
            width="160"
            trigger="hover"
            content="本系统所有收入和支出相应的交易流水号">
            <i slot="reference" class="el-icon-warning-outline" style="vertical-align:middle;"></i>
          </el-popover>
        </p>
      )
    },
    renderBusinessType(){
      return(
        <p>
          <span style="font-weight:bold;vertical-align:middle;">业务类型</span>
          <el-popover
            placement="top-start"
            title=""
            width="160"
            trigger="hover"
            content="本系统所有产生收入和支出相应的操作">
            <i slot="reference" class="el-icon-warning-outline" style="vertical-align:middle;"></i>
          </el-popover>
        </p>
      )
    },
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
    renderTradeTypen(){
       return(
        <p>
          <span style="font-weight:bold;vertical-align:middle;">收支类型</span>
        </p>
      )
    },

    getRebusinessTypes(){
       this.$store.dispatch('getShopInfo').then( data => {
          if(data.isOpenResell == 1){
            this.types = financeCons.rebusinessTypes
          }else{
            financeCons.rebusinessTypes.map(item =>{
              item.value !== 6 && this.types.push(item) 
            })
          }
      }).catch((error) => {
          console.error(error);
      });
    },

    init(){
      let query = {
        tradeDetailSn:'',
        relationSn:'',
        wechatTradeSn:'',
        businessType:'',
        tradeType:'',
        payWay:'',
        amountMin:'0.00',
        amountMax:'0.00',
        tradeTimeStart:'',
        tradeTimeEnd:'',
        sort:this.ruleForm.sort,
        startIndex:'1',
        pageSize:'10'
      }
      for(let key  in query){
        if(this.ruleForm.searchType == key){
          query[key] = this.ruleForm.searchValue
        }
        for(let item in this.ruleForm){
          if(item == key){
            query[key] = this.ruleForm[item]
          }
        }
      }
      query.businessType = this.ruleForm.businessType == 0 ? null : this.ruleForm.businessType
      query.tradeType = this.ruleForm.tradeType == -1 ? null : this.ruleForm.tradeType
      query.payWay = this.ruleForm.payWay == -1 ? null : this.ruleForm.payWay
      query.amountMin = this.ruleForm.amountMin == 0 ? '' : this.ruleForm.amountMin
      query.amountMax = this.ruleForm.amountMax == 0 ? '' : this.ruleForm.amountMax
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.tradeTimeStart = timeValue[0]
        query.tradeTimeEnd = timeValue[1]
      }
      return query;
    },  
    fetch(num){
      if(this.ruleForm.amountMin == undefined || this.ruleForm.amountMax == undefined){
        this.$message('分销金额不能为空')
      }else if(this.ruleForm.amountMin > this.ruleForm.amountMax){
        this.$message('交易金额最小值应该小于最大值')
      }else{
        this.ruleForm.startIndex = num || this.ruleForm.startIndex
        let query = this.init();
        this.loading = true
        this._apis.finance.getListRe(query).then((response)=>{
          this.dataList = response.list
          this.total = response.total || 0
          this.loading = false
        }).catch((error)=>{
          console.error(error);
          this.loading = false
        })
      }
    },
    //搜索
    onSubmit(startIndex){
      let num = startIndex || this.ruleForm.startIndex
      this.fetch(num)
    },
    //排序
    sortTable(val){
      if(val && val.order == 'ascending') {
        this.ruleForm.sort = 'asc'
      }else if(val && val.order == 'descending'){
        this.ruleForm.sort = 'desc'
      }else{
        return 
      }
      this.fetch()
    },
    //重置
    resetForm(){
      this.ruleForm = {
        searchType:'tradeDetailSn',
        searchValue:'',
        businessType:'',
        payWay:'',
        tradeType:'',
        amountMin:'0.00',
        amountMax:'0.00',
        timeValue:'',
        sort:'desc'
      }
      this.onSubmit()
    },
   
  //导出
    exportToExcel(){
      if(this.total > 1000){
        this.currentDialog = exportTipDialogVue;
        this.dialogVisible = true;
        this.currentData.api = 'finance.exportRe';
        this.currentData.query = this.init();
      }else{
        let query = this.init();
        this._apis.finance.exportRe(query).then((response)=>{
          window.location.href = response
        }).catch((error)=>{
         this.$message.error(error)
        })
      }
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
