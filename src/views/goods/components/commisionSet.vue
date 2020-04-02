<template>
<div style="margin-top:20px;">
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
                    <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=366763321,1800567094&fm=26&gp=0.jpg" alt="" />
                    <span v-if="key == checkedImg"><i class="el-icon-check"></i></span>
                </div>
            </div>
            <div v-if="picSorce == 1" class="goods-images">
                <div>1111</div>
            </div>
        </div>
    </div>
    <div class="line">
        <div class="line-title">独立规则：</div>
        <div class="line-content">
             <el-radio-group v-model="enable">
                <el-radio :label="1">启用独立分佣比例</el-radio>
            </el-radio-group>
            <p class="line-tip">启用独立佣金设置，此商品拥有独自的佣金比例,不受分佣员等级比例及默认设置限制</p>
            <div style="margin-top:45px;">
                <p class="line-tip">建议参考商品的实际利润设置分佣比例，设置后该spu下的所有sku将均按照此比例计算分佣金额</p>
                <div class="commision">
                    <div class="commision-cell-left">
                        <div class="commision-title">分佣员本人（三级）佣金占分佣总佣金</div>
                        <div class="commision-title">上级分佣员（二级）佣金占分佣总佣金</div>
                        <div class="commision-title">上上级分佣员（一级）佣金占分佣总佣金分佣</div>
                    </div>
                    <div class="commision-cell-center">
                        <div class="commision-prent">
                            <el-input placeholder="0.00"></el-input><span>%</span>
                        </div>
                        <div class="commision-prent">
                            <el-input placeholder="0.00"></el-input><span>%</span>
                        </div>
                        <div class="commision-prent">
                            <el-input placeholder="0.00"></el-input><span>%</span>
                        </div>
                    </div>
                    <div class="commision-right">
                        <p class="line-tip">（注：所有层级分佣比例相加之和不能大于100%）</p>
                    </div>
                </div>
                <div class="consult">
                    <div class="line-title">参考数据：</div>
                    <div>
                        <el-table :data="tableData" tooltip-effect="dark" v-loading="loadingFlag" style="width: 100%">
                            <el-table-column label="SKU"></el-table-column>
                            <el-table-column label="规格"></el-table-column>
                            <el-table-column label="状态"></el-table-column>
                            <el-table-column label="售卖价"></el-table-column>
                            <el-table-column label="成本价"></el-table-column>
                            <el-table-column label="利润"></el-table-column>
                            <el-table-column label="利润率"></el-table-column>
                        </el-table>
                    </div>
                    <p class="line-tip">&nbsp;</p>
                    <p class="line-tip">（以下是我们根据您填写各层级分佣比例计算出的商品各层级分佣佣金，仅供参考。实际分佣结果将以最终保存的比例）</p>
                    <div>
                        <el-table :data="tableData" tooltip-effect="dark" v-loading="loadingFlag" style="width: 100%">
                            <el-table-column label="SKU"></el-table-column>
                            <el-table-column label="规格"></el-table-column>
                            <el-table-column label="分佣员本人（三级）佣金金额" width="220"></el-table-column>
                            <el-table-column label="上级分佣员（二级）佣金金额" width="220"></el-table-column>
                            <el-table-column label="上上级分佣员（一级）佣金金额" width="220"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>    
</template>
<script>

export default {
    data() {
        return {
            tableData: [],
            enable: 0,
            status: 0,
            picSorce: 1,
            checkedImg: 0,
            images: [
                'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=366763321,1800567094&fm=26&gp=0.jpg',
                'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=366763321,1800567094&fm=26&gp=0.jpg'
            ]
        }
    },
    methods: {
       changeImgCheck (key) {
           this.checkedImg = key;
       }
    },
    created() {
        
    },
    props: {
        detail: {
            type: Object,
            default: function () {
                return { }
            }
        }
    },
    watch: {
        
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
    }
</style>