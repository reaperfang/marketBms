<!--客户ID余额-->
<template>
  <div>
    <div class="top_part">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline" label-width="90px">
        <el-form-item label="交易流水号">
          <el-input v-model="ruleForm.tradeDetailSn" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="ruleForm.businessType" style="width:100px;" placeholder="全部">
            <el-option
              v-for="item in transactionTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易时间" style="margin-left:25px;">
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
        <el-form-item>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit" v-permission="['财务', '客户余额', '默认页面', '搜索']">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="yellow_btn" icon="el-icon-share"  @click='exportToExcel()' v-permission="['财务', '客户余额', '默认页面', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <!-- <cbTable style="margin-top:20px"></cbTable> -->
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        :default-sort = "{prop: 'tradeTime', order: 'descending'}"
        >
        <el-table-column
          prop="tradeDetailSn"
          label="交易流水号">
        </el-table-column>
        <el-table-column
          prop="relationSn"
          label="关联单据编号"
          :render-header="renderRelationSn">
        </el-table-column>
        <el-table-column
          prop="memberSn"
          label="客户ID">
        </el-table-column>
        <el-table-column
          prop="businessType"
          label="交易类型">
          <template slot-scope="scope">
            {{transactionTypes[scope.row.businessType].label}}
          </template>
        </el-table-column>
        <el-table-column
          prop="changeAmount"
          label="变动金额（元）">
          <template slot-scope="scope">
            {{scope.row.changeAmount > 0 ? '+'+scope.row.changeAmount : scope.row.changeAmount}}
          </template>
        </el-table-column>
        <el-table-column
          prop="surplusAmount"
          label="剩余金额（元）">
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
import financeCons from '@/system/constant/finance'
export default {
  name: 'customerBalance',
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
        tradeDetailSn:'',
        businessType:-1,
        timeValue:''
      },
      dataList:[ ],
      total:0,
      loading:true
    }
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
    init(){
      let query = {
        tradeDetailSn:this.ruleForm.tradeDetailSn,
        businessType:this.ruleForm.businessType == -1 ? null : this.ruleForm.businessType,
        startTime:'',
        endTime:'',
        startIndex:this.ruleForm.startIndex,
        pageSize:this.ruleForm.pageSize
      }
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.startTime = utils.formatDate(timeValue[0], "yyyy-MM-dd hh:mm:ss")
        query.endTime = utils.formatDate(timeValue[1], "yyyy-MM-dd hh:mm:ss")
      }
      return query;
    },

    fetch(){
      let query = this.init();
      this._apis.finance.getListCb(query).then((response)=>{
        this.dataList = response.list
        this.total = response.total || 0
        this.loading = false
      }).catch((error)=>{
        this.loading = false
      })
    },

    onSubmit(){
      this.fetch()
    },
    //重置
    resetForm(){
      this.ruleForm = {
        tradeDetailSn:'',
        businessType:'',
        timeValue:''
      }
      this.fetch()
    },
    //导出
    exportToExcel() {
       let query = this.init();
      this._apis.finance.exportCb(query).then((response)=>{
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
