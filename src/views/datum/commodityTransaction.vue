<template>
<div>
    <div class="p_container p_channel">
        <div class="clearfix">
          <div class="fr fr_channel">
            <el-radio-group class="fr" v-model="visitSourceType" @change="all">
              <el-radio-button class="btn_bor" label="0" v-permission="['数据', '商品交易', '全部']">全部</el-radio-button>
              <el-radio-button class="btn_bor" label="1" v-permission="['数据', '商品交易', '小程序']">小程序</el-radio-button>
              <el-radio-button class="btn_bor" label="2" v-permission="['数据', '商品交易', '公众号']">公众号</el-radio-button>
              <el-radio-button class="btn_bor" label="3" v-if="isPc">pc</el-radio-button>
              <el-radio-button class="btn_bor" label="4" v-if="isPc">wap</el-radio-button>
            </el-radio-group>
          </div>
        </div>
    </div>
    <div class="p_container">
        <div class="pane_container">
            <p class="p_title">商品总况：</p>
            <div class="p_blocks" v-loading="loading1">
                <div class="p_item" v-for="item in Condition" :key="item.id" >
                    <img :src="item.url" alt="" class="fl">
                    <div class="fr">
                        <p>{{item.text}}</p>
                        <p :style="{color: item.color}">{{item.num == "null" ? 0 : item.num}}</p>
                    </div>
                </div>
            </div>
            <div class="title_line clearfix">
                <p class="fl" style="font-size: 16px;line-height:16px;margin-top:15px;">热销TOP5商品榜单：</p>
            </div>
            <ct1Table  :hotData="hotData" v-loading="loading2"></ct1Table>
            <div class="c_line">
                <span class="c_title">商品详情：</span>
                <span>
                    <!--<span class="c_label">筛选日期：</span>-->
                    <!--<el-radio-group v-model="dateType" @change="changeDayM">-->
                        <!--<el-radio-button class="btn_bor" label="7">最近7天</el-radio-button>-->
                        <!--<el-radio-button class="btn_bor" label="15">最近15天</el-radio-button>-->
                        <!--<el-radio-button class="btn_bor" label="30">最近30天</el-radio-button>-->
                        <!--<el-radio-button class="btn_bor" label="4">自定义</el-radio-button>-->
                    <!--</el-radio-group>-->
					<div class="radio-group" style="margin-right: 10px;">
						<span @click="changeDayM(7)" :class="dateType == 7 ? 'active' : ''">最近7天</span>
						<span @click="changeDayM(15)" :class="dateType == 15 ? 'active' : ''">最近15天</span>
						<span @click="changeDayM(30)" :class="dateType == 30 ? 'active' : ''">最近30天</span>
						<span @click="changeDayM(4)" :class="dateType == 4 ? 'active' : ''">自定义时间</span>
					</div>
                </span>
				<div class="input_wrap" v-show="dateType == 4">
					<span></span>
					<el-date-picker
						v-model="range"
						type="datetimerange"
						align="right"
						range-separator="至"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						value-format="yyyy-MM-dd HH:mm:ss"
                        :editable="false"
                        @focus="utils.globalTimeDisabledFocus"
						:picker-options="Object.assign(utils.globalTimePickerOption.call(this, false), this.pickerOptions)"
						@change="changeTime"
					></el-date-picker>
				</div>
            </div>

            <ct2Table style="margin-top: 15px" :listObj="listObj" @getProductDetails="getProductDetails" v-loading="loading3"></ct2Table>
        </div>
    </div>
</div>
</template>
<script>
import datumCont from '@/system/constant/datum';
import ct1Table from './components/ct1Table'
import ct2Table from './components/ct2Table'
import utils from '@/utils';
export default {
    name: 'commodityTransaction',
    components: { ct1Table, ct2Table },
    data() {
        return {
            pickerOptions: {
                disabledDate: (time) => {
                    let yesterday = new Date();
                    yesterday = yesterday.getTime()-24*60*60*1000;
                    yesterday = this.utils.dayEnd(yesterday);
                    return time.getTime() > yesterday.getTime();
                }
            },
            visitSourceType:0,
            activeName: "first", 
            value:'',
            range: "",
            dateType:7,
            queryTime:'',
            startTime:'',
            endTime:'',
            startIndex:1,
            pageSize:10,
            dataObj:{},
            Condition:[],
            hotData:[],
            listObj:[],
            isPc:false,
            loading1: true,
            loading2: true,
            loading3: true,
        }
    },
    computed: {},
    created(){
        this.getGeneralCondition()
        this.getHotGoods()
        this.getProductDetails()
        this.getOpen()
    },
    methods:{
        //pc wap是否开通
        getOpen(){
            this._apis.data.openPcWap().then(response => {
                if(response == null){
                this.isPc = false
                }else if(response.onoff == 0){
                this.isPc = false
                }else{
                this.isPc = true
                }
            }).catch(error => {
                this.$message.error(error);
            });
        },

        //获取商品总况
        getGeneralCondition(){
            this.Condition = datumCont.goodsTotleData
            let data ={
                channel:this.visitSourceType,
            }
            this.loading1 = true;
            this._apis.data.generalCondition(data).then(response => {
                this.Condition.forEach(e => {
                    switch (e.id){
                        case '001': e.num = response.online
                         break;
                        case '002': e.num = response.visit
                         break;
                        case '003': e.num = response.shoppingCart
                         break;
                        case '004': e.num = response.orders
                         break;
                        case '005': e.num = response.rights
                         break;
                        case '006': e.num = response.soldOut
                         break;
                        case '007': e.num = response.pays
                         break;
                        case '008': e.num = response.repurchase
                         break;
                    }                        
                });
                this.loading1 = false;
            }).catch(error => {
                this.$message.error(error);
                this.loading1 = false;
            });
        },

        // 获取热销商品
        getHotGoods(){
            let data ={
                channel:this.visitSourceType
            }
            this.loading2 = true;
            this._apis.data.hotGoods(data).then(response => {
                this.hotData = []
                let arr = Object.keys(response) 
                if(arr.length != 0){
                    let data = response
                    for(let key in data){
                        let goodsObj = data[key]
                        this.hotData.push(goodsObj)
                    }                
                }
                this.loading2 = false;
            }).catch(error => {
                this.$message.error(error);
                this.loading2 = false;
            });
        },

        // 获取商品详情
        getProductDetails(){
            let data ={
                channel:this.visitSourceType,
                nearDay:this.dateType == '4' ? null : this.dateType,
                startTime:this.startTime,
                endTime:this.endTime,
            }
            this.loading3 = true;
            this._apis.data.productDetails(data).then(response => {
                response && (this.listObj = response)
                this.loading3 = false;
        }).catch(error => {
          this.$message.error(error);
          this.loading3 = false;
        });
        },
        changeDayM(val){
        	this.dateType = val;
            this.startTime = '';
            this.endTime = '';
            this.getProductDetails()
        },
        changeTime(val){
            this.startTime = val[0];
            this.endTime = val[1];
            this.getProductDetails()
        },
        all(){
            this.getGeneralCondition()
            this.getHotGoods()
            this.getProductDetails()
        }
    },
}
</script>
<style lang="scss" scoped>
/**
*
* @Author zpw
* @Update 2020/4/17
* @Description  产研-电商中台  bugID: CYDSZT-3449-5
*
*/
.radio-group{
	display: inline-block;
}
.radio-group span{
	display: inline-block;
	font-size: 14px;
	background-color: #fff;
	line-height: 14px;
	padding: 6px 29px;
	cursor: pointer;
	color: #B6B5C8;
}
.radio-group span.active{
	color:#655EFF;
	background-color: #E6E4FF;
}
.el-range-editor.el-input__inner{
	padding: 0px 10px;
}
.p_channel{
    padding:0px;
    margin-bottom:20px;
    .fr_channel{
        float:left;
        // margin-left:30px;
    }
}
.p_container{
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    .pane_container{
        color: #3D434A;
        // padding: 23px 38px;
        .p_title{
            font-size: 16px;
			line-height: 16px;
        }
        .p_blocks{
            max-width: 1140px;
            display: flex;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        .title_line{
            height: 46px;
        }
        .p_item{
            width: 252px;
            height: 86px;
            border: 1px solid #CCCCCC;
            margin: 0 20px 20px 0;
            border-radius:4px;
            img{
                margin: 19px 0 0 8px;
            }
            div{
                width: 125px;
                margin:19px 6px 0 0;
                p{
                    text-align: center;
                    &:last-child{
                        font-size: 22px;
                        margin-top: 8px;
                    }
                }
            }
        }
        .c_line{
            padding-top: 35px;
            border-top: 1px dashed #D3D3D3;
            /*display:flex;*/
            /*justify-content:space-between;*/
            span{
                // margin-left: 20px;
                &.c_title{
                    font-size: 16px;
					line-height: 16px;
                    color: #474C53;
                }
                &.c_label{
                    // margin-left: 300px;
                    color: #474C53;
                }
            }
        }
        .input_wrap{
			width: 400px;
			display: inline-block;
        }
    }
}
.el-radio-group label:last-child{
  margin-left: 0px;
}
</style>

