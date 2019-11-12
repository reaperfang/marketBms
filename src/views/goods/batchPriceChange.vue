<template>
  <div class="app-content batch-price-change">
    <section class="header">
      <el-row type="flex" align="center">
        <el-col :span="12">
          <div class="grid-content header-lefter">
            <el-button @click="$router.push('/goods/addGoods')" type="primary">新建商品</el-button>
            <!-- <el-button @click="$router.push('/goods/batchPriceChange')" class="border-button">批量改价</el-button> -->
          </div>
        </el-col>
        <!-- <el-col :span="12">
          <div class="grid-content header-righter">
            <span @click="renovate" class="span-box pointer">
              <span>刷新</span>
              <i></i>
            </span>
          </div>
        </el-col> -->
      </el-row>
      <div class="search">
        <el-form :inline="true" :model="listQuery" ref="form" class="form-inline">
          <el-form-item label="商品名称：" prop="name">
            <el-input v-model="listQuery.name" placeholder="请输入关键字…"></el-input>
          </el-form-item>
          <el-form-item label="商品状态：" prop="status">
            <el-select v-model="listQuery.status" placeholder="请选择商品状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="上架" :value="1"></el-option>
              <el-option label="下架" :value="0"></el-option>
              <el-option label="售罄" :value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getList" type="primary">查询</el-button>
            <el-button class="fr marL20" @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
    <section>
      <div>
        <el-button @click="moreManageHandler" :type="operateType == 1 ? 'primary' : ''">批量改价</el-button>
        <el-button
          :type="operateType == 2 ? 'primary' : ''"
          @click="isCategory = true; showTableCheck = false; operateType = 2"
        >类目改价</el-button>
      </div>
      <div class="table-header">
        <div :class="{active: listQuery.status === 1}" @click="stateHandler(1)" class="item">出售中</div>
        <div :class="{active: listQuery.status === 0}" @click="stateHandler(0)" class="item">仓库中</div>
        <div :class="{active: listQuery.status === -1}" @click="stateHandler(-1)" class="item">已售罄</div>
      </div>
      <el-table
        v-loading="loading"
        :data="list"
        ref="table"
        :header-cell-style="{color:'#655EFF'}"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-if="operateType == 1" type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="380">
          <template slot-scope="scope">
            <div
              class="ellipsis"
              style="width: 350px;"
              :title="scope.row.goodsInfo.name"
            >{{scope.row.goodsInfo.name}}</div>
            <div class="gray">{{scope.row.goodsInfo.specs | specsFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.goodsInfo.status | statusFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productCatalogInfoName" label="商品分类"></el-table-column>
        <el-table-column prop="stock" label="库存">
          <template slot-scope="scope">
            <span :class="{red: scope.row.goodsInfo.warningStock && (scope.row.goodsInfo.stock <= scope.row.goodsInfo.warningStock)}">{{scope.row.goodsInfo && scope.row.goodsInfo.stock}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="salePrice" label="售卖价（元）">
          <template slot-scope="scope">
            <span>{{scope.row.goodsInfo && scope.row.goodsInfo.salePrice}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <el-button v-if="showTableCheck" @click="checkAllHandler">全选</el-button>
        <span v-if="isCategory">商品分类：</span>
        <el-cascader
          v-if="isCategory"
          v-model="categoryValue"
          :options="categoryOptions"
          @change="handleChange"
          :props="{ multiple: false, checkStrictly: true }"
          clearable
        ></el-cascader>
        <div class="tc">
          <el-button @click="priceChange" v-if="operateType" type="primary">一键改价</el-button>
          <el-button class="border-button" v-if="operateType" @click="complete">完成</el-button>
        </div>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.startIndex"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </section>
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="submit"></component>
  </div>
</template>
<script>
import PriceChangeDialog from "@/views/goods/dialogs/priceChangeDialog";
import Pagination from "@/components/Pagination";

export default {
  data() {
    return {
      formInline: {
        name: "",
        region: ""
      },
      stateiIems: [],
      list: [],
      total: 0,
      listQuery: {
        startIndex: 1,
        pageSize: 20,
        name: "", // 商品名称
        status: "" // 商品状态 0下架,1上架,2售罄
      },
      state: "",
      showTableCheck: false,
      currentDialog: "",
      dialogVisible: false,
      value: "",
      multipleSelection: [],
      categoryOptions: [],
      categoryValue: [],
      isCategory: false,
      operateType: "",
      productCatalogInfoId: "",
      loading: false
    };
  },
  created() {
    this.getList();
    this.getCategoryList();
  },
  filters: {
    statusFilter(val) {
      if (val == 1) {
        return "上架";
      } else if (val == 0) {
        return "下架";
      } else if (val == -1) {
        return "已售馨";
      }
    },
    specsFilter(value) {
      let str = "";

      if (typeof value == "string") {
        value = JSON.parse(value);
      }
      for (let i in value) {
        str += i + ":" + value[i] + ",";
      }

      str = str.replace(/(^.*?)\,$/, "$1");

      return str;
    }
  },
  methods: {
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.getList()
    },
    priceChange() {
      if (!this.multipleSelection.length) {
        this.confirm({
          title: "提示",
          icon: true,
          text: '请选择需要批量改价的商品'
        })
        return
      }
      this.currentDialog = 'PriceChangeDialog'
      this.dialogVisible = true
    },
    renovate() {
      this.getList();
    },
    complete() {
      this.operateType = "";
      this.categoryValue = [];
      this.getList();
    },
    handleChange(value) {
      let arr = [...value];
      this.productCatalogInfoId = arr.pop();

      this.getList({ productCatalogInfoId: this.productCatalogInfoId });
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
    getCategoryList() {
      this._apis.goods
        .fetchCategoryList()
        .then(res => {
          let arr = this.transTreeData(res, 0);

          this.categoryOptions = arr;
        })
        .catch(error => {});
    },
    submit(value) {
      console.log(value);
      this.allUpdatePrice(value);
    },
    allUpdatePrice(params) {
      let _param = {
        operateType: this.operateType,
        changeType: params.changeType,
        markupPrice: params.price
      };

      if (this.operateType == 2) {
        _param.productCatalogInfoId = this.productCatalogInfoId;
      } else if (this.operateType == 1) {
        _param.ids = this.multipleSelection.map(val => val.goodsInfo.id);
      }
      this._apis.goods
        .allUpdatePrice(_param)
        .then(res => {
          if (this.operateType == 1) {
            this.getList();
          } else if (this.operateType == 2) {
            this.getList({ productCatalogInfoId: this.productCatalogInfoId });
          }
          this.visible = false;
          this.$notify({
            title: "成功",
            message: "改价成功！",
            type: "success"
          });
        })
        .catch(error => {
          this.visible = false;
          this.$notify.error({
            title: "错误",
            message: error
          });
        });
    },
    onSubmit() {},
    stateHandler(val) {
            if(this.listQuery.status === val) {
                this.listQuery.status = ''
            } else {
                this.listQuery.status = val
            }

            let param = {status: this.listQuery.status}

            this.getList(param)
        },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checkAllHandler() {
      this.$refs.table.clearSelection();
      this.list.forEach(row => {
        this.$refs.table.toggleRowSelection(row);
      });
    },
    moreManageHandler() {
      this.showTableCheck = true;
      this.isCategory = false;
      this.operateType = 1;
      this.productCatalogInfoId = "";
      this.categoryValue = [];
      this.getList();
    },
    getList(param) {
      this.loading = true;
      let _param;

      _param = Object.assign({}, this.listQuery, param, {
        productCatalogInfoId: this.productCatalogInfoId
      });

      this._apis.goods
        .fetchGoodsList(_param)
        .then(res => {
          this.total = +res.total;
          this.list = res.list;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          // this.$notify.error({
          //     title: '错误',
          //     message: error
          // });
        });
    }
  },
  components: {
    PriceChangeDialog,
    Pagination
  }
};
</script>
<style lang="scss" scoped>
.batch-price-change {
  background-color: #fff;
  padding: 32px 63px;
  section {
    border-bottom: 1px dashed #d3d3d3;
    padding-top: 15px;
    padding-bottom: 22px;
    &:last-child {
      border: none;
    }
  }
  .header {
    .header-righter {
      text-align: right;
      .span-box {
        display: inline-flex;
        align-items: center;
        padding: 7px 13px;
        background: rgb(234, 249, 242);
        color: rgb(178, 230, 209);
        i {
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url(../../assets/images/goods/renovate.png) no-repeat;
          margin-left: 4px;
        }
      }
    }
    .search {
      margin-top: 23px;
    }
  }
  .table-header {
    margin-top: 38px;
  }
  .table-footer {
    margin-top: 43px;
  }
}
.gray {
  color: #92929b;
}
.red {
    color: #FD4C2B;
}
</style>


