<template>
<div style="margin-top:20px; min-height: 75vh;">
    <div class="line">
        <div class="line-title">是否参与分销：</div>
        <div class="line-content">
             <el-radio-group v-model="status">
                <el-radio :label="0">不参与分佣</el-radio>
                <el-radio :label="1">参与分佣</el-radio>
            </el-radio-group>
            <p class="line-tip">如商品不参与分佣，则不产生分佣销售佣金</p>
        </div>
    </div>

    <div class="line">
        <div class="line-title">海报图片：</div>
        <div class="line-content">
             <el-radio-group v-model="picSorce">
                <el-radio :label="0">从商品图片中选取</el-radio>
                <el-radio :label="1">上传新图片</el-radio>
            </el-radio-group>
            <div v-if="picSorce == 0" class="goods-images">
                <div v-for="(img, key) in images" class="good-img" :key="key" @click="changeImgCheck(key)">
                    <img :src="img" alt="" />
                    <span v-if="key == checkedImg"><i class="el-icon-check"></i></span>
                </div>
            </div>
            <div v-if="picSorce == 1" class="goods-images">
                <img v-if="src" style="width:86px;height:86px;dispaly:block;" :src="src" />
                <div style="width:260px;">
                    <div class="uploadBtn"><i @click="changeDialog" class="el-icon-plus"></i></div>
                    <div style="display:inline-block;margin:60px 0 0 10px;" class="line-tip">建议尺寸：640PX*640PX</div>
                </div>
            </div>
        </div>
    </div>

    <div class="line" v-if="status == 1">
        <div class="line-title">独立规则：</div>
        <div class="line-content">
             <el-checkbox-group v-model="enable">
                <el-checkbox label="启用独立分佣比例"></el-checkbox>
            </el-checkbox-group>
            <div v-if="enable">
                <p class="line-tip">启用独立佣金设置，此商品拥有独自的佣金比例,不受分佣员等级比例及默认设置限制</p>
                <div style="margin-top:45px;">
                    <p class="line-tip">建议参考商品的实际利润设置分佣比例，设置后该spu下的所有sku将均按照此比例计算分佣金额</p>
                    <!-- 分佣比例设置 -->
                    <div class="commision">
                        <div class="commision-cell-left">
                            <div v-if="resellConfigInfo.resellGrade >=1" class="commision-title">分佣员本人（三级）佣金占分佣总佣金</div>
                            <div v-if="resellConfigInfo.resellGrade >=2" class="commision-title">上级分佣员（二级）佣金占分佣总佣金</div>
                            <div v-if="resellConfigInfo.resellGrade >=3" class="commision-title">上上级分佣员（一级）佣金占分佣总佣金分佣</div>
                        </div>
                        <div class="commision-cell-center">
                            <div v-if="resellConfigInfo.resellGrade >=1" class="commision-prent">
                                <el-input type="number" v-model="resellRule.percentOfCommissionThree" placeholder="0.00"></el-input><span>%</span>
                            </div>
                            <div v-if="resellConfigInfo.resellGrade >=2" class="commision-prent">
                                <el-input v-model="resellRule.percentOfCommissionTwo" placeholder="0.00"></el-input><span>%</span>
                            </div>
                            <div v-if="resellConfigInfo.resellGrade >=3" class="commision-prent">
                                <el-input v-model="resellRule.percentOfCommissionOne" placeholder="0.00"></el-input><span>%</span>
                            </div>
                        </div>
                        <div class="commision-right">
                            <p class="line-tip">（注：所有层级分佣比例相加之和不能大于100%）</p>
                        </div>
                    </div>
                    <div class="consult">
                        <!-- 商品利润参考 -->
                        <div class="line-title" style="margin-bottom:18px;">参考数据：</div>
                        <div>
                            <el-table :data="sku" tooltip-effect="dark" style="width: 100%">
                                <el-table-column prop="sku" label="SKU"></el-table-column>
                                <el-table-column prop="specs" label="规格"></el-table-column>
                                <el-table-column prop="status" label="状态"></el-table-column>
                                <el-table-column prop="salePrice" label="售卖价"></el-table-column>
                                <el-table-column prop="costPrice" label="成本价"></el-table-column>
                                <el-table-column prop="profits">
                                    <template slot="header">
                                        <el-tooltip placement="top">
                                            <div slot="content">利润=商品售价-成本价</div>
                                            <p>利润&nbsp;<i class="el-icon-warning" style="color:#655EFF;"></i></p>
                                        </el-tooltip>
                                    </template>    
                                </el-table-column>
                                <el-table-column prop="profitRate">
                                    <template slot="header">
                                        <el-tooltip placement="top">
                                            <div slot="content">利润率=利润/成本*100%</div>
                                            <p>利润率&nbsp;<i class="el-icon-warning" style="color:#655EFF;"></i></p>
                                        </el-tooltip>
                                    </template> 
                                </el-table-column>
                            </el-table>
                        </div>
                        <p class="line-tip">&nbsp;</p>
                        <!-- 分佣佣金参考 -->
                        <p v-if="resellGood.length" class="line-tip">（以下是我们根据您填写各层级分佣比例计算出的商品各层级分佣佣金，仅供参考。实际分佣结果将以最终保存的比例计算）</p>
                        <div v-if="resellGood.length">
                            <el-table :data="resellGood" tooltip-effect="dark" style="width: 100%">
                                <el-table-column prop="sku" label="SKU"></el-table-column>
                                <el-table-column prop="specs" label="规格"></el-table-column>
                                <el-table-column v-if="resellConfigInfo.resellGrade >=1" prop="one" label="分佣员本人（三级）佣金金额" width="220"></el-table-column>
                                <el-table-column v-if="resellConfigInfo.resellGrade >=2" prop="two" label="上级分佣员（二级）佣金金额" width="220"></el-table-column>
                                <el-table-column v-if="resellConfigInfo.resellGrade >=3" prop="three" label="上上级分佣员（一级）佣金金额" width="220"></el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="btns">
        <el-button @click="submit" style="margin-right:50px;" type="primary">保存</el-button>
        <el-button @click="historyBack">返回</el-button>
    </div>
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected"></component>
</div>    
</template>
<script>
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial';
import { mapMutations } from 'vuex'
export default {
    data() {
        return {
            currentDialog: '', // 动态弹窗
            dialogVisible: false, // 动态弹窗可见
            resellGood: [], // 商品分佣列表
            enable: false, // 是否开启独立规则
            status: 0, // 是否参与分佣
            picSorce: 0, // 海报图片来源你
            checkedImg: 0, // 海报默认选中那个商品图
            src: '', // 上传海报图片路径
            images: [], // 所有商品图
            sku: [], // 商品利润列表
            // 分销佣金比例
            resellRule: { "percentOfCommissionOne": '' ,"percentOfCommissionTwo": '', "percentOfCommissionThree": '' }
        }
    },    
    watch: {
        resellRule: {
            handler(value, oldVal){
                let  regPos = /^\d+(\.\d+)?$/;
                if(
                    (regPos.test(value.percentOfCommissionOne) || value.percentOfCommissionOne === '') &&
                    (regPos.test(value.percentOfCommissionTwo) || value.percentOfCommissionTwo === '') &&
                    (regPos.test(value.percentOfCommissionThree) || value.percentOfCommissionThree === '') 
                ) {
                    let total;
                    if(this.resellConfigInfo.resellGrade == 3) total = (value.percentOfCommissionOne - 0) + (value.percentOfCommissionTwo - 0) + (value.percentOfCommissionThree - 0);
                    if(this.resellConfigInfo.resellGrade == 2) total = (value.percentOfCommissionThree - 0) + (value.percentOfCommissionTwo - 0);
                    if(this.resellConfigInfo.resellGrade == 1) total = (value.percentOfCommissionThree - 0);
                    if(total <= 100) this.initResellGood();
                    else {
                        this.$message({ message: '所有层级分佣比例相加之和不能大于100%', type: 'warning' });
                    }
                }    
                else {
                    this.$message({ message: '分佣比例必须是数子', type: 'warning' });
                }
            },
            deep: true
        }    
    },
    components: { dialogSelectImageMaterial },
    methods: {
        ...mapMutations(['SETCURRENT']),
        // 选中商品图片
        changeImgCheck (key) {
            this.checkedImg = key;
        },
        // 开启独立分佣
        changeEnable(val) {
            this.enable = val ? 1 : 0;
        },
        // 上传图片
        imageSelected (img) {
            this.src = img.filePath;
        },
        // 打开上传图片弹窗
        changeDialog() {
            this.dialogVisible = true;
            this.currentDialog = 'dialogSelectImageMaterial';
        },
        // 初始化商品分佣佣金
        initResellGood() {
            let detail = this.detail;
            let resellGood = [];
            detail.goodsInfos.forEach(v => {
                let tmp = {};
                
                tmp.sku = v.id;
                tmp.specs = Object.values(JSON.parse(v.specs)).join(' ');
                tmp.status = v.status;
                tmp.salePrice = v.salePrice;
                tmp.costPrice = v.costPrice;
                tmp.profits = v.salePrice - v.costPrice;
                tmp.one = (tmp.profits * (this.resellRule.percentOfCommissionThree - 0) / 100).toFixed(2);
                tmp.two = (tmp.profits * (this.resellRule.percentOfCommissionTwo - 0) / 100).toFixed(2);
                tmp.three = (tmp.profits * (this.resellRule.percentOfCommissionOne - 0) / 100).toFixed(2);
                tmp.profitRate = ((tmp.profits / v.costPrice) * 100 ).toFixed(2) + '%';
                resellGood.push(tmp);
            });
            this.resellGood = resellGood;
        },
        // 保存数据校验
        getSubmitData() {
            let data = {};
            let resellConfigInfo = this.resellConfigInfo;
            data.isResell = this.status;
            if(this.picSorce == 0) data.resellImage = this.images[this.checkedImg];
            if(this.picSorce == 1) {
                if(!this.src) {
                    this.$message({ message: '请上传海报图片', type: 'warning' });
                    return false;
                } else {
                    data.resellImage = this.src;
                }
            }
            data.isAloneResellRule = this.enable ? 1 : 0;
            let  resellRule = Object.assign({}, this.resellRule);
            let  regPos = /^\d+(\.\d+)?$/;

            // 开启了独立分佣
            if(this.status == 1 && this.enable) {
                if(resellConfigInfo.resellGrade == 1) {
                    resellRule.percentOfCommissionThree = resellRule.percentOfCommissionThree / 100;
                    resellRule.percentOfCommissionTwo = '';
                    resellRule.percentOfCommissionOne = '';
                    if(
                        (regPos.test(resellRule.percentOfCommissionThree))
                    ) {
                        let total = (resellRule.percentOfCommissionThree - 0);
                        if(total > 1  || total < 0) {
                            this.$message({ message: '所有层级分佣比例相加之和不能大于100%', type: 'warning' });
                            return false;
                        } else data.resellRule = resellRule;
                    } else {
                        this.$message({ message: '分佣比例必须是数子', type: 'warning' });
                        return false;
                    } 
                } else if (resellConfigInfo.resellGrade == 2) {
                    resellRule.percentOfCommissionThree = resellRule.percentOfCommissionThree / 100;
                    resellRule.percentOfCommissionTwo = resellRule.percentOfCommissionTwo / 100;
                    resellRule.percentOfCommissionOne = '';
                    if(
                        (regPos.test(resellRule.percentOfCommissionThree)) &&
                        (regPos.test(resellRule.percentOfCommissionTwo))
                    ) {
                        let total = (resellRule.percentOfCommissionThree - 0) + (resellRule.percentOfCommissionTwo - 0);
                        if(total > 1  || total < 0) {
                            this.$message({ message: '所有层级分佣比例相加之和不能大于100%', type: 'warning' });
                            return false;
                        } else data.resellRule = resellRule;
                    } else {
                        this.$message({ message: '分佣比例必须是数子', type: 'warning' });
                        return false;
                    }    
                } else if (resellConfigInfo.resellGrade == 3) {
                    resellRule.percentOfCommissionOne = resellRule.percentOfCommissionOne / 100;
                    resellRule.percentOfCommissionTwo = resellRule.percentOfCommissionTwo / 100;
                    resellRule.percentOfCommissionThree = resellRule.percentOfCommissionThree / 100;
                    if(
                        (regPos.test(resellRule.percentOfCommissionOne)) &&
                        (regPos.test(resellRule.percentOfCommissionTwo)) &&
                        (regPos.test(resellRule.percentOfCommissionThree)) 
                    ) {
                        let total = (resellRule.percentOfCommissionOne - 0) + (resellRule.percentOfCommissionTwo - 0) + (resellRule.percentOfCommissionThree - 0);
                        if(total > 1  || total < 0) {
                            this.$message({ message: '所有层级分佣比例相加之和不能大于100%', type: 'warning' });
                            return false;
                        } else data.resellRule = resellRule;
                    } else {
                        this.$message({ message: '分佣比例必须是数子', type: 'warning' });
                        return false;
                    }    
                } else return false;
                // data.resellRule = resellRule;
            }
            
            return data;
        },
        // 保存
        submit() {
            let data = this.getSubmitData();
            if(data) {
                data.id = this.detail.id;
                // todo 保存商品分佣设置
                this._apis.goods.commisionGoodsSet(data).then(res => {
                    this.historyBack();
                }).catch((error) => { 
                    this.$message({ message: error, type: 'warning' }); 
                });
            }
        },
        // 返回
        historyBack() {
            // TODO 返回
            if(this.$route.query.commissionEdit) { // 分佣商品列表
                this.$router.push({path:'/apply',query:{paths:'/commission/commissionGoods/goods'}})
                this.SETCURRENT(8)
            } else { // bms 商品列表
                this.$router.push({name:'goodsList'})
            }
        }
    },
    created() {
        // 商品详情
        let detail = this.detail;

        if(detail.isAloneResellRule == 1){ // 是否独立分佣商品
            this.enable = true;
            
            let resellRule = detail.resellRule ? JSON.parse(detail.resellRule) : null;
            if(resellRule) {
                resellRule.percentOfCommissionOne = resellRule.percentOfCommissionOne ? resellRule.percentOfCommissionOne * 100 : '';
                resellRule.percentOfCommissionTwo = resellRule.percentOfCommissionTwo ? resellRule.percentOfCommissionTwo * 100 : '';
                resellRule.percentOfCommissionThree = resellRule.percentOfCommissionThree ? resellRule.percentOfCommissionThree * 100 : '';
                this.resellRule = resellRule;           
            }
        } 

        // 分佣图片展示
        this.images = detail.images ? detail.images.split(',') : [];        
        if(this.images.length &&  detail.resellImage && this.images.indexOf(detail.resellImage) !== -1) {
            this.checkedImg = this.images.indexOf(detail.resellImage);
            this.picSorce = 0;
        } else {
            this.picSorce = 1;
            this.src = detail.resellImage;
        }

        // 是否参与分佣
        if(detail.isResell == 1) this.status = 1;
        let sku = [];
        detail.goodsInfos.forEach(v => {
            let tmp = {};
            
            tmp.sku = v.id;
            tmp.specs = Object.values(JSON.parse(v.specs)).join(' ');
            tmp.status = '';
            if(v.status == 1) tmp.status = '上架';
            if(v.status == 0) tmp.status = '下架';
            if(v.status == 1) tmp.status = '售罄';
            tmp.salePrice = v.salePrice;
            tmp.costPrice = v.costPrice;
            tmp.profits = v.salePrice - v.costPrice;
            tmp.profitRate = ((tmp.profits / v.costPrice) * 100 ).toFixed(2) + '%';
            sku.push(tmp);
        });

        this.sku = sku;
    },
    props: {
        detail: {
            type: Object,
            default: function () {
                return {
                    goodsInfos: []
                }
            }
        },
        resellConfigInfo: {
            type: Object,
            default : function () {
                return {}
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .line {
        margin-bottom: 22px;
        font-size: 14px;
        color: #3D434A;
        display: flex   ;
        .line-title {
            width: 98px;
            text-align: left;            
        }
        .line-tip {
            font-size:12px;
            line-height: 2;
            color: #92929B;
        }
        .goods-images {
            margin-top: 19px;
            display: flex;
            .good-img {
                position: relative;
                width:86px;
                height:86px;
                margin: 0 15px 15px 5px;
                img {
                    width: 100%;
                    height: 100%;
                }
                span {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    z-index: 1;
                    background: #13ce66;
                    i {
                        color: #FFF;
                    }
                }
            }
        }
        .uploadBtn {
            width: 84px;
            height: 84px;
            margin-left: 10px;
            float: left;
            text-align: center;
            line-height: 84px;
            border: 1px dotted #D0D6E4;
            border-radius: 4px;
            i {
                font-size: 24px;
                color: #D0D6E4;
            }
        }
        .commision {
            display: flex;
            .commision-cell-left {
                width: 300px;
                .commision-title {
                    margin-top: 12px;
                    height: 34px;
                    line-height: 34px;
                    text-align: left;
                }
            }
            .commision-cell-center {
                width: 160px;
                input {
                    width: 126px;
                    height: 34px;
                }
            }
            .commision-prent {
                margin-top: 14px;
                width: 160px;
                position: relative;
                span {
                    position: absolute;
                    right: 0;
                    z-index: 1;
                    background: #D8D8D8;
                    width: 32px;
                    height: 32px;
                    border-radius: 0 4px 4px 0;
                    line-height: 34px;
                    text-align: center;
                }
            }
            .commision-right {
                margin: 14px 60px 0 55px;
                display: flex;
                align-items: center;
            }
            /deep/ .el-input {
                width: 160px;
            }
        }
        .consult {
            margin-top: 40px;
            padding: 16px;
            width: 100%;
            border: 1px solid #CCCCCC;
            border-radius:4px;
            background: rgba(250,250,250,.62    );
        }
        /deep/ .el-table th {
            background: rgb(235, 234, 250);
            color: rgb(101, 94, 255);
        }
        /deep/ .el-table .cell {
            text-align: center;
        }
        /deep/.el-table__header{
            width: 100% !important;
        }
        /deep/.el-table__body{
            width: 100% !important;
        }
    }
    .btns {
        margin-top: 100px;
        display: flex;
        justify-content: center;
    }
</style>
