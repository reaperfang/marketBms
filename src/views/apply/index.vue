/*应用*/
<template>
    <div class="main" v-loading="isLoaded">       
        <iframe :src="src" ref="refreshFrame" @load="iframeLoad"></iframe>
    </div>
</template>

<script>
import { getToken } from '@/system/auth'
export default {
    data(){
        return{
            src:'',
            path: '',
            defultPath: '/application/appIndex',
            token:'',
            cid:'',
            iframeWin: null,
            isLoaded: false,
            tenantId:localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).tenantInfoId
        }
    },
    created() {
        // console.log('paths',this.$route.params.paths)
        console.log('222222')
        if(this.$route.params.paths){
            this.path = this.$route.params.paths
        }else{
            this.path = window.localStorage.getItem('marketing_router_path') || this.defultPath;
        }
        this.init();
    },
    mounted () {
        window.addEventListener('message', this.onMessage)
        this.iframeWin = this.$refs.refreshFrame.contentWindow;
        this.isLoaded  = true;
    },
    methods:{
        init(){
            this.token = getToken('authToken')
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            this.cid = shopInfo && shopInfo.id || ''
            // this.src = `http://test-omo.aiyouyi.cn/vue/marketing${this.path}?access=1&token=${this.token}&businessId=1&loginUserId=1&tenantId=${this.tenantId}&cid=${this.cid}`
            this.src = `${process.env.DATA_API}/vue/marketing${this.path}?access=1&token=${this.token}&businessId=1&loginUserId=1&tenantId=${this.tenantId}&cid=${this.cid}`
        },

        // iframe 刷新  -- 暂时不用
        sendMessage () {
            this.iframeWin.postMessage({ cmd: 'marketing_router_refresh', params: {} }, '*')
        },

        // iframe 加载完成
        iframeLoad () {
            this.isLoaded  = false;
        },

        // iframe 接收消息
        async onMessage (event) {
            let message = event.data;
            if (typeof(message) !== 'object') {
                return false;
            }
            if ( message.cmd == 'marketing_router_path' ) {
                this.path = message.params.path; // 营销路由
                window.localStorage.setItem('marketing_router_path', this.path);
                this.isLoaded  = false;
            }
        },
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .main {
        width: 100%;
        height: 100%;
        iframe{
            width:100%;
            height: 100%;
            border:none;
        }
    }
</style>