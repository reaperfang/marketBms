<!--商户信息-->
<template>
  <div class="app-container">
    <div class="inner">
      <div class="left">
        <div class="screen">
          <h3>店铺装修引导</h3>
          <div class="block">
            <img src="../../../../assets/images/shop/guide/13@2x(1).png" alt="">
            <ul class="tips_list">
              <li class="tips1"><p>您已经对店铺装修有个大概的了解了，现在就让我跟您一起装修您的店铺吧！</p></li>
              <li class="tips2">
                <p>先给您推荐一个简单快捷的方法吧！</p>
                <p>1：在<span style="color: #655eff;">“店铺模板-模板管理”</span>中直接选用系统提供的已经装修好的店铺模板就行“立即使用”</p>
                <p>2：对选用的模板页面按照自己店铺需要的信息和功能进行简单的编辑就可以了！</p>
                <p>这是最快的装修方法哦！</p>
              </li>
            </ul>
          </div>
          <div class="button left_btn" @click="_routeTo('m_templateManageIndex')">一键装修</div>
          <div class="block">
            <ul class="tips_list">
              <li class="tips3"><p>好的，不过我想把我的页面装得个性化一点，可以实现吗？</p></li>
            </ul>
            <img src="../../../../assets/images/shop/guide/13@2xcopy2.png" alt="">
          </div> 
          <div class="block">
            <img src="../../../../assets/images/shop/guide/13@2x(1).png" alt="">
            <ul class="tips_list">
              <li class="tips4"><p>当然可以啦，您可以这样操作</p></li>
            </ul>
          </div>
          <div class="button left_btn" @click="_routeTo('m_pageManageIndex')">点击查看个性化装修引导</div>
        </div>
      </div>
      <div class="right">
        <h3>赏心悦目的页面样式可以提高用户浏览、购物体验的满意度哦。</h3>
        <h4>在装修之前，您需要了解：</h4>
        <p>1：当前版本的移动店铺目前支持微信公众号和微信小程序两个途径进入。每个路径需要单独与微信公众平台绑定，才可以正常地浏览~</p>
        <div class="btns">
          <div class="button right_btn wechat_gzh" @click="linkToApply('gzh')"><i></i><span>点击绑定微信公众号</span></div>
          <div class="button right_btn wechat_xcx" @click="linkToApply('xcx')"><i></i><span>点击绑定微信小程序</span></div>
        </div>
        <p>2：本期暂时无法针对不同路径单独装修，除店铺导航可以针对微信公众号和小程序单独配，其他的装修数据会同步应用在微信公众号和小程序上~</p>
        <p>3：店铺装修成功后，如果您也创建好了商品准备开始售卖，别忘了开启支付方式，这样用户才可以成功购买哦~</p>
        <div class="btns">
           <div class="button right_btn pay_type" @click="$router.push({path:'/set/payType'})"><i></i><span>点击开启支付方式</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'shopMainDefault',
  data() {
    return {
    }
  },

  created() {
  },

  methods: {
    ...mapMutations(['SETCURRENT']),
    linkToApply(page) {
        if(page === 'gzh'){
            this.$router.push({path:'/apply',query:{paths:'/application/channelapp/publicnum'}})
            this.SETCURRENT(8)
        }else if(page === 'xcx'){
            this.$router.push({path:'/apply',query:{paths:'/application/channelapp/smallapp'}})
            this.SETCURRENT(8)
        }
    }
  }
}
</script>

<style scoped lang="scss">
.button{
    cursor: pointer;
    height: 34px;
    border-radius: 20px;
    border: 1px solid #655eff;
    font-size: 14px;
    color: #655eff;
    line-height: 34px;
    text-align: center;
  &.left_btn{
    width:242px;
    margin: 0 0 18px auto;
  }
  &.right_btn{
    width:218px;
    text-align: center;
  }
}
.app-container{
  padding:55px 25px 0;
  background:url('../../../../assets/images/shop/guide/big_back.png') no-repeat 0 0;
  min-width:1300px;
  .inner{
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    .left{
      background:url('../../../../assets/images/shop/guide/iPhone-7-Mockup.png') no-repeat 0 0;
      width:388px;
      margin-right:40px;
      padding: 77px 25px 77px;
      box-sizing: border-box;
      .screen{
        padding:15px;
        box-sizing: border-box;
        h3{
          font-size:14px;
          color:rgba(68,67,75,1);
          line-height:20px;
          font-weight:700;
          text-align: center;
          margin-bottom:15px;
        }
        .block{
          display:flex;
          flex-direction: row;
          justify-content: space-between;
          img{
            width:36px;
            height:49px;
          }
          ul.tips_list{
            li{
              margin-bottom:7px;
              width:250px;
              // height:56px;
              padding:13px 17px;
              box-sizing: border-box;
              p{
                font-size: 12px;
                color:rgba(68,67,75,1);
                line-height:14px;
                margin-bottom:20px;
                // transform: scale(0.8);
              }
              &.tips1{
                 background:url('../../../../assets/images/shop/guide/Rectangle2.png') no-repeat 0 0;
              }
              &.tips2{
                 background:url('../../../../assets/images/shop/guide/Rectangle2Copy.png') no-repeat 0 0;
                 p{
                   margin-bottom:5px;
                 }
              }
              &.tips3{
                 background:url('../../../../assets/images/shop/guide/Rectangle2Copy2.png') no-repeat 0 0;
              } 
              &.tips4{
                 background:url('../../../../assets/images/shop/guide/Rectangle2(1).png') no-repeat 0 0;
              }
            }
          }
        }
        .button{

        }
      }
    }
    .right{
      margin-top:32px;
      box-shadow:0px 2px 4px 0px rgba(0,0,0,0.25);
      border-radius:30px;
      padding:34px 32px;
      box-sizing: border-box;
      width:518px;
      height: 481px;
      h3{
        font-size:16px;
        font-weight:700;
        color:rgba(68,67,75,1);
        line-height:1;
        margin-bottom:24px;
      }
      h4{
        font-size:16px;
        color:rgba(68,67,75,1);
        line-height:1;
        margin-bottom:10px;
      }
      p{
        font-size:14px;
        font-weight:300;
        color:rgba(68,67,75,1);
        line-height:20px;
        margin-bottom:15px;
      }
      .btns{
        // margin-top: 10px;
        // margin-bottom: 10px;
        display:flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top:30px;
        margin-bottom:30px;
        .button{
          display:flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          padding-left:24px;
          height:40px;
          line-height: 40px;
          font-size:15px;
          i{
            width:18px;
            height:16px;
            display:block;
            margin-right:5px;
          }
          &.wechat_gzh{
            i{
              background:url('../../../../assets/images/shop/guide/wechat_gzh.png') no-repeat 0 0;
            }
          }
          &.wechat_xcx{
            i{
              background:url('../../../../assets/images/shop/guide/wechat_xcx.png') no-repeat 0 0;
            }
          }
          &.pay_type{
            color:rgba(255,118,77,1);
            border:1px solid rgba(255,118,77,1);
            i{
              background:url('../../../../assets/images/shop/guide/pay_type.png') no-repeat 0 0;
              height:20px;
            }
          }
        }
      }
    }
  }
}
</style>
