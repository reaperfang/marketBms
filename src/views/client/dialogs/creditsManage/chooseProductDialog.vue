<template>
  <DialogBase :visible.sync="visible" @submit="submit" title="选择商品" :hasCancel="hasCancel">
    <div class="c_container">
      <div>
        <div class="input_wrap">
          <el-cascader :options="categoryOptions" v-model="categoryValue" clearable></el-cascader>
        </div>
        <div class="input_wrap">
          <el-input placeholder="输入商品标签" v-model="productLabelName"></el-input>
        </div>
        <div class="input_wrap2">
          <el-input placeholder="输入商品名称" v-model="name"></el-input>
        </div>
        <el-button type="primary" class="marL10" @click="handleSearch">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
      <el-table
        :data="skuList"
        style="width: 100%"
        ref="skuTable"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="selection" prop="choose" label="选择"></el-table-column>
        <el-table-column prop="goodsInfo.id" label="SKU"></el-table-column>
        <el-table-column prop="goodsInfo.name" label="商品名称"></el-table-column>
        <el-table-column prop="goodsInfo.specs" label="规格"></el-table-column>
        <el-table-column prop="goodsInfo.salePrice" label="商品价格"></el-table-column>
        <el-table-column prop="goodsInfo.stock" label="商品库存"></el-table-column>
      </el-table>
    </div>
  </DialogBase>
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
      skuList: JSON.parse(localStorage.getItem('skuList')) || []
    };
  },
  methods: {
    submit() {
        let selection = this.$refs.skuTable.selection;
        let selectedIds = [];
        selection.map((v) => {
            selectedIds.push(v.goodsInfo.id);
        });
        selectedIds = selectedIds.join(',');
        this.$emit('getSelected', selectedIds);
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
          // this.$notify.error({
          //   title: "错误",
          //   message: error
          // });
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
        })
        .catch(error => {
          console.log(error);
          // this.$notify.error({
          //   title: "错误",
          //   message: error
          // });
        });
    },
    handleSearch() {
        this.getSkuList(1,10);
    },
    reset() {
        this.categoryValue = [];
        this.productLabelName = "";
        this.name = "";
        this.getSkuList(1,10);
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
    let productInfoIds = this.data.productInfoIds.split(',');
    this.$nextTick(() => {
        if(productInfoIds.length > 0) {
            productInfoIds.map((v) => {
                this.skuList.forEach(row => {
                    if(row.goodsInfo.id == v) {
                        this.$refs.skuTable.toggleRowSelection(row);
                    }
                })
            })
        }
    })
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
}
</style>


