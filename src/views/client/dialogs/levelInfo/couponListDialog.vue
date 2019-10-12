<template>
  <DialogBase :visible.sync="visible" @submit="submit" title="选择优惠券" :hasCancel="hasCancel">
    <div class="table_container">
      <div class="fr marB20">
        <div class="input_wrap">
          <el-input placeholder="优惠券名称/优惠券编号" v-model="key"></el-input>
        </div>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <div>
        <el-table
          :data="couponList"
          style="width: 100%"
          ref="couponTable"
          :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
          :default-sort="{prop: 'date', order: 'descending'}"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="id" label="优惠券编号" width="200"></el-table-column>
          <el-table-column prop="name" label="优惠券名称"></el-table-column>
          <el-table-column prop="receiveLimitCount" label="限领次数"></el-table-column>
          <el-table-column prop="remainStock" label="当前剩余数量"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>         
        </el-table>
        <div class="page_styles">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="Number(pageNum) || 1"
              :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
              :page-size="pageSize*1"
              :total="total*1"
              layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
        </div>
      </div>
    </div>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";
export default {
  name: "levelInfoDialog",
  data() {
    return {
      hasCancel: true,
      key: "",
      statusMap: ['未生效','生效中','已失效'],
      couponList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0
    };
  },
  methods: {
    submit() {
        this.$emit('getSelectedCoupon', {selection: this.$refs.couponTable.selection});
    },
    getAllCoupons(key, pageNum, pageSize) {
        let params = {
          nameOrId: key || '',
          pageNum: pageNum,
          pageSize: pageSize,
          couponType: 0
        }
        this._apis.client.getAllCoupons(params).then((response) => {
            this.couponList = [].concat(response.list);
            this.total = response.total || 0;
            if(this.couponList) {
              this.couponList.map((v) => {
                v.status = this.statusMap[v.status]
                v.receiveLimitCount = v.receiveLimitCount == "-1" ? '不限次数': v.receiveLimitCount
              })
            }
        }).catch((error) => {
          console.log(error);
            // this.$notify.error({
            //     title: '错误',
            //     message: error
            // });
        })
    },
    search() {
      this.getAllCoupons(this.key, this.pageNum, this.pageSize);
    },
    handleSizeChange(val) {
      this.getAllCoupons(this.key, this.pageNum, val);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.getAllCoupons(this.key, val, this.pageSize);
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
    this.getAllCoupons(this.key, this.pageNum, this.pageSize);
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
.table_container {
  width: 100%;
  margin: 0 auto;
  .input_wrap {
    display: inline-block;
    width: 230px;
  }
  .marB20{
    margin-bottom: 20px;
  }
}
</style>


