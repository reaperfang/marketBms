/*积分消耗 */
<template>
    <div class="m_container">
         <div class="pane_container head-wrapper">
            <el-form ref="form" :model="form" class="clearfix" :inline="true">
                <el-form-item label="交易时间">
                    <div class="p_line">
                        <el-radio-group v-model="form.timeType">
                            <el-radio-button class="btn_bor" label="1">最近7天</el-radio-button>
                            <el-radio-button class="btn_bor" label="2">最近15天</el-radio-button>
                            <el-radio-button class="btn_bor" label="3">最近30天</el-radio-button>
                            <el-radio-button class="btn_bor" label="5">本季度</el-radio-button>
                            <el-radio-button class="btn_bor" label="4">自定义时间</el-radio-button>
                        </el-radio-group>
                        <el-date-picker
                        v-if="form.timeType == 4"
                        v-model="daterange"
                        type="datetimerange"
                        align="right"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="Object.assign(utils.globalTimePickerOption.call(this, false), this.pickerOptions)"
                        @change="getData">
                    </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="消耗次数">
                    <div class="input_wrap2">
                        <el-select v-model="form.scorePaymentCountRange">
                            <el-option v-for="item in consumTimes" :label="item.name" :value="item.value" :key="item.id"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="用户类型">
                    <div class="input_wrap2">
                        <el-select v-model="form.memberType">
                            <el-option v-for="item in customType" :label="item.name" :value="item.id" :key="item.id"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="minor_btn" icon="el-icon-search" @click="goSearch(1)">查询</el-button>
                    <el-button type="primary" class="border_btn" @click="reSet">重 置</el-button>
                </el-form-item>
                <!-- <el-form-item class="fr marT20">
                    <el-button class="minor_btn" icon="el-icon-search" @click="goSearch()">查询</el-button>
                    <el-button class="border_btn" @click="reSet">重 置</el-button>
                </el-form-item> -->
            </el-form>
            <div class="m_line clearfix">
                <p class="fl">该筛选条件下：会员共计<span>{{memberCount || 0}}</span>人；占用户总数的<span>{{ratio ? (ratio*100).toFixed(2) : 0}}%</span>。</p>
                <div class="fr marT20">
                    <!-- <el-button class="minor_btn" @click="reScreening()">重新筛选</el-button> -->
                    <el-tooltip content="当前最多支持导出1000条数据" placement="top">
                        <el-button class="yellow_btn" icon="el-icon-share" @click="exportExl">导出</el-button>
                    </el-tooltip>
                    
                </div>
            </div>
            <ma3Table 
                class="marT20s" 
                @sizeChange="sizeChange"
                @currentChange="currentChange"
                :pageSize="10"
                :listObj="listObj"
                :totalCount="listObj.totalSize">
            </ma3Table>
        </div>
        <div v-if="listObj.members != undefined && showNote">
            <p>运营建议：</p>
            <p class="proposal"><b>消耗次数{{note.label}} ：</b>{{note.suggest}}</p>
        </div>
        <div class="contents"></div>
        <div v-if ="form.loads == true" class="loadings"><img src="../../assets/images/loading.gif" alt=""></div>
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData"></component>
    </div>
</template>
<script>
import ma3Table from './components/ma3Table';
import exportTipDialog from '@/components/dialogs/exportTipDialog' //导出提示框 
import utils from '@/utils'
export default {
    name: 'integral',
    components: { ma3Table ,exportTipDialog },
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
            daterange:'',
            form: {
                startTime:null,
                endTime:null,
                scorePaymentCountRange:null,
                memberType:null,
                timeType:1,
                startIndex:1,
                loads:false,
                pageSize:10
            },
            memberCount:0, //会员数
            ratio:0, //会员占比
            listObj:{}, //表格数据
            totalCount:0,//总条数
            consumTimes: [ ],
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
            note:'',
            showNote:false,
            currentDialog:"",
            dialogVisible: false,
            currentData:{},
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
            // console.log(this.form)
        },

        getDate(date) {
            return utils.formatDate(new Date(date), "yyyy-MM-dd hh:mm:ss");
        },
        //
        //查询
        goSearch(num){
            this.form.loads = true
            this.form.startIndex = num || this.form.startIndex
            this._apis.data.integralconsumption(this.form).then(res => {
                this.memberCount = res.memberCount;
                this.ratio = res.ratio;
                this.listObj = res; //信息列表数据
                this.totalCount = res.totalPage * this.form.pageSize;
                this.form.loads = false
                // this.note = this.form.scorePaymentCountRange
                 //切换消耗次数获取运营建议
                for(let item of this.consumTimes){
                    if(item.value == this.form.scorePaymentCountRange){
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
        //消耗次数
          memberInforNum(){
            this._apis.data.memberInforNum({type:4}).then(res => { 
                  let pages = [];
                  for(let item of res){
                      pages.push({
                          id:item.id,
                          value:item.minNum+'-'+ item.maxNum,
                          name:item.name,
                          suggest:item.suggest
                      })
                  }
                  this.consumTimes = pages;
                //   this.form.scorePaymentCountRange = value
            }).catch(error =>{
               
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
            data.memberType = this.form.memberType            
            data.timeType = this.form.timeType
            if(this.memberCount && this.memberCount > 1000 ){
                this.dialogVisible = true
                this.currentDialog = exportTipDialog
                this.currentData.query = data
                this.currentData.api = "data.integralConsumptionExport"
            }else{
                this._apis.data.integralConsumptionExport(data)
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
       position: relative;
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
    top: 52%;
    transform: translate(-50%,-50%);
}
.loadings>img{
     width: 220px;
     height: 220px;
}
</style>
