/* 选择商品弹框 */
<template>
  <DialogBase :visible.sync="visible" :appendToBody="true" width="1000px" :title="categoryName ? '选择 ['+categoryName+'] 分类下的商品' : '选择商品'" @submit="submit">
    <div class="select_dialog">
      <div class="head-wrapper">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules"  :inline="true">
          <div>
              <el-form-item label="商品状态" prop="status">
                <el-select label="商品状态" v-model="ruleForm.status" placeholder="请选择商品状态">
                  <el-option label="全部" :value="null"></el-option>
                  <el-option label="上架" :value="1"></el-option>
                  <el-option label="下架" :value="0"></el-option>
                  <el-option label="售罄" :value="-1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品分类" prop="name">
                <treeselect
                  style="width:180px"
                  :multiple="false"
                  :options="categoryData"
                  placeholder="全部"
                  v-model="seletedClassify"></treeselect>
              </el-form-item>
          </div>
          <div>
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入商品名称" clearable style="width:300px"></el-input>
              </el-form-item> 
              <el-form-item label prop="name">
                <el-button type="primary" @click="search">查 询</el-button>
                <el-button @click="seletedClassify=null;refresh()">刷 新</el-button>
              </el-form-item>
          </div>
        </el-form>
      </div>
      <el-table
        stripe
        :data="tableData"
        :row-key="getRowKey"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" :reserve-selection="true" :selectable="itemSelectable" width="55"></el-table-column>
        <el-table-column prop="title" label="商品名称" :width="300">
          <template slot-scope="scope">
            <div class="name_wrapper">
              <img :src="scope.row.mainImage" alt="失败" />
              <p>{{scope.row.name}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productCatalogInfoName" label="商品分类">
          <template slot-scope="scope">
            <span>{{scope.row.productCatalogInfoName || '--'}}</span>
          </template>
        </el-table-column> 
        <el-table-column prop="productSpecs" label="商品规格">
          <template slot-scope="scope">
            <span>{{scope.row.productSpecs || '--'}}</span>
          </template>
        </el-table-column> 
        <el-table-column prop="status" label="商品状态">
          <template slot-scope="scope">
              <span v-if="scope.row.status == -1">售罄</span>
              <span v-else-if="scope.row.status === 0">下架</span>
              <span v-else-if="scope.row.status === 1">上架</span>
            </template>
        </el-table-column> 
        <el-table-column prop="stock" label="库存数量">
          <template slot-scope="scope">
            <span>{{scope.row.stock || '--'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="createTime" label="创建时间"></el-table-column> -->
        <div slot="empty" class="table_empty">
          <img src="../../../assets/images/table_empty.png" alt="">
          <div class="tips">暂无数据<span @click="addNewGoods()">去创建？</span><i>创建后，请回到此页面选择数据</i></div>
        </div>
      </el-table>
      <div class="multiple_selection" v-if="tableData.length">
        <el-checkbox class="selectAll" @change="selectAll" v-model="selectStatus" :disabled="selectDisabled">全选</el-checkbox>
        <el-button size="mini" @click="clearInvalidData">删除已选失效数据</el-button>
        <el-popover popper-class="icon-info-popover" placement="top" trigger="hover">
          <div>删除已选失效数据的作用：<br/>将已选中，但因商品售罄、活动结束等原因变<br/>为“失效”状态的全部数据取消勾选</div>
          <span class="icon-info" slot="reference"></span>
        </el-popover>
      </div>
      <div class="pagination" v-if="tableData.length">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(ruleForm.pageNum) || 1"
          :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
          :page-size="pageSize*1"
          :total="total*1"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </DialogBase>
</template>

<script>
import mixinSelectDialogs from '../mixins/mixinSelectDialogs';
import utils from "@/utils";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: "dialogSelectGoods",
  mixins: [mixinSelectDialogs],
  components: { Treeselect },
  props: {
    categoryName: {
      type: String
    },
    categoryId: {
      type: String
    }
  },
  data() {
    return {
      ruleForm: {
        name: "",
        status: null,
        productCatalogInfoId: this.categoryId || ''
      },
      disableStatus: [0, -1],  //不可选状态值
      goodsClassifyList: [],
      currentClassifyId: [],
      categoryData: [],
      seletedClassify: null
    };
  },
  created() {
    this.getGoodsClassifyList();
  },
  methods: {

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

    /* 获取分类列表 */
    getGoodsClassifyList() {
      this._apis.goods.fetchCategoryList({
        enable: '1'
      }).then((response)=>{
        let arr = this.transTreeData(response, 0)
        this.categoryData = arr
      }).catch((error)=>{
        console.error(error);
      });
    },

    itemSelectable(row, index) {
      if(row.status !== 0 && row.status !== -1) {
        return true;
      }
      row.disabled = true;
    },
    getRowKey(row) {
      return row.id
    },

     /* 删除已选失效数据 */
    clearInvalidData() {
      this.tableData.forEach((row, index) => {
        if((row.status === 0 || row.status === -1)) {  //假数据不允许添加选中状态
          this.$refs.multipleTable.toggleRowSelection(row, false);
        }
      })
      this.$message.success('清除成功！');
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

    /* 添加新商品跳转 */
    addNewGoods() {
      let newUrl = `${window.location.origin}/bp/goods/addGoodsOnly`
      let newWindow = window.open("about:blank");
      newWindow.location.href = newUrl;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

