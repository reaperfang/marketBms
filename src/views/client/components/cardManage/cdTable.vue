/* cardManage列表 */
<template>
  <div>
    <el-table
      :data="cardList"
      style="width: 100%"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      v-loading="loading"
      >
      <el-table-column
        type="selection"
        prop="choose"
        label="选择">
      </el-table-column>
      <el-table-column
        prop="alias"
        label="会员卡等级">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="receiveConditionsRemarks"
        label="领取条件"
      >
      </el-table-column>
      <el-table-column
        prop="rights"
        label="权益"
      >
      </el-table-column>
      <el-table-column
        prop="upgradePackage"
        label="升级礼包"
      >
      </el-table-column>
      <el-table-column
        prop="validity"
        label="有效期"
      >
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <!-- <el-switch v-model="scope.row.enable" @change="changeSwitch(scope.row)" v-permission="['客户', '会员卡', '会员卡管理', '启用/禁用']"></el-switch> -->
          <span class="edit_span" v-if="scope.row.enable == 0" v-permission="['客户', '会员卡', '会员卡管理', '启用/禁用']">启用</span>
          <span class="edit_span" v-if="scope.row.enable == 1" v-permission="['客户', '会员卡', '会员卡管理', '启用/禁用']">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <div class="btns clearfix">
                <span v-if="!!scope.row.name" @click="goToEdit(scope.row)" v-permission="['客户', '会员卡', '会员卡管理', '查看']">编辑</span>
                <span v-if="!!scope.row.name" @click="sendCard(scope.row)" v-permission="['客户', '会员卡', '会员卡管理', '发卡']">发卡</span>
                <span v-if="!scope.row.name" :style="{color: scope.row.isGray ? '#eee':'#655EFF'}" @click="handleConfig(scope.row)" v-permission="['客户', '会员卡', '会员卡管理', '待配置']">待配置</span>
            </div>
        </template>
      </el-table-column>
    </el-table>
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" v-if="hackReset"></component>
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
      hackReset: false,
      cardList: [],
      loading: false
    };
  },
  methods: {
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
          console.log(error);
      })
    },
    changeSwitch(row) {
      this._apis.client.toggleStatus({id:row.id, enable: row.enable?1:0}).then((response) => {
        this.$notify({
          title: '成功',
          message: "切换成功",
          type: 'success'
        });
        this.$emit('refreshTable');
      }).catch((error) => {
        console.log(error);
      })
    },
    sendCard(row) {
      this.hackReset = false;
      this.$nextTick(() => {
        this.hackReset = true;
      })
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
/deep/ .cell{
            .btns{
                span{
                    color: #655EFF;
                    margin-right: 15px;
                    cursor: pointer;
                }
            }
        }

</style>
