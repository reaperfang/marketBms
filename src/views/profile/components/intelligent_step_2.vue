<template>
  <section class="intelligent_preview" v-loading="isLoading">
    <div class="template_list">
      <div class="list_null" v-if="isLoading">
        数据模板加载中。。。
      </div>
      <swiper v-else-if="listData.length > 0" class="preview_swiper swiper-no-swiping" ref="mySwiper" :options="swiperOptions">
        <template v-for="item in listData">
          <swiper-slide ref="mySwiperSlide" :key="item.id">

            <div class="view" :class="{'selected': item.id === selectTemplateId}">
              <span class="badge"></span>
              <img class="image" :src="item.previewPic" alt="图片丢失了">
              <p class="template_name"> {{item.name}} </p>

              <div class="preview">
                <p class="hint text">使用手机扫描下方二维码 <br> 预览完整模版</p>
                <img class="qr_code" :src="item.qrCode" alt="二维码"/>
                <div class="buttons">
                  <el-button type="primary" @click="selectedId(item.id)"> 选择该模板 </el-button>
                </div>
              </div>
            </div>

          </swiper-slide>
        </template>
      </swiper>
      <div class="swiper-button-prev" slot="button-prev" @click="prev"></div>
      <div class="swiper-button-next" slot="button-next" @click="next"></div>
    </div>

    <div class="bottom_buttons">
      <el-button @click="$emit('update-step', 1)"> 上一步</el-button>
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
        <el-button @click="isShowConfirmBox = false"> 我再想想 </el-button>
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


      <ul class="configure-text-list">
        <li class="configure-text" :class="{'show': configureProgress >= 10}">
          <p class="text-base">模板内的基础信息数据配置失败 </p>
          <i class="el-icon-error"></i>
          <i class="el-icon-success"></i>
        </li>
        <li class="configure-text" :class="{'show': configureProgress >= 20}">
          <p class="text-goods">模板内的商品及商品分类数据配置失败</p>
          <i class="el-icon-error"></i>
          <i class="el-icon-success"></i>
        </li>
        <li class="configure-text" :class="{'show': configureProgress >= 30}">
          <p class="text-page">模板内的微页面及店铺展示数据配置失败</p>
          <i class="el-icon-error"></i>
          <i class="el-icon-success"></i>
        </li>
        <li class="configure-text" :class="{'show': configureProgress >= 40}">
          <p class="text-shop">店铺数据配置失败</p>
          <i class="el-icon-error"></i>
          <i class="el-icon-success"></i>
        </li>
      </ul>

      <!--   有一项失败了就显示   -->
      <div slot="footer" v-show="isConfigureFail">
        <el-button type="primary" @click="againConfigure"> 再次加载</el-button>
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
      industryId: null, // 行业id, 用于请求行业模板
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
        listData: [],
        isLoading: false,
        useSwiper: true,  // 是否启用swiper
        selectTemplateId: null, // 当前选择的模板id
        isShowConfirmBox: false, // 是否显示确认dialog
        isShowConfigureBox: false, // 是否显示配置dialog
        isConfigureLoading: false, // 是否在配置中
        isConfigureFail: false, // 是否已经配置过 且配置失败了
        timerConfigure: null, // 定时任务，查询配置进度
        configureProgress: 0, // 查询配置进度 0 - 100?
      }
    },
    mounted() {
      console.log('industryId === null  ? %c' + this.industryId !== null, 'color:tomato');
      // this.settingSwiper();
      if(this.industryId !== null) this.fetchListData();

    },
    methods: {
      /** 加载模板数据 */
      async fetchListData() {
        try {
          this.isLoading = true;
          const params = {industryId: this.industryId};
          // const resultData = await this._apis.profile.getIntelligentPreViewTemplate(params)
          const resultData = [
            {
              name: '家具专区',
              previewPic: '',
              qrCodePic: '',
              id: 101,
            },
            {
              name: '美味零食美味零食美味零食美味零食',
              previewPic: '',
              qrCodePic: '',
              id: 102,
            },
            {
              name: '美味零食',
              previewPic: '',
              qrCodePic: '',
              id: 103,
            },
            {
              name: '美味零食',
              previewPic: '',
              qrCodePic: '',
              id: 104,
            },
            {
              name: '美味零食',
              previewPic: '',
              qrCodePic: '',
              id: 105,
            }
          ];
          const _this = this;
          setTimeout(function () {

            _this.listData = resultData;
            _this.isLoading = false;
            // _this.$refs.mySwiper.$swiper.update();

          }, 2000)

        } catch (err) {
          console.error('加载模板数据出错', err.message)
        } finally {
          console.log('执行完毕');
          // this.isLoading = false;
        }
      },

      /** 上一张模板 */
      prev() {
        this.$refs.mySwiper.$swiper.slidePrev();
      },
      /** 下一张模板 */
      next() {
        this.$refs.mySwiper.$swiper.slideNext();
      },

      /** 启用模板 对话框 */
      confirmEnable() {
        if (this.selectTemplateId === null) {
          this.$message.warning('请先选择一个模版');
          return;
        }
        if (this.isConfigureFail) return; // 加载失败了，只能点击 '再次加载'

        this.isShowConfirmBox = true;
      },

      /** 确认启用 */
      enableConfigure() {
        this.isShowConfigureBox = true;
        this.timer();
      },

      /** 查询配置进度 */
      timer() {
        const _this = this;
        this.timerConfigure = setInterval(function () {
          // this._apis.profile.intelligentConfigurationStatus()
          _this.configureProgress += 10;
          if (_this.configureProgress >= 40) {
            clearInterval(_this.timerConfigure);
            // _this.$emit('update-step', 3)
          }
        }, 1000);
      },

      /** 再次加载 */
      againConfigure() {

        // this._apis.profile.intelligentEnableTemplate()
      },

      /** 设置是否启用swiper */
      settingSwiper() {
        console.log('%c' + this.swiper.width, 'color: deepskyblue');
        if (this.swiper.width >= (256 * 5 + 100 * 4)) {
          this.useSwiper = false
        } else {
          this.useSwiper = true
        }
      },

      /** 展示二维码 */
      showPreview(item) {
        item.isShowCode = !item.isShowCode;
      },

      /** 展示二维码 */
      selectedId(id) {
        this.selectTemplateId = id;
      },

    },
    watch: {
      'industryId'(newValue, oldValue){
        if(newValue !== null) this.fetchListData();
      }
    }
  }
</script>

<style lang="scss" scoped>


  .intelligent_preview {
    padding: 0 20px;

    .template_list {
      position: relative;
      height: 446px;
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
      height: 446px;
      padding: 8px 0;
    }

    .swiper-slide {
      width: 225px;
      height: 418px;
      padding: 0 15px;
    }

    .swiper-button-prev:after, .swiper-button-next:after {
      opacity: 0;
      display: none;
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

    .view {
      position: relative;
      height: 100%;
      padding: 10px;
      background: #FFF;
      box-shadow: 0 2px 10px 0 rgba(68, 67, 75, 0.2);
      box-sizing: border-box;
      text-align: center;

      &:hover {
        .preview {
          display: block;
        }
      }

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
      }

      .image {
        width: 100%;
        margin-bottom: 13px;
        vertical-align: top;
        text-align: center;
      }

      .template_name {
        font-size: 14px;
        color: $contentColor;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 20px;
      }

      .preview {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
      }

      .hint {
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: 500;
        color: #FFF;
        line-height: 20px;
      }

      .qr_code {
        width: 120px;
        height: 130px;
        margin-bottom: 40px;
        padding: 10px;
        background-color: #fff;
      }

      .buttons {
        display: flex;
        justify-content: center;

        .el-button{
          position: relative;
          z-index: 6;
          font-size: 14px;
          color: #FFF;
        }
      }
    }

    .confirm_enable_dialog {

      .el-dialog__body {
        padding: 0;
      }

      .el-dialog__close{
        font-weight: bold;
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

      .el-message-box__btns {
        .el-button--small {
          font-size: 14px;
        }
      }


    }

    /deep/ .dialog_configure {

      .el-dialog__body {
        padding: 25px 25px 30px 40px;
      }

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

      .configure-text {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        opacity: 0.1;
        transition: opacity 1s;
        font-size: 14px;
        font-weight: 400;
        color: #44434B;
        line-height: 20px;


        &.show {
          opacity: 1;
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

</style>
