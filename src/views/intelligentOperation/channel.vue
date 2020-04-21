<template>
    <div class="m_container">
        <div class="pane_container head-wrapper">
                <el-form  :inline="true">
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
                        
                    <el-form-item label="转化渠道">
                        <div class="input_wrap2">
                            <el-select v-model="form.channel">
                                <el-option label="不限" value="null"></el-option>
                                <el-option label="直接购买" value="1"></el-option>
                                <el-option label="活动类型" value="2"></el-option>
                            </el-select>
                        </div>
                        <span class="span_label">（成功）支付转化率</span>
                        <div class="input_wrap2">
                            <el-select v-model="form.changeRatioRange">
                                <el-option v-for="item in productiveness" :label="item.name" :value="item.value" :key="item.id"></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="minor_btn"  @click="goSearch(1)">查询</el-button>
                        <el-button type="primary" class="border_btn" @click="reSet">重 置</el-button>
                    </el-form-item>

                    <!-- <el-form-item class="marT20">
                        <div class="buttonfl">
                            <el-button class="minor_btn" icon="el-icon-search" @click="goSearch()">查询</el-button>
                            <el-button class="border_btn" @click="reSet">重 置</el-button>
                        </div>
                    </el-form-item> -->
                </el-form>

                <div class="m_line clearfix">
                    <div class="fr marT20">
                        <el-button class="border_btn" @click="showDetails">查看详情</el-button>
                        <!-- <el-button class="minor_btn" @click="reScreening">重新筛选</el-button> -->
                        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
                            <el-button class="yellow_btn" icon="el-icon-share" @click="exportExl">导出</el-button>
                        </el-tooltip>   
                    </div>
                </div>
                
                <channel-table 
                    class="marT20s" 
                    :listObj="listObj"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange"
                >
                </channel-table>               
            </div>
            <div v-if="listObj.list.length!=0 && showNote">
                <p>运营建议：</p>
                <p class="proposal"><b>转化率{{note.label}} ：</b>{{note.suggest}}</p>
            </div>
            <div class="contents"></div>
           <div v-if ="form.loads == true" class="loadings"><img src="../../assets/images/loading.gif" alt=""></div>
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData"></component>
    </div>
</template>
<script>
import channelTable from './components/channelTable';
import exportTipDialog from '@/components/dialogs/exportTipDialog' //导出提示框 
export default {
    name: 'channel',
    components: { channelTable ,exportTipDialog },
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
                startTime:null,
                endTime:null,
                channel:null,
                changeRatioRange:null,
                timeType:1,
                startIndex:1,
                loads:false,
                pageSize: '10',
            },
            productiveness:[ ],
            listObj:{
                list:[]
            },
            totalCount:0,//总页数
            pickerMinDate: '',
            dateRange: [],
            note:null,
            showNote:false,
            currentDialog:"",
            dialogVisible: false,
            currentData:{},
            totalNum:0,
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
        goSearch(num){
            this.form.loads = true
            this.form.startIndex = num || this.form.startIndex
            this._apis.data.channelConversion(this.form).then(response => {
                this.listObj = response;
                this.totalNum = response.totalSize || 0;
                this.form.loads = false
                //切换成功支付转化率获取运营建议
                for(let item of this.productiveness){
                    if(item.value == this.form.changeRatioRange){
                        this.note = {
                            suggest:item.suggest,
                            label:item.name
                        }
                        item.suggest != null && (this.showNote = true)
                    }
                }
            }).catch(error => {
                this.$message.error(error);
            });
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
            if(this.totalNum > 1000 ){
                this.dialogVisible = true
                this.currentDialog = exportTipDialog
                this.currentData.query = data
                this.currentData.api = "data.channelConversionExport"
            }else{
                this._apis.data.channelConversionExport(data)
                .then(res => {
                    window.location.href = res
                })
                .catch(err=>{
                    this.$message.error(err);
                })
            } 
        },
         //获取会员直接购买转化率
        memberInforNum(){
            this._apis.data.memberInforNum({type:2}).then(res => {   
                let vipcake = [];
                for(let item of res){
                    vipcake.push({
                        id:item.id,
                        value:item.minNum+'-'+item.maxNum,
                        name:item.name,
                        suggest:item.suggest
                    })                   
                }
                this.productiveness = vipcake
            }).catch(error =>{
                console.log('error',error)
            })
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

/**
*
* @Author zpw
* @Update 2020/4/17
* @Description  产研-电商中台  bugID: CYDSZT-3504
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
.buttonfl{
    -webkit-box-pack: end;
    display: -webkit-box;
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
    top: 45%;
    transform: translate(-50%,-50%);
}
.loadings>img{
    width: 220px;
    height: 220px;
}
</style>
