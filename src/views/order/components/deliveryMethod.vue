<template>
    <div class="el-form-item" style="height: 33px; margin-right: 0;">
        <el-form-item v-if="!isAfterSales" :label="isAfterSales ? '退货方式' : '配送方式'">
          <el-select v-model="listQuery.deliveryWay" @change="deliveryMethodChange">
            <el-option label="全部" value></el-option>
            <el-option :label="isAfterSales ? '快递退货' : '普通快递'" :value="1"></el-option>
            <el-option :label="isAfterSales ? '商家自取' : '商家配送'" :value="2"></el-option>
            <el-option :label="isAfterSales ? '快递退货' : '第三方配送'" :value="3"></el-option>
            <el-option :label="isAfterSales ? '快递退货' : '上门自提'" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电子面单" v-show="listQuery.deliveryWay == 1">
          <el-select v-model="listQuery.isExpressElectronicSheet">
            <el-option label="全部" value></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="isAfterSales ? '取货时间' : '配送时间'" v-show="listQuery.deliveryWay == 2">
          <el-date-picker
            style="margin-left: 0;"
            v-model="listQuery.deliveryDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="全部日期">
          </el-date-picker>
          <el-select v-model="listQuery.deliveryTime">
            <el-option label="全部时间段" value></el-option>
            <el-option v-for="(item, index) in timeSlotArr" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
    </div>
</template>
<script>
    import order from '@/system/constant/order';
    
    export default {
        name: 'deliveryMethod',
        props: {
            listQuery: {
                type: Object,
                default: {
                    isExpressElectronicSheet: ''
                }
            },
            isAfterSales: { //是否为售后，如果为售后则文本改为 退货方式  与   取货时间
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                timeSlotArr: [] //配送时间段
            }
        },
        mounted() {
            
        },
        methods: {
            //配送方式改变
            deliveryMethodChange(val){
                //如果不是选择的商家配送，则清空配送日期与配送时间段字段
                if(val !== 2){
                    this.listQuery.deliveryDate = '';
                    this.listQuery.deliveryTime = '';
                }
                //如果是商家配送，则显示配送时间
                if(val === 2 && this.timeSlotArr.length == 0){
                    //如果还没有获取过时间段，则发送请求获取配置的自定义时间段，如果没有自定义，则用默认的时间段order.timeSlot
                    this._apis.order
                    .getTimeSlot()
                    .then(res => {
                        //如果买家预约时间类型不是自定义，则选用默认的时间段
                        if(res.subscribeTimeType != 2){
                            this.timeSlotArr = order.timeSlot;
                        }else{ //是自定义，则使用获取到的自定义时间段
                            this.timeSlotArr = res.subscribeTimeHourRanges.split(',');
                        }
                    })
                    .catch(error => {console.error(error)})
                }
            }
        }
    }
</script>