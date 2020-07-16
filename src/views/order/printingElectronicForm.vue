<template>
    <div class="printing-electronic-form">
        <div class="printing-electronic-form-title">打印电子面单预览</div>
        <div class="printing-electronic-form-content print-content">
            <div style="width: 375px;min-height:700px; margin: 0 auto;position:relative;">
                <div v-for="(item, index) in tableData" :class="`printing-electronic-form-item printing-electronic-form-item_${index}`" :key="index" style="position:relative;height: 700px;page-break-after:always;" v-html="item.content"></div>
            </div>
        </div>
        <div class="tc" style="margin-top: 20px;">
            <el-button @click="print" type="primary" style="margin-top: 20px;">打印</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData: []
        }
    },
    computed: {
        afterSale() {
            if(this.$route.query.afterSale) {
                return true
            } else {
                return false
            }
        }
    },
    created() {
        this.getPrintInfo()
    },
    methods: {
        print() {
            setTimeout(() => {
                let _href = window.location.href
                //1.获取当前页的html代码  

                var body = window.document.body.innerHTML; 

                //2.要打印的部分（#print里面的内容就是要打印的内容）
                const printStyle = `<style media="print">
                    @page {
                        size: auto;  /* auto is the initial value */
                        margin: 3mm; /* this affects the margin in the printer settings */
                    }
                </style>`;

                window.document.body.innerHTML = document.getElementsByClassName("print-content")[0].innerHTML + printStyle; 

                window.print();

                window.document.body.innerHTML = body;

                //重新载入当前文档:

                window.location.href = _href
            }, 0)
        },
        printInfo() {
            this._apis.order.printElectronicForm({orderIds: this.$route.query.ids.split(',').map(val => val)}).then((res) => {
                this.tableData = res
            }).catch(error => {
                this.$message.error(error);
            })
        },
        afterSalePrintInfo() {
            this._apis.order.afterSalePrintElectronicForm({orderAfterSaleIds: this.$route.query.ids.split(',')}).then((res) => {
                this.tableData = res
            }).catch(error => {
                this.$message.error(error);
            })
        },
        getPrintInfo() {
            if(this.afterSale) {
                this.afterSalePrintInfo()
            } else {
                this.printInfo()
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .printing-electronic-form {
        background-color: #fff;
        padding: 20px;
        .printing-electronic-form-title {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .printing-electronic-form-item {
            display: block;
        }
    }
</style>


