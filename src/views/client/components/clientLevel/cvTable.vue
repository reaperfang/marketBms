/* 会员等级列表 */
<template>
  <div>
    <el-table
      :data="levelList"
      style="width: 100%"
      ref="levelTable"
      :header-cell-style="{background:'#f6f7fa', color:'#44434B', height: '46px'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      v-loading="loading"
      >
      <el-table-column
        prop="alias"
        fixed="left"
        width="100"
        class-name="table-padding"
        label="等级排序">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="等级名称">
      </el-table-column>
      <el-table-column
        prop="explain"
        label="说明">
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="receiveConditionsRemarks"
        label="等级条件">
      </el-table-column>
      <el-table-column
        prop="rights"
        min-width="150"
        label="等级权益">
      </el-table-column>
      <el-table-column
        min-width="100"
        label="升级奖励">
        <template slot-scope="scope">
          <p>{{scope.row.upgradePackage ? scope.row.upgradePackage.split(',')[0]:''}}</p>
          <p>{{scope.row.upgradePackage ? scope.row.upgradePackage.split(',')[1]:''}}</p>
          <p>{{scope.row.upgradePackage ? scope.row.upgradePackage.split(',')[2]:''}}</p>
          <p>{{scope.row.upgradePackage ? scope.row.upgradePackage.split(',')[3]:''}}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
            <!-- <el-switch v-model="scope.row.status" @change="handleSwitch(scope.row)" v-permission="['用户', '会员等级', '默认页面', '启用/禁用']"></el-switch> -->
            <span v-if="scope.row.status == 1" v-permission="['用户', '会员等级', '默认页面', '启用/禁用']">启用</span>
            <span v-if="scope.row.status == 0" v-permission="['用户', '会员等级', '默认页面', '启用/禁用']">未启用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="operationColumnW" fixed="right" header-align="center" class-name="table-padding">
        <template slot-scope="scope">
          <div class="table-operate"> 
            <span class="edit_span table-btn" @click="handleOpen(scope.row)" v-if="scope.row.enableShow == true && scope.row.name" v-permission="['用户', '会员等级', '默认页面', '查看']">启用</span>
            <span class="edit_span table-btn table-warning" style="color:#FD4C2B; padding-right: 5px; border-right: 1px solid #dadae3;" @click="handleClose(scope.row)" v-if="scope.row.disableShow == true" v-permission="['用户', '会员等级', '默认页面', '查看']">禁用</span>
            <span class="edit_span table-btn" @click="edit(scope.row)" v-if="scope.row.name" v-permission="['用户', '会员等级', '默认页面', '查看']">编辑</span>
            <span class="edit_span table-btn" @click="handleConfig(scope.row)" v-if="!scope.row.name" :style="{color:scope.row.isGray?'#eee':'#655EFF'}" v-permission="['用户', '会员等级', '默认页面', '待配置']">待配置</span>
          </div>
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
      loading: false,
      operationColumnW: 72 //操作列宽度
    };
  },
  computed: {
   
  },
  created() {

  },
  methods: {
    handleOpen(row) {
      this._apis.client.enableLevel({id: row.id, status: 1}).then((response) => {
        if(response == 1) {
          this.getLevelsList();
          this.$message({
            message: '启动成功',
            type: 'success'
          });
        }
      }).catch((error) => {
        console.error(error);
      })
    },
    handleClose(row) {
       this.confirm({
        customClass: 'goods-custom', 
        icon: true, 
        text: '确认禁用该等级？'
      }).then(() => {
          this._apis.client.levelDisable({level: row.level, id: row.id, status: 0}).then((response) => {
            if(response == 1) {
              this.getLevelsList();
              this.$message({
                message: '禁用成功',
                type: 'success'
              });
            }else if(response == 2){
              this.$message({
                message: '该等级下有会员或即将有会员升至该等级，不可禁用',
                type: 'warning'
              });
            }
          }).catch((error) => {
            console.error(error);
          })        
        })
    },
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
        console.error(error);
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
        this.$message({
          message: '切换成功',
          type: 'success'
        });
      }).catch((error) => {
        console.error(error);
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
        this.$message({
          message: '请选择要禁用的等级',
          type: 'warning'
        });
      }else{
        let arr = [];
        rows.map((v) => {arr.push(v.id);});
        this._apis.client.enableLevel({levelIds: arr, status: '0'}).then((response) => {
          this.$message({
            message: '批量禁用成功',
            type: 'success'
          });
          this.getLevelsList();
        }).catch((error) => {
          console.error(error);
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
    },
    'levelList': {
        handler(newVal, oldVal) { //计算操作栏宽度
            this.$nextTick(() => {
                this.operationColumnW = this.utils.getOperationColumnW();
            })
        },
        deep: true
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-table--small td, .el-table--small th{
  padding: 16px 0;
}
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
