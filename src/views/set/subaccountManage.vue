/*子账号管理 */
<template>
    <div class="main mh bor-radius">
      <div class="top_part">
        <div class="search head-wrapper">
          <el-form ref="form" :inline="true" :model="form">
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
          <el-button type="primary" v-permission="['设置', '子账号管理' ,'默认页面', '新建子账号']" @click="_routeTo('createAccount')">新建子账号</el-button>
        </div>
      </div>
      <div class="bottom_part">
        <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="dataList"
        style="width: 100%"
        :header-cell-style="{background:'rgba(208, 214, 228, .2)', color:'#44434B', fontSize: '14px', fontWeight: '500'}"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
        type="selection"
        width="34">
        </el-table-column>
        <el-table-column
          prop="userName"
          min-width="120" fixed="left" class-name="table-padding"
          label="账号">
        </el-table-column>
        <el-table-column
          prop="roleNames"
          align="center"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="mobile"
          align="center"
          min-width="150"
          label="手机号">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="createUserName"
          align="center"
          label="创建人">
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          min-width="160"
          label="创建时间">
        </el-table-column>
        <!-- <el-table-column
          prop="applyTime"
          label="初始密码"
          sortable>
        </el-table-column> -->
        <el-table-column
        label="操作" width="117" fixed="right" header-align="center" class-name="table-padding">
          <template slot-scope="scope">
            <div class="table-operate">
              <span class="table-btn" @click="handleClick(scope.row)">编辑</span>
              <span class="table-btn table-warning" @click="deleteAccount(scope.row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
       <div class="multiple_selection table-select" style="margin-left: 20px;">
        <el-checkbox :indeterminate="isIndeterminate" class="selectAll" @change="selectAll" v-model="selectStatus">全选</el-checkbox>
        <el-button class="border-button" @click="deleteAccount()">批量删除</el-button>
      </div>
        <div class="page_styles">
          <el-pagination
            :background="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="form.pageSize"
            layout="prev, pager, next, sizes"
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
      loading:true,
      selectStatus: false
    }
  },
  watch: {
    
  },
  computed:{
    userInfo(){
      return this.$store.getters.userInfo
    },
    cid(){
      let shopInfo = this.$store.getters.shopInfos
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
        console.error(error)
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
      this.confirm({
        customClass: 'goods-custom', 
        icon: true, 
        text: '此操作将永久删除该子账号, 是否继续?'
      }).then(() => {
          this._apis.set.deleteAccount({userIds:ids}).then(response =>{
            this.$message.success('删除成功！');
            this.getSubAccount()
          }).catch(error =>{
            this.$message.error(error);
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
      if(val.length !=0 && val.length == this.dataList.length ){
        this.selectStatus = true; 
        this.isIndeterminate = false;
      }else{
        this.selectStatus = false;
        if(val.length !=0){
					this.isIndeterminate = true;
				}else{
					this.isIndeterminate = false;
				}
      }
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

     // 全选
    selectAll(val){
      if(val && this.dataList.length > 0){
        this.dataList.forEach((row)=>{
           this.$refs.multipleTable.toggleRowSelection(row,true);
        })
      }else{
        this.$refs.multipleTable.clearSelection();
      }
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
  /deep/ th.is-leaf {
    border:0;
  }
  .top_part{
    display: flex;
    justify-content: space-between;
  }
}
</style>