<!--积分明细-->
<template>
  <div>
    <div class="top_part head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
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
        <el-form-item label="业务类型">
          <el-select v-model="ruleForm.businessTypeId"  placeholder="全部">
            <el-option
              v-for="item in idbusinessTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易时间">
          <el-date-picker
            v-model="ruleForm.timeValue"
            type="datetimerange"
            align="right"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="utils.globalTimePickerOption.call(this)">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(1)" v-permission="['财务', '积分明细', '默认页面', '查询']">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part bor-radius" v-calcMinHeight="211">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="border_btn"   @click='exportToExcel()' v-permission="['财务', '积分明细', '默认页面', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <!-- <idTable style="margin-top:20px"></idTable> -->
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
        :default-sort = "{prop: 'changeTime', order: 'descending'}"
        @sort-change="changeSort"
        >
        <el-table-column
          prop="scoreDetailSn"
          label="积分流水号"
          fixed="left" class-name="table-padding"
          width="200px">
        </el-table-column>
        <el-table-column
          prop="memberSn"
          align="center"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop='nickName'
          align="center"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          prop="businessTypeId"
          align="center"
          label="业务类型">
          <template slot-scope="scope">
            {{idbusinessTypes[scope.row.businessTypeId] && idbusinessTypes[scope.row.businessTypeId].label}}
          </template>
        </el-table-column>
        <el-table-column
          prop="changeScore"
          label="变动积分"
          align="right">
          <template slot-scope="scope">
            <span v-if="scope.row.changeType == 1 || scope.row.changeType == 5 || scope.row.changeType == 6"> - </span>
            <span v-if="scope.row.changeType == 0 || scope.row.changeType == 3 || scope.row.changeType == 4"> + </span>
            {{scope.row.changeScore}}
          </template>
        </el-table-column>
        <el-table-column
          prop="surplusScore"
          label="剩余积分"
          align="right">
        </el-table-column>
        <el-table-column
          prop="changeTime"
          label="交易时间"
          sortable = "custom"
          align="center"
          width="160px">
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注"
          class-name="table-padding"
          width="190px"
          fixed="right"
          align="center">
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
		<exportTipDialog :data=currentData  :dialogVisible.sync="dialogVisible"></exportTipDialog>
    </div>
  </div>
</template>

<script>
import utils from "@/utils";
import TableBase from "@/components/TableBase";
import financeCons from '@/system/constant/finance'
import exportTipDialog from '@/components/dialogs/exportTipDialog'
export default {
  name: 'integralDetails',
  extends: TableBase,
  components:{
    exportTipDialog
  },
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
        }
      ],
      ruleForm:{
        memberSn:'',
        businessTypeId:-1,
        timeValue:'',
        nickName:'',
        userType:'nickName',
        userValue:'',
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
    idbusinessTypes(){
      return financeCons.idbusinessTypes;
    }
  },
  created() {},
  methods: {
    init(){
      let query = {
        memberSn:this.ruleForm.memberSn,
        businessTypeId:this.ruleForm.businessTypeId == -1 ? null : this.ruleForm.businessTypeId,
        startTime:'',
        endTime:'',
        startIndex:this.ruleForm.startIndex,
        pageSize:this.ruleForm.pageSize,
        nickName:this.ruleForm.nickName,
        sort:this.ruleForm.sort
      }
      if(this.ruleForm.userType == 'memberSn'){
        query.memberSn = this.ruleForm.userValue || ''
        query.nickName = ''
      }else{
        query.nickName = this.ruleForm.userValue || ''
        query.memberSn = ''
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
      this._apis.finance.getListId(query).then((response)=>{
        this.dataList = response.list
        this.total = response.total || 0
        this.loading = false
      }).catch((error)=>{
        console.error(error);
        this.loading = false
      })
    },

    onSubmit(num){
      this.fetch(num)
    },
    //重置
    resetForm(){
      this.ruleForm = {
        businessTypeId:'',
        timeValue:'',
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
      if(this.total >1000){
        this.dialogVisible = true;
        this.currentData.api = 'finance.exportId';
        this.currentData.query =query;
      }else{
        this._apis.finance.exportId(query).then((response)=>{
        window.location.href = response
      }).catch((error)=>{
        this.$message.error(error)
      })
      }
    },
      //交易时间排序
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
/deep/.el-table .descending .sort-caret.descending{
  border-top-color:#44434B;
}
/deep/.el-table .ascending .sort-caret.ascending{
  border-bottom-color:#44434B;
}
</style>
