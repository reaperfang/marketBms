<template>
    <div class="c_container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="会员卡管理" name="first" v-permission="['客户', '会员卡', '会员卡管理']">
                <div class="pane_container">
                    <div class="c_card">
                        <img v-if="imgUrl" :src="imgUrl" class="cardImg" />
                        <img v-else src="../../assets/images/client/card.png" alt class="cardImg" />
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl"
                            :show-file-list="false"
                            :limit="1"
                            :data="{json: JSON.stringify({cid: cid})}"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                        >
                            <el-button v-if="!imgUrl" size="small" type="primary" class="upload_btn mini_1">待上传</el-button>
                            <el-button v-else size="small" type="primary" class="upload_btn mini_2">更改</el-button>
                        </el-upload>
                        <el-popover
                            ref="popover"
                            placement="right"
                            width="400"
                            v-model="popVisible"
                            trigger="hover"
                        >
                            <p class="p_title">会员卡宣传图</p>
                            <p class="p_over1">上传后将会出现在用户端的用户中心展示，更醒目地引导用户领取会员卡</p>
                        </el-popover>
                        <img src="../../assets/images/client/icon_ask.png" alt="" v-popover:popover class="pop_img">
                    </div>
                    <p class="c_warn">建议上传图片尺寸1000*630像素，不超过2M，格式支持JPG、PNG、JPEG</p>
                </div>
                <cdTable></cdTable>
            </el-tab-pane>
            <el-tab-pane label="领卡记录" name="second" v-permission="['客户', '会员卡', '领卡记录']">
                <div class="c_line">
                    <span>卡名称：</span>
                    <div class="input_wrap">
                        <el-select placeholder="全部" v-model="selected" clearable>
                            <el-option
                                v-for="item in cardNames"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name"
                            ></el-option>
                        </el-select>
                    </div>
                    <span style="margin-left: 200px;">领取时间：</span>
                    <el-date-picker
                        type="daterange"
                        v-model="getTime"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                    <el-button type="primary" class="marL20" @click="handleFind">查 询</el-button>
                    <el-button class="border_btn" @click="reset">重 置</el-button>
                </div>
                <lkTable style="margin-top: 39px" :lkParams="lkParams"></lkTable>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script type="es6">
import utils from "@/utils";
import cdTable from './components/cardManage/cdTable';
import lkTable from './components/cardManage/lkTable';
export default {
    name: "cardManage",
    components: { cdTable, lkTable },
    data() {
        return {
            uploadUrl: `${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
            imgUrl:"",
            imgId: "",
            activeName: 'first',
            popVisible: false,
            selected:"",
            getTime: "",
            cardNames: [],
            lkParams: {},
            isLoading: true,
            loading: false
        }
    },
    computed:{
        cid(){
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            return shopInfo.id
        }
    },
    methods: {
        handleAvatarSuccess(res, file) {
            this.imgUrl = res.data.url;
            this.addCardBg();
        },
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过 2MB!");
            }
            return isLt2M;
        },
        handleFind() {
            let obj = {
                name: this.selected == "" || this.selected == "全部"? null : this.selected,
                startTime: this.getTime == "" || this.getTime == null ? "": utils.formatDate(new Date(this.getTime[0]).getTime(),"yyyy-MM-dd hh:mm:ss"),
                endTime: this.getTime == "" || this.getTime == null ? "":utils.formatDate(new Date(this.getTime[1]).getTime() + 24 * 60 * 60 * 1000 - 1,"yyyy-MM-dd hh:mm:ss"),
            }
            this.lkParams = Object.assign({},obj);
        },
        reset() {
            this.selected = "";
            this.getTime = "";
        },
        refreshTable() {
            this.getCardList();
        },
        getCardNames() {
            this._apis.client.getCardNames({}).then((response) => {
                this.cardNames = [].concat(response);
                this.cardNames.unshift({name:'全部', id: '001'})
            }).catch((error) => {
                console.log(error);
            })
        },
        addCardBg() {
            let params = {
                imgUrl: this.imgUrl
            };
            if(this.imgId) {
                params = Object.assign(params,{id: this.imgId})
            }
            this._apis.client.addCardBg(params).then((response) => {
                this.$notify({
                    title: '成功',
                    message: '上传会员卡宣传图片成功',
                    type: 'success'
                });
            }).catch((error) => {
                console.log(error);
            })
        },
        checkCardBg() {
            this._apis.client.checkCardBg({}).then((response) => {
                if(response) {
                    this.imgUrl = response.imgUrl;
                    this.imgId = response.id;
                }
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted() {
        this.getCardNames();
        this.checkCardBg();
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-button--mini{
    padding: 5px 10px;
}
.c_container{
    padding: 20px;
    background-color: #fff;
}
.marL20{
    margin-left: 20px;
}
.pane_container{
    padding: 12px 20px;
    .c_card{
        width: 324px;
        height: 140px;
        background-position: 0 0;
        background-repeat: no-repeat;
        position: relative;
        .mini_1{
            position: absolute;
            border-color: #655EFF;
            color:#655EFF;
            background: transparent;
            right: 7px;
            bottom: 6px;
        }
        .mini_2{
            position: absolute;
            border-color: #FD4C2B;
            color:#FD4C2B;
            background: transparent;
            right: 7px;
            bottom: 6px;
            padding: 5px 16px;
        }
        .pop_img{
            position: absolute;
            left: 291px;
            top: 10px;
        }
        .cardImg{
            width: 324px;
            height: 140px;
            border-radius: 10px;
        }
    }
    .c_warn{
        color: #92929B;
        font-size: 12px;
        margin: 7px 0 27px 0;
    }
}
.c_line{
    .input_wrap{
        display: inline-block;
        width: 182px;
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


