<template>
    <div class="m_container">
        <div class="pane_container">
                <el-form>
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
                        
                    <el-form-item label="转化渠道">
                        <div class="input_wrap2">
                            <el-select v-model="form.channel" @change="changeTime">
                                <el-option label="不限" value="null"></el-option>
                                <el-option label="直接购买" value="1"></el-option>
                                <el-option label="活动类型" value="2"></el-option>
                            </el-select>
                        </div>
                        <span class="span_label">（成功）支付转化率</span>
                        <div class="input_wrap2 marR20">
                            <el-select v-model="form.changeRatioRange" @change="changeTime">
                                <el-option v-for="item in productiveness" :label="item.name" :value="item.value" :key="item.id"></el-option>
                                <!-- <el-option label="0-1%" value="1"></el-option>
                                <el-option label="1-3%" value="2"></el-option>
                                <el-option label="3-5%" value="3"></el-option>
                                <el-option label="5-10%" value="4"></el-option>
                                <el-option label="10%以上" value="5"></el-option> -->
                            </el-select>
                        </div>
                    </el-form-item>

                    <el-form-item class="marT20">
                        <div class="buttonfl">
                            <el-button class="minor_btn" icon="el-icon-search" @click="goSearch">查询</el-button>
                            <el-button class="border_btn" @click="reSet">重 置</el-button>
                        </div>
                    </el-form-item>
                </el-form>

                <div class="m_line clearfix">
                    <div class="fr marT20">
                        <el-button class="border_btn" @click="showDetails">查看详情</el-button>
                        <el-button class="minor_btn" @click="reScreening">重新筛选</el-button>
                        <el-button class="yellow_btn" icon="el-icon-share" @click="exportExl">导出</el-button>
                    </div>
                </div>
                
                <channel-table 
                    class="marT20" 
                    :listObj="listObj"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange"
                >
                </channel-table>               
            </div>
            <p>运营建议:</p>
                <p v-if="form.changeRatioRange==1" class="proposal"><b>"转化率0-1%"：</b>建议针对此类用户推荐积分商城、积分兑换，充值赠送：如100送30，来提升转化率。</p> 
                <p v-if="form.changeRatioRange==2" class="proposal"><b>"转化率1-3%"：</b>建议针对此类用户推荐营销活动“活动海报”：推荐3-5人赠送积分或余额、推荐5-10人赠送积分或余额，来提升转化率。</p> 
                <p v-if="form.changeRatioRange==3" class="proposal"><b>"转化率3-5%"：</b>建议针对此类用户可设定分销机制，推荐积分商城、积分兑换，充值赠送：如100送30，来提升转化率。</p> 
                <p v-if="form.changeRatioRange==4" class="proposal"><b>"转化率5-10%"：</b>建议针对此类用户可设定分销机制，推荐积分商城、积分兑换，充值赠送：如100送30，还可推荐营销活动“活动海报”：推荐3-5人赠送积分或余额、推荐5-10人赠送积分或余额，来提升转化率。</p> 
                <p v-if="form.changeRatioRange==5" class="proposal"><b>"转化率10%以上"：</b>建议针对此类用户可设定分销机制，推荐积分商城、积分兑换，充值赠送：如100送30，还可推荐营销活动“活动海报”：推荐3-5人赠送积分或余额、推荐5-10人赠送积分或余额，来提升转化率。</p> 

    </div>
</template>
<script>
import channelTable from './components/channelTable';
export default {
    name: 'channel',
    components: { channelTable },
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
                        maxTime = new Date() - 8.64e7
                    }
                    return time.getTime() > maxTime || time.getTime() == this.pickerMinDate
                    }
                    return time.getTime() > Date.now()
                }
            },
            form: {
                startTime:null,
                endTime:null,
                channel:null,
                changeRatioRange:null,
                timeType:1,
                startIndex:1,
                pageSize: '10',
            },
            productiveness:[

            ],
            listObj:{
                list:[]
            },
            totalCount:0,//总页数
            pickerMinDate: '',
            dateRange: [],
        }
    },
    mounted(){
        this.goSearch();
        this.memberInforNum();
    },
    methods: {
        changeTime(val){
            this.form.startTime = val[0]
            this.form.endTime = val[1]
        },
        //查询
        goSearch(){
            this.form.channel == 'null' && (this.form.channel = null)
            this.form.changeRatioRange == 'null' && (this.form.changeRatioRange = null)
            this._apis.data.channelConversion(this.form).then(response => {
                this.listObj = response;
                // console.log(response)
            })
        },
        // 重置
        reSet(){
            this.form = {
                startTime:null,
                endTime:null,
                channel:null,
                changeRatioRange:null,
                timeType:1,
                startIndex:1,
                pageSize: '10',
            }
            this.goSearch();
        },
        //重新筛选
        reScreening(){
            this.goSearch();
            // this.$router.push('/intelligentOperation/channel')
        },
        //导出
        exportExl(){
            let data = {};
            data.startTime = this.form.startTime
            data.endTime = this.form.endTime
            if(this.form.channel!='null'){
                data.channel = Number(this.form.channel);
            }else{
                data.channel = null
            }
            data.changeRatioRange = this.form.changeRatioRange     
            data.timeType = this.form.timeType
            this._apis.data.channelConversionExport(data)
            .then(res => {
                window.open(res);
            })
            .catch(err=>{
                this.$message.error(err);
            })
        },
         //获取会员直接购买转化率
        memberInforNum(){
            this._apis.data.memberInforNum({type:2}).then(res => {   
                let vipcake = [];
                for(let item of res){
                    vipcake.push({
                        id:item.id,
                        value:item.minNum+'-'+item.maxNum,
                        name:item.name
                    })                   
                }
                this.productiveness = vipcake
            }).catch(error =>{
                console.log('error',error)
            })
              this.goSearch();
        },
        //查看详情
        showDetails(){
            this._routeTo('channelDetail',this.form)
        },
        sizeChange(val){
            this.form.pageSize = val;
            this.goSearch();
        },
        currentChange(val){
            this.form.startIndex = val;
            this.goSearch();
        },
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
.buttonfl{
    -webkit-box-pack: end;
    display: -webkit-box;
}
</style>
