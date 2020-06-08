/*普通快递 */
<template>
  <div>
    <el-tabs v-model="currentTab" @tab-click="handleClick" class="tabs">
      <el-tab-pane name="courierSettings" >
        <span slot="label" v-permission="['设置','普通快递','快递设置']">快递设置</span>
        <component v-if="currentTab === 'courierSettings'"  v-permission="['设置','普通快递','快递设置']" :is="currentTab"></component>
      </el-tab-pane>
      <el-tab-pane name="quickDelivery">
        <span slot="label" v-permission="['设置','普通快递','运费模版']">运费模版</span>
        <component v-if="currentTab === 'quickDelivery'"  v-permission="['设置','普通快递','运费模版']" :is="currentTab"></component>
      </el-tab-pane>
      <el-tab-pane name="electronicFaceSheet">
        <span slot="label" v-permission="['设置','普通快递','电子面单']">电子面单</span>
        <component v-if="currentTab === 'electronicFaceSheet'" v-permission="['设置','普通快递','电子面单']" :is="currentTab"></component>
      </el-tab-pane>
    </el-tabs>
  </div>     
</template>

<script>
// import preSale from './components/preSale'
// import afterSale from './components/afterSale'
import courierSettings from './components/courierSettings'
import quickDelivery from './components/quickDelivery'
import electronicFaceSheet from './components/electronicFaceSheet'
export default {
  name: 'ordinaryExpress',
  data() {
    return {
      currentTab: 'courierSettings',
    }
  },
  components: {
    quickDelivery,
    courierSettings,
    electronicFaceSheet
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
            name: 'courierSettings',
            title: '快递设置'
          },{
            name: 'quickDelivery',
            title: '运费模版'
          }, {
            name: 'electronicFaceSheet',
            title: '电子面单'
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
      // console.log(comp)
      this.currentTab = comp.name;
      this.$router.replace({path: '/set/ordinaryExpress', query:{currentTab: comp.name }})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.tabs{
  background:#fff; 
  padding:10px 20px 0 20px;
  >>> .el-tabs__item {
    padding: 0;
    span {
      padding: 0 20px;
    }
  }
}
.main{
  width: 100%;
  padding: 20px;
  background: #fff;
}
</style>