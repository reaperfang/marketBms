/* 角色管理 */
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
            <el-button type="primary" @click="submit">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form>
        </div>
        <div>
          <el-button type="primary"  v-permission="['设置', '角色管理', '默认页面', '新建角色']" @click="_routeTo('createRole')">新建角色</el-button>
        </div>
      </div>
      <div class="bottom_part">
        <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="dataList"
        style="width: 100%"
        :header-cell-style="{background:'rgba(208, 214, 228, .2)', color:'#44434B', fontSize: '14px', fontWeight: '500'}"
        :default-sort = "{prop: 'name9', order: 'descending'}"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
        type="selection"
        width="34">
        </el-table-column>
        <el-table-column
          prop="roleName"
          min-width="140" fixed="left" class-name="table-padding"
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
        <el-table-column
        label="操作" width="117" fixed="right" header-align="center" class-name="table-padding">
          <template slot-scope="scope">
            <div class="table-operate">
              <span class="table-btn" @click="handleClick(scope.row)">编辑</span>
              <span class="table-btn table-warning" @click="deleteRole(scope.row.roleName)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="multiple_selection table-select" style="margin-left: 20px;">
        <el-checkbox :indeterminate="isIndeterminate" class="selectAll" @change="selectAll" v-model="selectStatus">全选</el-checkbox>
        <el-button class="border-button" @click="deleteRole()">批量删除</el-button>
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
      return shopInfo && shopInfo.id
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
        // this.$message.error(error);
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
      this.confirm({
        title: '提示', 
        customClass: 'goods-custom', 
        icon: true, 
        text: '此操作将永久删除该角色, 是否继续?'
      }).then(() => {
          this._apis.set.deleteRole({roleNames:roleNames}).then(response =>{
            this.$message.success('删除成功！');
            this.getRoleList()
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
      this.multipleSelection = []
      val.map(item =>{
        this.multipleSelection.push(item.roleName)
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
  .top_part{
    display: flex;
    justify-content: space-between;
  }
  .bottom_part{
    /deep/ th.is-leaf {
      border:0;
    }
  }
}
</style>