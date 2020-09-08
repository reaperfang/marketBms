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
                    <img class="qr_code" :src="item.qrCodePic" alt="二维码"/>
                  </div>
                </transition>

                <div class="view_buttons">
                <span class="view_button" :class="{'selected': item.isShowCode}"
                      @click="item.isShowCode = !item.isShowCode">
                  <template v-if="item.isShowCode"> 取消预览 </template>
                  <template v-else>手机预览</template>
                </span>
                  <span class="view_button" :class="{'selected': item.id === selectTemplateId}"
                        @click="selectedId(item.id)">
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
                    <img class="image" :src="item.previewPic" alt="图片丢失了">
                    <img class="gray_bottom" src="../../../assets/images/profile/intelligent_preview_bottom.png"
                         alt="~~">
                  </div>

                  <transition name="el-fade-in">
                    <div class="view_preview" v-show="item.isShowCode">
                      <p class="hint text">使用手机扫描下方二维码 <br> 预览完整模版</p>
                      <img class="qr_code" :src="item.qrCode" alt="二维码"/>
                    </div>
                  </transition>

                  <div class="view_buttons">
                    <span class="view_button" :class="{'selected': item.isShowCode}"
                      @click="item.isShowCode = !item.isShowCode">
                      <template v-if="item.isShowCode"> 取消预览 </template>
                      <template v-else>手机预览</template>
                    </span>
                    <span class="view_button" :class="{'selected': item.id === selectTemplateId}"
                          @click="selectedId(item.id)">
                      <template v-if="item.id === selectTemplateId"> 取消选择 </template>
                      <template v-else>选  择</template>
                    </span>
                  </div>
                </div>

              </swiper-slide>
            </template>
          </swiper>
          <div class="swiper-button-prev" slot="button-prev" @click="prev"></div>
          <div class="swiper-button-next" slot="button-next" @click="next"></div>
        </template>
      </template>
    </div>

    <div class="bottom_buttons">
      <el-button @click="prevStep"> 上一步</el-button>
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
              <p class="text-base">{{item.text}}数据配置{{item.status === 1 ? "成功" : "失败"}}</p>
              <i class="el-icon-success" v-if="item.status === 1"></i>
              <i class="el-icon-error" v-else></i>
            </li>
        </template>
        <!--<li class="configure-text" :class="{'show': configureTextArray.length >= 1}">
          <p class="text-goods">模版内的{{configureTextArray[0].text}}数据配置{{configureTextArray[0].status === 1 ? "成功" : "失败"}}</p>
          <i class="el-icon-success" v-if="item.status === 1"></i>
          <i class="el-icon-error" v-else></i>
        </li>
        <li class="configure-text" :class="{'show': configureTextArray.length >= 2}">
          <p class="text-goods">模版内的{{configureTextArray[1].text}}数据配置{{configureTextArray[1].status === 1 ? "成功" : "失败"}}</p>
          <i class="el-icon-success" v-if="configureTextArray[1].status === 1"></i>
          <i class="el-icon-error" v-else></i>
        </li>
        <li class="configure-text" :class="{'show': configureTextArray.length >= 3}">
          <p class="text-goods">模版内的{{configureTextArray[2].text}}数据配置{{configureTextArray[2].status === 1 ? "成功" : "失败"}}</p>
          <i class="el-icon-success" v-if="configureTextArray[2].status === 1"></i>
          <i class="el-icon-error" v-else></i>
        </li>
        <li class="configure-text" :class="{'show': configureTextArray.length >= 4}">
          <p class="text-goods">模版内的{{configureTextArray[3].text}}数据配置{{configureTextArray[3].status === 1 ? "成功" : "失败"}}</p>
          <i class="el-icon-success" v-if="configureTextArray[3].status === 1"></i>
          <i class="el-icon-error" v-else></i>
        </li>
        <li class="configure-text" :class="{'show': configureTextArray.length === 5}">
          <p class="text-goods">模版内的{{configureTextArray[4].text}}数据配置{{configureTextArray[4].status === 1 ? "成功" : "失败"}}</p>
          <i class="el-icon-success" v-if="configureTextArray[4].status === 1"></i>
          <i class="el-icon-error" v-else></i>
        </li>-->
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
      currentStep: null,
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
        configureProgress: 0, // 查询配置进度 0 - 5?
        configureTextArray: [], // 配置进度 文字以及成功状态
        dataTypeText: ["","运费模板", "商品", "商品分类", "创意设计", "微信公众号底部数据"],
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.settingSwiper()
      })
      if (this.industryId !== null) this.fetchListData();

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
              id: item.id,
              isShowCode: false,
              name: item.name,
              pictureUrl: item.pictureUrl,
              qrCodePic: ''
            };
          });
        } catch (err) {
          console.error('加载模板数据出错', err.message)
        } finally {
          console.log('加载模板: 执行完毕');
          this.isLoading = false;
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
          this.$message.error('请先选择一个模版');
          return;
        }
        if (this.isConfigureFail) return; // 加载失败了，只能点击 '再次加载'

        // 通知父组件 更新所选店铺id
        this.$emit("update-template-id", this.selectTemplateId);
        this.isShowConfirmBox = true;
      },

      /** 确认启用 */
      async enableConfigure() {
        try {
          const result = await this._apis.profile.intelligentUpdateStep({chooseTemplateId: this.selectTemplateId});

          this.isShowConfigureBox = true;
          this.timer();
        }catch (e) {
          this.$message.error("网络错误，请稍后再试")
        }

      },

      /** 查询配置进度 */
      timer() {
        const _this = this;
        this.timerConfigure = setInterval(function () {

          _this._apis.profile.intelligentConfigurationStatus({})
            .then(res => {
              if (res && res.length > 0) {
                _this.configureProgress = 0;
                res.forEach(item => {
                  const hasItem = _this.configureTextArray.find(cItem => cItem.id === item.id);

                  if (item.status !== 0 && !hasItem) {
                    let t_temp = {};
                    t_temp.text = _this.dataTypeText[item.dataType];
                    t_temp.status = item.status;
                    if (item.status === 1) {
                      _this.configureProgress += 1;
                    }
                    _this.configureTextArray.push(t_temp)
                  }
                })
              }
              if (_this.configureTextArray.length >= 5) {
                clearInterval(_this.timerConfigure);
                _this.configureProgress >= 5 && (_this.isConfigureFail = true);
                // 通知父组件 更新到下一步的视图
                // _this.$emit('update-step', 3)
              }

            }).catch(err => {
            console.error("查询配置进度err:" + err);

            clearInterval(_this.timerConfigure);
          });
          // ================================
          // _this.resArray.forEach(item => {
          //   const hasItem = _this.configureTextArray.find(cItem => cItem.id === item.id);
          //   if (item.status !== 0 && !hasItem) {
          //     _this.configureTextArray.push(item)
          //   };
          // });
          // _this.resArray[1].status = 2;
          // _this.resArray[2].status = 1;
          // _this.configureProgress += 1;
          // if (_this.configureTextArray.length >= 5) {
          //   clearInterval(_this.timerConfigure);
          //   _this.configureProgress >= 5 && (_this.isConfigureFail = true);
          //   // 通知父组件 更新到下一步的视图
          //   // _this.$emit('update-step', 3)
          // }

        }, 1500);
      },

      /** 再次加载 */
      againConfigure() {

        // this._apis.profile.intelligentEnableTemplate()
      },

      /** 设置是否启用swiper */
      settingSwiper() {
        console.table('%c' + this.$refs.templateList.clientWidth, 'color: deepskyblue');
        if (this.$refs.templateList.clientWidth >= (255 * 5)) this.useSwiper = false
        else this.useSwiper = true
      },

      /** 选择模板 */
      selectedId(id) {
        this.selectTemplateId = this.selectTemplateId === id ? null : id;
      },

      /** 上一步 */
      prevStep() {
        if(this.isConfigureFail) return;
        this.$emit('update-step', 1)
      },


    },
    watch: {
      'industryId'(newValue, oldValue) {
        if (newValue !== null) this.fetchListData();
      }
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
          margin-bottom: 40px;
          width: 130px;
          height: 130px;
          padding: 10px;
          background-color: #fff;
        }

        .hint {
          margin-top: 78px;
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
          height: 28px;
          border-radius: 14px;
          border: 1px solid #D0D6E4;
          font-size: 14px;
          color: $contentColor;
          line-height: 28px;
          box-sizing: border-box;
          cursor: pointer;

          & + .view_button {
            margin-left: 15px;
          }

          &.selected {
            color: $globalMainColor;
            border-color: $globalMainColor;
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
        transition: opacity 1s;
        font-size: 14px;
        font-weight: 400;
        color: #44434B;
        line-height: 20px;

        &.show {
          animation: upShow 0.5s;
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
