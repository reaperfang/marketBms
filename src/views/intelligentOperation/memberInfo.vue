<template>
<div class="m_container mh">
        <div class="pane_container head-wrapper">
            <el-form ref="form" :model="form" class="clearfix">
                <el-form-item label="交易时间">
                    <div class="p_line">
                        <el-radio-group v-model="form.timeType" @change="changeDay">
                            <el-radio-button class="btn_bor" label="1">最近7天</el-radio-button>
                            <el-radio-button class="btn_bor" label="2">最近15天</el-radio-button>
                            <el-radio-button class="btn_bor" label="3">最近30天</el-radio-button>
                            <el-radio-button class="btn_bor" label="5">本季度</el-radio-button>
                            <el-radio-button class="btn_bor" label="4">自定义时间</el-radio-button>
                        </el-radio-group>
                        <el-date-picker
                        v-if="form.timeType == 4"
                        v-model="form.daterange"
                        type="datetimerange"
                        align="right"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :editable="false"
                        @focus="utils.globalTimeDisabledFocus"
                        :picker-options="Object.assign(utils.globalTimePickerOption.call(this, false), this.pickerOptions)"
                        @change="getData"
                    >
                    </el-date-picker>
                    </div>
                    
                </el-form-item>
                <el-form-item label="用户类型">
                    <div class="input_wrap2">
                        <el-select v-model="form.memberType">
                            <el-option v-for="item in customType" :label="item.name" :value="item.id" :key="item.id"></el-option>
                        </el-select>
                    </div>
                    <span class="span_label">交易次数</span>
                    <div class="input_wrap2 marR20">
                        <el-select v-model="form.tradeCountRange">
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
                    <div class="marL26">
                        <el-button type="primary" class="minor_btn"  @click="goSearch(1)">查 询</el-button>
                        <el-button type="primary" class="border_btn" @click="reSet" style="margin-left:16px;">重 置</el-button>
                    </div>
                </el-form-item>
                <!-- <el-form-item class="marT20">
                    <el-button type="primary" class="minor_btn" icon="el-icon-search" @click="goSearch()">查询</el-button>
                    <el-button type="primary" class="border_btn" @click="reSet">重 置</el-button>
                </el-form-item> -->
            </el-form>

            <div class="m_line clearfix">
                <p class="fl">该筛选条件下：
                    <i v-if="form.memberType== null" style="font-style:normal">
                        全部会员共计<span>{{newMemberCount + oldMemberCount || 0}}</span>人；
                        占用户总数的<span>{{allRatio}}%</span>;    
                    </i>
                    <i v-if="form.memberType==0" style="font-style:normal">
                        非会员共计<span>{{customerCount || 0}}</span>人；
                        占用户总数的<span>{{customerRatio != 0 ? (customerRatio*100).toFixed(2) : 0}}%</span>;    
                    </i>
                    <i v-if="form.memberType==1" style="font-style:normal">
                        新会员共计<span>{{newMemberCount || 0}}</span>人；
                        占用户总数的<span>{{newMemberRatio != 0 ? (newMemberRatio*100).toFixed(2) : 0}}%</span>;
                    </i>
                    <i v-if="form.memberType==2" style="font-style:normal">
                        老会员共计<span>{{oldMemberCount || 0}}</span>人；
                        占用户总数的<span>{{oldMemberRatio != 0 ? (oldMemberRatio*100).toFixed(2) : 0}}%</span>;    
                    </i>
                    <i v-if="repeatPaymentRatio != undefined" style="font-style:normal">复购率为<span>{{repeatPaymentRatio !=0 ? (repeatPaymentRatio*100).toFixed(2) : 0}}%</span>。</i>
                </p>
                <div class="fr marT20">
                    <!-- <el-button class="minor_btn" @click="reScreening">重新筛选</el-button> -->
                    <el-tooltip content="当前最多支持导出1000条数据" placement="top">
                        <el-button class="yellow_btn" icon="el-icon-share" @click="mIexport">导出</el-button>
                    </el-tooltip>
                </div>
            </div>
            <maTable class="marT20s" 
                @sizeChange = "sizeChange"
                @currentChange = "currentChange"                   
                :listObj="listObj" 
                :loading="loading"
                :nowPage="nowPage"
                :totalCount="totalCount">
            </maTable>
        </div>
        <div v-if="listObj.members != undefined && showNote">
            <p>运营建议：</p>
            <p class="proposal"><b>交易次数{{note.label}} ：</b>{{note.suggest}}</p>
        </div>
            <!-- <div v-if ="form.loads == true" class="loadings"><img src="../../assets/images/loading.gif" alt=""></div> -->
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData"></component>
        </div>
</template>
<script>
import maTable from './components/maTable';
import exportTipDialog from '@/components/dialogs/exportTipDialog' //导出提示框 
import utils from '@/utils'
export default {
    name: 'memberInfo',
    components: { maTable ,exportTipDialog },
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
                loads:false,
            },  
            nowPage: 1,          
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
            tradeCount: [  ],
            customerCount:'',
            customerRatio:'',
            newMemberCount:'',
            newMemberRatio:'',
            oldMemberCount:'',
            oldMemberRatio:'',
            note:'',
            showNote:false,
            currentDialog:"",
            dialogVisible: false,
            currentData:{},
            loading: true
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

        getDate(date) {
            return utils.formatDate(new Date(date), "yyyy-MM-dd hh:mm:ss");
        },

        //获取交易次数
        memberInforNum(){
            this._apis.data.memberInforNum({type:1}).then(res => {   
                let reviseitem =[];             
                for(let item of res){                   
                    reviseitem.push({
                        id:item.id,
                        value:item.minNum+'-'+ item.maxNum,
                        name:item.name,
                        suggest:item.suggest
                    })                  
                }
                  this.tradeCount=reviseitem;
            }).catch(error =>{
                console.error('error',error)
            })
        },
        //查询
        goSearch(num){ 
            //  this.form.tradeCountRange == 'null' && (this.form.tradeCountRange = null)
            if(this.form.queryOrderMoneyType != null){
                 if(this.lowprice == '' || this.highprice == '' ){
                    this.$message.warning('当前金额不能为空、请您输入重新查询')
                    return
                }else if(this.lowprice - this.highprice > 0){
                    this.$message.warning('最高金额不能低于最低金额')
                    return
                }else if(this.lowprice&&this.highprice){
                    this.form.MoneyRange =  String(this.lowprice)+'-'+String(this.highprice);
                } 
            }
            if(this.form.timeType == 4 && !this.form.daterange){
                this.$message.warning('请选择查询时间')
                return
            }
            this.form.startIndex = num || this.form.startIndex
            this.nowPage = this.form.startIndex;
            this.form.loads = true
            this.loading = true;
            // let memberType = this.form.memberType;
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
                this.form.loads = false
                this.loading = false;
                // this.note = this.form.tradeCountRange
                //切换交易次数获取运营建议
                for(let item of this.tradeCount){
                    if(item.value == this.form.tradeCountRange){
                        this.note = {
                            suggest:item.suggest,
                            label:item.name
                        }
                        item.suggest != null && (this.showNote = true)
                    }
                }

            }).catch(error => {
                this.form.loads = false;
                this.loading = false;
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
            this.showNote = false
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

            if(((this.newMemberCount ||  0) + (this.oldMemberCount || 0)) > 1000){
                this.dialogVisible = true
                this.currentDialog = exportTipDialog
                this.currentData.query = data
                this.currentData.api = "data.memberInformationExport"
            }else{
                this._apis.data.memberInformationExport(data)
                .then(res => {
                    window.location.href = res
                })
                .catch(err=>{
                    this.$message.error(err);
                })
            }    
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
.el-range-editor.el-input__inner {padding-top:1px;}
.m_container{
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    .el-button--small{
        border: 1px solid #655EFF;
        color: #655EFF;
        background-color: #ffffff;
    }
    .el-radio-group label:last-child{
        margin-left:0px;
    }
    .minor_btn{
        background-color: #655EFF;
        color:#fff;
    }
	.is-active{
		margin-top:-2px;
	}
    .pane_container{
        color:#3D434A;
        // padding: 10px;
        .input_wrap{
            display: inline-block;
            width: 450px;
        }
        .input_wrap2{
            display: inline-block;
        }
        .input_wrap3{
            display: inline-block;
            width: 234px;
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
.marT20s{
    position: relative;
}
.mr10{
    margin-right:25px;
}
.marL26{
	display: inline-block;
	margin-left: 20px;
}
.contents{
    width: 100%;
    height:45px;
    background: #fff;
}
.loadings{
    width: 500px;
    height: 500px;
    position: absolute;
    left: 60%;
    top: 53%;
    transform: translate(-50%,-50%);
}
.loadings>img{
    width: 220px;
    height: 220px;
}
</style>


