<template>
  <div class="authorize">
    <section class="header bor-radius">
      <h2>第三方平台授权</h2>
      <el-button @click="getCode" class="border-button">获取授权码</el-button>
    </section>
    <section class="container bor-radius" v-calcMinHeight="236" style="margin-bottom: 0;">
      <h2>授权记录</h2>
      <el-table
        v-loading="loading"
        ref="table"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{background:'rgba(208, 214, 228, .2)', color:'#44434B', fontSize: '14px', fontWeight: '500'}">
        <el-table-column
            prop=""
            min-width="100" fixed="left" class-name="table-padding"
            label="序号">
            <template slot-scope="scope">
                {{scope.$index + 1}}
            </template>
        </el-table-column>
        <el-table-column
            prop="platformType"
            align="center"
            label="平台名称">
            <template slot-scope="scope">
                {{scope.row.platformType | platformTypeFilter}}
            </template>
        </el-table-column>
        <el-table-column
            prop=""
            align="center"
            label="授权店铺">
            <template slot-scope="scope">
                {{scope.row.shopName}}
            </template>
        </el-table-column>
        <el-table-column
            prop="authCode"
            align="center"
            label="授权码">
        </el-table-column>
        <el-table-column
            prop="createTime"
            align="center"
            label="授权时间"
            width="160">
        </el-table-column>
        <el-table-column
            prop="enable"
            align="center"
            label="授权状态">
            <template slot-scope="scope">
                {{scope.row.enable | enableFilter}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="116" fixed="right" header-align="center" class-name="table-padding">
            <template slot-scope="scope">
                <div class="operate-box table-operate">
                    <span class="table-btn table-warning" v-if="scope.row.enable == 1" @click="cancelAuth(scope.row)">{{scope.row.enable == 1 ? '解除授权' : ''}}</span>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <pagination style="margin-top: 10px;" v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </section>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import store from '@/store'
import router from '@/router'

export default {
  data() {
    return {
      loading: false,
      total: 0,
      listQuery: {
          startIndex: 1,
          pageSize: 20,
      },
      list: [
        {

        }
      ],
      shopName: '',
      shopCode: '',
      applyTime: '',
      showCodeDialog: false
    }
  },
  computed: {
    cid(){
        let shopInfo = this.$store.getters.shopInfos
        return shopInfo.id
    }
  },
  created() {
    this.getShopInfo()
    //this.getShopAuthList()
  },
  filters: {
    platformTypeFilter(code) {
      if(code == 1) {
        return '数商中台'
      } else {
        return ''
      }
    },
    enableFilter(code) {
      if(code == 1) {
        return '授权中'
      } else if(code == 0) {
        return '已解绑'
      }
    }
  },
  methods: {
    getShopAuthList() {
      store.dispatch('getShopAuthList').then(() => {
        const localMsfList = this.$store.getters.shopInfos;
        let msfList = [];
        let enable = 0

        enable = +localStorage.getItem('anotherAuthEnable')
        if(localMsfList && JSON.parse(localMsfList) && JSON.parse(localMsfList).data && JSON.parse(localMsfList).data.msfList) {
          msfList = JSON.parse(localMsfList).data.msfList
        }

        store.dispatch('GenerateRoutes', {data: msfList, enable}).then(() => {
          if(store.getters.addRouters.length != 0){
            router.selfAddRoutes(store.getters.addRouters)
          }
        })
      })
      // const localMsfList = localStorage.getItem('shopInfos');
      // let msfList = [];
      // let enable = 0

      // enable = +localStorage.getItem('anotherAuthEnable')
      // if(localMsfList && JSON.parse(localMsfList) && JSON.parse(localMsfList).data && JSON.parse(localMsfList).data.msfList) {
      //   msfList = JSON.parse(localMsfList).data.msfList
      // }

      // store.dispatch('GenerateRoutes', {data: msfList, enable}).then(() => {
      //   if(store.getters.addRouters.length != 0){
      //     router.selfAddRoutes(store.getters.addRouters)
      //   }
      // })
    },
    throttle(fn, delay){
        var timer = null;
        return function(){
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function(){
                fn.apply(context, args);
            }, delay);
        };
    },
    cancelAuth(row) {
      let enable
      let text = '确认解除第三方平台：数商中台的数据授权？'

      if(row.enable == 1) {
        enable = 0
      } else if(row.enable == 0) {
        enable = 1
      }

      this.confirm({icon: true, customClass: 'auth-manage cancel-auth', text, width: '500px'}).then(() => {
        this._apis.set.cancelAuth({
          id: row.id,
          cid: this.cid,
          enable
        }).then((res) => {
          this.getList()
          this.getShopAuthList()
        }).catch(error => {
            this.loading = false
            this.$message.error({
                message: error,
                type: 'error'
            });
        })
      }).catch(() => {
          
      })
    },
    getCodeHandler() {
      if(this.showCodeDialog) {
        return
      }
      this.showCodeDialog = true
      this._apis.shopInfo.getShopCode().then((res) => {
          this.shopCode = res
          let text = `${this.shopCode}<br/><span class="message">用户绑定授权平台、数据对接，一经授权不得修改</span>`
          let beforeClose = (action, instance, done) => {
            let code = this.shopCode;

            if(action == 'confirm') {
              if(window.clipboardData) {
                window.clipboardData.setData("Text",code);
                this.$message({
                    message: '复制成功！',
                    type: 'success'
                });
                done()
              } else {
                this.$message({
                  message: '您的浏览器不支持一键复制，请手动复制',
                  type: 'warning'
                });
              }
            } else {
              done()
            }
          }
          
          this.confirm({ customClass: 'auth-manage confirm-code', text, confirmText: '复制', width: '500px', beforeClose}).then(() => {
            this.showCodeDialog = false     
          }).catch(() => {
            this.showCodeDialog = false
          })
      }).catch(error => {
          this.$message.error({
              message: error,
              type: 'error'
          });
      })
    },
    getCode() {
      this.throttle(this.getCodeHandler, 500)()
      // let nowTime = Date.now()

      // if(this.applyTime == '') {
      //   this.getCodeHandler()
      // } else {
      //   if(((nowTime - this.applyTime)/1000) < 5) {
      //     this.confirm({title: '授权码', icon: true, customClass: 'auth-manage', text: '当前操作过于频繁，请稍后再试', width: '500px', showCancelButton: false, confirmText: '我知道了'}).then(() => {
      //     }).catch(() => {
              
      //     })
      //   } else {
      //     this.getCodeHandler()
      //   }
      // }
      // this.applyTime = Date.now()
    },
    getList() {
      this.loading = true
      this._apis.shopInfo.getAuthPageList().then((res) => {
        this.loading = false
        this.total = +res.total
        res.list.forEach(val => {
          val.shopName = this.shopName
        })
        this.list = res.list
          // console.log(res)
      }).catch(error => {
          this.loading = false
          this.$message.error({
              message: error,
              type: 'error'
          });
      })
    },
    getShopInfo(){
      this.$store.dispatch('getShopInfo').then(response =>{
        this.shopName = response.shopName
        this.getList()
      }).catch(error =>{
        this.$message.error(error);
      })
    },
  },
  components: {
    Pagination
  }
}
</script>
<style lang="scss" scoped>
  section {
    background-color: #fff;
    padding: 23px 34px;
    margin-bottom: 20px;
    /deep/ th.is-leaf {
      border:0;
    }
    h2 {
      font-size:14px;
      font-weight:500;
      color:rgba(35,35,36,1);
      margin-bottom: 22px;
    }
    &.header {
      
    }
  }
</style>
<style lang="scss">
  .auth-manage {
    width: 500px;
    .el-message-box__btns {
      margin-bottom: 26px;
    }
    &.confirm-code {
      .el-message-box__message{
        h2 {
          font-size:18px;
          font-weight:500;
          color:rgba(68,61,74,1);
        }
        .message {
          font-size:14px;
          font-weight:400;
          color:rgba(68,67,75,1);
          margin-top: 24px;
        }
      }
    }
  }
  /deep/ .el-message-box__message{
    display: block !important;
  }
</style>