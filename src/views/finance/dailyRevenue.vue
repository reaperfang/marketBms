<!--每日营收-->
<template>
  <div>
    <div class="top_part">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item label="日期" style="margin-bottom:0px;">
          <el-date-picker
            v-model="ruleForm.timeValue"
            type="daterange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '00:00:00']"
            :picker-options="pickerNowDateBefore">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit" v-permission="['财务', '每日营收', '默认页面', '搜索']">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="yellow_btn" icon="el-icon-share"  @click='exportToExcel()' v-permission="['财务', '每日营收', '默认页面', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        :default-sort = "{prop: 'accountDate', order: 'descending'}"
        >
        <el-table-column
          prop="accountDate"
          label="日期"
          sortable>
        </el-table-column>
        <el-table-column
          prop="income"
          label="总收入（元）">
          <template slot-scope="scope">
            {{'+' + scope.row.income}}
          </template>
        </el-table-column>
        <el-table-column
          prop="expend"
          label="总支出（元）">
          <template slot-scope="scope">
            {{'-' + scope.row.expend}}
          </template>
        </el-table-column>
        <el-table-column
          prop="realIncome"
          label="实际收入（元）">
        </el-table-column>
      </el-table>
      <div class="page_styles">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(ruleForm.startIndex) || 1"
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
import TableBase from "@/components/TableBase";
export default {
  name: 'dailyRevenue',
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
        timeValue:''
      },
      dataList:[ ],
      total:0,
      loading:true
    }
  },
  watch: { },
  created() { },
  methods: {
    init(){
      let query = {
        accountDateStart:'',
        accountDateEnd:'',
        startIndex:this.ruleForm.startIndex,
        pageSize:this.ruleForm.pageSize
      }
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.accountDateStart = utils.formatDate(timeValue[0], "yyyy-MM-dd hh:mm:ss")
        query.accountDateEnd = utils.formatDate(timeValue[1], "yyyy-MM-dd hh:mm:ss")
      }
      return query;
    },

    fetch(){
      let query = this.init();
      this._apis.finance.getListDr(query).then((response)=>{
        this.dataList = []
        response.list.map(item =>{
          item.accountDate = item.accountDate.substring(0,item.accountDate.length-8)
          this.dataList.push(item)
        })
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
        timeValue:''
      }
      this.fetch()
    },

    //导出
    exportToExcel() {
      let query = this.init();
      this._apis.finance.exportDr(query).then((response)=>{
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
