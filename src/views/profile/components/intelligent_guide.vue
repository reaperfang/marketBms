<template>
  <div class="intelligent_guide">
    <h2 class="i_g_title">智能开店，一键生成神器，助力您快速打造自己的专属店铺</h2>
    <ol class="i_guide">
      <li>
        <div class="i_g_tit"><span>1</span><span>选择所属行业</span></div>
        <div class="i_g_item i_g_1">
          <p>行业多样</p>
          <p>选择您销售领域的专属行业</p>
        </div>
      </li>
      <li>
        <div class="i_g_tit"><span>2</span><span>预览行业模板</span></div>
        <div class="i_g_item i_g_2">
          <p>手机扫码预览店铺</p>
          <p>直接体验线上购物流程</p>
        </div>
      </li>
      <li>
        <div class="i_g_tit"><span>3</span><span>启用行业模板</span></div>
        <div class="i_g_item i_g_3">
          <p>一键启用行业模板</p>
          <p>替换内容即可定制您的店铺</p>
        </div>
      </li>
      <li>
        <div class="i_g_tit"><span>4</span><span>店铺基础信息建设</span></div>
        <div class="i_g_item i_g_4">
          <p>三步基础信息建设</p>
          <p>助力您快速投产</p>
        </div>
      </li>
    </ol>
    <div class="i_guide_btns">
      <el-button @click="toProfile"> 再看看 </el-button>
      <el-button type="primary" @click="$emit('hide-guide')"> 我已准备好 </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "intelligent_guide",
    methods: {
      toProfile(){
        this.$router.push({ path: '/profile/profile' });
      },
    }
  }
</script>

<style lang="scss" scope>
  .intelligent_guide {
    text-align: center;
    min-width: 976px;
    background: #fff;
  }

  .i_g_title {
    margin-top: 28px;
    font-size: 18px;
    font-weight: 600;
    color: $titleColor;
  }
  
  .i_guide {
    width: 976px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 60px auto;

    li {
      width: 220px;
      text-align: left;
    }
  }

  .i_g_tit {
    width: 202px;
    height: 30px;
    background: url('../../../assets/images/profile/g_tit.png') no-repeat;
    background-size: contain;
    margin-bottom: 20px;

    span {
      display: inline-block;
      font-weight: 600;

      &:first-of-type {
        font-size: 18px;
        color: #fff;
        line-height: 30px;
        margin-left: 11px;
        user-select: none;
      }

      &:last-of-type {
        font-size: 14px;
        color: $titleColor;
        height: 18px;
        line-height: 100%;
        vertical-align: middle;
        margin-left: 25px;
      }
    }
  }

  .i_g_item {
    width: 220px;
    height: 325px;
    user-select: none;

    &.i_g_1 {
      background: url('../../../assets/images/profile/g_01.png') no-repeat;
      background-size: contain;
    }
    &.i_g_2 {
      background: url('../../../assets/images/profile/g_02.png') no-repeat;
      background-size: contain;
    }
    &.i_g_3 {
      background: url('../../../assets/images/profile/g_03.png') no-repeat;
      background-size: contain;
    }
    &.i_g_4 {
      background: url('../../../assets/images/profile/g_04.png') no-repeat;
      background-size: contain;
    }

    p {
      margin-left: 16px;

      &:first-of-type {
        font-size: 20px;
        font-weight: 600;
        color: $contentColor;
        line-height: 28px;
        padding-top: 25px;
        margin-bottom: 8px;
      }

      &:last-of-type {
        font-size: 15px;
        font-weight: 600;
        color: $globalMainColor;
        line-height: 21px;
      }
    }
    
  }

  .i_guide_btns {
    margin-bottom: 30px;

    button:first-of-type {
      margin-right: 20px;
    }
  }
</style>
