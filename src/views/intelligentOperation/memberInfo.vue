<template>
<div class="m_container">
        <div class="pane_container">
            <el-form ref="form" :model="form" class="clearfix">
                <el-form-item label="交易时间">
                    <div class="p_line">
                        <el-radio-group v-model="form.timeType" @change="changeDay">
                            <el-radio-button class="btn_bor" label="1">7天</el-radio-button>
                            <el-radio-button class="btn_bor" label="2">15天</el-radio-button>
                            <el-radio-button class="btn_bor" label="3">30天</el-radio-button>
                            <el-radio-button class="btn_bor" label="5">本季度</el-radio-button>
                            <el-radio-button class="btn_bor" label="4">自定义时间</el-radio-button>
                        </el-radio-group>
                        <el-date-picker
                        v-if="form.timeType == 4"
                        v-model="form.daterange"
                        type="daterange"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        @change="getData"
                    >
                    </el-date-picker>
                    </div>
                    
                </el-form-item>
                <el-form-item label="会员类型">
                    <div class="input_wrap2">
                        <el-select v-model="form.memberType"  @change="getData">
                            <el-option v-for="item in customType" :label="item.name" :value="item.id" :key="item.id"></el-option>
                        </el-select>
                    </div>
                    <span class="span_label">交易次数</span>
                    <div class="input_wrap2 marR20">
                        <el-select v-model="form.tradeCountRange"  @change="getData">
                            <el-option v-for="item in tradeCount" :label="item.name" :value="item.value" :key="item.id"></el-option>
                        </el-select>
                    </div>
                    <el-checkbox-group v-model="form.queryRepeatPaymentRatio" style="display:inline-block">
                        <el-checkbox label="是否查询复购率" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="订单金额">
                    <div class="input_wrap3">
                            <el-radio-group v-model="form.queryOrderMoneyType">
                            <el-radio :label="null" class="mr10">全部</el-radio>
                            <el-radio :label="0" class="mr10">单次</el-radio>
                            <el-radio :label="1">总额</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="input_wrap2">
                        <el-input placeholder="最低金额（元）" v-model="lowprice" type="number"></el-input>
                    </div>
                    <span>—</span>
                    <div class="input_wrap2">
                        <el-input placeholder="最高金额（元）" v-model="highprice" type="number"></el-input>
                    </div>
                </el-form-item>
                <el-form-item class="fr marT20">
                    <el-button class="minor_btn" icon="el-icon-search" @click="goSearch()">查询</el-button>
                    <el-button class="border_btn" @click="reSet">重 置</el-button>
                </el-form-item>
            </el-form>

            <div class="m_line clearfix">
                <p class="fl">该筛选条件下：
                    <i v-if="form.memberType== null" style="font-style:normal">
                        全部会员共计<span>{{newMemberCount + oldMemberCount || 0}}</span>人；
                        占客户总数的<span>{{allRatio}}%</span>;    
                    </i>
                    <i v-if="form.memberType==0" style="font-style:normal">
                        非会员共计<span>{{customerCount || 0}}</span>人；
                        占客户总数的<span>{{customerRatio != 0 ? (customerRatio*100).toFixed(2) : 0}}%</span>;    
                    </i>
                    <i v-if="form.memberType==1" style="font-style:normal">
                        新会员共计<span>{{newMemberCount || 0}}</span>人；
                        占客户总数的<span>{{newMemberRatio != 0 ? (newMemberRatio*100).toFixed(2) : 0}}%</span>;
                    </i>
                    <i v-if="form.memberType==2" style="font-style:normal">
                        老会员共计<span>{{oldMemberCount || 0}}</span>人；
                        占客户总数的<span>{{oldMemberRatio != 0 ? (oldMemberRatio*100).toFixed(2) : 0}}%</span>;    
                    </i>
                    <i v-if="repeatPaymentRatio != undefined" style="font-style:normal">复购率为<span>{{repeatPaymentRatio !=0 ? (repeatPaymentRatio*100).toFixed(2) : 0}}%</span></i>。
                </p>
                <div class="fr marT20">
                    <el-button class="minor_btn" @click="reScreening">重新筛选</el-button>
                    <el-button class="yellow_btn" icon="el-icon-share" @click="mIexport">导出</el-button>
                </div>
            </div>
            <maTable class="marT20" 
                @sizeChange = "sizeChange"
                @currentChange = "currentChange"                   
                :listObj="listObj" 
                :totalCount="totalCount">
            </maTable>
        </div>
        <p>运营建议:</p>
             <p v-if="form.tradeCountRange==1" class="proposal"><b>"交易次数1次"：</b>此用户群体为低频用户，建议提升产品认可度，提升服务质量，有助于提升低频用户交易次数。</p> 
             <p v-if="form.tradeCountRange==2" class="proposal"><b>"交易次数2-5次"：</b>此用户群体为中频用户，建议提升产品认可度，提升服务质量，对商品搞一些营销活动：拼团、砍价、满减，此用户购物可以享受95折，有助于提升低频用户交易次数。</p> 
             <p v-if="form.tradeCountRange==3" class="proposal"><b>"交易次数6-8次"：</b>此用户群体为高频用户，建议针对高频用户可设定分销机制，对商品搞一些营销活动：拼团、砍价、满减，此用户购物可以享受9折，有助于提升低频用户交易次数。</p> 
             <p v-if="form.tradeCountRange==4" class="proposal"><b>"交易次数8次以上"：</b>此用户群体为忠实用户，建议针对高频用户可设定分销机制，对商品搞一些营销活动：拼团、砍价、满减，此用户购物可以享受88折，有助于提升低频用户交易次数。</p> 
        </div>
</template>
<script>
import maTable from './components/maTable';
export default {
    name: 'memberInfo',
    components: { maTable },
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
                        return time.getTime() > maxTime
                    }
                    return time.getTime() > Date.now() - 8.64e7
                }
            },
            form: {
                startTime:null, //2019-08-07 12:12:12
                endTime:null,
                daterange:null,
                memberType:null,  //客户是0，新会员是1，老会员是2
                tradeCountRange:null,
                queryRepeatPaymentRatio: 0,
                queryOrderMoneyType: null, // 单次和总额 0和1
                MoneyRange:null,
                timeType:1,
                startIndex:1,
                pageSize:10,
                sur:''
            },
            lowprice:'',
            highprice:'',
            textTips:false, 
            repeatPaymentRatio:'', //复购率
            memberNum:0, //会员人数
            memberCount:0, //会员占比
            listObj:{},//会员信息列表
            totalCount:0,//总条数
            customType: [
                {
                    id: null,
                    name: "全部"
                },
                {
                    id: "0",
                    name: "非会员"
                },{
                    id: "1",
                    name: "新会员"
                },{
                    id: "2",
                    name: "老会员"
                }
            ],
            tradeCount: [
                // {
                //     id: null,
                //     name: "不限"
                // },
                // {
                //     id: "0-1",
                //     name: "1次"
                // },{
                //     id: "2-5",
                //     name: "2-5次"
                // },{
                //     id: "6-8",
                //     name: "6-8次"
                // },{
                //     id: "8",
                //     name: "8次以上"
                // }
            ],
            customerCount:'',
            customerRatio:'',
            newMemberCount:'',
            newMemberRatio:'',
            oldMemberCount:'',
            oldMemberRatio:'',
        }
    },
    computed:{
        allRatio(){
            if(this.newMemberRatio && this.oldMemberRatio){
                if((this.newMemberRatio*100 + this.oldMemberRatio*100) != 0){
                    return (this.newMemberRatio*100 + this.oldMemberRatio*100).toFixed(2)
                }
            }else{
                return 0
            }
        },
    },
    created(){
        this.goSearch()
        this.memberInforNum()
    },
    methods: {
        changeDay(){ },     
                //获取筛选数据
        getData(){
            if(this.form.daterange){
                this.form.timeType = 4;
                Object.assign(this.form,{
                    startTime:this.form.daterange[0],
                    endTime:this.form.daterange[1]
                });
            }else{
                Object.assign(this.form,{
                    startTime:null,
                    endTime:null
                });
            }
        },

        //获取交易次数
        memberInforNum(){
            this._apis.data.memberInforNum({type:1}).then(res => {   
                let reviseitem =[];             
                for(let item of res){                   
                    reviseitem.push({
                        id:item.id,
                        value:item.minNum+'-'+ item.maxNum,
                        name:item.name
                    })                  
                }
                  this.tradeCount=reviseitem;
            }).catch(error =>{
                console.log('error',error)
            })
        },

        //查询
        goSearch(){
            if((this.lowprice != '' && this.highprice == '' ) || (this.lowprice == '' && this.highprice != '' )){
                this.$message.warning('最低金额于最高金额需要同时输入')
                return
            }else if(this.lowprice - this.highprice > 0){
                this.$message.warning('最高金额不能低于最低金额')
                return
            }else if(this.lowprice&&this.highprice){
                this.form.MoneyRange =  String(this.lowprice)+'-'+String(this.highprice);
            } 
            let memberType = this.form.memberType;
            this._apis.data.memberInformation(this.form).then(res => {
                this.repeatPaymentRatio = res.repeatPaymentRatio;
                this.listObj = res; //信息列表数据
                this.totalCount = res.totalPage * this.form.pageSize;
                this.textTips = true;
                this.newMemberCount = res.newMemberCount;
                this.newMemberRatio = res.newMemberRatio || 0;
                this.oldMemberCount = res.oldMemberCount;
                this.oldMemberRatio = res.oldMemberRatio || 0;
                this.customerCount = res.customerCount;
                this.customerRatio = res.customerRatio || 0;
                // if(memberType == 1){ //新会员
                //     this.textTips = true;
                //     this.newMemberCount = res.newMemberCount;
                //     this.newMemberRatio = res.newMemberRatio;
                // }else if(memberType == 2){ //老会员
                //     this.textTips = true;
                //     this.oldMemberCount = res.oldMemberCount;
                //     this.oldMemberRatio = res.oldMemberRatio;
                // }else if(memberType == 0){ //非会员
                //     this.textTips = true;
                //     this.customerCount = res.customerCount;
                //     this.customerRatio = res.customerRatio;
                // }else{ //其他
                //     this.textTips = false;
                // }
            }).catch(error => {
                this.$message.error(error);
            });
        },
        // 重置
        reSet(){
            this.form = {
                startTime:null, //2019-08-07 12:12:12
                endTime:null,
                daterange:null,
                memberType:null,  //客户是0，新会员是1，老会员是2
                tradeCountRange:null,
                queryRepeatPaymentRatio: false,
                queryOrderMoneyType: null, // 单次和总额 0和1
                MoneyRange:null,
                timeType:1,
                startIndex:1,
                pageSize:10
            }
            this.lowprice = ''
            this.highprice = ''
            this.goSearch();
        },
        //重新筛选
        reScreening(){
            this.form.startIndex = 1;
            this.goSearch()
            // this.$router.push('/intelligentOperation/memberInfo');
        },
        //导出
        mIexport(){
            let data = {};
            data.startTime = this.form.startTime || null
            data.endTime = this.form.endTime || null
            data.memberType = this.form.memberType
            data.tradeCountRange = this.form.tradeCountRange
            data.queryRepeatPaymentRatio = this.form.queryRepeatPaymentRatio
            data.queryOrderMoneyType = this.form.queryOrderMoneyType
            data.MoneyRange = this.form.MoneyRange
            data.timeType = this.form.timeType

            console.log(data)
            this._apis.data.memberInformationExport(data)
            .then(res => {
                window.open(res);
            })
            .catch(err=>{
                this.$message.error(err);
            })
        },
        sizeChange(val){
            this.form.pageSize = val;
            this.goSearch();
        },
        currentChange(val){
            this.form.startIndex = val;
            this.goSearch();
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/.el-checkbox.is-bordered{
    border: none;
}
/deep/.el-checkbox.is-bordered.el-checkbox--small .el-checkbox__inner{
    display: none;
}
/deep/.el-checkbox.is-bordered.el-checkbox--small{
    padding: 5px 10px 5px 10px;
    background:rgba(211,211,211,0.3);
}
/deep/.el-checkbox__label{
    padding-left: 0;
}
/deep/.el-checkbox.is-bordered+.el-checkbox.is-bordered{
    margin-left: 0;
}
/deep/.el-checkbox.is-bordered.is-checked{
    background:rgba(101,94,255,0.1);
}
.proposal{
    margin-left: 65px;
}
.m_container{
    background-color: #fff;
    padding: 10px 20px;
    .pane_container{
        color:#3D434A;
        padding: 10px;
        .input_wrap{
            display: inline-block;
            width: 450px;
        }
        .input_wrap2{
            display: inline-block;
            width: 140px;
        }
        .input_wrap3{
            display: inline-block;
            width: 200px;
        }
        .span_label{
            margin: 0 10px 0 25px;
        }
        .m_line{
            border-top: 1px dashed #D3D3D3;
            p{
                line-height: 70px;
                span{
                    color: #655EFF;
                }
            }
        }
    }
}
.mr10{
    margin-right:10px;
}
</style>


