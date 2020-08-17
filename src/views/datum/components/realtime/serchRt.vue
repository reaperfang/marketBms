<template>
<div class="fr clearfix" style="position:relative;">
                        <el-select class="dayselect" v-model="value" placeholder="请选择">
                            <el-option label="日" value="1"></el-option>
                            <el-option label="周" value="2"></el-option>
                            <el-option label="月" value="3"></el-option>
                            <el-option label="季度" value="4"></el-option>
                        </el-select>
                        <el-date-picker class="dayinput" v-if="value==1"
                        v-model="value2" @change="getData"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format='timestamp'
                        :picker-options="pickerOptions">
                        </el-date-picker>
                        <el-date-picker class="dayinput" v-if="value==2"
                        v-model="value2" @change="getData"
                        type="week"
                        format="yyyy 第 WW 周"
                        placeholder="选择周" :picker-options="pickerOptions">
                        </el-date-picker>
                        <el-date-picker class="dayinput" v-if="value==3"
                        v-model="value2" @change="getData"
                        type="month"
                        format="yyyy-MM"
                        placeholder="选择月" :picker-options="pickerOptions">
                        </el-date-picker>
                        <quarter class="fl" v-if="value==4" />
                    </div>
</template>
<script>
import quarter from "./quarter";//季度
export default {
    components: { quarter },
  data() {
    return {
      pickerOptions: {
            disabledDate(time) {
            return time.getTime() > Date.now();
            },
            },
        value2: '',
        value:'1',
    }
  },
  created() {
  },
  methods: {
    getData(){
        this.$emit("change",this.value2)
    }
  }
}
</script>
<style lang="scss">
.dayselect{
    float: left;
    width: 70px;
    .el-input__inner{
        border-radius:4px 0px 0px 4px;
        border-right:none;
    }
}
.dayinput{
    float: left;
    width: 250px !important;
    .el-input__inner{
        border-radius:0px 4px 4px 0px;
    }
    
}
</style>