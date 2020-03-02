<template>
<div>
  <DialogBase :visible.sync="visible" @submit="submit" title="选择商品" :hasCancel="hasCancel" :showFooter="false">
    <div class="c_container">
      <div>
        <div class="input_wrap">
          <el-cascader :options="categoryOptions" v-model="categoryValue" clearable></el-cascader>
        </div>
        <!-- <div class="input_wrap">
          <el-input placeholder="输入商品标签" v-model="productLabelName"></el-input>
        </div> -->
        <div class="input_wrap2">
          <el-input placeholder="输入商品名称" v-model="name"></el-input>
        </div>
        <el-button type="primary" class="marL10" @click="handleSearch">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
      <el-table
        :data="skuList"
        :row-key="getRowKeys"
        style="width: 100%"
        ref="skuTable"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="selection" prop="choose" label="选择" :reserve-selection="true"></el-table-column>
        <!-- <el-table-column prop="goodsInfo.id" label="SKU"></el-table-column> -->
        <el-table-column prop="goodsInfo.name" label="商品名称"></el-table-column>
        <el-table-column prop="goodsInfo.specs" label="规格"></el-table-column>
        <el-table-column prop="goodsInfo.salePrice" label="商品价格"></el-table-column>
        <el-table-column prop="goodsInfo.stock" label="商品库存"></el-table-column>
      </el-table>
      <div class="page_styles">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(startIndex) || 1"
          :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
          :page-size="pageSize*1"
          :total="total*1"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <div>
      <span slot="footer" class="dialog-footer fcc">
        <el-button type="primary" @click="submit">确 认</el-button>
        <el-button v-if="hasCancel" @click="visible = false">取 消</el-button>
      </span>
    </div>
  </DialogBase>
  <el-dialog
        title="已选商品"
        :visible.sync="dialogVisible2"
        width="45%"
    >
        <!-- <div v-if="selectedList.length == 0">
          <img src="../../../../assets/images/no_data.png" alt="" class="no_data">
        </div> -->
        <div>
            <el-button class="clearBtn" @click="clearList">清 空</el-button>
            <el-table
                :data="selectedList"
                style="width: 100%"
                ref="selectedTable"
                :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
                :default-sort="{prop: 'date', order: 'descending'}"
            >
                <!-- <el-table-column prop="goodsInfo.id" label="SKU"></el-table-column> -->
                <el-table-column prop="goodsInfo.name" label="商品名称"></el-table-column>
                <el-table-column prop="goodsInfo.specs" label="规格"></el-table-column>
                <el-table-column prop="goodsInfo.salePrice" label="商品价格"></el-table-column>
                <el-table-column prop="goodsInfo.stock" label="商品库存"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                      <span class="edit_span" @click="deleteRow(scope.row)">删除</span>
                  </template>
              </el-table-column>
            </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="submit2">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import DialogBase from "@/components/DialogBase";
export default {
  props: ["data"],
  name: "chooseProductDialog",
  data() {
    return {
      hasCancel: true,
      categoryOptions: [],
      categoryValue: [],
      productLabelName: "",
      name: "",
      skuList: [],
      total: 0,
      pageSize: 10,
      startIndex: 1,
      dialogVisible2: false,
      selectedList:[]
    };
  },
  methods: {
    deleteRow(row) {
      this.selectedList.splice(row, 1);
      this.skuList.push(row);
    },
    clearList() {
      this.selectedList = [];
    },
    getRowKeys(row) {
      return row.id
    },
    handleSizeChange(val) {
      this.getSkuList(1, val);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.getSkuList(val, this.pageSize);
    },
    submit() {
        let selectedRows = this.$refs.skuTable.selection;
        this.selectedList = this.selectedList.concat(selectedRows);
        this.dialogVisible2 = true;
        if(selectedRows.length > 0) {
          this.skuList.map((item) => {
            selectedRows.map((i) => {
              if(item.goodsInfo.id == i.goodsInfo.id) {
                this.skuList.splice(item, 1);
              }
            })
          })
        }
        this.$nextTick(() => {
          this.skuList.forEach(row => {
            this.$refs.skuTable.toggleRowSelection(row,false);
          });
        })
    },
    submit2() {
      if(this.selectedList.length > 0) {
        this.dialogVisible = false;
        this.dialogVisible2 = false;
        let selectedIds = [];
        this.selectedList.map((v) => {
            selectedIds.push(v.goodsInfo.id);
        });
        selectedIds = selectedIds.join(',');
        this.$emit('getSelected', selectedIds);
      }else{
        this.dialogVisible = false;
        this.dialogVisible2 = false;
      }
    },
    transTreeData(data, pid) {
      var result = [],
        temp;
      for (var i = 0; i < data.length; i++) {
        if (data[i].parentId == pid) {
          var obj = {
            categoryName: data[i].name,
            id: data[i].id,
            parentId: data[i].parentId,
            level: data[i].level,
            sort: data[i].sort,
            image: data[i].image,
            enable: data[i].enable,
            label: data[i].name,
            value: data[i].id
          };
          temp = this.transTreeData(data, data[i].id);
          if (temp.length > 0) {
            obj.children = temp;
          }
          result.push(obj);
        }
      }
      return result;
    },
    getProductClass() {
      this._apis.client
        .getProductClass({})
        .then(response => {
          let arr = this.transTreeData(response, 0);
          this.categoryOptions = [].concat(arr);
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSkuList(startIndex, pageSize) {
      let params = {
        name: this.name,
        productCatalogInfoId: this.categoryValue[2],
        startIndex: startIndex,
        pageSize: pageSize,
        productLabelName: this.productLabelName
      };
      this._apis.client
        .getSkuList(params)
        .then(response => {
          response.list.map((v) => {
              v.goodsInfo.specs = v.goodsInfo.specs.replace(/{|}|"|"/g,"");
          })
          this.skuList = [].concat(response.list);
          this.total = response.total;
          // let productInfoIds;
          // if(!!this.data.productInfoIds) {
          //   if(this.data.productInfoIds.indexOf(',') !== -1) {
          //     productInfoIds = this.data.productInfoIds.split(',');
          //   }else{
          //     productInfoIds = [this.data.productInfoIds]
          //   }
          // }
          // if(productInfoIds && productInfoIds.length > 0) {
          //   productInfoIds.map((v) => {
          //       this.skuList.forEach(row => {
          //           if(row.goodsInfo.id == v) {
          //             this.$nextTick(() => {
          //               this.$refs.skuTable.toggleRowSelection(row);
          //             })
          //           }
          //       })
          //   })
          // }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSearch() {
        this.getSkuList(this.startIndex, this.pageSize);
    },
    reset() {
        this.categoryValue = [];
        this.productLabelName = "";
        this.name = "";
        this.getSkuList(this.startIndex, this.pageSize);
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
    this.getProductClass();
    this.getSkuList(1,10);
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
/deep/ .el-dialog__header{
    background: #f1f0ff;
    border-radius: 10px 10px 0 0;
}
/deep/ .el-dialog{
    border-radius: 10px;
}
.c_container {
    .marL10{
        margin-left: 10px;
    }
  > div {
    text-align: left;
    margin-bottom: 17px;
    .input_wrap {
      width: 150px;
      display: inline-block;
    }
    .input_wrap2 {
      width: 174px;
      display: inline-block;
    }
  }
  .page_styles{
    text-align: center;
    overflow-x: auto;
  }
  .clearBtn{
    float: right;
    margin-bottom: 20px;
  }
  .no_data{
    display: block;
    width: 50px;
    height: 50px;
  }
  .edit_span{
    cursor: pointer;
    color: #FD4C2B;
  }
}
</style>


