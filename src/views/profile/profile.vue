<template>
    <div class="p_container">
        <div class="p_l">
            <div class="p_l_item p_l_top">
                <p class="p_title">
                    实时概况：<span>今日数据更新时间：{{new Date() | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                </p>
                <div class="p_p">
                    <div class="p_p_l">
                        <span>
                            <div>支付金额</div>
                            <div>{{profileData.payMoneyAmount ? '¥'+ profileData.payMoneyAmount : '--' }}</div>    
                        </span>
                        <span>
                            <div>支付订单数</div>
                            <div>{{profileData.payNum ? profileData.payNum : '--' }}</div>    
                        </span>
                        <span>
                            <div>支付用户数</div>
                            <div>{{profileData.customPayerNum ? profileData.customPayerNum : '--' }}</div>    
                        </span>
                        <span>
                            <div>客单价</div>
                            <div>{{profileData.averageMoney ? '¥'+ profileData.averageMoney : '--' }}</div>    
                        </span>
                    </div>
                     <div class="p_p_r">
                         <span>
                            <div>累计总收入</div>
                            <div>{{profileData.income ? '¥'+ profileData.income : '--' }}</div>    
                        </span>
                        <span>
                            <div>累计实际总收入</div>
                            <div>{{profileData.realIncome ? '¥'+ profileData.realIncome : '--' }}</div>    
                        </span>
                        <span>
                            <div>累计售后单数</div>
                            <div>{{profileData.protectCount ? profileData.protectCount : '--' }}</div>    
                        </span>
                        <span>
                            <div>累计售后单金额</div>
                            <div>{{profileData.refundMoneyAmount ? '¥'+ profileData.refundMoneyAmount : '--' }}</div>    
                        </span>
                     </div>
                </div>
            </div>
            <div class="p_l_item p_l_main">
                <p class="p_title">
                    智能助手：<span>您需要在开通店铺前做以下准备工作（带<img :src="require('@/assets/images/star.png')" alt=""> 为必备事项）</span>
                </p>
                <flowPath></flowPath>
             </div>
            <div class="p_l_item p_l_bottom">
                <p class="p_title">
                    常用功能：
                </p>
                <div class="functions">
                    <a @click="linkTo({text:'新建商品',url:'/goods/addGoods'})">
                        <img :src="require('@/assets/images/profile/icon_fun_01.png')" alt="">
                        <span>新建商品</span>
                    </a>
                    <a @click="linkTo({text:'店铺装修',url:'/shop/m_templateManageIndex'})">
                        <img :src="require('@/assets/images/profile/icon_fun_02.png')" alt="">
                        <span>店铺装修</span>
                    </a>
                    <a @click="linkTo({text:'用户管理',url:'/client/allClient'})">
                        <img :src="require('@/assets/images/profile/icon_fun_03.png')" alt="">
                        <span>用户管理</span>
                    </a>
                    <a @click="linkTo({text:'发货管理',url:'/order/deliveryManagement'})">
                        <img :src="require('@/assets/images/profile/icon_fun_04.png')" alt="">
                        <span>发货管理</span>
                    </a>
                    <a @click="linkTo({text:'店铺促销'})">
                        <img :src="require('@/assets/images/profile/icon_fun_05.png')" alt="">
                        <span>店铺促销</span>
                    </a>
                    <a @click="linkTo({text:'特色玩法'})">
                        <img :src="require('@/assets/images/profile/icon_fun_06.png')" alt="">
                        <span>特色玩法</span>
                    </a>
                    <a @click="linkTo({text:'互动营销'})">
                        <img :src="require('@/assets/images/profile/icon_fun_07.png')" alt="">
                        <span>互动营销</span>
                    </a>
                    <a @click="linkTo({text:'用户营销'})">
                        <img :src="require('@/assets/images/profile/icon_fun_08.png')" alt="">
                        <span>用户营销</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="p_r">
            <div class="p_r_item p_r_top">
                <p class="p_title warn">
                    <span>
                        <img :src="require('@/assets/images/profile/icon_01.png')" alt="">
                        待办提醒
                    </span>
                    <i class="el-icon-refresh" @click="refresh"></i>    
                </p>
                <div class="p_r_list">
                    <p>商品售罄
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
                    <p>售后待审核
                        <router-link to="/order/afterSalesManagement?orderAfterSaleStatus=0">
                            <span>({{stayAuthCount || 0}})</span>
                        </router-link>
                    </p>
                </div>
            </div>
            <div class="p_r_item p_r_kefu">
                <p class="p_title warn">
                    <span>
                        <img :src="require('@/assets/images/profile/icon_02.png')" alt="">
                        客服中心
                    </span>   
                </p>
                <p class="p_email">
                    客服电话：010-87127347 
                </p>
                <p class="p_email">
                    客服邮箱：shushangzhongxin@300.cn 
                </p>
            </div>
            <div class="p_r_item p_r_more">
                <p class="p_title warn">
                    <span>
                        <img :src="require('@/assets/images/profile/icon_04.png')" alt="">
                        更多工具
                    </span>   
                </p>
                <p class="title_h5">
                    商户工作台H5
                </p>
                <p class="link_h5">
                    <span ref="linkH5">{{protocol}}//omo.aiyouyi.cn/bh</span>
                    <img :src="require('@/assets/images/profile/icon_05.png')" alt="" v-clipboard:copy="pageLink" v-clipboard:success="onCopy" v-clipboard:error="onError">
                </p>
                <img :src="qrCode" alt="">
                <p class="erweima">
                    扫描二维码，随时随地做生意
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import profileCont from '@/system/constant/profile'
import Clipboard from 'clipboard'
import flowPath from './flowPath'
export default {
    name: 'profile',
    components: {flowPath},
    data() {
        return {
            profileData:'',
            toBeSoldOut:'',
            stayProcessedCount:'',
            staySendCount:'',
            stayAuthCount:'',
            pageLink: location.protocol + '//omo.aiyouyi.cn/bh',
            qrCode:'',
            protocol: location.protocol
        }
    },
    computed: {
        cid(){
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            return shopInfo.id
        }
    },
    created(){
        this.$message.closeAll();
        this.init()
        this.getQrcode()
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

        //获取二维码
        getQrcode(){
            this._apis.shop.getQrcode({
                url: this.pageLink,
                width: '80',
                height: '80'
            }).then((response)=>{
                this.qrCode = `data:image/png;base64,${response}`;
            }).catch((error)=>{
                console.error(error);
            });
        },

        // 实时概况
        getOverviewDetails(){ 
         this._apis.overview.overviewDetails({}).then(response => {
           this.profileData = response
         }).catch(error =>{
             console.log('error',error)
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
        //常用功能跳转
        linkTo(item){
            if(item.text == '店铺促销'){
                this.$router.push({path:'/apply',query:{paths:'/application/promotion', applyId:4}})
                this.SETCURRENT(8)
            }else if(item.text == '特色玩法'){
                this.$router.push({path:'/apply',query:{paths:'/application/feature', applyId:5}})
                this.SETCURRENT(8)
            }else if(item.text == '互动营销'){
                this.$router.push({path:'/apply',query:{paths:'/application/interactmarket', applyId:7}})
                this.SETCURRENT(8)
            }else if(item.text == '用户营销'){
                this.$router.push({path:'/apply',query:{paths:'/application/customarket', applyId:6}})
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

        // 复制商家工作台h5地址成功
        onCopy(){
            this.$message({
                message: '复制成功！',
                type: 'success'
            });
        },

        // 复制商家工作台h5地址失败
        onError(){
            this.$message({
                message: '该浏览器不支持复制。',
                type: 'warning'
            });  
        }
    }
}
</script>
<style lang="scss" scoped>
.p_container{
    display: flex;
    .p_l{
        flex: 1;
        .p_l_item{
            background-color: #fff;
            padding: 26px;
            border-radius: 5px;
        }
        .p_l_top{
            .p_p{
                clear: both;
                overflow: hidden;
                .p_p_l{
                    width: 45%;
                    float: left;
                    border-right:1px solid #F2F2F9FF; 
                    padding-left: 20px;
                }
                .p_p_r{
                    width: 45%;
                    float: left;
                    padding-left: 75px;
                }
                span{
                    margin-top: 20px;
                    width: 45%;
                    height: 70px;
                    display: inline-block;
                    font-family:PingFangSC-Regular,PingFang SC;
                    div:nth-of-type(1){
                        font-size: 12px;
                        color: #333330FF;
                        height: 40px;
                        line-height: 40px;
                        font-weight:400;
                    }
                    div:nth-of-type(2){
                        font-size: 18px;
                        color:#655EFFFF;
                        font-weight: bold;
                    }
                }
            }
        }
        .p_l_main{
            margin-top:15px; 
        }
        .p_l_bottom{
            margin-top:15px; 
            .functions{
                clear: both;
                overflow: hidden;
                a{
                    float: left;
                    width: 24%;
                    height: 30px;
                    display: inline-block;
                    margin-top: 20px;
                    img{
                        vertical-align:middle;
                    }
                }
            }
        }
    }

    .p_r{
        width: 300px;
        .p_r_item{
            background-color:#fff;
            padding: 24px 21px;
            width: 285px;
            margin-left: 20px;
            color: #3D434A;
            border-radius: 5px;
        }
        .p_r_top{           
            .p_r_list{
                p{
                    margin-top: 20px;
                    span{
                        color: #FD4C2B;
                        float: right;
                    }
                }
            }
        }
        .p_r_kefu{
            margin: 15px 0px 10px 20px;
            .p_email{
                font-size: 14px;
                color: #3D434AFF;
                line-height: 20px;
                margin-top: 10px;
            }
        }
        .p_r_more{
            .title_h5{
                font-size: 14px;
                color: #3D434AFF;
                line-height: 20px;
                margin-top: 10px;
            }
            .link_h5{
                font-size: 13px;
                color: #92929BFF;
                line-height: 20px;
                img{
                    margin-left: 40px;
                    cursor: pointer;
                }
            }
            .erweima{
                font-size: 12px;
                color: #92929BFF;
            }
        }
    }
}

.p_title{
    font-size: 14px;
    font-weight:500;
    color: #3D434AFF;
    span{
        color: #92929BFF;
        margin-left: 10px;
        font-size: 12px;
    }
}

.warn{
    display: flex;
    justify-content:space-between;
    span{
        font-size: 14px;
        font-weight:500;
        color: #3D434A;
        margin-left: 0px;
        img{
            vertical-align: middle;
            margin-right: 5px;
        }
    }
    i{
        cursor: pointer;
    }
}
</style>


