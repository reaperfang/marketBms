<template>
  <section class="intelligent_guide">
    <h2 class="i_g_title"> 请选择您需要的开店方式 </h2>
    <div class="i_g_content">
      <div class="i_g_item left">
        <div @click=""> 立即开店 </div>
      </div>
      <div class="i_g_item right">
        <div @click="toIntelligent"> 立即开店 </div>
      </div>
    </div>
    <div class="i_g_footer">
      <span @click="toProfile"> 我想再看看 </span>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'intelligent-guide',
    data() {
      return {
        test: null,
      }
    },
    created() {
      
    },
    methods: {
      /** v1.6开店 */
      // to do sth...

      /** v1.8智能开店 */
      toIntelligent(){
        this.$router.push({ path: '/profile/intelligent' });
      },

      /** 返回概况页 */
      toProfile(){
        this.$router.push({ path: '/profile/profile' });
      },
    },
  }
</script>

<style lang="scss" scope>
  .intelligent_guide {
    background: #fff;
    height: 100%;
    min-height: 780px;
    border-radius: 4px;
    text-align: center;
    padding-top: 60px;
  }

  .i_g_title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    letter-spacing: 1px;
  }

  .i_g_content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 822px;
    margin: 60px auto 0;
  }

  .i_g_item {
    width: 381px;
    height: 461px;

    div {
      width: 160px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 380px auto auto;
      border: 1px solid #fff;
      border-radius: 20px;
      color: #fff;
      user-select: none;
      cursor: pointer;
    }

    &.left {
      background: url('../../assets/images/profile/i_g_01.png') no-repeat;
      background-size: contain;

      div:hover {
        background: #fff;
        color: #F85052;
      }
    }

    &.right {
      background: url('../../assets/images/profile/i_g_02.png') no-repeat;
      background-size: contain;

      div:hover {
        background: #fff;
        color: $globalMainColor;
      }
    }
  }

  .i_g_footer {
    margin-top: 60px;

    span {
      font-size: 14px;
      font-weight: 400;
      text-decoration: underline;
      color: $grayColor;
      letter-spacing: 1px;
      cursor: pointer;

      &:hover {
        color: $globalMainColor;
      }
    }
  }
</style>
