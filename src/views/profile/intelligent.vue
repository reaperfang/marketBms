<template>
  <div id="intelligent_shop">
    <guide v-if="isShowGuide" @hide-guide="hideGuide"></guide>

    <h2 class="title"> 智能开店 </h2>

    <!--  step_progress  -->
    <ul class="steps">
      <li class="step-item step-start" :class="{'selected': stepStatus >= 1}"><span class="step-text">选择经营行业</span></li>
      <li class="step-item step-middle" :class="{'selected': stepStatus >= 2}"><span class="step-text">预览模板</span></li>
      <li class="step-item step-middle" :class="{'selected': stepStatus >= 3}"><span class="step-text">启用模板</span></li>
      <li class="step-item step-end" :class="{'selected': stepStatus >= 4}"><span class="step-text">基础建设</span></li>
    </ul>

    <!--  step_1  选择行业-->
    <step-industry
      v-show="stepStatus === 1"
      v-if="stepStatus <=2"
      :industryId="industryId"
      @update-step="updateStep"
      @update-industry-id="updateIndustryId"
    ></step-industry>

    <!--  step_2  预览模板-->
    <step-preview
      v-if="stepStatus === 2"
      @update-step="updateStep"
      @update-template-id="updateTemplateId"
      :industryId="industryId"

    ></step-preview>

    <!--  step_3  启用模板-->
    <step-enable v-if="stepStatus === 3" @update-step="updateStep"></step-enable>

    <!--  step_4  基础建设-->
    <step-base v-if="stepStatus === 4" @update-step="updateStep"></step-base>
  </div>
</template>
<script>
  import guide from './components/intelligent_guide'
  import stepIndustry from './components/intelligent_step_1'
  import stepPreview from './components/intelligent_step_2'
  import stepEnable from './components/intelligent_step_3'
  import stepBase from './components/intelligent_step_4'

  export default {
    name: 'intelligent-shop',
    components: {guide, stepIndustry, stepPreview, stepEnable, stepBase},
    data() {
      return {
        isShowGuide: false,  // 是否是显示引导（首次进入）
        stepStatus: null, // 进行到了第几步
        stepArray: ['industry', 'preview', 'enable', 'base'], //
        industryId: null,
        templateId: null
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
          // setTimeout(() => {
          //   this.industryId = 102;
          // }, 3000)
          console.log(result);
          if(result) {
            this.stepStatus = result.currentStep;
            this.industryId = result.chooseIndustryId;
            this.chooseTemplateId = result.chooseTemplateId;
          }
        } catch (err) {
          console.error(err)
        }
      },

      /** 关闭引导 */
      hideGuide() {
        this.isShowGuide = false;
      },

      /** 更新 步骤 */
      updateStep(stepNumber) {
        const paramsList = [
          {chooseIndustryId: this.industryId},
          {chooseTemplateId: this.templateId},
          {},
          {}
        ];
        this._apis.profile.intelligentUpdateStep(paramsList[stepNumber-1]).then(res => {
          if (res) this.stepStatus = stepNumber
        });

      },

      /** 更新所选行业ID */
      updateIndustryId(id) {
        this.industryId = id;
      },

      /** 更新所选店铺模板ID */
      updateTemplateId(id) {
        this.templateId = id;
      },
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
