/*积分消耗 */
<template>
    <div class="m_container">
         <div class="pane_container">
            <el-form ref="form" :model="form" class="clearfix">
                <el-form-item label="交易时间">
                    <div class="p_line">
                        <el-radio-group v-model="form.timeType">
                            <el-radio-button class="btn_bor" label="1">7天</el-radio-button>
                            <el-radio-button class="btn_bor" label="2">15天</el-radio-button>
                            <el-radio-button class="btn_bor" label="3">30天</el-radio-button>
                            <el-radio-button class="btn_bor" label="5">本季度</el-radio-button>
                            <el-radio-button class="btn_bor" label="4">自定义时间</el-radio-button>
                        </el-radio-group>
                        <el-date-picker
                        v-if="form.timeType == 4"
                        v-model="daterange"
                        type="daterange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="getData">
                    </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="消耗次数">
                    <div class="input_wrap2">
                        <el-select v-model="form.scorePaymentCountRange" @change="getData">
                           <el-option label="1-5次" value="1"></el-option>
                           <el-option label="5-10次" value="2"></el-option>
                           <el-option label="10-15次" value="3"></el-option>
                           <el-option label="15次以上" value="4"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="会员类型">
                    <div class="input_wrap2">
                        <el-select v-model="form.memberType"  @change="getData">
                            <el-option v-for="item in customType" :label="item.name" :value="item.id" :key="item.id"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item class="fr marT20">
                    <el-button class="minor_btn" icon="el-icon-search" @click="goSearch">查询</el-button>
                    <el-button class="border_btn" @click="reSet">重 置</el-button>
                </el-form-item>
            </el-form>
            <div class="m_line clearfix">
                <p class="fl">该筛选条件下：会员共计<span>{{memberCount || 0}}</span>人；占客户总数的<span>{{ratio ? (ratio*100).toFixed(2) : 0}}%</span>
                <div class="fr marT20">
                    <el-button class="minor_btn" @click="reScreening()">重新筛选</el-button>
                    <el-button class="yellow_btn" icon="el-icon-share" @click="exportExl">导出</el-button>
                </div>
            </div>
            <ma3Table 
                class="marT20" 
                @sizeChange="sizeChange"
                @currentChange="currentChange"
                :pageSize="10"
                :listObj="listObj"
                :totalCount="listObj.totalSize">
            </ma3Table>
        </div>
        <p>运营建议:</p>
            <p v-if="form.scorePaymentCountRange==1" class="proposal"><b>"消耗次数1-5次："</b>建议1-2个月内进行产品更新换代，让用户有新鲜感，针对此用户推荐“签到有礼”活动，来提升积分的赚取、从而促使其积分的消耗。</p> 
            <p v-if="form.scorePaymentCountRange==2" class="proposal"><b>"消耗次数5-10次："</b>建议1-2个月内进行产品更新换代，让用户有新鲜感，针对此用户推荐“签到有礼”活动，来提升积分的赚取、从而促使其积分的消耗。</p> 
            <p v-if="form.scorePaymentCountRange==3" class="proposal"><b>"消耗次数10-15次："</b>建议1-2个月内进行产品更新换代，让用户有新鲜感，针对此用户推荐“签到有礼”活动，来提升积分的赚取、从而促使其积分的消耗。</p> 
            <p v-if="form.scorePaymentCountRange==4" class="proposal"><b>"消耗次数15次以上："</b>建议1-2个月内进行产品更新换代，让用户有新鲜感，针对此用户推荐“签到有礼”活动，来提升积分的赚取、从而促使其积分的消耗。</p> 
    </div>
</template>
<script>
import ma3Table from './components/ma3Table';
export default {
    name: 'integral',
    components: { ma3Table },
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
                    return time.getTime() > maxTime
                    }
                    return time.getTime() > Date.now() - 8.64e7
                }
            },
            daterange:'',
            form: {
                startTime:null,
                endTime:null,
                scorePaymentCountRange:null,
                memberType:null,
                timeType:1,
                startIndex:1,
                pageSize:10
            },
            memberCount:0, //会员数
            ratio:0, //会员占比
            listObj:{}, //表格数据
            totalCount:0,//总条数
            consumTimes: [

            ],
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
        }
    },
    created(){
        this.goSearch();
        this.memberInforNum();
    },
    methods: {
        checkDay(item) {
            this.day = item;
        },
        getData() {
            if(this.daterange){
                this.form.timeType = 4;
                Object.assign(this.form,{
                    startTime:this.daterange[0],
                    endTime:this.daterange[1]
                });
            }else{
                Object.assign(this.form,{
                    startTime:null,
                    endTime:null
                });
            }
            console.log(this.form)
        },
        //
        //查询
        goSearch(){
            let memberType = this.form.memberType;
            this.form.scorePaymentCountRange == 'null' && (this.form.scorePaymentCountRange = null)
            this._apis.data.integralconsumption(this.form).then(res => {
                this.memberCount = res.memberCount;
                this.ratio = res.ratio;
                this.listObj = res; //信息列表数据
                this.totalCount = res.totalPage * this.form.pageSize;
                // if(memberType == 1){ //新会员 
                //     this.textTips = true;
                //     this.memberNum = res.newMemberCount;
                //     this.memberCount = res.newMemberRatio;
                // }else if(memberType == 2){ //老会员
                //     this.textTips = true;
                //     this.memberNum = res.oldMemberCount;
                //     this.memberCount = res.oldMemberRatio;
                // }else{ //其他
                //     this.textTips = false;
                // }
                console.log(res)
                // console.log(this.repeatPaymentRatio)
            }).catch(error => {
                this.$message.error(error);
            });
        },
        //消耗次数
          memberInforNum(){
            this._apis.data.memberInforNum({type:4}).then(res => { 
                  let pages = [];
                  for(let item of res){
                      pages.push({
                          id:item.id,
                          value:item.minNum+'-'+ item.maxNum,
                          name:item.name
                      })
                  }
                  this.consumTimes = pages;
                // console.log('res',res)
            }).catch(error =>{
                console.log('error',error)
            })
        },
        // 重置
        reSet(){
            this.form = {
                startTime:null,
                endTime:null,
                scorePaymentCountRange:null,
                memberType:null,
                timeType:1,
                startIndex:1,
                pageSize:10
            }
            this.goSearch();
        },
        //重新筛选
        reScreening(){
            this.form.startIndex = 1;
            this.goSearch()
        },
        //导出
        exportExl(){
            let data = {};
            data.startTime = this.form.startTime
            data.endTime = this.form.endTime
            data.scorePaymentCountRange = this.form.scorePaymentCountRange
            data.queryRepeatPaymentRatio = this.form.queryRepeatPaymentRatio
            data.memberType = this.form.memberType            
            data.timeType = this.form.timeType
            this._apis.data.integralConsumptionExport(data)
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
</style>
