<template>
   <div class="selfLift mh bor-radius">
    <!-- 开关 -->
    <div class="switch">
      <span class="title">上门自提</span>
      <el-switch
        @change="handleSwitch"
        v-model="isOpen"
        v-permission="['设置', '上门自提', '默认页面', '新建自提点/从地址库选择/开启/关闭']"
        active-color="#13ce66" inactive-color="#CACACF">
      </el-switch>
      <span v-permission="['设置', '上门自提', '默认页面', '新建自提点/从地址库选择/开启/关闭']">开启后，用户下单时可选择上门自提的配送方式。</span>
    </div>
    <!-- 按钮区域 -->
    <div class="btn-area">
      <el-button class="primary" type="primary" @click="handleAddSelfLift()" v-permission="['设置', '上门自提', '默认页面', '新建自提点/从地址库选择/开启/关闭']">新建自提点</el-button>
      <el-button v-if="addressTotal > 0" v-permission="['设置', '上门自提', '默认页面', '新建自提点/从地址库选择/开启/关闭']" @click="handleChooseAddress" class="text" type="text">从地址库中选择</el-button>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="loading"
      :data="dataList"
      class="table"
      style="width: 100%"
      :header-cell-style="{background:'rgba(208, 214, 228, .2)', color:'#44434B', fontSize: '14px', fontWeight: '500'}"
      >
      <el-table-column
        class-name="pickUpId table-padding"
        prop="pickUpId"
        label="自提点编号"
        fixed="left"
        width="150"
        align="left">
      </el-table-column>
      <el-table-column
        prop="pickUpName"
        label="自提点名称"
        align="left"
        width="130">
        <template slot-scope="scope">
          <div class="pickUpName" :title="scope.row.pickUpName">{{scope.row.pickUpName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop='name'
        label="联系人"
        align="center"
        width="118">
         <template slot-scope="scope">
          <div class="name" :title="scope.row.name">{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="联系电话"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址信息"
        min-width="300"
        align="left">
      </el-table-column>
      <el-table-column
        prop="pickUpStatus"
        label="状态"
        align="center"
        width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.pickUpStatus === 1">启用</span>
          <span v-if="scope.row.pickUpStatus === 0">禁用</span>
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
            <span class="table-btn" @click="goEdit(scope.row.id)" v-permission="['设置', '上门自提','默认页面', '编辑']">编辑</span>
            <span class="table-btn" :class="{'table-warning': scope.row.pickUpStatus !== 0}" v-permission="['设置', '上门自提','默认页面', '启用/禁用']" @click="handleEnableSelfLift(scope.row)">{{ getStatusTxt(scope.row) }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_styles">
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
    <component v-if="dialogVisible" :is="currentDialog" @submit="getAddressId"  :dialogVisible.sync="dialogVisible"></component>
   </div>
</template>

<script>
import utils from "@/utils";
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
      ],
      ruleForm: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      addressTotal: 0
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
    init() {
      // 获取上门自提列表数据
      this.getSelfLift()
      // 获取地址库列表是否有数据
      this.getAddressTotal()
      this.getShopInfo()
    },
    getExistEnabled() {
       const req = {
        pickUpStatus: 1, // 1 为启用
        startIndex: 1,
        pageSize: 10
      }
      return new Promise((resolve, reject) => {
        let isExistEnabled = false
        this.ApiGetSelfLiftList(req).then((res) => {
          if (res && res.list.length > 0) {
            isExistEnabled = true
          }
          resolve(isExistEnabled)
        }).catch((err) => {
          reject(err)
        })

      })
      
    },
    getShopInfo() {
      this.$store.dispatch('getShopInfo').then(response =>{
        this.isOpen = response.isOpenSelfLift === 1 ? true : false
      }).catch(error =>{
        this.$message.error(error);
      })
    },
    goEdit(id) {
      this.$router.push({ path: '/set/editSelfLift',query: { id } })
    },
    ApiEditSelfLiftById(req) {
      return new Promise((resolve, reject) => {
        this._apis.set.editSelfLiftById(req).then((res) => {
          resolve(res)
        }).catch((err) => {
          console.error(err)
          reject(err)
        })
      })
    },
    updateSelfLiftStatusById(item, pickUpStatus) {
      const id = item.id
      this.ApiEditSelfLiftById({ id, pickUpStatus }).then(() => {
        if (pickUpStatus === 0) {
          this.$message({
            duratio: 5000,
            showClose: true,
            message: '自提点已禁用！',
            type: 'success'
          });
        }
        if (pickUpStatus === 1) {
          this.$message({
            duratio: 5000,
            showClose: true,
            message: '自提点开启成功！',
            type: 'success'
          });
        }
        item.pickUpStatus = pickUpStatus
      })
    },
    // 处理当前仅启用自提点关闭逻辑
    handleCurrentOnlyEnabled(item, pickUpStatus) {
      const id = item.id

      const p1 = this.ApiEditSelfLiftById({ id, pickUpStatus })
      const data = {
          isOpenSelfLift: 0
      }
      const p2 = this.updateShopInfo(data)
      Promise.all([p1, p2]).then(() => {
        this.isOpen = false
        item.pickUpStatus = pickUpStatus
        this.$message({
          duratio: 5000,
          showClose: true,
          message: '上门自提已关闭，自提点已禁用!',
          type: 'success'
        });
      }).catch(() => {

      })
    },
    // 启用禁用自提点
    handleEnableSelfLift(item) {
      // pickUpStatus === 1 当前状态 1 启用 0 禁用
      if (item.pickUpStatus === 1) {
        if (!this.isOpen) {
          this.confirm({
            title: "",
            iconWarning: true,
            text: '禁用后用户将不能使用该自提点进行下单，您确定要禁用吗？',
            confirmText: '确定',
            showCancelButton: true
          }).then(() => {
            this.updateSelfLiftStatusById(item, 0)
          })
          return false
        }
        const req = {
          pickUpStatus: 1, // 1 为启用
          startIndex: 1,
          pageSize: 10
        }
        this.ApiGetSelfLiftList(req).then((res) => {
          if (res && res.list.length === 1) {
            this.confirm({
              title: "",
              iconWarning: true,
              text: '您正在禁用当前仅有的启用自提点，禁用后，上门自提的配送方式将关闭，用户将不能使用上门自提，您确定要禁用吗？',
              confirmText: '确定',
              showCancelButton: true
            }).then(() => {
              // 
              this.handleCurrentOnlyEnabled(item, 0)

              // this.updateSelfLiftStatusById(item, 0)
            })
          } else {
            this.confirm({
              title: "",
              iconWarning: true,
              text: '禁用后用户将不能使用该自提点进行下单，您确定要禁用吗？',
              confirmText: '确定',
              showCancelButton: true
            }).then(() => {
              this.updateSelfLiftStatusById(item, 0)
            })
          }
        })
      }
      if (item.pickUpStatus === 0) {
        this.updateSelfLiftStatusById(item, 1)
      }
    },
    //  获取启用禁用文案
    getStatusTxt(item) {
      return item.pickUpStatus === 0 ? '启用' : '禁用'
    },
    handleAddSelfLift() {
      this.$router.push({ path: '/set/addSelfLift'})
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
      // console.log(1111)
      this._apis.set.getAddressList(req).then((res) => {
        this.addressTotal = res.total
      }).catch((err) => {
        this.$message.error(err || '获取数据失败')
      })
    },
    getReqData() {
      const data = Object.create(null)
      data.startIndex = this.ruleForm.pageNo
      data.pageSize = this.ruleForm.pageSize
      return data
    },
    ApiGetSelfLiftList(req) {
      return new Promise((resolve, reject) => {
        this._apis.set.getSelfLiftList(req).then((res) => {     
          resolve(res)
        }).catch((err) => {
          console.error(err)
          reject(err)
        })
      })
    },
    getSelfLift() {
      this.loading = true
      const req = this.getReqData()
      this.ApiGetSelfLiftList(req).then((res) => {
        this.dataList = res.list
        this.total = +res.total || 0
      }).catch((err) => {
        this.$message.error(err || '获取数据失败')
      }).finally(() => {
        this.loading = false
      })
    },
    updateShopInfo(data) {
      const id = this.cid;
      // console.log('--data---',data)
      const req = { id, ...data }
      // console.log('--req---',req)
      return new Promise((resolve, reject) => {
        this._apis.shopInfo.updateShopInfo(req).then((data) => {
          this.$store.dispatch('getShopInfo');
          resolve(data)
          
        }).catch((err) => {
          // this.isOpen = false
          this.$message.error(err || '保存失败')
          reject(err)
        })
      })
      
    },
    ApiGetHomePage() {
      return new Promise((resolve, reject) => {
        this._apis.shop.getHomePage({pageTag:0}).then(response => {
          resolve(response)
        }).catch(error => {
          console.error(error)
          reject(error)
        });
      })
      
    },
    openSelfLiftSuccess(isHasLocation = false, pageId) {
      const data = {
        isOpenSelfLift: 1
      }
      this.updateShopInfo(data).then(() => {
        let showConfirmButton = true
        let text = '上门自提开启成功！'
        if (!isHasLocation) {
          showConfirmButton = false
          let url = `${location.protocol}//${location.host}/bp/shop/m_wxShopIndex`;
          if(pageId){
            url = `${location.protocol}//${location.host}/bp/shop/m_shopEditor?pageId=${pageId}`;
          }
          
          text = `<span class="success" style="font-size:16px;color:rgba(68,67,75,1);">上门自提开启成功！</span><span class="prompt" style="font-size:12px;color:rgba(68,67,75,1);">您还没有装修位置组件<a href="${url}" style="color:#655EFF;text-decoration: underline;" target="_blank">去装修 &gt;</a></span>`
          this.confirm({
            title: "",
            iconSuccess: true,
            text,
            showConfirmButton,
            confirmText: '我知道了',
            customClass: 'setting-custom',
            showCancelButton: false
          });
        } else {
          this.$message({
            duratio: 5000,
            showClose: true,
            message: text,
            type: 'success'
          });
        }
        
        if (!this.isOpen) {
          this.isOpen = true
        }
      }).catch((err) => {
        this.isOpen = false
        this.$message.error(err || '保存失败')
      })
    },
    openSelfLift() {
      this.getExistEnabled().then((isExistEnabled) => {
        // console.log('isExistEnabled',isExistEnabled)
        if (isExistEnabled) {
          this._apis.shop.getHomePage({pageTag:0}).then((res) => {
            //如果店铺主页不存在，则正常提示去装修，去装修跳转至店铺主页即可
            if(!res){
              this.openSelfLiftSuccess(false, false);
              return;
            }
            const str = utils.uncompileStr(res.pageData);
            const pageData = JSON.parse(str);
            if (pageData && pageData.length > 0) {
              const curr = Array.from(pageData).find(item => {
                return item.type === 'location'
              })
              // 有店铺首页装修位置
              if (curr) {
                this.openSelfLiftSuccess(true)
              } else {
                // 没有店铺装修位置
                this.openSelfLiftSuccess(false, res.id)
              }
            }
            // console.log('--pageData--',pageData)
          }).catch((err) => {
            this.$message.error(err)
          })
        } else {
          this.confirm({
            title: "",
            text: '当前没有启用的自提点信息，请先新建或启用自提点后再开启。',
            confirmText: '我知道了',
            cancelButtonText: '去新建',
            customClass: 'setting-custom',
            distinguishCancelAndClose: true
          }).then(() => {
            // 关闭弹窗
          }).catch((action)=> {
            // console.log('action',action)
            if (action === 'cancel') this.$router.push({ path: '/set/addSelfLift' })
          }).finally(() => {
            this.isOpen = false
          });
        }
      })
    },
    closeSelfLift() {
       this.confirm({
        title: "",
        iconWarning: true,
        text: '关闭后用户下单时将不能再使用上门自提，您确定要关闭吗？',
        confirmText: '确定',
        showCancelButton: true
      }).then(() => {
        const data = {
          isOpenSelfLift: 0
        }
        this.updateShopInfo(data).then(() => {
           this.$message({
            duratio: 5000,
            showClose: true,
            message: '已成功关闭上门自提！',
            type: 'warning'
          });
          // this.confirm({
          //   title: "提示",
          //   iconSuccess: true,
          //   text: '已成功关闭上门自提！',
          //   confirmText: '我知道了',
          //   showCancelButton: false
          // });
          this.isOpen = false
        }).catch((err) => {
          this.isOpen = true
          this.$message.error(err || '保存失败')
        })
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
    handleSizeChange(val) {
      this.ruleForm.pageNo = 1
      this.ruleForm.pageSize = val
      this.getSelfLift()
    },
    handleCurrentChange(val) {
      this.ruleForm.pageNo = val
      this.getSelfLift()
    }
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
    .primary, .text {
      font-size: 14px;
    }
    
  }
  .table {
    margin-top: 20px;
    /deep/ th.is-leaf {
      border:0;
      .cell {
        font-size: 14px;
        font-weight: 500;
        color: #44434B;
      }
    }
    .pickUpName, .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
  }
}
</style>