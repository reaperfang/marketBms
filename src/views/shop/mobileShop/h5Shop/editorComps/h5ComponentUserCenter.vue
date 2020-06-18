/* 移动H5用户中心装修预览区 -- 继承自 微信用户中心装修预览区 */
<template>
  <!-- 我的->用户中心wyy 2019/7/23 v-if="data && personalData"-->
  <div class="container">
    <div class="container-view">
      <div class="userCenterBody">
        <!-- 个人中心登录状态面板 -->
        <div class="userCenterPanel">
          <div class="bj" :style="data.backgroundGradients===1?bg1:bg">
            <!-- <img src="@/assets/images/userCenterPanelBj.png" alt=""> -->
          </div>
          <div class="main">
            <!-- 头像 名称 -->
            <div class="avatarBox" :class="data.avatarPosition?(data.avatarPosition==1?'styleLeft':(data.avatarPosition==2?'styleCenter':'styleRight')):'styleLeft'">
              <div class="avatar">
                <img src="../../../../../assets/images/shop/userCenter/userAvater.png" alt="">
              </div>
              <div class="statusBox">
                <!-- 已登录 -->
                <div class="loginAfterBox">
                  <p class="name" :style="{color:data.nickColor}">Carol Walker</p>
                  <p class="VipLevelName active">
                    <svg width="13" height="14" viewBox="0 0 13 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="页面1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="个人中心-头像居左" transform="translate(-108.000000, -185.000000)" fill="#F9BE96" fill-rule="nonzero">
                                <g id="个人中心" transform="translate(0.000000, 64.000000)">
                                    <g id="编组" transform="translate(10.000000, 59.500000)">
                                        <g id="个人" transform="translate(19.000000, 21.000000)">
                                            <g id="会员等级" transform="translate(79.500000, 38.500000)">
                                                <g id="huiyuan-2" transform="translate(0.000000, 2.000000)">
                                                    <path d="M6,0 C9.30825,0 12,2.69175 12,6 C12,9.30825 9.30825,12 6,12 C2.69175,12 0,9.30825 0,6 C0,2.69175 2.69175,0 6,0 Z M8.383,4.3 L9.8,4.3 L9.8,3 L6.55,3 L6.55,4.3 L6.98095,4.3 C6.6176,5.18595 6.2536,6.05825 5.9,6.88895 C5.5464,6.05825 5.1824,5.18595 4.81905,4.3 L5.25,4.3 L5.25,3 L2,3 L2,4.3 L3.417,4.3 C4.74885,7.56235 5.9,10.15 5.9,10.15 C5.9,10.15 7.0505,7.56235 8.383,4.3 Z" id="形状结合"></path>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                  等级名称</p>
                </div>
                <p class="personalInfoText iconfont icon-tiaozhuan">个人资料</p>
              </div>
            </div>
            <!-- 会员卡 -->
            <div class="VipCardBox">
              <!-- 已领取会员卡 样式 style1 style2 style3 -->
              <div class="afterReceiveBox" :class="data.memberColumeStyle?'style'+data.memberColumeStyle:'style1'" >
                <div class="logo">
                  <img src="../../../../../assets/images/shop/userCenter/userCenterVipLogo.png" alt="">
                </div>
                <p class="level">Lv5</p>
                <p class="title">卡名称展示</p>
                <p class="number">3654736473683276492549</p>
                <div class="button">查看权益</div>
              </div>
            </div>
            <!-- 余额 积分 -->
            <div class="balanceBox">
              <ul> 
                <li>
                  <p class="number">2287.05</p>
                  <p class="name">余额(￥)</p>
                  <p class="label">已冻结</p>
                </li>
                <!-- 优惠券 -->
                <li>
                  <p class="number">5</p>
                  <p class="name" :style="{color: data.moduleList.coupon.color}">{{data.moduleList.coupon.titleValue}}</p>
                </li>
                <!-- 优惠码 -->
                <li>
                  <p class="number">5</p>
                  <p class="name" :style="{color: data.moduleList.couponCode.color}">{{data.moduleList.couponCode.titleValue}}</p>
                </li>
                <li>
                  <p class="number">1285</p>
                  <p class="name">积分</p>
                  <p class="label">已冻结</p>
                </li>
              </ul>
              <div class="qdLabel">签到</div>
            </div>
          </div>
        </div>
        <!-- 订单 -->
        <div class="myOrderBox">
          <div class="titleBar">
            <p class="title">我的订单</p>
            <p class="more iconfont icon-tiaozhuan">查看全部订单</p>
          </div>
          <div class="content">
            <ul>
              <li>
                <div class="label">3</div>
                <img src="../../../../../assets/images/shop/userCenter/userCenterMyOrderStatusIcon1.png" alt="" class="tb">
                <p class="name">待付款</p>
              </li>
              <li>
                <img src="../../../../../assets/images/shop/userCenter/userCenterMyOrderStatusIcon2.png" alt="" class="tb">
                <p class="name">待收货</p>
              </li>
              <li>
                <img src="../../../../../assets/images/shop/userCenter/userCenterMyOrderStatusIcon3.png" alt="" class="tb">
                <p class="name">待评价</p>
              </li>
              <li>
                <img src="../../../../../assets/images/shop/userCenter/userCenterMyOrderStatusIcon4.png" alt="" class="tb">
                <p class="name">售后</p>
              </li>
            </ul>
          </div>
        </div>
        <!-- 功能列表 -->
        <div class="functionList">
          <ul>
            <!-- 积分商城 -->
            <!-- <li>
              <img :src="data.moduleList.integralMarket.icon" alt="" class="tb">
              <p class="name" :style="{color:data.moduleList.integralMarket.color || ''}">{{data.moduleList.integralMarket.titleValue}}</p>
              <p class="more iconfont icon-tiaozhuan">NEW</p>
            </li> -->
            <!-- 消息中心 -->
            <!-- <li @click="_routeTo('messageList')">
              <img :src="data.moduleList.messageCenter.icon" alt="" class="tb">
              <p class="name" :style="{color:data.moduleList.integralMarket.color}">{{data.moduleList.messageCenter.titleValue}}</p>
              <p class="more iconfont icon-tiaozhuan">{{infoNot==0?'没有新消息':infoNot}}</p>
            </li> -->
            <!-- 会员等级id:会员id,levelId:会员等级id -->
            <li>
              <img :src="data.moduleList.memberRank.icon || require('../../../../../assets/images/shop/userCenter/userCenter13.png')" alt class="tb" />
              <p class="name" :style="{color: data.moduleList.memberRank.color}">{{data.moduleList.memberRank.titleValue}}</p>
              <p class="more iconfont icon-tiaozhuan">Lv5</p>
            </li>
            <!--赠品包  -->
            <li>
              <img  :src="data.moduleList.gift.icon || require('../../../../../assets/images/shop/userCenter/userCenter16.png')" alt="" class="tb">
              <p class="name" :style="{color: data.moduleList.gift.color}">{{data.moduleList.gift.titleValue}}</p>
              <p class="more iconfont icon-tiaozhuan">待领取5件</p>
            </li>
            <!-- 我的拼团 -->
            <li>
              <img :src="data.moduleList.myAssemble.icon || require('../../../../../assets/images/shop/userCenter/userCenter17.png')" alt="" class="tb">
              <p class="name" :style="{color: data.moduleList.myAssemble.color}">{{data.moduleList.myAssemble.titleValue}}</p>
              <p class="more iconfont icon-tiaozhuan">拼团中1个</p>
            </li>
            <!--收货地址  -->
            <li>
              <img :src="data.moduleList.address.icon || require('../../../../../assets/images/shop/userCenter/userCenter18.png')" alt="" class="tb">
              <p class="name" :style="{color: data.moduleList.address.color}">{{data.moduleList.address.titleValue}}</p>
              <p class="more iconfont icon-tiaozhuan"></p>
            </li>
            <!--分销中心  -->
            <li>
              <img :src="data.moduleList.commission.icon || require('../../../../../assets/images/shop/userCenter/userCenter21.png')" alt="" class="tb">
              <p class="name" :style="{color: data.moduleList.commission.color}">{{data.moduleList.commission.titleValue}}</p>
              <p class="more iconfont icon-tiaozhuan"></p>
            </li>
            <!-- 安全中心 -->
            <li>
              <img :src="data.moduleList.myAssemble.icon || require('../../../../../assets/images/shop/userCenter/userCenter17.png')" alt="" class="tb">
              <p class="name" :style="{color: data.moduleList.myAssemble.color}">安全中心</p>
              <p class="more iconfont icon-tiaozhuan"></p>
            </li>
            <!--退出登录  -->
            <li>
              <img :src="data.moduleList.address.icon || require('../../../../../assets/images/shop/userCenter/userCenter18.png')" alt="" class="tb">
              <p class="name" :style="{color: data.moduleList.address.color}">退出登录</p>
              <p class="more iconfont icon-tiaozhuan"></p>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import componentUserCenter from '../../wxShop/editorComps/componentUserCenter';
export default {
  name: 'h5ComponentUserCenter',
  extends: componentUserCenter
}
</script>