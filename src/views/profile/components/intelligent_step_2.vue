<template>
  <section class="intelligent_preview" v-loading="isLoading">
    <div class="swiper_null" v-if="isLoading">
      数据模板加载中。。。
    </div>
    <swiper v-else class="preview_swiper swiper-no-swiping" ref="mySwiper" :options="swiperOptions">
      <template v-for="item in listData">
        <swiper-slide ref="mySwiperSlide" :class="{'cur': item.id === selectTemplateId}" :key="item.id">
          <p class="template_name"> {{item.name}} </p>
          <div class="view">
            <img class="image" :src="item.previewPic" alt="图片丢失了">
            <div class="preview" v-show="item.isShowCode">
              <p class="hint text">使用手机扫描下方二维码 <br> 预览完整模版</p>
              <img class="qr_code" :src="item.qrCode" alt="二维码"/>
              <p class="hint warning">手机扫码可预览整个店铺购物流程，此流程只作演示操作，对于支付的店铺内商品不做任何发货和售后处理，感谢您的理解！</p>
            </div>
          </div>
          <div class="buttons">
            <el-button @click="showPreview(item)" v-show="!item.isShowCode"> 手机预览</el-button>
            <el-button @click="showPreview(item)" v-show="item.isShowCode"> 取消预览</el-button>
            <el-button type="primary" @click="selectedId(item.id)"> 选择</el-button>
          </div>
        </swiper-slide>
      </template>

      <div class="swiper-button-prev" slot="button-prev" @click="prev"></div>
      <div class="swiper-button-next" slot="button-next" @click="next"></div>
    </swiper>

    <div class="bottom_buttons">
      <el-button @click="$emit('update-step', 1)"> 上一步</el-button>
      <el-button type="primary" @click="confirmEnable"> 启用模板</el-button>
    </div>

    <!--  对话框  -->
    <el-dialog
      :visible.sync="isShowConfigureBox"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      center
    >
      <h3 class="configure-title">店铺数据配置中，请您耐心等待...</h3>


      <ul class="configure-text-list">
        <li class="configure-text">
          <p class="text-base" :class="{'show': configureProgress >= 10}">模板内的基础信息数据配置失败 </p>
          <i class="el-icon-error"></i>
        </li>
        <li>
          <p class="configure-text text-goods" :class="{'show': configureProgress >= 20}">模板内的商品及商品分类数据配置失败</p>
          <i class="el-icon-error"></i>
        </li>
        <li>
          <p class="configure-text text-page" :class="{'show': configureProgress >= 30}">模板内的微页面及店铺展示数据配置失败</p>
          <i class="el-icon-error"></i>
        </li>
        <li>
          <p class="configure-text text-shop" :class="{'show': configureProgress >= 40}">店铺数据配置失败</p>
          <i class="el-icon-error"></i>
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
          spaceBetween: 100,
          slidesPerView: 'auto',
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
        listData: [],
        isLoading: false,
        useSwiper: true,  // 是否启用swiper
        selectTemplateId: null, // 当前选择的模板id
        isShowConfigureBox: false, // 是否显示配置dialog
        isConfigureLoading: false, // 是否在配置中
        isConfigureFail: false, // 是否已经配置过 且配置失败了
        timerConfigure: null, // 定时任务，查询配置进度
        configureProgress: 0, // 查询配置进度 0 - 100?
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.$swiper
      }
    },
    mounted() {
      console.log('%c industryId === null  ? ' + this.industryId !== null, 'color:tomato');
      this.settingSwiper();
      if(this.industryId !== null) this.fetchListData();

    },
    methods: {
      /** 加载模板数据 */
      async fetchListData() {
        try {
          this.isLoading = true;
          const params = {industryId: this.industryId};
          console.log(params.toString());
          // const resultData = await this._apis.profile.getIntelligentPreViewTemplate(params)
          const resultData = [
            {
              name: '家具专区',
              previewPic: '',
              qrCodePic: '',
              id: 101,
            },
            {
              name: '美味零食',
              previewPic: '',
              qrCodePic: '',
              id: 102,
            }
          ];
          const _this = this;
          setTimeout(function () {

            _this.listData = resultData.map(item => {
              return Object.assign({isShowCode: false}, item)
            });
            console.log(_this.listData);
            _this.isLoading = false;

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
        this.swiper.slidePrev();
      },
      /** 下一张模板 */
      next() {
        this.swiper.slideNext();
      },

      /** 确认启用模板 对话框 */
      confirmEnable() {
        if (this.selectTemplateId === null) {
          this.$message.warning('请先选择一个模版');
          return;
        }
        if (this.isConfigureFail) return; // 加载失败了，只能点击 '再次加载'
        this.confirm({
          title: "提示",
          icon: true,
          text: "<p style='font-size:14px;color:#ff4400;'>行业模板一经启用、无法重置修改，模板内的预设数据将自动为您配置为店铺内最新设置!</p><p>确认启用该行业模板吗？</p>",
          customClass: 'enable-confirm',
          confirmText: "确认，启用模板",
          cancelText: "我再想想"
        }).then(() => {

          // this._apis.profile.intelligentEnableTemplate(data).then(()=> {})
          this.isShowConfigureBox = true;
          this.timer();
        }).catch(() => {
        });
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

<style lang="scss">
  .preview_swiper, .swiper_null {
    height: 454px;
    width: 100%;
  }

  .intelligent_preview {
    .swiper-slide {
      width: 256px;
      background-color: skyblue;
      position: relative;

      &.cur {
        background-color: yellow;
      }
    }

    .template_name {
      font-size: 14px;
      text-align: center;
    }

    .view {
      position: relative;
      width: 100%;

      .image {
        width: 100%;
      }

      .preview {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
      }

      .qr_code {
        width: 120px;
        height: 120px;
      }

      .hint {
        color: #fff;

        &.warning {
          color: yellow;
        }
      }
    }

    .buttons {
      display: flex;
      position: relative;
      z-index: 6;

      .el-button {
        flex: 1;
        margin-left: 0;
      }
    }

    .configure-text {
      line-height: 1.5em;
      opacity: 0.5;
      transition: opacity 1s;

      &.show {
        opacity: 1;

      }
    }
  }

  .enable-confirm .el-message-box__btns {
    .el-button--small {
      font-size: 14px;
    }

    .el-button--primary {
      order: 3;
    }
  }
</style>
