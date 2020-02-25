<template>
  <div class="gbc_container">
    <h2>栏目内容</h2>
    <el-table :data="tableList" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column
      type="index"
      label="序号"
      width="100">
      </el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="typeStr" label="类型"></el-table-column>
      <el-table-column prop="" label="操作" :width="'250px'">
        <template slot-scope="scope">
          <span class="table-btn" @click="routeToDetail(scope.row)">编辑</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import tableBase from '@/components/TableBase';
import uuid from 'uuid/v4';
export default {
  name: 'columnIndex',
  extends: tableBase,
  data () {
    return {
      loading: true,
      tableList:[]
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch(type) {
      this.loading = true;
      this._apis.shop.getWindowList().then((response)=>{
         this.loading = false;
         this.tableList = response;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    routeToDetail(row) {
      let pageName = '';
      switch(Number(row.type)) {
        case 1:
          pageName = '1picText';
          break;
        case 2:
          pageName = '2goodsSet';
          break;
        case 3:
          pageName = '3picText';
          break;
        case 4:
          pageName = '4goodsSet';
          break;
        case 5:
          pageName = '5picText';
          break;
        case 6:
          pageName = '6infoSet';
          break;
      }
      this._routeTo(pageName, {type: row.type});
    }
  }
}
</script>

<style lang="scss" scoped>

/deep/ .table{
  margin-top:20px;
  background:#fff;
  padding:20px;
  p{
    margin-bottom:20px;
  }
}
/deep/ thead th{
  background: rgba(230,228,255,1)!important;
  color:#837DFF!important;
}
.index_page_flag{
  color:rgba(182,130,255,1);
  padding:0px 5px;
  border:1px solid rgba(182,130,255,1);
  font-size:12px;
}
.page_name{
  cursor: pointer;
  &:hover{
    color: $globalMainColor;
  }
}
</style>
