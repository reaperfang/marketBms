<template>
  <div>
       <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true" style="overflow-y: initial;">
          <div class="inline-head">
            <el-form-item label="" prop="name">
              <treeselect
                style="width:300px"
                :multiple="false"
                :options="categoryData"
                placeholder="请选择分类"
                v-model="seletedClassify"></treeselect>
            </el-form-item>
            <el-form-item label="" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <!-- <el-form-item label="" prop="id">
              <el-input v-model="ruleForm.id" placeholder="请输入编码"></el-input>
            </el-form-item> -->
            <el-form-item label="" prop="">
              <el-button type="primary" @click="fetch">搜  索</el-button>
            </el-form-item>
          </div>
        </el-form>
        <el-table :data="tableData" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
          <el-table-column prop="" label="选择" :width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.active" @change="seletedChange(scope.row, scope.row.active)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名称" :width="500">
            <template slot-scope="scope">
              <div class="name_wrapper">
                <img :src="scope.row.mainImage" alt="加载错误" />
                <p>{{scope.row.name}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="productCatalogInfoName" label="所属分类"></el-table-column>
          <el-table-column prop="saleCount" label="总销量"></el-table-column>
        </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(startIndex) || 1"
          :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
          :page-size="pageSize*1"
          :total="total*1"
          layout="total, sizes, prev, pager, next, jumper"
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
        status: '1',
      },
      rules: {},
      goodsClassifyList: [],
      tableData: [],
      currentClassifyId: [],
      categoryData: [],
      seletedClassify: null
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

    /* 获取分类列表 */
    getGoodsClassifyList() {
      this._apis.goods.fetchCategoryList({
        enable: '1'
      }).then((response)=>{
        this.responseData = response;
        let arr = this.transTreeData(response, 0)
        this.categoryData = arr
        this.flatArr = this.flatTreeArray(JSON.parse(JSON.stringify(arr)))
        this.loading = false;
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
        this.loading = false;
      });
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
      }
      this._apis.goods.fetchSpuGoodsList(params).then((response)=>{
        this.tableData = response.list;
        this.total = response.total;
        this.loading = false;
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
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

      let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
      let cid = shopInfo && shopInfo.id || ''

      /* 向父组件发送选中的数据 */
      this.$emit('seletedRow',  {
        pageType: 'goods',
        typeName: '商品详情',
        id: 5,
        data: {
          id: data.id,
          name: data.name
        },
        cid
      });
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
  justify-content: flex-end;
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
</style>