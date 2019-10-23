<template>
    <div class="p_container">
        <div class="p_top clearfix">
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
            <div class="p_top_r">
                <p class="p_title warn">
                    <span>待办提醒：</span>
                    <i class="el-icon-refresh" @click="refresh"></i>    
                </p>
                <div class="p_r_list">
                    <p>待办售罄
                        <router-link to="/goods/goodsList">
                            <span>({{toBeSoldOut || 0}})</span>
                        </router-link>    
                    </p>
                    <p>待发货订单
                        <router-link to="/goods/goodsList">
                            <span>({{staySendCount || 0}})</span>
                        </router-link>
                    </p>
                    <p>售后待处理
                        <router-link to="/order/afterSalesManagement">
                            <span>({{stayProcessedCount || 0}})</span>
                        </router-link>
                    </p>
                    <p>售后单待审核
                        <router-link to="/order/afterSalesManagement">
                            <span>({{stayAuthCount || 0}})</span>
                        </router-link>
                    </p>
                    <!-- <p>积分商城订单待发货<span>(23)</span></p> -->
                </div>
            </div>
        </div>
        <div class="p_bottom clearfix">
            <div class="p_b_l">
                <p class="p_title" style="padding-left: 29px">常用功能：</p>
                <div class="p_list">
                    <div class="p_l_item clearfix" v-for="item in commonData" :key="item.id">
                        <router-link :to="item.url">
                            <img :src="item.img" alt="">
                            <span>{{item.text}}</span>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="p_b_m">
                <p class="p_title">营销活动：</p>
                <div class="p_list" v-if="activeData.length != 0">
                    <div class="p_m_item" v-for="item in activeData" :key="item.id">
                        <span  @click="linkTo(item)">
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
        }
    },
    methods:{
        ...mapMutations(['SETCURRENT']),
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
            if(item.appName == '公众号管理'){
                this.$router.push({path:'/apply',query:{paths:'/application/channelapp/publicnum'}})
                this.SETCURRENT(8)
            }else if(item.appName == '小程序管理'){
                this.$router.push({path:'/apply',query:{paths:'/application/channelapp/smallapp'}})
                this.SETCURRENT(8)
            }else{
                this.$router.push({path:item.url})
            }
        }
    },
    created(){
        this.getMarketing()
        this.getOverviewDetails()
        this.getOerviewRemind()
        this.getOverviewSelling()
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
    float: left;
    background-color: #fff;
    width: 717px;
    height: 251px;
    padding: 24px 21px;
    border-radius: 5px;
    .p_t_list{
        width: 660px;
        display: flex;
        flex-wrap: wrap;
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
.p_top_r{
    float: left;
    background-color:#fff;
    padding: 24px 21px;
    width: 261px;
    height: 251px;
    margin-left: 20px;
    color: #3D434A;
    border-radius: 5px;
    .p_r_list{
        margin-top: 25px;
        p{
            margin-top: 17px;
            span{
                color: #FD4C2B;
                float: right;
            }
        }
    }
}
.p_b_l{
    float: left;
    width: 400px;
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
    float: left;
    background-color: #fff;
    width: 578px;
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
    display: flex;
    .p_top_r {
        flex: 1;
    }
}
.p_bottom {
    display: flex;
    .p_b_m {
        flex: 1;
    }
}
.warn{
    display: flex;
    justify-content:space-between;
    span{
        font-size: 14px;
        font-weight:500;
        color: #3D434A;
    }
    i{
        cursor: pointer;
    }
}
</style>


