<template>
  <DialogBase :visible.sync="visible" width="806px" :showFooter="showFooter" title="添加商品类目">
    <div class="warning-msg" v-if="isWarning">
      <i></i>
      <span>请将类目选择完整</span>
    </div>
    <span class="msgInfo">选择常用类目</span>
    <div>
      <el-select v-model="commonValue" @change="itemCatHandleChange" clearable placeholder="请选择">
        <el-option
          v-for="item in commonCategories"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="deleteBtn" @click="delCommonCate()">删除</span>
      <div class="category-display">
        <span>您当前选择的是：{{itemCatText}}</span>
        <span class="commonBtn" @click="setCommonCate">设为常用类目</span>
      </div>
      <div class="two-cascader">
        <div class="first-cascader ">
          <el-input class="first-input tip" v-model="firstContent">
            <i slot="prefix" class="inner"></i>
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchCategory('first')"></i>
          </el-input>
          <div class="cascader-content">
            <div>
              <template v-for="item of firstTpmList">
                <div class="categoryName" @click="showCategoryName(item)">
                  {{item.name}}
                  <!-- <i
                    v-if="item.isHasChild"
                    class="el-icon-arrow-right"
                    @click="showSecondLevel(item)"
                  ></i>-->
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
                <div class="categoryName" @click="showSecondName(item)">{{item.name}}</div>
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
      itemCatText: "", //当前所选类目
      commonCategories: [], //常用类目
      showFooter: false,
      itemCatList: [],
      firstTpmList: [],
      secondCascader: false,
      secondItemCatList: [], //二级级联框
      secondTmpList: [],
      firstContent: "", //一级级联框输入的内容
      secondContent: "", //二级级联框输入内容
      commonCat: {}, //记录级联列表中选中的对象
      commonValue: "", //常用类目下拉框中当前内容
      isWarning: false,
      currentCategory: {}, //当前选中的类目
      operateCategoryList: [], //后台获取的所有类目
      submitCat:{}//最终选择的类目
    };
  },
  created() {
    this.getOperateCategoryList();
  },
  watch: {},
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },
  },
  methods: {
    //查询常用类目
    getCommonCategoryList() {
      this.commonCategories = [];
      this._apis.goods
        .getProCommonCategory({ cid: this.cid })
        .then((res) => {
          if (res && res.length > 0) {
            res.forEach((item, index) => {
              let temp = this.operateCategoryList.find(
                (data) => data.id === item.productCategoryInfoId
              );
              let _temp = JSON.parse(JSON.stringify(temp));
              if (_temp.parentId && _temp.parentId > 0) {
                let parentTemp = this.operateCategoryList.find(
                  (data) => data.id === _temp.parentId
                );
                let _parentTemp = JSON.parse(JSON.stringify(parentTemp));
                _parentTemp.child = _temp;
                let elem = {
                  value: _temp.id,
                  label: `${_parentTemp.name}->${_temp.name}`,
                };
                this.commonCategories.push(elem);
              }
            });
          }
        })
        .catch((err) => {});
    },
    searchCategory(key) {
      let reg,
        arr,
        list = [];
      if (key === "first") {
        list = this.itemCatList;
        reg = new RegExp(this.firstContent);
        arr = [];
        for (var i = 0; i < list.length; i++) {
          if (reg.test(list[i].name)) {
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
          if (reg.test(list[i].name)) {
            arr.push(list[i]);
          }
        }
        this.secondTmpList = arr;
      }
    },
    showCategoryName(data) {
      this.firstContent = data.name;
      this.itemCatText = data.name;
      this.secondContent = "";
      this.commonCat = data;
      this.submitCat = data;
      this.showSecondLevel(data);
    },
    showSecondName(data) {
      this.currentCategory = data;
      this.secondContent = data.name;
      let parentCat = this.operateCategoryList.find(
        (val) => val.id == data.parentId
      );
      parentCat.child = data;
      this.commonCat = parentCat;
      this.submitCat = parentCat;
      this.itemCatText = parentCat.name + " > " + data.name;

    },
    showSecondLevel(item) {
      if (item.isHasChild) {
        this.secondCascader = true;
        this.secondItemCatList = item.children;
        this.secondTmpList = item.children;
      } else {
        this.secondCascader = false;
      }
      this.itemCatText = item.name;

    },
    setCommonCate() {
      if (this.commonCat && this.commonCat.child) {
        this.isWarning = false;
        let data = {
          cid: this.cid,
          productCategoryInfoId: this.currentCategory.id,
        };
        this._apis.goods
          .addProCommonCategory(data)
          .then((res) => {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.getCommonCategoryList();
          })
          .catch((err) => {
            this.$message({
              message: err,
              type: "error",
            });
          });
        //调用设置常用类目的接口
      } else {
        this.isWarning = true;
        setTimeout(() => {
          this.isWarning = false;
        }, 3 * 1000);
      }
    },
    delCommonCate() {
      this._apis.goods
        .delProCommonCategory({
          cid: this.cid,
          productCategoryInfoId: this.commonValue,
        })
        .then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.commonValue = ''
          this.getCommonCategoryList();
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: "error",
          });
        });
    },
    submit() {
        if(this.submitCat && this.submitCat.child){
        //关闭窗口，将值传到添加商品页面
        this.$emit("getProductCategoryInfoId", this.submitCat)//this.commonCat);
        this.visible = false;
        this.isWarning = false;
      } else {
        this.isWarning = true;
        setTimeout(() => {
          this.isWarning = false;
        }, 3 * 1000);
      }
    },
    // 获取商品类目列表
    getOperateCategoryList() {
      return new Promise((resolve, reject) => {
        this._apis.goodsOperate
          .fetchCategoryList({ enable: 1 })
          .then((res) => {
            let arr = this.transTreeData(res, 0);
            console.log(arr);
            arr.forEach((val) => {
              if (val.children && val.children.length > 0) {
                val.isHasChild = true;
                val.children.forEach((item) => (item.children = null));
              } else {
                val.isHasChild = false;
              }
            });
            this.operateCategoryList = res;
            this.itemCatList = arr;
            this.firstCatList = arr;
            this.getHistoryProductCategory(this.data)
            this.searchCategory("first");
            this.getCommonCategoryList(); //获取常用类目
            resolve(res.list);
          })
          .catch((error) => {
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
            // categoryName: data[i].name,
            name: data[i].name,
            id: data[i].id,
            parentId: data[i].parentId,
            level: data[i].level,
            sort: data[i].sort,
            image: data[i].image,
            enable: data[i].enable,
            label: data[i].name,
            value: data[i].id,
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
        let parentId = this.operateCategoryList.find((val) => val.id == id);
        arr.unshift(id);
        if (parentId && parentId != 0) {
          this.getCategoryInfoIds(arr, parentId);
        }
      } catch (e) {
        console.error(e);
      }
    },

    itemCatHandleChange(value) {
      let temp = this.operateCategoryList.find((data) => data.id === value);
      if (temp&&temp.parentId && temp.parentId > 0) {
        let parentTemp = this.operateCategoryList.find(
          (data) => data.id === temp.parentId
        );
        parentTemp.child = temp;
        this.submitCat = parentTemp;
      }
    },
    getHistoryProductCategory(id){//获取历史类目
      if(id){
          let category = this.operateCategoryList.find(val =>val.id == id);
          if(category && category.parentId!=0){
              let parentCat = this.operateCategoryList.find(val => val.id == category.parentId);
              parentCat.child = category;
              this.commonCat = parentCat;
              this.itemCatText = parentCat.name + " > " + category.name;
              this.currentCategory = category;
          }else{
            this.itemCatText ='';
            this.commonCat={};
          }
       }else{
         this.itemCatText ='';
         this.commonCat={};
      }
    }
    
  },

  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    DialogBase,
    Zform,
  },
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
  .el-input__prefix{
    top:-12px;
    left:30px;
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
  display: flex;
  align-items: center;
  position: absolute;
  top: 0px;
  left: 203px;
  width: 400px;
  height: 54px;
  background: rgba(253, 147, 43, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(253, 147, 43, 1);
  i {
    display: inline-block;
    width: 32px;
    height: 32px;
    background: url("../../../assets/images/goods/warning-icon.png");
    margin-left: 80px;
    margin-right: 16px;
  }
  span {
    font-size: 18px;
    color: rgba(68, 67, 75, 1);
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
/* 提示框小角的小方块 */
.inner{
display:inline-block;
background-color:#FFF;
width:10px;
height:10px;
border:1px solid rgba(208,214,228,1);
/* 旋转小方块并调整位置形成尖角 */
position: relative;
left:30%;
top:6px;
transform:rotate(45deg);
border-right:0px;
border-bottom:0px;
}
/deep/ .el-input__inner:focus +.el-input__prefix .inner {
  border:1px solid #655EFF;
  border-right:0px;
  border-bottom:0px;
}
/deep/ .el-input__inner:hover +.el-input__prefix .inner {
  border:1px solid #B6B5C8;
  border-right:0px;
  border-bottom:0px;
}
.first-cascader,
.second-cascader {
  float: left;
  .first-input,
  .second-input {
    width: 210px;
    border-bottom: none;
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
.second-cascader .cascader-content {
  border-left: none;
}
.category-display {
  &:first-child {
    display: inline-block;
    font-size: 14px;
    color: rgba(68, 67, 75, 1);
  }
  margin-bottom: 15px;
  margin-top:15px;
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


