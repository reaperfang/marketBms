<template>
  <div :class="classObj" class="app-wrapper">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/> -->
    <!-- <sidebar class="sidebar-container"/> -->
    <div class="sidebar-lefter">
      <div class="logo-con">
        <img :src="logo" class="logo">
        <!-- <img :src="require('@/assets/images/logo.png')" class="logo"> -->
      </div>
      <ul>
        <li :class="{active: index == current}" @click="menuHandler(index)" v-show="!item.hidden && item.children" 
          v-for="(item, index) in permission_routers_tree" :key="index">
          <i v-if="index != current" class="icons" :class="{[item.meta.icon]: true}"></i>
          <i v-else class="icons" :class="{[item.meta.activeIcon]: true}"></i>
          <template v-if="!item.iframe">
            <span class="ellipsis">{{item.meta.title}}</span>
          </template>
          <template v-else>
            <router-link :to="{path: item.path}">{{item.meta.title}}</router-link>
          </template>
        </li>
      </ul>
    </div>
    <div class="main-container">
      <navbar/>
      <!-- <tags-view/> -->
      <!-- :class="{[item.meta.icon]: true, 'el-icon-setting': true}" -->
      <app-main/>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState, mapGetters, mapMutations } from 'vuex'
import path from 'path'

var isExternal = function(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export default {
  name: 'Layout',
  data() {
    return {
      current: '0',
      logo:"require('@/assets/images/logo.png')"
    }
  },
  created() {
    let path = '/' + this.$route.path.split('/')[1]
    let index = this.permission_routers_tree.findIndex(val => val.path == path)

    this.menuHandler(index)
  },
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  created() {
    this.current = localStorage.getItem('siderBarCurrent') || '0'

    let name = this.$route.path.replace(/^(\/[^(?:\/|\?)]+)\/.*$/, '$1')
    let realCurrent = this.permission_routers_tree.findIndex(router => router.path == name)

    if(realCurrent != this.current) {
      this.current = realCurrent
    }
    this.getShopInfo()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if(to.path) {
        let name = to.path.replace(/^(\/[^(?:\/|\?)]+)\/.*$/, '$1')
        let realCurrent = vm.permission_routers_tree.findIndex(router => router.path == name)

        if(realCurrent != vm.current) {
          vm.SETCURRENT(realCurrent)
        }
      }
    })
  },
  computed: {
    // ...mapState({
    //   current: state => state.menu.current,
    // }),
    ...mapGetters([
      'permission_routers_tree',
    ]),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    cid(){
        let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
        return shopInfo.id
    }
  },
  methods: {
    ...mapMutations(['SETCURRENT']),
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    },
    menuHandler(index) {
      this.SETCURRENT(index)
      localStorage.setItem('siderBarCurrent', index)

      this.jumpTo(index)
    },
    jumpTo(index) {
      let current = localStorage.getItem('siderBarCurrent') || '0'
      let currentBar = this.permission_routers_tree[current]

      let basePath = currentBar.path
      let children = currentBar.children

      if(children && children.length) {
        let _path = children[0].path

        this.$router.push({path: this.resolvePath(basePath, _path)})
      }
    },
    resolvePath(basePath, routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(basePath, routePath)
    },
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
    getShopInfo(){
      let id = this.cid
      this._apis.set.getShopInfo({id:id}).then(response =>{
        this.logo = response.logo
      }).catch(error =>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
  },
  watch: {
    '$store.state.menu.current': function(index) {
      this.current = index
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    .sidebar-lefter {
      background-color: #2c2d53;
      width: 120px;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      color: #9596a9;
      font-size:16px;
      ul li {
        padding: 15px 0 15px 17px;
        display: flex;
        align-items: center;
        cursor: pointer;
        &.active {
          border-left: 4px solid #655eff;
          background-color: #4b4c6c;
          color: #fff;
        }
        i {
          margin-right: 9px;
        }
        span {
          padding-right: 5px;
        }
        &:first-child {
          margin-top: 15px;
        }
      }
      &.active {
        color: #fff;
        border-left: 4px solid #655eff;
      }
      .logo-con{
        display: flex;
        justify-content: center;
        margin-top: 17px;
      }
      .logo{
        width: 40px;
        height: 40px;
        border-radius: 20px;
      }
    }
    .main-container {
      flex: 1;
    }
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .icons{
    width: 18px;
    height: 18px;
  }
  .icon_profile{
    background: url('../../assets/images/icons/profile.png') no-repeat;
    background-size: cover;
  }
  .icon_profiles{
    background: url('../../assets/images/icons/profiles.png') no-repeat;
    background-size: cover;
  }
  .icon_shop{
    background: url('../../assets/images/icons/shop.png') no-repeat;
    background-size: cover;
  }
  .icon_shops{
    background: url('../../assets/images/icons/shops.png') no-repeat;
    background-size: cover;
  }
  .icon_goods{
    background: url('../../assets/images/icons/goods.png') no-repeat;
    background-size: cover;
  }
  .icon_goodss{
    background: url('../../assets/images/icons/goodss.png') no-repeat;
    background-size: cover;
  }
  .icon_order{
    background: url('../../assets/images/icons/order.png') no-repeat;
    background-size: cover;
  }
  .icon_orders{
    background: url('../../assets/images/icons/orders.png') no-repeat;
    background-size: cover;
  }
  .icon_client{
    background: url('../../assets/images/icons/client.png') no-repeat;
    background-size: cover;
  }
  .icon_clients{
    background: url('../../assets/images/icons/clients.png') no-repeat;
    background-size: cover;
  }
  .icon_datum{
    background: url('../../assets/images/icons/datum.png') no-repeat;
    background-size: cover;
  }
  .icon_datums{
    background: url('../../assets/images/icons/datums.png') no-repeat;
    background-size: cover;
  }
  .icon_opera{
    background: url('../../assets/images/icons/opera.png') no-repeat;
    background-size: cover;
  }
  .icon_operas{
    background: url('../../assets/images/icons/operas.png') no-repeat;
    background-size: cover;
  }
  .icon_finance{
    background: url('../../assets/images/icons/finance.png') no-repeat;
    background-size: cover;
  }
  .icon_finances{
    background: url('../../assets/images/icons/finances.png') no-repeat;
    background-size: cover;
  }
  .icon_apply{
    background: url('../../assets/images/icons/apply.png') no-repeat;
    background-size: cover;
  }
  .icon_applys{
    background: url('../../assets/images/icons/applys.png') no-repeat;
    background-size: cover;
  }
  .icon_set{
    background: url('../../assets/images/icons/set.png') no-repeat;
    background-size: cover;
  }
  .icon_sets{
    background: url('../../assets/images/icons/sets.png') no-repeat;
    background-size: cover;
  }
</style>
