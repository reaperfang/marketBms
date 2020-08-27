<template>
  <div class="intelligent_guide">
    <h2>智能开店，一键生成神器，助力您快速打造自己的专属店铺：</h2>
    <ol class="i_guide">
      <li>
        <p>1 选择所属行业</p>
        <div>
          <img src="../../../assets/images/bg_login.png" alt="选择所属行业" />
          <p>手机扫码预览店铺<br>直接体验线上购物流程</p>
        </div>
      </li>
      <li>
        <p>2 预览行业模板</p>
        <div>
          <img src="../../../assets/images/bg_login.png" alt="预览行业模板" />
          <p>行业多样，<br>选择您销售领域的专属行业</p>
        </div>
      </li>
      <li>
        <p>3 启用行业模板</p>
        <div>
          <img src="../../../assets/images/bg_login.png" alt="启用行业模板" />
          <p>一键启用行业模板，替换内容<br>即可成为您的定制店铺</p>
        </div>
      </li>
      <li>
        <p>4 店铺基础信息建设</p>
        <div>
          <img src="../../../assets/images/bg_login.png" alt="店铺基础信息建设" />
          <p>三步基础信息建设<br>助力您快速投产</p>
        </div>
      </li>
    </ol>
    <div class="i_guide_btns">
      <el-button type="primary" @click="$emit('hide-guide')"> 我已准备好 </el-button>
      <el-button @click="toProfile"> 再看看 </el-button>
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
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 20px;
    background-color: #fff;
    z-index: 2;
  }
  
  .i_guide {
    margin: 30px 0 40px;
    width: 910px;

    li {
      display: inline-block;
      width: 200px;
      margin-right: 20px;
      text-align: center;

      img {
        width: 200px;
        height: 250px;
        margin: 10px 0;
      }
    }
  }

  .i_guide_btns {
    width: 910px;
    text-align: center;
  }
</style>
