/* 推客奖励列表 */
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
        <!-- <el-form-item label="订单编号">
          <el-input v-model="ruleForm.value2" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item> -->
        <el-form-item label="奖励方式">
          <el-select v-model="ruleForm.presentType" style="width:200px;">
            <el-option
              v-for="item in rewards"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="时间">
          <el-date-picker
            v-model="times"
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
          <el-button type="primary" @click="onSubmit(1)" v-permission="['财务', '推客奖励', '默认页面', '查询']">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="border_btn"   @click='exportToExcel()' v-permission="['财务', '每日营收', '默认页面', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <el-table
      v-loading="loading"
        :data="dataList"
        style="width: 100%"
        class="table"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        @sort-change="sortTable"
        >
        <!-- :default-sort = "{prop: 'createTime', order: 'descending'}" -->
        <el-table-column
          prop="memberSn"
          label="用户ID"
          :render-header="renderMemberId">
        </el-table-column>
        <el-table-column
          prop='nickName'
          label="用户昵称"
          >
        </el-table-column>
        <el-table-column
          prop="presentType"
          label="奖励方式">
          <template slot-scope="scope">
            {{rewards[scope.row.presentType].label}}
          </template>
        </el-table-column>
        <el-table-column
          prop="presentContent"
          label="奖励内容">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="时间"
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
		<exportTipDialog :data=currentData  :dialogVisible.sync="dialogVisible"></exportTipDialog>
	</div>
  </div>
</template>

<script type='es6'>
import utils from "@/utils";
import TableBase from "@/components/TableBase";
import financeCons from '@/system/constant/finance';
import exportTipDialog from '@/components/dialogs/exportTipDialog'
export default {
  name: "taTable",
  extends: TableBase,
   components:{
     exportTipDialog
    },
  data() {
    return {
      dataList:[],
      total:0,
      inline:true,
      userTypes:[
        {
          value:'memberSn',
          label:'用户ID'
        },
        {
          value:'nickName',
          label:'用户昵称'
        },
      ],
      times:[],
      ruleForm:{
        memberSn:'',
        nickName:'',
        presentType:0,
        startTime:'',
        stopTime:'',
        sort:'desc',
        pageSize:10,
        pageNum:1,
        userType:'memberSn',
        userValue:'',
      },
      loading:true,
      currentData:{},
      dialogVisible:false
    };
  },
  watch: {
    times(){
      if(this.times.length != 0){
        this.ruleForm.startTime = this.times[0]
        this.ruleForm.stopTime = this.times[1]
      }
    }
  },
  computed:{
    rewards(){
      return financeCons.rewards;
    }
  },
  created() {},
  methods: {
    renderMemberId(){
      return(
        <div style="height:49px;line-height:49px;">
          <span style="font-weight:bold;vertical-align:middle;">用户ID</span>
          <el-popover
            placement="top-start"
            title=""
            width="160"
            trigger="hover"
            content="所有参与超级海报获得奖励的用户ID">
            <i slot="reference" class="el-icon-warning-outline" style="vertical-align:middle;"></i>
          </el-popover>
        </div>
      )
    },
    fetch(num){
      this.ruleForm.pageNum = num || this.ruleForm.pageNum
      let query = {
        memberSn:'',
        nickName:'',
        presentType:this.ruleForm.presentType,
        startTime:this.ruleForm.startTime,
        stopTime:this.ruleForm.stopTime,
        sort:this.ruleForm.sort,
        pageSize:this.ruleForm.pageSize,
        pageNum:this.ruleForm.pageNum,
      }
      if(this.ruleForm.userType == 'memberSn'){
        query.memberSn = this.ruleForm.userValue || ''
        query.nickName = ''
      }else{
        query.nickName = this.ruleForm.userValue || ''
        query.memberSn = ''
      }
      this._apis.finance.getListTa(query).then((response)=>{
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
    //排序
    sortTable(column){
      let obj = column
      this.ruleForm.sort = obj.order == 'descending' ? 'desc' : 'asc'
      this.fetch()
    },

    //重置
    resetForm(){
      this.ruleForm = {
        memberSn:'',
        nickName:'',
        presentType:0,
        startTime:'',
        stopTime:'',
        sort:'desc',
        pageNum:1,
        pageSize:10,
        userType:'memberSn',
        userValue:''
      }
      this.times= []
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
      if(this.total >1000){
        this.dialogVisible = true;
        this.currentData.api = 'finance.exportTa';
        this.currentData.query =this.ruleForm;
      }else{
        this._apis.finance.exportTa(this.ruleForm).then((response)=>{
        window.location.href = response.url
      }).catch((error)=>{
        this.$message.error(error);
      })
      }
    },
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
      display: block;
      margin-top:15px;
      em{
        font-style: normal;
        color: #000;
      }
    }
  }
}
.mb10{
  margin-bottom: 10px;
}
.table{
  margin-top: 20px;
}
</style>

