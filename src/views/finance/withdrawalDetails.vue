<!--提现明细-->
<template>
  <div>
    <div class="top_part head-wrapper">
      <a href="javascript:;"  class="withdraw" @click="_routeTo('withdrawSet')">提现规则设置</a>
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item>
          <el-select v-model="ruleForm.searchType" placeholder="提现编号" style="width:134px;padding-right:4px;">
            <el-option
              v-for="item in presentations"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.searchValue" placeholder="请输入" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item label="申请时间">
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
         <el-form-item>
          <el-select v-model="ruleForm.userType" style="width:135px;padding-right:4px;">
            <el-option
              v-for="item in userTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.userValue" placeholder="请输入" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(1)" v-permission="['财务', '提现明细', '默认页面', '查询']">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part bor-radius" v-calcMinHeight="293">
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
        :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
        :default-sort = "{prop: 'applyTime', order: 'descending'}"
        @sort-change="changeSort"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        >
        <el-table-column
        type="selection"
        width="34">
        </el-table-column>
        <el-table-column
          prop="cashoutSn"
          label="提现编号"
          align="left"
          fixed="left" class-name="table-padding"
          width="220px">
        </el-table-column>
         <el-table-column
          prop="nickName"
          align="center"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          prop="memberSn"
          align="center"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="amount"
          align="right"
          label="提现金额（元）"
          width="120px">
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="状态">
          <template slot-scope="scope">
            {{statusToLabel(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="tradeDetailSn"
          align="center"
          width="190"
          label="交易流水号">
        </el-table-column>
        <el-table-column
          prop="applyTime"
          label="申请时间"
          align="center"
          width="160px"
          sortable = "custom">
        </el-table-column>
        <el-table-column
        label="操作"
        fixed="right" 
        class-name="table-padding" :width="operationColumnW">
          <template slot-scope="scope">
            <div class="table-operate">
              <span 
                @click="handleClick(scope.row)"  
                v-permission="['财务', '提现明细', '默认页面', '查看']"
                class="fsize table-btn"
              >查看</span> 
                <span
                  v-if="scope.row.status == 0"
                  @click="examine(scope.row)" 
                  v-permission="['财务', '提现明细', '默认页面', '审核']"
                  class="fsize table-btn"
                >
                  审核
                </span>
              <!-- <span v-else class="placeholders"></span> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="checkAudit table-select" v-if="dataList.length != 0" style="margin: 20px 0 0 20px;">
        <el-checkbox :indeterminate="isIndeterminate" class="selectAll" @change="selectAll" v-model="selectStatus">全选</el-checkbox>
        <el-button  class="border-button" @click="batchCheck" v-permission="['财务', '提现明细', '默认页面', '批量审核']">批量审核</el-button>
      </div>
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
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" @handleSubmit="handleSubmit" v-if="currentDialog"></component>
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
          value:'nickName',
          label:'用户昵称'
        },
        {
          value:'memberSn',
          label:'用户ID'
        },
      ],
      ruleForm:{
        searchType:'cashoutSn',
        searchValue:'',
        timeValue:'',
        status:-1,
        userType:'nickName',
        userValue:'',
        memberSn:'',
        nickName:'',
        startIndex:1,
        pageSize:10,
        sort:'desc'
      },
      dataList:[ ],
      selectStatus:false,
      total:0,
      currentDialog:"",
      dialogVisible: false,
      currentData:{},
      multipleSelection:[],
      loading:true,
      operationColumnW: 72 //操作列宽度
    }
  },
  props: {
    background: {
      type: Boolean,
      default: true
    },
  },
  watch: {
    'dataList': {
        handler(newVal, oldVal) { //计算操作栏宽度
            this.$nextTick(() => {
                this.operationColumnW = this.utils.getOperationColumnW();
            })
        },
        deep: true
    }
  },
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
        nickName:'',
        tradeDetailSn:'',
        cashoutSn:'',
        applyTimeStart:'',
        applyTimeEnd:'',
        status:'',
        startIndex:'',
        pageSize:'',
        sort:'desc'
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

    fetch(num){
      this.ruleForm.startIndex = num || this.ruleForm.startIndex
      let query = this.init();
      this._apis.finance.getListWd(query).then((response)=>{
        this.dataList = response.list
        this.total = response.total || 0
        this.loading = false
      }).catch((error)=>{
        console.error(error);
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
        searchType:'cashoutSn',
        searchValue:'',
        timeValue:'',
        status:-1,
        userType:'nickName',
        userValue:'',
        memberSn:'',
        nickName:'',
        sort:'desc'
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
    //申请时间排序
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
        this.isIndeterminate = false; 
      }else{
        this.selectStatus = false;
        if(val.length !=0){
					this.isIndeterminate = true;
				}else{
					this.isIndeterminate = false;
				}
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
  border-radius: 4px;
  padding: 20px;
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

.c_line{
  margin: 0 5px;
  color: #DADAE3;
}

.placeholders{
  width: 45px;
  display: inline-block;
}

/deep/.el-table .descending .sort-caret.descending{
  border-top-color:#44434B;
}
/deep/.el-table .ascending .sort-caret.ascending{
  border-bottom-color:#44434B;
}
/deep/ .el-table-column--selection .cell {
    padding-left: 20px;
    padding-right: 10px;
}

.fsize{
  font-size: 14px;
}
  
</style>
