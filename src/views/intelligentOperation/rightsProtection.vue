/*维权 */
<template>
    <div class="m_container mh bor-radius">
        <div class="pane_container head-wrapper">
            <el-form class="clearfix">
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
                            @change="changeTime"
                        ></el-date-picker>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="维权类型">
                    <div class="input_wrap2">
                        <el-select v-model="form.protectionType">
                            <el-option label="不限" value="null"></el-option>
                            <el-option label="退款（仅退款不退货）" value="1"></el-option>
                            <el-option label="退款退货" value="2"></el-option>
                            <el-option label="换货" value="3"></el-option>
                        </el-select>
                    </div>
                    <span class="span_label">维权原因</span>
                    <div class="input_wrap2 marR20">
                        <el-select v-model="form.ProtectionReason">
                            <el-option v-for="item in reasons" :label="item.name" :value="item.id" :key="item.id"></el-option>
                        </el-select>
                    </div>
                        <span class="span_label">用户类型</span>
                    <div class="input_wrap2">
                        <el-select v-model="form.memberType">
                            <el-option label="全部" value="null"></el-option>
                            <el-option label="非会员" value="0"></el-option>
                            <el-option label="新会员" value="1"></el-option>
                            <el-option label="老会员" value="2"></el-option>
                        </el-select>
                    </div>
                    <div class="marL26">
                        <el-button type="primary" class="minor_btn" @click="getRightsProtection(1,10)">查 询</el-button>
                        <el-button type="primary" class="border_btn" @click="resetAll()" style="margin-left:16px;">重 置</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div class="m_line clearfix">
                <p style="line-height:40px;" v-if="listObj">
                该筛选条件下：会员共计<span>{{listObj.memberCount || 0}}</span>人，
                占用户总数的<span>{{listObj.ratio ? (listObj.ratio*100).toFixed(2) : 0}}%</span>；
                订单共计<span>{{listObj.orderCount || 0}}</span>个、商品总数共计<span>{{listObj.goodsCount || 0}}</span>个；
                维权次数共计<span>{{listObj.protectionCount || 0}}</span>次。
                </p>
            </div>
            <div class="m_line clearfix">
                <div class="fr marT20">
                    <!-- <el-button class="minor_btn" @click="rescreen()">重新筛选</el-button> -->
                    <el-tooltip content="当前最多支持导出1000条数据" placement="top">
                    <el-button class="yellow_btn" icon="el-icon-share" @click="exportExl()">导出</el-button>
                    </el-tooltip>
                </div>
            </div>
            <ma2Table class="marT20s" :listObj="listObj" @getRightsProtection="getRightsProtection" :nowPage="nowPage" :loading="loading"></ma2Table>
        </div>
        <div v-if="listObj.members != undefined && note" >
            <h3 class="marT20s">运营建议:</h3>
            <p v-if="note == 5" class="proposal"><b>"不想要了":</b>建议针对此类用户补偿商品优惠券，发放现金红包，更换升级版商品。</p>                
            <p v-if="note ==6" class="proposal"><b>"卖家缺货":</b>建议针对此类用户免费调换商品。</p>
            <p v-if="note ==8" class="proposal"><b>"拍错了/订单信息错误":</b>建议针对此类用户补偿商品优惠券，发放现金红包，更换升级版商品。</p>
        </div>
        <!-- <div v-if ="form.loads == true" class="loadings"><img src="../../assets/images/loading.gif" alt=""></div> -->
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData"></component>
    </div>
</template>
<script>
import ma2Table from './components/ma2Table';
import exportTipDialog from '@/components/dialogs/exportTipDialog' //导出提示框 
export default {
    name: 'rightsProtection',
    components: { ma2Table ,exportTipDialog},
    data() {
        return {
            form: {
                protectionType:null,
                ProtectionReason: null,
                endTime:'',
                startTime:'',
                daterange:null,
                timeType:1,
                memberType:null,
                pageSize:10,
                loads:false,
                startIndex:1
            },
            listObj:{
               
            },
            nowPage: 1,
            pickerMinDate: '',
            dateRange: [],
            reasons:[],
            pickerOptions: {
                disabledDate: (time) => {
                    let yesterday = new Date();
                    yesterday = yesterday.getTime()-24*60*60*1000;
                    yesterday = this.utils.dayEnd(yesterday);
                    return time.getTime() > yesterday.getTime();
                }
            },
            note:'',
            currentDialog:"",
            dialogVisible: false,
            currentData:{},
            loading: true
        }
    },
    methods: {
        //获取维权原因
        getReasons(){
            this._apis.data.getReasons().then(response => {
                this.reasons = response
            }).catch(error => {
                console.error(error)
            })
        },
        // 获取维权全部数据
        getRightsProtection(idx,pageS){
            if(this.form.timeType == 4 && !this.form.daterange){
                this.$message.warning('请选择查询时间')
                return
            }
            this.nowPage = idx;
            this.form.loads = true
            this.loading = true
            this.note = ''
            this.form.pageSize = pageS;
            this.form.startIndex = idx;
            this.form.protectionType == 'null' && (this.form.protectionType = null)
            this.form.ProtectionReason == 'null' && (this.form.ProtectionReason = null)
            this.form.memberType == 'null' && (this.form.memberType = null)
            this._apis.data.rightsProtection(this.form).then(response => {
                this.listObj = response;
                this.form.loads = false
                this.loading = false
                this.note = this.form.ProtectionReason
            }).catch(error => {
                this.form.loads = false;
                this.$message.error(error);
                this.loading = false
            })
        },
        changeTime(val){
            this.form.startTime = val[0]
            this.form.endTime = val[1]
        },
        // 重置
        resetAll(){
            this.form = {
                protectionType:null,
                ProtectionReason: null,
                endTime:'',
                startTime:'',
                timeType:1,
                startIndex:1,
                pageSize:10
            },
            this.node = ''
            this.getRightsProtection(1,10)
        },
        // 重新筛选
        rescreen(){
            this.getRightsProtection()
        },
        // 导出
        exportExl(){
            if(this.listObj.memberCount && this.listObj.memberCount > 1000 ){
                this.dialogVisible = true
                this.currentDialog = exportTipDialog
                this.currentData.query = this.form
                this.currentData.api = "data.exportOfrights"
            }else{
                this._apis.data.exportOfrights(this.form).then(response => {
                    window.location.href = response
                }).catch(error => {
                    console.error(error)
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
        this.getRightsProtection()
        this.getReasons()
    }
}
</script>
<style lang="scss" scoped>

/**
*
* @Author zpw
* @Update 2020/4/17
* @Description  产研-电商中台  bugID: CYDSZT-3506
*
*/
.el-radio-group{
  label {
    margin-left: 0;
  }
}
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
    line-height: 50px;
}

.m_container{
    background-color: #fff;
    padding: 20px;
    .el-button--small{
        border: 1px solid #655EFF;
        color: #655EFF;
        background-color: #ffffff;
    }
	.minor_btn{
		background-color: #655EFF;
		color:#fff;
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
    // position: relative;
    margin-top:10px;
}
.marL26{
    margin-left:26px;
    display:inline-block;
}
.contents{
    width: 100%;
    height: 45px;
    background: #fff;    
}
.loadings{
    width: 500px;
    height: 500px;
    position: absolute;
    left: 60%;
    top: 43%;
    transform: translate(-50%,-50%);
}
.loadings>img{
    width: 220px;
    height: 220px;
}
</style>
