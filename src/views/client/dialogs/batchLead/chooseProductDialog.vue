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
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="selection" prop="choose" label="选择" :reserve-selection="true" :selectable="selectable" width="34"></el-table-column>
        <!-- <el-table-column prop="goodsInfo.id" label="SKU"></el-table-column> -->
        <el-table-column prop="goodsInfo.name" label="商品名称" width="150" fixed="left" class-name="table-padding"></el-table-column>
        <el-table-column prop="goodsInfo.specs" label="规格" align="center" min-width="120"></el-table-column>
        <el-table-column prop="goodsInfo.salePrice" label="商品价格" align="right" min-width="120"></el-table-column>
        <el-table-column prop="goodsInfo.stock" label="商品库存" min-width="120" align="right" fixed="right" class-name="table-padding"></el-table-column>
      </el-table>
      <div class="page_styles">
        <el-pagination
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(startIndex) || 1"
          :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
          :page-size="pageSize*1"
          :total="total*1"
          layout="prev, pager, next, sizes"
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
        <div>
            <span class="clearFont">（清空全部已选商品）</span>
            <el-button class="clearBtn" @click="clearList">清 空</el-button>
            <el-table
                :data="selectedList"
                style="width: 100%"
                ref="selectedTable"
                :default-sort="{prop: 'date', order: 'descending'}"
            >
                <!-- <el-table-column prop="goodsInfo.id" label="SKU"></el-table-column> -->
                <el-table-column prop="goodsInfo.name" label="商品名称" width="150" fixed="left" class-name="table-padding"></el-table-column>
                <el-table-column prop="goodsInfo.specs" label="规格" min-width="120" align="center"></el-table-column>
                <el-table-column prop="goodsInfo.salePrice" label="商品价格" min-width="120" align="right"></el-table-column>
                <el-table-column prop="goodsInfo.stock" label="商品库存" min-width="100" align="right"></el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right" class-name="table-padding">
                  <template slot-scope="scope">
                      <span class="edit_span" @click="deleteRow(scope.row)">删除</span>
                  </template>
              </el-table-column>
            </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel2">取 消</el-button>
            <el-button type="primary" @click="submit2">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import DialogBase from "@/components/DialogBase";
export default {
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
      selectedList:[],
      delItem: {}
    };
  },
  watch: {
    data(newValue, oldValue) {
      this.delItem = newValue.delItem;
      //设为可选
      this.skuList.map((item) => {
        if(item.goodsInfo.id == this.delItem.goodsInfo.id) {
          this.$set(item, 'noselected', false);
        }
      });
    }
  },
  methods: {
    selectable(row, index) {
      if(row.noselected == true) {
        return false
      }else{
        return true
      }
    },
    deleteRow(row) {
      this.selectedList.splice(row, 1);
    },
    clearList() {
      this.selectedList = [];
    },
    getRowKeys(row) {
      return row.goodsInfo.id
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
        if(selectedRows.length !== 0) {
          this.selectedList = [].concat(selectedRows);
          this.dialogVisible2 = true;
          this.$nextTick(() => {
            this.skuList.forEach(row => {
              this.$refs.skuTable.toggleRowSelection(row,false);
            });
          })
        }else{
          this.$message({
            message: '请选择商品',
            type: 'warning'
          });
        }
    },
    submit2() {
      if(this.selectedList.length > 0) {
        this.$nextTick(() => {
          this.visible = false;
          this.dialogVisible2 = false;
          this.skuList.map((item) => {
              this.selectedList.map((i) => {
                if(i.goodsInfo.id == item.goodsInfo.id) {
                  this.$set(item, 'noselected', true);
                }
              })
            })
        }); 
        this.$emit('getSelected', this.selectedList);
      }else{
        this.visible = false;
        this.dialogVisible2 = false;
        this.skuList.forEach(row => {
          this.$refs.skuTable.toggleRowSelection(row,false);
        });
      }
    },
    cancel2() {
      this.dialogVisible2 = false;
      this.selectedList = [];
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
          console.error(error);
        });
    },
    getSkuList(startIndex, pageSize) {
      let params = {
        name: this.name,
        productCatalogInfoId: this.categoryValue[this.categoryValue.length - 1],
        startIndex: startIndex,
        pageSize: pageSize,
        productLabelName: this.productLabelName,
        status: 1
      };
      this._apis.client
        .getSkuList(params)
        .then(response => {
          this.skuList = [].concat(response.list);
          this.skuList.map((v) => {
              v.goodsInfo.specs = v.goodsInfo.specs.replace(/{|}|"|"/g,"");
              if(this.selectedList.length > 0) {
                this.selectedList.map(i => {
                  if(i.goodsInfo.id == v.goodsInfo.id) {
                    this.$set(v, 'noselected', true);
                  }
                })
              }
          })
          this.total = response.total;
        })
        .catch(error => {
          console.error(error);
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
    //如果有已选的商品
    if(this.data.selectedList) {
      this.selectedList = [].concat(this.data.selectedList)
    }
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
/deep/ .el-dialog{
    border-radius: 3px;
}
/deep/.el-table__header{
  width: 100% !important;
}
/deep/.el-table__body{
  width: 100% !important;
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
  .clearFont{
    float: right;
    color: #9FA29F;
    font-size: 14px;
    margin-top: 9px;
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


