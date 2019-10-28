<template>
  <section class="app-main">
    <div class="content-box">
      <div class="content-menu">
        <!-- <sidebar class="sidebar-righter" /> -->
        <righter-bar></righter-bar>
      </div>
      <div class="content-main">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <router-view :key="key"/>
          </keep-alive>
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
import Sidebar from './Sidebar'
import RighterBar from './RighterBar'

export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  },
  components: {
    Sidebar,
    RighterBar
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
    height: calc(100% - 60px);
    width: 100%;
    position: relative;
    overflow: hidden;
    margin-top: 60px;
  .content-box {
    display: flex;
    height: 100%;
    .content-menu {
      background-color: #fff;
      width: 122px;
      text-align: center;
      height: 100%;
    }
    .content-main {
      flex: 1;
      padding: 20px;
      overflow-y: scroll;
      overflow-x: scroll;
      width: 0;
    }
  }
}
</style>
<style>
.el-card.is-always-shadow{
  margin-bottom:24px;
  box-shadow:5px 5px 10px 0px rgba(229,239,255,1) !important;
  border-radius:20px !important;
}
</style>


