<template>
  <!-- 我的->用户中心wyy 2019/7/23 -->
  <div class="container" v-if="data">
    <div class="container-view">
      <div class="userCenter">
        <!-- 第一部分 用户个人信息 -->
        <div class="userCenter_first">
          <div class="userCenter_firstTop" :style="data.backgroundGradients===1?bg1:bg">
            <!-- 动态变换部分：样式一，左 -->
            <div class="userCenter_firstTitle" v-if="data.avatarPosition===1">
              <div class="userCenter_firstTitlel fl">
                <p class="userCenter_firstTitlel1 fl">
                  <img src="../../../assets/images/shop/userCenter/coupon.png" alt />
                </p>
                <p class="userCenter_firstTitlel2 fl" :style="{color:data.nickColor}">用户微信名称</p>
                <p class="userCenter_firstTitlel3">
                  <img src="../../../assets/images/shop/userCenter/userCenter3.png" alt />
                  <span>等级名称</span>
                </p>
              </div>
              <div class="userCenter_firstTitler fr">
                <p class="userCenter_firstTitler1">
                  <img src="../../../assets/images/shop/userCenter/userCenter4.png" alt />
                </p>
                <p class="userCenter_firstTitler2">
                  <img src="../../../assets/images/shop/userCenter/userCenter5.png" alt />
                  <span>签到</span>
                </p>
              </div>
            </div>
            <!-- 动态变换部分：样式一，居中 -->
            <div class="userCenter_firstTitle1" v-if="data.avatarPosition===2">
              <div class="userCenter_firstTitle1l">
                <p class="userCenter_firstTitler2">
                  <img src="../../../assets/images/shop/userCenter/userCenter5.png" alt />
                  <span>签到</span>
                </p>
              </div>
              <div class="userCenter_firstTitle1c ellipsis">
                <p class="userCenter_firstTitle1c_img">
                  <img src="../../../assets/images/shop/userCenter/coupon.png" alt />
                </p>
                <p class="userCenter_firstTitle1c_img1">
                  <img src="../../../assets/images/shop/userCenter/userCenter3.png" alt />
                  <span class="ellipsis">等级名称</span>
                </p>
                <p class="userCenter_firstTitle1c_title" :style="{color:data.nickColor}">用户微信名称</p>
              </div>
              <div class="userCenter_firstTitler">
                <p class="userCenter_firstTitler_img">
                  <img src="../../../assets/images/shop/userCenter/userCenter4.png" alt />
                </p>
              </div>
            </div>
            <!-- 动态变换部分：样式一，右 -->
            <div class="userCenter_firstTitle2" v-if="data.avatarPosition===3">
              <div class="userCenter_firstTitle2l ellipsis">
                <p class="userCenter_firstTitler2">
                  <img src="../../../assets/images/shop/userCenter/userCenter5.png" alt />
                  <span>签到</span>
                </p>
                <p
                  class="userCenter_firstTitle2_title ellipsis"
                  :style="{color:data.nickColor}"
                >用户微信名称</p>
              </div>
              <div class="userCenter_firstTitle2r">
                <p class="userCenter_firstTitler_img">
                  <img src="../../../assets/images/shop/userCenter/userCenter4.png" alt />
                </p>
                <p class="userCenter_firstTitle1c_img">
                  <img src="../../../assets/images/shop/userCenter/coupon.png" alt />
                </p>
                <p class="userCenter_firstTitle1c_img1">
                  <img src="../../../assets/images/shop/userCenter/userCenter3.png" alt />
                  <span class="ellipsis">等级名称</span>
                </p>
              </div>
            </div>
            <!-- 动态变换部分：会员样式一 -->
            <div class="userCenter_car" v-if="data.memberColumeStyle===1">
              <p class="userCenter_car1">
                <span>3654736473683276492549</span>
                <span>Lv5</span>
              </p>
              <p class="userCenter_car2">卡名称展示</p>
            </div>
            <!-- 动态变换部分：会员样式二 -->
            <div class="userCenter_car_two" v-if="data.memberColumeStyle===2">
              <p class="userCenter_car_two1">
                <span>3654736473683276492549</span>
              </p>
              <p class="userCenter_car_two2 ellipsis">卡名称展示</p>
              <p class="userCenter_car_two3">
                <span>Lv5</span>
              </p>
            </div>
            <!--  动态变换部分：会员样式三-->
            <div class="userCenter_car_three" v-if="data.memberColumeStyle===3">
              <p class="userCenter_car_three1">
                <span>3654736473683276492549</span>
                <span>Lv5</span>
              </p>
              <p class="userCenter_car_three2 ellipsis">卡名称展示</p>
            </div>
          </div>

          <div class="userCenter_firstBottom">
            <div class="userCenter_firstBottoml">
              <p>
                <span class="userCenter_firstBottoml_first">1285</span>
                <span class="userCenter_firstBottoml_two">已冻结</span>
              </p>
              <div class="userCenter_firstBottoml1">积分</div>
              <div class="userCenter_firstBottoml2"></div>
            </div>
            <div class="userCenter_firstBottomr">
              <p>2287.05</p>
              <div class="userCenter_firstBottoml1">账户余额</div>
            </div>
          </div>
        </div>
        <!-- 第二部分 首付款订单信息 -->
        <div class="userCenter_two">
          <div class="userCenter_twol">
            <ul>
              <li>
                <img src="../../../assets/images/shop/userCenter/userCenter6.png" alt />
                <p>待付款</p>
                <span>3</span>
              </li>
              <li>
                <img src="../../../assets/images/shop/userCenter/userCenter7.png" alt />
                <p>待收货</p>
              </li>
              <li>
                <img src="../../../assets/images/shop/userCenter/userCenter8.png" alt />
                <p>待评价</p>
              </li>
              <li>
                <img src="../../../assets/images/shop/userCenter/userCenter9.png" alt />
                <div class="userCenter_two4">退款/退货</div>
              </li>
            </ul>
          </div>
          <div class="userCenter_two2">
            <img src="../../../assets/images/shop/userCenter/userCenter10.png" alt />
            <div class="userCenter_two2Name">全部</div>
            <div class="userCenter_two2line"></div>
          </div>
        </div>
        <!-- 第三部分 底部积分、领卷信息 -->
        <div class="userCenter_three">
          <div class="userCenter_three1">
            <ul>
              <!-- <li>
                <div class="userCenter_three1Img">
                  <img :src="(data.moduleList.integralMarket&&data.moduleList.integralMarket.icon) || require('../../../assets/images/shop/userCenter/userCenter11.png')" alt />
                </div>
                <div class="userCenter_three1Cont">
                  <p class="fl" :style="{color: data.moduleList.integralMarket&&data.moduleList.integralMarket.color}">{{data.moduleList.integralMarket&&data.moduleList.integralMarket.titleValue}}</p>
                  <div class="fr userCenter_three1Cont_r">
                    <div class="userCenter_three1Cont_r1">
                      <span>NEW</span>
                    </div>

                    <img src="../../../assets/images/shop/userCenter/triangle.png" alt />
                  </div>
                </div>
              </li> -->
              <!-- <li>
                <div class="userCenter_three1Img">
                  <img :src="data.moduleList.messageCenter&&data.moduleList.messageCenter.icon || require('../../../assets/images/shop/userCenter/userCenter12.png')" alt />
                </div>
                <div class="userCenter_three1Cont">
                  <p class="fl" :style="{color: data.moduleList.messageCenter&&data.moduleList.messageCenter.color}">{{data.moduleList.messageCenter&&data.moduleList.messageCenter.titleValue}}</p>
                  <div class="userCenter_three1Cont_r">
                    <div class="userCenter_three1Cont_r1">99+</div>
                    <img src="../../../assets/images/shop/userCenter/triangle.png" alt />
                  </div>
                </div>
              </li> -->
              <li>
                <div class="userCenter_three1Img">
                  <img :src="data.moduleList.memberRank.icon || require('../../../assets/images/shop/userCenter/userCenter13.png')" alt />
                </div>
                <div class="userCenter_three1Cont">
                  <p class="fl" :style="{color: data.moduleList.memberRank.color}">{{data.moduleList.memberRank.titleValue}}</p>
                  <div class="userCenter_three1Cont_r">
                    <div class="userCenter_three1Cont_r2">Lv5</div>
                    <img src="../../../assets/images/shop/userCenter/triangle.png" alt />
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="userCenter_three2">
            <ul>
              <li>
                <div class="userCenter_three1Img">
                  <img :src="data.moduleList.coupon.icon || require('../../../assets/images/shop/userCenter/userCenter14.png')" alt />
                </div>
                <div class="userCenter_three1Cont">
                  <p class="fl" :style="{color: data.moduleList.coupon.color}">{{data.moduleList.coupon.titleValue}}</p>
                  <div class="userCenter_three1Cont_r">
                    <div class="userCenter_three1Cont_r2">可使用5张</div>
                    <img src="../../../assets/images/shop/userCenter/triangle.png" alt />
                  </div>
                </div>
              </li>
              <li>
                <div class="userCenter_three1Img">
                  <img :src="data.moduleList.couponCode.icon || require('../../../assets/images/shop/userCenter/userCenter15.png')" alt />
                </div>
                <div class="userCenter_three1Cont">
                  <p class="fl" :style="{color: data.moduleList.couponCode.color}">{{data.moduleList.couponCode.titleValue}}</p>
                  <div class="userCenter_three1Cont_r">
                    <div class="userCenter_three1Cont_r2">可使用5个</div>
                    <img src="../../../assets/images/shop/userCenter/triangle.png" alt />
                  </div>
                </div>
              </li>
              <li>
                <div class="userCenter_three1Img">
                  <img :src="data.moduleList.gift.icon || require('../../../assets/images/shop/userCenter/userCenter16.png')" alt />
                </div>
                <div class="userCenter_three1Cont">
                  <p class="fl" :style="{color: data.moduleList.gift.color}">{{data.moduleList.gift.titleValue}}</p>
                  <div class="userCenter_three1Cont_r">
                    <div class="userCenter_three1Cont_r2 color_v2">待领取5件</div>
                    <img src="../../../assets/images/shop/userCenter/triangle.png" alt />
                  </div>
                </div>
              </li>
              <li>
                <div class="userCenter_three1Img">
                  <img :src="data.moduleList.myAssemble.icon || require('../../../assets/images/shop/userCenter/userCenter17.png')" alt />
                </div>
                <div class="userCenter_three1Cont">
                  <p class="fl" :style="{color: data.moduleList.myAssemble.color}">{{data.moduleList.myAssemble.titleValue}}</p>
                  <div class="userCenter_three1Cont_r">
                    <div class="userCenter_three1Cont_r2">拼团中1个</div>
                    <img src="../../../assets/images/shop/userCenter/triangle.png" alt />
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="userCenter_three3">
            <ul>
              <li>
                <div class="userCenter_three1Img">
                  <img :src="data.moduleList.address.icon || require('../../../assets/images/shop/userCenter/userCenter18.png')" alt />
                </div>
                <div class="userCenter_three1Cont">
                  <p class="fl" :style="{color: data.moduleList.address.color}">{{data.moduleList.address.titleValue}}</p>
                  <div class="userCenter_three1Cont_r">
                    <img src="../../../assets/images/shop/userCenter/triangle.png" alt />
                  </div>
                </div>
              </li>
            </ul>
          </div>
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
.userCenter {
  background: #fff;
  & > .userCenter_first {
    height: 301px;
    background: #fff;
    border-bottom: 6px solid #f7f7f7;
    & > .userCenter_firstTop {
      height: 222px;
      background-size: cover!important;
      position: relative;
      & > .userCenter_firstTitle {
        height: 100px;
        position: relative;
        padding: 30px 10px 0px 15px;
        & > .userCenter_firstTitlel {
          & > .userCenter_firstTitlel1 {
            width: 59px;
            height: 60px;
            & > img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          & > .userCenter_firstTitlel2 {
            padding-left: 19px;
            line-height: 60px;
            font-size: 18px;
            font-weight: 600;
          }
          & > .userCenter_firstTitlel3 {
            position: absolute;
            bottom: -4px;
            left: 10px;
            & > img {
              width: 74px;
              height: 23px;
            }
            & > span {
              position: absolute;
              bottom: 2px;
              left: 7px;
              color: #fff;
              font-size: 9px;
              transform: scale(0.75);
              width: 74px;
              height: 23px;
              text-align: center;
            }
          }
        }
        & > .userCenter_firstTitler {
          & > .userCenter_firstTitler1 {
            & > img {
              width: 21px;
              height: 20px;
            }
          }
          & > .userCenter_firstTitler2 {
            width: 70px;
            height: 27px;
            background: rgba(239, 239, 239, 0.5);
            border-radius: 13px 0px 0px 13px;
            position: absolute;
            right: 0px;
            bottom: 0px;
            padding: 6px 0px 0px 10px;
            & > img {
              width: 18px;
              height: 17px;
            }
            & > span {
              font-size: 13px;
              color: #fff;
              display: inline-block;
              position: absolute;
              right: 10px;
              top: 5px;
            }
          }
        }
      }
      //   样式一，居中
      & > .userCenter_firstTitle1 {
        padding: 18px 0px 0px 0px;
        display: flex;
        & > div {
          flex: 1;
        }
        & > .userCenter_firstTitle1l {
          & > .userCenter_firstTitler2 {
            width: 70px;
            height: 27px;
            background: rgba(239, 239, 239, 0.5);
            border-radius: 0px 13px 13px 0px;
            display: flex;
            align-items: center;
            & > img {
              width: 18px;
              height: 17px;
              margin-left: 11px;
            }
            & > span {
              font-size: 13px;
              color: #fff;
              display: inline-block;
              margin-left: 5px;
            }
          }
        }
        & > .userCenter_firstTitle1c {
          text-align: center;
          & > .userCenter_firstTitle1c_img {
            width: 60px;
            height: 60px;
            margin: 0 auto;
            & > img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          & > .userCenter_firstTitle1c_img1 {
            position: relative;
            margin-top: -14px;
            & > img {
              width: 74px;
              height: 23px;
            }
            & > span {
              position: absolute;
              bottom: 2px;
              left: 35px;
              color: #fff;
              font-size: 9px;
              transform: scale(0.75);
              width: 74px;
              height: 23px;
              text-align: center;
            }
          }
          & > .userCenter_firstTitle1c_title {
            width: 100%;
            font-size: 18px;
            font-weight: 500;
          }
        }
        & > .userCenter_firstTitler {
          text-align: right;
          padding-right: 10px;
          & > .userCenter_firstTitler_img {
            & > img {
              width: 21px;
              height: 20px;
            }
          }
        }
      }
      // 样式一，右侧
      .userCenter_firstTitle2 {
        display: flex;
        padding: 15px 15px 0px 0px;
        & > div {
          flex: 1;
        }
        & > .userCenter_firstTitle2l {
          & > .userCenter_firstTitler2 {
            width: 70px;
            height: 27px;
            background: rgba(239, 239, 239, 0.5);
            border-radius: 0px 13px 13px 0px;
            display: flex;
            align-items: center;
            & > img {
              width: 18px;
              height: 17px;
              margin-left: 11px;
            }
            & > span {
              font-size: 13px;
              color: #fff;
              display: inline-block;
              margin-left: 5px;
            }
          }
          & > .userCenter_firstTitle2_title {
            padding-top: 23px;
            padding-left: 12px;
            font-size: 18px;
            font-weight: 500;
          }
        }
        & > .userCenter_firstTitle2r {
          text-align: right;
          position: relative;
          & > .userCenter_firstTitler_img {
            padding-right: 6px;
            & > img {
              width: 21px;
              height: 20px;
            }
          }
          & > .userCenter_firstTitle1c_img {
            width: 60px;
            height: 60px;
            position: absolute;
            right: 0px;
            margin-top: 12px;
            & > img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          & > .userCenter_firstTitle1c_img1 {
            position: relative;
            position: absolute;
            right: -2px;
            bottom: -30px;
            & > img {
              width: 74px;
              height: 23px;
            }
            & > span {
              position: absolute;
              bottom: 2px;
              right: -7px;
              color: #fff;
              font-size: 9px;
              transform: scale(0.75);
              width: 74px;
              height: 23px;
              text-align: center;
            }
          }
        }
      }
      // 样式一
      & > .userCenter_car {
        background: url("../../../assets/images/shop/userCenter/userCenter2.png")
          no-repeat;
        height: 93px;
        background-size: 100% 100%;
        margin: 0px 10px;
        position: absolute;
        bottom: 1px;
        width: 95%;
        & > .userCenter_car1 {
          padding: 11px 16px 0px 16px;
          & > span:first-child {
            display: inline-block;
            color: rgba(255, 255, 255, 1);
            background: linear-gradient(
              0deg,
              rgba(255, 210, 101, 1) 0%,
              rgba(255, 238, 206, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          & > span:last-child {
            float: right;
            font-size: 14px;
            font-weight: 600;
            font-style: italic;
            color: rgba(255, 255, 255, 1);
            background: linear-gradient(
              36deg,
              rgba(255, 210, 101, 1) 0%,
              rgba(255, 238, 206, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        & > .userCenter_car2 {
          font-size: 21px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          padding-top: 20px;
          background: linear-gradient(
            0deg,
            rgba(255, 210, 101, 1) 0%,
            rgba(255, 238, 206, 1) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }
      }
      // 样式二
      & > .userCenter_car_two {
        background: url("../../../assets/images/shop/userCenter/userCenter19.png")
          no-repeat;
        background-size: 100% 100%;
        width: 137px;
        height: 120px;
        position: absolute;
        right: 0px;
        bottom: -16px;
        & > .userCenter_car_two1 {
          transform: rotate(12deg);
          padding-top: 7px;
          & > span {
            display: inline-block;
            transform: scale(0.58);
            font-size: 7px;
            background: linear-gradient(
              90deg,
              rgba(255, 210, 101, 1) 0%,
              rgba(255, 238, 206, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            padding-top: 6px;
            font-weight: 600;
          }
        }
        & > .userCenter_car_two2 {
          font-size: 16px;
          font-weight: 600;
          background: linear-gradient(
            90deg,
            rgba(255, 210, 101, 1) 0%,
            rgba(255, 238, 206, 1) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transform: rotate(12deg);
          text-align: center;
          transform: rotate(13deg);
          text-align: center;
          padding-top: 15px;
          padding-left: 5px;
        }
        & > .userCenter_car_two3 {
          transform: rotate(12deg);
          padding-top: 13px;
          padding-left: 10px;

          & > span {
            display: inline-block;
            font-size: 10px;
            transform: scale(0.83);
            background: linear-gradient(
              90deg,
              rgba(255, 210, 101, 1) 0%,
              rgba(255, 238, 206, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 600;
          }
        }
      }
      // 样式三
      & > .userCenter_car_three {
        background: url("../../../assets/images/shop/userCenter/userCenter20.png")
          no-repeat;
        height: 62px;
        background-size: 100% 100%;
        margin: 0px 10px;
        position: absolute;
        bottom: 1px;
        width: 95%;
        & > .userCenter_car_three1 {
          padding: 4px 9px 0px 9px;
          & > span:first-child {
            display: inline-block;
            color: rgba(255, 255, 255, 1);
            background: linear-gradient(
              0deg,
              rgba(255, 210, 101, 1) 0%,
              rgba(255, 238, 206, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 10px;
            transform: scale(0.83);
            -webkit-transform-origin-x: 0;
          }
          & > span:last-child {
            float: right;
            font-size: 12px;
            font-weight: 600;
            font-style: italic;
            color: rgba(255, 255, 255, 1);
            background: linear-gradient(
              36deg,
              rgba(255, 210, 101, 1) 0%,
              rgba(255, 238, 206, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        & > .userCenter_car_three2 {
          font-size: 19px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          padding-top: 5px;
          background: linear-gradient(
            0deg,
            rgba(255, 210, 101, 1) 0%,
            rgba(255, 238, 206, 1) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }
      }
    }
    & > .userCenter_firstBottom {
      display: flex;
      height: 74px;
      text-align: center;
      justify-content: center;
      align-items: center;
      & > div {
        flex: 1;
      }
      & > .userCenter_firstBottoml {
        & > p {
          position: relative;
          & > .userCenter_firstBottoml_first {
            font-size: 18px;
            font-weight: 600;
            color: rgba(51, 51, 51, 1);
            padding-right: 10px;
          }
          & > .userCenter_firstBottoml_two {
            width: 48px;
            height: 20px;
            line-height: 20px;
            background: #999999;
            border-radius: 2px;
            font-size: 11px;
            transform: scale(0.89);
            color: #fff;
            display: inline-block;
            position: absolute;
          }
        }
        & > .userCenter_firstBottoml1 {
          font-size: 12px;
          color: #333;
          padding-right: 5px;
        }
        & > .userCenter_firstBottoml2 {
          width: 1px;
          height: 26px;
          background: rgba(229, 229, 229, 1);
          float: right;
          margin-top: -38px;
        }
      }
      & > .userCenter_firstBottomr {
        & > p {
          font-size: 18px;
          font-weight: 600;
          color: #333333;
        }
        & > div {
          font-size: 12px;
          color: #333;
        }
      }
    }
  }
  & > .userCenter_two {
    height: 86px;
    border-bottom: 6px solid #f7f7f7;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    padding: 22px 20px 22px 0;
    & > .userCenter_twol {
      flex: 1;
      & > ul {
        display: flex;
        justify-content: space-between;
        & > li {
          text-align: center;
          line-height: 1;
          position: relative;
          height: 43px;
          flex: 1;
          & > p {
            font-size: 12px;
            color: #7c7c7c;
            position: absolute;
            bottom: 0px;
            left: 20%;
          }
          & > span {
            width: 14px;
            height: 14px;
            border: 1px solid #fc3d42;
            display: inline-block;
            border-radius: 7px;
            position: absolute;
            color: #fc3d42;
            right: 20px;
            top: -7px;
            background: #fff;
          }
        }
        & > li:nth-child(1) {
          & > img {
            width: 20px;
            height: 20px;
          }
        }
        & > li:nth-child(2) {
          & > img {
            width: 23px;
            height: 19px;
          }
        }
        & > li:nth-child(3) {
          & > img {
            width: 18px;
            height: 22px;
          }
        }
        & > li:nth-child(4) {
          & > img {
            width: 22px;
            height: 22px;
          }
          & > .userCenter_two4 {
            font-size: 12px;
            color: #7c7c7c;
            position: absolute;
            bottom: 0px;
            left: 13%;
          }
        }
        & > li:nth-child(5) {
          border-left: 1px solid red;
          & > img {
            width: 20px;
            height: 20px;
          }
          & > .userCenter_two5 {
            font-size: 12px;
            color: #7c7c7c;
            position: absolute;
            bottom: 0px;
            left: 32%;
          }
        }
      }
    }
    & > .userCenter_two2 {
      flex: 0 0 50px;
      position: relative;
      line-height: 1;
      height: 43px;
      float: right;
      & > img {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 1px;
      }
      & > .userCenter_two2Name {
        font-size: 12px;
        color: #7c7c7c;
        position: absolute;
        bottom: 0px;
        right: 0px;
      }
      & > .userCenter_two2line {
        width: 1px;
        background: #f7f7f7;
        height: 35px;
        margin-left: 6px;
        margin-top: 6px;
      }
    }
  }
  & > .userCenter_three {
    & > .userCenter_three1,
    .userCenter_three2,
    .userCenter_three3 {
      & > ul {
        padding: 0px 10px;
        & > li:last-child {
          & > .userCenter_three1Cont {
            border-bottom: 0px solid #eeeeee;
          }
        }
        & > li {
          height: 55px;
          line-height: 55px;
          display: flex;
          & > .userCenter_three1Img {
            flex: 0 0 42px;
            & > img {
              width: 35px;
              height: 35px;
              margin-top: 12px;
              object-fit: cover;
            }
          }
          & > .userCenter_three1Cont {
            flex: 1;
            border-bottom: 1px solid #eeeeee;
            & > p {
              font-size: 15px;
              color: #333333;
            }
            & > .userCenter_three1Cont_r {
              font-size: 15px;
              color: #333333;
              float: right;
              & > img {
                width: 6px;
                height: 11px;
              }
              & > .userCenter_three1Cont_r1 {
                width: 34px;
                height: 16px;
                background: #fc3e43;
                border-radius: 16px;
                font-size: 12px;
                font-weight: 500;
                color: pink;
                line-height: 16px;
                margin-right: 15px;
                float: left;
                text-align: center;
                margin-top: 20px;
              }
              & > .userCenter_three1Cont_r2 {
                font-size: 13px;
                color: #999;
                float: left;
                margin-right: 15px;
              }
            }
          }
        }
      }
    }
    & > .userCenter_three2,
    .userCenter_three3 {
      border-top: 6px solid #f7f7f7;
    }
  }
}
</style>
