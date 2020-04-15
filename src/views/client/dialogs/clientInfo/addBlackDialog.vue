<template>
<div>
    <DialogBase :visible.sync="visible" @submit="submit" title="加入黑名单" :hasCancel="hasCancel" :showFooter="false">
        <div class="c_container">
            <p class="user_id">用户ID：{{ data.memberSn }}</p>
            <div class="clearfix">
                <p class="c_label fl">禁用选择：</p>
                <el-checkbox v-model="checkCoupon" label="优惠券" class="fl marT10" @change="changeCoupon" v-if="couponList && couponList.length!==0"></el-checkbox>
                <div class="form_container fl">
                    <div class="a_d" v-for="(item,index) in selectedCoupons" :key="index">
                        <span class="a_d_name">{{item.name}}</span>
                        <el-input-number v-model="item.frozenNum" :min="1"></el-input-number>
                        <span class="marL20 pointer a_d_delete" @click="deleteCoupon(index)">删除</span>
                    </div>
                </div>
            </div>
            <div class="clearfix">
                <el-checkbox v-model="checkCode" label="优惠码" class="fl marT11" style="margin-left: 86px" @change="changeCode" v-if="codeList && codeList.length!==0"></el-checkbox>
                <div class="form_container fl">
                    <div class="a_d" v-for="(item,index) in selectedCodes" :key="index">
                        <span class="a_d_name">{{item.name}}</span>
                        <el-input-number v-model="item.frozenNum" :min="1"></el-input-number>
                        <span class="marL20 a_d_delete pointer" @click="deleteCode(index)">删除</span>
                    </div>
                </div>
            </div>
            <div class="check_container">
                <el-checkbox v-for="item in checks.slice(2,checks.length)" :key="item.id" v-model="item.checked" :label="item.name" class="check_item"></el-checkbox><br>
            </div>
            <p class="red">提示：积分、余额和优惠券属于虚拟资产，冻结可能会产品生法律风险，请谨慎操作。</p>
        </div>
        <div>
            <span slot="footer" class="dialog-footer fcc">
                <el-button type="primary" @click="submit" :loading="btnLoading">确 认</el-button>
                <el-button v-if="hasCancel" @click="visible = false">取 消</el-button>
            </span>
        </div>
    </DialogBase>
    <el-dialog
        title="选择优惠券"
        :visible.sync="dialogVisible2"
        width="45%"
    >
        <div>
            <p class="user_id2">用户ID: {{ data.memberSn }}</p>
            <el-table
                :data="couponList"
                style="width: 100%"
                ref="couponListTable"
                :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
                :default-sort="{prop: 'date', order: 'descending'}"
                v-loading="loading"
            >
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="优惠券名称">
                </el-table-column>
                <el-table-column
                    label="优惠方式">
                    <template slot-scope="scope">
                        {{scope.row.useType == 0?`减免${scope.row.useTypeFullcut}元`:`折扣${scope.row.useTypeDiscount}`}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="使用门槛">
                    <template slot-scope="scope">
                        {{scope.row.useCondition == -1?'无极限':`订单满${scope.row.useCondition}元`}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="ownNum"
                    label="数量"
                    width="80"
                >
                </el-table-column>
                <el-table-column
                    label="冻结数量"
                    width="150"
                    >
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.frozenNum" :min="1" :max="scope.row.ownNum"></el-input-number>
                    </template>
                </el-table-column>
            </el-table>
            <div class="a_line">
                <div class="fl">
                    <el-checkbox v-model="checkAll" @change="handleChangeAll">全选</el-checkbox>
                </div>
                <div class="fr">
                    共{{couponList.length}}条数据
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="couponSubmit">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
        title="选择优惠码"
        :visible.sync="dialogVisible3"
        width="40%"
    >
        <div>
            <p class="user_id2">用户ID: {{ data.memberSn }}</p>
            <el-table
                :data="codeList"
                style="width: 100%"
                ref="codeListTable"
                :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
                :default-sort="{prop: 'date', order: 'descending'}"
                v-loading="loading"
            >
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="优惠券名称">
                </el-table-column>
                <el-table-column
                    label="优惠方式">
                    <template slot-scope="scope">
                        {{scope.row.useType == 0?`减免${scope.row.useTypeFullcut}元`:`折扣${scope.row.useTypeDiscount}`}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="使用门槛">
                    <template slot-scope="scope">
                        {{scope.row.useCondition == -1?'无极限':`订单满${scope.row.useCondition}元`}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="ownNum"
                    label="数量"
                    width="80"
                >
                </el-table-column>
                <el-table-column
                    label="冻结数量"
                    width="150"
                    >
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.frozenNum" :min="1" :max="scope.row.ownNum"></el-input-number>
                    </template>
                </el-table-column>
            </el-table>
            <div class="a_line">
                <div class="fl">
                    <el-checkbox v-model="checkAll2" @change="handleChangeAll2">全选</el-checkbox>
                </div>
                <div class="fr">
                    共{{codeList.length}}条数据
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible3 = false">取 消</el-button>
            <el-button type="primary" @click="codeSubmit">确 定</el-button>
        </span>
    </el-dialog>
</div> 
</template>
<script>
import clientApi from '@/api/client';
import DialogBase from '@/components/DialogBase'
export default {
    name: "addBlackDialog",
    props: ['data'],
    data() {
        return {
            hasCancel: true,
            blackCheck1: false,
            checks: [],
            couponIds: [{id:""}],
            codeIds: [{id:""}],
            checkCoupon: "",
            checkCode:"",
            couponId: "",
            codeId: "",
            allCoupons: [],
            allCodes: [],
            btnLoading: false,
            dialogVisible2: false,
            dialogVisible3: false,
            couponList:[],
            codeList: [],
            loading: false,
            checkAll: false,
            checkAll2: false,
            selectedCoupons: [],
            selectedCodes: [],
            canSubmit: true
        }
    },
    methods: {
        couponSubmit() {
            this.dialogVisible2 = false;
            let sel = this.$refs.couponListTable.selection;
            if(sel.length !== 0) {
                this.selectedCoupons = [].concat(sel);
            }else{
                this.$message({
                    message: '请选择优惠券',
                    type: 'warning'
                });
            }
        },
        codeSubmit() {
            this.dialogVisible3 = false;
            let sel = this.$refs.codeListTable.selection;
            if(sel.length !== 0) {
                this.selectedCodes = [].concat(sel);
            }else{
                this.$message({
                    message: '请选择优惠码',
                    type: 'warning'
                });
            }
        },
        handleChangeAll(val) {
            this.couponList.forEach(row => {
                this.$refs.couponListTable.toggleRowSelection(row,val);
            });
        },
        handleChangeAll2(val) {
            this.codeList.forEach(row => {
                this.$refs.codeListTable.toggleRowSelection(row,val);
            });
        },
        changeCoupon(val) {
            if(val) {
                this.dialogVisible2 = true;
            }else{
                this.selectedCoupons = [];
            }
        },
        changeCode(val) {
            if(val) {
                this.dialogVisible3 = true;
            }else{
                this.selectedCodes = [];
            }
        },
        isRepeat(arr) {
            let hash = {};
            for(let i in arr) {
                if(hash[arr[i]]) {
                    return true;
                }
                hash[arr[i]] = true;
            }
            return false;
        }, 
        handleChange() {
            let arr = [];
            this.couponIds.map((v) => {arr.push(v.id)});
            let flag = this.isRepeat(arr);
            if(flag) {
                this.couponIds.splice(this.couponIds.length - 1,1);
                this.$message({
                    message: '不能选择重复的优惠券',
                    type: 'warning'
                });
            }
        },
        handleChange2() {
            let arr = [];
            this.codeIds.map((v) => {arr.push(v.id)});
            let flag = this.isRepeat(arr);
            if(flag) {
                this.codeIds.splice(this.codeIds.length - 1,1);
                this.$message({
                    message: '不能选择重复的优惠码',
                    type: 'warning'
                });
            }
        },
        submit() {
            this.btnLoading = true;
            let params = {};
            let couponParams = {};
            let couponIdList = [];
            let couponIdList2 = [];
            let blackListMapDtos = [];
            if(this.checkCoupon) {
                if(this.selectedCoupons.length !== 0) {
                    let arr = [];
                    this.selectedCoupons.map((item) => {
                        let obj = {};
                        obj.name = item.name;
                        obj.id = item.id;
                        obj.forzenNum = item.frozenNum;
                        arr.push(obj);
                    })
                    let obj = {
                        blackInfoId: this.couponId,
                        blackInfoName: "优惠券",
                        disableItemValue: arr
                    }
                    blackListMapDtos.push(obj);
                }else{
                    this.$message({
                        message: '请选择禁用优惠券',
                        type: 'warning'
                    });
                    this.canSubmit = false;
                }
            }
            if(this.checkCode) {
                if(this.selectedCodes.length !== 0) {
                    let arr = [];
                    this.selectedCodes.map((item) => {
                        let obj = {};
                        obj.name = item.name;
                        obj.id = item.id;
                        obj.forzenNum = item.frozenNum;
                        arr.push(obj);
                    })
                    let obj = {
                        blackInfoId: this.codeId,
                        blackInfoName: "优惠码",
                        disableItemValue: arr
                    }
                    blackListMapDtos.push(obj);
                }else{
                    this.$message({
                        message: '请选择禁用优惠码',
                        type: 'warning'
                    });
                    this.canSubmit = false;
                }
            }
            this.checks.map((v) => {
                if(v.checked) {
                    let obj = {
                        blackInfoId: v.id,
                        disableItemValue: "1",
                        blackInfoName: v.name
                    }
                    blackListMapDtos.push(obj);
                }
            });
            params.memberInfoId = this.data.id;
            params.blackListMapDtos = [].concat(blackListMapDtos);
            if(params.blackListMapDtos.length == 0) {
                this.btnLoading = false;
                this.$message({
                    message: '请选择禁用选项',
                    type: 'warning'
                });
            }else if(this.canSubmit){
                //营销优惠券加入黑名单
                if(this.selectedCoupons.length > 0) {
                    let arr = [];
                    this.selectedCoupons.map((item) => {
                        let obj = {};
                        obj.id = item.id;
                        obj.couponNum = item.frozenNum;
                        arr.push(obj);
                    });
                    this._apis.client.frozenCoupons({couponList: arr, memberId:this.data.id, frozenType: 1}).then((response) => {
                        //console.log(response);
                    }).catch((error) => {
                        console.log(error);
                    });
                }
                //优惠码加入黑名单
                if(this.selectedCodes.length > 0) {
                    let arr = [];
                    this.selectedCodes.map((item) => {
                        let obj = {};
                        obj.id = item.id;
                        obj.couponNum = item.frozenNum;
                        arr.push(obj);
                    });
                    this._apis.client.frozenCoupons({couponList: arr, memberId:this.data.id, frozenType: 1}).then((response) => {
                        //console.log(response);
                    }).catch((error) => {
                        console.log(error);
                    })
                }
                //电商加入黑名单
                this._apis.client.addToBlack(params).then((response) => {
                    this.btnLoading = false;
                    this.visible = false;
                    this.$message({
                        message: '加入黑名单成功',
                        type: 'success'
                    });
                    this.$emit('refreshPage');
                }).catch((error) => {
                    console.log(error);
                    this.btnLoading = false;
                    this.visible = false;
                })
            } 
        },
        getBlackChecks() {
            this._apis.client.blackChecks({}).then((response) => {
                response.map((v) => {
                    this.$set(v, 'checked', false);
                });
                this.checks = [].concat(response);
                this.couponId = this.checks[0].id;
                this.codeId = this.checks[1].id;
            }).catch((error) => {
                console.log(error);
            })
        },
        addCouponSel() {
            this.couponIds.push({id: ""});
        },
        addCodeSel() {
            this.codeIds.push({id: ""});
        },
        deleteCoupon(index) {
            this.selectedCoupons.splice(index, 1);
            this.couponList.forEach((row,i) => {
                if(i == index) {
                    this.$refs.couponListTable.toggleRowSelection(row, false);
                }
            })
            if(this.selectedCoupons.length == 0) {
                this.checkCoupon = false;
                this.couponList.forEach((row) => {
                    this.$refs.couponListTable.toggleRowSelection(row, false);
                })
            }
        },
        deleteCode(index) {
            this.selectedCodes.splice(index, 1);
            this.codeList.forEach((row,i) => {
                if(i == index) {
                    this.$refs.codeListTable.toggleRowSelection(row, false);
                }
            })
            if(this.selectedCodes.length == 0) {
                this.checkCode = false;
                this.codeList.forEach((row) => {
                    this.$refs.codeListTable.toggleRowSelection(row, false);
                })
            }
        },
        getAllCoupons() {
            this._apis.client.getAllCoupons({couponType: 0, memberId: this.data.id, frozenType: 1, startIndex: 1, pageSize: 999, t: Date.parse(new Date()) / 1000}).then((response) => {
                this.couponList = [].concat(response.list);
                this.couponList.map((item) => {
                    this.$set(item, 'frozenNum',1);
                })
            }).catch((error) => {
                console.log(error);
            })
        },
        getAllCodes() {
            this._apis.client.getAllCoupons({couponType: 1, memberId: this.data.id, frozenType: 1, startIndex: 1, pageSize: 999, t: Date.parse(new Date()) / 1000}).then((response) => {
                this.codeList = [].concat(response.list);
                this.codeList.map((item) => {
                    this.$set(item, 'frozenNum', 1);
                })
            }).catch((error) => {
                console.log(error);
            })
        },
    },
    computed: {
        visible: {
            get() {
                return this.dialogVisible
            },
            set(val) {
                this.$emit('update:dialogVisible', val)
            }
        }
    },
    created() {
        this.getBlackChecks();
        this.getAllCoupons();
        this.getAllCodes();
    },
    props: {
        data: {

        },
        dialogVisible: {
            type: Boolean,
            required: true
        },
    },
    components: {
        DialogBase
    }
}
</script>
<style lang="scss" scoped>
/deep/ .el-table__body-wrapper{
    overflow: auto;
    height: 502px;
}
/deep/ .el-dialog__header{
    background: #f1f0ff;
    border-radius: 10px 10px 0 0;
}
/deep/ .el-input-number--small .el-input-number__decrease{
    width: 18px;
    font-size: 13px;
    height: 18px;
    background-color: #655EFF;
    color: #fff;
    border-radius: 50%;
    line-height: 18px;
    margin-top: 5px;
}
/deep/ .el-input-number--small .el-input-number__increase{
    width: 18px;
    font-size: 13px;
    height: 18px;
    background-color: #655EFF;
    color: #fff;
    border-radius: 50%;
    line-height: 18px;
    margin-top: 5px;
}
/deep/ .el-input-number--small{
    width: 94px;
}
/deep/ .el-input-number--small .el-input__inner{
    padding-left: 21px;
    padding-right: 21px;
    border: 0;
    background: none;
}
/deep/ .el-dialog{
    border-radius: 10px;
}
.a_line{
    margin: 24px 46px 0 15px;
    overflow: hidden;
}
.user_id{
    text-align: left;
    padding: 0 0 10px 15px;
}
.user_id2{
    text-align: left;
    padding: 0 0 10px 15px;
    font-weight: bold;
}
.marL20{
    margin-left: 20px;
}
.marT10{
    margin: 4px 10px 12px 0;
}
.marT11{
    margin: 4px 10px 2px 0;
}
.c_label{
    margin: 5px 0 0 15px;
}
.form_container{
    width: 290px;
    .a_d{
        text-align: left;
        .a_d_name{
            display: inline-block;
            color:#B5BDCA;
            width: 125px;
            overflow: hidden;
            margin-right: 5px;
        }
        .a_d_delete{
            color: #FD4C2B;
        }
    }
}
.add{
    float: left;
    color: #655EFF;
    margin: 8px 0 0 5px;
    cursor: pointer;
}
.check_container{
    text-align: left;
    padding-left: 86px;
    .check_item{
        display: block;
        margin: 15px 0;
    }
}
.red{
    color: #F55858;
    margin-top: 15px;
}
.dialog-footer{
    margin-top: 20px;
}
</style>


