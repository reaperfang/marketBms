<template>
  <section class="intelligent_industry" v-loading="isLoading">
    <div class="i_industries" v-if="industries.length > 0">
      <div class="i_industry" :class="{'act': industryAct === item.id}" v-for="(item, key) in industries" :key="key" @click="changeIndustry(item)">
        <transition name="el-fade-in">
          <img v-show="industryAct === item.id" src="../../../assets/images/profile/i_industry_act.png"  alt="" />
        </transition>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="i_industries_none" v-else>暂无数据...</div>

    <div class="bottom_buttons">
      <el-button type="primary" :loading="nextIsLoading" size="medium" @click.native="toPreviewTemplate" :disabled="industries.length == 0"> 下一步，预览模板 </el-button>
    </div>
  </section>
</template>

<script>
  export default {
    name: "intelligent_industry",
    props: {
      industryId: { default: null }, // 选中的行业
      stepId: null
    },
    data() {
      return {
        industries: [],  // 行业信息
        industryAct: null,
        isLoading: false,
        nextIsLoading: false
      }
    },
    created() {
      this.getIndustry();
      if(this.industryId) this.industryAct = this.industryId;
    },
    methods: {
      /** 获取行业 */
      getIndustry() {
        this.isLoading = true;
        this._apis.profile.getIntelligentIndustry({}).then((response)=>{
          this.industries = response
        }).catch((error)=>{
          this.$message.error(error);
        }).finally(() => {this.isLoading = false})
        // this.industries = [{name:'肉禽蛋品', id: 1},{name:'新鲜水果', id: 2},{name:'酒水饮料', id: 3}];
        // console.log('industries', this.industries);
      },

      /** 选择行业 */
      changeIndustry({id}) {
        this.industryAct = id;
        this.$emit('update-industry-id', this.industryAct);
      },

      /** 进行下一步 */
      toPreviewTemplate() {
        if(this.industryAct == null) {
          this.$message.error('请选择行业')
        }
        else {
          this.nextIsLoading = true;
          this._apis.profile.intelligentUpdateStep({chooseIndustryId: this.industryId, changeStep: 2, status: 0})
            .then(() => { this.$emit("update-step", 2) })
            .catch(error => { this.$message.error(error + "请稍后再试") })
            .finally(()=>{this.nextIsLoading = false;})
        }
      }
    },
    watch: {
      'industryId'(newValue, oldValue){
        if(newValue !== null) this.industryAct = newValue;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .intelligent_industry {
    padding: 2px;
  }

  .i_industries {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 110px auto 200px;
    width: 804px;

    .i_industry {
      flex: 0 0 236px;
      text-align: center;
      width: 236px;
      height: 126px;
      font-weight: 600;
      background: url('../../../assets/images/profile/i_industry.png') no-repeat;
      background-size: contain;
      cursor: pointer;
      user-select: none;

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
