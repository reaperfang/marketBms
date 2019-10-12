/* 物流查询列表 */
<template>
  <div>
    <div class="top_part">
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
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '00:00:00']"
            :picker-options="pickerNowDateBefore">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit" v-permission="['财务', '短信成本', '默认页面', '搜索']">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
        <span>全部 <em>{{total*1}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="yellow_btn" icon="el-icon-share"  @click='exportToExcel()'  v-permission="['财务', '短信成本', '默认页面', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <el-table
      v-loading="loading"
      :data="dataList"
      style="width: 100%; margin-top:20px;"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
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

<script type='es6'>
import utils from "@/utils";
import TableBase from "@/components/TableBase";
import financeCons from '@/system/constant/finance'
export default {
  name: "reTable",
  extends: TableBase,
  data() {
    return {
      pickerNowDateBefore: {
        disabledDate: (time) => {
          return time.getTime() > new Date();
        }
      },
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
      loading:true
    };
  },
  watch: {
    timeValue(){
      if(this.timeValue.length != 0){
        this.ruleForm.startTime = utils.formatDate(this.timeValue[0], "yyyy-MM-dd hh:mm:ss")
        this.ruleForm.endTime = utils.formatDate(this.timeValue[1], "yyyy-MM-dd hh:mm:ss")
      }
    }
  },
  created() { },
  methods: {
    fetch(){
      this._apis.finance.smsPagelist(this.ruleForm).then((response)=>{
        this.dataList = response.list
        this.total = response.total || 0
        this.loading = false
      }).catch((error)=>{
        this.loading = false
      })
    },
    onSubmit(){
      this.fetch();
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
      this._apis.finance.smsExport(query).then((response)=>{
        window.location.href = response.url
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
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
      em{
        font-style: normal;
        color: #000;
      }
    }
  }
}
</style>

