/* 短信成本列表 */
<template>
  <div>
    <div class="top_part head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item label="状态">
          <el-select v-model="ruleForm.acceptStatus" style="width:200px;">
            <el-option
              v-for="item in smsStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="发送时间">
          <el-date-picker
            v-model="timeValue"
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
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit(1)" v-permission="['财务', '短信成本', '默认页面', '搜索']">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
        <span>全部 <em>{{total*1}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="border_btn"   @click='exportToExcel()'  v-permission="['财务', '短信成本', '默认页面', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <el-table
      v-loading="loading"
      :data="dataList"
      style="width: 100%; margin-top:20px;"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      @sort-change="changeSort"
      >
        <el-table-column
          prop="content"
          label="消息内容">
        </el-table-column>
        <el-table-column
          prop="smsType"
          label="消息类型">
          <template slot-scope="scope">
            {{scope.row.smsType == 1 ? '营销短信' : '通知短信'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="pageCount"
          label="是否拆分">
          <template slot-scope="scope">
            {{scope.row.pageCount > 1 ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="acceptSmsCountDisplay"
          label="消息数量">
        </el-table-column>
        <el-table-column
          prop="acceptStatus"
          label="状态">
          <template slot-scope="scope">
            {{scope.row.acceptStatus == true ? '成功' : '失败'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="sendTime"
          label="发送时间"
          sortable>
        </el-table-column>
      </el-table>
      <div class="page_styles">
        <el-pagination
          v-if="dataList.length != 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(ruleForm.pageNum) || 1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="ruleForm.pageSize*1"
          layout="sizes, prev, pager, next"
          :total="total*1">
        </el-pagination>
      </div>
    </div>
	  <exportTipDialog :data=currentData  :dialogVisible.sync="dialogVisible"></exportTipDialog>
  </div>
</template>

<script type='es6'>
import utils from "@/utils";
import TableBase from "@/components/TableBase";
import financeCons from '@/system/constant/finance'
import exportTipDialog from '@/components/dialogs/exportTipDialog'
export default {
  name: "reTable",
  extends: TableBase,
  components:{
    exportTipDialog
  },
  data() {
    return {
      dataList:[],
      total:0,
      inline:true,
      ruleForm:{
        acceptStatus:0,
        startTime:'',
        endTime:'',
        pageSize:10,
        pageNum:1,
        orderBy:'send_time desc'
      },
      timeValue:[],
      loading:true,
      currentData:{},
      dialogVisible:false,
    };
  },
  watch: {
    timeValue(){
      if(this.timeValue.length != 0){
        this.ruleForm.startTime = this.timeValue[0]
        this.ruleForm.endTime = this.timeValue[1]
      }
    }
  },
  created() { },
  methods: {
    fetch(num){
      this.ruleForm.pageNum = num || this.ruleForm.pageNum
      this._apis.finance.smsPagelist(this.ruleForm).then((response)=>{
        this.dataList = response.list
        this.total = response.total || 0
        this.loading = false
      }).catch((error)=>{
        this.loading = false
      })
    },
    onSubmit(num){
      this.fetch(num);
    },
    //重置
    resetForm(){
      this.ruleForm = {
        acceptStatus:0,
        startTime:'',
        endTime:'',
        pageSize:10,
        pageNum:1,
        orderBy:'send_time desc'
      }
      this.timeValue = []
      this.fetch()
    },
     //当前页码改变
    handleCurrentChange(pIndex=1) {
      this.loading = true
      this.ruleForm.pageNum = pIndex
      this.fetch()
    },
    //导出
    exportToExcel(){
      let query = {
        filename:'短信成本列表',
        acceptStatus:this.ruleForm.acceptStatus,
        startTime:this.ruleForm.startTime,
        endTime:this.ruleForm.endTime,
        orderBy:'send_time desc'
      }
      if(this.total > 1000){
        this.dialogVisible = true;
        this.currentData.api = 'finance.smsExport';
        this.currentData.query =query;
      }else{
        this._apis.finance.smsExport(query).then((response)=>{
        window.location.href = response.url
      }).catch((error)=>{
        this.$message.error(error);
      })
      }  
    },
    //发送时间排序
     changeSort(val){
      if(val && val.order == 'ascending') {
        this.ruleForm.orderBy = 'send_time asc'
      }else if(val && val.order == 'descending'){
        this.ruleForm.orderBy = 'send_time desc'
      }else{
        return 
      }
      this.fetch()
    }
  },
  computed:{
    surveyStatus(){
      return financeCons.surveyStatus;
    },
    smsStatus(){
      return financeCons.smsStatus;
    }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.top_part{
  width: 100%;
  background: #fff;
  border-radius: 3px;
  margin-top: 20px;
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
      display:block;
      margin-top:15px;
      em{
        font-style: normal;
        color: #000;
      }
    }
  }
}
</style>

