<template>
<!-- 组件-优惠套装 -->
    <div class="component_wrapper" v-loading="loading" :style="{cursor: dragable ? 'pointer' : 'text'}">
        <div class="componentDiscountPackage" :style="[{padding:pageMargin+'px'}]" :class="'listStyle'+listStyle"  v-if="currentComponentData && currentComponentData.data">
            <template v-if="hasRealData || hasFakeData">
                 <ul v-if="hasRealData">
                    <li v-for="(item,key) of displayList" :key="key" v-if="!(item.status==2&&currentComponentData.data.hideSaledGoods==true|| utils.dateDifference(item.endTime)<1&&currentComponentData.data.hideSaledGoods==true|| item.status==1&&item.isFutilityActivity==false&&currentComponentData.data.hideSaledGoods==true)" :style="[goodMargin,goodWidth]" :class="['goodsStyle'+goodsStyle,{goodsChamfer:goodsChamfer!=1},'goodsRatio'+goodsRatio]">
                        <div class="img_box">
                            <div class="label">已售{{item.participateActivityNum}}套</div>
                            <img :src="item.activityPic" alt="" :class="{goodsFill:goodsFill!=1}">
                        </div>
                        <div class="countdown_Bar" v-if="showContents.indexOf('4')!=-1">
                            <h1 class="title">优惠套装</h1>
                            <div class="countdown">
                                <img src="@/assets/images/shop/activityCountdownBj.png" alt="" class="bj">
                                <div class="content">
                                    <p class="caption">{{item.status==0?'距开始':'距结束'}}</p>
                                    <p class="time"><font>23</font>:<font>56</font>:<font>48</font></p>
                                    <!-- <p class="time">{{item.endTime}}</p> -->
                                    <!-- <van-count-down :time="
                                    item.status==0?utils.dateDifference(item.startTime):(item.status==1?utils.dateDifference(item.endTime):0)
                                    " class="time">
                                        <template v-slot="timeData">
                                            <span class="item">{{ utils.addZero(timeData.days) }}</span>
                                            <span class="item">{{ utils.addZero(timeData.hours + timeData.days * 24)}}</span>:
                                            <span class="item">{{ utils.addZero(timeData.minutes)}}</span>:
                                            <span class="item">{{ utils.addZero(timeData.seconds) }}</span>
                                        </template>
                                    </van-count-down> -->
                                </div>
                            </div>
                        </div>
                        <div class="info_box" v-if="showContents.length > 0">
                            <p class="name" :class="[{textStyle:textStyle!=1},{textAlign:textAlign!=1}]" v-if="showContents.indexOf('1')!=-1">{{item.name}}</p>
                            <p class="caption" :class="[{textStyle:textStyle!=1},{textAlign:textAlign!=1}]" v-if="showContents.indexOf('2')!=-1">套餐包含商品{{item.totalGoodsNum}}件</p>
                            <div class="limit_line" v-if="showContents.indexOf('5')!=-1&&item.joinLimit!=-1">
                                <p class="limit">{{item.joinLimit==-1?'':'限'+item.joinLimit+'次/人'}}</p>
                            </div>
                            <div class="price_line">
                                <p class="price" v-if="showContents.indexOf('3')!=-1">￥<font>{{item.packagePrice || 0}}</font></p>
                                <componentButton :decorationStyle="buttonStyle" :decorationText="currentComponentData.data.buttonText" class="button" v-if="showContents.indexOf('6')!=-1&&item.status==1&&utils.dateDifference(item.endTime) && listStyle != 3 && listStyle != 6"></componentButton>
                                <p class="activity_end" v-if="(item.status==2||utils.dateDifference(item.endTime)<1)&&utils.dateDifference(item.startTime)<1">活动已结束</p>
                                <p class="activity_end" v-if="item.status==0">活动未开始</p>
                            </div>
                        </div>
                    </li>
                </ul>
                <ul v-else>
                    <li v-for="(item,key) of currentComponentData.data.fakeList[listStyle - 1]" :key="key" :style="[goodMargin,goodWidth]" :class="['goodsStyle'+goodsStyle,{goodsChamfer:goodsChamfer!=1},'goodsRatio'+goodsRatio, 'fakeData']">
                        <div class="img_box"  v-if="listStyle != 4">
                            <img :src="item.fileUrl" alt="" :class="{goodsFill:goodsFill!=1}">
                        </div>
                        <div v-else class="img_box">
                            <img :src="item.fileUrl" alt="" :class="{goodsFill:goodsFill!=1}">
                        </div>
                    </li>
                </ul>
            </template>
            <componentEmpty v-else :componentData="currentComponentData"></componentEmpty>
        </div>
        <componentEmpty v-else :componentData="currentComponentData"></componentEmpty>
    </div>

</template>
<script>
import mixinCompsData from '../mixins/mixinCompsData';
export default {
    name:"componentDiscountPackage",
    mixins:[mixinCompsData],
    data(){
        return{
            allLoaded: false,  //因为有异步数据，所以初始化加载状态是false
            // 样式属性
            listStyle: '',
            pageMargin: '',
            goodsMargin: '',
            goodsStyle: '',
            goodsChamfer: '',
            goodsRatio: '',
            goodsFill: '',
            textStyle: '',
            textAlign: '',
            showContents: [],
            buttonStyle:'',
            hideSaledGoods:'',
            hideEndGoods:'',  
            hideType:'',
            // 自己定义的
            goodWidth:'',
            goodMargin:'',
            displayList: [],
            loading: false
        }
    },
    watch: {
      'currentComponentData.data.ids': {
            handler(newValue, oldValue) {
                if(!this.utils.isIdsUpdate(newValue, oldValue)) {
                    this.fetch();
                }
            },
            deep: true
        }
    },
    methods:{
        decoration(){
            if(!this.currentComponentData || !this.currentComponentData.data) {
              return;
            }
            this.listStyle = this.currentComponentData.data.listStyle;
            this.pageMargin = this.currentComponentData.data.pageMargin;
            this.goodsMargin = this.currentComponentData.data.goodsMargin;
            var scrollWidth = window && this.utils.isIE() ? 18 : 0;
            var bodyWidth = this.$refs.componentContent ? this.$refs.componentContent.clientWidth - scrollWidth - 4 : (375 - 4);
            if(this.listStyle==1){
                this.goodMargin = {marginTop:this.goodsMargin+'px'};
                this.goodWidth = "100%";
            }
            else if(this.listStyle==2){
                this.goodMargin = {marginTop:this.goodsMargin+'px'};
                this.goodWidth = {width:(bodyWidth - this.pageMargin*2 - this.goodsMargin)/2+'px'}
            }
            else if(this.listStyle==3){
                this.goodMargin = {marginTop:this.goodsMargin+'px',marginLeft:this.goodsMargin+'px'};
                this.goodWidth = {width:(bodyWidth - this.pageMargin*2 - this.goodsMargin*2)/3+'px'}
            }
            else if(this.listStyle==4){
                this.goodMargin = {marginTop:this.goodsMargin+'px'};
                this.goodWidth = "100%";
            }
            else if(this.listStyle==5){
                this.goodMargin = {marginTop:this.goodsMargin+'px'};
                this.goodWidth = {width:(bodyWidth - this.pageMargin*2 - this.goodsMargin)/2+'px'}
            }
            else if(this.listStyle==6){
                this.goodMargin = {marginLeft:this.goodsMargin+'px'};
            }
            this.goodsStyle = this.currentComponentData.data.goodsStyle;
            this.goodsChamfer = this.currentComponentData.data.goodsChamfer;
            this.goodsRatio = this.currentComponentData.data.goodsRatio;
            this.goodsFill = this.currentComponentData.data.goodsFill;
            this.textStyle = this.currentComponentData.data.textStyle;
            this.textAlign = this.currentComponentData.data.textAlign;
            this.showContents = this.currentComponentData.data.showContents;
            this.buttonStyle = this.currentComponentData.data.buttonStyle;
            this.hideSaledGoods = this.currentComponentData.data.hideSaledGoods;
            this.hideEndGoods = this.currentComponentData.data.hideEndGoods;
            this.hideType = this.currentComponentData.data.hideType;
        },

         //根据ids拉取数据
        fetch(componentData = this.currentComponentData.data) {
            if(componentData) {
                if(Array.isArray(componentData.ids) && componentData.ids.length){
                    this.loading = true;
                    this._apis.shop.getDiscountPackageListByIds({
                        ids: componentData.ids.join(',')
                    }).then((response)=>{
                        this.createList(response);
                        this.loading = false;
                    }).catch((error)=>{
                        console.error(error);
                        this.displayList = [];
                        this.loading = false;
                    });
                }else{
                    this.displayList = [];
                }
            }
        },

        /* 创建数据 */
        createList(datas) {
            this.displayList = datas;
            this.allLoaded = true;
        },

        /* 检查真数据 */
        checkRealData(newValue) {
            this.hasRealData = !!newValue.length;
            this.upadteComponentData();
        },

        /* 检查假数据 */
        checkFakeData(newValue) {
            this.hasFakeData = false;
            for(let item of newValue) {
                if(item && item.length) {
                    this.hasFakeData = true;
                    break;
                }
            }
            this.upadteComponentData();
        }

    }
}
</script>
<style lang="scss" scoped>
.componentDiscountPackage.listStyle1{
    li{
        &:first-child{
            margin-top:0 !important;
        }
        .countdown_Bar{
            display:flex;
            justify-content: space-between;
            .countdown{
                float:right;
                width:189px;
                height:43px;
                padding:0 3.5px 0 15px;
                .content{
                    .caption{
                        color:#333;
                        font-size:11px;
                        line-height:1;
                        margin-top:6px;
                        text-align:center;
                    }
                    .time{
                        margin-top:5.5px;
                        height:16px;
                        font-size:14px;
                        color:#333;
                        line-height:16px;
                        font{
                            background:#333;
                            width:29px;
                            height:16px;
                            color:#fff;
                            margin:0 4px;
                        }
                        .item {
                            background:#333;
                                min-width:29px;
                                height:16px;
                                color:#fff;
                                margin:0 4px;
                        }
                    }
                }
            }
        }
        .info_box{
            padding:15px 10px;
            .name{
                height:22px;
                font-size:16px;
                line-height:22px;
                @extend .ellipsis;
                .label{  
                    background:#FFF0C9;
                    border:1px solid #FFAA4E;
                    padding:0 6px;
                    line-height:19px;
                    display:inline-block;
                    color:#FC3D42;
                    font-size:11px;
                    @include borderRadius(4px);
                    position:relative;
                    top:-1.5px;
                    margin-right:7.5px;
                }
            }
            .button{
                right:10px;
                bottom:15px;
                font-size:13px;
                height:31px;
            }
            .activity_end{
                right:10px;
                bottom:15px;
                line-height:31px;
                font-size:18px;
            }
        }
    }
}
.componentDiscountPackage.listStyle2{
    ul{
        overflow:hidden;
        display:flex;
        display:-webkit-flex;
        justify-content:space-between;
        flex-wrap:wrap;
        li{
            &:nth-of-type(1){
                margin-top:0 !important;
            }
            &:nth-of-type(2){
                margin-top:0 !important;
            }
            .countdown_Bar{
                height:31px;
                margin-top:-31px;
                position:relative;
                .title{
                    display:none;
                }
                .countdown{
                    width:100%;
                    height:100%;
                    .bj{
                        display:none;
                    }
                    .content{
                        // @extend .flexCenterMiddle;
                        display:flex;
                        align-items:center;
                        padding:0 10px;
                        .caption{
                            color:#fff;
                            font-size:10px;
                            line-height:31px;
                            margin:0;
                        }
                        .time{
                            margin-left:7.5px;
                            height:16px;
                            color:#fff;
                            font{
                                width:16px;
                                height:16px;
                                color:#FC3D42;
                                font-size:9px;
                                line-height:16px;
                                background:#fff;
                                position:relative;
                                top:-2.5px;
                                margin:0 2px;
                                text-align:center;
                            }
                            .item {
                                background:#333;
                                min-width:29px;
                                height:16px;
                                color:#fff;
                                margin:0 4px;
                            }
                        }
                    }
                }
            }
            .info_box{
                padding:3px 10px 9px 10px;
                .name{
                    .label{  
                        background:#FFF0C9;
                        border:1px solid #FFAA4E;
                        padding:0 6px;
                        line-height:15px;
                        display:inline-block;
                        color:#FC3D42;
                        font-size:10px;
                        @include borderRadius(4px);
                        position:relative;
                        top:-1.5px;
                        margin-right:7.5px;
                    }
                    line-height:22px;
                    height:44px;
                    font-size:14px;
                    @include lineClamp(2);
                }
                .caption{
                    display:none;
                }
                .limit_line{
                    display:none;
                }
                .price_line{
                    margin-top:5px;
                    position:relative;
                    .price{
                        line-height:25px;
                    }
                    .yPrice{
                        width:100%;
                        margin-left:0;
                        line-height:1;
                    }
                }
                .button{
                    height:24px;
                    // position:absolute;
                    right:10px;
                    bottom:12.5px;
                }
                .activity_end{
                    right:10px;
                    bottom:17.5px;
                    line-height:24px;
                    font-size:15px;
                }
            }
        }
    }
}
.componentDiscountPackage.listStyle3{
    ul{
        display:flex;
        display:-webkit-flex;
        flex-wrap:wrap;
        li{
            &:nth-of-type(3n+1){
                margin-left:0 !important;
            }
            &:nth-of-type(1){
                margin-top:0 !important;
            }
            &:nth-of-type(2){
                margin-top:0 !important;
            }
            &:nth-of-type(3){
                margin-top:0 !important;
            }
            .countdown_Bar{
                display:none;
            }
            .info_box{
                padding:6px 6px 8px 6px;
                .name{
                    font-size:13px;
                    line-height:18px;
                    height:36px;
                    @include lineClamp(2);
                    .label{
                        display:none;
                    }
                }
                .caption{
                    display:none;
                }
                .limit_line{
                    display:none;
                }
                .price_line{
                    margin-top:5px;
                    .price{
                        line-height:25px;
                    }
                    .yPrice{
                        width:100%;
                        margin:0;
                        margin-left:0;
                        line-height:1;
                        font-size:10px;
                    }
                }
                .button{
                    display:none;
                }
                .activity_end{
                    right:5px;
                    bottom:15px;
                    line-height:1;
                    font-size:9px;
                    display: none;
                }
            }
        }
    }
}
.componentDiscountPackage.listStyle4{
    li{
        padding:10px 12.5px;
        position:relative;
        &:first-child{
            margin-top:0 !important;
        }
        .img_box{
            float:left;
            margin-right:10px;
            width:36%;
        }
        &.fakeData{
            padding: 0;
            .img_box{
                width:100%;
                img{
                    object-fit: initial!important;
                }
            }
        }
        .countdown_Bar{
            width:33%;
            height:25px;
            position:absolute;
            left:12.5px;
            bottom:10px;
            .title{
                display:none;
            }
            .countdown{
                width:100%;
                height:100%;
                padding:0 1px;
                .bj{
                    display:none;
                }
                .content{
                    @extend .flexCenterMiddle;
                    .caption{
                        float:left;
                        color:#fff;
                        font-size:8px;
                        line-height:25px;
                        margin:0;
                    }
                    .time{
                        float:left;
                        height:12px;
                        color:#fff;
                        line-height:12px;
                        font-size:9px;
                        margin-left:2px;
                        font{
                            min-width:12px;
                            height:12px;
                            color:#FC3D42;
                            font-size:9px;
                            line-height:12px;
                            background:#fff;
                            position:relative;
                            margin:0 2px;
                            text-align:center;
                        }
                        .item {
                            background:#333;
                                min-width:29px;
                                height:16px;
                                color:#fff;
                                margin:0 4px;
                        }
                    }
                }
            }
        }
        .info_box{
            padding:0;
            .name{
                font-size:14px;
                height:44px;
                line-height:22px;
                @include lineClamp(2);
                .label{  
                    background:#FFF0C9;
                    border:1px solid #FFAA4E;
                    padding:0 8px;
                    line-height:16px;
                    display:inline-block;
                    color:#FC3D42;
                    font-size:10px;
                    @include borderRadius(4px);
                    position:relative;
                    top:-1.5px;
                    margin-right:7.5px;
                }
            }
            .price_line{
                margin-top:15px;
                .price{
                    line-height:1;
                }
                .yPrice{
                    line-height:1;
                    margin-top:4px;
                }
            }
            .button{
                height:25px;
                right:0;
                bottom:0;
                font-size:10px;
            }
            .activity_end{
                right:0;
                bottom:1.5px;;
                font-size:15px;
                line-height:1;
            }
        }
    }
    li.goodsRatio1{
        .img_box{
            padding-bottom:24%;
        }
        .info_box{
            .name{
                @include lineClamp(1);
                height:22px;
            }
            .caption{
                margin-top:2.5px;
            }
            .limit_line{
                margin-top:2.5px;
            }
            .price_line{
                margin-top:2.5px;
            }
        }
    }
    li.goodsRatio2{
        .img_box{
            padding-bottom:36%;
        }
        .info_box{
            .caption{
                margin-top:7.5px;
            }
            .limit_line{
                margin-top:7.5px;
            }
            .price_line{
                margin-top:12.5px;
            }
        }
    }
    li.goodsRatio3{
        .img_box{
            padding-bottom:48%;
        }
        .info_box{
            .price_line{
                margin-top:42.5px;
            }
        }
    }
    li.goodsRatio4{
        .img_box{
            padding-bottom:20.25%;
        }
        .info_box{
            .name{
                @include lineClamp(1);
                height:19px;
                line-height:19px;
            }
            .caption{
                height:13px;
                margin-top:0;
            }
            .limit_line{
                margin-top:0;
            }
            .price_line{
                margin-top:0;
            }
            .button{
                height:22px;
                line-height:22px;
                font-size:10px;
            }
        }
    }  
}
.componentDiscountPackage.listStyle5{
    ul{
        display:flex;
        display:-webkit-flex;
        justify-content:space-between;
        flex-wrap:wrap;
        li{
            &:nth-of-type(1){
                margin-top:0 !important;
            }
            &:nth-of-type(3n+1){
                width:100% !important;
                .img_box{
                    @include borderRadius(10px 10px 0 0);
                }
                .countdown_Bar{
                    display:flex;
                    justify-content: space-between;
                    .countdown{
                        float:right;
                        width:189px;
                        height:43px;
                        padding:0 3.5px 0 15px;
                        .content{
                            .caption{
                                color:#333;
                                font-size:11px;
                                line-height:1;
                                margin-top:6px;
                                text-align:center;
                            }
                            .time{
                                margin-top:5.5px;
                                height:16px;
                                font-size:14px;
                                color:#333;
                                line-height:16px;
                                font{
                                    background:#333;
                                    width:29px;
                                    height:16px;
                                    color:#fff;
                                    margin:0 4px;
                                }
                                .item {
                                    background:#333;
                                min-width:29px;
                                height:16px;
                                color:#fff;
                                margin:0 4px;
                                }
                            }
                        }
                    }
                }
                .info_box{
                    padding:15px 10px;
                    .name{
                        height:22px;
                        font-size:16px;
                        line-height:22px;
                        @extend .ellipsis;
                        .label{  
                            background:#FFF0C9;
                            border:1px solid #FFAA4E;
                            padding:0 6px;
                            line-height:19px;
                            display:inline-block;
                            color:#FC3D42;
                            font-size:11px;
                            @include borderRadius(4px);
                            position:relative;
                            top:-1.5px;
                            margin-right:7.5px;
                        }
                    }
                    .button{
                        right:10px;
                        bottom:15px;
                        font-size:13px;
                        height:31px;
                    }
                    .activity_end{
                        right:10px;
                        bottom:15px;
                        line-height:31px;
                        font-size:18px;
                    }
                }
            }
            &:nth-of-type(3n+2),&:nth-of-type(3n+3){
                .countdown_Bar{
                    height:31px;
                    margin-top:-31px;
                    position:relative;
                    .title{
                        display:none;
                    }
                    .countdown{
                        width:100%;
                        height:100%;
                        .bj{
                            display:none;
                        }
                        .content{
                            // @extend .flexCenterMiddle;
                            display:flex;
                            align-items:center;
                            padding:0 10px;
                            .caption{
                                color:#fff;
                                font-size:10px;
                                line-height:31px;
                                margin:0;
                            }
                            .time{
                                margin-left:7.5px;
                                height:16px;
                                color:#fff;
                                font{
                                    width:16px;
                                    height:16px;
                                    color:#FC3D42;
                                    font-size:9px;
                                    line-height:16px;
                                    background:#fff;
                                    position:relative;
                                    top:-2.5px;
                                    margin:0 2px;
                                    text-align:center;
                                }
                                .item {
                                    background:#333;
                                min-width:29px;
                                height:16px;
                                color:#fff;
                                margin:0 4px;
                                }
                            }
                        }
                    }
                }
                .info_box{
                    padding:3px 10px 9px 10px;
                    .name{
                        .label{  
                            background:#FFF0C9;
                            border:1px solid #FFAA4E;
                            padding:0 6px;
                            line-height:15px;
                            display:inline-block;
                            color:#FC3D42;
                            font-size:10px;
                            @include borderRadius(4px);
                            position:relative;
                            top:-1.5px;
                            margin-right:7.5px;
                        }
                        line-height:22px;
                        height:44px;
                        font-size:14px;
                        @include lineClamp(2);
                    }
                    .caption{
                        display:none;
                    }
                    .limit_line{
                        display:none;
                    }
                    .price_line{
                        margin-top:5px;
                        position:relative;
                        .price{
                            line-height:25px;
                        }
                        .yPrice{
                            width:100%;
                            margin-left:0;
                            line-height:1;
                        }
                    }
                    .button{
                        height:24px;
                        position:absolute;
                        right:10px;
                        bottom:12.5px;
                    }
                    .activity_end{
                        right:10px;
                        bottom:17.5px;
                        line-height:1;
                        font-size:15px;
                    }
                }
            }
        }
    }
}
.componentDiscountPackage.listStyle6{
    background:#fff;
    ul{
        display:flex;
        display:-webkit-flex;
        overflow-x:scroll;
        li{
            flex:0 0 100px;
            &:first-child{
                margin-left:0 !important;
            }
            .countdown_Bar{
                display:none;
            }
            .info_box{
                padding:8px 5px 7px 5px;
                .name{
                    font-size:13px;
                    line-height:18px;
                    height:36px;
                    @include lineClamp(2);
                    .label{
                        display:none;
                    }
                }
                .caption{
                    display:none;
                }
                .limit_line{
                    display:none;
                }
                .price_line{
                    margin-top:5px;
                    .price{
                        line-height:25px;
                    }
                    .yPrice{
                        width:100%;
                        margin:0;
                        margin-left:0;
                        line-height:1;
                        font-size:10px;
                    }
                }
                .button{
                    display:none;
                }
                .activity_end{
                    right:5px;
                    bottom:15px;
                    line-height:1;
                    font-size:9px;
                    display: none;
                }
            }
        }
    }
}
// 公共
.componentDiscountPackage{
    overflow:hidden;
    li{
        overflow:hidden;
        background:#fff;
        box-sizing:border-box;
        &:first-child{
            margin-top:0;
        }
        .img_box{
            position:relative;
            overflow:hidden;
            .label{
                height:19px;
                line-height:19px;
                color:#fff;
                padding:0 10px;
                background:#FC3F42;
                position:absolute;
                left:0;
                top:0;
                font-size:11px;
                @include borderRadius(8px 0 8px 0);
                z-index:1;
            }
            img{
                width:100%;
                height:100%;
                left:0;
                top:0;
                position:absolute;
                object-fit:cover;
            }
            img.goodsFill{
                object-fit:contain;
            }
        }
        .countdown_Bar{
            height:43px;
            background:linear-gradient(90deg,rgba(252,61,66,1) 0%,rgba(252,106,61,1) 100%);
            overflow:hidden;
            .title{
                float:left;
                line-height:43px;
                color:#fff;
                font-size:21px;
                margin-left:13.5px;
            }
            .countdown{
                position:relative;
                .bj{
                    width:100%;
                    height:100%;
                    position:absolute;
                    right:0;
                    top:0;
                }
                .content{
                    position:relative;
                    z-index:1;
                    overflow:hidden;
                    .caption{
                       
                    }
                    .time{
                        overflow:hidden;
                        text-align:center;
                        font{
                            display:inline-block;
                            @include borderRadius(2px);
                        }
                        .item {
                            background:#333;
                                min-width:29px;
                                height:16px;
                                color:#fff;
                                margin:0 4px;
                        }
                    }
                }
            }
        }
        .info_box{
            overflow:hidden;
            position:relative;
            .name{
                line-height:18px;
                font-size:15px;
                color:#333;
                .label{
                    font-weight:normal;
                }
            }
            .name.textStyle{
                font-weight:bold;
            }
            .name.textAlign{
                text-align:center;
            }
            .caption{
                margin-top:10px;
                line-height:14px;
                font-size:12px;
                color:#7c7c7c;
                @extend .ellipsis;
            }
            .caption.textStyle{
                font-weight:bold;
            }
            .caption.textAlign{
                text-align:center;
            }
            .limit_line{
                margin-top:15px;
                overflow:hidden;
                .limit{
                    float:left;
                    font-size:13px;
                    color:#333;
                    margin-right:5px;
                    line-height:18px;
		    height: 18px;								
                }
                .remainder{
                    float:left;
                    line-height:18px;
                    color:#999;
                    font-size:11px;
                }
            }
            .price_line{
                margin-top:14px;
                overflow:hidden;
                .price{
                    line-height:31px;
                    float:left;
                    color:#FC3D42;
                    font-size:14px;
                    font{
                        font-size:18px;
                    }
                }
                .yPrice{
                    line-height:31px;
                    float:left;
                    margin-left:12px;
                    color:#7c7c7c;
                    font-size:12px;
                    text-decoration:line-through;
                }
            }
            .button{
                // position:absolute;
                float: right;
                right:10px;
                bottom:15px;
                font-size:13px;
                height:31px;
            }
            .activity_end{
                color:#999;
                font-weight:bold;
                // position:absolute;
                float: right;
            }
        }
    }
    li.goodsStyle1{
        border:0;
        background:#fff;
    }
    li.goodsStyle2{
        background:#fff;
        box-shadow:0px 1px 3px 0px rgba(154,154,154,0.19);
    }
    li.goodsStyle3{
        border:1px solid #eee;
        background:#fff;
    }
    li.goodsStyle4{
        border:0;
        background:none;
    }
    li.goodsChamfer{
        @include borderRadius(8px);
    }
    li.goodsRatio1{
        .img_box{
            padding-bottom:66.66%;
        }
    }
    li.goodsRatio2{
        .img_box{
            padding-bottom:100%;
        }
    }
    li.goodsRatio3{
        .img_box{
            padding-bottom:133.33%;
        }
    }
    li.goodsRatio4{
        .img_box{
            padding-bottom:56.25%;
        }
    }
}
</style>
