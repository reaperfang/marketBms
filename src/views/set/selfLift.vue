<template>
   <div class="selfLift">
    <!-- 开关 -->
    <div class="switch">
      <span class="title">上门自提</span>
      <el-switch
        @change="handleSwitch"
        v-model="isOpen"
        active-color="#13ce66"
        inactive-color="#cacfcb">
      </el-switch>
      <span>开启后，用户下单时可选择上门自提的配送方式。</span>
    </div>
    <!-- 按钮区域 -->
    <div class="btn-area">
      <el-button class="primary" type="primary">新增自提点</el-button>
      <el-button v-if="addressTotal > 0" @click="handleChooseAddress" class="text" type="text">从地址库中选择</el-button>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="loading"
      :data="dataList"
      class="table"
      style="width: 100%"
      :header-cell-style="{background:'rgba(208, 214, 228, .2)', color:'#44434B', fontSize: '14px', fontWeight: '400'}"
      >
      <el-table-column
        prop="id"
        label="自提点编号"
        width="150"
        align="left">
      </el-table-column>
      <el-table-column
        prop="name"
        label="自提点名称"
        align="left"
        width="130">
      </el-table-column>
      <el-table-column
        prop='userName'
        label="联系人"
        align="left"
        width="118">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="联系电话"
        align="center"
        width="142">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址信息"
        align="left">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="编辑时间"
        align="center"
        width="220">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <div class="opeater">
            <el-button class="btn" @click="goEdit(scope.row.id)" type="text">编辑</el-button>
            <span>|</span>
            <el-button class="btn" type="text">禁用</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_styles">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="ruleForm.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="ruleForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total*1">
      </el-pagination>
    </div>
    <component v-if="dialogVisible" :is="currentDialog" @submit="getAddressId"  :dialogVisible.sync="dialogVisible"></component>
   </div>
</template>

<script>
import DialogChooseAddress from './dialogs/dialogChooseAddress'
export default {
  components: {
    DialogChooseAddress
  },

  props: {},

  data () {
    return {
      dialogVisible: false,
      currentDialog: null,
      isOpen: false, //  是否开启上门自提
      loading: false,
      isExistEnabled: false, // 是否存在启用的自提点信息
      dataList: [
        {
          id: 11111,
          name: '一点自提点',
          userName: '张三',
          mobile: '17686557723',
          address: '北京市大兴区地盛西路1号',
          status: 1,
          updateTime: '2019-11-06 10:12:28'
        }
      ],
      ruleForm: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      addressTotal: 0
    }
  },

  computed: {},

  watch: {},

  created() {
    this.init()
  },

  mounted() {},

  methods: {
    init() {
      // 获取上门自提列表数据
      this.getSelfLift()
      // 获取地址库列表是否有数据
      this.getAddressTotal()
    },
    getAddressId(val) {
      const addressId = val
      if (addressId) this.$router.push({ path: '/set/addSelfLift', query: { addressId }})
    },
    handleChooseAddress() {
      this.dialogVisible = true
      this.currentDialog = 'DialogChooseAddress'
    },
    getAddressTotal() {
      const req = {
        startIndex: 1,
        pageSize: 10
      }
      console.log(1111)
      this._apis.set.getAddressList(req).then((res) => {
        this.addressTotal = res.total
      }).catch((err) => {
        this.$message.error(err || '获取数据失败')
      })
    },
    getReqData() {
      const data = Object.create(null)
      data.pageNo = this.ruleForm.pageNo
      data.pageSize = this.ruleForm.pageSize
      return data
    },
    getSelfLift() {
      const req = this.getReqData()
      this._apis.set.getSelfLiftList(req).then((res) => {
        this.dataList = res.list
        this.total = res.total || 0
      }).catch((err) => {
        this.$message.error(err || '获取数据失败')
      })
    },
    updateShopInfo(data) {
      return new Promise((resolve, reject) => {
        this._apis.set.updateShopInfo((data) => {
          this.$store.dispatch('getShopInfo');
          resolve(data)
          
        }).catch((err) => {
          // this.isOpen = false
          this.$message.error(err || '保存失败')
          reject(err)
        })
      })
      
    },
    openSelfLift() {
      if (this.total > 0) {
        // 调用开启接口
        const data = {
          isOpenSelfLift: 1
        }
        this.updateShopInfo(data).then(() => {
          this.confirm({
            title: "提示",
            iconSuccess: true,
            text: '已成功开启上门自提！',
            confirmText: '我知道了',
            showCancelButton: false
          });
          if (!this.isOpen) {
            this.isOpen = true
          }
        }).catch(() => {
          this.isOpen = false
        })
      } else {
        this.confirm({
          title: "提示",
          text: '当前没有启用的自提点信息，请先新建或启用自提点后再开启。',
          confirmText: '我知道了',
          cancelButtonText: '去新建'
        }).then(() => {
          // 关闭弹窗
        }).catch(()=> {
          this.$router.push({ path: '/set/addSelfLift' })
        }).finally(() => {
          this.isOpen = false
        });
      }
    },
    closeSelfLift() {
      const data = {
        isOpenSelfLift: 0
      }
      this.updateShopInfo(data).then(() => {
        this.confirm({
          title: "提示",
          iconSuccess: true,
          text: '已成功关闭上门自提！',
          confirmText: '我知道了',
          showCancelButton: false
        });
        this.isOpen = false
      }).catch(() => {
        this.isOpen = true
      })
    },
    handleSwitch(val) {
      if (val) {
        this.openSelfLift()
      } else {
        this.closeSelfLift()
      }
    },
    handleSizeChange() {},
    handleCurrentChange() {}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.selfLift {
  background-color: #fff;
  padding: 0 20px 20px 20px;
  .switch {
    padding: 20px 0;
    border-bottom: 1px solid #D9DEE9;
    span {
      padding: 0 20px;
      font-size:12px;
      font-weight:400;
      color:rgba(146,146,155,1);
      &:first-of-type {
        padding-left: 0;
      }
    }
    >.title {
      font-size:16px;
      font-weight:500;
      color:rgba(68,67,75,1);
      line-height:22px;
    }
  }
  .btn-area {
    padding-top: 30px;
  }
  .table {
    padding-top: 20px;
    /deep/ th.is-leaf {
      border:0;
    }
    /deep/ th>.cell {
      line-height: 30px;
    }
    &::before {
      height: 0;
    }
    .opeater {
      display: flex;
      line-height:20px;
      font-size:14px;
      justify-content: center;
      span {
        width: 1px;
        line-height: 20px;
        padding: 0 5px;
        color: #DADAE3;
        padding: 9px 15px;
      }
      .btn {
        color:rgba(101,94,255,1);
      }
      .disabled {
        color:rgba(101, 94, 255, .5)
      }
    }
  }
}
</style>