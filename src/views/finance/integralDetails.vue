<!--积分明细-->
<template>
  <div>
    <div class="top_part">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item label="客户ID">
          <el-input v-model="ruleForm.memberInfoId" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="ruleForm.businessTypeId" style="width:100px;" placeholder="全部">
            <el-option
              v-for="item in idbusinessTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="获取时间" style="margin-left:25px;">
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
          <el-button type="primary" @click="onSubmit" v-permission="['财务', '积分明细', '默认页面', '搜索']">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="yellow_btn" icon="el-icon-share"  @click='exportToExcel()' v-permission="['财务', '积分明细', '默认页面', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <!-- <idTable style="margin-top:20px"></idTable> -->
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        :default-sort = "{prop: 'changeTime', order: 'descending'}"
        >
        <el-table-column
          prop="scoreDetailSn"
          label="积分流水号">
        </el-table-column>
        <el-table-column
          prop="memberInfoId"
          label="客户ID">
        </el-table-column>
        <el-table-column
          prop="businessTypeId"
          label="业务类型">
          <template slot-scope="scope">
            {{idbusinessTypes[scope.row.businessTypeId] && idbusinessTypes[scope.row.businessTypeId].label}}
          </template>
        </el-table-column>
        <el-table-column
          prop="changeScore"
          label="变动积分">
          <template slot-scope="scope">
            <span v-if="scope.row.changeType == 1 || scope.row.changeType == 3"> - </span>
            <span v-else> + </span>
            {{scope.row.changeScore}}
          </template>
        </el-table-column>
        <el-table-column
          prop="surplusScore"
          label="剩余积分">
        </el-table-column>
        <el-table-column
          prop="changeTime"
          label="交易时间"
          sortable>
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注">
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
  name: 'integralDetails',
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
        memberInfoId:'',
        businessTypeId:-1,
        timeValue:''
      },
      dataList:[ ],
      total:0,
      loading:true
    }
  },
  watch: { },
  computed:{
    idbusinessTypes(){
      return financeCons.idbusinessTypes;
    }
  },
  created() { },
  methods: {
    init(){
      let query = {
        memberInfoId:this.ruleForm.memberInfoId,
        businessTypeId:this.ruleForm.businessTypeId == -1 ? null : this.ruleForm.businessTypeId,
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
      this._apis.finance.getListId(query).then((response)=>{
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
        memberInfoId:'',
        businessTypeId:'',
        timeValue:''
      }
      this.fetch()
    },
    //导出
    exportToExcel() {
      let query = this.init();
      this._apis.finance.exportId(query).then((response)=>{
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
