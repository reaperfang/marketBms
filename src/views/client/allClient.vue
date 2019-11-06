<!--全部客户-->
<template>
  <div>
    <div class="all_container">
        <div class="form_container">
            <el-form ref="form" :model="form">
                <el-row>
                    <el-col :span="4">
                        <el-form-item prop="labelName">
                            <el-select v-model="form.labelName" placeholder="请选择" clearable>
                                <el-option label="昵称" value="nickName"></el-option>
                                <el-option label="用户ID" value="memberSn"></el-option>
                                <el-option label="手机号" value="phone"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-form-item prop="labelValue">
                            <el-input v-model="form.labelValue" placeholder="请输入" maxlength="20">
                                <el-button slot="append" icon="el-icon-search" @click="getClientList"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="客户身份：" class="relaPosition" prop="memberType">
                    <el-checkbox-group v-model="form.memberType" :max="1">
                        <el-checkbox v-for="item in clientStatusOps" :label="item" :key="item" border>{{item}}</el-checkbox>
                    </el-checkbox-group>
                    <el-popover
                        ref="popover"
                        placement="right"
                        width="400"
                        v-model="popVisible"
                        trigger="hover"
                    >
                        <p class="p_title">客户身份说明</p>
                        <p class="p_over1">客户身份包括：非会员、会员，其中会员包括新会员和老会员。成为老会员条件可进行配置。</p>
                        <p class="p_over2" @click="goToSet">【查看/配置会员身份规则】</p>
                    </el-popover>
                    <img src="../../assets/images/client/icon_ask.png" alt="" v-popover:popover class="pop_img">
                </el-form-item>
                <el-form-item label="客户标签：" class="relaPosition clearfix" prop="memberLabels">
                    <div class="group_container fl">
                        <el-checkbox-group v-model="form.memberLabels" :style="{width: labels.length > 5 ?'506px':'',height: showMoreTag ?'':'37px', overflow: showMoreTag ? 'block':'hidden'}">
                            <el-checkbox v-for="item in labels" :label="item" :key="item" border>{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <el-button type="primary" class="fl" @click="_routeTo('batchImport')" :style="{'margin-left': labels.length == 0?'0':'15px'}">添 加</el-button>
                    <img src="../../assets/images/client/icon_down.png" alt="" class="down_img fl" @click="extendTag" v-if="labels.length > 5" :style="{transform: showMoreTag ? 'rotate(180deg)':''}">
                </el-form-item>
                <el-form-item label="客户渠道：" class="relaPosition" prop="channelId">
                    <el-checkbox-group v-model="form.channelId">
                        <el-checkbox v-for="item in channels" :label="item" :key="item" border>{{item}}</el-checkbox>
                    </el-checkbox-group>
                    <div class="more font12" @click="handleMore" v-if="!showFold">更多查询条件<i class="el-icon-arrow-down"></i></div>
                </el-form-item>
                <div class="fold_part" v-if="showFold">
                    <el-form-item label="客户状态：" prop="status">
                        <el-checkbox-group v-model="form.status" :max="1">
                            <el-checkbox v-for="item in clientStateOps" :label="item" :key="item" border>{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="积分：" prop="scoreMin">
                                <div class="input_wrap">
                                    <el-input v-model="form.scoreMin" placeholder="最小值" @keyup.native="number2($event,form.scoreMin,'scoreMin')"></el-input>
                                </div>
                                <span>分</span>
                                <span>-</span>
                                <div class="input_wrap">
                                    <el-input v-model="form.scoreMax" placeholder="最大值" @keyup.native="number($event,form.scoreMax,'scoreMax')"></el-input>
                                </div>
                                <span>分</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="累计消费金额：" prop="totalDealMoneyMin">
                                <div class="input_wrap">
                                    <el-input v-model="form.totalDealMoneyMin" placeholder="最小值" @keyup.native="number3($event,form.totalDealMoneyMin,'totalDealMoneyMin')"></el-input>
                                </div>
                                <span>元</span>
                                <span>-</span>
                                <div class="input_wrap">
                                    <el-input v-model="form.totalDealMoneyMax" placeholder="最大值" @keyup.native="number4($event,form.totalDealMoneyMax,'totalDealMoneyMax')"></el-input>
                                </div>
                                <span>元</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="购买次数：" prop="dealTimesMin">
                                <div class="input_wrap">
                                    <el-input v-model="form.dealTimesMin" placeholder="最小值" @keyup.native="number2($event,form.dealTimesMin,'dealTimesMin')"></el-input>
                                </div>
                                <span>次</span>
                                <span>-</span>
                                <div class="input_wrap">
                                    <el-input v-model="form.dealTimesMax" placeholder="最大值" @keyup.native="number($event,form.dealTimesMax,'dealTimesMax')"></el-input>
                                </div>
                                <span>次</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="客单价：" prop="perUnitPriceMin">
                                <div class="input_wrap">
                                    <el-input v-model="form.perUnitPriceMin" placeholder="最小值" @keyup.native="number3($event,form.perUnitPriceMin,'perUnitPriceMin')"></el-input>
                                </div>
                                <span>元</span>
                                <span>-</span>
                                <div class="input_wrap">
                                    <el-input v-model="form.perUnitPriceMax" placeholder="最大值" @keyup.native="number4($event,form.perUnitPriceMax,'perUnitPriceMax')"></el-input>
                                </div>
                                <span>元</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="注册时间：">
                                <div class="input_wrap3">
                                    <el-date-picker
                                        v-model="becameCustomerTime"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="上次消费：" prop="lastPayTimeStart">
                                <div class="input_wrap3">
                                    <el-date-picker
                                        v-model="lastPayTime"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <el-form-item class="padR40 marT20">
                    <span class="shou" @click="handleMore" v-if="showFold">收起<i class="el-icon-arrow-up marL10"></i></span>
                    <el-button class="fr marL20" @click="resetForm('form')">重置</el-button>
                    <el-button type="primary" class="fr" @click="getClientList" :loading="btnloading">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <div class="btn_container">
                <el-button type="primary" @click="_routeTo('clientImport')" v-permission="['客户', '全部客户', '默认页面', '客户导入']">导入</el-button>
                <!-- <el-button @click="exportToLocal">导出</el-button> -->
            </div>
            <acTable :newForm="newForm" @stopLoading="stopLoading"></acTable>
        </div>
    </div>
  </div>
</template>
<script>
import utils from "@/utils";
import clientCont from '@/system/constant/client';
import acTable from './components/allClient/acTable';
export default {
  name: 'allClient',
  components: { acTable },
  data() {
    return {
      form: {
        labelName:"phone",
        labelValue:"",
        memberType:[],
        memberLabels: [],
        channelId: [],
        status: [],
        scoreMin:"",
        scoreMax:"",
        totalDealMoneyMin:"",
        totalDealMoneyMax:"",
        dealTimesMin:"",
        dealTimesMax:"",
        perUnitPriceMin:"",
        perUnitPriceMax:""
      },
        newForm: {},
        showFold: false,
        showMoreTag: false,
        popVisible: false,
        labels: [],
        labelsList: [],
        channels: [],
        channelsList: [],
        memberList: [],
        btnloading: false,
        becameCustomerTime:"",
        lastPayTime:""
    }
  },
  watch: {

  },
  computed:{
    clientStatusOps() {
        return clientCont.clientStatusOps
    },
    clientChannelOps() {
        let arr = [];
        clientCont.clientChannelOps.map((v) => {
            arr.push(v.channerlName)
        });
        return arr;
    },
    clientStateOps() {
        return clientCont.clientStateOps
    }
  }, 
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
    
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    //匹配积分等的最大值
    number(event,val,ele) {
        val = val.replace(/[^\.\d]/g,'');
        val = val.replace('.','');
        val = val.replace(/^0/g,'');
        this.form[ele] = val;
    },
    //匹配积分等最小值（正整数，可为0）
    number2(event,val,ele) {
        val = val.replace(/[^\d]/g,'');
        this.form[ele] = val;
    },
    //匹配小数 可为0，两位
    number3(event,val,ele) {
      val = val.replace(/[^\d.]/g,'');
      val = val.replace(/\.{2,}/g,'.');
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
      this.form[ele] = val;
    },
    //匹配小数 不能为0，两位
    number4(event,val,ele) {
      val = val.replace(/[^\d.]/g,'');
      val = val.replace(/^0/g,'');
      val = val.replace(/\.{2,}/g,'.');
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
      this.form[ele] = val;
    },
    goToSet() {
        this.$router.push({path:'/set/memberSet'});
    },
    stopLoading() {
        this.btnloading = false;
    },
    handleMore() {
        this.showFold = !this.showFold;
    },   
    extendTag() {
        this.showMoreTag = !this.showMoreTag;
    },
    getLabels() {
        this._apis.client.getLabels({tagType:null}).then((response) => {
            this.labelsList = [].concat(response);
            response.map((v) => {
                this.labels.push(v.tagName);
            })
        }).catch((error) => {
            console.log(error);
        })
    },
    getChannels() {
        this._apis.client.getChannels({}).then((response) => {
            this.channelsList = [].concat(response);
            response.map((v) => {this.channels.push(v.channerlName)});
        }).catch((error) => {
            console.log(error);
        })
    },
    isNumber(val) {
        if(!!val) {
            return Number(val) !== NaN;
        }
    },
    isInteger(val) {
        let v = Number(val);
        return Math.floor(v) === v;
    },
    getClientList() {
        let canSubmit = true;
        if(!!this.isNumber(this.form.scoreMin)) {
            if(!this.isNumber(this.form.scoreMax) || Number(this.form.scoreMax) <= Number(this.form.scoreMin)) {
                this.$notify({
                    title: '警告',
                    message: '请正确输入最大积分',
                    type: 'warning'
                });
                canSubmit = false;
            }
        }
        if(!!this.isNumber(this.form.scoreMax)) {
            if(!this.isNumber(this.form.scoreMin) || Number(this.form.scoreMin) >= Number(this.form.scoreMax)) {
                this.$notify({
                    title: '警告',
                    message: '请正确输入最小积分',
                    type: 'warning'
                });
                canSubmit = false;
            }
        }
        if(!!this.isNumber(this.form.totalDealMoneyMin)) {
            if(!this.isNumber(this.form.totalDealMoneyMax) || Number(this.form.totalDealMoneyMax) <= Number(this.form.totalDealMoneyMin)) {
                this.$notify({
                    title: '警告',
                    message: '请正确输入累计最大金额',
                    type: 'warning'
                });
                canSubmit = false;
            }
        }
        if(!!this.isNumber(this.form.totalDealMoneyMax)) {
            if(!this.isNumber(this.form.totalDealMoneyMin) || Number(this.form.totalDealMoneyMin) >= Number(this.form.totalDealMoneyMax)) {

                this.$notify({
                    title: '警告',
                    message: '请正确输入累计最小金额',
                    type: 'warning'
                });
                canSubmit = false;
            }
        }
        if(!!this.isNumber(this.form.dealTimesMin)) {
            if(!this.isNumber(this.form.dealTimesMax) || Number(this.form.dealTimesMax) <= Number(this.form.dealTimesMin)) {
                this.$notify({
                    title: '警告',
                    message: '请正确输入最大购买次数',
                    type: 'warning'
                });
                canSubmit = false;
            }
        }
        if(!!this.isNumber(this.form.dealTimesMax)) {
            if(!this.isNumber(this.form.dealTimesMin) || Number(this.form.dealTimesMin) >= Number(this.form.dealTimesMax)) {
                this.$notify({
                    title: '警告',
                    message: '请正确输入最小购买次数',
                    type: 'warning'
                });
                canSubmit = false;
            }
        }
        if(!!this.isNumber(this.form.perUnitPriceMin)) {
            if(!this.isNumber(this.form.perUnitPriceMax) || Number(this.form.perUnitPriceMax) <= Number(this.form.perUnitPriceMin)) {
                this.$notify({
                    title: '警告',
                    message: '请正确输入最大客单价',
                    type: 'warning'
                });
                canSubmit = false;
            }
        }
        if(!!this.isNumber(this.form.perUnitPriceMax)) {
            if(!this.isNumber(this.form.perUnitPriceMin) || Number(this.form.perUnitPriceMin) >= Number(this.form.perUnitPriceMax)) {
                this.$notify({
                    title: '警告',
                    message: '请正确输入最小客单价',
                    type: 'warning'
                });
                canSubmit = false;
            }
        }
        if(!!canSubmit) {
            this.btnloading = true;
            this.form.becameCustomerTimeStart = this.becameCustomerTime ? utils.formatDate(new Date(this.becameCustomerTime[0].getTime()),"yyyy-MM-dd hh:mm:ss"):'';
            this.form.becameCustomerTimeEnd = this.becameCustomerTime?utils.formatDate(new Date(this.becameCustomerTime[1].getTime() + 24 * 60 * 60 * 1000 - 1),"yyyy-MM-dd hh:mm:ss"):'';
            this.form.lastPayTimeStart = this.lastPayTime ? utils.formatDate(new Date(this.lastPayTime[0].getTime()),"yyyy-MM-dd hh:mm:ss"):'';
            this.form.lastPayTimeEnd = this.lastPayTime ? utils.formatDate(new Date(this.lastPayTime[1].getTime() + 24 * 60 * 60 * 1000 - 1),"yyyy-MM-dd hh:mm:ss"):'';
            let oForm = Object.assign({},this.form);
            let labelNames = oForm.memberLabels;
            let channelNames = oForm.channelId;
            let labelIds = [];
            let channelIds = [];
            let newForm = {};
            if(labelNames.length > 0) {
                this.labelsList.map((item) => {
                    labelNames.map((v) => {
                        if(v == item.tagName) {
                            labelIds.push(item.id);
                        }
                    })
                });
            }
            
            labelIds = labelIds.join(',');
            if(channelNames.length > 0) {
                this.channelsList.map((item) => {
                    channelNames.map((v) => {
                        if(v == item.channerlName) {
                            channelIds.push(item.id);
                        }
                    })
                });
            }
            channelIds = channelIds.join(',');
            oForm.memberLabels = labelIds;
            oForm.channelIds = channelIds;
            if(oForm.memberType.length > 0) {
                oForm.memberTypes = oForm.memberType[0] == "会员" ? [1,2]:[0];
            }
            if(oForm.status.length > 0) {
                oForm.status = oForm.status[0] == "正常" ? '0':'1';
            }
            if(oForm.labelValue && oForm.labelName) {
                newForm[oForm.labelName] = oForm.labelValue;
            }
            Object.keys(oForm).forEach((key) => {
                if(oForm[key].length !== 0) {
                    newForm[key] = oForm[key];
                }
            });
            delete newForm.labelName;
            delete newForm.labelValue;
            delete newForm.channelId;
            delete newForm.memberType;
            this.newForm = Object.assign({},newForm);
        }
        
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.form.scoreMax = "";
        this.form.totalDealMoneyMax = "";
        this.form.dealTimesMax = "";
        this.form.perUnitPriceMax = "";
        this.form.becameCustomerTimeEnd = "";
        this.form.lastPayTimeEnd = "";
        this.newForm = Object.assign({},{});
    }
  },
  mounted() {
      this.getLabels();
      this.getChannels();
      if(this.$route.query.memberLabels) {
          this.newForm = Object.assign({}, this.$route.query);
      }else{
          this.newForm = Object.assign({}, {});
      }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-checkbox.is-bordered + .el-checkbox.is-bordered{
    margin-bottom: 10px;
}
/deep/.el-checkbox.is-bordered.el-checkbox--small .el-checkbox__inner{
    display: none;
}
/deep/.el-checkbox.is-bordered.el-checkbox--small{
    padding: 7px 10px 5px 10px;
    background:rgba(211,211,211,0.3);
    margin-right: 10px;
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
/deep/.el-form-item__label{
    color: #3D434A;
}
/deep/.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 10px;
}
.el-input-group__append button.el-button{
    color: #5D78FF;
}
.all_container{
    padding: 19px;
    background-color: #fff;
    font-size: 14px;
    .form_container{
        .relaPosition{
            .absoPosition{
                margin-left: 15px;
            }
            .down_img{
                position: absolute;
                left: 569px;
                top: 5px;
            }
            .more{
                cursor: pointer;
                color: #5B54E6;
                position: absolute;
                right: 40px;
                top: 0;
                i{
                    margin-left: 10px;
                }
            }
            .pop_img{
                position: absolute;
                left: 211px;
                top: -7px;
            }
        }
        .fold_part{
            .input_wrap{
                display: inline-block;
                width: 100px;
            }
            .input_wrap2{
                display: inline-block;
                width: 150px;
            }
            .input_wrap3{
                display: inline-block;
                width: 270px;
            }
        }
        .shou{
            float: right;
            font-size: 12px;
            margin-left: 20px;
            color: #5B54E6;
            cursor: pointer;
        }
    }
}
.p_title{
    height: 40px;
    line-height: 40px;
    background:rgba(101,94,255,0.09);
    font-size: 18px;
    padding-left: 10px;
}
.p_over1{
    margin: 20px 0;
}
.p_over2{
    cursor: pointer;
    color: #6457FF;
}
</style>
