/*应用*/
<template>
  <div class="main" v-loading="isLoaded">
    <iframe :src="src" ref="refreshFrame" @load="iframeLoad"></iframe>
  </div>
</template>

<script>
  import {getToken} from '@/system/auth'
  export default {
    data() {
      return {
        src: '',
        path: '',
        defaultPath: '/application/appIndex',
        refreshPath: '',
        token: '',
        cid: '',
        iframeWin: null,
        isLoaded: false,
        tenantId: this.$store.getters.userInfo && this.$store.getters.userInfo.tenantInfoId
      }
    },
    created() {
      // this.init();
    },
    mounted() {
      window.addEventListener('message', this.onMessage)
      this.iframeWin = this.$refs.refreshFrame.contentWindow;
      this.isLoaded = true;
      window.onbeforeunload = function () {
        this.refreshPath = window.localStorage.getItem('marketing_router_path')
      }
      this.init();
    },
    watch: {
      // 利用watch方法检测路由变化：
      $route: function (to, from) {
        // 拿到目标参数 to.params.id 去再次请求数据接口
        // console.log(to.params.id);
        this.sendMessage('push')
      },
      deep: true
    },
    beforeDestroy() {
      localStorage.setItem('marketing_router_path', this.defaultPath);
    },
    methods: {
      init() {
        this.token = getToken('authToken')
        let shopInfo = this.$store.getters.shopInfos;
        let userName = this.$store.getters.userInfo && encodeURI(this.$store.getters.userInfo.userName);
        // 营销需要，常用参数
        let bossProductId = this.$store.getters.shopInfos && this.$store.getters.shopInfos.bossProductId;
        this.cid = shopInfo && shopInfo.id || '';

        if (this.$route.query.paths) {
          this.path = this.$route.query.paths;
        } else {
          // this.path = this.refreshPath || this.defaultPath;
          this.path = localStorage.getItem('marketing_router_path') || this.defaultPath;
        }

        let applyId = '';
        if (this.$route.query.applyId) {
          applyId = this.$route.query.applyId
        } else if (localStorage.marketing_router_path_appId) {
          applyId = localStorage.marketing_router_path_appId
        }
        let extraQuery = ''
        let mkQuery = localStorage.getItem('marketing_router_path_query') && JSON.parse(localStorage.getItem('marketing_router_path_query')) || {}
        if (this.$route.query.menuId) {
          mkQuery.menuId = this.$route.query.menuId
        }
        delete mkQuery.access
        delete mkQuery.token
        delete mkQuery.businessId
        delete mkQuery.loginUserId
        delete mkQuery.tenantId
        delete mkQuery.cid
        delete mkQuery.userName
        delete mkQuery.bossProductId
        delete mkQuery.id
        delete mkQuery.menuId
        for (let item in mkQuery) {
          extraQuery += "&" + item + '=' + mkQuery[item]
        }
        // this.src = window.location.origin + `/vue/marketing${this.path}?access=1&token=${this.token}&businessId=1&loginUserId=1&tenantId=${this.tenantId}&cid=${this.cid}`
        this.src = `${process.env.NODE_ENV === 'dev' ? '//127.0.0.1:8080' : process.env.DATA_API}/vue/marketing${this.path}?access=1&token=${this.token}&businessId=1&loginUserId=1&tenantId=${this.tenantId}&cid=${this.cid}&userName=${userName}&menuId=${applyId}&bossProductId=${bossProductId}${extraQuery}`
      },

      // iframe 刷新  -- 暂时不用
      sendMessage(index) {
        if (index == 'refrech') {
          this.iframeWin.postMessage({cmd: "marketing_router_refresh", params: {}}, "*");
        } else {
          this.iframeWin.postMessage({cmd: "marketing_router_push", params: {}}, "*");
        }
      },

      // iframe 加载完成
      iframeLoad() {
        this.isLoaded = false;
      },

      // iframe 接收消息
      async onMessage(event) {
        let message = event.data;
        if (typeof (message) !== 'object') {
          return false;
        }
        if (message.cmd == 'marketing_router_path') {
          this.path = message.params.path; // 营销路由
          window.localStorage.setItem('marketing_router_path', this.path);
          window.localStorage.setItem('marketing_router_path_appId', message.params.id);
          window.localStorage.setItem('marketing_router_path_query', message.query);
          this.isLoaded = false;
        }
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .main {
    width: 100%;
    height: 100%;
    //  margin-left:-20px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1111;

    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
</style>
