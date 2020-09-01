<template>
  <section class="intelligent_industry">
    <div class="i_industries" v-if="industries.length > 0">
      <div class="i_industry" :class="{'act': industryAct === item.id}" v-for="(item, key) in industries" :key="key" @click="changeIndustry(item)">
        <img src="../../../assets/images/profile/i_industry_act.png"  alt="" />
        <span>{{ item.name }}</span>
      </div>

    </div>
    <div class="i_industries_none" v-else>暂无数据</div>

    <div class="bottom_buttons">
      <el-button type="primary" @click.native="toPreviewTemplate" :disabled="industries.length == 0"> 下一步，预览模板 </el-button>
    </div>
  </section>
</template>

<script>
  export default {
    name: "intelligent_industry",
    props: {
      industryId: { default: null } // 选中的行业
    },
    data() {
      return {
        industries: [],  // 行业信息
        industryAct: null,
      }
    },
    created() {
      this.getIndustry();
    },
    methods: {
      /** 获取行业 */
      getIndustry() {
        this.industries = [{name:'行业1', id: 101},{name:'行业2', id: 102},{name:'行业3', id: 103}];
        this.industryAct = this.industryId === null ? this.industries[0].id : this.industryId;
        // console.log('industries', this.industries);
      },

      /** 选择行业 */
      changeIndustry({id}) {
        this.industryAct = id;
        console.log('industryAct:   ', this.industryAct);
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

  .i_industries {
    display: flex;
    align-items: center;
    justify-content: center;
    justify-content: space-between;
    margin: 110px auto 200px;
    width: 800px;

    .i_industry {
      flex: 0 0 236px;
      text-align: center;
      width: 236px;
      height: 126px;
      background: url('../../../assets/images/profile/i_industry.png') no-repeat;
      font-weight: 600;

      span {
        line-height: 126px;
        color: #fff;
        font-size: 24px;
        display: inline-block;
      }

      img {
        display: none;
      }

      &:hover, &.act {
        background: url('../../../assets/images/profile/i_industry_on.png') no-repeat;
      }

      &.act img {
        display: inline-block;
        vertical-align: middle;
        line-height: 126px;
        margin-top: -9px;
        margin-right: 8px;
      }

    }
  }
  
  .i_industries_none {
    height: 300px;
  }

  .bottom_buttons {
    margin-bottom: 30px;
  }
  
  /* /deep/ .el-radio.is-bordered {
    border: none;
    background: #655EFF;
    color: #fff;
  }

  /deep/ .el-radio__input .el-radio__inner {
    opacity: 0;
    outline: none;
    position: absolute;
    z-index: -1;
  }

  /deep/ .el-radio__label {
    padding-left: 5px;
  } */

</style>
