<template>
  <div id="intelligent_shop">
    <guide v-if="isShowGuide" @hide-guide="hideGuide"></guide>

    <!--  step_progress  -->
    <ul class="steps">
      <li class="step-item step-start"><span class="step-text">选择经营行业</span></li>
      <li class="step-item step-middle"><span class="step-text">预览模板</span></li>
      <li class="step-item step-middle"><span class="step-text">启用模板</span></li>
      <li class="step-item step-end"><span class="step-text">基础建设</span></li>
    </ul>

    <!--  step_1  选择行业-->
    <step-industry v-show="stepStatus === 1" v-if="stepStatus <=2" :industryId="industryId" @update-step="updateStep"
                   @update-industry-id="updateIndustryId"></step-industry>

    <!--  step_2  预览模板-->
    <step-preview v-if="stepStatus === 2" @update-step="updateStep" :industryId="industryId"></step-preview>

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
        stepStatus: 2, // 进行到了第几步
        stepArray: ['industry', 'preview', 'enable', 'base'],
        industryId: null
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
          // const result = this._apis.profile.getIntelligentProgress();
          setTimeout(() => {
            this.industryId = 102;
          }, 3000)
        } catch (err) {
          console.log(err.message)
        }
      },

      /** 关闭引导 */
      hideGuide() {
        this.isShowGuide = false;
      },

      /** 更新 步骤 */
      updateStep(stepNumber) {
        this.stepStatus = stepNumber
      },

      /** 更新所选行业ID */
      updateIndustryId(id) {
        this.industryId = id;
      },
    },

  }
</script>

<style lang="scss">
  #intelligent_shop {
    position: relative;
    min-height: 100%;
    background-color: #fff;

    .steps {
      position: relative;

      .step-item {
        width: 227px;
        height: 51px;
        font-size: 16px;
        line-height: 52px;
        text-align: center;
        color: #fff;
      }

      .step-start {
        background: url("../../assets/images/profile/intelligent_step_start.png") no-repeat right center;
        background-size: cover;
      }

      .step-middle {
        background: url("../../assets/images/profile/intelligent_step_start.png") no-repeat right center;
        background-size: cover;
        &.selected {

        }
      }

      .step-end {

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
