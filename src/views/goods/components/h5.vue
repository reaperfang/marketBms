<template>
    <div class="h5">
        <div class="h5-header">
            <div class="h5-header-left">
                <i></i>
                <span>分享才会有更多人查看哦</span>
            </div>
            <el-tooltip popper-class="share-popper" class="item" effect="dark" placement="bottom">
                <div slot="content">
                    1、商品“二维码”：<br />
                    为你的每一件SPU商品，都自动生成了一个永久二维码（删除商品后失效），方便你下载该商品二维码，印刷然后张贴到需要用的地方，便于消费者快速扫码购买。 
                    用户扫描该二维码后，可直接打开商品详情页面，并且默认选中该SPU商品的第一个SKU规格属性值，完成快速下单购买和分享推广。 <br /><br />
                    2、商品二维码的特性： <br />
                    唯一：每个SPU商品创建后将有单独的二维码； <br />
                    不变更：创建好的商品无论商品内容如何修改，二维码不会变更； <br />
                    商品删除即失效：如果你删除商品，该商品二维码将被一起删除，无法再找回。
                </div>
                <div @click="disabled = !disabled" class="miniCode-header-right pointer">帮助</div>
            </el-tooltip>
        </div>
        <div class="h5-content">
            <h2>一键复制公众号商品详情页地址</h2>
            <el-input id="address" v-model="productUrl">
                <template slot="append"><span class="pointer" @click="copy">复制</span></template>
            </el-input>
            <div class="qrcode-box">
                <!-- <div id="qrcode"></div> -->
                <img width="136" :src="content" />
                <p>扫码查看公众号商品详情页</p>
                <div @click="download" class="download pointer">下载到本地</div>
            </div>
        </div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'

export default {
    data() {
        return {
            address: '',
            url: '',
            content: '',
            name: '',
            productUrl: '',
        }
    },
    mounted () {
        this.share()
    },
    methods: {
        share() {
            this._apis.goods.shareOne({id: this.spuid, channelInfoId: 2}).then((res) => {
                console.log(res)
                this.content = res.content
                this.name = res.name
                this.productUrl = res.productUrl
                //this.qrcode();
            }).catch(error => {
                this.visible = false
                this.$message.error({
                    message: error,
                    type: 'error'
                });
            })
        },
        qrcode() {
            let qrcode = new QRCode('qrcode', {
                width: 136,  
                height: 136,
                text: this.shareData.url, 
                colorDark : "#000",
                colorLight : "#fff",
            })
        },
        download() {
            //let canvas = document.getElementById('qrcode').getElementsByTagName('canvas')
            let a = document.createElement('a')

            //a.href = canvas[0].toDataURL('image/png')
            a.href = this.content
            //a.download = this.shareData.chanel + this.shareData.name + this.shareData.sku + '...'
            a.download = this.name
            a.click()
        },
        copy() {
            let input = document.getElementById('address')

            input.select();
            document.execCommand("Copy");
            //alert("复制成功。");
            this.$message({
                message: '复制成功。',
                type: 'success'
            });
        }
    },
    props: {
        shareData: {
            type: Object,
            default: function () {
                return { }
            }
        },
        spuid: {
            type: String
        }
    }
}
</script>
<style lang="scss" scoped>
    .h5 {
        .h5-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size:18px;
            background:rgba(87,142,250,0.1);
            border-radius:4px;
            border:1px solid rgba(87,142,250,1);
            padding: 16px 9px;
            .h5-header-left {
                display: flex;
                align-items: center;
                i {
                    display: inline-block;
                    width: 33px;
                    height: 33px;
                    background: url('../../../assets/images/goods/warning.png') no-repeat;
                }
                span {
                    font-size:18px;
                    font-weight:400;
                    color:rgba(61,67,74,1);
                    margin-left: 16px;
                }
            }
            .h5-header-right {
                font-size:18px;
                font-weight:400;
                color:rgba(87,142,250,1);
            }
        }
        .h5-content {
            h2 {
                font-size:18px;
                font-weight:400;
                color:rgba(68,61,74,1);
                margin-top: 34px;
                margin-bottom: 12px;
            }
            .qrcode-box {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: 30px;
                p {
                    font-size:18px;
                    font-weight:400;
                    color:rgba(68,61,74,1);
                    margin-top: 9px;
                }
                .download {
                    font-size:18px;
                    font-weight:400;
                    color:rgba(101,94,255,1);
                    margin-top: 5px;
                }
            }
        }
    }
    /deep/ .el-input {
        height: 42px;
        .el-input__inner {
            height: 42px;
            background: rgba(211,211,211,0.2);
            border: 1px solid rgba(182,181,200,1);
        }
        .el-input-group__append {
            background: rgba(211,211,211,0.2);
            border: 1px solid rgba(182,181,200,1);
            color: #578EFA;
            border-left: none;
        }
    }
    .miniCode-header-right {
        color: #578EFA;
    }
</style>
<style lang="scss">
    .share-popper {
        width: 370px;
        background:rgba(51,51,51,1)!important;
        opacity:0.81!important;
        font-size:12px;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:18px;
        .popper__arrow {
            top: -6px;
            border-top-width: 0;
            border-bottom-color: rgba(51,51,51,1)!important;
        }
    }
    .share-popper[x-placement^=bottom] .popper__arrow::after {
        top: 1px;
        margin-left: -5px;
        border-top-width: 0;
        border-bottom-color: rgba(51,51,51,1)!important;
    }
</style>


