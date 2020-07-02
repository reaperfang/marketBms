<template>
    <div class="flow_path">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane name="开店准备">
                <span slot="label">开店准备 <img :src="require('@/assets/images/star.png')" alt=""></span>
                <div class="f_list">
                    <div class="f_list_l">
                        <p @click="linkTo({text:'绑定微信公众号'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            绑定微信公众号
                        </p>                        
                        <p @click="linkTo({text:'开通且启用支付方式',url:'/set/payType'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            开通且启用支付方式
                        </p>
                        <p>
                            <img :src="require('@/assets/images/star.png')" alt="">
                            <span @click="linkTo({text:'设置店铺信息',url:'/set/shopInfo'})">设置店铺信息
                            </span>
                            <i>并</i>
                            <span @click="handleBlankLinkTo({text:'设置配送方式',url:'/set/ordinaryExpress'})">设置配送方式</span>
                        </p>
                        <p @click="linkTo({text:'完善商品详情信息',url:'/goods/goodsList'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            完善商品详情信息
                        </p>
                    </div>
                    <div class="f_list_r">
                        <p @click="linkTo({text:'绑定微信小程序'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            绑定微信小程序
                        </p>
                        <p>
                            <img :src="require('@/assets/images/star.png')" alt="">
                            <span @click="linkTo({text:'开通短信包'})">
                                开通短信包
                            </span>
                            <i>并</i>
                            <span @click="linkTo({text:'设置模版和签名'})">
                                设置模版和签名
                            </span>
                        </p>
                        <p>
                            <img :src="require('@/assets/images/star.png')" alt="">
                            <span @click="linkTo({text:'创建商品',url:'/goods/addGoods'})">
                                创建商品
                            </span>
                            <i>或</i> 
                             <span @click="linkTo({text:'商品批量导入',url:'/goods/import'})">
                                 商品批量导入
                             </span>
                        </p>
                        <p @click="linkTo({text:'移动店铺装修',url:'/shop/m_wxShopIndex'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            移动店铺装修
                        </p>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="搭建会员" name="搭建会员">
                <div class="f_list">
                    <div class="f_list_l">
                        <p @click="linkTo({text:'启用会员等级体系',url:'/client/clientLevel'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            启用会员等级体系
                        </p>
                        <p @click="linkTo({text:'用户管理',url:'/client/allClient'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            用户管理
                        </p>
                        <p @click="linkTo({text:'积分管理',url:'/client/creditsManage'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            积分管理
                        </p>
                    </div>
                    <div class="f_list_r">
                        <p @click="linkTo({text:'启用会员体系',url:'/client/cardManage'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            启用会员卡体系
                        </p>
                        <p @click="linkTo({text:'用户标签',url:'/client/clientLabel'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            用户标签
                        </p>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="营销推广" name="营销推广">
                <div class="f_list">
                    <div class="f_list_l">
                        <p @click="linkTo({text:'超级海报'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            超级海报
                        </p>
                        <p @click="linkTo({text:'限时折扣'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            限时折扣
                        </p>
                        <p @click="linkTo({text:'N元N件'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            N元N件
                        </p>
                        <p @click="linkTo({text:'更多'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            更多 &#62;&#62;
                        </p>
                    </div>
                    <div class="f_list_r">
                        <p @click="linkTo({text:'多人拼团'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            多人拼团
                        </p>
                        <p @click="linkTo({text:'节日有礼'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            节日有礼
                        </p>
                        <p @click="linkTo({text:'满减满折'})">
                            <img :src="require('@/assets/images/star.png')" alt="">
                            满减满折
                        </p>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
    name: 'flowPath',
    data() {
        return {
            activeName:'开店准备',
        }
    },
    computed: {
       
    },
    created(){
        
    },
    methods:{
        ...mapMutations(['SETCURRENT']),
        handleBlankLinkTo(item) {
            if (item.text === '设置配送方式') {
                const routeData = this.$router.resolve({ path: item.url });
                window.open(routeData.href, '_blank');
            }
        },
        //常用功能跳转
        linkTo(item){
            if(item.text == '绑定微信公众号'){
                this.$router.push({path:'/apply',query:{paths:'/application/channelapp/publicnum',menuId:'222'}})
                this.SETCURRENT(8)
            }else if(item.text == '绑定微信小程序'){
                this.$router.push({path:'/apply',query:{paths:'/application/channelapp/smallapp',menuId:'222'}})
                this.SETCURRENT(8)
            }else if(item.text == '开通短信包'){
                this.$router.push({path:'/apply',query:{paths:'/application/toolapp/paySms',menuId:'222'}})
                this.SETCURRENT(8)
            }else if(item.text == '设置模版和签名'){
                this.$router.push({path:'/apply',query:{paths:'/application/toolapp/paySms',menuId:'222'}})
                this.SETCURRENT(8)
            }else if(item.text == '超级海报'){
                this.$router.push({path:'/apply/',query:{paths:'/application/feature/posterList',menuId:'222'}})
                this.SETCURRENT(8)
            }else if(item.text == '限时折扣'){
                this.$router.push({path:'/apply',query:{paths:'/application/promotion/time',menuId:'222'}})
                this.SETCURRENT(8)
            }else if(item.text == 'N元N件'){
                this.$router.push({path:'/apply',query:{paths:'/application/promotion/packbuy',menuId:'222'}})
                this.SETCURRENT(8)
            }else if(item.text == '多人拼团'){
                this.$router.push({path:'/apply',query:{paths:'/application/feature/group',menuId:'222'}})
                this.SETCURRENT(8)
            }else if(item.text == '节日有礼'){
                this.$router.push({path:'/apply',query:{paths:'/application/customarket/festival',menuId:'222'}})
                this.SETCURRENT(8)
            }else if(item.text == '满减满折'){
                this.$router.push({path:'/apply',query:{paths:'/application/promotion/fullreduce',menuId:'222'}})
                this.SETCURRENT(8)
            }else if(item.text == '更多'){
                this.$router.push({path:'/apply',query:{paths:'/application/appIndex',menuId:'222'}})
                this.SETCURRENT(8)
            }else{
                this.$router.push({path:item.url})
            }
        },

        handleClick(){

        }
    }
}
</script>
<style lang="scss" scoped>
.flow_path{
   .f_list{
       clear: both;
       overflow: hidden;
       .f_list_l{
           float: left;
           width: 48%;
       }
       .f_list_r{
           float: left;
           width: 48%;
       }
       p{
         cursor: pointer;
         line-height: 35px; 
         color: #655EFFFF;
         i{
             font-style: normal;
             color:#000;
         }  
       }
   }
}
/deep/{
    .el-tabs{
        margin: 25px 0px 0px 25px;
    }
    .el-tabs__header{
        border: none;
        .el-tabs__nav{
            border:1px solid rgba(101,94,255,1);
            border-radius:0px 2px 2px 0px;
        }
        .el-tabs__item{
            width:248px;
            height: 34px;
            line-height: 34px;
            background-color: #FFFFFFFF;
            color: #655EFFFF;
            font-size: 14px;
            text-align: center;
            border-bottom:none;
            border-left:1px solid rgba(101,94,255,1);
        }
        .is-active{
            background-color:#655EFFFF;
            color:#FFFFFFFF;
        }
    }
}
</style>


