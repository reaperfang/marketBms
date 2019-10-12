<!--物流查询-->
<template>
  <div>
    <div class="top_part">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline" label-width="70px">
        <el-form-item>
          <el-select v-model="ruleForm.searchType" placeholder="订单编号" style="width:124px;">
            <el-option
              v-for="item in fsTerms"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="ruleForm.searchValue" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <el-form-item label="查询时间" style="margin-left:25px;">
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
        <el-form-item label="快递公司">
          <el-input v-model="ruleForm.expressCompany" placeholder="请输入" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit" v-permission="['财务', '物流对账', '物流查询', '搜索']">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="yellow_btn" icon="el-icon-share"  @click='exportToExcel()' v-permission="['财务', '物流对账', '物流查询', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <el-table
      v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        :default-sort = "{prop: 'createTime', order: 'descending'}"
        >
        <el-table-column
          prop="expressSn"
          label="快递单号">
        </el-table-column>
        <el-table-column
          prop="expressCompany"
          label="快递公司">
        </el-table-column>
        <el-table-column
          prop="relationSn"
          label="关联单据编号"
          :render-header="renderRelationSn">
        </el-table-column>
        <el-table-column
          prop="createUserName"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="查询时间"
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
  name: 'logisticsInquiry',
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
        searchType:'relationSn',
        timeValue:'',
        expressCompany:'',
      },
      dataList:[ ],
      total:0,
      loading:true
    }
  },
  watch: { },
  computed:{
    fsTerms(){
      return financeCons.fsTerms;
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
        queryType:1,
        relationSn:'',
        expressSn:'',
        expressCompany:'',
        businessType:'',
        startTime:'',
        endTime:'',
        startIndex:this.ruleForm.startIndex,
        pageSize:this.ruleForm.pageSize
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
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.startTime = utils.formatDate(timeValue[0], "yyyy-MM-dd hh:mm:ss")
        query.endTime = utils.formatDate(timeValue[1], "yyyy-MM-dd hh:mm:ss")
      }
      return query;
    },

    fetch(){
      let query = this.init();
      this._apis.finance.getListFs(query).then((response)=>{
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
        searchType:'relationSn',
        timeValue:'',
        expressCompany:'',
      }
    },
    //导出
    exportToExcel() {
      let query = this.init();
      this._apis.finance.exportFs(query).then((response)=>{
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
