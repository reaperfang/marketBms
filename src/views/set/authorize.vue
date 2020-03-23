<template>
  <div class="authorize">
    <section class="header">
      <h2>第三方平台授权</h2>
      <el-button class="border-button">获取授权码</el-button>
    </section>
    <section class="container">
      <h2>授权记录</h2>
      <el-table
        v-loading="loading"
        ref="table"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}">
        <el-table-column
            prop=""
            label="序号">
            <template slot-scope="scope">
                
            </template>
        </el-table-column>
        <el-table-column
            prop="platformType"
            label="平台名称">
            <template slot-scope="scope">
                {{scope.row.platformType | platformTypeFilter}}
            </template>
        </el-table-column>
        <el-table-column
            prop=""
            label="授权店铺">
        </el-table-column>
        <el-table-column
            prop="authCode"
            label="授权码">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="授权时间">
        </el-table-column>
        <el-table-column
            prop="enable"
            label="授权状态">
            <template slot-scope="scope">
                {{scope.row.enable | enableFilter}}
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <div class="operate-box">
                    <span>解除授权</span>
                </div>
            </template>
        </el-table-column>
    </el-table>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      list: [
        {

        }
      ]
    }
  },
  filters: {
    platformTypeFilter(code) {
      if(code == 1) {
        return '数商中台'
      } else {
        return ''
      }
    },
    enableFilter(code) {
      if(code == 1) {
        return '启用'
      } else if(code == 0) {
        return '禁用'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  section {
    background-color: #fff;
    padding: 23px 34px;
    margin-bottom: 20px;
    h2 {
      font-size:14px;
      font-weight:500;
      color:rgba(35,35,36,1);
      margin-bottom: 22px;
    }
    &.header {
      
    }
  }
</style>