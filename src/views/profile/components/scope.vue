<template>
   <div class="scope">
     <steps class="steps" :step="step"></steps>
     <div class="content">
      <p>请选择您经营的类目</p>
      <!-- <el-form ref="form" :model="form" :rules="rules"> -->
      <el-cascader
        class="cascader"
        :options="itemCatList"
        v-model="form.business"
        @change="itemCatHandleChange"
        clearable
        filterable
        popper-class="scope-cascader-popper"
      ></el-cascader>
      <!-- </el-form> -->
      <div class="btn">
        <!-- <el-button class="prev">上一步</el-button> -->
        <el-button class="next" type="primary" :loading="loading" @click="submit()" :disabled="isDisabled">下一步</el-button>
      </div>
     </div>
   </div>
</template>

<script>
import Steps from './steps'
export default {
  props: {
    step: {
      type: Number,
      default: 1
    }
  },
  components: {
    Steps
  },

  data () {
    return {
      form: {
        business: [],
        sellCategoryId: null,
        sellCategory: null
      },
      itemCatList: [],
      operateCategoryList: [],
      loading: false
    }
  },

  computed: {
    isDisabled() {
      const business = this.form.business
      return  business && business.length <= 0 ? true : false
    },
    cid() {
      let shopInfo = this.$store.getters.shopInfos;
      return shopInfo.id;
    }
  },

  watch: {},

  created() {
    Promise.all([this.getOperateCategoryList()]).then(() => {
      this.getShopInfo();
    });
  },

  mounted() {},

  methods: {
    updateStep() {
      const cid = this.cid;
      const step = 2
      return new Promise((resolve, reject) => {
        this._apis.shop
          .updateStep({ cid, step })
          .then(response => {
            setTimeout(() => {
              this.$emit('getStep', step)
            }, 500)
            resolve(response)
          }).catch((err) => {
            console.error(err);
            reject(err)
          })
      })
    },
    updateShopInfo() {
      let id = this.cid
      // if (this.tempSendAddress !== this.form.sendAddress) {
      //   deliverServiceRadius = ''
      // }
      let data = {
        id:id,
        sellCategoryId: this.form.sellCategoryId,
        sellCategory: this.form.sellCategory
      }
      return new Promise((resolve, reject) => {
        this._apis.shopInfo.updateShopInfo(data).then(response =>{
          this.$store.dispatch('getShopInfo');  
          // // 需要同步调用步骤接口
          // this.$message.success("保存成功！");
          resolve(response)
        }).catch(error =>{
          console.error(error);
          reject(error)
        })
      })
      
    },
    submit() {
      if (!this.isDisabled) {
        const p1 = this.updateShopInfo()
        const p2 = this.updateStep()
        // .then(response => {
        //   this.$emit('getStep', step)
        // }).catch((err) => {
        //   console.log(err)
        // })
        Promise.all([p1, p2]).then((res) => {
          this.$message.success("保存成功！");
          
          // location.reload()
        }).catch(() => {
          this.$message.error('保存失败');
        })
      }
    },
    // 获取类目
    getCategoryInfoIds(arr, id) {
      try {
        // console.log('--getCategoryInfoIds--', this.operateCategoryList.find(val => val.id == id))
        let parentId
        let parentIds = this.operateCategoryList.find(val => val.id == id)
        if (!parentIds) {
          return false
        }
        parentId = parentIds.parentId
        arr.unshift(id + "");

        if (parentId && parentId != 0) {
          this.getCategoryInfoIds(arr, parentId);
        }
      } catch (e) {
        console.error(e);
      }
    },
    getShopInfo() {
      this.$store.dispatch('getShopInfo').then(response => {
          let itemCatAr = [];

          this.getCategoryInfoIds(itemCatAr, response.sellCategoryId);
          
          this.form.business = itemCatAr
          
        })
        .catch(error => {
          this.$message.error('查询失败');
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
    // 获取商品类目列表
    getOperateCategoryList() {
      return new Promise((resolve, reject) => {
        this._apis.goodsOperate
          .fetchCategoryList({ enable: 1 })
          .then(res => {
            let arr = this.transTreeData(res, 0);
            this.operateCategoryList = res;
            this.itemCatList = arr;
            resolve(res.list);
          })
          .catch(error => {
            console.error(error)
            // this.$message.error(error);
            reject(error);
          });
      });
    },
    itemCatHandleChange(value) {
      // console.log(value)
      let _value = [...value];
      let arr = this.form.business.map(id => {
        return this.operateCategoryList.find(val => val.id == id);
      });

      // this.itemCatText = arr.map(val => val.name).join(" > ");
      this.form.sellCategoryId = _value.pop();
      this.form.sellCategory = arr[arr.length - 1].name;
      // console.log('---itemCatHandleChange---')
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.scope {
  padding: 15px 15px 15px 30px;
  background-color: #fff;
  .content {
    padding-top: 42px;
    padding-left: 13px;
    p {
      padding-bottom: 21px;
      font-size:16px;
      font-weight:500;
      color:rgba(68,67,75,1);
      line-height:22px;
    }
    .cascader {
      margin-left: 30px;
      width: 210px;
      height: 34px;
    }
    .btn {
      padding-top: 390px;
      text-align: center;
      .prev {
        margin-right: 45px;
      }
    }
  }
  
}
</style>