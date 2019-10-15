/* 会员等级列表 */
<template>
  <div>
    <el-table
      :data="levelList"
      style="width: 100%"
      ref="levelTable"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      v-loading="loading"
      >
      <el-table-column
        prop="alias"
        label="等级排序">
      </el-table-column>
      <el-table-column
        prop="name"
        label="等级名称">
      </el-table-column>
      <el-table-column
        prop="explain"
        label="说明">
      </el-table-column>
      <el-table-column
        prop="receiveConditionsRemarks"
        label="等级条件">
      </el-table-column>
      <el-table-column
        prop="rights"
        label="等级权益">
      </el-table-column>
      <el-table-column
        prop="upgradePackage"
        label="升级奖励">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
            <!-- <el-switch v-model="scope.row.status" @change="handleSwitch(scope.row)" v-permission="['客户', '会员等级', '默认页面', '启用/禁用']"></el-switch> -->
            <span class="edit_span" v-if="scope.row.status == 1" v-permission="['客户', '会员等级', '默认页面', '启用/禁用']">启用</span>
            <span class="edit_span" v-if="scope.row.status == 0" v-permission="['客户', '会员等级', '默认页面', '启用/禁用']">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <span class="edit_span" @click="edit(scope.row)" v-if="scope.row.name" v-permission="['客户', '会员等级', '默认页面', '查看']">编辑</span>
            <span class="edit_span" @click="handleConfig(scope.row)" v-if="!scope.row.name" :style="{color:scope.row.isGray?'#eee':'#655EFF'}" v-permission="['客户', '会员等级', '默认页面', '待配置']">待配置</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="single_check">
        <el-checkbox v-model="checked" @change="handleAll"></el-checkbox>
        <el-button class="other_btn" @click="batchDisable">批量禁用</el-button>
    </div> -->
  </div>
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
export default {
  name: "cvTable",
  extends: TableBase,
  props: ['params'],
  data() {
    return {
      checked: false,
      levelList: [],
      loading: false
    };
  },
  computed: {
   
  },
  created() {

  },
  methods: {
    getLevelsList() {
      this.loading = true;
      this._apis.client.getLevelsList(this.params).then((response) => {
        this.loading = false;
        response.list.map((v) => {
          v.isGray = true;
        });
        this.levelList = [].concat(response.list);
        let i = this.levelList.findIndex((value,index,arr) => {
            return value.name == null;
        });
        if(i !== -1) {
          this.$set(response.list[i], 'isGray', false);
        }
      }).catch((error) => {
        this.loading = false;
        console.log(error);
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
      })
    },
    edit(row) {
      this._routeTo('levelInfo',{id: row.id, level: row.level});
    },
    handleConfig(row) {
      if(!row.isGray) {
        this._routeTo('levelInfo',{id: row.id, level: row.level});
      }
    },
    handleSwitch(row) {
      let status = row.status ? "1":"0";
      this._apis.client.enableLevel({id:row.id, status: status}).then((response) => {
        this.$notify({
          title: '成功',
          message: "切换成功",
          type: 'success'
        });
      }).catch((error) => {
        console.log(error);
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
      })
    },
    handleAll(val) {
      this.levelList.forEach(row => {
        this.$refs.levelTable.toggleRowSelection(row,val)
      });
    },
    batchDisable() {
      let rows = this.$refs.levelTable.selection;
      if(rows.length == 0) {
        this.$notify({
          title: '警告',
          message: '请选择要禁用的等级',
          type: 'warning'
        });
      }else{
        let arr = [];
        rows.map((v) => {arr.push(v.id);});
        this._apis.client.batchEnableLevel({levelIds: arr, status: '0'}).then((response) => {
          this.$notify({
            title: '成功',
            message: "批量禁用成功",
            type: 'success'
          });
          this.getLevelsList();
        }).catch((error) => {
          console.log(error);
          // this.$notify.error({
          //   title: '错误',
          //   message: error
          // });
        })
      }
    }
  },
  mounted() {
    this.getLevelsList();
  },
  watch: {
    params() {
      this.getLevelsList();
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.edit_span{
    color: #655EFF;
    cursor: pointer;
    .edit_i{
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-right: 8px;
        background: url("../../../../assets/images/client/icon_edit.png") 0 0 no-repeat;
    }
}
.single_check{
    padding: 10px 0 0 14px;
}
.other_btn{
    color: #655EFF;
    border-color: #655EFF;
}
</style>
