<!--提现明细-->
<template>
  <div>
    <div class="top_part head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item>
          <el-select v-model="ruleForm.searchType" placeholder="交易流水号" style="width:124px;padding-right:4px;">
            <el-option
              v-for="item in revenueExpenditureTerms"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.searchValue" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <el-form-item label="分佣金额">
          <el-input-number v-model="ruleForm.amountMin" :precision="2" :step="0.1" :min="0" placeholder="不限" style="width:120px;"></el-input-number>
          -
          <el-input-number v-model="ruleForm.amountMax" :precision="2" :step="0.1" :min="0" placeholder="不限" style="width:120px;"></el-input-number>
        </el-form-item>
        <el-form-item label="交易时间">
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
          <el-select v-model="ruleForm.userType" style="width:124px;padding-right:4px;">
            <el-option
              v-for="item in userTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.userValue" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit" v-permission="['财务', '提现明细', '默认页面', '搜索']">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
         <!-- <el-button type="primary" @click="_routeTo('withdrawSet')">提现规则设置</el-button> -->
          <!-- <el-button type="primary" @click="batchCheck" v-permission="['财务', '提现明细', '默认页面', '批量审核']">批量审核</el-button> -->
          <span>全部 <em>{{total}}</em> 项</span>
          <el-tooltip content="当前最多支持导出1000条数据" placement="top">
            <el-button class="border_btn"   @click='exportToExcel()' v-permission="['财务', '提现明细', '默认页面', '导出']">导出</el-button>
          </el-tooltip>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        :default-sort = "{prop: 'applyTime', order: 'descending'}"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        >
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column
          prop="cashoutSn"
          label="提现编号">
        </el-table-column>
         <el-table-column
          prop="nickName"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          prop="memberSn"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="提现金额（元）">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            {{statusToLabel(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="tradeDetailSn"
          label="交易流水号">
        </el-table-column>
        <el-table-column
          prop="applyTime"
          label="申请时间"
          sortable>
        </el-table-column>
        <el-table-column
        label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small" v-permission="['财务', '提现明细', '默认页面', '查看']">查看</el-button>
            <el-button type="text" size="small" v-if="scope.row.status == 0" @click="examine(scope.row)" v-permission="['财务', '提现明细', '默认页面', '审核']" >审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_styles">
      <div class="checkAudit">
        <el-checkbox class="selectAll" @change="selectAll" v-model="selectStatus">全选</el-checkbox>
        <el-button  class="border-button" @click="batchCheck" v-permission="['财务', '提现明细', '默认页面', '批量审核']">批量审核</el-button>
      </div>
        
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
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" @handleSubmit="handleSubmit"></component>
  </div>
</template>

<script>
import utils from "@/utils";
import financeCons from '@/system/constant/finance'

import TableBase from "@/components/TableBase"
import withdrawDialog from './dialogs/withdrawDialog'//批量审核
import auditSuccessDialog from './dialogs/auditSuccessDialog'//审核成功提示
import warnDialog from './dialogs/warnDialog'//批量审核选择数据提示
import waitAuditDialog from './dialogs/waitAuditDialog'//提现详情 待审核
import auditingDialog from './dialogs/auditingDialog'//审核
import handleAuditDialog from './dialogs/handleAuditDialog'//提现详情  处理中
import failAuditDialog from './dialogs/failAuditDialog'//提现详情  失败
import successAuditDialog from './dialogs/successAuditDialog'//提现详情  成功
import exportTipDialog from '@/components/dialogs/exportTipDialog' //导出提示框 
export default {
  name: 'revenueSituation',
  extends: TableBase,
  components:{ withdrawDialog, auditSuccessDialog, warnDialog, waitAuditDialog, auditingDialog, handleAuditDialog, failAuditDialog, successAuditDialog ,exportTipDialog},
  data() {
    return {
      inline:true,
      userTypes:[
        {
          value:'memberSn',
          label:'用户ID'
        },
        {
          value:'nickName',
          label:'用户昵称'
        },
      ],
      ruleForm:{
        searchType:'tradeDetailSn', //交易流水号
        searchValue:'', 
        amountMin: '', // 分佣金额上限
        amountMax: '', // 分佣金额下限
        timeValue:'', // 交易时间
        status:-1,
        userType:'memberSn',
        userValue:'',
        memberSn:'',
        nickName:''
      },
      dataList:[ ],
      selectStatus:false,
      total:0,
      currentDialog:"",
      dialogVisible: false,
      currentData:{},
      multipleSelection:[],
      loading:true
    }
  },
  watch: { },
  computed:{
    revenueExpenditureTerms(){
      return financeCons.revenueExpenditureTerms;
    },
    presentations(){
      return financeCons.presentations;
    },
    presentationStatus(){
      return financeCons.presentationStatus;
    },
  },
  created() {
    // this.examine(1)
   },
  methods: {
    init(){
      let query = {
        memberSn:'',
        nickName:'',
        tradeDetailSn:'',
        cashoutSn:'',
        applyTimeStart:'',
        applyTimeEnd:'',
        status:'',
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
        if(this.ruleForm.userType == 'memberSn'){
          query.memberSn = this.ruleForm.userValue || ''
          query.nickName = ''
        }else{
          query.nickName = this.ruleForm.userValue || ''
          query.memberSn = ''
        }
      }
      query.status = this.ruleForm.status == -1 ? null : this.ruleForm.status
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.applyTimeStart = timeValue[0]
        query.applyTimeEnd = timeValue[1]
      }
      return query;
    },

    fetch(){
      let query = this.init();
      this._apis.finance.getListWd(query).then((response)=>{
        this.dataList = response.list
        this.total = response.total || 0
        this.loading = false
      }).catch((error)=>{
        this.loading = false
      })
    },
    //搜索
    onSubmit(){
      this.fetch()
    },
    //重置
    resetForm(){
      this.ruleForm = {
        searchType:'cashoutSn',
        searchValue:'',
        timeValue:'',
        status:-1,
        userType:'memberSn',
        userValue:'',
        memberSn:'',
        nickName:'',
      }
      this.fetch()
    },
    //导出
    exportToExcel() {
      let query = this.init();
      if(this.multipleSelection.length > 0){
         let ids = this.multipleSelection.map((item)=> item.id)
         query.ids = ids;
         this._apis.finance.exportWd(query).then((response)=>{
          window.location.href = response
        }).catch((error)=>{
          this.$message.error(error)
        })
      }else if(this.total >1000 && this.multipleSelection.length == 0 ){
        this.dialogVisible = true
        this.currentDialog = exportTipDialog
        this.currentData.query = query
        this.currentData.api = "finance.exportWd"
      }else if(this.multipleSelection.length == 0 && this.total<=1000){
        this._apis.finance.exportWd(query).then((response)=>{
          window.location.href = response
        }).catch((error)=>{
          this.$message.error(error)
        })
      }      
    },
    // 全选
    selectAll(val){
      if(val && this.dataList.length > 0){
        this.dataList.forEach((row)=>{
           this.$refs.multipleTable.toggleRowSelection(row,true);
        })
      }else{
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
      if(val.length !=0 && val.length == this.dataList.length ){
        this.selectStatus = true; 
      }else{
        this.selectStatus = false;
      }
    },
    //批量审核
    batchCheck() {
      let isCheck = true
      let ids = []
      if(this.multipleSelection.length == 0){
        this.currentData.text = "请选择需要审核的数据 !";
        this.dialogVisible = true;
        this.currentDialog = "warnDialog";
      }else{
        this.multipleSelection.map((item)=>{
          item.status!=0 && (isCheck = false)
          ids.push(item.id)
        })
        if(isCheck == true){
          this.currentData = ids
          this.dialogVisible = true
          this.currentDialog = withdrawDialog
        }else{
          this.currentData.text = "选择的数据中包含已经审核过的提现申请，无法批量审核，请重新选择。";
          this.dialogVisible = true;
          this.currentDialog = "warnDialog";          
        }
      }

    },
    statusToLabel(value){
      let status = financeCons.presentationStatus
      let statusLabel = ''
      status.forEach(item =>{
        item.value == value && (statusLabel = item.label)
      })
      return statusLabel;
    },
    //查看
    handleClick(row){
      this.currentData = row
      this.dialogVisible = true
      switch(row.status) {
          case 0:  //待审核
            this.currentDialog = waitAuditDialog
          break;
          case 1:  //处理中
            this.currentDialog = handleAuditDialog
          break;
          case 2: //成功
            this.currentDialog = successAuditDialog
          break;
          case 3: //失败
            this.currentDialog = failAuditDialog
          break;
      }
    },
    //审核
    examine(row){
      this.currentData = row
      this.dialogVisible = true
      this.currentDialog = auditingDialog
    },
    handleSubmit(datas){
      this._apis.finance.examineWd(datas).then((response)=>{
          this.fetch()
           this.dialogVisible = true
           this.currentDialog = auditSuccessDialog
      }).catch((error)=>{
          this.$message.error('网络原因,审核失败！')
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-table__header-wrapper  {
    .el-checkbox{
      display:none;
    }
	
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>

.top_part{
  width: 100%;
  background: #fff;
  border-radius: 3px;
  padding: 15px 20px;
  .withdraw{
    text-align: right;
    display: block;
    color:#655EFF;
    font-size:14px;
    margin-bottom:15px;
  }
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
      display: block;
      margin-top:15px;
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
.page_styles{
  // display: flex;
  .checkAudit{
    // margin-right:220px;
    float:left;
    .selectAll{
      margin-left:14px;
      margin-right:8px;
    }
  }
}
  
</style>
