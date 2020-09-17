<template>
  <div class="shopExpress">
    <el-tabs v-model="currentTab" @tab-click="handleClick" class="tabs">
      <el-tab-pane name="merchantDeliver" >
        <span slot="label" v-permission="['设置','同城配送','商家配送']">商家配送</span>
        <component v-if="currentTab === 'merchantDeliver'" v-permission="['设置','同城配送','商家配送']" :is="currentTab"></component>
      </el-tab-pane>
      <el-tab-pane name="th3Deliver">
        <span slot="label" v-permission="['设置','同城配送','第三方配送']">第三方配送</span>
        <component v-if="currentTab === 'th3Deliver'" v-permission="['设置','同城配送','第三方配送']" :is="currentTab"></component>
      </el-tab-pane>
    </el-tabs>
  </div>     
</template>

<script>
import merchantDeliver from './components/merchantDeliver'
import th3Deliver from './components/th3Deliver'
export default {
  name: 'shopExpress',
  data() {
    return {
      currentTab: 'merchantDeliver',
    }
  },
  components: {
    merchantDeliver,
    th3Deliver
  },
  watch: {
    currentTab(curr) {
      console.log(curr)
      // this.init()
    }
  },
  created() {
    this.init()
  },
  destroyed() {
  },
  methods: {
    hasPermission(auth) {
      const localMsfList = localStorage.getItem('shopInfos');
      let msfList = [];
      if(localMsfList && JSON.parse(localMsfList) && JSON.parse(localMsfList).data && JSON.parse(localMsfList).data.msfList) {
        msfList = JSON.parse(localMsfList).data.msfList
      }
      if(msfList){
        if (auth) {
          return msfList.some(item => auth == item.name ) || auth == '概况首页' || auth == '概况' || auth == '账号信息'
        }else{
          return true
        }
      }else {
        return auth == '概况首页' || auth == '概况' || auth == '账号信息' ? true : false
      }
    },
    init() {
      // this.currentTab = 'quickDelivery'
      // this.$nextTick(() => {
        const currentTab = this.$route.query.currentTab
        console.log('--currentTab---', currentTab)
        if (currentTab) {
          this.currentTab = currentTab
        } else {
          const auths = [
          {
            name: 'merchantDeliver',
            title: '商家配送'
          },{
            name: 'th3Deliver',
            title: '第三方配送'
          }]
          for(let i = 0; i < auths.length; i++) {
            console.log(this.hasPermission(auths[i].title))
            if (this.hasPermission(auths[i].title)) {
            console.log(auths[i].name)
              this.currentTab = auths[i].name
              break
            }
          }
        }
      // })
    },
    handleClick(comp) {
      console.log(comp)
      this.currentTab = comp.name;
      this.$router.replace({path: '/set/shopExpress', query:{currentTab: comp.name }})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.shopExpress {
  background: #fff;
  height: 100%;
}
.tabs{
  >>> .el-tabs__item {
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    font-weight: 400;
    color: #44434B;
  }
  >>> .el-tabs__header {
    background-color: #fff;
    margin:0;
    padding: 0 20px 0 20px;
  }
}
.main{
  width: 100%;
  padding: 20px;
  background: #fff;
}
</style>
