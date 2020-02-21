<template>
    <div class="p_container">
        <div class="p_top">
            <div class="p_top_l">
                <p class="p_title">
                    实时概况：<i class="el-icon-time"></i><span>今日数据更新时间：{{new Date() | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                </p>
                <div class="p_t_list" v-if="realTimeData.length != 0">
                    <div class="p_t_item clearfix" v-for="item in realTimeData" :key="item.id">
                        <img :src="item.url" alt="" class="fl">
                        <div class="fl p_t_text" :style="{color:item.color}">
                            <p>{{item.text}}</p>
                            <p>{{item.price}}</p>
                        </div>
                    </div>
                </div>
                <div class="p_t_list" v-else>
                    <div class="p_t_item clearfix" v-for="item in realTimeDataNull" :key="item.id">
                        <img :src="item.url" alt="" class="fl">
                        <div class="fl p_t_text" :style="{color:item.color}">
                            <p>{{item.text}}</p>
                            <p>0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="p_main clearfix">
            <div class="p_main_l">
                 <p class="p_title">
                    开店引导：<span>为了保证店铺的正常运营，您需要在开通店铺前做以下准备工作（带 <img :src="require('@/assets/images/star.png')" alt=""> 为必备事项）</span>
                </p>
                <div class="p_main_lt">
                    <div class="step">
                        <div class="step_t">
                            <h4>开店准备</h4>
                            <p>必须的账号开通准备工作</p>
                            <img :src="require('@/assets/images/star.png')" alt="">
                            <span>1</span>
                        </div>
                        <div class="step_b">
                            <p>
                                <span @click="linkTo({text:'绑定微信公众号'})">绑定微信公众号</span>
                                或
                                <span @click="linkTo({text:'绑定微信小程序'})">绑定微信小程序</span>
                            </p>
                            <p>
                                <span @click="linkTo({text:'开通且启用支付方式',url:'/set/payType'})">开通且启用支付方式</span>
                            </p>
                            <p>
                                <span @click="linkTo({text:'开通短信包'})">开通短信包/设置签名</span>
                            </p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step_t">
                            <h4>店铺装修</h4>
                            <p>提高客户浏览、购物体验</p>
                            <img :src="require('@/assets/images/star.png')" alt="">
                            <span>2</span>
                        </div>
                        <div class="step_b">
                            <p>
                                <span @click="linkTo({text:'移动店铺装修',url:'/shop/m_wxShopIndex'})">移动店铺装修</span>
                            </p>
                            <!-- <p>
                                <span @click="linkTo({text:'拟定用户注册协议',url:'/shop/p_protocolEdit'})">拟定用户注册协议</span>
                            </p> -->
                        </div>
                    </div>
                    <div class="step">
                        <div class="step_t">
                            <h4>创建商品</h4>
                            <p>上架了商品才能开门做生意</p>
                            <img :src="require('@/assets/images/star.png')" alt="">
                            <span>3</span>
                        </div>
                        <div class="step_b">
                            <p>
                                <span @click="linkTo({text:'创建商品',url:'/goods/addGoods'})">创建商品</span>
                                或
                                <span @click="linkTo({text:'商品批量导入',url:'/goods/import'})">商品批量导入</span>
                            </p>
                            <p>
                                <span @click="linkTo({text:'完善商品详情信息',url:'/goods/goodsList'})">完善商品详情信息</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="p_main_lb">
                    <div class="step">
                        <div class="step_t">
                            <h4>搭建会员体系或会员卡体系</h4>
                            <p>让客户成为会员，通过会员权益提高会员粘性</p>
                            <span>4</span>
                        </div>
                        <div class="step_b">
                            <p>
                                <span @click="linkTo({text:'启用会员等级体系',url:'/client/clientLevel'})">启用会员等级体系</span>
                            </p>
                            <p>
                                <span @click="linkTo({text:'启用会员卡体系',url:'/client/cardManage'})">启用会员卡体系</span>
                            </p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step_t">
                            <h4>营销推广</h4>
                            <p>通过营销活动实现拉新、拓客</p>
                            <span>5</span>
                        </div>
                        <div class="step_b">
                            <p>
                                <span @click="linkTo({text:'超级海报'})">超级海报</span>
                            </p>
                            <p>
                                <span @click="linkTo({text:'多人拼团'})">多人拼团</span>
                            </p>
                            <p>
                                <span @click="linkTo({text:'更多营销活动'})">更多营销活动…</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p_main_r">
                <div class="p_main_rt">
                    <p class="p_title warn">
                        <span>待办提醒：</span>
                        <i class="el-icon-refresh" @click="refresh"></i>    
                    </p>
                    <div class="p_r_list">
                        <p>待办售罄
                            <router-link to="/goods/goodsList?status=-1">
                                <span>({{toBeSoldOut || 0}})</span>
                            </router-link>    
                        </p>
                        <p>待发货订单
                            <router-link to="/order/deliveryManagement?status=3">
                                <span>({{staySendCount || 0}})</span>
                            </router-link>
                        </p>
                        <p>售后待处理
                            <router-link to="/order/afterSalesManagement?orderAfterSaleStatus=2">
                                <span>({{stayProcessedCount || 0}})</span>
                            </router-link>
                        </p>
                        <p>售后单待审核
                            <router-link to="/order/afterSalesManagement?orderAfterSaleStatus=0">
                                <span>({{stayAuthCount || 0}})</span>
                            </router-link>
                        </p>
                    </div>
                    <!-- <p>积分商城订单待发货<span>(23)</span></p> -->
                </div>
                <div class="p_main_rb">
                    <p class="p_title warn">
                        <span>客服中心：</span>   
                    </p>
                    <p class="p_email">
                        联系邮箱：shuzishangwu@300.cn 
                    </p>
                </div>
            </div>
        </div>
        <div class="p_bottom clearfix">
            <div class="p_b_l">
                <p class="p_title" style="padding-left: 29px">常用功能：</p>
                <div class="p_list">
                    <div class="p_l_item clearfix" v-for="item in commonData" :key="item.id">
                        <div @click="linkTo(item)">
                            <img :src="item.img" alt="">
                            <span>{{item.text}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p_b_m">
                <p class="p_title">营销活动：</p>
                <div class="p_list" v-if="activeData.length != 0">
                    <div class="p_m_item" v-for="item in activeData" :key="item.id">
                        <span  @click="linkToApply(item)">
                            <img :src="item.appImage" alt="" style="height:40px;width:40px;">
                            <div>
                                <p>{{item.appName}}</p>
                                <p>{{item.description}}</p>
                            </div>
                        </span>
                    </div>
                </div>
                <div class="p_list" v-else>
                    <div class="p_m_item" v-for="item in activeDataNull" :key="item.id">
                        <router-link :to="item.url">
                            <img :src="item.img" alt="" style="height:40px;">
                            <div>
                                <p>{{item.title}}</p>
                                <p>{{item.sub}}</p>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
            <!-- <div class="p_b_r">
                <p class="p_title marB10">客服消息：</p>
                <div class="p_news">
                    <img src="../../assets/images/profile/new_head.png" alt="">
                    <div>
                        <p>小太阳2019<span>12:45</span></p>
                        <p>请问什么时候发货请问什么时候发货</p>
                    </div>
                </div>
                <div class="p_news">
                    <img src="../../assets/images/profile/new_head.png" alt="">
                    <div>
                        <p>小太阳2019<span>12:45</span></p>
                        <p>请问什么时候发货请问什么时候发货</p>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import profileCont from '@/system/constant/profile'
export default {
    name: 'profile',
    data() {
        return {
            realTimeData:[],
            toBeSoldOut:'',
            stayProcessedCount:'',
            staySendCount:'',
            stayAuthCount:'',
            activeData:[],
            selectList:{merchantId:'2',tenantId:1,loginUserId:'1',businessId:'2'},
        }
    },
    computed: {
        commonData() {
            return profileCont.commonData
        },
        realTimeDataNull(){
            return profileCont.realTimeData
        },
        activeDataNull(){
            return profileCont.activeData
        },
        cid(){
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            return shopInfo.id
        }
    },
    created(){
        this.$message.closeAll();
        this.init()
        this.getMarketing()
        this.getOverviewDetails()
        this.getOerviewRemind()
        this.getOverviewSelling()
    },
    methods:{
        ...mapMutations(['SETCURRENT']),
        init(){
            this._apis.shop.getShopInfo({id: this.cid}).then((response)=>{
                if(response.shopExpire == 2){
                    this.$message({
                        showClose: true,
                        message: '您的店铺有效期不足7天，为不影响您的正常使用，请及时联系客服续费。',
                        type: 'warning',
                        duration:0
                    });
                }
            }).catch(error =>{
                console.log('error',error)
            })
        },
        // 概况详情
        getOverviewDetails(){ 
         this._apis.overview.overviewDetails({}).then(response => {
           profileCont.realTimeData.forEach(e => {
                    switch (e.id){
                        case '001': e.price = response.payMoneyAmount
                         break;
                        case '002': e.price = response.payNum
                         break;
                        case '003': e.price = response.refundMoneyAmount
                         break;
                        case '004': e.price = response.refundNum
                         break;
                        case '005': e.price = response.customPayerNum
                         break;
                        case '006': e.price = response.averageMoney
                         break;
                        case '007': e.price = response.memberPayerNum
                         break;
                         }
             this.realTimeData = profileCont.realTimeData
         })
         })
        },
        //刷新
        refresh(){
            this.getOerviewRemind()
            this.getOverviewSelling()
        },
        // 待办提醒
        getOerviewRemind(){
             this._apis.overview.overviewRemind({}).then(response => {
                 this.stayProcessedCount = response.stayProcessedCount
                 this.staySendCount = response.staySendCount
                 this.stayAuthCount = response.stayAuthCount
         })
        },
        // 待办售罄
        getOverviewSelling(){
              this._apis.overview.overviewSelling({}).then(response => {
                  this.toBeSoldOut = response
         })
        },
        // 营销活动 
        getMarketing(){
             this._apis.overview.getMarketing(this.selectList).then(response => {
                 this.activeData = response.slice(0,10)
         })
        },
        //常用功能跳转
        linkTo(item){
            if(item.text == '公众号管理' || item.text == '绑定微信公众号'){
                this.$router.push({path:'/apply',query:{paths:'/application/channelapp/publicnum'}})
                this.SETCURRENT(8)
            }else if(item.text == '小程序管理' || item.text == '绑定微信小程序'){
                this.$router.push({path:'/apply',query:{paths:'/application/channelapp/smallapp'}})
                this.SETCURRENT(8)
            }else if(item.text == '开通短信包'){
                this.$router.push({path:'/apply',query:{paths:'/application/toolapp/paySms'}})
                this.SETCURRENT(8)
            }else if(item.text == '超级海报'){
                this.$router.push({path:'/apply',query:{paths:'/application/feature/posterList'}})
                this.SETCURRENT(8)
            }else if(item.text == '多人拼团'){
                this.$router.push({path:'/apply',query:{paths:'/application/feature/group'}})
                this.SETCURRENT(8)
            }else if(item.text == '更多营销活动'){
                this.$router.push({path:'/apply',query:{paths:'/application/appIndex'}})
                this.SETCURRENT(8)
            }else{
                this.$router.push({path:item.url})
            }
        },
        //营销活动跳转
        linkToApply(item){
            if(item.url){
                this.$router.push({path:'/apply',query:{paths:item.url}})
                this.SETCURRENT(8)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.p_title{
    font-weight:500;
    color: #3D434A;
    span{
        color: #92929B;
        margin-left: 10px;
        font-size: 12px;
    }
}
.p_list{
    display: flex;
    flex-wrap: wrap;
    margin-top: 14px;
}
.p_top_l{
    background-color: #fff;
    width: 100%;
    height: 172px;
    padding: 24px 21px;
    border-radius: 5px;
    .p_t_list{
        width:100%;
        display: flex;
        justify-content:space-between;
        .p_t_item{
            width: 140px;
            height: 60px;
            margin: 27px 25px 0 0; 
            img{
                width: 50px;
                height: 56px;
            }
            .p_t_text{
                width: 65px;
                height: 44px;
                margin: 13px 0 0 7px;
                text-align: left;
                p:first-child{
                    font-size: 12px;
                }
                p:last-child{
                    font-size: 16px;
                }
            }
        }
    }
}
.p_main_l{
    background-color:#fff;
    padding: 24px 21px;
    color: #3D434A;
    border-radius: 5px;
    .p_main_lt{
        margin-top: 20px;
        display: flex;
        justify-content:space-between;
        .step{
            width: 30%;
        }
    }
    .p_main_lb{
        margin-top: 20px;
        display: flex;
        justify-content:space-between;
        .step{
            width: 48%;
        }
    }
}
.p_main_r{
    .p_main_rt{
        background-color:#fff;
        padding: 24px 21px;
        width: 280px;
        height: 297px;
        margin-left: 20px;
        color: #3D434A;
        border-radius: 5px;
        .p_r_list{
            margin-top: 25px;
            p{
                margin-top: 35px;
                span{
                    color: #FD4C2B;
                    float: right;
                }
            }
        }
    }
    .p_main_rb{
        background-color:#fff;
        padding: 24px 21px;
        width: 280px;
        height: 84px;
        margin-left: 20px;
        color: #3D434A;
        border-radius: 5px;
        margin-top: 15px;
        .p_email{
            font-size: 14px;
            color: #3D434AFF;
            line-height: 45px;
        }
    }
}
.p_b_l{
    // float: left;
    width: 50%;
    height: 337px;
    margin-top: 20px;
    background-color: #fff;
    padding: 13px 0 0px 14px;
    border-radius: 5px;
    .p_l_item{
        width: 140px;
        height: 60px;
        border: 1px solid #E6E6E6;
        margin: 0px 0 9px 29px;
        img{
            float: left;
            margin: 12px 0 0 11px;
        }
        span{
            float: left;
            margin: 20px 0 0 7px;
        }
    }
}
.p_b_m{
    // float: left;
    background-color: #fff;
    width: 50%;
    min-height: 337px;
    padding: 13px 0 0px 14px;
    margin: 20px 0 0 20px;
    border-radius: 5px;
    .p_m_item{
        width: 174px;
        height: 60px;
        border: 1px solid #E6E6E6; 
        margin: 0px 10px 9px 0;
        img{
            float: left;
            margin: 12px 0 0 6px;
        }
        div{
            float: left;
            p{
                width:110px; 
                height:18px; 
                line-height:18px; 
                overflow: hidden;
            }
            p:first-child{
                margin: 10px 0 0 5px;
            }
            p:last-child{
                font-size: 12px;
                color: #92929B;
                margin: 8px 0 0 5px;
            }
        }
    }
}
.p_b_r{
    float: left;
    width: 261px;
    height: 403px;
    padding: 14px 10px;
    background-color: #fff;
    margin: 20px 0 0 20px;
    .p_news{
        font-size: 12px;
        width: 240px;
        height: 60px;
        padding: 9px 0;
        border-bottom: 1px solid #D3D3D3;
        img{
            float: left;
        }
        div{
            width: 194px;
            float: left;
            margin-left: 8px;
            p:first-child{
                color: #3D434A;
                margin-top: 3px;
                span{
                    float: right;
                }
            }
            p:last-child{
                width: 110px;
                color: #92929B;
                margin-top: 6px;
                overflow: hidden; 
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
    }
}
.p_top {
    width: 100%;
}
.p_main {
    margin-top: 15px;
    display: flex;
    .p_main_l {
        flex: 1;
    }
}
.p_bottom {
    display: flex;
    // .p_b_m {
    //     flex: 1;
    // }
}
.warn{
    display: flex;
    justify-content:space-between;
    span{
        font-size: 14px;
        font-weight:500;
        color: #3D434A;
        margin-left: 0px;
    }
    i{
        cursor: pointer;
    }
}
.step{
    height: 154px;
    .step_t{
        width:100%;
        height:65px;
        background:#f1f0fc;
        border-radius:4px 4px 0px 0px;
        padding-top: 10px;
        text-align: center;
        position: relative;
        h4{
            height:20px;
            font-size:14px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(61,67,74,1);
            line-height:20px;
        }
        p{
            height:17px;
            font-size:12px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(163,163,171,1);
            line-height:17px;
        }
        img{
            position: absolute;
            top: 6px;
            right: 10px;
        }
        span{
            width:20px;
            height:20px;
            line-height: 20px;
            display: inline-block;
            background:#f1f0fc;
            color:#3D434AFF;
            text-align: center;
            border:1px solid #fff;
            border-radius: 10px;
            position: absolute;
            bottom: -8px;
            left: 48%;
        }
    }
    .step_b{
        width:100%;
        height:86px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 4px 0px rgba(240,239,255,1);
        border-radius:0px 0px 4px 4px;
        padding: 18px;
        p{
            color: #3D434AFF;
            text-align:center;
            span{
                color: #655EFFFF;
                font-size:12px;
                line-height:17px;
                cursor: pointer;
            }
        }
    }
}
</style>


