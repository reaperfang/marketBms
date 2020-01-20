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
                <img src="../../../assets/images/shop/userCenter/userAvater.png" alt="">
              </div>
              <div class="statusBox">
                <!-- 已登录 -->
                <div class="loginAfterBox">
                  <p class="name" :style="{color:data.nickColor}">用户微信名称</p>
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
                  <img src="../../../assets/images/shop/userCenter/userCenterVipLogo.png" alt="">
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
                <img src="../../../assets/images/shop/userCenter/userCenterMyOrderStatusIcon1.png" alt="" class="tb">
                <p class="name">待付款</p>
              </li>
              <li>
                <img src="../../../assets/images/shop/userCenter/userCenterMyOrderStatusIcon2.png" alt="" class="tb">
                <p class="name">待收货</p>
              </li>
              <li>
                <img src="../../../assets/images/shop/userCenter/userCenterMyOrderStatusIcon3.png" alt="" class="tb">
                <p class="name">待评价</p>
              </li>
              <li>
                <img src="../../../assets/images/shop/userCenter/userCenterMyOrderStatusIcon4.png" alt="" class="tb">
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
              <img :src="data.moduleList.memberRank.icon || require('../../../assets/images/shop/userCenter/userCenter13.png')" alt class="tb" />
              <p class="name" :style="{color: data.moduleList.memberRank.color}">{{data.moduleList.memberRank.titleValue}}</p>
              <p class="more iconfont icon-tiaozhuan">Lv5</p>
            </li>
            <!--赠品包  -->
            <li>
              <img  :src="data.moduleList.gift.icon || require('../../../assets/images/shop/userCenter/userCenter16.png')" alt="" class="tb">
              <p class="name" :style="{color: data.moduleList.gift.color}">{{data.moduleList.gift.titleValue}}</p>
              <p class="more iconfont icon-tiaozhuan">待领取5件</p>
            </li>
            <!-- 我的拼团 -->
            <li>
              <img :src="data.moduleList.myAssemble.icon || require('../../../assets/images/shop/userCenter/userCenter17.png')" alt="" class="tb">
              <p class="name" :style="{color: data.moduleList.myAssemble.color}">{{data.moduleList.myAssemble.titleValue}}</p>
              <p class="more iconfont icon-tiaozhuan">拼团中1个</p>
            </li>
            <!--收货地址  -->
            <li>
              <img :src="data.moduleList.address.icon || require('../../../assets/images/shop/userCenter/userCenter18.png')" alt="" class="tb">
              <p class="name" :style="{color: data.moduleList.address.color}">{{data.moduleList.address.titleValue}}</p>
              <p class="more iconfont icon-tiaozhuan"></p>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "componentUserCenter",
  components: {},
  props: ["data"],
  data() {
    return {
      bg: {
        background:
          "linear-gradient(rgba(255, 255, 255, 0), rgb(255, 255, 255)),url('" +
          (this.data.backgroundImage || require('../../../assets/images/shop/userCenter/userCenter1.png')) +
          "') no-repeat center"
      },
      bg1: {
        background: "url('" + (this.data.backgroundImage || require('../../../assets/images/shop/userCenter/userCenter1.png')) + "') no-repeat"
      }
    };
  },
  created() {},
  watch: {
    data: {
      handler(newValue) {
        this.ruleForm = newValue;
        this.bg= {
          background:
            "linear-gradient(rgba(255, 255, 255, 0), rgb(255, 255, 255)),url('" +
            (this.data.backgroundImage || require('../../../assets/images/shop/userCenter/userCenter1.png')) +
            "') no-repeat center"
        };
        this.bg1= {
          background: "url('" + (this.data.backgroundImage || require('../../../assets/images/shop/userCenter/userCenter1.png')) + "') no-repeat"
        };
      },
      deep: true
    }
  },
  computed: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.userCenterBody{
  background:#FBFBFB;
  overflow:hidden;
  // 个人中心面板
  .userCenterPanel{
    overflow:hidden;
    .bj{
      width:375px;
      height:200px;
      img{
        width:100%;
        height:100%;
      }
    }
    .main{
      margin-top:-130px;
      @include borderRadius(8px);
      background:#fff;
      position:relative;
      display:inline-block;
      margin-left:10px;
      width:calc(100% - 20px);
      .avatarBox{
        padding:0 20px;
        .avatar{
          width:60px;
          height:60px;
          @include borderRadius(50%);
          overflow:hidden;
          img{
            width:100%;
            height:100%;
          }
        }
        .statusBox{
          overflow:hidden;
          position:relative;
          .noLoginText{
            line-height:60px;
            color:#333;
            font-size:18px;
            font-weight:bold;
          }
          .loginAfterBox{
            overflow:hidden;
            position:relative;
            .name{
              line-height:25px;
              font-size:18px;
              font-weight:bold;
              color:#00555D;
            }
            .VipLevelName{
              line-height:14px;
              font-size:10px;
              color:#bbb;
              svg{
                position:relative;
                top:2.5px;
              }
            }
            .VipLevelName.active{
              color:#F9BE96;
            }
          }
          .personalInfoText{
            position:absolute;
            font-size:12px;
            color:#333;
            &:before{
              position:absolute;
              font-size:10px;
              color:#333;
            }
          }
        }
      }
      .avatarBox.styleLeft{
        overflow:hidden;
        margin-top:21px;
        .avatar{
          float:left;
          margin-right:16px;
        }
        .statusBox{
          .loginAfterBox{
            float:left;
            max-width:160px;
            .name{
              margin-top:7px;
            }
            .VipLevelName{
              margin-top:6px;
            }
          }
          .personalInfoText{
            line-height:60px;
            top:0;
            right:0;
            padding-right:12px;
            &:before{
              right:-2.5px;
            }
          }
        }
      }
      // 登录状态居中
      .avatarBox.styleCenter{
        display:inline-block;
        width:100%;
        .avatar{
          margin:0 auto;
          margin-top:-30px;
        }
        .statusBox{
          .loginAfterBox{
            padding:0 65px;
            .name{
              margin-top:11px;
              text-align:center;
            }
            .VipLevelName{
              margin-top:5px;
              text-align:center;
              svg{
                position:relative;
                top:3.5px;
              }
            }
          }
          .personalInfoText{
            line-height:60px;
            top:0;
            right:0;
            padding-right:12px;
            &:before{
              right:-2.5px;
            }
          }
        }
      }
      // 登录状态居右
      .avatarBox.styleRight{
        overflow:hidden;
        margin-top:21px;
        .avatar{
          float:right;
          margin-left:16px;
        }
        .statusBox{
          .loginAfterBox{
            float:right;
            max-width:160px;
            .name{
              margin-top:7px;
            }
            .VipLevelName{
              margin-top:6px;
            }
          }
          .personalInfoText{
            line-height:60px;
            top:0;
            left:0;
            padding-left:12px;
            &:before{
              left:-2.5px;
              @include rotate(rotateZ(180deg));
            }
          }
        }
      }
      .VipCardBox{
        overflow:hidden;
        margin-top:16px;
        // 未领取会员卡状态
        .noReceiveBox{
          margin:0 15px;
          padding:0 15px;
          height:62px;
          background:url("../../../assets/images/shop/userCenter/userCenterVipCardBj.png") no-repeat;
          background-size:100% 100%;
          .logo{
            float:left;
            width:36px;
            height:27px;
            margin:16.5px 12.5px 0 0;
            img{
              width:100%;
              height:100%;
            }
          }
          .text{
            overflow:hidden;
            position:relative;
            .title{
              color:#FED9C7;
              font-size:12px;
              line-height:17px;
              margin-top:12.5px;
            }
            .des{
              color:#FED9C7;
              font-size:15px;
              line-height:21px;
              margin-top:1.5px;
            }
            .button{
              position:absolute;
              width:71px;
              height:25px;
              right:0;
              top:19.5px;
              background:#F9BE96;
              color:#130502;
              font-size:10px;
              line-height:25px;
              text-align:center;
              border-radius:25px;
            }
          }
        }
        // 已领取会员卡状态
        .afterReceiveBox{
          height:62px;
          position:relative;
          .logo{
            position:absolute;
            img{
              width:100%;
              height:100%;
            }
          }
          .level{
            position:absolute;
            color:#FED9C7;
          }
          .title{
            position:absolute;
            color:#FED9C7;
          }
          .number{
            position:absolute;
            color:#FED9C7;
          }
          .button{
            position:absolute;
            color:#F9BE96;
          }
        }
        // 领取后 风格1
        .afterReceiveBox.style1{
          background:url("../../../assets/images/shop/userCenter/userCenterVipCardBj.png") no-repeat;
          background-size:100% 100%;
          margin:0 15px;
          &:before{
            content:"";
            width:1px;
            height:30px;
            background:#FED9C7;
            position:absolute;
            left:62.5px;
            top:16px;
          }
          .logo{
            width:22px;
            height:15px;
            left:21px;
            top:14px;
            img{
              width:100%;
              height:100%;
            }
          }
          .level{
            left:20.5px;
            top:31px;
            font-size:14px;
            line-height:20px;
          }
          .title{
            left:83px;
            top:12px;
            font-size:15px;
            line-height:21px;
          }
          .number{
            left:83px;
            top:36px;
            font-size:10px;
            line-height:14px;
          }
          .button{
            right:21px;
            top:22px;
            line-height:17px;
            font-size:12px;
          }
        }
        // 领取后 风格2
        .afterReceiveBox.style2{
          background:url("../../../assets/images/shop/userCenter/userCenterVipCardBj.png") no-repeat;
          background-size:100% 100%;
          border-radius:50px;
          &:before{
            content:"";
            width:1px;
            height:30px;
            left:78.5px;
            top:16px;
            background:#FED9C7;
            position:absolute;
          }
          .logo{
            width:22px;
            height:15px;
            left:37px;
            top:14px;
            img{
              width:100%;
              height:100%;
            }
          }
          .level{
            left:36.5px;
            top:31px;
            font-size:14px;
            line-height:20px;
          }
          .title{
            left:99px;
            top:12px;
            font-size:15px;
            line-height:21px;
          }
          .number{
            left:100px;
            top:36px;
            font-size:10px;
            line-height:14px;
          }
          .button{
            right:37px;
            top:22px;
            line-height:17px;
            font-size:12px;
          }
        }
        // 领取后 风格3
        .afterReceiveBox.style3{
          background:url("../../../assets/images/shop/userCenter/userCenterVipCardBj2.png") no-repeat;
          background-size:100% 100%;
          width:160px;
          height:62px;
          float:right;
          .logo{
            width:18px;
            height:12px;
            left:10px;
            top:25px;
            img{
              width:100%;
              height:100%;
            }
          }
          .level{
            left:36px;
            top:5px;
            font-size:12px;
            line-height:17px;
          }
          .title{
            left:36px;
            top:24px;
            font-size:13px;
            line-height:18px;
          }
          .number{
            left:36px;
            top:47px;
            font-size:8px;
            line-height:11px;
          }
          .button{
            right:5px;
            top:5px;
            line-height:13px;
            font-size:9px;
          }
        }
      }
      // 余额模块
      .balanceBox{
        overflow:hidden;
        padding:20px 0 23px;
        position:relative;
        ul{
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          flex-direction: row;
          li{
            flex:1;
            position:relative;
            padding:0 5px;
            &:first-child{
              &:before{
                display:none;
              }
            }
            &:before{
              content:"";
              position:absolute;
              width:1px;
              height:27.5px;
              left:0;
              top:50%;
              margin-top:-13.75px;
              background:#EDEDED;
            }
            .number{
              font-size:19px;
              line-height:18px;
              height:18px;
              color:#333;
              font-weight:bold;
              text-align:center;
              font{
                font-size:13px;
              }
            }
            .name{
              margin-top:11.5px;
              text-align:center;
              color:#333;
              font-size:12px;
              line-height:17px;
            }
            .label{
              position:absolute;
              width:30px;
              height:12px;
              text-align:center;
              line-height:12px;
              color:#fff;
              background:#999999;
              font-size:9px;
              left:50%;
              margin-left:-15px;
              bottom:-17px;
            }
          }
        }
        .qdLabel{
          line-height:12px;
          color:#fff;
          border-radius:25px;
          text-align:center;
          width:30px;
          background:#00555D;
          font-size:9px;
          position:absolute;
          top:8px;
          right:6.5px;
        }
      }

    }
  }
  // 我的订单
  .myOrderBox{
    margin:10px;
    margin-bottom:0;
    overflow:hidden;
    @include borderRadius(8px);
    box-shadow:2px 2px 2px 0px rgba(228,228,228,0.5);
    background:#fff;
    padding:0 10px;
    .titleBar{
      height:39.5px;
      border-bottom:1px solid #EDEDED;
      .title{
        float:left;
        line-height:39px;
        font-size:14px;
        color:#333;
      }
      .more{
        float:right;
        color:#999;
        font-size:12px;
        line-height:39px;
        padding-right:15px;
        position:relative;
        &:before{
            color:#999;
            font-size:10px;
            position:absolute;
            right:0;
          }
      }
    }
    .content{
      overflow:hidden;
      ul{
        overflow:hidden;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        flex-direction: row;
        li{
          flex:1;
          height:93.5px;
          position:relative;
          .label{
            position:absolute;
            line-height:16px;
            background:#00555D;
            color:#fff;
            border-radius:50%;
            min-width:16px;
            padding:0 3.5px;
            text-align:center;
            font-size:9px;
            left:50%;
            margin-left:10px;
            top:20px;
          }
          .tb{
            width:30px;
            height:30px;
            margin:0 auto;
            margin-top:27.5px;
            display:block;
          }
          .name{
            color:#333;
            font-size:12px;
            line-height:17px;
            margin-top:4px;
            text-align:center;
          }
        }
      }
    }
  }
  // 功能列表
  .functionList{
    overflow:hidden;
    margin:10px;
    margin-bottom:15px;
    box-shadow:2px 2px 2px 0px rgba(228,228,228,0.5);
    ul{
      overflow:hidden;
      padding:0 10px;
      box-shadow:2px 2px 2px 0px rgba(228,228,228,0.5);
      border-radius:8px;
      background:#fff;
      li{
        height:50px;
        border-top:1px solid #F2F2F2;
        &:first-child{
          border-top:0;
          height:49px;
        }
        .tb{
          width:25px;
          height:22px;
          float:left;
          margin-top:13px;
          margin-right:12px;
        }
        .name{
          float:left;
          line-height:49px;
          font-size:13px;
          color:#333;
        }
        .more{
          float:right;
          line-height:49px;
          font-size:12px;
          color:#999;
          padding-right:17px;
          position:relative;
          &:before{
            color:#999;
            font-size:10px;
            position:absolute;
            right:0;
          }
        }
      }
    }
  }

}
</style>
