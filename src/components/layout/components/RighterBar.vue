<template>
  <div class="righter-bar" v-if="sidebarItems.length">
    <div class="righter-bar-content" v-calcHeight="60">
      <div v-if="!item.hidden" v-for="item in sidebarItems">
        <div v-if="item.children" class="item">
          <h2>{{item.name}}</h2>
          <div v-if="!child.hidden" v-for="child in item.children" class="item-child">
            <router-link :title="child.meta.title" class="ellipsis" active-class="active" :to="resolvePath(item.path, child.path)">{{child.meta.title}}</router-link>
          </div>
        </div>
        <div v-else>
          <div v-if="item.tabTitle">
            <!-- <div class="item" v-if="isPc || (item.tabTitle !== 'PC店铺' && item.tabTitle !== '资讯管理')">
              <h2>{{item.tabTitle}}</h2>
              <div v-if="!child.hidden" v-for="child in item.data" class="item-child">
                <div>
                  <router-link :title="child.meta.title" class="ellipsis" active-class="active" :to="resolvePath(child.path)">{{child.meta.title}}</router-link>
                </div>
              </div>
            </div> -->
            <div class="item" v-if="isOpenResell || (item.tabTitle !== '分销账目')">
				<h2 v-if="item.tabTitle == '分割线'" style="width: 56px;height: 1px;background: #D9DEE9;margin-left: 20px"></h2>
                <h2 v-else>{{item.tabTitle}}</h2>
                <div v-if="!child.hidden" v-for="child in item.data" class="item-child">
                	<!-- <div v-if="child.meta.title == '修改密码' && userType"></div> -->
					<div>
					  <router-link :title="child.meta.title" class="ellipsis" active-class="active" :to="resolvePath(child.path)">{{child.meta.title}}</router-link>
					</div>
                </div>
            </div>
          </div>
          <div v-else class="item">
            <router-link :title="item.meta.title" class="ellipsis" active-class="active" :to="resolvePath(item.path)">{{item.meta.title}}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import path from 'path'

var isExternal = function(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export default {
  data() {
    return {
      sidebarItems: [],
      basePath: '',
      //userType: false,
      current: '0',
      isPc: false,  //是否开通了pc和wap店铺
      isOpenResell:false //是否开通了分销应用
    }
  },
  components: { },
  computed: {
    // ...mapState({
    //   current: state => state.menu.current,
    // }),
    ...mapGetters([
      'permission_routers',
      'permission_routers_tree',
    ]),
    userType(){
      let userInfo = JSON.parse(this.$store.getters.userInfo)

      if(userInfo && userInfo.type == "admin") {
        return true
      }
      return false
    }
  },
  created() {
    this._apis.data.openPcWap().then(response => {
      if(response == null){
        this.isPc = false
      }else if(response.onoff == 0){
        this.isPc = false
      }else{
        this.isPc = true
      }
    }).catch(error => {
      this.$message.error(error);
    });

    this.current = localStorage.getItem('siderBarCurrent') || '0'
    this.setSidebarItems()

    let name = this.$route.path.replace(/^(\/[^(?:\/|\?)]+)\/.*$/, '$1')
    let realCurrent = this.permission_routers_tree.findIndex(router => router.path == name)

    if(realCurrent != this.current) {
      this.current = realCurrent
      this.setSidebarItems()
    }
    this.getRebusinessTypes()
  },
  methods: {
    // setUserType() {
    //   let userInfo = JSON.parse(this.$store.getters.userInfo)

    //   if(userInfo && userInfo.type == 'admin') {
    //     this.userType = true
    //   } else {
    //     this.userType = false
    //   }
    // },
    getRebusinessTypes(){
       this.$store.dispatch('getShopInfo').then( data => {
          if(data.isOpenResell == 1){
            this.isOpenResell = true
          }else{
            this.isOpenResell = false
          }
      }).catch((error) => {
          console.error(error);
      });
    },

    handleTabTitle(arr) {
      var map = {},
          dest = [];
      for(var i = 0; i < arr.length; i++){
          var ai = arr[i];
          if(!map[ai.meta.tabTitle]){
            if (!ai.hidden) {
              dest.push({
              tabTitle: ai.meta.tabTitle,
                id: ai.id,
                name: ai.name,
                data: [ai]
              });
              map[ai.meta.tabTitle] = ai;
            }
          }else{
              for(var j = 0; j < dest.length; j++){
                  var dj = dest[j];
                  if(dj.tabTitle == ai.meta.tabTitle && !ai.hidden){
                      dj.data.push(ai);
                      break;
                  }
              }
          }
      }

      return dest
    },
    setSidebarItems() {
      let _permission_routers_tree = JSON.parse(JSON.stringify(this.permission_routers_tree))
      let _path = _permission_routers_tree[this.current].path
      let children = _permission_routers_tree[this.current].children

      if(_permission_routers_tree[this.current].iframe) {
        this.sidebarItems = []
      } else {
        children.forEach(val => {
          val.path = _path + '/' + val.path
        })
        console.log('children',children)
        if(children.some(val => val.meta.tabTitle)) {
          children = this.handleTabTitle(children)
        }
        this.sidebarItems = children
      }
    },
    resolvePath(...routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, ...routePath)
    },
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
  },
  watch: {
    // current() {
    //   this.setSidebarItems()
    // }
    '$store.state.menu.current': function(index) {
      this.current = index
      this.setSidebarItems()
    },
    // "$store.getters.userInfo": function() {
    //   this.setUserType()
    // }
  }
}
</script>

<style lang="scss" scoped>
  .righter-bar {
    .righter-bar-content {
      height: calc(100% - 60px);
      overflow-y: scroll;
    }
    // border-right: 1px solid rgba(242,242,249,1);
    font-size: 14px;
    //border-top: 1px solid #f2f2f9;
    position: fixed;
    left: 120px;
    top: 60px;
    z-index: 1000;
    background-color: #fff;
    width: 122px;
    height: 100%;
    .item {
      position: static;
      border-top: 1px solid #f2f2f5;
      padding-top: 16px;
      padding-bottom: 10px;
      text-align: left;
      a {
        position: relative;
        width: 102px;
        height: 30px;
        margin-left: 10px;
        line-height: 30px;
        text-indent: 10px;
        color: #92929B;
        border-radius: 15px;
        &:hover {
          background-color: #EFEEFF;
        }
        &.active {
          background-color: #f0efff;
          color: #7f79ff;
        }
        &.active:after{
          position: absolute;
          right: 10px;
          top: 11px;
          content: "";
          width: 5px;
          height: 8px;
          background: url('~@/assets/images/common/icon-right.png') no-repeat;
          background-size: 5px 8px;
        }
      }
      &:first-child {
        border: none;
      }
      &:last-child {
        // border-bottom: 1px solid #f2f2f5;
      }
      h2, .item-child {
        margin-bottom: 10px;
      }
      h2 {
        font-family:PingFangSC-Medium;
        font-weight:bold;
        color:#161617;
        line-height:20px;
        font-size: 14px;
        text-indent: 20px;
      }
    }
  }
  @media screen and (min-height: 900px) {
    .righter-bar .righter-bar-content {
      height: 800px;
    }
  }
  /deep/ .item a {
    max-width: 102px;
    display: inline-block;
  }
</style>

