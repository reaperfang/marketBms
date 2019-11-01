<template>
<!-- 组件-商品列表 -->
<div class="componentGoods" :class="'listStyle'+listStyle" :style="{padding:pageMargin+'px'}" v-if="currentComponentData && currentComponentData.data" v-loading="loading">
    <!-- <van-list v-model="goodListLoading" :finished="goodListFinished" finished-text="没有更多了" @load="goodListLoad" > -->
        <ul v-if="list && list.length">
            <li v-for="(item,key) in list" :key="key" :style="[goodMargin,goodWidth]" :class="['goodsStyle'+goodsStyle,{goodsChamfer:goodsChamfer!=1},'goodsRatio'+goodsRatio]">
                <div class="img" >
                    <div class="imgAbsolute">
                        <img :src="item.mainImage" alt="" :class="{goodsFill:goodsFill!=1}">
                    </div>
                </div>
                <div class="text" v-if="showContents.length>0">
                    <p class="title" :class="[{textStyle:textStyle!=1},{textAlign:textAlign!=1}]" v-if="showContents.indexOf('1')!=-1">{{item.name}}</p>
                    <p class="fTitle" :class="[{textStyle:textStyle!=1},{textAlign:textAlign!=1}]" v-if="showContents.indexOf('3')!=-1">{{item.description}}</p>
                    <div class="priceLine" v-if="showContents.indexOf('2')!=-1">
                        <p class="price">￥<font>{{item.goodsInfos[0].salePrice}}</font></p>
                    </div>
                    <componentButton :decorationStyle="buttonStyle" :decorationText="currentComponentData.data.buttonText" v-if="showContents.indexOf('4')!=-1 && listStyle != 3 && listStyle != 6" class="button"></componentButton>
                </div>
            </li>
        </ul>
        <div v-else>暂无数据</div>
    <!-- </van-list> -->
</div>
</template>
<script>
import componentButton from './componentButton';
import componentMixin from '../mixins/mixinComps';
import GOODS_LIST from '@/assets/json/goodsList.json'; 
import GOODS_LIST_PROD from '@/assets/json/goodsListProd.json'; 
export default {
    name:"componentGoods",
    mixins:[componentMixin],
    props: ['currentCatagoryId', 'origin'],
    data(){
        return{
            // 样式属性
            listStyle:'',
            pageMargin:'',
            goodsMargin:'',
            goodsStyle:'',
            goodsChamfer:'',
            goodsRatio:'',
            goodsFill:'',
            textStyle:'',
            textAlign:'',
            showContents:'',
            buttonStyle:'',
            showTemplate:'',

            // 自定义
            goodWidth:'',
            goodMargin:'',
            // 上拉加载
            goodListLoading: false,
            goodListFinished: false,
            list:  this.$route.path.indexOf('templateEdit') > -1 ? (process.env.NODE_ENV === 'production' ? GOODS_LIST_PROD : GOODS_LIST): [],
            loading: false
        }
    },
    components:{
        componentButton
    },
    created() {
        const _self = this;
        this._globalEvent.$on('goodsListOfGroupChange', (list, componentId)=>{
            if(this.currentComponentId === componentId) {
                this.list = list;
            }
        })
        this.fetch();
        this._globalEvent.$on('fetchGoods', (componentData, componentId) => {
            if(_self.currentComponentId === componentId) {
                _self.fetch(componentData);
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
        currentCatagoryId(newValue) {
            this.fetch();
        },
        'ruleForm.currentCatagoryId'() {
            this.fetch();
        },
    },
    methods:{
        decoration(){
            // 样式属性
            if(!this.currentComponentData || !this.currentComponentData.data) {
              return;
            }
            this.listStyle = this.currentComponentData.data.listStyle;
            this.pageMargin = this.currentComponentData.data.pageMargin;
            this.goodsMargin = this.currentComponentData.data.goodsMargin;
            var bodyWidth = 370;
            if(this.listStyle=='1'){
                this.goodMargin = {marginTop:this.goodsMargin + 'px'};
                this.goodWidth = "100%";
            }
            else if(this.listStyle=='2'){
                this.goodMargin = {marginTop:this.goodsMargin + 'px'};
                
                if('showTemplate' in this.currentComponentData.data){
                    this.showTemplate= this.currentComponentData.data.showTemplate;
                    if(this.showTemplate!=1){
                        this.goodWidth = {width:(bodyWidth - this.pageMargin * 2 - this.goodsMargin - 100) / 2 + 'px'}
                    }
                    else{
                        this.goodWidth = {width:(bodyWidth - this.pageMargin * 2 - this.goodsMargin) / 2 + 'px'}
                    }
                }
                else{
                    this.goodWidth = {width:(bodyWidth - this.pageMargin * 2 - this.goodsMargin) / 2 + 'px'}
                }
            }
            else if(this.listStyle=='3'){
                this.goodMargin = {marginTop:this.goodsMargin + 'px',marginLeft:this.goodsMargin + 'px'};
                if('showTemplate' in this.currentComponentData.data){
                    this.showTemplate= this.currentComponentData.data.showTemplate;
                    if(this.showTemplate!=1){
                        this.goodWidth = {width:(bodyWidth - this.pageMargin * 2 - this.goodsMargin*2 - 100) / 3 + 'px'}
                    }
                    else{
                        this.goodWidth = {width:(bodyWidth - this.pageMargin * 2 - this.goodsMargin*2) / 3 + 'px'}
                    }
                }
                else{
                    this.goodWidth = {width:(bodyWidth - this.pageMargin * 2 - this.goodsMargin*2) / 3 + 'px'}
                }
            }
            else if(this.listStyle=='4'){
                this.goodMargin = {marginTop:this.goodsMargin + 'px'};
                this.goodWidth = "100%";
            }
            else if(this.listStyle=='5'){
                this.goodMargin = {marginTop:this.goodsMargin + 'px'};
                var bodyWidth = 370;
                if('showTemplate' in this.currentComponentData.data){
                    this.showTemplate= this.currentComponentData.data.showTemplate;
                    if(this.showTemplate!=1){
                        this.goodWidth = {width:(bodyWidth - this.pageMargin * 2 - this.goodsMargin - 100) / 2 + 'px'}
                    }
                    else{
                        this.goodWidth = {width:(bodyWidth - this.pageMargin * 2 - this.goodsMargin) / 2 + 'px'}
                    }
                }
                else{
                    this.goodWidth = {width:(bodyWidth - this.pageMargin * 2 - this.goodsMargin) / 2 + 'px'}
                }
            }
            else if(this.listStyle=='6'){
                this.goodMargin = {marginLeft:this.goodsMargin + 'px'};
            }
            this.goodsStyle = this.currentComponentData.data.goodsStyle;
            this.goodsChamfer = this.currentComponentData.data.goodsChamfer;
            this.goodsRatio = this.currentComponentData.data.goodsRatio;
            this.goodsFill = this.currentComponentData.data.goodsFill;
            this.textStyle = this.currentComponentData.data.textStyle;
            this.textAlign = this.currentComponentData.data.textAlign;
            this.showContents = this.currentComponentData.data.showContents; 
            this.buttonStyle = this.currentComponentData.data.buttonStyle;
        },

        //根据ids拉取数据
        fetch(componentData = this.currentComponentData.data) {
            if(componentData) {
                let params = {};
                if(!componentData.source || (componentData.source === 1)) {
                    const ids = componentData.ids;
                    if(ids) {
                        if(Object.prototype.toString.call(ids) === '[object Object]') {
                            params = this.setGroupGoodsParams(ids);
                            if(!params.ids || !params.ids.length) {
                                this.list = [];
                                return;
                            }
                        }else if(Array.isArray(ids) && ids.length){
                            params = this.setNormalGoodsParams(ids);
                            if(!params.ids || !params.ids.length) {
                                this.list = [];
                                return;
                            }
                        }else{
                            if(this.$route.path.indexOf('templateEdit') < 0) {
                                this.list = [];
                            }
                            return;
                        }
                    }else{
                        if(this.$route.path.indexOf('templateEdit') < 0) {
                            this.list = [];
                        }
                        return;
                    }
                }else if(componentData.source === 2){
                    params = {
                        status: '1',
                        productCatalogInfoId: componentData.currentCatagoryId
                    };
                }

                this.loading = true;
                this._apis.goods.fetchAllSpuGoodsList(params).then((response)=>{
                    this.createList(response, componentData);
                    this.loading = false;
                }).catch((error)=>{
                    // this.$notify.error({
                    //     title: '错误',
                    //     message: error
                    // });
                    console.error(error);
                    if(this.$route.path.indexOf('templateEdit') < 0) {
                        this.list = [];
                    }
                    this.loading = false;
                });
            }
        },

        /* 创建数据 */
        createList(datas, componentData) {
            this.list = datas;
        },

         /* 设置分类商品参数 */
        setGroupGoodsParams(ids) {
            let params = {};
            if(this.currentCatagoryId === 'all') {
                const allIds = [];
                for(let k in ids) {
                    for(let item of ids[k]) {
                        allIds.push(item);
                    }
                }
                params = {
                    status: '1',
                    ids: allIds
                }
            }else{
                params = {
                    status: '1',
                    ids: ids[this.currentCatagoryId],
                    productCatalogInfoId: this.currentCatagoryId
                }
            }
            return params;
        },

        /* 设置普通商品参数 */
        setNormalGoodsParams(ids) {
            return {
                status: '1',
                ids: ids,
            }
        }

    },
    beforeDestroy() {
        //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
        this._globalEvent.$off('fetchGoods');
        this._globalEvent.$off('goodsListOfGroupChange');
    },
}
</script>

<style lang="scss" scoped>
// 商品列表
.componentGoods{
    padding:0 10px;
    overflow:hidden;
    ul{
        li{
            .img{
                background:#f6f6f6;
                position:relative;
                .imgAbsolute{
                    position:absolute;
                    top:0;
                    right:0;
                    bottom:0;
                    left:0;
                    @extend .flexCenterMiddle;
                    img{
                        width:100%;
                        height:100%;
                        object-fit: cover;
                    }
                    img.goodsFill{
                        object-fit: contain;
                    }
                }
            }
            .text{
                .title{
                    color:#333;
                }
                .fTitle{
                    color:#7C7C7C;
                }
                .title.textStyle{
                    font-weight:bold;
                }
                .fTitle.textStyle{
                    font-weight:bold;
                }
                .title.textAlign{
                    text-align:center;
                }
                .fTitle.textAlign{
                    text-align:center;
                }
                .priceLine{
                    .price{
                        color:#FC3D42;
                    }
                }
                .button{
                    position:absolute;
                    right:10px;
                    bottom:10px;
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
    }
    .van-list__finished-text{
        font-size:12px;
    }
    .van-list__placeholder{
        font-size:12px;
    }
}

.componentGoods.listStyle1{
    ul{
        li{
            overflow:hidden;
            &:first-child{
                margin-top:0 !important;
            }
            .img{
                padding-bottom:100%;
                height:0;
                position:relative;
                overflow:hidden;
            }
            .text{
                overflow:hidden;
                padding:10px;
                position:relative;
                .title{
                    font-size:13px;
                    line-height:16px;
                    height:32px;
                    @include lineClamp(2);
                }
                .fTitle{
                    font-size:12px;
                    line-height:15px;
                    height:15px;
                    margin-top:5px;
                    @extend .ellipsis;
                }
                .priceLine{
                    margin-top:12.5px;
                    overflow:hidden;
                    .price{
                        float:left;
                        font-size:11px;
                        margin-right:12.5px;
                        font{
                            font-size:16px;
                        }
                    }
                }
                .button{
                    right:10px;
                    bottom:10px;
                }
            }
        }  
        li.goodsRatio1{
            .img{
                padding-bottom:66.66%;
            }
        }
        li.goodsRatio2{
            .img{
                padding-bottom:100%;
            }
        }
        li.goodsRatio3{
            .img{
                padding-bottom:133.33%;
            }
        }
        li.goodsRatio4{
            .img{
                padding-bottom:56.25%;
            }
        }
    } 
}

.componentGoods.listStyle2{
    ul{
        display:flex;
        display:-webkit-flex;
        justify-content:space-between;
        flex-wrap:wrap;
        li{
            margin-top:15px;
            width:170px;
            overflow:hidden;
            &:nth-of-type(1){
                margin-top:0 !important;
            }
            &:nth-of-type(2){
                margin-top:0 !important;
            }
            .img{
                position:relative;
                overflow:hidden;
                padding-bottom:100%;
                height:0;
            }
            .text{
                overflow:hidden;
                padding:10px;
                position:relative;
                .title{
                    font-size:13px;
                    line-height:16px;
                    height:32px;
                    @include lineClamp(2);
                }
                .fTitle{
                    font-size:12px;
                    line-height:15px;
                    height:15px;
                    margin-top:5px;
                    @extend .ellipsis;
                }
                .priceLine{
                    margin-top:12.5px;
                    overflow:hidden;
                    .price{
                        float:left;
                        font-size:11px;
                        margin-right:12.5px;
                        font{
                            font-size:16px;
                        }
                    }
                }
                .button{
                    right:10px;
                    bottom:10px;
                }
            }
        }  
        li.goodsRatio1{
            .img{
                padding-bottom:66.66%;
            }
        }
        li.goodsRatio2{
            .img{
                padding-bottom:100%;
            }
        }
        li.goodsRatio3{
            .img{
                padding-bottom:133.33%;
            }
        }
        li.goodsRatio4{
            .img{
                padding-bottom:56.25%;
            }
        }
    } 
}
.componentGoods.listStyle3{
    ul{
        display:flex;
        display:-webkit-flex;
        flex-wrap:wrap;
        li{
            margin-top:15px;
            width:110px;
            overflow:hidden;
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
            .img{
                height:0;
                padding-bottom:100%;
                position:relative;
                overflow:hidden;
            }
            .text{
                overflow:hidden;
                padding:10px;
                position:relative;
                .title{
                    font-size:13px;
                    line-height:16px;
                    height:32px;
                    @include lineClamp(2);
                }
                .fTitle{
                    font-size:12px;
                    line-height:15px;
                    height:15px;
                    margin-top:5px;
                    @extend .ellipsis;
                }
                .priceLine{
                    margin-top:12.5px;
                    overflow:hidden;
                    .price{
                        float:left;
                        font-size:11px;
                        margin-right:12.5px;
                        font{
                            font-size:16px;
                        }
                    }
                }
                .button{
                    right:10px;
                    bottom:10px;
                }
            }
        } 
        li.goodsRatio1{
            .img{
                padding-bottom:66.66%;
            }
        }
        li.goodsRatio2{
            .img{
                padding-bottom:100%;
            }
        }
        li.goodsRatio3{
            .img{
                padding-bottom:133.33%;
            }
        }
        li.goodsRatio4{
            .img{
                padding-bottom:56.25%;
            }
        } 
    } 
}
.componentGoods.listStyle4{
    ul{
        li{
            margin-top:15px;
            overflow:hidden;
            position:relative;
            padding:10px 15px;
            &:first-child{
                margin-top:0 !important;
            }
            .img{
                width:36%;
                height:0;
                padding-bottom:36%;
                float:left;
                margin-right:12.5px;
                position:relative;
                @include borderRadius(8px);
                overflow:hidden;
            }
            .text{
                overflow:hidden;
                position:relative;
                height:100%;
                .title{
                    font-size:14px;
                    line-height:17px;
                    height:34px;
                    @include lineClamp(2);
                    margin-top:2.5px;
                }
                .fTitle{
                    font-size:12px;
                    line-height:15px;
                    height:15px;
                    margin-top:8.5px;
                    @extend .ellipsis;
                }
                .priceLine{
                    margin-top:37.5px;
                    overflow:hidden;
                    .price{
                        float:left;
                        font-size:11px;
                        margin-right:13.5px;
                        font{
                            font-size:16px;
                        }
                    }
                }
                .button{
                    right:10px;
                    bottom:0;
                }
            }
        }  
        li.goodsRatio1{
            .img{
                padding-bottom:24%;
            }
            .text{
                .title{
                    height:17px;
                    @include lineClamp(1);
                    margin-top:2.5px;
                }
                .fTitle{
                    margin-top:5px;
                }
                .priceLine{
                    margin-top:10px;
                }
            }
        }
        li.goodsRatio2{
            .img{
                padding-bottom:36%;
            }
            .text{
                .title{
                    height:17px;
                    @include lineClamp(1);
                    margin-top:2.5px;
                }
                .fTitle{
                    margin-top:17px;
                }
                .priceLine{
                    margin-top:30px;
                }
            }
        }
        li.goodsRatio3{
            .img{
                padding-bottom:48%;
            }
            .text{
                .title{
                    height:51px;
                    @include lineClamp(3);
                }
                .fTitle{
                    margin-top:10px;
                }
                .priceLine{
                    margin-top:35px;
                }
            }
        }
        li.goodsRatio4{
            .img{
                padding-bottom:20.25%;
            }
            .text{
                .title{
                    margin-top:0;
                    height:17px;
                    @include lineClamp(1);
                }
                .fTitle{
                    margin-top:4px;
                }
                .priceLine{
                    margin-top:4px;
                }
            }
        }  
    }
}
.componentGoods.listStyle5{
    ul{
        display:flex;
        display:-webkit-flex;
        justify-content:space-between;
        flex-wrap:wrap;
        li{
            &:first-child{
                margin-top:0 !important;
                width:100% !important;
            }
            &:nth-of-type(3n+1){
                overflow:hidden;
                width:100% !important;
                .img{
                    padding-bottom:100%;
                    height:0;
                    position:relative;
                    overflow:hidden;
                }
                .text{
                    overflow:hidden;
                    padding:10px;
                    position:relative;
                    .title{
                        font-size:13px;
                        line-height:16px;
                        height:32px;
                        @include lineClamp(2);
                    }
                    .fTitle{
                        font-size:12px;
                        line-height:15px;
                        height:15px;
                        margin-top:5px;
                        @extend .ellipsis;
                    }
                    .priceLine{
                        margin-top:12.5px;
                        overflow:hidden;
                        .price{
                            float:left;
                            font-size:11px;
                            margin-right:12.5px;
                            font{
                                font-size:16px;
                            }
                        }
                    }
                    .button{
                        right:10px;
                        bottom:10px;
                    }
                }
            }
            &:nth-of-type(3n+2){
                margin-top:15px;
                width:170px;
                overflow:hidden;
                &:nth-of-type(1){
                    margin-top:0 !important;
                }
                &:nth-of-type(2){
                    margin-top:0 !important;
                }
                .img{
                    position:relative;
                    overflow:hidden;
                    padding-bottom:100%;
                    height:0;
                }
                .text{
                    overflow:hidden;
                    padding:10px;
                    position:relative;
                    .title{
                        font-size:13px;
                        line-height:16px;
                        height:32px;
                        @include lineClamp(2);
                    }
                    .fTitle{
                        font-size:12px;
                        line-height:15px;
                        height:15px;
                        margin-top:5px;
                        @extend .ellipsis;
                    }
                    .priceLine{
                        margin-top:12.5px;
                        overflow:hidden;
                        .price{
                            float:left;
                            font-size:11px;
                            margin-right:12.5px;
                            font{
                                font-size:16px;
                            }
                        }
                    }
                    .button{
                        right:10px;
                        bottom:10px;
                    }
                }
            }
            &:nth-of-type(3n+3){
                margin-top:15px;
                width:170px;
                overflow:hidden;
                &:nth-of-type(1){
                    margin-top:0 !important;
                }
                &:nth-of-type(2){
                    margin-top:0 !important;
                }
                .img{
                    position:relative;
                    overflow:hidden;
                    padding-bottom:100%;
                    height:0;
                }
                .text{
                    overflow:hidden;
                    padding:10px;
                    position:relative;
                    .title{
                        font-size:13px;
                        line-height:16px;
                        height:32px;
                        @include lineClamp(2);
                    }
                    .fTitle{
                        font-size:12px;
                        line-height:15px;
                        height:15px;
                        margin-top:5px;
                        @extend .ellipsis;
                    }
                    .priceLine{
                        margin-top:12.5px;
                        overflow:hidden;
                        .price{
                            float:left;
                            font-size:11px;
                            margin-right:12.5px;
                            font{
                                font-size:16px;
                            }
                        }
                    }
                    .button{
                        right:10px;
                        bottom:10px;
                    }
                }
            }
        }  
        li.goodsRatio1{
            .img{
                padding-bottom:66.66%;
            }
        }
        li.goodsRatio2{
            .img{
                padding-bottom:100%;
            }
        }
        li.goodsRatio3{
            .img{
                padding-bottom:133.33%;
            }
        }
        li.goodsRatio4{
            .img{
                padding-bottom:56.25%;
            }
        }
    } 
}

.componentGoods.listStyle6{
    ul{
        display:flex;
        overflow-x:scroll;
        li{
            flex:0 0 95px;
            overflow:hidden;
            &:first-child{
                margin-left:0 !important;
            }
            .img{
                height:0;
                padding-bottom:100%;
                position:relative;
                overflow:hidden;
            }
            .text{
                overflow:hidden;
                padding:10px;
                position:relative;
                .title{
                    font-size:13px;
                    line-height:16px;
                    height:32px;
                    @include lineClamp(2);
                }
                .fTitle{
                    font-size:12px;
                    line-height:15px;
                    height:15px;
                    margin-top:5px;
                    @extend .ellipsis;
                }
                .priceLine{
                    margin-top:12.5px;
                    overflow:hidden;
                    .price{
                        float:left;
                        font-size:11px;
                        margin-right:12.5px;
                        font{
                            font-size:16px;
                        }
                    }
                }
                .button{
                    right:10px;
                    bottom:10px;
                }
            }
        } 
        li.goodsRatio1{
            .img{
                padding-bottom:66.66%;
            }
        }
        li.goodsRatio2{
            .img{
                padding-bottom:100%;
            }
        }
        li.goodsRatio3{
            .img{
                padding-bottom:133.33%;
            }
        }
        li.goodsRatio4{
            .img{
                padding-bottom:56.25%;
            }
        } 
    } 
}
</style>
