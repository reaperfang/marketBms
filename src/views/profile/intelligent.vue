<template>
  <div id="intelligent_shop">
    <guide v-if="isShowGuide" @hide-guide="hideGuide"></guide>

    <!--  step_progress  -->
    <el-steps :active="stepStatus" finish-status="success" simple>
      <el-step title="选择行业" icon="el-icon-edit"></el-step>
      <el-step title="预览模板" icon="el-icon-upload"></el-step>
      <el-step title="启用模板" icon="el-icon-picture"></el-step>
      <el-step title="基础建设" icon="el-icon-picture"></el-step>
    </el-steps>

    <!--  step_1  选择行业-->
    <step-industry v-if="stepStatus === 1" @update-step="updateStep"></step-industry>

    <!--  step_2  预览模板-->
    <step-preview v-if="stepStatus === 2" @update-step="updateStep"></step-preview>

    <!--  step_3  启用模板-->
    <stepEnable v-if="stepStatus === 3" @update-step="updateStep"></stepEnable>

    <!--  step_4  基础建设-->
    <stepBase v-if="stepStatus === 4" @update-step="updateStep"></stepBase>
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
    components: { guide, stepIndustry, stepPreview, stepEnable, stepBase },
    data() {
      return {
        isShowGuide: false,  // 是否是显示引导（首次进入）
        stepStatus: 2, // 进行到了第几步
        stepArray: ['industry', 'preview', 'enable', 'base']
      }
    },
    methods: {
      /** 关闭引导 */
      hideGuide() {
        this.isShowGuide = false;
      },

      /** 更新 步骤 */
      updateStep(stepNumber) {
        this.stepStatus = stepNumber
      }
    },

  }
</script>

<style lang="scss">
  #intelligent_shop {
    position: relative;
    min-height: 100%;
    background-color: #fff;

    .bottom_buttons {
      text-align: center;
    }
  }
</style>
