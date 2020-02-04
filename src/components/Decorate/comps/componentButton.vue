<template>
  <!-- 组件-风格按钮 -->
  <div class="componentButton" :class="buttonStyle">{{decorationText}}</div>
</template>
<script>
export default {
  name: "componentButton",
  data(){
    return{
      buttonStyle:''
    }
  },
  props: ["decorationStyle","decorationText"],
  created(){
    this.decorate();
  },
  methods:{
    decorate(){
      if(this.decorationStyle==1){
        this.buttonStyle='buttonStyle' + this.decorationStyle + ' iconfont icon-gouwuche2';
      }
      else if(this.decorationStyle==2){
        this.buttonStyle='buttonStyle' + this.decorationStyle + ' iconfont icon-jiahao';
      }
      else if(this.decorationStyle==3||this.decorationStyle==4||this.decorationStyle==7||this.decorationStyle==8){
        this.buttonStyle='buttonStyle' + this.decorationStyle;
      }
      else if(this.decorationStyle==5){
        this.buttonStyle='buttonStyle' + this.decorationStyle + ' iconfont icon-jiahao';
      }
      else if(this.decorationStyle==6){
        this.buttonStyle='buttonStyle' + this.decorationStyle + ' iconfont icon-gouwuche2';
      }
    }
  },
  watch:{
    decorationStyle(){
      this.decorate();
    }
  }
}
</script>
<style lang="scss" scoped>
.componentButton{
  display:inline-block;
}
.componentButton.iconfont{
  width:26px !important;
  height:26px !important;
  @extend .flexCenterMiddle;
  font-size:0 !important;
  padding:0 !important;
}
.componentButton.iconfont.buttonStyle1{
  background:#FF4444;
  @include borderRadius(50%);
  color:#fff;
  &:before{
    font-size:17px;
  }
}
.componentButton.iconfont.buttonStyle2{  
  border:1px solid #FF4444;
  background:none;
  @include borderRadius(50%);
  color:#FF4444;
  font-weight:bold;
  &:before{
    font-size:17px;
  }
}
.componentButton.buttonStyle3{
  padding:0 7.5px;
  min-width:50px;
  color:#fff;
  font-size:12px;
  @include borderRadius(25px);
  @extend .flexCenterMiddle;
  background:#FF4444;
  height:24px;
}
.componentButton.buttonStyle4{
  padding:0 7.5px;
  border:1px solid #FF4444;
  @include borderRadius(4px);
  font-size:12px;
  @extend .flexCenterMiddle;
  color:#FF4444;
  min-width:40px;
  height:24px;
}
.componentButton.iconfont.buttonStyle5{
  background:#FF4444;
  @include borderRadius(50%);
  color:#fff;
  font-weight:bold;
  &:before{
    font-size:17px;
  }
}
.componentButton.iconfont.buttonStyle6{
  color:#FF4444;
  &:before{
    font-size:26px;
  }
}
.componentButton.buttonStyle7{
  padding:0 7.5px;
  min-width:50px;
  color:#fff;
  font-size:12px;
  @extend .flexCenterMiddle;
  background:#FF4444;
  @include borderRadius(4px);
  height:24px;
}
.componentButton.buttonStyle8{
  padding:0 7.5px;
  border:1px solid #FF4444;
  @include borderRadius(25px);
  font-size:12px;
  @extend .flexCenterMiddle;
  color:#FF4444;
  min-width:40px;
  height:24px;
}
</style>