<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="批量加入黑名单" :hasCancel="hasCancel" :showFooter="false">
        <div class="c_container">
            <p class="user_id">满足以上搜索条件共{{data.checkedItem.length}}个用户</p>
            <div class="clearfix">
                <p class="c_label fl">禁用选择：</p>
                <el-checkbox v-model="checkCoupon" label="优惠券" class="fl marT10"></el-checkbox>
                <div class="form_container fl">
                    <div class="a_d" v-for="(i,index) in couponIds" :key="index">
                        <el-select v-model="i.id" style="margin-bottom: 10px" @change="handleChange">
                            <el-option v-for="item in allCoupons" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        <span class="marL20 addMainColor pointer" @click="deleteCoupon(index)">删除</span>
                    </div>
                </div>
                <span class="add" @click="addCouponSel">添加</span>
            </div>
            <div class="clearfix">
                <el-checkbox v-model="checkCode" label="优惠码" class="fl marT10" style="margin-left: 85px"></el-checkbox>
                <div class="form_container fl">
                    <div class="a_d" v-for="(i,index) in codeIds" :key="index">
                        <el-select v-model="i.id" style="margin-bottom: 10px" @change="handleChange2">
                            <el-option v-for="item in allCodes" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        <span class="marL20 addMainColor pointer" @click="deleteCode(index)">删除</span>
                    </div>
                </div>
                <span class="add" @click="addCodeSel">添加</span>
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
            checkCoupon:"",
            checkCode:"",
            couponId:"",
            codeId:"",
            allCodes: [],
            allCoupons: [],
            canSubmit: true,
            btnLoading: false
        }
    },
    methods: {
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
            this.canSubmit = true;
            let params = {};
            let blackListMapDtos = [];
            let memberInfoIds = [];
            let couponIdList = [];
            let couponIdList2 = [];
            let memberIdList = [];
            if(!!this.checkCoupon) {
                if(this.couponIds[0].id == "") {
                    this.btnLoading = false;
                    this.$message({
                        message: '请选择优惠券',
                        type: 'warning'
                    });
                    this.canSubmit = false;
                }else{
                    this.canSubmit = true;
                    let arr = [];
                    this.couponIds.map((item) => {
                        arr.push(item.id);
                    })
                    let obj = {
                        blackInfold: this.couponId,
                        disableItemValue: arr.join(',')
                    }
                    couponIdList = [].concat(arr);
                    blackListMapDtos.push(obj);
                }
            }
            if(!!this.checkCode) {
                if(this.codeIds[0].id == "") {
                    this.btnLoading = false;
                    this.$message({
                        message: '请选择优惠码',
                        type: 'warning'
                    });
                    this.canSubmit = false;
                }else{
                    this.canSubmit = true;
                    let arr = [];
                    this.codeIds.map((item) => {
                        arr.push(item.id);
                    })
                    let obj = {
                        blackInfold: this.codeId,
                        disableItemValue: arr.join(',')
                    }
                    couponIdList2 = [].concat(arr);
                    blackListMapDtos.push(obj);
                }
            }
            this.checks.map((v) => {
                if(v.checked) {
                    let obj = {
                        blackInfold: v.id,
                        disableItemValue: "1"
                    }
                    blackListMapDtos.push(obj);
                }
            });
            this.data.checkedItem.map((v) => {
                memberInfoIds.push(v.id);
            });
            memberIdList = [].concat(memberInfoIds);
            params.memberInfoIds = memberInfoIds.join(',');
            params.blackListMapDtos = [].concat(blackListMapDtos);
            if(!!this.canSubmit && params.blackListMapDtos.length > 0) {
                //营销优惠券加入黑名单
                if(couponIdList.length > 0) {
                    this._apis.client.batchFrozenCoupons({couponIdList: couponIdList, memberIdList:memberIdList, frozenType: 1}).then((response) => {
                        //console.log(response);
                    }).catch((error) => {
                        console.error(error);
                    });
                }
                if(couponIdList2.length > 0) {
                    this._apis.client.batchFrozenCoupons({couponIdList: couponIdList2, memberIdList:memberIdList, frozenType: 1}).then((response) => {
                        //console.log(response);
                    }).catch((error) => {
                        console.error(error);
                    });
                }
                //电商批量加入黑名单
                this._apis.client.batchToBlack(params).then((response) => {
                    this.btnLoading = false;
                    this.visible = false;
                    this.$message({
                        message: '批量加入黑名单成功',
                        type: 'success'
                    });
                    this.$emit('freshTable');
                }).catch((error) => {
                    this.btnLoading = false;
                    this.visible = false;
                    console.error(error);
                })
            }else{
                this.btnLoading = false;
                this.$message({
                    message: '请选择禁用选项',
                    type: 'warning'
                });
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
                console.error(error);
            })
        },
        addCouponSel() {
            this.couponIds.push({id: ""});
        },
        addCodeSel() {
            this.codeIds.push({id: ""});
        },
        deleteCoupon(index) {
            this.couponIds.splice(index, 1);
        },
        deleteCode(index) {
            this.codeIds.splice(index, 1);
        },
        getAllCoupons() {
            this._apis.client.getAllCoupons({couponType: 0, t: Date.parse(new Date()) / 1000}).then((response) => {
                this.allCoupons = [].concat(response.list);
            }).catch((error) => {
                console.error(error);
            })
        },
        getAllCodes() {
            this._apis.client.getAllCoupons({couponType: 1, t: Date.parse(new Date()) / 1000}).then((response) => {
                this.allCodes = [].concat(response.list);
            }).catch((error) => {
                console.error(error);
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
.user_id{
    text-align: left;
    padding: 0 0 19px 15px;
}
.c_label{
    margin: 5px 0 0 15px;
}
.marT10{
    margin: 3px 10px 0 0;
}
.marL20{
    margin-left: 20px;
}
.form_container{
    width: 266px;
    .a_d{
        text-align: left;
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
        margin: 19px 0;
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


