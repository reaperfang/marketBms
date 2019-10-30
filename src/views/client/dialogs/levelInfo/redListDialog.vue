<template>
  <DialogBase :visible.sync="visible" @submit="submit" title="选择红包" :hasCancel="hasCancel">
    <div class="table_container">
      <div class="fr marB20">
        <div class="input_wrap">
          <el-input placeholder="输入红包名称/红包编号" v-model="key"></el-input>
        </div>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <div>
        <el-table
          :data="redList"
          style="width: 100%"
          ref="redTable"
          highlight-current-row
          :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
          :default-sort="{prop: 'date', order: 'descending'}"
          @current-change="handleCurrentChange"
        >
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="name" label="红包名称"></el-table-column>
          <el-table-column prop="name" label="红包类型"></el-table-column>
          <el-table-column prop="hongbaoTotalMoney" label="红包余额"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>         
        </el-table>
        <div class="page_styles">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange2"
              :current-page="Number(page) || 1"
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
  name: "redListDialog",
  props: ['data'],
  data() {
    return {
      hasCancel: true,
      key: "",
      selectedRow: {},
      statusMap: ['未生效','生效中','已失效'],
      redList: [],
      pageSize: 10,
      page: 1,
      total: 0
    };
  },
  methods: {
    submit() {
        this.$emit('getSelectedRed', {selection: this.selectedRow});
    },
    // getSel() {
    //   let redArr = this.data.redArr;
    //   redArr.map((v) => {
    //     this.redList.forEach(row => {
    //       if(row.id = v) {
    //         this.$refs.redTable.toggleRowSelection(row, true);
    //       }
    //     });
    //   })
    // },
    handleCurrentChange(val) {
      this.selectedRow = Object.assign({},val);
    },
    getRedList(key, page, pageSize) {
      let params = {
        nameOrId: key || '',
        page: page,
        pageSize: pageSize, 
        status: 1
      }
      this._apis.client.getRedPacket(params).then((response) => {
            this.redList = [].concat(response.list);
            this.total = response.total || 0;
            if(this.redList) {
              this.redList.map((v) => {
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
      this.getRedList(this.key, this.page, this.pageSize);
    },
    handleSizeChange(val) {
      this.getRedList(this.key, this.page, val);
      this.pageSize = val;
    },
    handleCurrentChange2(val) {
      this.getRedList(this.key, val, this.pageSize);
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
    },
  },
  mounted() {
    this.getRedList(this.key, this.page, this.pageSize);
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
  },
  // updated() {
  //   if(this.data.redArr) {
  //     this.getSel();
  //   }
  // }
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


