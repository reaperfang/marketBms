<template>
  <section class="intelligent_preview" v-loading="isLoading">
    <div class="template_list" ref="templateList">
      <div class="list_null" v-if="listData.length <= 0">
        暂无数据...
      </div>
      <template v-else>
        <template v-if="!useSwiper">
          <ul class="template_ul">
            <li class="template_li" v-for="item in listData" :key="item.id">
              <p class="template_name"> {{item.name}} </p>
              <div class="view" :class="{'selected': item.id === selectTemplateId}">
                <span class="badge"></span>
                <div class="view_scroll">
                  <img class="image" :src="item.pictureUrl" alt="图片丢失了">
                  <img class="gray_bottom" src="../../../assets/images/profile/intelligent_preview_bottom.png" alt="~~">
                </div>

                <transition name="el-fade-in">
                  <div class="view_preview" v-show="item.isShowCode">
                    <p class="hint text">使用手机扫描下方二维码 <br> 预览完整模版</p>
                    <div class="qr_code" v-loading="item.isLoadingCode">
                      <img class="qr_code_pic" v-show="item.qrCodePic !== ''" :src="'data:image/png;base64,'+item.qrCodePic" alt="二维码"/>
                    </div>
                  </div>
                </transition>

                <div class="view_buttons">
                <span class="view_button" :class="{'selected': item.isShowCode}"
                      @click="showItemPreview(item)">
                  <template v-if="item.isShowCode"> 取消预览 </template>
                  <template v-else>手机预览</template>
                </span>
                  <span class="view_button" :class="{'selected': item.id === selectTemplateId}"
                        @click="selectedId(item.id, item.cid)">
                  <template v-if="item.id === selectTemplateId"> 取消选择 </template>
                  <template v-else>选  择</template>
                </span>
                </div>
              </div>
            </li>
          </ul>
        </template>
        <template v-else>
          <swiper v-if="listData.length > 0" class="preview_swiper swiper-no-swiping" ref="mySwiper"
                  :options="swiperOptions">
            <template v-for="item in listData">
              <swiper-slide ref="mySwiperSlide" :key="item.id">

                <p class="template_name"> {{item.name}} </p>
                <div class="view" :class="{'selected': item.id === selectTemplateId}">
                  <span class="badge"></span>
                  <div class="view_scroll">
                    <img class="image" :src="item.pictureUrl" alt="图片丢失了">
                    <img class="gray_bottom" src="../../../assets/images/profile/intelligent_preview_bottom.png"
                         alt="~~">
                  </div>

                  <transition name="el-fade-in">
                    <div class="view_preview" v-show="item.isShowCode">
                      <p class="hint text">使用手机扫描下方二维码 <br> 预览完整模版</p>
                      <div class="qr_code" v-loading="item.isLoadingCode">
                        <img class="qr_code_pic" v-show="item.qrCodePic !== ''" :src="'data:image/png;base64,'+item.qrCodePic" alt="二维码"/>
                      </div>
                    </div>
                  </transition>

                  <div class="view_buttons">
                    <span class="view_button" :class="{'selected': item.isShowCode}"
                      @click="showItemPreview(item)">
                      <template v-if="item.isShowCode"> 取消预览 </template>
                      <template v-else>手机预览</template>
                    </span>
                    <span class="view_button" :class="{'selected': item.id === selectTemplateId}"
                          @click="selectedId(item.id, item.cid)">
                      <template v-if="item.id === selectTemplateId"> 取消选择 </template>
                      <template v-else>选  择</template>
                    </span>
                  </div>
                </div>

              </swiper-slide>
            </template>
          </swiper>
          <div class="swiper-button-prev" :class="{'myswiper-button-disabled': swiperIsBegining}" slot="button-prev" @click="prev"></div>
          <div class="swiper-button-next" :class="{'myswiper-button-disabled': swiperIsEnd}" ref="swiper-button-next" slot="button-next" @click="next"></div>
        </template>
      </template>
    </div>

    <div class="bottom_buttons">
      <el-button @click="prevStep" :loading="prevStepLoading"> 上一步</el-button>
      <el-button type="primary" @click="confirmEnable"> 启用模板</el-button>
    </div>

    <p class="hint">手机扫码可预览整个店铺购物流程，此流程只作演示操作，对于支付的店铺内商品不做任何发货和售后处理，感谢您的理解！</p>

    <!--  确认是否启用配置  -->
    <el-dialog
      class="confirm_enable_dialog"
      :visible.sync="isShowConfirmBox"
      width="420px"
    >
      <div class="confirm_enable_dialog_inner">
        <i class="el-icon-warning"></i>
        <h2 class="confirm_title">确认启用该行业模板吗？</h2>
        <p class="text">行业模板一经启用、无法重置修改，模板内的<br>预设数据将自动为您配置为店铺内最新设置！</p>
      </div>

      <div slot="footer">
        <el-button @click="isShowConfirmBox = false"> 我再想想</el-button>
        <el-button type="primary" @click="enableConfigure">确认，启用模板</el-button>
      </div>

    </el-dialog>

    <!--  配置结果对话框  -->
    <el-dialog
      class="dialog_configure"
      :visible.sync="isShowConfigureBox"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="460px"
      center
    >
      <h3 class="configure-title">店铺数据配置中，请您耐心等待...</h3>

      <ul class="configure-text-list" style="height: 164px;">
        <template v-for="(item, index) in configureTextArray">
            <li class="configure-text show">
              <p class="text-base">模板内的{{item.text}}数据配置{{configureTextItemStatusType[item.status]}}</p>
              <i class="el-icon-success" v-if="item.status === 1"></i>
              <i class="el-icon-error" v-if="item.status === 2"></i>
              <i class="el-icon-success" v-if="item.status === 3"></i>
            </li>
        </template>
      </ul>

      <!--   有一项失败了就显示   -->
      <div slot="footer">
        <el-button v-show="isConfigureFail" type="primary" @click="againConfigure" style="font-size: 14px;"> 再次加载</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
  import 'swiper/swiper-bundle.css'

  export default {
    name: "intelligent_preview",
    components: {Swiper, SwiperSlide},
    props: {
      stepStatus: 0,      // 当前步骤的状态
      stepCurrent: 0,     // 当前步骤的状态
      industryId: null,   // 行业id, 用于请求行业模板
      templateId: null,   //模板id, 用于回显所选店铺模板
      templateCid: null,   //模板id, 用于回显所选店铺模板
      stepId: null,
      configureFail: false,
    },
    data() {
      return {
        swiperOptions: {
          slidesPerView: 'auto',
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          observer: true
        },
        swiperIsBegining: true, // 是否是第一张
        swiperIsEnd: false, // 是否是最后一张轮播
        listData: [],
        isLoading: false,
        prevStepLoading: false, // 上一步loading
        useSwiper: true,  // 是否启用swiper
        selectTemplateId: null, // 当前选择的模板id
        tempCid: null,
        isShowConfirmBox: false, // 是否显示确认dialog
        isShowConfigureBox: false, // 是否显示配置dialog
        isConfigureLoading: false, // 是否在配置中
        isConfigureFail: false, // 是否已经配置过 且配置失败了
        timerConfigure: null, // 定时任务，查询配置进度
        configureProgress: 0, // 查询配置进度 0 - 5?
        configureTextArray: [], // 配置进度 文字以及成功状态
        configureTextItemDataType: ["","运费模板", "商品分类", "商品", "创意设计", "微信公众号底部"],
        configureTextItemStatusType: ["处理中", "成功", "失败", "成功"]
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.settingSwiper();
        if (this.industryId !== null) this.fetchListData();
        if (this.templateId) this.selectTemplateId = this.templateId;
        if (this.templateCid) this.tempCid = this.templateCid;
        if (this.configureFail) {
          this.isConfigureFail = true;
          this.isShowConfigureBox = true;
          this.configureTextArray = [];
          this.getConfigureStatus();
        }
      });
    },
    methods: {
      /** 加载模板数据 */
      async fetchListData() {
        try {
          this.isLoading = true;
          const params = {industryId: this.industryId};
          const resultData = await this._apis.profile.getIntelligentPreViewTemplate(params);
          this.listData = resultData.map(item => {
            return {
              cid: item.cid,
              id: item.id,
              tenantInfoId: item.tenantInfoId,
              isLoadingCode: false,
              isShowCode: false,
              name: item.name,
              pictureUrl: item.pictureUrl,
              qrCodePic: ''
            };
          });
          let findRes = this.listData.find((item) => item.id == this.selectTemplateId);
          if (!findRes) this.selectTemplateId = null;
        } catch (err) {
          console.error('加载模板数据出错', err)
        } finally {
          this.isLoading = false;
        }
      },

      /** 启用模板 对话框 */
      confirmEnable() {
        if (this.isConfigureFail) return; // 加载失败了，只能点击 '再次加载'
        if (this.selectTemplateId === null) {
          this.$message.error('请先选择一个模版');
          return;
        }

        // 通知父组件 更新所选店铺id
        this.$emit("update-template-id", this.selectTemplateId);
        this.isShowConfirmBox = true;
      },

      /** 4获取配置状态 */
      async getConfigureStatus(callback) {
        try {
          let res = await this._apis.profile.intelligentConfigurationStatus({});
          if (res && res.length > 0) {
            res.forEach(item => {
              const hasItem = this.configureTextArray.find(cItem => cItem.id === item.id);
              if (item.status !== 0 && !hasItem) {
                this.configureTextArray.push({
                  id: item.id,
                  text: this.configureTextItemDataType[item.dataType],
                  status: item.status
                });
              }
            })
          }
          /* 上面的2拿到数据之后， 做一些动画处理 */
          callback && callback();
        } catch(err) {
          this.$message.error(err || "网络错误，请稍后再试");
          console.error("查询配置进度err:" + err);
          clearInterval(this.timerConfigure);
        }
      },

      /** 5查询配置进度 */
      timer() {
        const _this = this;
        this.configureTextArray = [];
        clearInterval(this.timerConfigure);
        this.timerConfigure = setInterval(function () {
          _this.getConfigureStatus();
        }, 1000);
      },

      /** 1确认启用 */
      async enableConfigure() {
        if (this.isConfigureFail) return;
        try {
          /* 1先更新步骤， */
          let params = {chooseTemplateId: this.selectTemplateId, changeStep: 3, status: 0};
          let res = await this._apis.profile.intelligentUpdateStep(params);
          /* 2 再调用 启用模板接口 */
          this.isShowConfigureBox = true; // 显示配置窗口
          this.enableConfigureStatus();

        } catch (e) {
          this.$message.error(e || "网络错误，请稍后再试")

        } finally {
          this.isShowConfirmBox = false;
        }

      },

      /** 2 调用 启用模板接口： 抽出来了，启用和再次加载都用到了！ */
      async enableConfigureStatus() {
        try{
          const _this = this;
          this.timer();
          let result = await this._apis.profile.intelligentEnableTemplate({tempCid: this.tempCid});
          clearInterval(this.timerConfigure);

          setTimeout(() => {
            this.getConfigureStatus(function () {
              // console.log(_this.configureTextArray.length);
              /*  0 失败 1 成功  */
              if(result === 0) {
                let time = 750 * _this.configureTextArray.length || 1000;
                setTimeout(() => { _this.isConfigureFail = true; }, time)
              }else if(result === 1){
                /* 通知父组件 更新到下一步的视图, 不用再调用更新步骤的接口 */
                setTimeout(() => { _this.$emit('update-step', 3) }, 750*5)
              }
            });
          }, 900)

        }catch (e) {
          this.$message.error(e || "网络错误~");
          clearInterval(this.timerConfigure)
        }
      },

      /** 3再次加载 */
      async againConfigure() {
        this.configureTextArray = [];
        this.isConfigureFail = false;
        this.enableConfigureStatus();
      },

      /** 上一张模板 */
      prev() {
        this.$refs.mySwiper.$swiper.slidePrev();
        if(this.$refs.mySwiper.$swiper.isBeginning) {
          this.swiperIsEnd = false;
          this.swiperIsBegining = true;
        }else {
          this.swiperIsBegining = false;
        }
      },
      /** 下一张模板 */
      next() {
        this.$refs.mySwiper.$swiper.slideNext();
        if(this.$refs.mySwiper.$swiper.isEnd) {
          this.swiperIsEnd = true;
          this.swiperIsBegining = false;
        }else {
          this.swiperIsEnd = false;
        }
      },

      /** 设置是否启用swiper */
      settingSwiper() {
        if (this.$refs.templateList.clientWidth >= (255 * 5)) this.useSwiper = false;
        else this.useSwiper = true
      },

      /** 选择模板 */
      selectedId(id, cid) {
        if (this.selectTemplateId === id) {
          this.selectTemplateId = null;
          this.tempCid = null;
        } else {
          this.selectTemplateId = id;
          this.tempCid = cid;
        }
      },

      /** 上一步 */
      async prevStep() {
        if(this.isConfigureFail) return;
        try {
          this.prevStepLoading = true;
          const params = {changeStep: 1, status: 1};
          const result = await this._apis.profile.intelligentUpdateStep(params);
          this.$emit('update-step', 1)
        }
        catch (e) {
          this.$message.error(e || "网络错误，请稍后再试")
        }finally {
          this.prevStepLoading = false;
        }
      },

      /** 展示店铺的小程序二维码 */
      async showItemPreview(item) {
        item.isShowCode = !item.isShowCode;
        if(item.qrCodePic !== '') return; // 已经有二维码地址了

        try{
          item.isLoadingCode = true;
          const qrCodePic = await this._apis.shop.getMiniAppQrcode({cid: item.cid, id: item.cid, tenantInfoId: item.tenantInfoId});
          if(qrCodePic) item.qrCodePic = qrCodePic;
        }
        catch (e) {
          this.$message.error(e || "网络错误，请稍后再试")
        }
        finally {
          item.isLoadingCode = false;
        }
      }

    },
    watch: {
      'industryId'(newValue, oldValue) {
        if (newValue !== null) this.fetchListData();
      }
    },
    beforeDestroy() {
      // 用户返回或者离开
      clearInterval(this.timerConfigure);
    }
  }
</script>

<style lang="scss" scoped>

  .intelligent_preview {
    padding: 0 20px;

    .template_list {
      position: relative;
      height: 465px;
      width: 100%;
      padding: 0 10px;
      margin-bottom: 30px;
    }

    .list_null {
      height: 100%;
      line-height: 446px;
      text-align: center;
    }

    .preview_swiper {
      height: 465px;
      padding: 0 0 8px 0;
    }

    .template_ul {
      display: flex;
      justify-content: center;
    }

    .swiper-slide {
      width: 225px;
      /*height: 418px;*/
      padding: 0 15px;
    }

    .template_li {
      width: 225px;
      /*height: 418px;*/
      margin: 0 15px;
    }

    .swiper-button-prev:after, .swiper-button-next:after {
      opacity: 0;
      display: none;
    }
    .swiper-button-prev.myswiper-button-disabled, .swiper-button-next.myswiper-button-disabled {
      cursor: auto;
      pointer-events: none;
      opacity: 0;
    }

    .swiper-button-prev {
      left: 0;
      width: 48px;
      height: 48px;
      background-image: url("../../../assets/images/profile/intelligent_arrow_left.png");
      background-size: cover;

      &:hover {
        background-image: url("../../../assets/images/profile/intelligent_arrow_left_hover.png");
      }
    }

    .swiper-button-next {
      right: 0;
      width: 48px;
      height: 48px;
      background-image: url("../../../assets/images/profile/intelligent_arrow_right.png");
      background-size: cover;

      &:hover {
        background-image: url("../../../assets/images/profile/intelligent_arrow_right_hover.png");
      }
    }

    .template_name {
      height: 20px;
      font-size: 14px;
      color: $contentColor;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 14px;
    }

    /deep/ .view {
      position: relative;
      height: 408px;
      padding: 8px 2px 0 8px;
      background: #FFF;
      box-shadow: 0 2px 10px 0 rgba(68, 67, 75, 0.2);
      box-sizing: border-box;
      text-align: center;
      border: 2px solid #fff;
      transition: border 0.5s;

      &.selected {
        border: 2px solid $globalMainColor;

        .badge {
          opacity: 1;
        }
      }

      .badge {
        display: block;
        position: absolute;
        top: -2px;
        right: -3px;
        width: 58px;
        height: 57px;
        background-image: url("../../../assets/images/profile/intelligent_template_selected.png");
        background-size: cover;
        opacity: 0;
        z-index: 7;
        transition: opacity 0.5s;
      }

      .view_scroll {
        position: relative;
        height: 340px;
        padding-right: 3px;
        overflow-y: scroll;
        overflow-x: hidden;
        /*background-color: rgba(125, 169, 255, 0.1);*/
        &::-webkit-scrollbar {
          width: 4px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #D0D6E4;
          background-clip: padding-box;
          min-height: 28px;
          border-radius: 7px;
        }

        .image {
          width: 100%;
          margin-bottom: 13px;
          vertical-align: top;
          text-align: center;
        }

        .gray_bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 21px;
        }

      }

      .view_preview {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 56px;
        right: 0;
        width: 100%;
        /*height: 100%;*/
        /*border-bottom: 58px solid #fff;*/
        background-color: rgba(0, 0, 0, .5);
        z-index: 5;

        .qr_code {
          display: inline-block;
          width: 140px;
          height: 140px;
          padding: 10px;
          background-color: #fff;
        }

        .qr_code_pic {
          width: 100%;
          vertical-align: center;
        }

        .hint {
          margin-top: 68px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
          color: #FFF;
          line-height: 20px;
        }
      }

      .view_buttons {
        display: flex;
        justify-content: center;
        position: relative;
        z-index: 6;
        padding-top: 15px;
        background-color: #FFF;

        .view_button {
          width: 95px;
          border-radius: 14px;
          border: 1px solid #D0D6E4;
          font-size: 14px;
          color: $contentColor;
          line-height: 26px;
          box-sizing: border-box;
          cursor: pointer;

          & + .view_button {
            margin-left: 15px;
          }

          &.selected {
            color: $globalMainColor;
            border-color: $globalMainColor;
          }

          &:hover {
            color: $globalMainColor;
            border-color: #d1cfff;
            background-color: #f0efff;
          }
        }
      }


    }

    /deep/ .confirm_enable_dialog {

      .el-dialog__body {
        padding: 0;
      }

      .el-dialog__close {
        font-weight: bold;
      }

      .el-dialog__footer {
        padding: 10px 40px 20px;
      }

      .confirm_enable_dialog_inner {
        position: relative;
        padding: 20px 40px 20px 86px;
      }

      .el-icon-warning {
        font-size: 32px;
        color: $warningColor;
        position: absolute;
        left: 40px;
        top: 13px;
      }

      .confirm_title {
        font-size: 16px;
        font-weight: 500;
        color: #44434B;
        line-height: 22px;
        margin-bottom: 10px;
      }

      .text {
        font-size: 12px;
        color: $contentColor;
        line-height: 20px;
      }

      .el-button--small {
        font-size: 14px;
        /*padding: 8px 11px;*/
      }


    }

    /deep/ .dialog_configure {

      .el-dialog__body {
        padding: 0 25px 30px 40px;
      }

      /*.el-dialog__footer {
        height: 64px;
      }*/

      .configure-title {
        margin-bottom: 24px;
        font-size: 16px;
        font-weight: bold;
        color: $titleColor;
        line-height: 22px;
      }

      .el-icon-error {
        font-size: 18px;
        color: $errorColor;
      }

      .el-icon-success {
        font-size: 18px;
        color: $successBorderColor;
      }

      .el-icon-warning {
        font-size: 18px;
        color: $warningBorderColor;
      }

      .configure-text {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        font-size: 14px;
        font-weight: 400;
        color: #44434B;
        line-height: 20px;
        transform: translateY(20px);
        opacity: 0;

        &.show {
          animation: upShow 0.75s;
          animation-fill-mode: forwards;
        }

        &.show:nth-of-type(2) {
          animation-delay: 0.75s;
        }

        &.show:nth-of-type(3) {
          animation-delay: 0.75*2s;
        }

        &.show:nth-of-type(4) {
          animation-delay: 0.75*3s;
        }

        &.show:nth-of-type(5) {
          animation-delay: 0.75*4s;
        }
      }
    }

    .hint {
      margin-top: 10px;
      margin-bottom: 30px;
      font-size: 14px;
      font-weight: 400;
      color: $grayColor;
      line-height: 20px;
      text-align: center;
    }
  }

  @keyframes upShow {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
