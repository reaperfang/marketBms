<template>
  <div class="shopExpress mh bor-radius">
    <el-tabs v-model="currentTab" @tab-click="handleClick" class="tabs">
      <el-tab-pane
        v-for="(item, index) in authList"
        :key="index"
        :label="item.title"
        :name="item.name" >
        <component :is="currentTab"></component>
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
      authList: [],
      tabsList: [
      {
        name: 'merchantDeliver',
        title: '商家配送'
      },{
        name: 'th3Deliver',
        title: '第三方配送'
      }]
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
    setCurrentTab() {
      const currentTab = this.$route.query.currentTab
      console.log('--currentTab---', currentTab)
      if (currentTab) {
        this.currentTab = currentTab
      } else {
        this.currentTab = this.authList.length > 0 ? this.authList[0].name : null
        
      }
    },
    filterAuth() {
      const authList = []
      const tabsList = this.tabsList
      for(let i = 0; i < tabsList.length; i++) {
        if (this.hasPermission(tabsList[i].title)) {
          authList.push(tabsList[i])
        }
      }
      this.authList = authList
    },
    init() {
      // this.currentTab = 'quickDelivery'
      // this.$nextTick(() => {
      // 过滤掉未授权的
      this.filterAuth()
      // 设置默认值
      this.setCurrentTab()
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
    margin:0;
    padding: 0 20px 0 20px;
  }
  >>> .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 0;
  }

}
.main{
  width: 100%;
  padding: 20px;
}
</style>
