<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :style="bodyHeight">
    <div class="block form">
      <el-form-item label="文案" prop="words">
        <el-input
          placeholder="请输入文案"
          v-model="ruleForm.words">
        </el-input>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';;
export default {
  name: 'propertyEnterShop',
  mixins: [propertyMixin],
  components: {},
  data () {
    return {
      ruleForm: {
        words: '进入店铺'//文案
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
