<template>
    <div class="c_container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="会员卡管理" name="first" v-permission="['用户', '会员卡', '会员卡管理']">
                <div class="pane_container">
                    <div class="c_card">
                        <p class="guide_text">
                            <span>会员卡领取引导图</span>
                            <img src="../../assets/images/client/icon_ask.png" alt="" v-popover:popover class="pop_img">
                        </p>
                        <div v-if="showDefault" class="cardImg2"></div>
                        <div v-if="!imgUrl" class="cardImg" v-loading="imgLoading"></div>
                        <img v-else :src="imgUrl" class="cardImg"/>
                        <!-- <img v-else src="../../assets/images/client/guide_img.png" alt class="cardImg" /> -->
                        <el-button v-if="!imgUrl" size="small" type="primary" class="upload_btn mini_1" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">待上传</el-button>
                        <el-button v-else size="small" type="primary" class="upload_btn mini_2" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更改</el-button>
                        <el-popover
                            ref="popover"
                            placement="right"
                            width="400"
                            v-model="popVisible"
                            trigger="hover"
                        >
                            <p class="p_title">会员卡领取引导图</p>
                            <p class="p_over1">上传后将后出现在用户端的用户中心展示，更显目的引导用户领取会员卡，当用户领取会员卡后，则此引导图隐藏。</p>
                        </el-popover>
                    </div>
                    <p class="c_warn">建议上传图片尺寸326*62像素，不超过3M，格式支持JPG、PNG、JPEG</p>
                </div>
                <div style="color: #FD4C2B; font-size: 12px; margin-bottom: 10px">请注意：会员卡等级被启用后，随意变更升级条件容易导致升级条件混乱，影响用户体验，请谨慎操作。</div>
                <cdTable></cdTable>
            </el-tab-pane>
            <el-tab-pane label="领卡记录" name="second" v-permission="['用户', '会员卡', '领卡记录']">
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
                    <span style="margin-left: 20px;">领取时间：</span>
                    <el-date-picker
                        type="datetimerange"
                        v-model="getTime"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="utils.globalTimePickerOption.call(this)"
                    >
                    </el-date-picker>
                    <el-button type="primary" class="marL20" @click="handleFind">查 询</el-button>
                    <el-button class="border_btn" @click="reset">重 置</el-button>
                </div>
                <lkTable style="margin-top: 39px" :lkParams="lkParams"></lkTable>
            </el-tab-pane>
        </el-tabs>
        <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected"></component>
    </div>
</template>
<script type="es6">
import utils from "@/utils";
import cdTable from './components/cardManage/cdTable';
import lkTable from './components/cardManage/lkTable';
import dialogSelectImageMaterial from '@/components/dialogs/selectImageMaterial/index';
export default {
    name: "cardManage",
    components: { cdTable, lkTable, dialogSelectImageMaterial },
    data() {
        return {
            uploadUrl: `${process.env.DATA_API}/web-file/file-server/api_file_remote_upload.do`,
            imgUrl:"",
            imgId: "",
            activeName: 'first',
            popVisible: false,
            selected:"",
            getTime: "",
            cardNames: [],
            lkParams: {},
            isLoading: true,
            loading: false,
            dialogVisible: false,
            currentDialog:"",
            imgLoading: false,
            showDefault: false
        }
    },
    computed:{
        cid(){
            let shopInfo = this.$store.getters.shopInfos
            return shopInfo.id
        }
    },
    methods: {
        imageSelected(item) {
            this.showDefault = false;
            this.imgUrl = "";
            this.imgLoading = true;
            let _this = this;
            setTimeout(() => {
                _this.imgUrl = item.filePath;
                _this.addCardBg();
            },2000);
        },
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
                startTime: !!this.getTime ? this.getTime[0] : '',
                endTime: !!this.getTime ? this.getTime[1] : '',
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
                console.error(error);
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
                this.$message({
                    message: '上传会员卡宣传图片成功',
                    type: 'success'
                });
            }).catch((error) => {
                console.error(error);
            })
        },
        //检测是否有背景图片
        checkCardBg() {
            this.imgLoading = true;
            this._apis.client.checkCardBg({}).then((response) => {
                if(response) {
                    this.showDefault = false;
                    this.imgLoading = false;
                    this.imgUrl = response.imgUrl;
                    this.imgId = response.id;
                }else{
                    this.showDefault = true;
                    this.imgLoading = false;
                }
            }).catch((error) => {
                this.imgLoading = false;
                console.error(error);
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
/deep/ .el-button+.el-button{
    margin-left: 8px;
}
/deep/ .el-date-editor .el-range-separator{
    width: 10%;
}
/deep/ .el-button--mini{
    padding: 5px 10px;
}
.c_container{
    padding: 0 20px 20px 20px;
    background-color: #fff;
    min-height:100%;
    border-radius: 4px;
}
.marL20{
    margin-left: 20px;
}
.pane_container{
    padding: 12px 20px;
    .c_card{
        width: 324px;
        height: 126px;
        background-position: 0 0;
        background-repeat: no-repeat;
        position: relative;
        .guide_text{
            position: relative;
            font-size: 16px;
            color: #655EFF;
            margin-bottom: 28px;
            .pop_img{
                position: absolute;
                left: 141px;
                top: 0px;
            }
        }
        .mini_1{
            position: absolute;
            border-color: #655EFF;
            color:#655EFF;
            background: transparent;
            right: -79px;
            bottom: 18px;
        }
        .mini_2{
            position: absolute;
            border-color: #FD4C2B;
            color:#FD4C2B;
            background: transparent;
            right: -79px;
            bottom: 18px;
        }
        .cardImg{
            width: 326px;
            height: 62px;
            border-radius: 10px;
        }
        .cardImg2{
            width: 326px;
            height: 62px;
            border-radius: 10px;
            background: url(../../assets/images/client/guide_img.png) 0 0 no-repeat;
            background-size: 100% 100%;
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


