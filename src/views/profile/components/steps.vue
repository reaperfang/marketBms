<template>
   <div class="steps">
     <div class="btn">
       <el-button  size="small" class="btn-close" @click="handleClose">关闭引导</el-button>
     </div>
     <div class="main">
       <ul :class="actived">
         <li class="step1">
           <i class="el-icon-success"></i>
           <span>经营范围</span>
         </li>
         <li class="step2">
           <i class="el-icon-success"></i>
           <span>店铺信息</span>
         </li>
         <li class="step3">
           <i class="el-icon-success"></i>
           <span>渠道授权及支付</span>
         </li>
         <li class="step4">
           <i class="el-icon-success"></i>
           <span>运营交易配置</span>
         </li>
         <li class="step5">
           <i class="el-icon-success"></i>
           <span>店铺装修</span>
         </li>
       </ul>
     </div>
   </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 2
    }
  },
  components: {},

  data () {
    return {

    }
  },

  computed: {
    actived() {
      return {
        'step1-actived': this.step === 1,
        'step2-actived': this.step === 2,
        'step3-actived':  this.step === 3,
        'step4-actived':  this.step === 4,
        'step5-actived':  this.step === 5,
        'step6-actived':  this.step === 6
      }
    }
  },

  watch: {},

  created() {},

  mounted() {},

  methods: {
    handleClose() {
      this.$router.push({ path: '/profile/profile' })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$mainColor: rgba(101,94,255,1);
$secondColor: rgba(242,242,249,1);
$threeColor: #fff;
.steps {
  background: $threeColor;
  .btn {
    text-align: right;
    &-close {
      border-radius:4px;
      border:1px solid $mainColor;
      font-size:12px;
      font-weight:400;
      color:$mainColor;
    }
  }
  .main {
    width: 885px;
    margin-top: -12px;
    ul {
      position: relative;
      display: flex;
      width: 100%;
      background:rgba(242,242,249,1);
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      &:before {
        position: absolute;
        content: ' ';
        left: 0;
        top: 0;
        width: 0px;
        height: 100%;
        background-color: $mainColor;
      }
      li {
        position: relative;
        width: 177px;
        font-size:16px;
        font-weight:500;
        color:rgba(68,67,75,1);
        text-align: center;
        i {
          color:$threeColor;
          display: none;
        }
        &:before {
          position: absolute;
          content: ' ';
          right: -23px;
          top: 2px;
          width: 0;
          height: 0;
          font-size: 0;
          border-bottom: 46px solid #fff;
          border-left: 46px solid transparent;
          transform:rotate(-45deg); /* Safari 和 Chrome */
        }
        &:after {
          position: absolute;
          content: ' ';
          right: -18px;
          top: 7px;
          width: 0;
          height: 0;
          font-size: 0;
          border-bottom: 36px solid #f2f2f9;
          border-left: 36px solid transparent;
          transform:rotate(-45deg);
        }
        &.step2, &.step3, &.step4 {
          text-indent: 20px;
        }
        &.step5 {
          &:before, &:after {
            display: none;
          }
        }
      }
      &.step1-actived {
        &:before {
          width: 177px;
        }
        .step1 {
          color:$threeColor;
          &:after {
            border-bottom-color:$mainColor;
          }
        }
      }
      &.step2-actived {
        &:before {
          width: 354px;
        }
        .step1 {
          i {
            display: inline-block;
          }
        }
        .step1, .step2 {
          color:$threeColor;
          &:after {
            border-bottom-color:$mainColor;
          }
        }
      }
      &.step3-actived {
        &:before {
          width: 531px;
        }
        .step1, .step2 {
          i {
            display: inline-block;
          }
        }
        .step1, .step2, .step3 {
          color:$threeColor;
          &:after {
            border-bottom-color:$mainColor;
          }
        }
      }
      &.step4-actived {
        &:before {
          width: 708px;
        }
        .step1, .step2, .step3 {
          i {
            display: inline-block;
          }
        }
        .step1, .step2, .step3, .step4 {
          color:$threeColor;
          &:after {
            border-bottom-color:$mainColor;
          }
        }
      }
      &.step5-actived {
        &:before {
          width: 885px;
        }
        .step1, .step2, .step3, .step4 {
          i {
            display: inline-block;
          }
        }
        .step1, .step2, .step3, .step4, .step5 {
          color:$threeColor;
          &:after {
            border-bottom-color:$mainColor;
          }
        }
      }
      &.step6-actived {
        &:before {
          width: 885px;
        }
        .step1, .step2, .step3, .step4, .step5 {
          i {
            display: inline-block;
          }
        }
        .step1, .step2, .step3, .step4, .step5 {
          color:$threeColor;
          &:after {
            border-bottom-color:$mainColor;
          }
        }
      }
    }
  }
}
</style>