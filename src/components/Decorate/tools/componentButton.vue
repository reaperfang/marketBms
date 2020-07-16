<template>
  <!-- 组件-风格按钮 -->
  <div class="componentButton" :class="buttonStyle" :style="buttonStyleCss">
    {{decorationText}}
    <gwcIcon v-if="decorationStyle==9"></gwcIcon>
  </div>
  
</template>
<script>
import gwcIcon from './gwcIcon'
export default {
  name: "componentButton",
  data(){
    return{
      buttonStyle:'',
      buttonStyleCss:{}
    }
  },
  props: ["decorationStyle","decorationText"],
  components:{
    gwcIcon
  },
  computed: {
      colorStyle() {
          return this.$store.getters.colorStyle || {colors:[]};
        },
        color1(){
            return this.colorStyle.colors && this.colorStyle.colors[0]
        },
        color2(){
            return this.colorStyle.colors && this.colorStyle.colors[1]
        },
        color3(){
            return this.colorStyle.colors && this.colorStyle.colors[2]
        }
  },
  created(){
    this.$store.dispatch('getShopStyle');
    this.decorate();
  },
  methods:{
    decorate(){
      if(this.decorationStyle==1){
        this.buttonStyle='buttonStyle' + this.decorationStyle + ' iconfont icon-gouwuche2';
        this.buttonStyleCss = {background:this.color1}
      }
      else if(this.decorationStyle==2){
        this.buttonStyle='buttonStyle' + this.decorationStyle + ' iconfont icon-jiahao';
        this.buttonStyleCss = {border:'1px solid '+this.color1,color:this.color1}
      }
      else if(this.decorationStyle==3){
        this.buttonStyle='buttonStyle' + this.decorationStyle;
        this.buttonStyleCss = {background:this.color1,color:'#fff'}
      }
      else if(this.decorationStyle==4){
        this.buttonStyle='buttonStyle' + this.decorationStyle;
        this.buttonStyleCss = {border:'1px solid '+this.color1,color:this.color1}
      }
      else if(this.decorationStyle==5){
        this.buttonStyle='buttonStyle' + this.decorationStyle + ' iconfont icon-jiahao';
        this.buttonStyleCss = {background:this.color1,color:'#fff'}
      }
      else if(this.decorationStyle==6){
        this.buttonStyle='buttonStyle' + this.decorationStyle + ' iconfont icon-gouwuche2';
        this.buttonStyleCss = {color:this.color1}
      }
      else if(this.decorationStyle==7){
        this.buttonStyle='buttonStyle' + this.decorationStyle;
        this.buttonStyleCss = {background:this.color1,color:'#fff'}
      }
      else if(this.decorationStyle==8){
        this.buttonStyle='buttonStyle' + this.decorationStyle;
        this.buttonStyleCss = {border:'1px solid '+this.color1,color:this.color1}
      }
      else if(this.decorationStyle==9){
        this.buttonStyle='buttonStyle' + this.decorationStyle;
        this.buttonStyleCss = {}
      }
    }
  },
  watch:{
    decorationStyle(){
      this.decorate();
    },
    decorationText(){
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
  width:28px !important;
  height:28px !important;
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
  height:28px;
  line-height:28px;
}
.componentButton.buttonStyle4{
  padding:0 7.5px;
  border:1px solid #FF4444;
  @include borderRadius(4px);
  font-size:12px;
  @extend .flexCenterMiddle;
  color:#FF4444;
  min-width:40px;
  height:28px;
  line-height:28px;
}
.componentButton.iconfont.buttonStyle5{
  padding:0 7.5px;
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
  height:28px;
  line-height:28px;
}
.componentButton.buttonStyle8{
  padding:0 7.5px;
  border:1px solid #FF4444;
  @include borderRadius(25px);
  font-size:12px;
  @extend .flexCenterMiddle;
  color:#FF4444;
  min-width:40px;
  height:28px;
  line-height:26px;
}
.componentButton.buttonStyle9{
  width:28px;
  height:28px;
  font-size:0 !important;
}
</style>