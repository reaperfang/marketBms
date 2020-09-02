<template>
   <div class="address">
     <div class="btn-area"><el-button type="primary" @click="goAddressNew()" v-permission="['设置','地址库', '默认页面', '新建地址']">新建地址</el-button></div>
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
          min-width="300"
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
          width="200">
        </el-table-column>
        <el-table-column
          prop="type"
          label="地址类型"
          align="center"
          width="200">
          <template slot-scope="scope">
            {{ getAddressTypeTxt(scope.row) }}
          </template>
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
          fixed="right"
          width="150">
          <template slot-scope="scope">
            <div class="opeater">
              <el-button class="btn" @click="goAddressEdit(scope.row.id)" type="text"  v-permission="['设置','地址库', '默认页面', '编辑']">编辑</el-button>
              <span>|</span>
              <el-button class="btn" v-permission="['设置','地址库', '默认页面', '删除']" :class="[getDefaultAddress(scope.row) ? 'disabled' : '']" @click="delAddress(scope.row)" type="text">删除</el-button>
            </div>
          </template>
        </el-table-column>
        <div slot="empty" class="empty">
          <div>
            <img src="@/assets/images/set/icon-table-empty.png">
          </div>
          <p>
            暂无数据，去
            <router-link :to="{ path: '/set/addressAdd'}" v-permission="['设置','地址库', '默认页面', '新建地址']">新建地址</router-link>
          </p>
        </div>
      </el-table>
      <div class="page_styles" v-if="total*1 > 20">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="ruleForm.pageNo"
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
      dataList: [],
      ruleForm: {
        pageNo: 1,
        pageSize: 20
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
    getDefaultAddress(item) {
      return item.isDefaltSenderAddress === 1 || item.isDefaltReturnAddress === 1
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
        title: "提示",
        iconWarning: true,
        text: '此地址已设置为商家配送的发货地址，修改或删除后商家配送设置也将修改，您确定要修改吗？',
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
        this._apis.set.updateShopInfo({...data, id }).then(response =>{
          this.$store.dispatch('getShopInfo');    
          resolve(response)
        }).catch(error =>{
          reject(error)
        })
      })
    },
    // 关闭商家配送
    closeMerchantDeliver() {
      return new Promise((resolve, reject) => {
        this.updateShopInfo({ isOpenMerchantDeliver: 0 }).then(response =>{
            resolve(response)
        }).catch(error =>{
          reject(error)
          // this.loading = false
        })
      })
    },
    hanldeOpenDeliveryDelAddress(row) {
      // 需要查看发货地址数量是否剩下1条？？？
      const id = row.id
      const addressType = row.addressType
      const req = Object.create(null)
      req.cid  = this.cid
      req.startIndex = 1
      req.pageSize = 20
      req.addressType = addressType
      this.ApiGetAddressList(req).then((res) => {
        // 仅有一条发货地址信息，同时商家配送已开启，此时要删除该发货地址时，弹框提示如下
        if (res && res.total == 1) {
          this.confirm({
            title: "提示",
            iconWarning: true,
            text: '商家配送已开启并使用此地址为发货地址，删除后商家配送功能将自动关闭，您确定要删除吗？',
            confirmText: '确定',
            showCancelButton: true,
            customClass: 'address-update'
          }).then(() => {
            const p1 = this.closeMerchantDeliver()
            const p2 = this.ApiDelAddressById(id, addressType)
            Promise.all([p1, p2]).then((arr) => {
              console.log('arr',arr)
               this.ruleForm.pageNo = 1
              const req = this.getReqData(this.ruleForm)
              this.getAddressList(req)
              // if(arr && arr.length > 0) {
                this.$message.success('保存成功')
              // }
            }).catch((err) => {
              this.$message.error(err || '保存失败')
            })
          });
        } else {
          this.confirm({
            title: "提示",
            iconWarning: true,
            text: '此地址已设置为商家配送的发货地址，修改或删除后商家配送设置也将修改，您确定要修改吗？',
            confirmText: '确定',
            showCancelButton: true,
            customClass: 'address-update'
          }).then(() => {
            this.ApiDelAddressById(id, addressType)
          }).catch((err) => {
          });
        }
      }).catch((err) => {
        console.log(err)
      })
      
    },
    // 判断地址是否为商家配送地址
    getMerchantDeliverAddressById(id) {
      return new Promise((resolve, reject) => {
        this._apis.set.getAddressDefaultSender().then((response) => {
          resolve(response)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    goAddressEdit(id) {
      // 判断是否是商家配送地址// 
      const p2 = this.isOpenMerchantDeliver() // 是否开启商家配送
      const p1 = this.getMerchantDeliverAddressById() // 获取商家配送默认地址
      Promise.all([p1, p2]).then((result) => {
        const [ response, isOpen ] = result
        if (response && +response.id === +id) {
            // 是否打开
            if (isOpen) {
              this.hanldeOpenDelivery(id)
            } else {
              this.$router.push({ path: '/set/addressUpdate', query: { id } }) 
            }
        } else {
          this.$router.push({ path: '/set/addressUpdate', query: { id } }) 
        }
      }).catch((errors) => {
        console.log(errors)
      })
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
        this.delAddressById(row.id, row.addressType)
      });
    },
    // 处理删除默认地址
    handleDelDefaultAddress() {
      this.confirm({
        title: "提示",
        icon: true,
        text: '默认地址不可删除',
        confirmText: '我知道了',
        customClass: 'address-disable-del',
        showCancelButton: false
      }).then(() => {
      });
    },
    ApiDelAddressById(id, addressType) {
      return new Promise((resolve, reject) => {
        this._apis.set.delAddressById({ id, addressType }).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    delAddressById(id, addressType) {
      // 删除api
      this.ApiDelAddressById(id, addressType).then(() => {
        this.ruleForm.pageNo = 1
        const req = this.getReqData(this.ruleForm)
        this.getAddressList(req)
        this.$message.success('保存成功')
        // this.confirm({
        //   title: "提示",
        //   iconSuccess: true,
        //   text: '保存成功',
        //   confirmText: '确定',
        //   cancelButtonText: '取消'
        // }).then(() => {
        // })
      }).catch((error) => {
        this.$message.error(error || '保存失败')
      })
      
    },
    delAddress(row) {
      // 是否默认地址
      // 删除逻辑
      // 1 默认地址处理，不删除，给提示框
      // 2 开启商家配送，同时商家配送使用此地址（最新地址），删除时要同时关闭商家配送
      // 3 删除地址
      // 3 
      const id = row.id
      const addressType = row.addressType
      const isDefaultAddress = row.isDefaltReturnAddress === 1 || row.isDefaltSenderAddress === 1 // mock
      if (!isDefaultAddress) {
          // 判断是否是商家配送地址// 
        const p2 = this.isOpenMerchantDeliver() // 是否开启商家配送
        const p1 = this.getMerchantDeliverAddressById() // 获取商家配送默认地址
        Promise.all([p1, p2]).then((result) => {
          const [ response, isOpen ] = result
          console.log(response && +response.id === +id)
          if (response && +response.id === +id) {
              // 是否打开
              if (isOpen) {
                this.hanldeOpenDeliveryDelAddress(row)
              } else {
                this.handleDelAddress(row)
              }
          } else {
            this.handleDelAddress(row)
          }
        }).catch((errors) => {
          console.log(errors)
        })
        // if (!this.isMerchantDeliverAddressById(id)) {
        //    this.handleDelAddress(row)
        // } else {
        //   const isOpenMerchantDeliver = this.isOpenMerchantDeliver()
        //   isOpenMerchantDeliver.then((isOpen) => {
        //     console.log('dev',isOpen)
        //     // 是否打开
        //     if (isOpen) {
        //       this.hanldeOpenDeliveryDelAddress(id) // 
        //     } else {
        //        this.handleDelAddress(row)
        //     }
        //   })
        // }
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