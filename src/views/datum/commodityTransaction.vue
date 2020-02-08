<template>
    <div class="p_container">
        <div class="clearfix">
          <div class="fr">
            <el-radio-group class="fr" v-model="visitSourceType" @change="all">
              <el-radio-button class="btn_bor" label="0" v-permission="['数据', '商品交易', '全部']">全部</el-radio-button>
              <el-radio-button class="btn_bor" label="1" v-permission="['数据', '商品交易', '小程序']">小程序</el-radio-button>
              <el-radio-button class="btn_bor" label="2" v-permission="['数据', '商品交易', '公众号']">公众号</el-radio-button>
              <el-radio-button class="btn_bor" label="3" v-if="isPc">pc</el-radio-button>
              <el-radio-button class="btn_bor" label="4" v-if="isPc">wap</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="pane_container">
            <p class="p_title">商品总况：</p>
            <div class="p_blocks">
                <div class="p_item" v-for="item in Condition" :key="item.id" >
                    <img :src="item.url" alt="" class="fl">
                    <div class="fr">
                        <p>{{item.text}}</p>
                        <p :style="{color: item.color}">{{item.num == "null" ? 0 : item.num}}</p>
                    </div>
                </div>
            </div>
            <div class="title_line clearfix">
                <p class="fl" style="font-size: 16px">热销TOP5商品榜单：</p>
            </div>
            <ct1Table  :hotData="hotData"></ct1Table>
            <div class="c_line">
                <span class="c_title">商品详情</span>
                <span>
                    <span class="c_label">筛选日期：</span>
                    <el-radio-group v-model="dateType" @change="changeDayM">
                        <el-radio-button class="btn_bor" label="7">最近7天</el-radio-button>
                        <el-radio-button class="btn_bor" label="15">最近15天</el-radio-button>
                        <el-radio-button class="btn_bor" label="30">最近30天</el-radio-button>
                        <el-radio-button class="btn_bor" label="4">自定义</el-radio-button>
                    </el-radio-group>
                </span>
            </div>
            <div class="input_wrap" v-if="dateType == 4">
                <span></span>
                <el-date-picker
                    v-model="range"
                    type="daterange"
                    range-separator="—"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="changeTime"
                ></el-date-picker>
            </div>
            <ct2Table style="margin-top: 26px" :listObj="listObj" @getProductDetails="getProductDetails"></ct2Table>
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
                onPick: ({ maxDate, minDate }) => {
                    this.pickerMinDate = minDate.getTime()
                    if (maxDate) {
                    this.pickerMinDate = ''
                    }
                },
                disabledDate: (time) => {
                    if (this.pickerMinDate !== '') {
                    const day90 = (90 - 1) * 24 * 3600 * 1000
                    let maxTime = this.pickerMinDate + day90
                    if (maxTime > new Date()) {
                        maxTime = new Date()- 8.64e7
                    }
                    return time.getTime() > maxTime || time.getTime() == this.pickerMinDate
                    }
                    return time.getTime() > Date.now() - 8.64e7
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
            isPc:false
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
            }).catch(error => {
                this.$message.error(error);
            });
        },

        // 获取热销商品
        getHotGoods(){
            let data ={
                channel:this.visitSourceType
            }
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
            }).catch(error => {
                this.$message.error(error);
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
            this._apis.data.productDetails(data).then(response => {
                response && (this.listObj = response)
        }).catch(error => {
          this.$message.error(error);
        });
        },
        changeDayM(){
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
.p_container{
    padding: 20px;
    background-color: #fff;
    .pane_container{
        color: #3D434A;
        padding: 23px 38px;
        .p_title{
            font-size: 16px;
        }
        .p_blocks{
            width: 900px;
            display: flex;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        .title_line{
            height: 86px;
            line-height: 86px;
            margin: 5px 0;
        }
        .p_item{
            width: 176px;
            height: 86px;
            border: 1px solid #CCCCCC;
            margin: 0 34px 12px 0;
            border-radius:4px;
            img{
                margin: 19px 0 0 8px;
            }
            div{
                width: 105px;
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
            padding-top: 30px;
            border-top: 1px dashed #D3D3D3;
            display:flex;
            justify-content:space-between;
            span{
                color: #655EFF;
                // margin-left: 20px;
                &.c_title{
                    font-weight: bold;
                    color: #474C53;
                }
                &.c_label{
                    // margin-left: 300px;
                    color: #474C53;
                }
            }
        }
        .input_wrap{
            width: 100%;
            margin-top:10px;
            display:flex;
            justify-content:flex-end;
        }
    }
}
.el-radio-group label:last-child{
  margin-left: 0px;
}
</style>

