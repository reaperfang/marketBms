<template>
  <section class="intelligent_industry">
    <div class="i_industries" v-if="industries.length > 0">
      <el-radio-group v-for="(item, key) in industries" :key="key" :value="industryAct" @change="changeIndustry(item)">
        <el-radio :label="item.id" border>{{ item.name }}</el-radio>
      </el-radio-group>
    </div>
    <div class="i_industries_none" v-else>暂无数据</div>

    <el-button type="primary" @click.native="toPreviewTemplate" :disabled="industries.length == 0"> 下一步，预览模板 </el-button>
  </section>
</template>

<script>
  export default {
    name: "intelligent_industry",
    data() {
      return {
        industries: [],  // 行业信息
        industryAct: '', // 选中的行业
      }
    },
    created() {
      this.getIndustry();
    },
    methods: {
      /** 获取行业 */
      getIndustry() {
        this.industries = [{name:'行业1', id: 101},{name:'行业2', id: 102},{name:'行业3', id: 103}];
        this.industryAct = this.industries[0].id;
        console.log('industries', this.industries);
      },

      /** 选择行业 */
      changeIndustry({id}) {
        this.industryAct = id;
        console.log('industryAct', this.industryAct);
      },

      /** 进行下一步 */
      toPreviewTemplate() {
        if(this.industryAct === '') {
          this.$message.error('请选择行业')
        }
        else {
          this.$emit('update-industry-id', this.industryAct);
          this.$emit('update-step', 2)
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .intelligent_industry {
    padding: 20px;
  }

  .i_industries, .i_industries_none {
    height: 300px;
  }

  /deep/ .el-radio__input .el-radio__inner {
    opacity: 0;
    outline: none;
    position: absolute;
    z-index: -1;
  }

  /deep/ .el-radio__label {
    padding-left: 5px;
  }

</style>
