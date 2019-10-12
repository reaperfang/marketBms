<template>
<!-- 组件-公用搜索框 -->
    <div class="componentGoodsSearch" style="z-index:4;" v-if="currentComponentData && currentComponentData.data">
        <div class="inputBox" :class="[{'textPosition':textPosition!=1},{'borderStyle':borderStyle!=1}]" :style="[{background:backgroundColor},{height:borderHeight+'px'},{border:'1px solid'+borderColor},{color:fontColor}]">
            <img src="@/assets/images/shop/fdj.png" class="fdj" />
            <p :style="{color:fontColor}">{{hotWords[0]}}</p>
        </div>
        <div class="gwcNotice" v-if="noticeCartBtn==1">
            <img src="@/assets/images/shop/notice.png" alt="消息">
            <span></span>
        </div>
        <!-- 解决BUG： CYDSZT-900 -->
        <!-- <p class="searchButton">搜索</p>
        <div class="gwcIcon" v-if="shoppingCartBtn==1">
            <img src="@/assets/images/shop/gwcIcon2.png" alt="">
        </div> -->
    </div>
</template>
<script> 
import componentMixin from '../mixins/mixinComps';
export default {
    name:"componentGoodsSearch",
    mixins:[componentMixin],
    data(){
        return{
            "hotWords": [
          
            ],
            "borderStyle": '',
            "borderHeight": '',
            "backgroundColor": '',
            "borderColor":'',
            "fontColor":'',
            "textPosition": '',
            "shoppingCartBtn": '',
            "noticeCartBtn": '',
            "searchStyle": ''
        }
    },
    created(){
        this.decoration();
    },
    watch: {
      data: {
        handler(newValue) {
          this.decoration();
        },
        deep: true
      }
    },
    methods:{
        decoration(){
            if(!this.currentComponentData || !this.currentComponentData.data) {
              return;
            }
            this.hotWords = this.currentComponentData.data.hotWords;
            this.borderStyle = this.currentComponentData.data.borderStyle;
            this.borderHeight = this.currentComponentData.data.borderHeight;
            this.backgroundColor = this.currentComponentData.data.backgroundColor;
            this.borderColor = this.currentComponentData.data.borderColor;
            this.fontColor = this.currentComponentData.data.fontColor;
            this.textPosition = this.currentComponentData.data.textPosition;
            this.shoppingCartBtn = this.currentComponentData.data.shoppingCartBtn;
            this.noticeCartBtn   = this.currentComponentData.data.noticeCartBtn;
            this.searchStyle = this.currentComponentData.data.searchStyle;
        }
    },
    watch:{
        currentComponentData(){
            this.decoration();
        }
    }
}
</script>
<style lang="scss" scoped>
// 搜索框样式
.componentGoodsSearch{
    padding:15px 0;
    background:#fff;
    display:flex;
    align-items:center;
    .searchButton{
        text-align:center;
        color:#333;
        width:50px;
        height:100%;
        font-size:16px;
        margin-left:5px;
        @extend .flexCenterMiddle;
    }
    .gwcNotice{
        position: relative;
        padding: 0 10px;
        cursor: pointer;
        img{
            width: 19px;
            height: 23px;
        }
        span{
            position: absolute;
            right: 7px;
            top: -1px;
            width: 6px;
            height: 6px;
            background: #FC3D42;
            border-radius: 50%;
        }
    }
    .gwcIcon{
        width:50px;
        height:100%;
        display: -webkit-flex;
        display: flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        margin-left:5px;
        position:relative;
        img{
            width:19.5px;
            height:19.5px;
        }
        .redCircle{
            position:absolute;
            top:1.5px;
            right:10px;
            font-size:7px;
            color:#fff;
            padding:0 2.5px;
            height:9px;
            line-height:9px;
            background:#FC3D42;
            @include borderRadius(25px);
        }
    }
    .inputBox.textPosition{
        justify-content:center;
    }
    .inputBox.borderStyle{
        border-radius:25px;
    }
    .inputBox{
        position:relative;
        overflow:hidden;
        margin-left:10px;
        height:100%;
        display:flex;
        flex:1;
        align-items:center;
        padding:0 10px;
        .fdj{
            width:14px;
            height:14px;
            margin-right:10px;
        }
        p{
            font-size:14px;
            color:#333;
        }
    }
}
</style>


