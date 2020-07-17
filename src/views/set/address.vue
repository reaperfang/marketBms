<template>
   <div class="address">
     <div class="btn-area"><el-button type="primary" @click="goAddressNew()">新建地址</el-button></div>
     <div class="list-area">
       <div class="total">
        <span>全部 <em>{{ total }}</em> 项</span>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        style="width: 100%"
        :header-cell-style="{background:'rgba(208, 214, 228, .2)', color:'#44434B', fontSize: '14px', fontWeight: '400'}"
        >
        <el-table-column
          prop="address"
          label="地址"
          align="left">
        </el-table-column>
        <el-table-column
          prop="contactPerson"
          label="联系人"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop='mobile'
          label="联系电话"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="type"
          label="地址类型"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="编辑时间"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="150">
          <template slot-scope="scope">
            <div class="opeater">
              <el-button class="btn" @click="goAddressEdit(scope.row.id)" type="text">编辑</el-button>
              <span>|</span>
              <el-button class="btn" :class="[scope.row.isDefault ? 'disabled' : '']" @click="delAddress(scope.row)" type="text">删除</el-button>
            </div>
          </template>
        </el-table-column>
        <div slot="empty" class="empty">
          <div>
            <img src="@/assets/images/set/icon-table-empty.png">
          </div>
          <p>
            暂无数据，去
            <router-link :to="{ path: '/set/addressUpdate'} ">新建地址</router-link>
          </p>
        </div>
      </el-table>
      <div class="page_styles" v-if="dataList.length > ruleForm.pageSize">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="ruleForm.pageSize"
          layout="sizes, prev, pager, next"
          :total="total*1">
        </el-pagination>
      </div>
     </div>
   </div>
</template>

<script>
export default {
  components: {},

  data () {
    return {
      total: 0,
      loading: false,
      dataList: [
        {
        id: 1,
        contactPerson: 'bill', // 联系人
        mobile: '15712899623', // 手机号
        sendAddress: '数码庄园', // 联系地址
        address: '1111', // 详细地址
        type: 3, // 地址类型
        lat: null,
        lng: null,
        addressCode: null, // code码
        province: null, // 省
        city: null, // 市
        area: null, // 区
        defaultDeliveryAddress: 1,
        defaultReturnAddress: 1
      }
      ],
      ruleForm: {
        pageNo: 1,
        pageSize: 0
      }
    }
  },

  computed: {
    cid(){
      let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
      return shopInfo.id
    }
  },

  watch: {},

  created() {
    this.init()
  },

  mounted() {},

  methods: {
    init() {
      this.getAddressList()
    },
    getAddressList() {
      const req = this.ruleForm
      // api
    },
    handleSizeChange(val) {
      this.ruleForm.pageNo = 1
      this.ruleForm.pageSize = val
      this.getAddressList()
    },
    handleCurrentChange(val) {
      this.ruleForm.pageNo = val
      this.getAddressList()
    },
    goAddressNew() {
      this.$router.push({ path: '/set/addressUpdate' }) 
    },
    hanldeOpenDelivery(id) {
      this.confirm({
        title: "提示",
        iconWarning: true,
        text: '此地址已设置为商家配送的发货地址，修改后商家配送设置也将修改，您确定要修改吗？',
        confirmText: '确定',
        showCancelButton: true,
        customClass: 'address-update'
      }).then(() => {
          this.$router.push({ path: '/set/addressUpdate', query: { id } }) 
      }).catch(() => {
      });
    },
    hanldeOpenDeliveryDelAddress(id) {
      this.confirm({
        title: "提示",
        iconWarning: true,
        text: '商家配送已开启并使用此地址为发货地址，删除后商家配送功能将自动关闭，您确定要删除吗？',
        confirmText: '确定',
        showCancelButton: true,
        customClass: 'address-update'
      }).then(() => {
        this.delAddressById(id)
      }).catch(() => {
      });
    },
    // 判断地址是否为商家配送地址
    isMerchantDeliverAddressById(id) {
      return true
    },
    goAddressEdit(id) {  
      id = 1
      // 判断是否是商家配送地址// 
      if (!this.isMerchantDeliverAddressById(id)) {
         this.$router.push({ path: '/set/addressUpdate', query: { id } }) 
      } else {
        const isOpenMerchantDeliver = this.isOpenMerchantDeliver()
        isOpenMerchantDeliver.then((isOpen) => {
          console.log('dev',isOpen)
          // 是否打开
          if (isOpen) {
            this.hanldeOpenDelivery(id)
          } else {
            this.$router.push({ path: '/set/addressUpdate', query: { id } }) 
          }
        })
      }
    },
    // 是否开启商家配送
    isOpenMerchantDeliver() {
      const id = this.cid
      return new Promise((resolve, reject) => {
        this._apis.set.getShopInfo({ id }).then(res => {
          console.log("----",res)
          const isOpenMerchantDeliver = res && res.isOpenMerchantDeliver === 1 ? true : false // 是否开启商家配送 0-否 1-是
          resolve(isOpenMerchantDeliver)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 删除操作，默认地址处理逻辑
    handleDelAddress(row) {
      this.confirm({
        title: "提示",
        icon: true,
        text: '确定要删除此地址信息吗？',
        confirmText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // 调用删除接口方法
        this.delAddressById(row.id)
      });
    },
    // 处理删除默认地址
    handleDelDefaultAddress() {
      this.confirm({
        title: "提示",
        icon: true,
        text: '默认地址不可删除',
        confirmText: '我知道了',
        showCancelButton: false
      }).then(() => {
      });
    },
    delAddressById(id) {
      // 删除api
      this.confirm({
        title: "提示",
        iconSuccess: true,
        text: '保存成功',
        confirmText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.ruleForm.pageNo = 1
        this.getAddressList()
      }).catch(()=> {
        
      });
    },
    delAddress(row) {
      let id = 1
      row.id = 1
      // 是否默认地址
      // 删除逻辑
      // 1 默认地址处理，不删除，给提示框
      // 2 开启商家配送，同时商家配送使用此地址（最新地址），删除时要同时关闭商家配送
      // 3 删除地址
      // 3 
      const isDefaultAddress = false // mock
      if (!isDefaultAddress) {
          // 判断是否是商家配送地址// 
        if (!this.isMerchantDeliverAddressById(id)) {
           this.handleDelAddress(row)
        } else {
          const isOpenMerchantDeliver = this.isOpenMerchantDeliver()
          isOpenMerchantDeliver.then((isOpen) => {
            console.log('dev',isOpen)
            // 是否打开
            if (isOpen) {
              this.hanldeOpenDeliveryDelAddress(id) // 
            } else {
               this.handleDelAddress(row)
            }
          })
        }
        // this.handleDelAddress(row)
      } else {
        this.handleDelDefaultAddress(row)
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.address {
  background: #fff;
  padding: 20px;
  .btn-area {
    position: relative;
    padding-bottom: 20px;
    &::after {
      position: absolute;
      content: ' ';
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      border-top: 1px dashed rgba(211, 211, 211, 1);
    }
  }
  .list-area {
    padding-top: 30px;
    .total {
      font-size:14px;
      font-weight:400;
      color:rgba(146,146,155,1);
      line-height:20px;
      padding-bottom: 10px;
      em {
        font-style: normal;
        color:#44434B;
      }
    }
    .table {
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

  .empty {
    width: 200%;
    background-color: rgba(208, 214, 228, .05);
    position: relative;
    left: -50%;

    img {
      display: block;
      width: 199px;
      height: 140x;
      padding-top: 107px;
      margin: 0 auto;
    }
    p {
      padding: 12px 0 190px 0;
      text-align: center;
      font-size: 14px;
      color: rgba(146, 146, 155, 1);
      a {
        color:rgba(101, 94, 255, 1)
      }
    }
  }
}
</style>