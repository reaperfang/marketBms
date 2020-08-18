<template>
  <div class="p_container">
    <div class="p_l">
      <div class="p_l_item p_l_top">
        <p class="realTime_survey">
          <span class="title">
            <span class="title1">实时概况：</span>
            <span class="title2">今日数据更新时间：{{new Date() | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
          </span>
          <span class="look_info" @click="linkTo({text:'订单管理',url:'/order/query'})">查看详情</span>
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
      <div class="p_l_main">
        <div class="p_l_item dealt">
          <p class="title1">待办提醒：</p>
          <div class="dealt_list">
            <div class="dealt_list_l">
              <p>
                <span class="name">待发货订单</span>
                <router-link to="/order/deliveryManagement?status=3">
                  <span class="num">{{staySendCount || 0}}</span>
                </router-link>
              </p>
              <p>
                <span class="name">商品售罄</span>
                <router-link to="/goods/goodsList?status=-1">
                  <span class="num">{{toBeSoldOut || 0}}</span>
                </router-link>
              </p>
            </div>
            <div class="dealt_list_r">
              <p>
                <span class="name">维权待审核</span>
                <router-link to="/order/afterSalesManagement?orderAfterSaleStatus=0">
                  <span class="num">{{stayAuthCount || 0}}</span>
                </router-link>
              </p>
              <p>
                <span class="name">维权中订单</span>
                <router-link to="/order/afterSalesManagement?orderAfterSaleStatus=2">
                  <span class="num">{{stayProcessedCount || 0}}</span>
                </router-link>
              </p>
            </div>
          </div>
        </div>
        <div class="p_l_item helper">
          <p class="p_title title1">
            智能助手：
            <span>
              您需要在开通店铺前做以下准备工作（带
              <img :src="require('@/assets/images/star.png')" alt /> 为必备事项）
            </span>
          </p>
          <flowPath></flowPath>
        </div>
      </div>
      <div class="p_l_bottom">
        <div class="p_l_item p_l_bottom_l">
          <p class="title1">常用功能：</p>
          <div class="functions">
            <div class="jcgl">
              <p class="title3">基础管理</p>
              <a @click="linkTo({text:'新建商品',url:'/goods/addGoods'})">
                <img :src="require('@/assets/images/profile/icon_fun_01.png')" alt />
                <span>新建商品</span>
              </a>
              <a @click="linkTo({text:'发货管理',url:'/order/deliveryManagement'})">
                <img :src="require('@/assets/images/profile/icon_fun_02.png')" alt />
                <span>发货管理</span>
              </a>
              <a @click="linkTo({text:'店铺装修',url:'/shop/m_templateManageIndex'})">
                <img :src="require('@/assets/images/profile/icon_fun_03.png')" alt />
                <span>店铺装修</span>
              </a>
            </div>
            <div class="yhyy">
              <p class="title3">用户运营</p>
              <a @click="linkTo({text:'用户管理',url:'/client/allClient'})">
                <img :src="require('@/assets/images/profile/icon_fun_04.png')" alt />
                <span>用户管理</span>
              </a>
              <a @click="linkTo({text:'积分管理',url:'/client/creditsManage'})">
                <img :src="require('@/assets/images/profile/icon_fun_05.png')" alt />
                <span>积分管理</span>
              </a>
              <a @click="linkTo({text:'用户标签',url:'/client/clientLabel'})">
                <img :src="require('@/assets/images/profile/icon_fun_06.png')" alt />
                <span>用户标签</span>
              </a>
            </div>
            <div class="scyx">
              <p class="title3">商城营销</p>
              <a @click="linkTo({text:'互动营销'})">
                <img :src="require('@/assets/images/profile/icon_fun_07.png')" alt />
                <span>互动营销</span>
              </a>
              <a @click="linkTo({text:'用户营销'})">
                <img :src="require('@/assets/images/profile/icon_fun_08.png')" alt />
                <span>用户营销</span>
              </a>
              <a @click="linkTo({text:'特色玩法'})">
                <img :src="require('@/assets/images/profile/icon_fun_09.png')" alt />
                <span>特色玩法</span>
              </a>
            </div>
          </div>
        </div>
        <div class="p_l_item p_l_bottom_r">
          <p class="title1">微信商城：</p>
          <div class="main">
            <div>
              <p class="title3">微信小程序商城</p>
              <div v-if="!isReleaseWX && !isEmpowerWX && wxQrcode">
                <img  class="erweima" :src="wxQrcode" alt/>
                <p class="opt">
                  <el-button @click="downs(wxQrcode,'微信小程序商城二维码')">下载</el-button>
                </p>
              </div>
              <div v-if="isEmpowerWX">
                <img  :src="require('@/assets/images/profile/no_empower.png')" alt/>
                <p class="title4">您当前还未授权小程序</p>
                <p class="opt">
                  <el-button @click="linkTo({text:'绑定微信小程序'})">立即授权</el-button>
                </p>
              </div>
              <div v-if="isReleaseWX">
                <img  :src="require('@/assets/images/profile/no_release_wx.png')"  class="no_release" alt/>
                <p class="title4">您当前还未发布小程序</p>
                <p class="opt">
                  <el-button @click="linkTo({text:'绑定微信小程序'})">立即发布</el-button>
                </p>
              </div>
            </div>
            <div>
              <p class="title3">微信公众号商城</p>
              <div v-if="!isReleaseGZ && !isEmpowerGZ && gzQrcode">
                <img  class="erweima" :src="gzQrcode" alt>
                <p class="opt">
                  <el-button @click="downs(gzQrcode,'微信公众号商城二维码')">下载</el-button>
                  <el-button v-clipboard:copy="gzLink" v-clipboard:success="onCopy" v-clipboard:error="onError">复制链接</el-button>
                </p>
              </div>
              <div v-if="isEmpowerGZ">
                <img  :src="require('@/assets/images/profile/no_empower.png')" alt/>
                <p class="title4">您当前还未授权公众号</p>
                <p class="opt">
                  <el-button @click="linkTo({text:'绑定微信公众号'})">立即授权</el-button>
                </p>
              </div>
              <div v-if="isReleaseGZ">
                <img  :src="require('@/assets/images/profile/no_release_gz.png')" class="no_release" alt/>
                <p class="title4">您当前还未设置商城首页</p>
                <p class="opt">
                  <el-button @click="linkTo({text:'绑定微信公众号'})">立即发布</el-button>
                </p>
              </div>
            </div>
          </div>  
        </div>
      </div>
    </div>
    <div class="p_r">
       <!-- 客服中心 -->
      <div class="p_r_item p_r_kefu">
        <div class="p_r_kefu_l">
          <img :src="require('@/assets/images/profile/icon_kf.png')" alt class="icon_kf"/>
        </div>
        <div>
          <p class="title1">客服中心:</p>
          <p class="p_email">客服电话：400-660-5555</p>
          <p class="p_email">客服邮箱：</p>
          <p>service4006@300.cn</p>
        </div>
      </div>
      <!-- 客户工作台 -->
      <div class="p_r_item p_r_sjgzt">
        <div>
          <img :src="qrCode" alt />
        </div>
        <div class="p_r_sjgzt_r">
          <p class="title1 gzt">
            客户工作台:
          </p>
          <p class="title2">
            商户工作台H5
          </p>
          <p class="operation">
            <a @click="downs(qrCode,'商户工作台H5二维码')">下载</a>
            <a v-clipboard:copy="pageLink" v-clipboard:success="onCopy" v-clipboard:error="onError" class="ml15">复制链接</a>
          </p>
        </div>
      </div>
      <!-- 产品动态 -->
      <div class="p_r_item p_r_dt">
        <p class="p_title warn">
          <span>
            <img :src="require('@/assets/images/profile/icon_dt.png')" alt />
            <span class="title1">产品动态</span>
          </span>
          <el-link
            :href="zxLink+'/cms?type=service&dept=aiyouyi.cn&cat=shushangdongtai'"
            target="_blank"
            :underline="false"
          >
            <i class="icon_more"></i>
          </el-link>
        </p>
        <p class="p_email no_data" v-if="productNews.length == 0">暂无产品动态</p>
        <ul class="info_box" v-else>
          <template v-for="(item, key) in productNews">
            <li class="info_list info_first" :key="key">
              <p @click="onDetail(item.id)">{{item.title}}</p>
              <span>{{item.publish_at | formatDate('MM/dd')}}</span>
            </li>
          </template>
        </ul>
      </div>
      <!-- 帮助中心 -->
      <div class="p_r_item p_r_dt">
        <p class="p_title warn">
          <span>
            <img :src="require('@/assets/images/profile/icon_bz.png')" alt />
            <span class="title1">帮助中心</span>
          </span>
          <el-link
            :href="zxLink+'/cms?type=service&dept=aiyouyi.cn&cat=yidongshangcheng'"
            target="_blank"
            :underline="false"
          >
            <i class="icon_more"></i>
          </el-link>
        </p>
        <p class="p_email no_data" v-if="helpNews.length == 0">暂无帮助信息</p>
        <ul class="info_box" v-else>
          <template v-for="(item, key) in helpNews">
            <li class="info_list" :key="key">
              <p @click="onDetail(item.id)">{{item.title}}</p>
              <span>{{item.publish_at | formatDate('MM/dd')}}</span>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import profileCont from "@/system/constant/profile";
import Clipboard from "clipboard";
import flowPath from "./flowPath";
export default {
  name: "profile",
  components: { flowPath },
  data() {
    return {
      profileData: "",
      toBeSoldOut: "",
      stayProcessedCount: "",
      staySendCount: "",
      stayAuthCount: "",
      pageLink:'',
      gzLink:'',
      qrCode: "",//客户工作台二维码
      wxQrcode:"",//小程序二维码
      gzQrcode:"",//公众号二维码
      isEmpowerWX:false,//微信小程序是否授权
      isEmpowerGZ:false,//微信公众号是否授权
      isReleaseWX:false,//微信小程序是否发布
      isReleaseGZ:false,//微信公众号是否发布
      zxLink: `${process.env.ZX_HELP}`, //链接
      productNews: [],
      helpNews: []
    };
  },
  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    }
  },
  created() {
    this._globalEvent.$on("refreshProfile", () => {
      this.init();
      this.getLink();
      this.getQrcode();
      this.getOverviewDetails();
      this.getOerviewRemind();
      this.getOverviewSelling();
      this.getProductNews();
      this.getHelpNews();
      this.getWXQrcode();
      this.getGZQrcode();
      this.isEmpower();
      this.getIsReleaseWX();
      this.getIsReleaseGZ();
    });
    this.$message.closeAll();
    this.init();
    this.getLink();
    this.getQrcode();
    this.getOverviewDetails();
    this.getOerviewRemind();
    this.getOverviewSelling();
    this.getProductNews();
    this.getHelpNews();
    this.getWXQrcode();
    this.getGZQrcode();
    this.isEmpower();
    this.getIsReleaseWX();
    this.getIsReleaseGZ();
  },
  methods: {
    ...mapMutations(["SETCURRENT"]),
    init() {
      this._apis.shop
        .getShopInfo({ id: this.cid })
        .then(response => {
          if (response.shopExpire == 2) {
            this.$message({
              showClose: true,
              message:
                "您的店铺有效期不足7天，为不影响您的正常使用，请及时联系客服续费。",
              type: "warning",
              duration: 0
            });
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    },

    getLink(){
      this.pageLink = process.env.NODE_ENV === 'dev' ? `${location.protocol}//${location.hostname}:9002` : location.origin + "/bh" //客户工作台地址
      this.gzLink = process.env.NODE_ENV === 'dev' ? `${location.protocol}//${location.hostname}:9001` : location.origin + "/cp/?cid=" + this.cid //公众号商城地址
    },

    //获取客户工作台二维码
    getQrcode() {
      this._apis.shop
        .getQrcode({
          url: this.pageLink,
          width: "80",
          height: "80"
        })
        .then(response => {
          this.qrCode = `data:image/png;base64,${response}`;
        })
        .catch(error => {
          console.error(error);
        });
    },

    //下载二维码
    downs(url,name) {
      var alink = document.createElement("a");
      alink.href = url; //图片地址
      alink.download = name; //图片名
      alink.click();
    },

    // 实时概况
    getOverviewDetails() {
      this._apis.overview
        .overviewDetails({})
        .then(response => {
          this.profileData = response;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    //刷新
    refresh() {
      this.getOerviewRemind();
      this.getOverviewSelling();
    },
    // 待办提醒
    getOerviewRemind() {
      this._apis.overview.overviewRemind({}).then(response => {
        this.stayProcessedCount = response.stayProcessedCount;
        this.staySendCount = response.staySendCount;
        this.stayAuthCount = response.stayAuthCount;
      });
    },
    // 待办售罄
    getOverviewSelling() {
      this._apis.overview.overviewSelling({}).then(response => {
        this.toBeSoldOut = response;
      });
    },
    //常用功能跳转
    linkTo(item) {
      if (item.text == "店铺促销") {
        this.$router.push({
          path: "/apply",
          query: { paths: "/application/promotion", applyId: 4 }
        });
        this.SETCURRENT(8);
      } else if (item.text == "特色玩法") {
        this.$router.push({
          path: "/apply",
          query: { paths: "/application/feature", applyId: 5 }
        });
        this.SETCURRENT(8);
      } else if (item.text == "互动营销") {
        this.$router.push({
          path: "/apply",
          query: { paths: "/application/interactmarket", applyId: 7 }
        });
        this.SETCURRENT(8);
      } else if (item.text == "用户营销") {
        this.$router.push({
          path: "/apply",
          query: { paths: "/application/customarket", applyId: 6 }
        });
        this.SETCURRENT(8);
      } else if (item.text == "多人拼团") {
        this.$router.push({
          path: "/apply",
          query: { paths: "/application/feature/group" }
        });
        this.SETCURRENT(8);
      } else if (item.text == "更多营销活动") {
        this.$router.push({
          path: "/apply",
          query: { paths: "/application/appIndex" }
        });
        this.SETCURRENT(8);
      } else if(item.text == '绑定微信公众号'){
        this.$router.push({
          path:'/apply',
          query:{paths:'/application/channelapp/publicnum',applyId:'3'
        }})
        this.SETCURRENT(8)
      } else if(item.text == '绑定微信小程序'){
        this.$router.push({
          path:'/apply',
          query:{paths:'/application/channelapp/smallapp',applyId:'3'
        }})
        this.SETCURRENT(8)
        } 
      else {
        this.$router.push({ path: item.url });
      }
    },

    // 复制商家工作台h5地址成功
    onCopy() {
      this.$message({
        message: "复制成功！",
        type: "success"
      });
    },

    // 复制商家工作台h5地址失败
    onError() {
      this.$message({
        message: "该浏览器不支持复制。",
        type: "warning"
      });
    },
    //获取产品动态
    getProductNews() {
      this._apis.profile
        .getProductNews()
        .then(response => {
          this.productNews = response.list;
        })
        .catch(error => {});
    },
    //获取帮助中心
    getHelpNews(){
      this._apis.profile
        .getHelpNews()
        .then(response => {
          this.helpNews = response.list;
        })
        .catch(error => {});
    },

    //点击资讯/公告详情
    onDetail(id) {
      window.open(`${this.zxLink}/cms/news/${id}.html`);
    },

    //判断是否授权
    isEmpower(){
      this._apis.profile
        .getwxBindStatus({id:this.cid}).then(response => {
          this.isEmpowerWX = response.bindWechatApplet ? false : true
          this.isEmpowerGZ = response.bindWechatAccount ? false : true
        })
        .catch(error => {
          console.error(error);
        });
    },

    //判断小程序是否发布
    getIsReleaseWX(){
      this._apis.profile
        .getSmallRelease({id:this.cid}).then(response => {
          this.isReleaseWX = response.status ? false :  true
        })
        .catch(error => {
          console.error(error);
        });
    },

    //判断公众号是否设置商城首页
    getIsReleaseGZ(){
      this._apis.shop
        .getHomePage({pageTag:0}).then(response => {
          this.isReleaseGZ = response ? false : true
        })
        .catch(error => {
          console.error(error);
        });
    },

    //获取小程序二维码
    getWXQrcode(){
      this._apis.profile
        .getSmallQRcode({id:this.cid}).then(response => {
          this.wxQrcode = `data:image/png;base64,${response}`;
        })
        .catch(error => {
          console.error(error);
        });
    },
    
    //获取公众号二维码
    getGZQrcode(){
      this._apis.shop
        .getQrcode({
          url: this.gzLink,
          width: "80",
          height: "80"
        })
        .then(response => {
          this.gzQrcode = `data:image/png;base64,${response}`;
        })
        .catch(error => {
          console.error(error);
        });
    },

  }
};
</script>
<style lang="scss" scoped>
.p_container {
  display: flex;
  width:100%;
  .title1{
    font-size:16px; 
    font-weight:500;
    color:rgba(22,22,23,1);
  }
  .p_l {
    flex: 1;
    .p_l_item {
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
    }
    .p_l_top {
      .p_p {
        clear: both;
        overflow: hidden;
        .p_p_l {
          width: 45%;
          float: left;
          border-right: 1px solid #f2f2f9ff;
          padding-left: 20px;
          div:nth-of-type(2) {
            font-size: 18px;
            color: #655effff;
            font-weight: bold;
          }
        }
        .p_p_r {
          width: 45%;
          float: left;
          padding-left: 75px;
          div:nth-of-type(2) {
            font-size: 18px;
            color:#161617;
            font-weight: bold;
          }
        }
        span {
          margin-top: 20px;
          width: 45%;
          height: 70px;
          display: inline-block;
          font-family: PingFangSC-Regular, PingFang SC;
          div:nth-of-type(1) {
            font-size: 12px;
            color: #92929B;
            height: 40px;
            line-height: 40px;
            font-weight: 400;
          }
        }
      }
    }
    .p_l_main {
      margin-top: 10px;
      display: flex;
      .dealt{
        width: 246px;
        .dealt_list{
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          p{
            padding:15px;
            span{
              display: block;
            }
            .name{
              font-size: 12px;
              color: #161617;
            }
            .num{
              font-size: 24px;
              color: #161617;
              line-height: 40px;
              height: 40px;
              display: block;
            }
          }
          .dealt_list_l{  
            p:nth-of-type(1){
              width: 94px;
              height: 110px;
              background:#FEEDE9;
              border-radius:8px;
            }
            p:nth-of-type(2){
              width:94px;
              height:78px;
              background:#E8FAF5;
              border-radius:8px;
              margin-top:10px;
            }
          }
          .dealt_list_r{
            p:nth-of-type(1){
              width: 94px;
              height: 78px;
              background:rgba(101,94,255,.1);
              border-radius:8px;
            }
            p:nth-of-type(2){
              width:94px;
              height:110px;
              background:#FEEDE9;
              border-radius:8px;
              margin-top: 10px;
            }
          }
        }
      }
      .helper{
        flex: 1;
        margin-left: 10px;
      }
    }
    .p_l_bottom {
      margin-top: 10px;
      display: flex;
      .p_l_bottom_l{
        flex: 1;
        .functions {
          display: flex;
          justify-content: space-between;
          .title3{
            font-size: 15px;
            color: #161617;
            font-weight:500;
            line-height: 45px;
            margin-top: 10px;
            padding-left:5px;
          }
          a{
            display: block;
            margin-bottom:10px;
            img {
              vertical-align: middle;
              width: 36px;
              height: 37px;
            }
          }
          span{
            font-size: 14px;
            color: #161617;
          }
        }
      }
      .p_l_bottom_r{
        flex: 1;
        margin-left: 10px;
        .main{
          display: flex;
          justify-content: space-between;
          div{
            flex: 1;
            text-align: center;
            .title3{
              font-size: 14px;
              color: #161617;
              font-weight:500;
              line-height: 70px;
            }
            .title4{
              font-size: 12px;
              color: #92929B;
            }
            .erweima{
              width: 76px;
              height: 76px;
            }
            .no_release{
              width: 61px;
              height:61px;
            }
            .opt{
              margin-top: 20px;
            }
          }
        }
      }
    }
  }

  .p_r {
    width: 260px;
    margin-left: 10px;
    .p_r_item {
      background-color: #fff;
      padding: 20px 16px;
      // width: 215px;
      color: #3d434a;
      border-radius: 5px;
    }
    //客服中心
    .p_r_kefu {
      display: flex;
      .p_r_kefu_l{
        width: 66px;
        .icon_kf{
          width: 46px;
          height: 35px;
        }
      }
      .p_email {
        font-size: 14px;
        color: #3d434aff;
        line-height: 20px;
        margin-top: 10px;
      }
    }
    //商家工作台
    .p_r_sjgzt {
      margin-top: 10px;
      display: flex;
      padding-left:5px;
      .p_r_sjgzt_r{
        margin-left: 5px;
        .gzt{
          margin-top: 10px;
        }
        .title2{
          font-size: 14px;
          color: #3D434A;
          line-height: 30px;
        }
        .operation{
          font-size: 12px;
          color: #655EFF;
          margin-top: 10px;
        }
      }
    }
    //产品动态
    .p_r_dt{
      margin-top: 10px;
      .p_email {
        font-size: 14px;
        color: #3d434aff;
        line-height: 20px;
        margin-top: 10px;
      }
    }
    //帮助中心
    .p_r_bz {
      margin-top: 10px;
      .p_r_list {
        p {
          margin-top: 20px;
          span {
            color: #fd4c2b;
            float: right;
          }
        }
      }
    }
    .icon_more {
      width: 18px;
      height: 15px;
      background: url("../../assets/images/profile/icon_08.png") no-repeat;
      display: inline-block;
    }
    .info_box {
      margin-top: 10px;
    }
    .info_list {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 20px;
      padding: 3px 0;
      font-size: 14px;
      color: #44434B;
      p {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        cursor: pointer;
        width: 165px;
      }
      &:hover {
        // color: #fd932b;
        color: #FD4C2B;
      }
    }
    .info_first:first-child{
        color:#FD4C2B;
    }
    .no_data {
      color: #92929b !important;
    }
  }
}

.p_title {
  font-size: 14px;
  font-weight: 500;
  color: #3d434aff;
  span {
    color: #92929bff;
    margin-left: 10px;
    font-size: 12px;
  }
}

.realTime_survey{
  display: flex;
  justify-content: space-between;
  font-family:PingFangSC-Medium,PingFang SC;
  .title{
    .title2{
      font-size:12px;
      font-weight:400;
      color:rgba(146,146,155,1);
    }
  }
  .look_info{
    font-size:12px;
    font-weight:400;
    color:rgba(101,94,255,1);
    cursor: pointer;
  }
}

.warn {
  display: flex;
  justify-content: space-between;
  span {
    font-size: 14px;
    font-weight: 500;
    color: #3d434a;
    margin-left: 0px;
    img {
      vertical-align: middle;
      margin-right: 5px;
      width: 22px;
    }
  }
  i {
    cursor: pointer;
  }
}
.ml15{
  margin-left:15px;
}
</style>


