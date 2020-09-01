<template>
  <section class="intelligent_industry">
    <div class="i_industries" v-if="industries.length > 0">
      <div class="i_industry" :class="{'act': industryAct === item.id}" v-for="(item, key) in industries" :key="key" @click="changeIndustry(item)">
        <img src="../../../assets/images/profile/i_industry_act.png"  alt="" />
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="i_industries_none" v-else>暂无数据...</div>

    <div class="bottom_buttons">
      <el-button type="primary" size="medium" @click.native="toPreviewTemplate" :disabled="industries.length == 0"> 下一步，预览模板 </el-button>
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
        this.industries = [{name:'肉禽蛋品', id: 101},{name:'新鲜水果', id: 102},{name:'酒水饮料', id: 103}];
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
      font-weight: 600;
      background: url('../../../assets/images/profile/i_industry.png') no-repeat;
      background-size: contain;
      cursor: pointer;

      &:hover, &.act {
        background: url('../../../assets/images/profile/i_industry_on.png') no-repeat;
        background-size: contain;
      }

      span {
        line-height: 126px;
        color: #fff;
        font-size: 24px;
        display: inline-block;
      }

      img {
        display: none;
      }

      &.act img {
        display: inline-block;
        width: 30px;
        height: 30px;
        vertical-align: middle;
        line-height: 126px;
        margin-top: -9px;
        margin-right: 8px;
      }

    }
  }
  
  .i_industries_none {
    height: 300px;
    text-align: center;
  }

  .bottom_buttons {
    margin-bottom: 30px;
  }

</style>
