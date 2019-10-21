/*子账号管理 */
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
            <el-form-item label="角色:" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入角色"></el-input>
            </el-form-item>
            <el-button type="primary" @click="submit">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form>
        </div>
        <div class="create">
          <el-button type="primary" @click="_routeTo('createAccount')">新建子账号</el-button>
        </div>
      </div>
      <div class="bottom_part">
        <el-table
        v-loading="loading"
        :data="dataList"
        style="width: 100%"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="roleNames"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="createUserName"
          label="创建人">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <!-- <el-table-column
          prop="applyTime"
          label="初始密码"
          sortable>
        </el-table-column> -->
        <el-table-column
        label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteAccount(scope.row.id)" type="text" size="small" style="color:#FD4C2B">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
        <el-button style="margin-top:10px;" @click="deleteAccount()">批量删除</el-button>
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
  name: 'subaccountManage',
  extends: TableBase,
  data() {
    return {
      form:{
        shopInfoId:'',
        roleName:'',
        startIndex:1,
        pageSize:10
      },
      shops:[ ],
      roles:[],
      dataList: [],
      total:0,
      multipleSelection:[],
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
    this.getSubAccount()
  },
  destroyed() {
    
  },
  methods: {
    //获取店铺列表
    getShops(){
      let data = this.userInfo.shopInfoMap
      for(let key in data){
        let shopObj = data[key]
        this.shops.push(shopObj)
      }
    },
    //获取子账号列表
    getSubAccount(){
      let query = Object.assign({cid:this.cid},this.form)
      this._apis.set.getSubAccount(query).then(response =>{
        this.loading = false
        this.dataList = []        
        response && response.list.map(item =>{
          item.roleNames = item.roleNames.split(',')[0]
          this.dataList.push(item)
        })
        this.total = response.total
      }).catch(error =>{
        this.loading = false
      })
    },
    //查询
    submit(){
      this.getSubAccount()
    },
    //重置
    reset(){
      this.form = {
        shopInfoId:'',
        roleName:'',
        startIndex:1,
        pageSize:10
      }
    },
    //删除
    deleteAccount(id){
      let ids = []
      id ? ids.push(id) : ids = this.multipleSelection
      this.$confirm('此操作将永久删除该子账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._apis.set.deleteAccount({userIds:ids}).then(response =>{
            this.$notify.success({
              title: '成功',
              message: '删除成功！'
            });
            this.getSubAccount()
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
      val.map(item =>{
        this.multipleSelection.push(item.id)
      })
    },
    //编辑
    handleClick(row){
      this.$router.push({name:'createAccount',params:{data:row}})
    },
    //分页
    handleSizeChange(val){
      this.form.pageSize = val
      this.getSubAccount()
    },
    handleCurrentChange(val){
      this.form.startIndex = val
      this.getSubAccount()
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
}
</style>