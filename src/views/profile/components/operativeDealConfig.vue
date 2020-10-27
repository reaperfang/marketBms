<template>
   <div class="operativeDealConfig">
    <steps class="steps" :step="step"></steps>
    <template v-if="isInitCompleted">
      <h2>线上生意又进一步，完善下面的工作吧！</h2>
      <ul>
        <li>
          <p><i :class="[isHasGoods ? 'icon-success' : 'el-icon-error']"></i><span>上传您的的第一个商品：</span></p>
          <p class="prompt">
            <el-button type="text" class="link" @click="createGood">创建商品</el-button>
            <span>或</span>
            <el-button type="text" class="link" @click="importGoods">商品批量导入</el-button>
          </p>
          
        </li>
        <li class="sms">
          <p><i :class="[isHasSms ? 'icon-success' : 'el-icon-error']"></i><span>设置短信息，收纳您的会员</span></p>
          <p class="prompt">
            <el-button type="text" class="link" @click="setSms">设置短信签名</el-button>
          </p>
        </li>
      </ul>
      <div class="btn">
        <el-button class="prev" @click="goPrev">上一步</el-button>
        <el-button class="next" type="primary" :loading="loading" @click="submit()" :disabled="isDisabled">下一步</el-button>
      </div>
    </template>
   </div>
</template>

<script>
import Steps from './steps'
export default {
  components: { Steps },
  props: {
    step: {
      type: Number,
      default: 4
    }
  },

  data () {
    return {
      isInitCompleted: false, // 是否完成初始化
      loading: false,
      isHasGoods: false,
      isHasSms: false
    }
  },

  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },

    isDisabled() {
      return !this.isHasGoods || !this.isHasSms
    }
  },

  watch: {},

  created() {
    this.init()
    
    // this.getIsHasGoods()
    // this.getIsHasSms()
  },

  mounted() {},

  methods: {
    init() {
      this.isInitCompleted = false
      const p1 = this.getIsHasGoods()
      const p2 = this.getIsHasSms()
      Promise.all([p1, p2]).finally(() => {
        this.isInitCompleted = true
      })
    },
    updateStep() {
      const cid = this.cid;
      const step = 5
      return new Promise((resolve, reject) => {
        this._apis.shop
          .updateStep({ cid, step })
          .then(response => {
            setTimeout(() => {
              this.$emit('getStep', step)
            }, 500)
            resolve(response)
          }).catch((err) => {
            reject(err)
          })
      })
    },
    goPrev() {
      this.$emit('getStep', 3)
    },
    createGood() {
      this.confirm({
        icon: true,
        text: '您是否成功的创建了您的第一个商品',
        confirmText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.getIsHasGoods()
      }).catch(() => {
        
      });
      let routeData = this.$router.resolve({ path: '/goods/addGoods' });
      window.open(routeData.href, '_blank');
    },
    importGoods() {
      this.confirm({
        icon: true,
        text: '您是否成功的创建了您的第一个商品',
        confirmText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.getIsHasGoods()
      }).catch(() => {
        
      });
      let routeData = this.$router.resolve({ path: '/goods/import' });
      window.open(routeData.href, '_blank');
    },
    setSms() {
      const routeData =  this.$router.resolve({
        path:'/apply',
        query:{paths:'/application/toolapp/paySms',applyId: '3'
      }})
      window.open(routeData.href, '_blank');
      this.confirm({
        icon: true,
        text: '您是否成功创建了短信签名',
        confirmText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.getIsHasSms()
      }).catch(() => {
        
      });
      // /application/toolapp/paySms
      // this.utils.addNewApply('/application/toolapp/paySms', 3)
    },
    getIsHasGoods() {
      const req = {
        cid: this.cid,
        startIndex: 1,
        pageSize: 20,
        name: "",
        status: "",
        productCatalogInfoId:"",
        searchType: "code", 
        searchValue: "",
        sortType:1,
        code:""
      }
      return this._apis.goods.fetchSpuGoodsList(req).then((res) => {
        if (res && res.total > 0) {
          this.isHasGoods = true
        } else {
          this.isHasGoods = false
        }
      }).catch((err) => {
        console.error(err)
        this.isHasGoods = false
      })
    },
    getIsHasSms() {
      // 查询签名
      return this._apis.profile.getSignatureList({
        pageNum: 1,
        pageSize: 1,
        orderBy: "create_time desc",
        appid: 52
      }).then(data => {
        if (data && data.list.length > 0) {
          this.isHasSms = true
        } else {
          this.isHasSms = false
        }
      })
      .catch(errMsg => {
        this.isHasSms = false
      });
    },
    submit() {
      this.updateStep().then(() => {
        this.$message.success("保存成功！");
      }).catch(() => {
        this.$message.error('保存失败');
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.operativeDealConfig {
  padding: 15px 15px 15px 31px;
  background-color: #fff;
  h2 {
    font-size:16px;
    font-weight:500;
    color:rgba(68,67,75,1);
    line-height:22px;
    padding: 42px 0 0 13px;
  }
  ul {
    li {
      padding: 34px 0 0 55px;
      p {
        font-size:14px;
        font-weight:500;
        color:rgba(68,67,75,1);
        line-height:20px;
        display: flex;
        align-items: center;
        span {
          padding-left:11px;
          font-weight:500;
        }
        i {
          display:inline-block;
          width: 20px;
          height: 20px;
          font-size: 20px;
          &.el-icon-error {
            color:rgba(253, 76, 43, 1);
          }
          &.icon-success {
            background: url('~@/assets/images/profile/icon_success.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        &.prompt {
          padding-top: 17px;
          font-size:13px;
          font-weight:400;
          line-height:18px;
          padding-left: 40px;

          span {
            padding: 0 10px;
          }
          .link {
            font-size:13px;
            font-weight:400;
            color:rgba(110,103,255,1);
          }
        }
      }
      &.sms {
        padding-top: 110px;
      }
    }
  }
  >.btn {
    padding-top: 119px;
    text-align: center;
    .prev {
      margin-right: 45px;
      border-radius:4px;
      border:1px solid rgba(101,94,255,1);
      font-size:12px;
      font-weight:400;
      color:rgba(101,94,255,1);
    }
  }
}
</style>