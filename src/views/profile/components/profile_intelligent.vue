<template>
  <div class="profile_intelligent" v-if="stepStatus < 4">
    <h2>智能开店</h2>
    <span>
      让做生意变得更简单
    </span>

    <!-- <router-link to="/profile/intelligent" class="to_intelligent">立即体验</router-link> -->
    <!-- <router-link :to="{name: 'intelligent', query: {isShowGuide: isFirst, stepStatus: stepStatus}}" class="to_intelligent">立即体验</router-link> -->
    <el-button type="text" class="to_intelligent" @click.native="toIntelligent">立即体验</el-button>

    <div class="p_i_steps">
      <ul>
        <li :class="{'success': stepStatus >= 1}">①选择所属行业</li>
        <li :class="{'success': stepStatus >= 2}">②预览行业模板</li>
        <li class="step_industry" :class="{'success': stepStatus >= 3}">③启用行业模板
          <el-popover
          placement="top-start"
          title=""
          width="500"
          trigger="hover"
          content="您的行业模板数据配置失败、模板未启用成功，请您点击“立即体验”再次配置模板数据">
          <i class="el-icon-info" slot="reference"></i>
        </el-popover>
        </li>
        <li :class="{'success': stepStatus >= 4}">④店铺基础信息建设</li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
    name: 'profile_intelligent',
    data() {
      return {
        isFirst: false, // 是否首次
        stepStatus: 1, // 进行到了第几步
      }
    },
    created() {
      this.getIntelligent();
    },
    methods:{
      /** 智能开店 */
      getIntelligent() {

        // test
        this.isFirst = true;
        this.stepStatus = 3;

      },

      /** 智能开店体验引导 */
      toIntelligent() {
        this.$router.push({ path: '/profile/intelligent' });
        // this._routeTo('intelligent', {isShowGuide: this.isFirst, stepStatus: this.stepStatus});
        
      },

    }
}
</script>

<style lang="scss" scoped>
  .profile_intelligent {
    margin-top: 15px;
    padding: 15px;
    border-radius: 5px;
    background-color: #fff;

    .to_intelligent{
      color: #655EFF;
    }
  }

  .p_i_steps {

    li {
      display: inline-block;
    }

    li.success {
      color: #655EFF;
    }

    li.step_industry {
      position: relative;
    }

    /deep/ .el-icon-info{
      position: absolute;
      top: -15px;
      right: -5px;
      font-size: 18px;
      color: red;
    }

  }
</style>
