/* cardManage列表 */
<template>
  <div>
    <el-table
      :data="cardList"
      style="width: 100%"
      :header-cell-style="{background:'#f6f7fa', color:'#44434B', height: '46px'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      v-loading="loading"
      >
      <el-table-column
        prop="alias"
        fixed="left"
        width="110"
        class-name="table-padding"
        label="会员卡等级">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="receiveConditionsRemarks"
        label="领取条件"
        min-width="150"
      >
      </el-table-column>
      <el-table-column
        prop="rights"
        label="权益"
        min-width="150"
      >
      </el-table-column>
      <el-table-column
        label="升级礼包"
        min-width="100"
      >
        <template slot-scope="scope">
          <p>{{scope.row.upgradePackage ? scope.row.upgradePackage.split(',')[0]:''}}</p>
          <p>{{scope.row.upgradePackage ? scope.row.upgradePackage.split(',')[1]:''}}</p>
          <p>{{scope.row.upgradePackage ? scope.row.upgradePackage.split(',')[2]:''}}</p>
          <p>{{scope.row.upgradePackage ? scope.row.upgradePackage.split(',')[3]:''}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="validity"
        label="有效期"
        align="center"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <template slot-scope="scope">
          <!-- <el-switch v-model="scope.row.enable" @change="changeSwitch(scope.row)" v-permission="['用户', '会员卡', '会员卡管理', '启用/禁用']"></el-switch> -->
          <span class="edit_span" v-if="scope.row.enable == 0" v-permission="['用户', '会员卡', '会员卡管理', '启用/禁用']">启用</span>
          <span class="edit_span" v-if="scope.row.enable == 1" v-permission="['用户', '会员卡', '会员卡管理', '启用/禁用']">未启用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="operationColumnW" fixed="right" header-align="center" class-name="table-padding">
        <template slot-scope="scope">
            <div class="btns clearfix table-operate">
                <span class="table-btn" v-if="!!scope.row.name" @click="goToEdit(scope.row)" v-permission="['用户', '会员卡', '会员卡管理', '查看']">编辑</span>
                <span class="table-btn" v-if="scope.row.enableShow == true  && scope.row.name" @click="handleAble($event, scope.row, 0)">启用</span>
                <span class="table-btn table-warning" v-if="scope.row.disableShow == true" @click="handleAble($event, scope.row, 1)">禁用</span>
                <span class="table-btn" v-if="!!scope.row.name" @click="sendCard(scope.row)" v-permission="['用户', '会员卡', '会员卡管理', '发卡']">发卡</span>
                <span class="table-btn" v-if="!scope.row.name" :style="{color: scope.row.isGray ? '#eee':'#655EFF', 'border-right': '0' }" @click="handleConfig(scope.row)" v-permission="['用户', '会员卡', '会员卡管理', '待配置']">待配置</span>
            </div>
        </template>
        
      </el-table-column>
    </el-table>
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" v-if="dialogVisible"></component>
  </div>
</template>
<script type='es6'>
import TableBase from "@/components/TableBase";
import sendCardDialog from '../../dialogs/cdTable/sendCardDialog'
export default {
  name: "cdTable",
  extends: TableBase,
  components: { sendCardDialog },
  data() {
    return {
      currentDialog: "",
      dialogVisible: false,
      currentData: {},
      cardList: [],
      loading: false,
      operationColumnW: 72 //操作列宽度
    };
  },
  watch: {
    'cardList': {
        handler(newVal, oldVal) { //计算操作栏宽度
            this.$nextTick(() => {
                this.operationColumnW = this.utils.getOperationColumnW();
            })
        },
        deep: true
    }
  },
  methods: {
    handleAble(ele, row, num) {
      this._apis.client.toggleStatus({id:row.id, enable: num}).then((response) => {
        this.getCardList();
        this.$message({
          message: '切换成功',
          type: 'success'
        });
      }).catch((error) => {
        this.$message.error(error);
      })
    },
    getCardList() {
      this.loading = true;
      let obj = {
          "startIndex": 1,
          "pageSize": 10
      }
      this._apis.client.getCardList(obj).then((response) => {
          this.loading = false;
          response.list.map((v) => {
              v.validity = "永久有效";
              v.isGray = true;
              //v.enable = v.enable == 0?true:false;
          });
          let i = response.list.findIndex((value,index,arr) => {
              return value.name == null || value.name == "";
          });
          if(i !== -1) {
              this.$set(response.list[i], 'isGray', false);
          }else{
              this.$set(response.list[0], 'isGray', false);
          }
          this.cardList = [].concat(response.list);
      }).catch((error) => {
          this.loading = false;
          console.error(error);
      })
    },
    sendCard(row) {
      this.dialogVisible = true;
      this.currentDialog = "sendCardDialog";
      this.currentData.name = row.name;
      this.currentData.id = row.id;
      this.currentData.level = row.level;
    },
    handleConfig(row) {
      if(!row.isGray) {
        this._routeTo('createCard',{cardData:row});
      }
    },
    goToEdit(row) {
      this._routeTo('createCard',{cardData:row});
    }
  },
  computed: {
    
  },
  created() {
    
  },
  mounted() {
    this.getCardList();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-table--small td, .el-table--small th{
  padding: 16px 0;
} 
</style>
