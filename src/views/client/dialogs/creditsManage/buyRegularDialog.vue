<template>
  <div>
    <DialogBase :visible.sync="visible" @submit="submit" title="购买商品获取积分规则" :hasCancel="hasCancel" :showFooter="false"> 
      <div class="c_container">
        <div class="clearfix">
          <span class="fl marR20 marB20">购买商品获取积分规则</span>
          <el-switch class="fl" v-model="enable" active-color="#66CCAC"></el-switch>
        </div>
        <div v-if="enable" class="giveBottom">
          <div>购买获得积分，订单售后结束后按规则发放积分</div>
          <div>
            <span>赠送积分的商品：</span>
            <el-radio v-model="isAllProduct" label="0">全部商品</el-radio>
            <el-radio v-model="isAllProduct" label="1" @change="showDialog">指定商品</el-radio>
            <el-button style="margin-left: 10px" @click="dialogVisible2 = true" v-if="selectedList.length !== 0">查看已选商品</el-button>
          </div>
          <!-- <div class="proList">
            <ul v-if="selectedList.length !== 0">
              <li v-for="item in selectedList" :key="item.goodsInfo.id" class="proList"><span>{{item.goodsInfo.name}}</span><span>{{item.goodsInfo.specs}}</span><span>{{item.goodsInfo.stock}}</span><span class="pointer" style="color: #FD4C2B;" @click="handleClick(item)">删除</span></li>
            </ul>
          </div> -->
          <div>
            <span>是否区分人群发放：</span>
            <el-radio v-model="distinguish" label="0">不区分</el-radio>
            <el-radio v-model="distinguish" label="1">区分</el-radio>
          </div>
          <div v-if="distinguish == '0'">
            <span>每消费</span>
            <div class="input_wrap">
              <el-input v-model="payAmount1" :disabled="true"></el-input>
            </div>
            <span>元 获得</span>
            <div class="input_wrap">
              <el-input v-model="allMember" @keyup.native="checkZero($event,allMember,'allMember')" :maxLength="10"></el-input>
            </div>
            <span>积分</span>
          </div>
          <div v-if="distinguish == '1'">
            <div class="marB10">
              <span>每消费&nbsp;&nbsp;&nbsp;</span>
              <div class="input_wrap2" style="margin-left:14px">
                <el-input placeholder="请输入整数" v-model="payAmount" :disabled="true" @keyup.native="checkZero($event,payAmount,'payAmount')"></el-input>
              </div>
              <span>元 获得</span>
            </div>
            <div class="marB10">
              <span>用户获得</span>
              <div class="input_wrap2" style="margin-left:14px">
                <el-input placeholder="请输入整数，不输入则不发放" v-model="noMember" @keyup.native="checkZero($event,noMember,'noMember')"></el-input>
              </div>
              <span>积分</span>
            </div>
            <div class="marB10">
              <span>新会员获得</span>
              <div class="input_wrap2">
                <el-input placeholder="请输入整数，不输入则不发放" v-model="newMember" @keyup.native="checkZero($event,newMember,'newMember')"></el-input>
              </div>
              <span>积分</span>
            </div>
            <div class="marB10">
              <span>老会员获得</span>
              <div class="input_wrap2">
                <el-input placeholder="请输入整数，不输入则不发放" v-model="oldMember" @keyup.native="checkZero($event,oldMember,'oldMember')"></el-input>
              </div>
              <span>积分</span>
            </div>
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
    <el-dialog :visible.sync="otherVisible" width="40%" title="选择商品">
      <div class="dialog-container">
        <div class="c_container">
          <div class="marB20">
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
            style="width: 100%"
            ref="skuTable"
            :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
            :default-sort="{prop: 'date', order: 'descending'}"
            :row-key="getRowKeys"
          >
            <el-table-column type="selection" prop="choose" label="选择" :reserve-selection="true" :selectable="selectable"></el-table-column>
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
      </div>
      <span class="dialog-footer fcc">
        <el-button type="primary" @click="submit2">确 认</el-button>
        <el-button @click="otherVisible = false">取 消</el-button>
      </span>
    </el-dialog>
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
                :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
                :default-sort="{prop: 'date', order: 'descending'}"
            >
                <!-- <el-table-column prop="goodsInfo.id" label="SKU"></el-table-column> -->
                <el-table-column prop="goodsInfo.name" label="商品名称"></el-table-column>
                <el-table-column prop="goodsInfo.specs" label="规格" width="300"></el-table-column>
                <el-table-column prop="goodsInfo.salePrice" label="商品价格"></el-table-column>
                <el-table-column prop="goodsInfo.stock" label="商品库存"></el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                      <span class="edit_span pointer" @click="deleteRow(scope.row)">删除</span>
                  </template>
              </el-table-column>
            </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="submit3">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import DialogBase from "@/components/DialogBase";
export default {
  props: ["data"],
  name: "buyRegularDialog",
  data() {
    return {
      hasCancel: true,
      enable: false,
      isAllProduct: "0",
      distinguish: "0",
      otherVisible: false,
      categoryOptions: [],
      categoryValue: [],
      productLabelName: "",
      name: "",
      skuList: [],
      payAmount1: "1",
      payAmount: "1",
      allMember: "0",
      noMember: "0",
      newMember: "0",
      oldMember: "0",
      selectProducts: [],
      isAllProduct: null,
      distinguish: null,
      total: 0,
      pageSize: 10,
      startIndex: 1,
      btnLoading: false,
      dialogVisible2: false,
      selectedList: []
    };
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
      //删除的设为可选
      this.skuList.map((item) => {
        if(item.goodsInfo.id == row.goodsInfo.id) {
          this.$set(item, 'noselected', false);
        }
      });
    },
    checkZero(event,val,ele) {
      val = val.replace(/[^\d]/g,'');
      val = val.replace(/^0/g,'');
      this[ele] = val;
    },
    getRowKeys(row) {
      return row.id
    },
    handelSelect(val,row) {
      this.selections.push(row);
    },
    handleSizeChange(val) {
      this.getSkuList(1, val);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.getSkuList(val, this.pageSize);
    },
    submit() {
      this.btnLoading = true;
      let params;
      if (this.enable) {
        if(this.selectedList.length > 0) {
          this.selectedList.map(v => {
            let obj = {};
            obj.id = v.goodsInfo.id;
            obj.name = v.goodsInfo.name;
            this.selectProducts.push(obj);
          });
        }
        params = { 
            id: this.data.row.id,
            enable: this.enable,
            sceneRule: {
              isAllProduct: this.isAllProduct == "0" ? true : false,
              selectProducts: this.selectProducts,
              distinguish: this.distinguish == "0" ? false : true,
              noDistinguish: {
                payAmount: this.payAmount1,
                allMember: this.allMember
              },
              yesDistinguish: {
                payAmount: this.payAmount,
                noMember: this.noMember,
                newMember: this.newMember,
                oldMember: this.oldMember
              }
            }
          };
      }else{
        params = {
          id: this.data.row.id,
          enable: this.enable,
        }
      }
      if (this.enable && !params.sceneRule.isAllProduct && this.selectedList.length == 0) {
        this.btnLoading = false;
        this.$message({
          message: '请选择指定产品',
          type: 'warning'
        });
      } else {
        this._apis.client
          .editCreditRegular(params)
          .then(response => {
            this.btnLoading = false;
            this.visible = false;
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.$emit('refreshPage')
          })
          .catch(error => {
            this.btnLoading = false;
            this.visible = false;
            console.log(error);
          });
      }
    },
    showDialog(val) {
      if (val == 1) {
        this.otherVisible = true;
        if(this.skuList.length == 0) {
          this.getSkuList(this.startIndex, this.pageSize);
        }
      }else{
        this.selectProducts = [];
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
          this.skuList.map(v => {
            v.goodsInfo.specs = v.goodsInfo.specs.replace(/{|}|"|"/g, "");
            if(this.selectedList.length > 0) {
              this.selectedList.map(i => {
                if(i.goodsInfo.id == v.goodsInfo.id) {
                  this.$set(v, 'noselected', true);
                }
              })
            }
          });
          this.total = response.total;
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
    },
    submit2() {
      let selections = this.$refs.skuTable.selection;
      if(selections.length !== 0) {
        this.dialogVisible2 = true;
        this.selectedList = this.selectedList.concat(selections);
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
    getInfo() {
      let row = this.data.row;
      if (row.sceneRule.length > 0) {
        let sceneRule = JSON.parse(row.sceneRule);
        this.enable = row.enable == '启用' ? true:false;
        this.isAllProduct = sceneRule.isAllProduct ? "0" : "1";
        this.distinguish = sceneRule.distinguish ? "1" : "0";
        //this.payAmount1 = sceneRule.noDistinguish.payAmount;
        this.allMember = sceneRule.noDistinguish.allMember || 0;
        this.oldMember = sceneRule.yesDistinguish.oldMember || 0;
        this.newMember = sceneRule.yesDistinguish.newMember || 0;
        this.noMember = sceneRule.yesDistinguish.noMember || 0;
        let ids = [];
        sceneRule.selectProducts.map(i => {
          ids.push(i.id);
        });
        //this.payAmount = sceneRule.yesDistinguish.payAmount;
        this._apis.client.getSkuList({status: 1, ids: ids, startIndex:1, pageSize: this.pageSize}).then((response) => {
          this.selectedList = response.list;
          this.selectedList.map(item => {
            item.goodsInfo.specs = item.goodsInfo.specs.replace(/{|}|"|"/g, "");
          })
        }).catch((error) => {
          console.log(error);
        })
      }
    },
    clearList() {
      this.selectedList = [];
    },
    submit3() {
      this.$nextTick(() => {
        this.otherVisible = false;
        this.dialogVisible2 = false;
        this.skuList.map((item) => {
          this.selectedList.map((i) => {
            if(i.goodsInfo.id == item.goodsInfo.id) {
              this.$set(item, 'noselected', true);
            }
          })
        })
      }); 
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
    this.getInfo();
    this.getProductClass();
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
/deep/ .el-dialog {
  border-radius: 10px;
}
/deep/ .el-dialog__header {
  background: #f1f0ff;
  border-radius: 10px 10px 0 0;
}
/deep/ .el-dialog__title {
  color: #44434b;
}
.c_container {
  .marL10 {
    margin-left: 10px;
  }
  .input_wrap {
        width: 150px;
        display: inline-block;
      }
      .input_wrap2 {
        width: 174px;
        display: inline-block;
      }
  .giveBottom {
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
  .marR20 {
    margin-right: 20px;
  }
  .marB20 {
    margin-bottom: 20px;
  }
  .page_styles {
    overflow-x: auto;
    text-align: center;
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
  .proList{
    ul li{
      margin-bottom: 10px;
      span{
        margin-right: 20px;
      }
    }
  }
}
.dialog-footer{
    margin-top: 20px;
}
</style>


