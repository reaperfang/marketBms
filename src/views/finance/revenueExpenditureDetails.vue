<!--收支明细-->
<template>
  <div>
    <div class="top_part">
      <el-form :model="ruleForm" ref="ruleForm" :inline="inline" label-width="70px">
        <el-form-item>
          <el-select v-model="ruleForm.searchType" placeholder="交易流水号" style="width:124px;">
            <el-option
              v-for="item in revenueExpenditureTerms"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="ruleForm.searchValue" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="ruleForm.businessType" style="width:210px;" placeholder="全部">
            <el-option
              v-for="item in rebusinessTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="ruleForm.payWay" style="width:210px;" placeholder="全部">
            <el-option
              v-for="item in payTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收支类型">
          <el-select v-model="ruleForm.tradeType" style="width:150px;" placeholder="全部">
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
        </el-form-item>
        <el-form-item>
          <el-input-number v-model="ruleForm.amountMax" :precision="2" :step="0.1" :min="0" placeholder="请输入" style="width:120px;"></el-input-number>
        </el-form-item>
        <el-form-item label="交易时间" style="margin-left:25px;">
          <el-date-picker
            v-model="ruleForm.timeValue"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '00:00:00']"
            :picker-options="pickerNowDateBefore">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit" v-permission="['财务', '收支明细', '默认页面', '搜索']">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-button icon="document" @click='exportToExcel()' v-permission="['财务', '收支明细', '默认页面', '导出']">导出</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        @sort-change="sortTable"
        >
        <!-- :default-sort = "{prop: 'tradeTime', order: 'descending'}" -->
        <el-table-column
          prop="tradeDetailSn"
          label="交易流水号"
          :render-header="renderTradeDetailSn"
          width="130px">
        </el-table-column>
        <el-table-column
          prop="tradeType"
          label="收支类型"
          :render-header="renderTradeTypen">
          <template slot-scope="scope">
            {{scope.row.tradeType ? '支出' : '收入' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="businessType"
          label="业务类型"
          :render-header="renderBusinessType">
          <template slot-scope="scope">
            {{rebusinessTypes[scope.row.businessType-1].label}}
          </template>
        </el-table-column>
        <el-table-column
          prop="relationSn"
          label="关联单据编号"
          :render-header="renderRelationSn">
        </el-table-column>
        <el-table-column
          prop="payWay"
          label="支付方式">
          <template slot-scope="scope">
            {{payTypes[scope.row.payWay].label}}
          </template>
        </el-table-column>
        <el-table-column
          prop="wechatTradeSn"
          label="微信流水号">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="交易金额（元）">
        </el-table-column>
        <el-table-column
          prop="isInvoice"
          label="开票">
          <template slot-scope="scope">
            {{scope.row.isInvoice ? '开票' : '未开票' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="tradeTime"
          label="交易时间"
          sortable>
        </el-table-column>
      </el-table>
      <div class="page_styles">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(ruleForm.pageNum) || 1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize*1"
          layout="sizes, prev, pager, next"
          :total="total*1">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/utils";
import financeCons from '@/system/constant/finance'
import TableBase from "@/components/TableBase";
export default {
  name: 'revenueExpenditureDetails',
  extends: TableBase,
  data() {
    return {
      pickerNowDateBefore: {
        disabledDate: (time) => {
          return time.getTime() > new Date();
        }
      },
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
        pageNum:''
      },
      dataList:[ ],
      total:0,
      loading:true
    }
  },
  watch: {

  },
  computed:{
    revenueExpenditureTerms(){
      return financeCons.revenueExpenditureTerms;
    },
    rebusinessTypes(){
      return financeCons.rebusinessTypes;
    },
    payTypes(){
      return financeCons.payTypes;
    },
    tradeTypes(){
      return financeCons.tradeTypes;
    }
  },
  created() { },
  methods: {
    renderTradeDetailSn(){
      return(
        <div style="height:49px;line-height:49px;">
          <span style="font-weight:bold;vertical-align:middle;">交易流水号</span>
          <el-popover
            placement="top-start"
            title=""
            width="160"
            trigger="hover"
            content="本系统所有收入和支出相应的交易流水号">
            <i slot="reference" class="el-icon-warning-outline" style="vertical-align:middle;"></i>
          </el-popover>
        </div>
      )
    },
    renderBusinessType(){
      return(
        <div style="height:49px;line-height:49px;">
          <span style="font-weight:bold;vertical-align:middle;">业务类型</span>
          <el-popover
            placement="top-start"
            title=""
            width="160"
            trigger="hover"
            content="本系统所有产生收入和支出相应的操作">
            <i slot="reference" class="el-icon-warning-outline" style="vertical-align:middle;"></i>
          </el-popover>
        </div>
      )
    },
    renderRelationSn(){
      return(
        <div style="height:49px;line-height:49px;">
          <span style="font-weight:bold;vertical-align:middle;">关联单据编号</span>
          <el-popover
            placement="top-start"
            title=""
            width="160"
            trigger="hover"
            content="订单编号、售后单编号、提现编号">
            <i slot="reference" class="el-icon-warning-outline" style="vertical-align:middle;"></i>
          </el-popover>
        </div>
      )
    },
    renderTradeTypen(){
       return(
        <div>
          <span style="font-weight:bold;vertical-align:middle;">收支类型</span>
        </div>
      )
    },
    init(orde){
      let query = {
        tradeDetailSn:'',
        relationSn:'',
        wechatTradeSn:'',
        businessType:'',
        tradeType:'',
        payWay:'',
        amountMin:'',
        amountMax:'',
        tradeTimeStart:'',
        tradeTimeEnd:'',
        sort:'',
        startIndex:'',
        pageSize:''
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
      query.sort = orde
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.tradeTimeStart = utils.formatDate(timeValue[0], "yyyy-MM-dd hh:mm:ss")
        query.tradeTimeEnd = utils.formatDate(timeValue[1], "yyyy-MM-dd hh:mm:ss")
      }
      return query;
    },  
    fetch(orde){
      if(this.ruleForm.amountMin > this.ruleForm.amountMax){
        this.$message('交易金额最小值应该小于最大值')
      }else{
        let query = this.init(orde);
        this._apis.finance.getListRe(query).then((response)=>{
          this.dataList = response.list
          this.total = response.total || 0
          this.loading = false
        }).catch((error)=>{
          this.loading = false
        })
      }
    },
    //搜索
    onSubmit(){
      let orde = 'desc'
      this.fetch(orde)
    },
    //排序
    sortTable(column){
      let obj = column
      let orde = obj.order == 'descending' ? 'desc' : 'asc'
      this.fetch(orde)
    },
    //重置
    resetForm(){
      this.ruleForm = {
        searchType:'tradeDetailSn',
        searchValue:'',
        businessType:'',
        payWay:'',
        tradeType:'',
        amountMin:'',
        amountMax:'',
        timeValue:''
      }
    },
   
  //导出
    exportToExcel(){
      let query = this.init();
      this._apis.finance.exportRe(query).then((response)=>{
        window.location.href = response
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
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
  border-radius: 3px;
  padding: 15px 20px;
}
.under_part{
  width: 100%;
  background: #fff;
  margin-top: 20px;
  padding: 15px 20px;
  .total{
    display: flex;
    justify-content: space-between;
    span{
      font-size: 16px;
      color: #B6B5C8;
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
</style>
