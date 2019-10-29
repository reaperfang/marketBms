<template>
<!-- 组件-多人拼团 -->
    <div class="componentMultiPerson" :style="[{padding:pageMargin+'px'}]" :class="'listStyle'+listStyle" v-if="currentComponentData && currentComponentData.data" v-loading="loading">
        <ul>
            <template  v-for="(item,key) of list">
                <li :key="key" v-if="item.status !== 2" :style="[goodMargin,goodWidth]" :class="['goodsStyle'+goodsStyle,{goodsChamfer:goodsChamfer!=1},'goodsRatio'+goodsRatio]">
                    <div class="img_box">
                        <p class="label" v-if="showContents.indexOf('6')!=-1">{{item.sold > -1 ? item.sold : 0}}人已团</p>
                        <img :src="item.image" alt="" :class="{goodsFill:goodsFill!=1}">
                    </div>
                    <div class="countdown_Bar" v-if="showContents.indexOf('5')!=-1">
                        <h1 class="title">{{item.activeName || '多人拼团'}}</h1>
                        <div class="countdown">
                            <img src="@/assets/images/shop/activityCountdownBj.png" alt="" class="bj">
                            <div class="content">
                                <p class="caption">{{item.status==0?'距开始仅剩':'距结束仅剩'}}</p>
                                <p class="time"><font>23</font>:<font>56</font>:<font>48</font></p>
                                <!-- <p class="time">{{item.endTime}}</p> -->
                            </div>
                        </div>
                    </div>
                    <div class="info_box"  v-if="showContents.length > 0">
                        <p class="name" :class="[{textStyle:textStyle!=1},{textAlign:textAlign!=1}]" v-if="showContents.indexOf('1')!=-1"><font class="label">{{item.teamPeople}}人团</font>{{item.goodName}}</p>
                        <p class="caption" :class="[{textStyle:textStyle!=1},{textAlign:textAlign!=1}]" v-if="showContents.indexOf('2')!=-1">{{item.goodDes}}</p>
                        <div class="limit_line">
                            <div class="label">{{item.peopleNum}}人团</div>
                            <p class="limit" v-if="showContents.indexOf('7')!=-1">
                                <template v-if="item.buyLimit >= 0">
                                    限 {{item.buyLimit}}件/人
                                </template>
                                <template v-else>不限制</template>
                            </p>
                        </div>
                        <div class="price_line">
                            <p class="price" v-if="showContents.indexOf('3')!=-1">￥<font>{{item.reductionUnitPrice}}</font></p>
                            <p class="yPrice" v-if="showContents.indexOf('4')!=-1">￥{{item.unitPrice}}</p>
                        </div>
                        <componentButton :decorationStyle="buttonStyle" :decorationText="currentComponentData.data.buttonTextPrimary" v-if="showContents.indexOf('8')!=-1&&item.soldOut!=1 && listStyle != 3 && listStyle != 6" class="kai"></componentButton>
                        <componentButton :decorationStyle="buttonStyle" :decorationText="currentComponentData.data.buttonText" v-if="showContents.indexOf('8')!=-1&&item.soldOut!=1 && listStyle != 3 && listStyle != 6" class="pin"></componentButton>
                        <p class="activity_end" v-if="item.soldOut==1">已售罄</p>
                    </div>
                </li>
            </template>
        </ul>
    </div>

</template>
<script>
import componentButton from './componentButton';
import componentMixin from '../mixins/mixinComps';
export default {
    name:"componentMultiPerson",
    mixins:[componentMixin],
    data(){
        return{
            // 样式属性
            showNumber: "",
            showAllBtns: true,
            sortRule: "",
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
            hideSaledGoods: '',
            buttonStyle:'',
            // 自己定义的
            goodWidth:'',
            goodMargin:'',
            list: [],
            loading: false
        }
    },
    created() {
        this.fetch();
        this._globalEvent.$on('fetchMultiPerson', (componentData, componentId) => {
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
        },
        'currentComponentData.data.addType'(newValue) {
            if(newValue == 2) {
                this.fetch();
            }else{
                this.list = [];
                this.fetch();
            }
        },
        'currentComponentData.data.showNumber'(newValue) {
            this.fetch();
        },
        'currentComponentData.data.sortRule'(newValue) {
            this.fetch();
        },
    },
    components:{
        componentButton
    },
    methods:{
        decoration(){
            if(!this.currentComponentData || !this.currentComponentData.data) {
              return;
            }
            this.showNumber = this.currentComponentData.data.showNumber;
            this.showAllBtns = this.currentComponentData.data.showAllBtns;
            this.sortRule = this.currentComponentData.data.sortRule;
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
            this.hideSaledGoods = this.currentComponentData.data.hideSaledGoods;
            this.buttonStyle = this.currentComponentData.data.buttonStyle;
        },

        //根据ids拉取数据
        fetch(componentData = this.currentComponentData.data) {
            if(componentData) {
                let params = {};
                if(componentData.addType == 2) {
                    params = {
                        num: componentData.showNumber,
                        order: componentData.sortRule
                    };
                }else{
                    const ids = componentData.ids;
                    if(Array.isArray(ids) && ids.length){
                        params = {
                            spuIds: ids.join(','),
                            order: componentData.sortRule
                        };
                    }else{
                        this.list = [];
                        return;
                    }
                }

                this.loading = true;
                this._apis.shop.getMultiPersonListByIds(params).then((response)=>{
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
            }
        },

        /* 创建数据 */
        createList(datas) {
            if(datas.length > this.showNumber){
                datas = datas.slice(0,this.showNumber);
            }
            this.list = [];
            if(this.hideSaledGoods==true){
                var goods = datas;
                for(var i in datas){
                    if(goods[i].soldOut!=1){
                        this.list.push(datas[i]);
                    }
                }
            }
            else{
                this.list = datas;
            }
        }

    },
    beforeDestroy() {
        //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
        this._globalEvent.$off('fetchMultiPerson');
    },
}
</script>
<style lang="scss" scoped>
.componentMultiPerson.listStyle1{
    li{
        &:first-child{
            margin-top:0 !important;
        }
        .countdown_Bar{
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
                    }
                }
            }
        }
        .info_box{
            padding:15px 10px;
            .name{
                height:18px;
                @extend .ellipsis;
                .label{  
                    display:none;
                }
            }
            .kai{
                line-height:31px;
                position:absolute;
                right:10px;
                bottom:15px;
                font-size:13px;
                width:84px;
                height:31px;
            }
            .pin{
                line-height:30px;
                height:31px;
                right:102.5px;
                bottom:15px;
                width:84px;
                position:absolute;
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
.componentMultiPerson.listStyle2{
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
                .kai{
                    width:68px;
                    height:24px;
                    line-height:24px;
                    text-align:center;
                    position:absolute;
                    right:10px;
                    bottom:12.5px;
                }
                .pin{
                    display:none;
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
.componentMultiPerson.listStyle3{
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
                .kai{
                    display:none;
                }
                .pin{
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
.componentMultiPerson.listStyle4{
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
                            width:12px;
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
            .limit_line{
                display:none;
            }
            .price_line{
                margin-top:49px;
                .price{
                    line-height:1;
                }
                .yPrice{
                    line-height:1;
                    margin-top:4px;
                }
            }
            .kai{
                width:50px;
                height:31px;
                right:0;
                bottom:0;
                position:absolute;
            }
            .pin{
                display:none;
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
            .price_line{
                margin-top:12.5px;
            }
        }
    }
    li.goodsRatio2{
        .img_box{
            padding-bottom:36%;
        }
        .info_box{
            .price_line{
                margin-top:27px;
            }
        }
    }
    li.goodsRatio3{
        .img_box{
            padding-bottom:48%;
        }
        .info_box{
            .price_line{
                margin-top:62.5px;
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
                height:22px;
            }
            .price_line{
                margin-top:2px;
            }
        }
    }  
}
.componentMultiPerson.listStyle5{
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
                    position:relative;
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
                    }
                    img{
                        width:100%;
                        height:100%;
                    }
                }
                .countdown_Bar{
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
                            }
                        }
                    }
                }
                .info_box{
                    overflow:hidden;
                    position:relative;
                    padding:15px 10px;
                    .name{
                        line-height:18px;
                        height:18px;
                        @extend .ellipsis;
                        font-size:15px;
                        color:#333;
                        .label{
                            display:none;
                        }
                    }
                    .caption{
                        margin-top:6.5px;
                        line-height:14px;
                        font-size:12px;
                        color:#7c7c7c;
                    }
                    .limit_line{
                        margin-top:8.5px;
                        overflow:hidden;
                        .label{
                            width:44px;
                            height:19px;
                            border:1px solid #ffaa4e;
                            background:#FFF0C9;
                            @include borderRadius(4px);
                            text-align:center;
                            line-height:18px;
                            color:#FC3D42;
                            font-size:11px;
                            float:left;
                            margin-right:15px;
                        }
                        .limit{
                            float:left;
                            font-size:11px;
                            color:#7c7c7c;
                            margin-right:15px;
                            line-height:19px;
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
                        .activity_end{
                            line-height:31px;
                            color:#999;
                            font-size:18px;
                            float:right;
                            font-weight:bold;
                        }
                    }
                    .kai{
                        line-height:31px;
                        position:absolute;
                        right:10px;
                        bottom:15px;
                        font-size:13px;
                        width:84px;
                        height:31px;
                    }
                    .pin{
                        line-height:30px;
                        height:31px;
                        right:102.5px;
                        bottom:15px;
                        width:84px;
                        position:absolute;
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
                    .kai{
                        width:68px;
                        height:24px;
                        line-height:24px;
                        text-align:center;
                        position:absolute;
                        right:10px;
                        bottom:12.5px;
                    }
                    .pin{
                        display:none;
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
                    .kai{
                        width:68px;
                        height:24px;
                        line-height:24px;
                        text-align:center;
                        position:absolute;
                        right:10px;
                        bottom:12.5px;
                    }
                    .pin{
                        display:none;
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
.componentMultiPerson.listStyle6{
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
                .componentButton{
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
.componentMultiPerson{
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
                margin-top:6.5px;
                line-height:14px;
                font-size:12px;
                color:#7c7c7c;
            }
            .caption.textStyle{
                font-weight:bold;
            }
            .caption.textAlign{
                text-align:center;
            }
            .limit_line{
                margin-top:8.5px;
                overflow:hidden;
                .label{
                    width:44px;
                    height:19px;
                    border:1px solid #ffaa4e;
                    background:#FFF0C9;
                    @include borderRadius(4px);
                    text-align:center;
                    line-height:18px;
                    color:#FC3D42;
                    font-size:11px;
                    float:left;
                    margin-right:15px;
                }
                .limit{
                    float:left;
                    font-size:11px;
                    color:#7c7c7c;
                    margin-right:15px;
                    line-height:19px;
                }
            }
            .price_line{
                margin-top:19px;
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
            .kai{
                line-height:31px;
                position:absolute;
                right:10px;
                bottom:15px;
                font-size:13px;
                width:84px;
                height:31px;
            }
            .pin{
                line-height:30px;
                height:31px;
                right:102.5px;
                bottom:15px;
                width:84px;
                position:absolute;
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
