<template>
<!-- 组件-商品列表 -->
    <div class="component_wrapper" v-loading="loading" :style="{cursor: dragable ? 'pointer' : 'text'}">
        <div class="componentGoods" :class="'listStyle'+listStyle" :style="{padding:pageMargin+'px'}" v-if="currentComponentData && currentComponentData.data" ref="componentContent">
            <template v-if="hasRealData || hasFakeData">
                <ul  v-if="hasRealData">
                    <li v-for="(item,key) in displayList" :key="key" :style="[goodMargin,goodWidth]" :class="['goodsStyle'+goodsStyle,{goodsChamfer:goodsChamfer!=1},'goodsRatio'+goodsRatio]">
                        <div class="img" >
                            <div class="imgAbsolute">
                                <el-image :key="listStyle" :scroll-container="listStyle == 6 ? null : bodyClass ?  '.'+bodyClass : '.phone-body'" :src="item.mainImage" alt="" :class="{goodsFill:goodsFill!=1}" lazy>
                                    <div slot="placeholder" class="el-image__lazyloading">
                                        加载中...
                                    </div>
                                </el-image>
                            </div>
                            <div class="label" v-if="item.productLabelInfo&&item.productLabelInfo.enable==1" :style="{background:color2}">{{item.productLabelInfo.name}}</div>
                            <p class="nothing" v-if="item.status ===0">下架</p>
                            <p class="nothing" v-else-if="calcSotck(item)<1">售罄</p>
                            <div class="nothingLayer" v-if="item.status ===0 || calcSotck(item)<1"></div>
                        </div>
                        <div class="text" v-if="showContents.length>0">
                            <p class="title" :class="[{textStyle:textStyle!=1},{textAlign:textAlign!=1}]" v-if="showContents.indexOf('1')!=-1">{{item.name}}</p>
                            <p class="fTitle" :class="[{textStyle:textStyle!=1},{textAlign:textAlign!=1}]" v-if="showContents.indexOf('3')!=-1">{{item.description}}</p>
                            <div class="priceLine">
                                <p class="price" v-if="showContents.indexOf('2')!=-1">￥<font>{{getPrice(item)}}</font></p>
                                <componentButton :decorationStyle="buttonStyle" :decorationText="currentComponentData.data.buttonText" v-if="showContents.indexOf('4')!=-1&&calcSotck(item)>0 && listStyle != 3 && listStyle != 6" class="button"></componentButton>
                            </div>
                        </div>
                    </li>
                </ul>
                
                <ul v-else>
                    <li v-for="(item,key) in currentComponentData.data.fakeList[listStyle - 1]" :key="key" :style="[goodMargin,goodWidth]" :class="['goodsStyle'+goodsStyle,{goodsChamfer:goodsChamfer!=1},'goodsRatio'+goodsRatio]" class="fakeData">
                        <div class="img"  v-if="listStyle != 4">
                            <div class="imgAbsolute">
                                <img :src="item.fileUrl" alt="" :class="{goodsFill:goodsFill!=1}">
                            </div>
                        </div>
                        <div v-else class="img">
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
    name:"componentGoods",
    mixins:[mixinCompsData],
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
            displayList: [],
            loading: false
        }
    },
    created() {
        const _self = this;
        this.receivePropDataChange('goodsListOfGroupChange', (list) => {
            this.displayList = list;
        });
    },
    watch: {
        'currentComponentData.data.ids': {
            handler(newValue, oldValue) {
                //商品组件为数组格式，商品分类组件为对象格式
                if(!Array.isArray(newValue) && !!this.currentComponentData.data.source) {
                    this.fetch();
                    return;
                }
                if(!this.utils.isIdsUpdate(newValue, oldValue)) {
                    this.fetch();
                }
            },
            deep: true
        },
        'currentComponentData.data.currentCatagoryId': {
            handler(newValue, oldValue) {
                if(newValue !== oldValue) {
                    this.fetch();
                }
            },
            deep: true
        },
        currentCatagoryId(newValue, oldValue) {
            if(newValue !== oldValue) {
                this.fetch();
            }
        },
        'currentComponentData.data.currentCatagoryId'(newValue, oldValue) {
            if(newValue !== oldValue) {
                this.fetch();
            }
        }
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
    methods:{
        decoration(){
            // 样式属性
            if(!this.currentComponentData || !this.currentComponentData.data) {
              return;
            }
            //因计算bodyWidth用到了this.showTemplate，所以这里提前获取
            if('showTemplate' in this.currentComponentData.data){
                this.showTemplate= this.currentComponentData.data.showTemplate;
            }
            this.listStyle = this.currentComponentData.data.listStyle;
            this.pageMargin = this.currentComponentData.data.pageMargin;
            this.goodsMargin = this.currentComponentData.data.goodsMargin;
            var scrollWidth = window && this.utils.isIE() ? 18 : 0;
            var bodyWidth = this.$refs.componentContent ? this.$refs.componentContent.clientWidth - scrollWidth : (375);
            bodyWidth = this.$refs.componentContent && (this.currentComponentData.type === 'goodsGroup') && this.showTemplate==2 ? bodyWidth + 100 : bodyWidth;
            if(this.listStyle=='1'){
                this.goodMargin = {marginTop:this.goodsMargin + 'px'};
                this.goodWidth = "100%";
            }
            else if(this.listStyle=='2'){
                this.goodMargin = {marginTop:this.goodsMargin + 'px'};
                if('showTemplate' in this.currentComponentData.data){
                    //this.showTemplate= this.currentComponentData.data.showTemplate;
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
                        this.goodWidth = {width:((bodyWidth - this.pageMargin * 2 - this.goodsMargin*2 - 100) / 3 - 2) + 'px'}
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
                var scrollWidth = window && this.utils.isIE() ? 18 : 0;
                var bodyWidth = this.$refs.componentContent ? this.$refs.componentContent.clientWidth - scrollWidth : (375);
                if('showTemplate' in this.currentComponentData.data){
                    this.showTemplate= this.currentComponentData.data.showTemplate;
                    if(this.showTemplate!=1 && !this.$refs.componentContent){
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
        async fetch(componentData = this.currentComponentData.data) {
            if(componentData) {
                let params = {};
                if(!componentData.source || (componentData.source === 1)) {
                    const ids = componentData.ids;
                    if(ids) {
                        if(Object.prototype.toString.call(ids) === '[object Object]') {
                            params = this.setGroupGoodsParams(ids);
                            if(!params.ids || !params.ids.length) {
                                this.displayList = [];
                                this.dataLoaded = true;
                                return;
                            }
                        }else if(Array.isArray(ids) && ids.length){
                            params = this.setNormalGoodsParams(ids);
                            if(!params.ids || !params.ids.length) {
                                this.displayList = [];
                                this.dataLoaded = true;
                                return;
                            }
                        }else{
                            this.displayList = [];
                            this.dataLoaded = true;
                            return;
                        }
                    }else{
                        this.displayList = [];
                        this.dataLoaded = true;
                        return;
                    }
                }else if(componentData.source === 2){
                    if(!componentData.currentCatagoryId) {
                        this.displayList = [];
                        this.dataLoaded = true;
                        return;
                    }
                    params = {
                        status: '1',
                        productCatalogInfoId: componentData.currentCatagoryId,
			            pageSize: '1000',
                    };
                }

                this.loading = true;
                //优先加载前几条数据出来  && componentData.source === 1
                if(params.ids && params.ids.length > this.preloadLength && componentData.source !== 2) {
                    const paramsLoad = this.utils.deepClone(params);
                    paramsLoad.ids.splice(this.preloadLength);
                    paramsLoad.pageSize = this.preloadLength;
                    await this._apis.goods.fetchAllSpuGoodsList(paramsLoad).then((response)=>{
                        this.createList(response, componentData);
                        this.loading = false;
                    }).catch((error)=>{
                        console.error(error);
                        this.displayList = [];
                    });
                }

                
                this._apis.goods.fetchAllSpuGoodsList(params).then((response)=>{
                    this.createList(response, componentData);
                    this.loading = false;
                    this.dataLoaded = true;
                }).catch((error)=>{
                    console.error(error);
                    this.displayList = [];
                    this.loading = false;
                    this.dataLoaded = true;
                });
            }
        },

        /* 创建数据 */
        createList(datas, componentData) {
            this.displayList = datas;
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
                    // status: '1',
                    ids: allIds,
		            pageSize:'1000'
                }
            }else{
                params = {
                    // status: '1',
                    ids: ids[this.currentCatagoryId],
                    productCatalogInfoId: this.currentCatagoryId,
		            pageSize:'1000'
                }
            }
            return params;
        },

        /* 设置普通商品参数 */
        setNormalGoodsParams(ids) {
            return {
                // status: '1',
                ids: ids,
		        pageSize:ids.length
            }
        },

        getPrice(item) {
            if(item.goodsInfos && Array.isArray(item.goodsInfos) && item.goodsInfos.length) {
                return item.goodsInfos[0].salePrice || 0;    
            };
            return 0;
        },

        //计算库存
        calcSotck(item={}) {
            let totalStock = 0;
            for(let i of item.goodsInfos) {
                if(i.status !== 0) {
                   totalStock+= i.stock; 
                }
            }
            return totalStock;
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
                    /deep/ .el-image {
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
                    }
                    /deep/ .goodsFill{
                        img{
                            object-fit: contain;
                        }
                    }
                }
                .label{
                    position:absolute;
                    left:0;
                    top:0;
                    padding:0 6px;
                    height:15px;
                    font-size:11px;
                    color:#fff;
                    border-radius:1.5px;
                    line-height:15px;
                    background:#ffe08b;
                }
                .nothing{
                    position:absolute;
                    width:52px;
                    height:52px;
                    margin-left:-26px;
                    margin-top:-26px;
                    top:50%;
                    left:50%;
                    line-height:52px;
                    color:#fff;
                    text-align:center;
                    background:rgba(0,0,0,0.5);
                    font-size:14px;
                    @include borderRadius(50%);
                    z-index:1;
                }
                .nothingLayer{
                    top:0;
                    right:0;
                    bottom:0;
                    left:0;
                    position:absolute;
                    background:rgba(0,0,0,0.1);
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
                        color:#333;
                        line-height:28px;
                        height:28px;
                    }
                }
                .button{
                    float:right;
                    //position:absolute;
                    right:10px;
                    bottom:10px;
                }
            }
            &.fakeData{
                background:transparent!important;  
                .img{
                    background:transparent!important;  
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
                padding:10px 10px 15px 10px;
                position:relative;
                .title{
                    font-size:13px;
                    line-height:16px;
                    height:15px;
                    @include lineClamp(1);
                }
                .fTitle{
                    font-size:12px;
                    line-height:15px;
                    height:15px;
                    margin-top:5px;
                    @extend .ellipsis;
                }
                .priceLine{
                    margin-top:13.5px;
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
                    bottom:15px;
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
                    display:none;
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
                //@include borderRadius(8px);
                overflow:hidden;
            }
            &.fakeData{
                padding:0;
                .img{
                    width:100%;
                    height:126px;
                    position:relative;
                    overflow:hidden;
                    padding:0!important;
                    img{
                        width:100%;
                        height:100%;
                        object-fit: initial!important;
                    }
                }
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
                    height:34px;
                    @include lineClamp(2);
                    margin-top:2.5px;
                }
                .fTitle{
                    margin-top:17px;
                }
                .priceLine{
                    margin-top:20px;
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
                    margin-top:50px;
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
                    margin-top:1.5px;
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
            &:nth-of-type(3n+2),&:nth-of-type(3n+3){
                margin-top:15px;
                width:170px;
                overflow:hidden;
                .img{
                    position:relative;
                    overflow:hidden;
                    padding-bottom:100%;
                    height:0;
                }
                .text{
                    overflow:hidden;
                    padding:10px 10px 15px 10px;
                    position:relative;
                    .title{
                        font-size:13px;
                        line-height:16px;
                        height:15px;
                        @include lineClamp(1);
                    }
                    .fTitle{
                        font-size:12px;
                        line-height:15px;
                        height:15px;
                        margin-top:5px;
                        @extend .ellipsis;
                    }
                    .priceLine{
                        margin-top:13.5px;
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
                        bottom:15px;
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
        -webkit-overflow-scrolling: touch;
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
                padding:7.5px 4px;
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
                    display:none;
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
