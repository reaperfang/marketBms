/*评价 */
<template>
    <div class="m_container">
         <div class="pane_container head-wrapper">
                    <el-form class="clearfix" :inline="true">
                        <el-form-item label="交易时间">
                            <div class="p_line">
                    <el-radio-group v-model="form.timeType">
                        <el-radio-button class="btn_bor" label="1">最近7天</el-radio-button>
                        <el-radio-button class="btn_bor" label="2">最近15天</el-radio-button>
                        <el-radio-button class="btn_bor" label="3">最近30天</el-radio-button>
                        <el-radio-button class="btn_bor" label="5">最近一季度</el-radio-button>
                        <el-radio-button class="btn_bor" label="4">自定义时间</el-radio-button>
                        </el-radio-group>
                        <div class="input_wrap" v-if="form.timeType == 4">
                        <el-date-picker
                            v-model="dateRange"
                            type="datetimerange"
                            align="right"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="Object.assign(utils.globalTimePickerOption.call(this, false), this.pickerOptions)"
                            @change="changeTime"
                        ></el-date-picker>
                        </div>
                    </div>
                        </el-form-item>
                        <el-form-item label="满意率">
                            <div class="input_wrap2">
                                <el-select v-model="form.niceRatioRange">
                                  <el-option v-for="item in satisfaction" :label="item.name" :value="item.value" :key="item.id"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item label="差评率">
                            <div class="input_wrap2">
                                <el-select v-model="form.badRatioRange">
                                  <el-option v-for="item in badreviews" :label="item.name" :value="item.value" :key="item.id"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item label="用户类型">
                            <div class="input_wrap2">
                                <el-select v-model="form.memberType">
                                    <el-option label="全部" value="null"></el-option>
                                    <el-option label="非会员" value="0"></el-option>
                                    <el-option label="新会员" value="1"></el-option>
                                    <el-option label="老会员" value="2"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" class="minor_btn"  @click="getEvaluation(1,10)">查 询</el-button>
                            <el-button type="primary" class="border_btn" @click="resetAll()">重 置</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="m_line clearfix" v-if="listObj">
                        <p style="line-height:40px;">该筛选条件下：会员共计<span>{{listObj.memberCount || 0}}</span>人，
                        占用户总数的<span>{{listObj.ratio ? (listObj.ratio*100).toFixed(2) : 0}}%</span>；</p>
                        <p style="line-height:40px;">其中订单总计<span>{{listObj.orderCount || 0}}</span>个，
                        商品总计<span>{{listObj.goodsCount || 0}}</span>个，
                        满意商品数共计<span>{{listObj.niceGoodsCount}}</span>个,
                        满意率<span>{{listObj.niceGoodsRatio ? (listObj.niceGoodsRatio*100).toFixed(2) : 0}}%</span>；
                        差评商品数共计<span>{{listObj.badGoodsCount || 0}}</span>个，
                        差评率<span>{{listObj.badGoodsRatio ? (listObj.badGoodsRatio*100).toFixed(2) : 0}}%</span>。</p>
                    </div>
                    <div class="m_line clearfix">
                        <div class="fr fr_mar5">
                            <!-- <el-button class="minor_btn" @click="rescreen()">重新筛选</el-button> -->
                            <el-tooltip content="当前最多支持导出1000条数据" placement="top">
                            <el-button class="yellow_btn" icon="el-icon-share" @click="exportExl()">导出</el-button>
                            </el-tooltip>
                        </div>
                    </div>
                    <ma4Table class="marT20s" :listObj="listObj" @getEvaluation="getEvaluation"></ma4Table>
                </div>
                <div v-if="listObj.members != undefined && (showNote || showNote1)">
                    <p>运营建议：</p>
                    <p class="proposal" v-if="showNote"><b>满意率{{note.label}} ：</b>{{note.suggest}}</p>
                    <p class="proposal" v-if="showNote1"><b>差评率{{note1.label}} ：</b>{{note1.suggest}}</p>
                </div>
                <div class="contents"></div>
                <div v-if ="form.loads == true" class="loadings"><img src="../../assets/images/loading.gif" alt=""></div>
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData"></component>
    </div>
</template>
<script>
import ma4Table from './components/ma4Table';
import exportTipDialog from '@/components/dialogs/exportTipDialog' //导出提示框 
export default {
    name: 'rightsProtection',
    components: { ma4Table ,exportTipDialog },
    data() {
        return {
            form: {
                niceRatioRange:null,
                badRatioRange: null,
                endTime:'',
                startTime:'',
                timeType:1,
                memberType:null,
                pageSize:10,
                loads:false,
                startIndex:1,
            },
            range:'',
            listObj:{
               
            },
            satisfaction:[],  //满意率
            badreviews:[],  //差评率       
            pickerMinDate: '',
            dateRange: [],
            pickerOptions: {
                disabledDate: (time) => {
                    let yesterday = new Date();
                    yesterday = yesterday.getTime()-24*60*60*1000;
                    yesterday = this.utils.dayEnd(yesterday);
                    return time.getTime() > yesterday.getTime();
                }
            },
            note:'',
            note1:'',
            showNote:false,
            showNote1:false,
            currentDialog:"",
            dialogVisible: false,
            currentData:{}
        }
    },
    methods: {
        // 查询
        getEvaluation(idx,pageS){
            this.form.loads = true
            this.form.pageSize = pageS;
            this.form.startIndex = idx;
            this.form.memberType == 'null' && (this.form.memberType = null)
            this.form.niceRatioRange == 'null' && (this.form.niceRatioRange = null)
            this.form.badRatioRange == 'null' && (this.form.badRatioRange = null)
            this._apis.data.evaluation(this.form).then(response => {
                this.listObj = response;
                this.form.loads = false
                //切换满意率或差评率获取运营建议
                for(let item of this.satisfaction){
                    if(item.value == this.form.niceRatioRange){
                        this.note = {
                            suggest:item.suggest,
                            label:item.name
                        }
                        item.suggest != null && (this.showNote = true)
                    }
                }
                for(let item of this.badreviews){
                    if(item.value == this.form.badRatioRange){
                        this.note1 = {
                            suggest:item.suggest,
                            label:item.name
                        }
                        item.suggest != null && (this.showNote1 = true)
                    }
                }
            })
        },
        //获取口碑满意率
         memberInforNum(){
            this._apis.data.memberInforNum({type:5}).then(res => { 
                let pleased = [];
                for(let item of res){
                    pleased.push({
                        id: item.id,
                        value: item.minNum+'-'+ item.maxNum,
                        name: item.name,
                        suggest:item.suggest
                    })
                }
                this.satisfaction = pleased
            }).catch(error =>{
                console.log('error',error)
            })
        },
        //获取口碑差评率
          membercha(){
            this._apis.data.memberInforNum({type:7}).then(res => { 
                let differences = [];
                for(let item of res){
                    differences.push({
                        id: item.id,
                        value: item.minNum+'-'+item.maxNum,
                        name: item.name,
                        suggest:item.suggest
                    })
                }
                this.badreviews = differences
            }).catch(error =>{
                console.log('error',error)
            })
        },
        changeTime(val){
            this.form.startTime = val[0]
            this.form.endTime = val[1]
            // console.log(this.form)
        },
        // 重置
        resetAll(){
            this.form = {
                niceRatioRange:null,
                badRatioRange: null,
                endTime:'',
                startTime:'',
                timeType:1,
                pageSize:10,
                startIndex:1,
            },
            this.getEvaluation(1,10)
        },
        // 重新筛选
        rescreen(){
            this.getEvaluation()
        },
        // 导出
        exportExl(){
            if(this.listObj.memberCount && this.listObj.memberCount > 1000 ){
                this.dialogVisible = true
                this.currentDialog = exportTipDialog
                this.currentData.query = this.form
                this.currentData.api = "data.evaluationExport"
            }else{
                this._apis.data.evaluationExport(this.form).then(response => {
                    window.location.href = response
                })
            } 
        },
         getDay(day){
        　　var today = new Date();  
        　　var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
        　　today.setTime(targetday_milliseconds); //注意，这行是关键代码
        　　var tYear = today.getFullYear();
        　　var tMonth = today.getMonth();
        　　var tDate = today.getDate();
        　　tMonth = doHandleMonth(tMonth + 1);
        　　tDate = doHandleMonth(tDate);
        　　return tYear+"-"+tMonth+"-"+tDate;
        },
        doHandleMonth(month){
        　　var m = month;
        　　if(month.toString().length == 1){
        　　　　m = "0" + month;
        　　}
        　　return m;
        }
    },
    created(){
        this.getEvaluation();
        this.memberInforNum();
        this.membercha();
    }
}
</script>
<style lang="scss" scoped>

/**
*
* @Author zpw
* @Update 2020/4/17
* @Description  产研-电商中台  bugID: CYDSZT-3505
*
*/

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
    .el-button--small{
        border: 1px solid #655EFF;
        color: #655EFF;
        background-color: #ffffff;
    }
	.minor_btn{
		background-color: #655EFF;
		color:#fff;
	}
    .fr_mar5{
        margin-top:10px;
    }
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
.marT20s{
    position: relative;
    top:10px;
}
.contents{
    width: 100%;
    height: 45px;
    background: #fff;
}
.loadings{
    width: 220px;
    height: 220px;
    position: absolute;
    left: 53%;
    top: 34%;
    transform: translate(-50%,-50%);
}
.loadings>img{
     width: 220px;
     height: 220px;
}
</style>
