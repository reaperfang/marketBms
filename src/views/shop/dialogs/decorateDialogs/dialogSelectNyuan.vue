/* 选择N元N件弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'选择N元N件活动'" @submit="submit">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true">
      <div class="inline-head">
        <el-form-item label="" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入活动名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-button type="primary" @click="fetch">搜  索</el-button>
          <el-button type="primary" @click="fetch($event, true)">刷 新</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
    stripe
    :data="tableList"
    :row-key="getRowKey"
    ref="multipleTable"
    @selection-change="handleSelectionChange"
    v-loading="loading">
        <el-table-column
          type="selection"  
          :selectable="itemSelectable"
          :reserve-selection="true"
          width="55">
        </el-table-column>
        <el-table-column prop="name" label="活动标题">
          <template slot-scope="scope">
            <div class="name_wrapper">
              <img :src="scope.row.activityPic" alt="">
              <p>{{scope.row.name}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">  <!-- 0是未生效  1是生效中 2是已失效-->
           <template slot-scope="scope">
            <span v-if="scope.row.status === 0">未生效</span>
            <span v-else-if="scope.row.status === 1">生效中</span>
            <span v-else-if="scope.row.status === 2">已失效</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <div slot="empty" class="table_empty">
          <img src="../../../../assets/images/table_empty.png" alt="">
          <div class="tips">暂无数据<span @click="addNewApply('/application/promotion/addPackbuy')">去创建？</span><i>创建后，请回到此页面选择数据</i></div>
        </div>
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
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import tableBase from '@/components/TableBase';
import utils from "@/utils";
import uuid from 'uuid/v4';
import { getToken } from '@/system/auth'
export default {
  name: "dialogSelectNyuan",
  extends: tableBase,
  components: {DialogBase},
  props: {
      data: {},
      dialogVisible: {
          type: Boolean,
          required: true
      },
      goodsEcho: {
        type: Array,
        required: true
      }
  },
  data() {
    return {
      pageSize: 5,
      tableList: [],
      multipleSelection: [],
      pageNum: 1,
      ruleForm: {
        pageNum: 1,
        name: '',
      },
      rules: {}
    };
  },
  computed: {
    visible: {
      get() {
          return this.dialogVisible
      },
      set(val) {
          this.$emit('update:dialogVisible', val)
      }
    },
    goodsList: {
      get() {
          return this.goodsEcho
      },
      set(val) {
          this.$emit('update:goodsEcho', val)
      }
    }
  },
  created() {
    this.goodsList.forEach((row, index) => {
      this.$nextTick(() => {
        if(!row.fakeData) {  //假数据不允许添加选中状态
          this.$refs.multipleTable.toggleRowSelection(row, true);
        }
      })
    })
  },
  mounted() {
  },
  methods: {
    fetch(ev, loadAll) {
      this.loading = true;
      let tempForm = {};
      if(loadAll) {
        tempForm = {...this.ruleForm};
        tempForm.name = '';
      }
      this._apis.shop.getNyuanList(loadAll? tempForm: this.ruleForm).then((response)=>{
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

     //当前页码改变
    handleCurrentChange(pIndex=1) {
      this.loading = true
      this.pageNum = pIndex
      this.ruleForm.pageNum = pIndex
      this.fetch()
    },

    /* 向父组件提交选中的数据 */
    submit() {
      this.$emit('dialogDataSelected',  this.multipleSelection);
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    itemSelectable(row, index) {
      if(row.status !== 2) {
        return true;
      }
    },
    getRowKey(row) {
      return row.id
    },

    /* 添加新营销活动 */
    addNewApply(path) {
      let token = getToken('authToken')
      let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
      let userName = JSON.parse(localStorage.getItem('userInfo')) && encodeURI(JSON.parse(localStorage.getItem('userInfo')).userName)
      let tenantId = JSON.parse(localStorage.getItem('userInfo')) && encodeURI(JSON.parse(localStorage.getItem('userInfo')).tenantInfoId)
      let cid = shopInfo && shopInfo.id || ''
      let newUrl = `${process.env.DATA_API}/vue/marketing${path}?access=3&token=${token}&businessId=1&loginUserId=1&tenantId=${tenantId}&cid=${cid}&userName=${userName}`
      // let newUrl = `http://test-omo.aiyouyi.cn/vue/marketing${path}?access=3&token=${token}&businessId=1&loginUserId=1&tenantId=${tenantId}&cid=${cid}&userName=${userName}`

      let newWindow = window.open("about:blank");
      newWindow.location.href = newUrl;
    }
  }
};
</script>

<style lang="scss" scoped>
.name_wrapper{
    display: flex;
    flex-direction: row;
    align-items: center;
    img{
      width: 50px;
      height: 50px;
      display: block;
      margin-right: 10px;
      border: 1px solid #ddd;
      object-fit: contain;
    }
    p{
      width: calc(100% - 50px);
    }
}
</style>