<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="加入黑名单" :hasCancel="hasCancel" :isHing="isHing">
        <div class="c_container">
            <p class="user_id">用户ID：{{ data.memberSn }}</p>
            <div class="clearfix">
                <p class="c_label fl">禁用选择：</p>
                <el-checkbox v-model="checkCoupon" label="优惠券" class="fl marT10"></el-checkbox>
                <div class="form_container fl">
                    <div class="a_d" v-for="(i,index) in couponIds" :key="index">
                        <el-select v-model="i.id" style="margin-bottom: 10px" clearable @change="handleChange">
                            <el-option v-for="item in allCoupons" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        <span class="marL20 addMainColor pointer" @click="deleteCoupon(index)">删除</span>
                    </div>
                </div>
                <span class="add" @click="addCouponSel">添加</span>
            </div>
            <div class="clearfix">
                <el-checkbox v-model="checkCode" label="优惠码" class="fl marT10" style="margin-left: 86px"></el-checkbox>
                <div class="form_container fl">
                    <div class="a_d" v-for="(i,index) in codeIds" :key="index">
                        <el-select v-model="i.id" style="margin-bottom: 10px" clearable @change="handleChange2">
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
            checkCoupon: "",
            checkCode:"",
            couponId: "",
            codeId: "",
            allCoupons: [],
            allCodes: [],
            canSubmit: true,
            isHing: false
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
                this.$notify({
                    title: '警告',
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
                this.$notify({
                    title: '警告',
                    message: '不能选择重复的优惠码',
                    type: 'warning'
                });
            }
        },
        submit() {
            this.canSubmit = true;
            let params = {};
            let couponParams = {};
            let couponIdList = [];
            let couponIdList2 = [];
            let blackListMapDtos = [];
            if(this.checkCoupon) {
                if(this.couponIds[0].id.length == 0) {
                    this.$notify({
                        title: '警告',
                        message: '请选择优惠券',
                        type: 'warning'
                    });
                    this.canSubmit = false;
                }else{
                    let arr = [];
                    this.couponIds.map((item) => {
                        this.allCoupons.map((i) => {
                            let obj = {};
                            if(item.id == i.id) {
                                obj.id = item.id;
                                obj.name = i.name
                                arr.push(obj);
                                couponIdList.push(item.id);
                            }
                        })
                    })
                    let obj = {
                        blackInfoId: this.couponId,
                        blackInfoName: "优惠券",
                        disableItemValue: arr
                    }
                    blackListMapDtos.push(obj);
                }
            }
            if(this.checkCode) {
                if(this.codeIds[0].id.length == 0) {
                    this.$notify({
                        title: '警告',
                        message: '请选择优惠码',
                        type: 'warning'
                    });
                    this.canSubmit = false;
                }else{
                    let arr = [];
                    this.codeIds.map((item) => {
                        this.allCodes.map((i) => {
                            let obj = {};
                            if(item.id == i.id) {
                                obj.name = i.name;
                                obj.id = i.id;
                                arr.push(obj);
                                couponIdList2.push(i.id);
                            }
                        })
                    })
                    let obj = {
                        blackInfoId: this.codeId,
                        blackInfoName: "优惠码",
                        disableItemValue: arr
                    }
                    blackListMapDtos.push(obj);
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
            if(!this.canSubmit || params.blackListMapDtos.length == 0) {
                this.$notify({
                    title: '警告',
                    message: '请选择禁用选项',
                    type: 'warning'
                });
            }else{
                //营销优惠券加入黑名单
                if(couponIdList.length > 0) {
                    this._apis.client.frozenCoupons({couponIdList: couponIdList, memberId:this.data.id, frozenType: 1}).then((response) => {
                        //console.log(response);
                    }).catch((error) => {
                        console.log(error);
                    });
                }
                //优惠码加入黑名单
                if(couponIdList2.length > 0) {
                    this._apis.client.frozenCoupons({couponIdList: couponIdList2, memberId:this.data.id, frozenType: 1}).then((response) => {
                        //console.log(response);
                    }).catch((error) => {
                        console.log(error);
                    })
                }
                //电商加入黑名单
                this._apis.client.addToBlack(params).then((response) => {
                    this.$notify({
                        title: '成功',
                        message: "加入黑名单成功",
                        type: 'success'
                    });
                    this.$emit('freshTable');
                }).catch((error) => {
                    console.log(error);
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
            this.couponIds.splice(index, 1);
        },
        deleteCode(index) {
            this.codeIds.splice(index, 1);
        },
        getAllCoupons() {
            this._apis.client.getAllCoupons({couponType: 0}).then((response) => {
                this.allCoupons = [].concat(response.list);
            }).catch((error) => {
                console.log(error);
            })
        },
        getAllCodes() {
            this._apis.client.getAllCoupons({couponType: 1}).then((response) => {
                this.allCodes = [].concat(response.list);
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
.user_id{
    text-align: left;
    padding: 0 0 10px 15px;
}
.marL20{
    margin-left: 20px;
}
.marT10{
    margin: 4px 10px 0 0;
}
.c_label{
    margin: 5px 0 0 15px;
}
.form_container{
    width: 290px;
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
        margin: 15px 0;
    }
}
.red{
    color: #F55858;
    margin-top: 15px;
}
</style>


