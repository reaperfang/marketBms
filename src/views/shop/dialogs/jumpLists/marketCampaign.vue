<template>
  <div>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true">
          <div class="inline-head">
            <el-form-item label="" prop="">
              <el-select v-if="activities.length" v-model="ruleForm.appType" placeholder="请选择活动类型">
                <el-option label="全部类型" value=""></el-option>
                <el-option v-for="(item, key) of activities" :key="key" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="idOrName">
              <el-input v-model="ruleForm.idOrName" placeholder="请输入活动名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="" prop="">
              <el-button type="primary" @click="fetch">搜  索</el-button>
            </el-form-item>
          </div>
        </el-form>
        <el-table :data="tableData" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
          <el-table-column prop="" label="选择" :width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.active" @change="seletedChange(scope.row, scope.row.active)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="appActivityName" label="活动名称"></el-table-column>
          <el-table-column prop="appTypeName" label="活动类型"></el-table-column>
          <!-- <el-table-column prop="visitor" label="访客数"></el-table-column>
          <el-table-column prop="browse" label="浏览数"></el-table-column> -->
        </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(startIndex) || 1"
          :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
          :page-size="pageSize*1"
          :total="total*1"
          layout="total, sizes, prev, pager, next, jumper"
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
      },
      pageNum: 1,
      rules: {},
      activities: [],
      tableData: [],
    };
  },
  created() {
    this.getActivitiesList();
    this.fetch();
  },
  methods: {
    getActivitiesList() {
      this._apis.shop.getActivitiesList({}).then((response)=>{
        const list = [];
        for(let item of response) {
          list.push({
            code: item[0].split(',')[0],
            name: item[0].split(',')[1]
          })
        }
        this.activities = list;
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
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
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
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
    }

  }
};
</script>

<style lang="scss">
.inline-head{
  justify-content: flex-end;
}
</style>