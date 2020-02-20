<!--商户信息-->
<template>
  <div class="app-container">
    <el-card class="box-card">
      <section class="guideBox">
        <div class="phoneBox">
          <img src="@/assets/images/shop/phoneBg.png" />
          <div class="phoneBody">
            <div class="item item-talkOne">
              <div class="person" style="margin-top:54px;">
                <img src="@/assets/images/shop/talk-person.png" />
              </div>
              <div class="con talk-left">
                <div class="talk">
                  <img src="@/assets/images/shop/talk-01.png" style="width:253px;height:93px;" />
                  <div class="text">
                    <div class="tit">提示</div>
                    <p class="talk-con">您好，您的店铺还未装修，跟我一起装修您的店铺吧！！</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="item item-talkTwo">
              <div class="con talk-right">
                <div class="talk">
                  <img src="@/assets/images/shop/talk-02.png" style="width:265px;height:130px;" />
                  <div class="text">
                    <div class="tit">一键装修</div>
                    <p class="talk-con" style="padding-right: 10px;">在“店铺模板”中直接选用配套店铺模板进行“一键装修”，然后在“页面管理”中再对选用的模板页面进行编辑，这是最快的装修方法哦！！</p>
                  </div>
                </div>
                <div class="btn">
                  <el-button type="primary" size="mini" style="float:right;" @click="_routeTo('m_templateManageIndex')">一键装修</el-button>
                </div>
              </div>
              <div class="person" style="margin-top:91px;">
                <img src="@/assets/images/shop/talk-person2.png" />
              </div>
            </div>
            <div class="item item-talkThree">
              <div class="con talk-right">
                <div class="talk">
                  <img src="@/assets/images/shop/talk-02.png" style="width:265px;height:154px;" />
                  <div class="text">
                    <div class="tit">自定义页面</div>
                    <p class="talk-con" style="width:285px;">
                      <p>在<span> “页面管理” </span>中进行页面创建或编辑</p>
                      <p>在<span> “店铺导航” </span>中设置店铺导航形式、名称、链接</p>
                      <p>在<span> “店铺风格” </span>中可以设置店铺整体的颜色方案</p>
                      <p>这样可以创建出最个性化的店铺</p>
                    </p>
                  </div>
                </div>
                <div class="btn">
                  <el-button type="primary" size="mini" style="float:right;" @click="_routeTo('m_pageManageIndex')">自定义页面</el-button>
                </div>
              </div>
              <div class="person" style="margin-top:91px;">
                <img src="@/assets/images/shop/talk-person2.png" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4>店铺装修方法</h4>
          <p style="margin-top: 25px;margin-bottom:10px">方法一: 最快捷的方法</p>
          <p>直接在 <el-button @click="_routeTo('m_templateManageIndex')" type="text">店铺模板</el-button> 中选用配套店铺模版进行“一键装修”</p>
          <p style="margin-top: 25px;margin-bottom:10px">方法二: 最个性化的方法</p>
          <p>在 <el-button type="text" @click="_routeTo('m_pageManageIndex')">页面管理</el-button> 中进行页面创建或编辑</p>
          <p>在 <el-button type="text" @click="_routeTo('m_wxShopIndex', {activeTab: 'shopNavIndex'})">店铺导航</el-button> 中设置店铺导航形式、名称、链接</p>
          <p>在 <el-button type="text" @click="_routeTo('m_shopStyle')">店铺风格</el-button> 中可以设置店铺整体的颜色方案这样可以创建出最个性化的店铺</p>
        </div>
      </section>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'shopMainDefault',
  data() {
    return {
    }
  },

  created() {
  },

  methods: {
  }
}
</script>

<style scoped lang="scss">
.el-card{
  border-radius: 0px!important;
  border: none;
}
.guideBox{
  display: flex;
  .phoneBox{
    width: 400px;
    height: 700px;
    position: relative;
    margin-right: 50px;
    img{
      width: 100%;
      height: 100%;
    }

    .phoneBody{
      width: 100%;
      position: absolute;
      left: 25px;
      top: 80px;
      .item{
        display:flex;
        margin-top: 10px;
        margin-left:13px;
        .con{
          display:flex;
          justify-content: flex-end;
          flex-direction:column;
        }
        .talk{
          position:relative;
          .text{
            position:absolute;
            .tit{
              font-size:16px;
              color:#3D434A;
              line-height:16px;
              font-weight:700;
            }
            .talk-con{
              width: 100%;
              margin-top: 10px;
              font-size: 14px;
              color: #3D434A;
              line-height: 17px;
            }
          }
        }
        .talk-left{
          margin-left:5px;
        }
        .talk-right{
          margin-right:9px;
        }
        .person{
          width:60px;
          height:60px;
          border:1px #D0D6E4 solid;
          border-radius:10px;
          overflow:hidden;
          img{
            display:block;
            width:48px;
            height:65px;
            margin:0 auto;
          }
        }
        .btn{
          margin-top:17px;
        }
      }
      .item-talkOne{
        .talk{
          width: 239px;
          height: 93px;
          .text{
            left:38px;
            top:19px;
          }
        }
      }
      .item-talkTwo{
        .talk{
          width:254px;
          height:130px;
          .text{
            left:24px;
            top:20px;
          }
        }
      }
      .item-talkThree{
        .talk{
          width:256px;
          height:154px;
          .text{
            left:15px;
            top:20px;
            width: 237px;
            p{
              margin:0;
            }
            span{
              color:#578EFA;
            }
          }
        }
      }
    }
  }

  p{
    .el-button{
      padding: 0;
    }
  }
  h4{
    font-size: 16px;
    margin: 25px 0 15px;
  }
}
</style>
