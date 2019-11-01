<template>
    <div>
        <p class="u_title">微商城</p>
        <div class="u_item">
            <div class="u_t p1">
                <p>当前版本：标准版</p>
                <span>有效期至：{{time}}</span>
            </div>
            <div class="u_b">
                <p class="main">标准版功能</p>
                <p>拼团、特全价、支付推广多种营销玩法</p>
                <p>分销裂变，让粉丝替你卖货</p>
                <p>多重有礼，实现精细化会员营销</p>
                <p>全平台数据分析</p>
            </div>
        </div>
        <!-- <div class="u_item">
            <div class="u_t p2">
                <p>高级版</p>
                <div>立即订购</div>
            </div>
            <div class="u_b">
                <p class="main">高级版功能</p>
                <p>周期购，一次卖掉一年的货</p>
                <p>渠道追踪，筛选最佳投放地</p>
                <p>积分商城，会员营销再升级</p>
                <p>直播，360度展示商品</p>
            </div>
        </div>
        <div class="u_item">
            <div class="u_t p3">
                <p>豪华版</p>
                <div>立即订购</div>
            </div>
            <div class="u_b">
                <p class="main">豪华版功能</p>
                <p>10个我的报表，多维度对比数据</p>
                <p>20位客服坐席，买家咨询轻松对接</p>
                <p>（功能持续上线中…）</p>
            </div>
        </div> -->
    </div>
</template>
<script>
import utils from "@/utils";
export default {
    name: 'upgrade',
    data() {
        return {

        }
    },
    computed:{
        time(){
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            let time = new Date();
            time.setTime(shopInfo.createTime + 3600 * 1000 * 24 * (shopInfo.lifeTime - 1));
            time = utils.formatDate(time,'yyyy-MM-dd hh:mm:ss')
            return time
        }
    },
    created(){ },
    methods: {  }
}
</script>
<style lang="scss" scoped>
.u_title{
    color: #3D434A;
    font-size: 26px;
    width: 100%;
    text-align: center;
    margin: 23px 0 42px 0;
}
.u_item{
    margin: 0 auto;
    width: 614px;
    border-radius: 10px;
    background-color: #fff;
    .u_t{
        width: 614px;
        height: 211px;
        &.p1{
            background: url('../../assets/images/profile/b_1s.jpg') 0 0 no-repeat;
            background-size: cover;
        }
        &.p2{
            background: url('../../assets/images/profile/b_2.png') 0 0 no-repeat;
        }
        &.p3{
            background: url('../../assets/images/profile/b_3.png') 0 0 no-repeat;
        }
        p{
            color: #fff;
            font-size: 28px;
            text-align: center;
            margin-bottom:29px;
            padding-top: 54px;
        }
        span{
            width: 100%;
            display: inline-block;
            padding-right: 30px;
            text-align: right;
            margin-top: 40px;
            color: #fff;
        }
        div{
            width: 169px;
            height: 44px;
            line-height: 44px;
            border-radius: 22px;
            background:rgba(255,255,255,0.45);
            color: #fff;
            margin: 0 auto;
            text-align: center;
            font-size: 22px;
        }
    }
    .u_b{
        width: 614px;
        padding: 22px 40px 100px 20px;
        background: #fff;
        border-radius: 10px;
        p{
            color: #92929B;
            margin-bottom: 17px;
            &.main{
                color: #3D434A;
            }
        }
    }
}
</style>


