<template>
    <div>
        <p class="u_title">移动商城</p>
        <div class="u_item">
            <div class="u_t p1">
                <p>当前版本：标准版</p>
                <span>有效期至：{{time}}</span>
            </div>
            <div class="u_b">
                <p class="main">标准版功能</p>
                <p class="title"><span>店铺装修：</span>DIY装修店铺，不同装修打造不同风格；</p>
                <p><span></span>页面创建，轻松简便；</p>
                <p><span></span>创建广告，将最新动态一秒触达。</p>
                <p class="title"><span>客户管理：</span>客户数据全部打通，无需单独管理；</p>
                <p><span></span>会员特权，营造会员权益的专属化。</p>
                <p class="title"><span>互动营销：</span>满减、优惠券、限时折扣促销类型众多，提高二次复购；</p>
                <p><span></span>多种玩法，海报、代付、拼团、秒杀，提高粉丝量。</p>
                <p class="title"><span>财务查询：</span>展示营收概况及趋势分析、客户余额、推客奖励、积分明细及物流成本核算。</p>
                <p class="title"><span>智能运营：</span>订单量、客单价、人均消费分析；交易时间、客户类型、复购率分析，快速了解</p>
                <p><span></span>客户交易情况；好评率、差评率分析提高口碑宣传。</p>
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
        padding: 22px;
        background: #fff;
        border-radius: 10px;
        p{
            font-size: 14px;
            color: #92929B;
            &.main{
                font-size: 16px;
                color: #3D434A;
                margin-bottom: 20px;
            }
            span{
                width:73px;
                height: 17px;
                display: inline-block;
                font-size: 14px;
                color: #3D434A;
            }
        }
    }
}
p.title{
    margin-top: 10px;
}
</style>


