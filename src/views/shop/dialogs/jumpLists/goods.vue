<template>
  <div class="head-wrapper">
       <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :inline="true" style="overflow-y: initial;">
          <div class="inline-head">
            <el-form-item label="商品状态" prop="status">
              <el-select label="商品状态" v-model="ruleForm.status" placeholder="请选择商品状态" style="width:120px;">
                <el-option label="全部" :value="null"></el-option>
                <el-option label="上架" :value="1"></el-option>
                <el-option label="下架" :value="0"></el-option>
                <el-option label="售罄" :value="-1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属分类" prop="name">
              <treeselect
                style="width:150px"
                :multiple="false"
                :options="categoryData"
                :normalizer="normalizer"
                :clearable="false"
                placeholder="请选择分类"
                v-model="seletedClassify"></treeselect>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入名称" clearable style="width:120px;"></el-input>
            </el-form-item>
            <!-- <el-form-item label="" prop="id">
              <el-input v-model="ruleForm.id" placeholder="请输入编码"></el-input>
            </el-form-item> -->
            <el-form-item label="" prop="">
              <el-button type="primary" @click="search">搜  索</el-button>
            </el-form-item>
          </div>
          <div class="inline-head">
          </div>
        </el-form>
        <el-table :data="tableData" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
          <el-table-column prop="" label="选择" :width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.active" :disabled="scope.row.status !== 1" @change="seletedChange(scope.row, scope.row.active)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名称" :width="500">
            <template slot-scope="scope">
              <div class="name_wrapper">
                <img :src="scope.row.mainImage" alt="失败" />
                <p>{{scope.row.name}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="productCatalogInfoName" label="所属分类"></el-table-column>
          <el-table-column prop="saleCount" label="总销量">
            <template slot-scope="scope">
              <span>{{scope.row.saleCount}}&nbsp;{{scope.row.productUnit}}</span>
            </template>
          </el-table-column>
        </el-table>
      <div class="pagination">
        <el-pagination
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(startIndex) || 1"
          :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
          :page-size="pageSize*1"
          :total="total*1"
          layout="prev, pager, next, sizes"
          >
        </el-pagination>
      </div>
  </div>
</template>

<script>
import tableBase from '@/components/TableBase';
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: "goods",
  extends: tableBase,
  components: { Treeselect },
  props: {
     
  },
  data() {
    return {
      pageSize: 5,
      ruleForm: {
        name: '',
        // id: '',
        status: null,
      },
      rules: {},
      invalid: true,  //数据是否无效
      goodsClassifyList: [],
      tableData: [],
      currentClassifyId: [],
      categoryData: [{
          "id": "",
          "name": "全部",
      }],
      seletedClassify: '',
      normalizer(node) {
        return {
          label: node.name,
          children: node.childrenCatalogs,
        }
      },
    };
  },
  created() {
    this.getGoodsClassifyList();
    this.fetch();
  },
  watch: {
    multiple(newValue) {
      if (newValue) {
        this.seletedClassify = this.seletedClassify ? [ this.seletedClassify ] : []
      } else {
        this.seletedClassify = this.seletedClassify[0]
      }
    },
  },
  methods: {
    search() {
      this.startIndex = 1;
      this.ruleForm.startIndex = 1;
      this.fetch();
    },
    /* 获取分类列表 */
    getGoodsClassifyList() {
      this._apis.goods.fetchTreeCategoryList({
        enable: '1'
      }).then((response)=>{
        this.filterEnableData(response);
        response = [...this.categoryData, ...response];
        this.categoryData = response;
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    //过滤掉禁用的数据
    filterEnableData(data) {
      data.forEach((item, index) => {
        if(item.enable === 0){
          data.splice(index, 1);
        }else if(item.childrenCatalogs){
          this.filterEnableData(item.childrenCatalogs)
        }
        if(!item.childrenCatalogs || item.childrenCatalogs.length == 0){
          delete item.childrenCatalogs;
        }
      })
    },

    //根据ids拉取数据
    fetch() {
      this.loading = true;
      let params = {};
      if(this.seletedClassify && typeof this.seletedClassify === 'string') {
        params = Object.assign(this.ruleForm, {
          productCatalogInfoId: this.seletedClassify || ''
        })
      }else{
        params = this.ruleForm;
        if(!!params.productCatalogInfoId) {
          delete params.productCatalogInfoId;
        }
      }
      this._apis.goods.fetchSpuGoodsList(params).then((response)=>{
        this.tableData = response.list;
        this.total = response.total;
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

     /* 选中改变 */
    seletedChange(data, state) {

      /* 更改列表选中状态 */
      const tempList = [...this.tableData];
      for(let item of tempList) {
        if(item.id !== data.id) {
          item.active = false;
        }
      }
      this.tableData = tempList;

      let shopInfo = this.$store.getters.shopInfos
      let cid = shopInfo && shopInfo.id || ''

      if(state) {
        /* 向父组件发送选中的数据 */
        this.$emit('seletedRow',  {
          pageType: 'goods',
          typeName: '商品详情',
          id: 5,
          data: {
            id: data.id,
            name: data.name,
            mainImage: data.mainImage
          },
          cid
        });
        this.$emit('invalidChange', false)
      }else {
        /* 向父组件发送选中的数据 */
        this.$emit('seletedRow',  null);
        this.$emit('invalidChange', true)
      }

    },


    transTreeData(data, pid) {
      var result = [], temp;
      for (var i = 0; i < data.length; i++) {
          if (data[i].parentId == pid) {
              var obj = {
                label: data[i].name,
                id: data[i].id, 
                parentId: data[i].parentId, 
                level: data[i].level, 
                sort: data[i].sort, 
                image: data[i].image, 
                enable: data[i].enable, 
                goods: (data[i].goods || [])
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

     flatTreeArray(array = [], childrenKey = 'children') {
      var result = [];
      let flat = (array = {}, childrenKey, floor) => {
          array.forEach(item => {
          let dataItem = {
              floor: floor,
              name: item.categoryName,
              id: item.id,
              parentId: item.parentId,
          }
          result.push(dataItem);

          let childrenArr;
          if (item.hasOwnProperty(childrenKey)) {
              childrenArr = item[childrenKey];
              delete item[childrenKey];
          }
          if (childrenArr && childrenArr.length > 0) {
              flat(childrenArr, childrenKey, floor + 1)
          }
          });
      }
      flat(array, childrenKey, 1);
      return result;
    },

  }
};
</script>

<style lang="scss" scoped>
.inline-head{
  justify-content: flex-start!important;
}
.name_wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    display: block;
    margin-right: 10px;
    border: 1px solid #ddd;
    object-fit: contain;
  }
  p{
    width: calc(100% - 50px);
  }
}
/deep/ .vue-treeselect__control {
  height: 32px;
  border-radius: 4px;
  .vue-treeselect__placeholder, /deep/ .vue-treeselect__single-value {
    line-height: 30px;
  }
  .vue-treeselect__input {
    display: block;
  }
}
</style>