<template>
  <div id="intelligent_shop">

    <h2 class="title"> 智能开店 </h2>

    <!--  step_progress  -->
    <ul class="steps">
      <li class="step-item step-start selected"><span class="step-text">选择经营行业</span></li>
      <li class="step-item step-middle" :class="{'selected': stepCurrent >= 2}"><span class="step-text">预览模板</span></li>
      <li class="step-item step-middle" :class="{'selected': stepCurrent >= 3}"><span class="step-text">启用模板</span></li>
      <li class="step-item step-end" :class="{'selected': stepCurrent === 4}"><span class="step-text">基础建设</span></li>
    </ul>

    <!--  step_1  选择行业-->
    <step-industry
      v-show="stepCurrent === 1"
      v-if="stepCurrent <= 2"
      :industry-id="industryId"
      :step-id="stepId"
      @update-step="updateStep"
      @update-industry-id="updateIndustryId"
    ></step-industry>

    <!--  step_2  预览模板-->
    <step-preview
      v-if="stepCurrent === 2"
      @update-step="updateStep"
      @update-template-id="updateTemplateId"
      :industry-id="industryId"
      :current-step="stepCurrent"
      :step-status="stepStatus"
      :step-id="stepId"
      :configure-fail="configureFail"
    ></step-preview>

    <!--  step_3  启用模板-->
    <step-enable
      v-if="stepCurrent === 3 && stepStatus === 1"
      @update-step="updateStep"
      :step-id="stepId"
    ></step-enable>

    <!--  step_4  基础建设-->
    <step-base v-if="stepCurrent === 4" @update-step="updateStep" :step-id="stepId"></step-base>
  </div>
</template>
<script>
  import stepIndustry from './components/intelligent_step_1'
  import stepPreview from './components/intelligent_step_2'
  import stepEnable from './components/intelligent_step_3'
  import stepBase from './components/intelligent_step_4'

  export default {
    name: 'intelligent-shop',
    components: { stepIndustry, stepPreview, stepEnable, stepBase},
    data() {
      return {
        stepCurrent: null,    // 进行到了第几步
        stepId: null,
        stepStatus: null,    // 状态0 进行中，1：已完成
        stepArray: ['industry', 'preview', 'enable', 'base'], //
        industryId: null,
        templateId: null,
        configureFail: false, // 启用模板失败 || 中途退出关闭
      }
    },
    created() {
      // 获取助用户上次操作的步骤和数据状态
      this.fetchIntelligentStatus();
    },
    methods: {
      /** 获取助用户上次操作的步骤和数据状态 */
      async fetchIntelligentStatus() {
        try {
          const result = await this._apis.profile.getIntelligentProgress();
          console.log(result);
          if(result) {
            // this.stepStatus = result.currentStep ? result.status === 1 ? result.currentStep + 1 : result.currentStep : 1;
            if(result.currentStep === 3 && result.status === 0) {
              this.stepCurrent = 2;
              this.configureFail = true;
            } else this.stepCurrent = result.currentStep;

            this.stepStatus = result.status;
            this.stepId = result.id;
            this.industryId = result.chooseIndustryId;
            this.chooseTemplateId = result.chooseTemplateId;
          }
        } catch (err) {
          console.error(err)
        }
      },

      /** 更新 步骤视图 */
      updateStep(stepNumber) {
        this.stepCurrent = stepNumber;
      },

      /** 更新所选行业ID */
      updateIndustryId(id) {
        this.industryId = id;
      },

      /** 更新所选店铺模板ID */
      updateTemplateId(id) {
        this.templateId = id;
      }
    },

  }
</script>

<style lang="scss">
  #intelligent_shop {
    position: relative;
    padding: 20px;
    min-height: 100%;
    background-color: #fff;

    .title {
      position: relative;
      padding-left: 13px;
      margin-bottom: 30px;
      font-size: 18px;
      font-weight: 600;
      color: $titleColor;
      line-height: 25px;


      &:after {
        content: '';
        display: block;
        position: absolute;
        top: 3px;
        left: 0;
        width: 3px;
        height: 19px;
        background-color: $globalMainColor;
      }
    }

    .steps {
      position: relative;
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
      user-select: none;

      .step-item {
        width: 227px;
        height: 51px;
        font-size: 16px;
        line-height: 52px;
        text-align: center;
        color: $contentColor;
        font-weight: 400;

        &.selected {
          color: #fff;
        }
      }

      .step-middle, .step-end {
        margin-left: -13px;
      }

      .step-start {
        background: url("../../assets/images/profile/intelligent_step_start.png") no-repeat right center;
        background-size: cover;
      }

      .step-middle {
        background: url("../../assets/images/profile/intelligent_step_middle.png") no-repeat right center;
        background-size: cover;
        &.selected {
          background-image: url("../../assets/images/profile/intelligent_step_middle_selected.png");
        }
      }

      .step-end {
        background: url("../../assets/images/profile/intelligent_step_end.png") no-repeat right center;
        background-size: cover;
        &.selected {
          background-image: url("../../assets/images/profile/intelligent_step_end_selected.png");
        }
      }
    }

    .bottom_buttons {
      text-align: center;

      .el-button--small {
        font-size: 14px;
      }
    }
  }
</style>
