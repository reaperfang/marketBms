<template>
  <div class="head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :inline="true">
          <div class="inline-head">
            <el-form-item label="活动状态" prop="status">
              <el-select label="活动状态" v-model="ruleForm.status" placeholder="请选择活动状态" style="width:120px">
                <el-option label="全部" :value="''"></el-option>
                <el-option label="未生效" :value="0"></el-option>
                <el-option label="生效中" :value="1"></el-option>
                <!-- <el-option label="已失效" :value="2"></el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item label="活动类型" prop="">
              <el-select v-if="activities.length" v-model="ruleForm.appType" placeholder="请选择活动类型" style="width:150px;">
                <el-option label="全部类型" value=""></el-option>
                <el-option v-for="(item, key) of activities" :key="key" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动名称" prop="idOrName">
              <el-input v-model="ruleForm.idOrName" placeholder="请输入名称" clearable style="width:120px;"></el-input>
            </el-form-item>
            <el-form-item label="" prop="">
              <el-button type="primary" @click="search">搜  索</el-button>
            </el-form-item>
          </div>
        </el-form>
        <el-table :data="tableData" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
          <el-table-column prop="" label="选择" :width="50">
            <template slot-scope="scope">
              <!-- <el-checkbox v-model="scope.row.active" :disabled="scope.row.status === 2 || scope.row.appType == 405" @change="seletedChange(scope.row, scope.row.active)"></el-checkbox> -->
              <el-checkbox v-model="scope.row.active" :disabled="scope.row.status === 2" @change="seletedChange(scope.row, scope.row.active)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="appActivityName" label="活动名称"></el-table-column>
          <el-table-column prop="appTypeName" label="活动类型"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">未生效</span>
              <span v-else-if="scope.row.status === 1">生效中</span>
              <span v-else-if="scope.row.status === 2">已失效</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="visitor" label="访客数"></el-table-column>
          <el-table-column prop="browse" label="浏览数"></el-table-column> -->
        </el-table>
      <div class="pagination">
        <el-pagination
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(pageNum) || 1"
          :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
          :page-size="pageSize*1"
          :total="total*1"
          layout="prev, pager, next, sizes"
          >
        </el-pagination>
      </div>
  </div>
</template>

<script>
import tableBase from '@/components/TableBase';
export default {
  name: "marketCampaign",
  extends: tableBase,
  components: {},
  props: {
     
  },
  data() {
    return {
      pageSize: 5,
      ruleForm: {
        idOrName: '',
        appType: '',
        pageNum: 1,
        status: ''
      },
      pageNum: 1,
      rules: {},
      invalid: true,  //数据是否无效
      activities: [],
      tableData: [],
    };
  },
  created() {
    this.getActivitiesList();
    this.fetch();
  },
  methods: {
    search() {
      this.startIndex = 1;
      this.ruleForm.startIndex = 1;
      this.pageNum = 1;
      this.ruleForm.pageNum = 1;
      this.fetch();
    },
    getActivitiesList() {
      this._apis.shop.getActivitiesList({}).then((response)=>{
        const list = [];
        for(let item of response) {
          // if(item[0].includes('405')) {
          //   continue;
          // }
          list.push({
            code: item[0].split(',')[0],
            name: item[0].split(',')[1]
          })
        }
        this.activities = list;
      }).catch((error)=>{
        console.error(error);
      });
    },

    fetch() {
      this.loading = true;
      this._apis.shop.getActivitiesData(this.ruleForm).then((response)=>{
        const tempList = [...response.list];
        for(let item of tempList) {
          item.active = false;
        }
        this.tableData = tempList;
        this.total = response.total;
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

      //当前页码改变
    handleCurrentChange(pIndex=1) {
      this.loading = true
      this.pageNum = pIndex
      this.ruleForm.pageNum = pIndex
      this.fetch()
    },


    /* 选中改变 */
    seletedChange(data, state) {

      /* 更改列表选中状态 */
      const tempList = [...this.tableData];
      for(let item of tempList) {
        if(item.id !== data.id) {
          item.active = false;
        }
      }
      this.tableData = tempList;

      let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
      let cid = shopInfo && shopInfo.id || ''

      if(state) {
        /* 向父组件发送选中的数据 */
        this.$emit('seletedRow',  {
          pageType: 'marketCampaign',
          typeName: '营销活动',
          id: 6,
          data: {
            id: data.appId,
            name: data.appActivityName,
            activityType: data.appType
          },
          cid
        });
        this.$emit('invalidChange', false)
      }else {
          /* 向父组件发送选中的数据 */
        this.$emit('seletedRow',  null);
        this.$emit('invalidChange', true)
      }

    },

  }
};
</script>

<style lang="scss">
/deep/ thead th{
  background: rgba(230,228,255,1)!important;
  color:#837DFF!important;
}
.inline-head{
  justify-content: flex-start!important;
}
</style>