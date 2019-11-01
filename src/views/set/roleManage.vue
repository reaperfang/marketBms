/* 角色管理 */
<template>
     <div class="main">
      <div class="top_part">
        <div class="search">
          <el-form ref="form" :inline="true" :model="form" label-width="70px">
            <el-form-item label="店铺:" prop="shopInfoId">
              <el-select v-model="form.shopInfoId" placeholder="请选择">
                <el-option
                  v-for="item in shops"
                  :key="item.id"
                  :label="item.shopName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" @click="submit">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form>
        </div>
        <el-button type="primary" @click="_routeTo('createRole')">新建角色</el-button>
      </div>
      <div class="bottom_part">
        <el-table
        v-loading="loading"
        :data="dataList"
        style="width: 100%"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        :default-sort = "{prop: 'name9', order: 'descending'}"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述">
        </el-table-column>
        <!-- <el-table-column
          prop="amount"
          label="包含人数">
        </el-table-column> -->
        <el-table-column
          prop="createUserName"
          label="创建人">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
        label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteRole(scope.row.roleName)" type="text" size="small" style="color:#FD4C2B">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin-top:10px;" @click="deleteRole()">批量删除</el-button>
      <div class="page_styles">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="form.pageSize"
          layout="sizes, prev, pager, next"
          :total="total*1">
        </el-pagination>
      </div>
      </div>
    </div>       
</template>

<script>
import TableBase from "@/components/TableBase";
export default {
  name: 'roleManage',
  extends: TableBase,
  data() {
    return {
      dataList:[],
      form:{
        shopInfoId:'',
        startIndex:1,
        pageSize:10,
      },
      shops:[ ],
      multipleSelection:[],
      total:0,
      loading:true
    }
  },
  watch: {
    
  },
  computed:{
    userInfo(){
      return JSON.parse(localStorage.getItem('userInfo'))
    },
    cid(){
      let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
      return shopInfo.id
    }
  },
  created() {
    this.getShops()
    this.getRoleList()
  },
  destroyed() {
    
  },
  methods: {
    //获取所有店铺
    getShops(){
      let data = this.userInfo.shopInfoMap
      for(let key in data){
        let shopObj = data[key]
        this.shops.push(shopObj)
      }
    },
    //获取角色列表
    getRoleList(){
      let query = Object.assign({cid:this.cid},this.form)
      this._apis.set.getRoleList(query).then(response =>{
        this.dataList = response.list
        this.total = response.total
        this.loading = false
      }).catch(error =>{
        this.loading = false
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
      })
    },
    //查询
    submit(){
      this.getRoleList()
    },
    //重置
    reset(){
      this.form = {
        shopInfoId:'',
        startIndex:1,
        pageSize:10,
      }
    },
    //删除
    deleteRole(roleName){
      let roleNames = []
      roleName ? roleNames.push(roleName) : roleNames = this.multipleSelection
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._apis.set.deleteRole({roleNames:roleNames}).then(response =>{
            this.$notify.success({
              title: '成功',
              message: '删除成功！'
            });
            this.getRoleList()
          }).catch(error =>{
            this.$notify.error({
              title: '错误',
              message: error
            });
          })          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //批量操作
    handleSelectionChange(val) {
      this.multipleSelection = []
      val.map(item =>{
        this.multipleSelection.push(item.roleName)
      })
    },
    handleClick(row){
      this.$router.push({name:'createRole',params:{data:row}})
    },
    /**********************************        分页相关      **********************/
    handleSizeChange(val){
      this.form.pageSize = val || this.form.pageSize
      this.getRoleList()
    },
    handleCurrentChange(pIndex){
      this.form.startIndex = pIndex || this.form.startIndex
      this.getRoleList()
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.main{
  width: 100%;
  background: #fff;
  padding:20px;
  .top_part{
    display: flex;
    justify-content: space-between;
  }
  .bottom_part{
    margin-top:10px;
  }
}
</style>