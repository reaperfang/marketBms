<!--提现明细-->
<template>
  <div>
    <div class="top_part">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item>
          <el-select v-model="ruleForm.searchType" placeholder="提现编号" style="width:124px;">
            <el-option
              v-for="item in presentations"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="ruleForm.searchValue" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <el-form-item label="申请时间" style="margin-left:25px;">
          <el-date-picker
            v-model="ruleForm.timeValue"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00', '08:00:00']"
            :picker-options="pickerNowDateBefore">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="ruleForm.status" style="width:210px;">
            <el-option
              v-for="item in presentationStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户ID">
          <el-input v-model="ruleForm.memberSn" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit" v-permission="['财务', '提现明细', '默认页面', '搜索']">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <span>
         <el-button type="primary" @click="_routeTo('withdrawSet')">提现规则设置</el-button>
          <el-button type="primary" @click="batchCheck" v-permission="['财务', '提现明细', '默认页面', '批量审核']">批量审核</el-button>
          <el-button icon="document" @click='exportToExcel()' v-permission="['财务', '提现明细', '默认页面', '导出']">导出</el-button>
        </span>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        :default-sort = "{prop: 'applyTime', order: 'descending'}"
        @selection-change="handleSelectionChange"
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
          prop="memberSn"
          label="客户ID">
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
import TableBase from "@/components/TableBase"
import financeCons from '@/system/constant/finance'
import withdrawDialog from './dialogs/withdrawDialog'//批量审核
import auditSuccessDialog from './dialogs/auditSuccessDialog'//审核成功提示
import warnDialog from './dialogs/warnDialog'//批量审核选择数据提示
import waitAuditDialog from './dialogs/waitAuditDialog'//提现详情 待审核
import auditingDialog from './dialogs/auditingDialog'//审核
import handleAuditDialog from './dialogs/handleAuditDialog'//提现详情  处理中
import failAuditDialog from './dialogs/failAuditDialog'//提现详情  失败
import successAuditDialog from './dialogs/successAuditDialog'//提现详情  成功
export default {
  name: 'revenueSituation',
  extends: TableBase,
  components:{ withdrawDialog, auditSuccessDialog, warnDialog, waitAuditDialog, auditingDialog, handleAuditDialog, failAuditDialog, successAuditDialog },
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
        timeValue:'',
        status:-1,
        memberSn:''
      },
      dataList:[ ],
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
      }
      query.status = this.ruleForm.status == -1 ? null : this.ruleForm.status
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.applyTimeStart = utils.formatDate(timeValue[0], "yyyy-MM-dd hh:mm:ss")
        query.applyTimeEnd = utils.formatDate(timeValue[1], "yyyy-MM-dd hh:mm:ss")
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
        searchType:'tradeDetailSn',
        searchValue:'',
        timeValue:'',
        status:-1,
        memberSn:''
      }
    },
    //导出
    exportToExcel() {
      if(this.total >= 1000 ){
        this.currentData.text = "导出数据量过大，建议分时间段导出。";
        this.dialogVisible = true
        this.currentDialog = auditingDialog
      }else{
        let query = this.init();
        this._apis.finance.exportWd(query).then((response)=>{
          window.location.href = response
        }).catch((error)=>{
          this.$notify.error({
            title: '错误',
            message: error
          });
        })
      }      
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
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
          // this.dialogVisible = false
          // this.otherVisible = true
          this.fetch()
      }).catch((error)=>{
          this.$notify.error({
          title: '错误',
          message: error
          });
      })
    }
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
