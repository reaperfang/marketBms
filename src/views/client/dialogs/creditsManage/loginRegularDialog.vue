<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="登录获取积分规则" :hasCancel="hasCancel">
        <div class="c_container">
            <div class="clearfix"><span class="fl marR20">登录获取积分规则</span><el-switch class="fl" v-model="enable" active-color="#66CCAC"></el-switch></div>
            <div class="giveBottom" v-if="enable"> 
            <div>每天首次进入小程序或微信公众号获取积分</div>
            <div>
                <span>是否区分人群发放：</span>
                <el-radio v-model="distinguish" label="0">不区分</el-radio>
                <el-radio v-model="distinguish" label="1">区分</el-radio>
            </div>
            <div v-if="distinguish == '0'">
                <div class="input_wrap">
                    <el-input placeholder="请输入整数" v-model="allMember" @keyup.native="checkZero($event,allMember,'allMember')"></el-input>
                </div>
                <span>积分</span>
            </div> 
            <div v-if="distinguish == '1'">
                <div class="marB10">
                    <span>客户</span>
                    <div class="input_wrap" style="margin-left:14px">
                        <el-input placeholder="请输入整数" v-model="noMember" @keyup.native="checkZero($event,noMember,'noMember')"></el-input>
                    </div>
                </div>
                <div class="marB10">
                    <span>新会员</span>
                    <div class="input_wrap">
                        <el-input placeholder="请输入整数" v-model="newMember" @keyup.native="checkZero($event,newMember,'newMember')"></el-input>
                    </div>
                </div>
                <div class="marB10">
                    <span>老会员</span>
                    <div class="input_wrap">
                        <el-input placeholder="请输入整数" v-model="oldMember"></el-input>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'
export default {
    props: ['data'],
    name: "loginRegularDialog",
    data() {
        return {
            hasCancel: true,
            enable: false,
            distinguish: '',
            allMember:"0",
            noMember:"0",
            newMember:"0",
            oldMember:"0"
        }
    },
    methods: {
        checkZero(event,val,ele) {
            val = val.replace(/[^\d]/g,'');
            val = val.replace(/^0/g,'');
            this[ele] = val;
        },
        submit() {
            this.distinguish = this.distinguish == '0'? false : true;
            let params;
            if(this.enable) {
                params = {
                    id: this.data.row.id,
                    enable: this.enable,
                    sceneRule: {
                        distinguish: this.distinguish,
                        noDistinguish: {
                            allMember: this.allMember
                        },
                        yesDistinguish: {
                            noMember: this.noMember,
                            newMember: this.newMember,
                            oldMember: this.oldMember
                        }
                    }
                }
            }else{
                params = {
                    id: this.data.row.id,
                    enable: this.enable,
                }
            }
            this._apis.client.editCreditRegular(params).then((response) => {
                this.$notify({
                    title: '成功',
                    message: "保存成功",
                    type: 'success'
                });
                this.$emit('refreshPage');
            }).catch((error) => {
                console.log(error);
            })
        },
        getInfo() {
            let row = this.data.row;
            if(row.sceneRule.length > 0) {
                let sceneRule = JSON.parse(row.sceneRule);
                this.enable = row.enable == '启用'?true:false;
                this.distinguish = sceneRule.distinguish?"1":"0";
                this.allMember = sceneRule.noDistinguish.allMember || 0;
                this.oldMember = sceneRule.yesDistinguish.oldMember || 0;
                this.newMember = sceneRule.yesDistinguish.newMember || 0;
                this.noMember = sceneRule.yesDistinguish.noMember || 0;
            }
        }
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
    mounted() {
        this.getInfo();
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
.c_container{
    >div{
        margin-bottom: 17px;
    }
    .giveBottom{
        > div{
            text-align: left;
            margin-bottom: 17px;
            .input_wrap{
                width: 80px;
                display: inline-block;
            }
        }
    }
    .marR20{
        margin-right: 20px;
    }
}
</style>


