<template>
  <DialogBase :visible.sync="visible" width="806px" :showFooter="showFooter" title="添加商品类目">
    <div class="warning-msg" v-if="isWarning">
      <i></i>
      <span>请将类目选择完整</span>
    </div>
    <span class="msgInfo">选择常用类目</span>
    <div>
      <el-cascader
        popper-class="leimu-popper"
        v-model="itemCatText"
        :options="commonCategories"
        :props="{ multiple: false, checkStrictly: true }"
        placeholder="请选择类目"
        clearable
        filterable
      ></el-cascader>
      <span class="deleteBtn">删除</span>
      <div class="category-display">
        <span>您当前选择的是：{{itemCatText}}</span>
        <span class="commonBtn" @click="setCommonCate">设为常用类目</span>
      </div>
      <div class="two-cascader">
        <div class="first-cascader">
          <el-input class="first-input" v-model="firstContent">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchCategory('first')"></i>
          </el-input>
          <div class="cascader-content">
            <div>
              <template v-for="item of firstTpmList">
                <div class="categoryName" @click="showCategoryName(item)">
                  {{item.categoryName}}
                  <i
                    v-if="item.isHasChild"
                    class="el-icon-arrow-right"
                    @click="showSecondLevel(item)"
                  ></i>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="second-cascader" v-if="secondCascader">
          <el-input class="second-input" v-model="secondContent">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="searchCategory('second')"
            ></i>
          </el-input>
          <div class="cascader-content">
            <div>
              <template v-for="item of secondTmpList">
                <div class="categoryName" @click="showSecondName(item)">{{item.categoryName}}</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";
import Zform from "@/components/Form";

export default {
  data() {
    return {
      radio: 0,
      categoryValue: [],
      values: [],
      categoryOptions: [],
      itemCatText: "",
      commonCategories: [],
      showFooter: false,
      itemCatList: [],
      firstTpmList: [],
      secondCascader: false,
      secondItemCatList: [],
      secondTmpList: [],
      firstContent: "",
      secondContent: "",
      commonCat: {},
      isWarning:false
    };
  },
  created() {
    this.getOperateCategoryList();
  },
  watch: {},
  methods: {},
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
  methods: {
    searchCategory(key) {
      let reg,
        arr,
        list = [];
      if (key === "first") {
        list = this.itemCatList;
        reg = new RegExp(this.firstContent);
        arr = [];
        for (var i = 0; i < list.length; i++) {
          if (reg.test(list[i].categoryName)) {
            arr.push(list[i]);
          }
        }
        this.firstTpmList = arr;
        this.secondContent = "";
        this.secondTmpList = [];
        this.secondCascader = false;
      } else if (key === "second") {
        list = this.secondTmpList;
        reg = new RegExp(this.secondContent);
        arr = [];
        for (var i = 0; i < list.length; i++) {
          if (reg.test(list[i].categoryName)) {
            arr.push(list[i]);
          }
        }
        this.secondTmpList = arr;
      }
    },
    showCategoryName(data) {
      this.firstContent = data.categoryName;
      this.itemCatText = data.categoryName;
      this.secondContent = "";
      this.commonCat = data;
      this.showSecondLevel(data);
    },
    showSecondName(data) {
      this.secondContent = data.categoryName;
      let parentCat = this.operateCategoryList.find(
        val => val.id == data.parentId
      );
      parentCat.child = data;
      this.commonCat = parentCat;
      this.itemCatText = parentCat.name + " > " + data.categoryName;
    },
    showSecondLevel(item) {
      if (item.isHasChild) {
        this.secondCascader = true;
        this.secondItemCatList = item.children;
        this.secondTmpList = item.children;
      } else {
        this.secondCascader = false;
      }
      this.itemCatText = item.categoryName;
    },
    setCommonCate() {
      if (this.commonCat && this.commonCat.child) {
        this.isWarning=false;
        
        //调用设置常用类目的接口
      } else {
        this.isWarning=true;
        setTimeout(()=>{
          this.isWarning=false;
        },3*1000);
      }
    },
    submit() {
      if (this.commonCat && this.commonCat.child) {
        //关闭窗口，将值传到添加商品页面
        this.$emit("getGoodCategory", this.commonCat);
        this.visible = false;
        this.isWarning=false;
      } else {
        this.isWarning=true;
        setTimeout(()=>{
          this.isWarning=false;
        },3*1000);
      }
    },
    // 获取商品类目列表
    getOperateCategoryList() {
      return new Promise((resolve, reject) => {
        this._apis.goodsOperate
          .fetchCategoryList({ enable: 1 })
          .then(res => {
            let arr = this.transTreeData(res, 0);
            console.log(arr);
            arr.forEach(val => {
              if (val.children && val.children.length > 0) {
                val.isHasChild = true;
                val.children.forEach(item => (item.children = null));
              } else {
                val.isHasChild = false;
              }
            });
            this.operateCategoryList = res;
            this.itemCatList = arr;
            this.firstCatList = arr;
            this.searchCategory("first");
            resolve(res.list);
          })
          .catch(error => {
            reject(error);
          });
      });
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
    // 获取类目
    getCategoryInfoIds(arr, id) {
      try {
        let parentId = this.operateCategoryList.find(val => val.id == id)
          .parentId;
        arr.unshift(id);
        if (parentId && parentId != 0) {
          this.getCategoryInfoIds(arr, parentId);
        }
      } catch (e) {
        console.error(e);
      }
    },

    itemCatHandleChange(value) {
      let _value = [...value];
      let arr = _value.map(id => {
        return this.operateCategoryList.find(val => val.id == id);
      });
      let secondArr = this.itemCatList.find(val => val.id == arr[0].id);
      if (secondArr && secondArr.children) {
        this.secondCascader = true;
        this.secondItemCatList = secondArr.children;
      }
      // let arr = this.ruleForm.itemCat.map(id => {
      //     return this.operateCategoryList.find(val => val.id == id)
      // })
      this.itemCatText = arr.map(val => val.name).join(" > ");
      // this.ruleForm.productCategoryInfoId = _value.pop()
      // this.getSpecsList()

      // this.$nextTick(() => {
      //     setTimeout(() => {
      //         this.$refs.fenleiCascader.toggleDropDownVisible(false)
      //         this._globalEvent.$emit('addGoodsEvent', false);
      //     }, 10000)
      // })
    }
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  components: {
    DialogBase,
    Zform
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog {
  height: 619px;
  .el-dialog__title {
    font-size: 22px;
    color: rgba(68, 67, 75, 1);
  }
  .el-icon-search {
    width: 32px;
    background: rgba(146, 146, 155, 0.2);
  }
  .el-input__suffix {
    right: 1px;
  }
  .el-icon-arrow-right {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .el-button--small {
    width: 80px;
    height: 34px;
    border-radius: 4px;
  }
  .el-button + .el-button {
    margin-left: 30px;
  }
}
.warning-msg {
  display:flex;
  align-items: center;
  position:absolute;
  top:0px;
  left:203px;
  width: 400px;
  height: 54px;
  background: rgba(253, 147, 43, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(253, 147, 43, 1);
  i{
    display: inline-block;
    width:32px;
    height:32px;
    background:url('../../../assets/images/goods/warning-icon.png');
    margin-left:80px;
    margin-right:16px;
  }
  span{
    font-size:18px;
    color:rgba(68,67,75,1);
  }
}
.msgInfo {
  display: inline-block;
  margin: 8px 22px 0 24px;
  font-size: 18px;
  color: rgba(68, 67, 75, 1);
  float: left;
  & + div {
    float: left;
  }
}

.first-cascader,
.second-cascader {
  float: left;
  .first-input,
  .second-input {
    width: 210px;
  }
  .cascader-content {
    overflow-y: auto;
    padding-top: 18px;
    width: 210px;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(208, 214, 228, 1);
    border-top: none;
    height: 290px;
    &::-webkit-scrollbar-thumb {
      background: rgba(210, 210, 220, 1) !important;
    }
    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
      border-radius: 4px;
    }
    .categoryName {
      position: relative;
      height: 34px;
      line-height: 34px;
      color: rgba(21, 30, 55, 1);
      font-size: 14px;
      padding-left: 20px;
      &:hover {
        background: rgba(246, 247, 250, 1);
      }
    }
  }
}
.category-display {
  &:first-child {
    display: inline-block;
    font-size: 14px;
    color: rgba(68, 67, 75, 1);
  }
  margin-bottom: 10px;
}
.deleteBtn,
.commonBtn {
  display: inline-block;
  width: 80px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(146, 146, 155, 1);
  font-size: 14px;
  color: rgba(68, 67, 75, 1);
  margin-left: 14px;
  &:hover {
    color: rgba(101, 94, 255, 1);
    border: 1px solid rgba(101, 94, 255, 1);
    cursor: pointer;
  }
}
.commonBtn {
  width: 114px;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  margin-top: 10px;
}

.footer {
  text-align: center;
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}
</style>


