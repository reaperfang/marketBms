<template>
<div>
  <DialogBase :visible.sync="visible" @submit="submit" title="发放优惠券" :hasCancel="hasCancel" :showFooter="false">
    <div class="c_container">
      <p class="marB20">用户ID: {{data.memberSn}}</p>
      <div class="clearfix">
        <div class="fl l_block">
          选择优惠券：
        </div>
        <div class="fl r_block">
          <div class="sel_cont" v-for="(i,index) in selectedCoupons" :key="index">
            <span class="sel_cont_name">{{i.name}}</span>
            <el-input-number v-model="i.frozenNum" :min="1" :max="10"></el-input-number>
            <span class="addMainColor pointer" @click="handleDelete(index)" style="margin-left: 20px">删除</span>
          </div>
          <span class="add pointer" @click="handleAdd">添加</span>
        </div>
      </div>
    </div>
    <div>
      <span slot="footer" class="dialog-footer fcc">
          <el-button type="primary" @click="submit" :loading="btnLoading">确 认</el-button>
          <el-button v-if="hasCancel" @click="visible = false">取 消</el-button>
      </span>
    </div>
  </DialogBase>
  <el-dialog
        title="选择优惠券"
        :visible.sync="dialogVisible2"
        width="45%"
    >
        <div>
            <p class="user_id2">用户ID: {{ data.memberSn }}</p>
            <el-table
                :data="data.allCoupons"
                style="width: 100%"
                ref="couponListTable"
                :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
                :default-sort="{prop: 'date', order: 'descending'}"
                v-loading="loading"
            >
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="优惠券名称">
                </el-table-column>
                <el-table-column
                    label="优惠方式"
                    >
                    <template slot-scope="scope">
                        {{scope.row.useType == 0?`减免${scope.row.useTypeFullcut}元`:`折扣${scope.row.useTypeDiscount}`}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="使用门槛">
                    <template slot-scope="scope">
                        {{scope.row.useCondition == -1?'无极限':`订单满${scope.row.useCondition}元`}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remainStock"
                    label="库存数量"
                >
                </el-table-column>
                <el-table-column
                    label="限领数量"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.receiveLimitCount == -1?'不限制': scope.row.receiveLimitCount}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="receivedNum"
                    label="已领数量"
                >
                </el-table-column>
                <el-table-column
                    label="发放数量"
                    width="150"
                    >
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.frozenNum" :min="1" :max="scope.row.ownNum > 10 ? 10:scope.row.ownNum"></el-input-number>
                    </template>
                </el-table-column>
            </el-table>
            <div class="a_line">
                <div class="fl">
                    <el-checkbox v-model="checkAll" @change="handleChangeAll">全选</el-checkbox>
                </div>
                <div class="fr">
                    共{{data.allCoupons.length}}条数据
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer fcc">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="couponSubmit">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import clientApi from "@/api/client";
import DialogBase from "@/components/DialogBase";
export default {
  props: ["data"],
  name: "issueCouponDialog",
  data() {
    return {
      hasCancel: true,
      coupon:"",
      btnLoading: false,
      dialogVisible2: false,
      loading: false,
      checkAll: false,
      selectedCoupons: []
    };
  },
  methods: {
    couponSubmit() {
      this.dialogVisible2 = false;
      if(this.$refs.couponListTable.selection.length == 0) {
        this.$message({
          message: '请选择要发放的优惠券',
          type: 'warning'
        });
      }else if(this.$refs.couponListTable.selection.length <= 10) {
        this.selectedCoupons = [].concat(this.$refs.couponListTable.selection);
      }else{
        this.$message({
          message: '最多只能选择10张优惠券',
          type: 'warning'
        });
      }
    },
    handleChangeAll(val) {
      this.data.allCoupons.forEach(row => {
          this.$refs.couponListTable.toggleRowSelection(row,val);
      });
    },
    submit() {
      this.btnLoading = true;
      let arr = [];
      this.selectedCoupons.map((item) => {
        let obj = {
          couponNum: item.frozenNum,
          appCouponId: item.id,
          memberId:this.data.id,
          receiveType:"1",
          receiveActivityId:"1",
          weChartNickname: this.data.weChartNickname
        }
        arr.push(obj);
      });
      if(this.selectedCoupons.length > 0) {
        this._apis.client.distributeCoupon(arr).then((response) => {
        response.map((v) => {
          if(!!v.receiveDesc) {
            this.visible = false;
            this.btnLoading = false;
            let errMsg = v.couponName + "发放失败，原因：" + v.receiveDesc.substring(v.receiveDesc.indexOf('。') + 1,v.receiveDesc.length);
            this.$message({
              message: errMsg,
              type: 'warning'
            });
          }else{
            this.btnLoading = false;
            this.visible = false;
            this.$message({
              message: "发放成功",
              type: 'success'
            });
            this.$emit('refreshPage');
          }
        })
        }).catch((error) => {
          this.btnLoading = false;
          this.visible = false;
        })
      }else{
        this.btnLoading = false;
        this.$message({
            message: "请选择优惠券",
            type: 'warning'
        });
      }
    },
    handleAdd() {
      this.dialogVisible2 = true;
    },
    handleDelete(index) {
      this.selectedCoupons.splice(index, 1);
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    }
  },
  mounted() {
  
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  components: {
    DialogBase
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-input-number--small .el-input-number__decrease, .el-input-number--small .el-input-number__increase{
  background-color: #655EFF;
  color: #fff;
}
/deep/ .el-input-number--small{
  width: 110px;
}
/deep/ .el-dialog__header{
    background: #f1f0ff;
    border-radius: 10px 10px 0 0;
}
/deep/ .el-input-number--small .el-input-number__decrease{
    width: 18px;
    font-size: 13px;
    height: 18px;
    background-color: #655EFF;
    color: #fff;
    border-radius: 50%;
    line-height: 18px;
    margin-top: 5px;
}
/deep/ .el-input-number--small .el-input-number__increase{
    width: 18px;
    font-size: 13px;
    height: 18px;
    background-color: #655EFF;
    color: #fff;
    border-radius: 50%;
    line-height: 18px;
    margin-top: 5px;
}
/deep/ .el-input-number--small{
    width: 94px;
}
/deep/ .el-input-number--small .el-input__inner{
    padding-left: 21px;
    padding-right: 21px;
    border: 0;
    background: none;
}
/deep/ .el-dialog{
    border-radius: 10px;
}
/deep/ .el-table{
  height: 591px;
  overflow-y: auto;
}
.c_container {
    text-align: left;
    .l_block{
      width: 86px;
      margin-top: 8px;
    }
    .r_block{
      position: relative;
      margin-top: 3px;
      .add{
        margin-top: 5px;
        color: #655EFF;
        display: block;
      }
      .sel_cont{
        .sel_cont_name{
          display: inline-block;
          width: 80px;
          margin-right: 20px;
          overflow: hidden;
        }
      }
    }
    .marB20{
      margin-bottom: 20px;
    }
}
.dialog-footer{
    margin-top: 20px;
}
.a_line{
    margin: 24px 46px 0 15px;
    overflow: hidden;
}
.user_id{
    text-align: left;
    padding: 0 0 10px 15px;
}
.user_id2{
    text-align: left;
    padding: 0 0 10px 15px;
    font-weight: bold;
}
</style>


