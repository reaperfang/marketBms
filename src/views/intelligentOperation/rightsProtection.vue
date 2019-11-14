/*维权 */
<template>
    <div class="m_container">
         <div class="pane_container">
                    <el-form class="clearfix">
                        <el-form-item label="交易时间">
                            <div class="p_line">
                    <el-radio-group v-model="form.timeType">
                        <el-radio-button class="btn_bor" label="1">7天</el-radio-button>
                        <el-radio-button class="btn_bor" label="2">15天</el-radio-button>
                        <el-radio-button class="btn_bor" label="3">30天</el-radio-button>
                        <el-radio-button class="btn_bor" label="5">最近一季度</el-radio-button>
                        <el-radio-button class="btn_bor" label="4">自定义时间</el-radio-button>
                        </el-radio-group>
                        <div class="input_wrap" v-if="form.timeType == 4">
                        <el-date-picker
                            v-model="dateRange"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="—"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
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
                             <span class="span_label">客户类型</span>
                            <div class="input_wrap2 marR20">
                                <el-select v-model="form.memberType">
                                    <el-option label="全部" value="null"></el-option>
                                    <el-option label="非会员" value="0"></el-option>
                                    <el-option label="新会员" value="1"></el-option>
                                    <el-option label="老会员" value="2"></el-option>
                                </el-select>
                            </div>
                            <el-button class="minor_btn" icon="el-icon-search" @click="getRightsProtection()">查询</el-button>
                            <el-button class="border_btn" @click="resetAll()">重 置</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="m_line clearfix">
                        <p style="line-height:40px;" v-if="listObj">
                        该筛选条件下：会员共计<span>{{listObj.memberCount || 0}}</span>人，
                        占客户总数的<span>{{listObj.ratio ? (listObj.ratio*100).toFixed(2) : 0}}</span>%；
                        订单共计<span>{{listObj.orderCount || 0}}</span>个、商品总数共计<span>{{listObj.goodsCount || 0}}</span>个；
                        维权次数共计<span>{{listObj.protectionCount || 0}}</span>次；
                        </p>
                    </div>
                    <div class="m_line clearfix">
                        <div class="fr marT20">
                            <el-button class="minor_btn" @click="rescreen()">重新筛选</el-button>
                            <el-tooltip content="当前最多支持导出1000条数据" placement="top">
                            <el-button class="yellow_btn" icon="el-icon-share" @click="exportExl()">导出</el-button>
                            </el-tooltip>
                        </div>
                    </div>
                    <ma2Table class="marT20s" :listObj="listObj" @getRightsProtection="getRightsProtection"></ma2Table>
                </div>
                <h3 
                class="marT20s"
                v-if="form.ProtectionReason==5 || form.ProtectionReason==6 || form.ProtectionReason==8" 
                >运营建议:</h3>
                <p v-if="form.ProtectionReason==5" class="proposal"><b>"不想要了":</b>建议针对此类用户补偿商品优惠券，发放现金红包，更换升级版商品。</p>                
                <p v-if="form.ProtectionReason==6" class="proposal"><b>"卖家缺货":</b>建议针对此类用户免费调换商品。</p>
                <p v-if="form.ProtectionReason==8" class="proposal"><b>"拍错了/订单信息错误":</b>建议针对此类用户补偿商品优惠券，发放现金红包，更换升级版商品。</p>
                <div class="contents"></div>
                <div v-if ="form.loads == true" class="loadings"><img src="../../assets/images/loading.gif" alt=""></div>
    </div>
</template>
<script>
import ma2Table from './components/ma2Table';
export default {
    name: 'rightsProtection',
    components: { ma2Table },
    data() {
        return {
            form: {
                protectionType:null,
                ProtectionReason: null,
                endTime:'',
                startTime:'',
                timeType:1,
                memberType:null,
                pageSize:10,
                loads:false,
                startIndex:1
            },
            listObj:{
               
            },
            pickerMinDate: '',
            dateRange: [],
            reasons:[],
            pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                    this.pickerMinDate = minDate.getTime()
                    if (maxDate) {
                    this.pickerMinDate = ''
                    }
                },
                disabledDate: (time) => {
                    if (this.pickerMinDate !== '') {
                    const day30 = (90 - 1) * 24 * 3600 * 1000
                    let maxTime = this.pickerMinDate + day30
                    if (maxTime > new Date()) {
                        maxTime = new Date() - 8.64e7
                    }
                    return time.getTime() > maxTime || time.getTime() == this.pickerMinDate
                    }
                    return time.getTime() > Date.now() - 8.64e7
                }
            },
        }
    },
    methods: {
        //获取维权原因
        getReasons(){
            this._apis.data.getReasons().then(response => {
                this.reasons = response
            })
        },
        // 获取维权全部数据
        getRightsProtection(idx,pageS){
            this.form.loads = true
            this.form.pageSize = pageS;
            this.form.startIndex = idx;
            this.form.protectionType == 'null' && (this.form.protectionType = null)
            this.form.ProtectionReason == 'null' && (this.form.ProtectionReason = null)
            this.form.memberType == 'null' && (this.form.memberType = null)
            this._apis.data.rightsProtection(this.form).then(response => {
                this.listObj = response;
                this.form.loads = false
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
            this.getRightsProtection(1,10)
        },
        // 重新筛选
        rescreen(){
            this.getRightsProtection()
        },
        // 导出
        exportExl(){
            this._apis.data.exportOfrights(this.form).then(response => {
                window.open(response);
            })
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
.marT20s{
    // position: relative;
    margin-top:10px;
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
