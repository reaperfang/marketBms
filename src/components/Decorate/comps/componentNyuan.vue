<template>
<!-- 组件-优惠套装 -->
    <div class="componentNyuan" :style="[{padding:pageMargin+'px'}]" :class="'listStyle'+listStyle" v-if="currentComponentData && currentComponentData.data" v-loading="loading">
        <template v-if="hasContent">
            <ul>
                <li v-for="(item,key) of list" :key="key" :style="[goodMargin,goodWidth]" :class="['goodsStyle'+goodsStyle,{goodsChamfer:goodsChamfer!=1},'goodsRatio'+goodsRatio]">
                    <div class="img_box">
                        <div class="label" v-if="showContents.indexOf('6')!=-1">已售{{item.packageNum}}件</div>
                        <img :src="item.activityPic" alt="" :class="{goodsFill:goodsFill!=1}">
                    </div>
                    <div class="countdown_Bar" v-if="showContents.indexOf('3')!=-1">
                        <h1 class="title">N元N件</h1>
                        <div class="countdown">
                            <img src="@/assets/images/shop/activityCountdownBj.png" alt="" class="bj">
                            <div class="content">
                                <p class="caption">{{item.status==0?'距开始':'距结束'}}</p>
                                <p class="time"><font>23</font>:<font>56</font>:<font>48</font></p>
                                <!-- <p class="time">{{item.endTime}}</p> -->
                            </div>
                        </div>
                    </div>
                    <div class="info_box" v-if="showContents.length > 0">
                        <p class="name" :class="[{textStyle:textStyle!=1},{textAlign:textAlign!=1}]" v-if="showContents.indexOf('1')!=-1">{{item.name}}</p>
                        <p class="caption" :class="[{textStyle:textStyle!=1},{textAlign:textAlign!=1}]" v-if="showContents.indexOf('5')!=-1">{{item.setMealPrice}}元任选{{item.goodsTotalNumber}}件商品</p>
                        <div class="limit_line">
                            <p class="limit" v-if="showContents.indexOf('4')!=-1">
                                <template v-if="item.joinLimit >= 0">
                                    限 {{item.joinLimit}}次/人
                                </template>
                                <template v-else>不限制</template>
                            </p>
                        </div>
                        <div class="price_line">
                            <p class="price" v-if="showContents.indexOf('2')!=-1">￥<font>{{item.setMealPrice}}</font></p>
                        </div>
                        <componentButton :decorationStyle="buttonStyle" :decorationText="currentComponentData.data.buttonText" class="button" v-if="showContents.indexOf('7')!=-1&&item.soldOut!=1&&item.activityEnd!=1 && listStyle != 3 && listStyle != 6"></componentButton>
                        <p class="activity_end" v-if="item.soldOut==1&&item.activityEnd!=1">已售罄</p>
                        <p class="activity_end" v-if="item.activityEnd==1">活动结束</p>
                    </div>
                </li>
            </ul>
        </template>
        <img v-else class="empty_data_img" src="../../../assets/images/shop/emptyData.png" alt="">
    </div>

</template>
<script>
import componentButton from './componentButton';
import componentMixin from '../mixins/mixinComps';
export default {
    name:"componentNyuan",
    mixins:[componentMixin],
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
            list: [],
            loading: false
        }
    },
    components:{
        componentButton
    },
    created() {
        this.fetch();
        this._globalEvent.$on('fetchNyuan', (componentData, componentId) => {
            if(this.currentComponentId === componentId) {
                this.fetch(componentData);
            }
        });
    },
    mounted() {
        this.decoration();
    },
    watch: {
      currentComponentData(){
        this.decoration();
      }
    },
    computed: {
         /* 检测是否有数据 */
        hasContent() {
            let value = false;
            if(this.list && this.list.length) {
                value = true;
            }
            return value;
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
            var bodyWidth = 370;
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
                const ids = componentData.ids;
                if(Array.isArray(ids) && ids.length){
                    this.loading = true;
                    this._apis.shop.getNyuanListByIds({
                        baleIds : ids.join(',')
                    }).then((response)=>{
                        this.createList(response);
                        this.loading = false;
                    }).catch((error)=>{
                        // this.$notify.error({
                        //     title: '错误',
                        //     message: error
                        // });
                        console.error(error);
                        this.list = [];
                        this.loading = false;
                    });
                }else{
                    this.list = [];
                }
            }
        },

        /* 创建数据 */
        createList(datas) {
            this.list = [];
            if(this.hideSaledGoods==true){
                for(var i in datas){
                    if(datas[i].soldOut!=1){
                        this.list.push(datas[i]);
                    }
                }
            }
            else{
                this.list = datas;
            }
            var list = this.list;
            this.list = [];
            if(this.hideEndGoods==true){
                for(var i in list){
                    if(list[i].activityEnd!=1){
                        this.list.push(list[i]);
                    }
                }
            }
            else{
                this.list = list;
            }

            this.allLoaded = true;
        },

    },
    beforeDestroy() {
        //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
        this._globalEvent.$off('fetchNyuan');
    },
}
</script>
<style lang="scss" scoped>
.componentNyuan.listStyle1{
    li{
        &:first-child{
            margin-top:0 !important;
        }
        .countdown_Bar{
            display:flex;
            justify-content: space-between;
            .countdown{
                float:right;
                width:155px;
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
            .activity_end{
                right:10px;
                bottom:15px;
                line-height:31px;
                font-size:18px;
            }
        }
    }
}
.componentNyuan.listStyle2{
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
                        @extend .flexCenterMiddle;
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
.componentNyuan.listStyle3{
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
                }
            }
        }
    }
}
.componentNyuan.listStyle4{
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
                margin-top:60px;
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
                bottom:1.5px;
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
                margin-top:5px;
            }
            .limit_line{
                margin-top:5px;
            }
            .price_line{
                margin-top:10px;
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
                font-size:10px;
            }
        }
    }  
}
.componentNyuan.listStyle5{
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
                .countdown_Bar{
                    display:flex;
                    justify-content: space-between;
                    .countdown{
                        float:right;
                        width:155px;
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
                    .activity_end{
                        right:10px;
                        bottom:15px;
                        line-height:31px;
                        font-size:18px;
                    }
                }
            }
            &:nth-of-type(3n+2){
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
                            @extend .flexCenterMiddle;
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
            &:nth-of-type(3n+3){
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
                            @extend .flexCenterMiddle;
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
.componentNyuan.listStyle6{
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
                }
            }
        }
    }
}
// 公共
.componentNyuan{
    overflow:hidden;
    li{
        overflow:hidden;
        background:#fff;
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
                position:absolute;
                right:10px;
                bottom:15px;
                font-size:13px;
                height:31px;
            }
            .activity_end{
                color:#999;
                font-weight:bold;
                position:absolute;
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

