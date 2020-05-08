<template>
    <div class="el-form-item">
        <el-form-item label="配送方式">
          <el-select v-model="listQuery.deliveryMethod" @change="deliveryMethodChange">
            <el-option label="全部" value></el-option>
            <el-option label="普通快递" :value="1"></el-option>
            <el-option label="商家配送" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送时间" v-show="listQuery.deliveryMethod == 2">
          <el-date-picker
            style="margin-left: 0;"
            v-model="listQuery.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="全部日期">
          </el-date-picker>
          <el-select v-model="listQuery.timeSlot">
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
                default: {}
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
                //如果是商家配送，则显示配送时间
                if(val === 2 && this.timeSlotArr.length == 0){
                    //如果还没有获取过时间段，则发送请求获取配置的自定义时间段，如果没有自定义，则用默认的时间段order.timeSlot
                    this._apis.order
                    .getTimeSlot()
                    .then(res => {
                        res = [];
                        //如果没有自定义的时间段，则选用默认的
                        if(res.length == 0){
                            this.timeSlotArr = order.timeSlot;
                        }else{
                            this.timeSlotArr = res;
                        }
                    })
                    .catch(error => {})
                }
            }
        }
    }
</script>