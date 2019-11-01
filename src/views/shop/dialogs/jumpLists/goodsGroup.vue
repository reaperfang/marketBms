<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true">
      <div class="inline-head">
        <!-- <el-form-item label="" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-button type="primary" @click="fetch">搜  索</el-button>
        </el-form-item> -->
      </div>
    </el-form>
    <el-tree :data="categoryData" :props="defaultProps" @node-click="handleNodeClick" :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false"></el-tree>
  </div>
</template>

<script>
export default {
  name: "goodsGroup",
  components: {},
  props: {
  },
  data() {
    return {
      ruleForm: {
        name: ''
      },
      rules: {},
      goodsClassifyList: [],
      categoryData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
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

    handleNodeClick(data) {
      
      let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
      let cid = shopInfo && shopInfo.id || ''

      /* 向父组件发送选中的数据 */
      this.$emit('seletedRow',  {
        pageType: 'goodsGroup',
        typeName: '商品分类',
        id: 4,
        data: {
          id: data.id,
          name: data.label
        },
        cid
      });
    }

  }
};
</script>

<style lang="scss" scoped>
.inline-head{
  justify-content: flex-end;
}
/deep/.el-tree{
    height: 300px;
    overflow-y: auto;
}
</style>