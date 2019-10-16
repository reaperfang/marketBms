<template>
  <div>
    <div class="on_off">
      <p>店铺的各个页面可以通过导航串联起来。通过精心设置的导航，方便买家在栏目间快速切换，引导买家前往你期望的页面。 </p>
      <el-switch
        v-model="openAD"
        active-color="#13ce66"
        @change="switchStatusChange"
        inactive-color="#ff4949">
      </el-switch>
    </div>
    <div class="ad_head_wrapper">
      <el-form ref="ruleForm" :model="ruleForm" label-width="80px" :inline="true">
        <el-form-item label="" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择广告状态">
            <el-option label="全部广告" :value="''"></el-option>
            <el-option label="展示中" :value="0"></el-option>
            <el-option label="排期中" :value="1"></el-option>
            <el-option label="已过期" :value="2"></el-option>
            <el-option label="停用" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入广告名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="fetch">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" @click="_routeTo('createAD')">新建广告</el-button>
        <el-button type="warning" plain @click="batchDeleteAD"  :disabled="!this.multipleSelection.length">批量删除</el-button>
      </div>
    </div>
    <div class="table">
      <p>广告（28个）</p>
      <el-table :data="tableList" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column
          type="selection"  
          width="30">
        </el-table-column>
        <el-table-column prop="imagePath" label="广告图">
          <template slot-scope="scope">
            <div class="name_wrapper">
              <img :src="scope.row.imagePath">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="广告名称"></el-table-column>
        <el-table-column prop="vv" label="访客数" width="100"></el-table-column>
        <el-table-column prop="pv" label="浏览数" width="100"></el-table-column>
        <el-table-column prop="updateTime" label="展示时间">
          <template slot-scope="scope">
            {{scope.row.startTime}} - {{scope.row.endTime}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">展示中</span>
            <span v-else-if="scope.row.status === 1">排期中</span>
            <span v-else-if="scope.row.status === 2">已过期</span>
            <span v-else-if="scope.row.status === 3">已停用</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="创建时间" ></el-table-column>
        <el-table-column prop="createUserName" label="操作账号"></el-table-column>
        <el-table-column prop="" label="操作" :width="'150px'">
          <template slot-scope="scope">
            <span class="table-btn" v-if="scope.row.status === 3" @click="startAD(scope.row)">启用</span>
            <span class="table-btn" v-else-if="scope.row.status === 0 || scope.row.status === 1" @click="stopAD(scope.row)">停用</span>
            <span class="table-btn" v-else>---</span>
            <span class="table-btn" v-if="scope.row.status !== 0" @click="_routeTo('createAD', {ADId: scope.row.id})">编辑</span>
            <span class="table-btn" @click="deleteAD(scope.row)">删除</span>
            <!-- <el-button class="table-btn" type="text" @click="deleteAD(scope.row)" :disabled="true">删除</el-button> -->
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
import tableBase from '@/components/TableBase';
import uuid from 'uuid/v4';
export default {
  name: 'ADManageIndex',
  extends: tableBase,
  components: {},
  data () {
    return {
      tableList:[],
      openAD: true,
      ruleForm: {
        status: '',
        name: '',
        sort: 'desc'
      },
      rules: {}
    }
  },
  watch: {
     shopInfo: {
      handler(newValue) {
        this.openAD = newValue.adOpenType === 1;
      },
      depp: true
    }
  },
  computed: {
    shopInfo() {
      this.openAD = this.$store.getters.shopInfo.adOpenType === 1;
      return this.$store.getters.shopInfo || {};
    },
    cid(){
        let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
        return shopInfo.id
    }
  },
  created() {
    this.$store.dispatch('getShopInfo');
  },
  methods: {

    /* 启用广告 */
    startAD(item) {
      this.$confirm('确定启用此广告吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.startStopAD({
            id: item.id,
            status: '1'
          });
        })
    },

    /* 停用广告 */
    stopAD(item) {
      this.$confirm('确定停用此广告吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.startStopAD({
            id: item.id,
            status: '3'
          });
        })
    },

    /* 启停广告 */
    startStopAD(params) {
      this._apis.shop.stopAndStopAD(params).then((response)=>{
        this.$notify({
          title: '成功',
          message: '操作成功！',
          type: 'success'
        });
        this.fetch();
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      });
    },

    /* 删除广告 */
    deleteAD(item) {
       this.$confirm('确定删除此启动广告吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._apis.shop.deleteADs({advertiseIds: [item.id]}).then((response)=>{
            this.$notify({
              title: '成功',
              message: '删除成功！',
              type: 'success'
            });
            this.fetch();
          }).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: error
            });
          });
        })
    },

     /* 批量删除广告 */
    batchDeleteAD(item) {
       this.$confirm(`确定删除吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = [];
          for(let item of this.multipleSelection) {
            ids.push(item.id);
          }
          this._apis.shop.deleteADs({advertiseIds: ids}).then((response)=>{
            this.$notify({
              title: '成功',
              message: '删除成功！',
              type: 'success'
            });
            this.fetch();
          }).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: error
            });
          });
        })
    },

    fetch() {
      this.loading = true;
      this._apis.shop.getADList(this.ruleForm).then((response)=>{
        this.tableList = response.list;
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

    /* 开关状态切换 */
    switchStatusChange(value) {
      this._apis.shop.changeSwitchStatus({id:this.cid, adOpenType: value === true ? 1 : 0}).then((response)=>{
        this.$notify({
          title: '成功',
          message: '修改成功！',
          type: 'success'
        });
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      });
    }

  }
}
</script>

<style lang="scss" scoped>
.on_off{
  height:36px;
  background: rgb(255,233,210);
  margin-bottom:20px;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 9px;
  p{
    color:rgba(146,146,155,1);
  }
}
.ad_head_wrapper{
  background:#fff;
  padding:20px;
}
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
.name_wrapper{
    display: flex;
    flex-direction: row;
    align-items: center;
    img{
      width:40px;
      height:50px;
      margin-right:10px;
      object-fit: cover;
    }
}
</style>
