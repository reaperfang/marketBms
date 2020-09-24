<template>
  <div class="shopExpress mh bor-radius">
    <el-tabs v-model="currentTab" @tab-click="handleClick" class="tabs">
      <el-tab-pane
        v-for="(item, index) in authsList"
        :key="index"
        :name="item.name" >
        <span slot="label">{{ item.title }}</span>
        <component :is="currentTab"></component>
      </el-tab-pane>
    </el-tabs>
  </div>     
</template>

<script>
import merchantDeliver from './components/merchantDeliver'
import th3Deliver from './components/th3Deliver'
import { isExistAuth } from '@/utils/auth.js'
export default {
  name: 'shopExpress',
  data() {
    return {
      currentTab: 'merchantDeliver',
      authsList: [],
      tabsList: [
      {
        name: 'merchantDeliver',
        authList: ['设置','同城配送','商家配送'],
        title: '商家配送'
      },{
        name: 'th3Deliver',
        authList: ['设置','同城配送','第三方配送'],
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
    setCurrentTab() {
      const currentTab = this.$route.query.currentTab
      console.log('--currentTab---', currentTab)
      if (currentTab) {
        this.currentTab = currentTab
      } else {
        this.currentTab = this.authsList && this.authsList.length > 0 ? this.authsList[0].name : null
      }
    },
    filterAuth() {
      const authsList = []
      const tabsList = this.tabsList
      for(let i = 0; i < tabsList.length; i++) {
        if (isExistAuth(tabsList[i].authList)) {
          authsList.push(tabsList[i])
        }
      }
      this.authsList = authsList
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
    &.is-active {
      color: #655EFF;
    }
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
