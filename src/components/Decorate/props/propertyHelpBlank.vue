<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
    <div class="block form">
      <el-form-item label="空白高度" prop="blankHeight">
          <div class="slider-wrapper">
            <el-slider v-model="ruleForm.blankHeight" :min="10" :max="100"></el-slider>
            <span>{{ruleForm.blankHeight}}像素</span>
          </div>
        </el-form-item>
    </div>
  </el-form>
</template>

<script>
import mixinPropsBase from '../mixins/mixinPropsBase';;
export default {
  name: 'propertyHelpBlank',
  mixins: [mixinPropsBase],
  components: {},
  data () {
    return {
      ruleForm: {
        blankHeight: 30//	空白高度
      },
      rules: {

      },

    }
  },
  methods: {
  }
}
</script>

<style lang="scss">

</style>
