<!--物流查询-->
<template>
  <div>
    <div class="top_part head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item>
          <el-select v-model="ruleForm.searchType" placeholder="订单编号" style="width:124px;paddinig-right:4px;">
            <el-option
              v-for="item in fsTerms"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.searchValue" placeholder="请输入" style="width:230px;"></el-input>
        </el-form-item>
        <el-form-item label="查询时间">
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
        <el-form-item label="快递公司">
          <el-input v-model="ruleForm.expressCompany" placeholder="请输入" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(1)" v-permission="['财务', '物流对账', '物流查询', '查询']">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="color:red;">说明：物流查询已上线，最新物流查询费用详见应用工具中的<a @click="$router.push({path:'/apply',query:{paths:'/application/toolapp/logisticstool',applyId:'2'}})" style="text-decoration: underline;">物流查询</a>。</div>
    </div>
    <div class="under_part bor-radius" v-calcMinHeight="301">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="border_btn"  @click='exportToExcel()' v-permission="['财务', '物流对账', '物流查询', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <el-table
      v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
        :default-sort = "{prop: 'createTime', order: 'descending'}"
        @sort-change="changeSort"
        >
        <el-table-column
          prop="expressSn"
          label="快递单号"
          fixed="left" class-name="table-padding"
          width="200px">
        </el-table-column>
        <el-table-column
          prop="expressCompany"
          align="center"
          label="快递公司">
        </el-table-column>
        <el-table-column
          prop="relationSn"
          label="关联单据编号"
          align="center"
          :render-header="renderRelationSn"
          width="230px">
        </el-table-column>
        <el-table-column
          prop="createUserName"
          label="操作人"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="查询时间"
          align="center"
          class-name="table-padding"
          width="190px"
          fixed="right">
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
    </div>
	  <exportTipDialog :data="currentData" :dialogVisible.sync="dialogVisible"></exportTipDialog>
  </div>
</template>

<script>
import utils from "@/utils";
import TableBase from "@/components/TableBase";
import financeCons from '@/system/constant/finance'
import exportTipDialog from '@/components/dialogs/exportTipDialog'
export default {
  name: 'logisticsInquiry',
  extends: TableBase,
  components:{
    exportTipDialog
  },
  data() {
    return {
      inline:true,
      ruleForm:{
        searchType:'relationSn',
        timeValue:'',
        expressCompany:'',
        startIndex:1,
        pageSize:10,
        sort:'desc'
      },
      dataList:[ ],
      total:0,
      loading:true,
      currentData:{},
      dialogVisible:false
    }
  },
  props: {
    background: {
      type: Boolean,
      default: true
    },
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
    init(){
      let query = {
        version:0,
        queryType:1,
        relationSn:'',
        expressSn:'',
        expressCompany:'',
        businessType:'',
        startTime:'',
        endTime:'',
        startIndex:this.ruleForm.startIndex,
        pageSize:this.ruleForm.pageSize,
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
      }
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.startTime = timeValue[0]
        query.endTime = timeValue[1]
      }
      return query;
    },

    fetch(num){
      this.ruleForm.startIndex = num || this.ruleForm.startIndex
      let query = this.init();
      this._apis.finance.getListFs(query).then((response)=>{
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
        searchType:'relationSn',
        timeValue:'',
        expressCompany:'',
        sort:'desc'
      }
      this.fetch()
    },
    //导出
    exportToExcel() {
      let query = this.init();
      if(this.total >1000){
         this.dialogVisible = true;
         this.currentData.query = this.init()
         this.currentData.api = "finance.exportFs"
      }else{
        this._apis.finance.exportFs(query).then((response)=>{
        window.location.href = response
      }).catch((error)=>{
         this.$message.error(error);
      })
      }
    },
    //操作时间排序
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
      display:block;
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
