<template>
   <div class="address mh bor-radius">
     <div class="btn-area"><el-button type="primary" @click="goAddressNew()" v-permission="['设置','地址管理', '默认页面', '新建地址']">新建地址</el-button></div>
     <div class="list-area">
       <div class="total">
        <span>全部 <em>{{ total }}</em> 项</span>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        style="width: 100%"
        :header-cell-style="{background:'rgba(208, 214, 228, .2)', color:'#44434B', fontSize: '14px', fontWeight: '500'}"
        >
        <el-table-column
          prop="address"
          label="地址"
          min-width="300"
          fixed="left" 
          class-name="table-padding"
          align="left">
          <template slot-scope="scope">
            {{scope.row.address}} {{scope.row.addressDetail}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="联系人"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop='mobile'
          label="联系电话"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="type"
          label="地址类型"
          align="center"
          min-width="200">
          <template slot-scope="scope">
            {{ getAddressTypeTxt(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="编辑时间"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          header-align="center"
          class-name="table-padding"
          width="117">
          <template slot-scope="scope">
            <div class="opeater table-operate">
              <span class="table-btn" @click="goAddressEdit(scope.row.id)" v-permission="['设置','地址管理', '默认页面', '编辑']">编辑</span>
              <span class="table-btn table-warning" v-permission="['设置','地址管理', '默认页面', '删除']" :class="[getDefaultAddress(scope.row) ? 'disabled' : '']"  @click="delAddress(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
        <div slot="empty" class="empty">
          <div>
            <img src="@/assets/images/set/icon-table-empty.png">
          </div>
          <p>
            暂无数据，去
            <router-link :to="{ path: '/set/addressAdd'}" v-permission="['设置','地址管理', '默认页面', '新建地址']">新建地址</router-link>
          </p>
        </div>
      </el-table>
      <div class="page_styles" v-if="total*1 > 20">
        <el-pagination
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="ruleForm.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="ruleForm.pageSize"
          layout="prev, pager, next, sizes"
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
      dataList: [],
      ruleForm: {
        pageNo: 1,
        pageSize: 20
      }
    }
  },

  computed: {
    cid(){
      let shopInfo = this.$store.getters.shopInfos
      return shopInfo.id
    }
  },

  watch: {},

  created() {
    this.init()
  },

  mounted() {},

  methods: {
    getDefaultAddress(item) {
      console.log('item',item)
      return item.isDefaltSenderAddress === 1 || item.isDefaltReturnAddress === 1 || item.isBindThirdsend === 1
    },
    getAddressTypeTxt(item) {
      console.log('item',item)
      if (!item) return ''
      let txt = ''
      switch(item.addressType) {
        case 0:
          txt = item.isDefaltSenderAddress === 1 ? '默认发货地址': '发货地址'
          break;
        case 1:
          txt = item.isDefaltReturnAddress === 1 ? '默认退货地址' : '退货地址'
          break;
        case 2:
          txt = item.isDefaltSenderAddress === 1 ? '默认发货地址': '发货地址'
          txt += '/'
          txt += item.isDefaltReturnAddress === 1 ? '默认退货地址' : '退货地址'
          break;
      }
      return txt
    },
    getReqData(req) {
      const data = Object.create(null)
      data.cid  = this.cid
      data.startIndex = req.pageNo
      data.pageSize = req.pageSize
      return data
    },
    init() {
      const req = this.getReqData(this.ruleForm)
      this.getAddressList(req)
    },
    ApiGetAddressList(req) {
      return new Promise((resolve, reject) => {
        this._apis.set.getAddressList(req).then((res) => {
          resolve(res)
        }).catch((err) => {
        reject(err)
        })
      })
    },
    getAddressList(req) {
      this.loading = true
      this.ApiGetAddressList(req).then((res) => {
        console.log(res)
        if (res) {
          this.dataList = res.list
          this.total = res.total
        }
      }).catch((err) => {
        this.$message.error(err || '获取数据失败')
      }).finally(() => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.ruleForm.pageNo = 1
      this.ruleForm.pageSize = val
      const req = this.getReqData(this.ruleForm)
      this.getAddressList(req)
    },
    handleCurrentChange(val) {
      this.ruleForm.pageNo = val
      const req = this.getReqData(this.ruleForm)
      this.getAddressList(req)
    },
    goAddressNew() {
      this.$router.push({ path: '/set/addressAdd' })
    },
    hanldeOpenDelivery(id) {
      this.confirm({
        title: "",
        iconWarning: true,
        text: '此地址已设置为同城配送的发货地址，修改或删除后同城配送设置也将修改，您确定要修改吗？',
        confirmText: '确定',
        showCancelButton: true,
        customClass: 'address-update'
      }).then(() => {
        this.$router.push({ path: '/set/addressUpdate', query: { id, source: 1  } })
      }).catch(() => {
      });
    },
    updateShopInfo(data) {
      const id = this.cid
      return new Promise((resolve, reject) => {
        this._apis.shopInfo.updateShopInfo({...data, id }).then(response =>{
          this.$store.dispatch('getShopInfo');
          resolve(response)
        }).catch(error =>{
          reject(error)
        })
      })
    },
    // 关闭商家配送
    closeCityDeliver(isCloseMerchantDeliver, isClostTh3DeliverId) {
      const req = Object.create(null)
      if (isCloseMerchantDeliver) req.isOpenMerchantDeliver = 0
      if (isClostTh3DeliverId) req.isOpenTh3Deliver = 0
      return new Promise((resolve, reject) => {
        this.updateShopInfo( req ).then(response =>{
            resolve(response)
        }).catch(error =>{
          reject(error)
          // this.loading = false
        })
      })
    },
    getSendAddressList() {
      const req = Object.create(null)
      req.cid  = this.cid
      req.startIndex = 1
      req.pageSize = 20
      req.addressType = 0
      const p1 = this.ApiGetAddressList(req)
      req.addressType = 2
      const p2 = this.ApiGetAddressList(req)
      return new Promise((resolve, reject) => {
        const res = {}
        Promise.all([p1,p2]).then(([res1, res2]) => {
          console.log(res1, res2)
          const total1 = res1 ? parseInt(res1.total) : 0
          const total2 = res2 ? parseInt(res2.total) : 0
          res.total = total1 + total2
          resolve(res)
        }).catch((err) => {
          // this.$message.error(err)
          reject(err)
        })
      })
    },
    hanldeOpenDeliveryDelAddress(row, merchantDeliverId, th3DeliverId, isOpenTh3Deliver) {
      // 需要查看发货地址数量是否剩下1条？？？
      const id = row.id
      const isBindThirdsend = isOpenTh3Deliver ? row.isBindThirdsend : 0
      // const req = Object.create(null)
      // req.cid  = this.cid
      // req.startIndex = 1
      // req.pageSize = 20
      // req.addressType = 0
      this.getSendAddressList().then((res) => {
        console.log('res',res)
        // 仅有一条发货地址信息，同时商家配送已开启，此时要删除该发货地址时，弹框提示如下
        if ((res && res.total == 1) || isBindThirdsend) {
          this.confirm({
            title: "",
            iconWarning: true,
            text: '同城配送已开启并使用此地址为发货地址，删除后同城配送功能将自动关闭，您确定要删除吗？',
            confirmText: '确定',
            showCancelButton: true,
            customClass: 'address-update'
          }).then(() => {
            const isCloseMerchantDeliver = +merchantDeliverId === +id
            const isClostTh3DeliverId = +th3DeliverId === +id
            const p1 = this.closeCityDeliver(isCloseMerchantDeliver, isClostTh3DeliverId)
            const p2 = this.ApiDelAddressById(id, isBindThirdsend)
            Promise.all([p1, p2]).then((arr) => {
              console.log('arr',arr)
              this.ruleForm.pageNo = 1
              const req = this.getReqData(this.ruleForm)
              this.getAddressList(req)
              // if(arr && arr.length > 0) {
                this.$message.success('删除成功')
              // }
            }).catch((err) => {
              this.$message.error(err || '删除失败')
            })
          });
        } else {
          this.confirm({
            title: "",
            iconWarning: true,
            text: '此地址已设置为同城配送的发货地址，修改或删除后同城配送设置也将修改，您确定要修改吗？',
            confirmText: '确定',
            showCancelButton: true,
            customClass: 'address-update'
          }).then(() => {
            this.delAddressById(id, isBindThirdsend)
          }).catch((err) => {
          });
        }
      }).catch((err) => {
        console.log(err)
      })

    },
    // 获取商家配送地址
    getMerchantDeliverAddressById(id) {
      return new Promise((resolve, reject) => {
        this._apis.set.getAddressDefaultSender({ isBindShopsend: 1 }).then((response) => {
          resolve(response)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    // 获取三方配送发货地址
    getTh3DeliverAddressById() {
      return new Promise((resolve, reject) => {
        this._apis.set.getAddressDefaultSender({ isBindThirdsend: 1 }).then((response) => {
          resolve(response)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    /**
     * 1 获取商家配送地址id和三方配送地址id
     * 2 获取是否开启商家配送
     * 3 如果开启则拿到获取的商家配送地址id与当前要编辑的id进行对比，一致则提示
     * 4 获取是否开启三方配送
     * 5 如果开启，则拿获取的商家配送地址id与当前要编辑的id进行对比，一致则提示
     */
    goAddressEdit(id) {
      // 判断是否开启同城配送地址// 
      const p1 = this.isOpenCityDeliver()
      const p2 = this.getMerchantDeliverAddressById() // 获取商家配送默认地址
      const p3 = this.getTh3DeliverAddressById() // 获取三方配送默认地址
      Promise.all([p1, p2, p3]).then((result) => {
        const [ { isOpenMerchantDeliver, isOpenTh3Deliver }, merchantDeliver, th3Deliver ] = result
        console.log('------result-----',result)
        const isOpen = (merchantDeliver && +merchantDeliver.id === +id && isOpenMerchantDeliver) || (th3Deliver && +th3Deliver.id === +id && isOpenTh3Deliver)
        if (isOpen) {
          this.hanldeOpenDelivery(id)
        } else {
           this.$router.push({ path: '/set/addressUpdate', query: { id } }) 
        }
      }).catch((errors) => {
        console.log(errors)
      })
    },
    // 是否开启同城配送
    isOpenCityDeliver() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('getShopInfo').then(res => {
          console.log("----",res)
          const isOpenMerchantDeliver = res && res.isOpenMerchantDeliver === 1 ? true : false // 是否开启商家配送 0-否 1-是
          const isOpenTh3Deliver = res && res.isOpenTh3Deliver === 1 ? true : false // 是否开启三方配送 0-否 1-是
          resolve({isOpenMerchantDeliver, isOpenTh3Deliver })
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 删除操作，默认地址处理逻辑
    handleDelAddress(row, isOpenTh3Deliver) {
      // 如果三方配送开启则传人isBindThirdsend，否则设为0；
      const isBindThirdsend = isOpenTh3Deliver ? row.isBindThirdsend : 0
      this.confirm({
        title: "",
        iconWarning: true,
        text: '确定要删除此地址信息吗？',
        confirmText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // 调用删除接口方法
        this.delAddressById(row.id, isBindThirdsend)
      });
    },
    // 处理删除默认地址
    handleDelDefaultAddress() {
      this.confirm({
        title: "",
        iconWarning: true,
        text: '默认地址不可删除',
        confirmText: '我知道了',
        customClass: 'address-disable-del',
        showCancelButton: false
      }).then(() => {
      });
    },
    ApiDelAddressById(id, isBindThirdsend) {
      return new Promise((resolve, reject) => {
        this._apis.set.delAddressById({ id, isBindThirdsend }).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    delAddressById(id, isBindThirdsend) {
      // 删除api
      this.ApiDelAddressById(id, isBindThirdsend).then(() => {
        this.ruleForm.pageNo = 1
        const req = this.getReqData(this.ruleForm)
        this.getAddressList(req)
        this.$message.success('删除成功')
        // this.confirm({
        //   title: "提示",
        //   iconSuccess: true,
        //   text: '保存成功',
        //   confirmText: '确定',
        //   cancelButtonText: '取消'
        // }).then(() => {
        // })
      }).catch((error) => {
        this.$message.error(error || '删除失败')
      })

    },
    handleDefaultTh3DeliverAddress() {
      this.confirm({
        title: "",
        iconWarning: true,
        text: '当前地址作为同城配送-第三方配送的发货地址不可删除。',
        confirmText: '我知道了',
        customClass: 'address-disable-del',
        showCancelButton: false
      }).then(() => {
      });
    },
    delAddress(row) {
      // 是否默认地址
      // 删除逻辑
      // 1 默认地址处理，不删除，给提示框
      // 2 开启同城配送，同时同城配送使用此地址（最新地址），删除时要同时关闭同城
      // 3 删除地址
      // 3
      const id = row.id
      const addressType = row.addressType
      const isDefaultAddress = row.isDefaltReturnAddress === 1 || row.isDefaltSenderAddress === 1
      if (isDefaultAddress) {
        this.handleDelDefaultAddress(row)
        return false
      }
      // 为三方配送地址,弹窗提示，同时不允许删除
      const isTh3DeliverAddress = row.isBindThirdsend === 1
      if (isTh3DeliverAddress) {
        this.handleDefaultTh3DeliverAddress(row)
        return false
      }
      // if (!isDefaultAddress) {
      const p1 = this.isOpenCityDeliver() // 是否开启同城配送
      const p2 = this.getMerchantDeliverAddressById() // 获取商家配送默认地址
      const p3 = this.getTh3DeliverAddressById() // 获取三方配送默认地址
      Promise.all([p1, p2, p3]).then((result) => {
        const [ { isOpenMerchantDeliver, isOpenTh3Deliver }, merchantDeliver, th3Deliver ] = result
        const merchantDeliverId = merchantDeliver && merchantDeliver.id
        const th3DeliverId = th3Deliver && th3Deliver.id
        const isOpen = (+merchantDeliverId === +id && isOpenMerchantDeliver) || (+th3DeliverId === +id && isOpenTh3Deliver)
        console.log('result',result, isOpen)
        if (isOpen) {
          this.hanldeOpenDeliveryDelAddress(row, merchantDeliverId, th3DeliverId, isOpenTh3Deliver)
        } else {
          this.handleDelAddress(row, isOpenTh3Deliver)
        }
      }).catch((errors) => {
        console.log(errors)
      })
      // } else {
      //   this.handleDelDefaultAddress(row)
      // }
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
      .opeater {
        .disabled {
          opacity: 0.5;
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
<style rel="stylesheet/scss" lang="scss">
.address-disable-del.confirm.no-cancel {
   .el-button {
    letter-spacing: 0; 
  }
}
</style>
