<template>
  <div>
    <div class="on_off">
      <p>启动广告有助于促进您的推广，建议开启 </p>
      <el-switch
        v-model="openAD"
        active-color="#13ce66"
        @change="switchStatusChange"
        inactive-color="#CACACF">
      </el-switch>
    </div>
    <div class="ad_head_wrapper head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="true" class="input_style">
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
          <el-input v-model="ruleForm.name" placeholder="请输入广告名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="startIndex = 1;ruleForm.startIndex = 1;fetch()">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" @click="_routeTo('m_createAD')">新建广告</el-button>
      </div>
    </div>
    <div class="table" v-calcMinHeight="299">
      <p>广告（{{total || 0}}个）</p>
      <el-table :data="tableData" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" :default-sort = "{prop: 'date', order: 'descending'}" @sort-change="changeSort">
        <el-table-column
          type="selection"  
          width="34">
        </el-table-column>
        <el-table-column prop="imagePath" label="广告图" min-width="100" fixed="left" class-name="table-padding">
          <template slot-scope="scope">
            <div class="name_wrapper">
              <img :src="scope.row.imagePath">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="广告名称" min-width="130"></el-table-column>
        <el-table-column prop="vv" label="访客数" align="right"></el-table-column>
        <el-table-column prop="pv" label="浏览数" align="right"></el-table-column>
        <el-table-column prop="updateTime" label="展示时间" min-width="310" align="center">
          <template slot-scope="scope">
            {{scope.row.startTime}} 至 {{scope.row.endTime}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" align="center"></el-table-column>
        <el-table-column prop="updateTime" sortable="custom" label="最后编辑时间" min-width="160" align="center"></el-table-column>
        <!-- <el-table-column prop="startTime" sortable label="开始时间" :width="170"></el-table-column>
        <el-table-column prop="endTime" sortable label="结束时间" :width="170"></el-table-column> -->
        <el-table-column prop="createUserName" label="操作账号" align="center"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">展示中</span>
            <span v-else-if="scope.row.status === 1">排期中</span>
            <span v-else-if="scope.row.status === 2">已过期</span>
            <span v-else-if="scope.row.status === 3">停用</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作"  :width="operationColumnW" align="left" fixed="right" header-align="center" class-name="table-padding">>
          <template slot-scope="scope">
            <div class="table-operate">
              <span class="table-btn" v-if="scope.row.status === 0" @click="_routeTo('m_createAD', {ADId: scope.row.id, showType: 'view'})">查看</span>
              <span class="table-btn" v-if="scope.row.status === 3" @click="startAD(scope.row)">启用</span>
              <span class="table-btn table-warning" v-else-if="scope.row.status === 0 || scope.row.status === 1" @click="stopAD(scope.row)">停用</span>
              <span class="table-btn" v-if="scope.row.status !== 0" @click="_routeTo('m_createAD', {ADId: scope.row.id})">编辑</span>
              <span class="table-btn table-warning" @click="deleteAD(scope.row)">删除</span>
            </div>
            <!-- <el-button class="table-btn" type="text" @click="deleteAD(scope.row)" :disabled="true">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
       <div class="multiple_selection table-select" v-if="tableData.length">
        <el-checkbox class="selectAll" @change="selectAll" v-model="selectStatus">全选</el-checkbox>
        <el-button class="border-button" @click="batchDeleteAD"  :disabled="!this.multipleSelection.length">批量删除</el-button>
      </div>
      <div class="pagination" v-if="tableData.length">
        <el-pagination
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(startIndex) || 1"
          :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
          :page-size="pageSize*1"
          :total="total*1"
          layout="prev, pager, next, sizes"
          >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import tableBase from '@/components/TableBase';
export default {
  name: 'ADManageIndex',
  extends: tableBase,
  components: {},
  data () {
    return {
      tableData:[],
      openAD: true,
      ruleForm: {
        status: '',
        name: '',
        sort: 'desc'
      },
      rules: {},
      operationColumnW: 72 //操作列宽度
    }
  },
  watch: {
     shopInfo: {
      handler(newValue) {
        this.openAD = newValue.adOpenType === 1;
      },
      depp: true
    },
    'tableData': {
        handler(newVal, oldVal) { //计算操作栏宽度
            this.$nextTick(() => {
                this.operationColumnW = this.utils.getOperationColumnW();
            })
        },
        deep: true
    }
  },
  computed: {
    shopInfo() {
      this.openAD = this.$store.getters.shopInfo.adOpenType === 1;
      return this.$store.getters.shopInfo || {};
    },
    cid(){
        let shopInfo = this.$store.getters.shopInfos
        return shopInfo.id
    }
  },
  created() {
    this.$store.dispatch('getShopInfo');
  },
  methods: {

    /* 启用广告 */
    startAD(item) {
      this.confirm({
        title: '提示', 
        customClass: 'goods-custom', 
        icon: true, 
        text: '确定启用此广告吗？'
      }).then(() => {
        this.startStopAD({
          id: item.id,
          status: '1'
        });
      })
    },

    /* 停用广告 */
    stopAD(item) {
      this.confirm({
        title: '提示', 
        customClass: 'goods-custom', 
        icon: true, 
        text: '确定停用此广告吗？'
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
        this.$message.success('操作成功！')
        this.fetch();
      }).catch((error)=>{
        this.$message.error(error);
      });
    },

    /* 删除广告 */
    deleteAD(item) {
      this.confirm({
        title: '提示', 
        customClass: 'goods-custom', 
        icon: true, 
        text: '确定删除此启动广告吗？'
      }).then(() => {
          this._apis.shop.deleteADs({advertiseIds: [item.id]}).then((response)=>{
            this.$message.success('删除成功！')
            this.fetch();
          }).catch((error)=>{
            this.$message.error(error);
          });
        })
    },

     /* 批量删除广告 */
    batchDeleteAD(item) {
      this.confirm({
        title: '提示', 
        customClass: 'goods-custom', 
        icon: true, 
        text: '确定删除吗？'
      }).then(() => {
          const ids = [];
          for(let item of this.multipleSelection) {
            ids.push(item.id);
          }
          this._apis.shop.deleteADs({advertiseIds: ids}).then((response)=>{
            this.$message.success('删除成功！')
            this.fetch();
          }).catch((error)=>{
            this.$message.error(error);
          });
        })
    },

    fetch() {
      this.loading = true;
      this._apis.shop.getADList(this.ruleForm).then((response)=>{
        this.tableData = response.list;
        this.total = response.total;
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    /* 开关状态切换 */
    switchStatusChange(value) {
      this._apis.shopInfo.updateShopInfo({id:this.cid, adOpenType: value === true ? 1 : 0})
      .then((response)=>{
        this.$store.dispatch('getShopInfo');
        this.$message.success('修改成功！')
      }).catch((error)=>{
        this.$message.error(error);
      });
    },

    //时间排序
    changeSort(val){
      if(val && val.order == 'ascending') {
        this.ruleForm.sort = 'asc'
      }else if(val && val.order == 'descending'){
        this.ruleForm.sort = 'desc'
      }else{
        return 
      }
      this.fetch()
    },

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
  border-radius: 4px;
}
/deep/ .table{
  // overflow-y: auto;
  margin-top:20px;
  background:#fff;
  padding:20px;
  padding-bottom:50px;
  border-radius: 4px;
  p{
    margin-bottom:20px;
  }
}
/deep/ .el-table-column--selection .cell {
  padding-left: 20px;
  overflow: inherit;
}
.multiple_selection {
  margin-left: 20px;
  /deep/ .el-checkbox__label {
    padding-left: 18px;
  }
}
/deep/ thead th{
  background: #f6f7fa!important;
  color:#44434B!important;
}
.table-btn{
  padding-right: 5px;
  border-right: 1px solid #dadae3;
  &:last-child{
    border-right: none;
  }
}
.name_wrapper{
    display: flex;
    flex-direction: row;
    align-items: center;
    img{
      width:40px;
      height:50px;
      margin-right:10px;
      object-fit: contain;
    }
    p{
      width: calc(100% - 50px);
    }
}
</style>
