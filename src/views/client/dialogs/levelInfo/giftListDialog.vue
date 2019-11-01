<template>
  <DialogBase :visible.sync="visible" @submit="submit" title="选择赠品" :hasCancel="hasCancel">
    <div class="table_container">
      <div class="fr marB20">
        <div class="input_wrap">
          <el-input placeholder="赠品编号/名称" v-model="key"></el-input>
        </div>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <div>
        <el-table
          :data="giftList"
          style="width: 100%"
          ref="giftTable"
          :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
          :default-sort="{prop: 'date', order: 'descending'}"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="businessId" label="赠品编号"></el-table-column>
          <el-table-column prop="goodsName" label="赠品名称"></el-table-column>
          <el-table-column prop="stock" label="剩余库存"></el-table-column>
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
      giftList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0
    };
  },
  methods: {
    submit() {
        this.$emit('getSelection', {selection: this.$refs.giftTable.selection});
    },
    getAllGift(key, pageNum, pageSize) {
        let params = {
          nameOrId: key || '',
          pageNum: pageNum,
          pageSize: pageSize
        }
        this._apis.client.getGiftList(params).then((response) => {
            this.giftList = [].concat(response.list);
            this.total = response.total || 0;
            if(this.giftList) {
              this.giftList.map((v) => {
                v.status = this.statusMap[v.status]
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
      this.getAllGift(this.key, this.pageNum, this.pageSize);
    },
    handleSizeChange(val) {
      this.getAllGift(this.key, this.pageNum, val);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.getAllGift(this.key, val, this.pageSize);
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
    this.getAllGift(this.key, this.pageNum, this.pageSize);
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


