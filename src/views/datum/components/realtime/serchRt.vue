<template>
<div class="fr clearfix" >
                        <el-select class="dayselect" :popper-append-to-body="false"  v-model="value" placeholder="请选择" @change="getUnits">
                            <el-option label="日" prop="ri" value="0"></el-option>
                            <el-option label="周" prop="zhou" value="1"></el-option>
                            <el-option label="月" prop="yue" value="2"></el-option>
                            <el-option label="季度" value="3"></el-option>
                        </el-select>
                        <div style="float:left;position:relative;"  v-show="value==0">
                            <el-date-picker class="dayinput"
                        v-model="value2" @change="getData"
                        align="right"
                        type="date"
                        key="ri"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format='timestamp'
                        :picker-options="pickerOptions">
                        </el-date-picker>
                        </div>
                        
                        <el-date-picker class="dayinput" v-show="value==1"
                        v-model="value2" @change="getData"
                        type="week"
                        key="zhou"
                        format="yyyy 第 WW 周"
                        placeholder="选择周" :picker-options="pickerWeek">
                        </el-date-picker>
                        <el-date-picker class="dayinput" v-show="value==2"
                        v-model="value2" @change="getData"
                        type="month"
                        key="yue"
                        format="yyyy-MM"
                        placeholder="选择月" :picker-options="pickerMonth">
                        </el-date-picker>
                        <div style="position:relative; float:left">
                            <quarter class="fl" v-show="value==3" @change="getquar" />
                        </div>
                    </div>
</template>
<script>
import quarter from "./quarter";//季度
export default {
    components: { quarter },
  data() {
    return {
      pickerOptions: {//日期
            disabledDate(time) {
                return time.getTime() > Date.now() - 8.64e7;
            },
        },
        pickerWeek: {//周  https://www.cnblogs.com/lvsige/p/13474932.html
            disabledDate(time) {
                let wk = new Date().getDay()
                return time.getTime() > Date.now() - 8.64e7*wk;
            },
            firstDayOfWeek: 1
        },
        pickerMonth: {//月
            disabledDate(time) {
                var curday=new Date().getDate()
                return time.getTime() > Date.now() - 8.64e7*curday;
            },
        },
        value2: '',
        value:'0',
        getquarter:'',
    }
  },
  created() {
      this.getUnits()
  },
  methods: {
      getDayTime(val){ //把时间戳 转为 2020-08-16格式
        let date = new Date(val);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var day=y + '-' + MM + '-' + d
        // console.log(day)
        return day
    },
      getUnits(){
        var lastday=''
        if(this.value==0){
            var daytime=this.getDayTime(new Date().getTime()-(8.64e7*1))
            this.value2=new Date(daytime).getTime()
            lastday=this.value2
        }else if(this.value==1){//选中周的 周日 日期 时间戳 到秒
            var today = new Date().getDay();// 今天是这周的第几天
            var stepSunDay = -today + 1;//上周日距离今天的天数（负数表示）
            if (today == 0) {// 如果今天是周日
                stepSunDay = -7;
            };
            stepSunDay=stepSunDay-1
            this.value2=new Date().getTime()+(8.64e7*stepSunDay)//上周日的时间戳
            lastday=new Date().getTime()+(8.64e7*stepSunDay)
        }else if(this.value==2){//选中月的最后一天时间戳 到秒
            var nowMonth = new Date().getMonth()+1;
            var nowYear = new Date().getFullYear();
            var monthEndDate = new Date(nowYear, nowMonth-1, 0);//上一月的月底
            var timeEnd=Date.parse(monthEndDate);
            this.value2=timeEnd
            lastday=timeEnd
        }else if(this.value==3){
            var year=new Date().getFullYear()
            var monthcur=(Math.ceil((new Date().getMonth()+1)/3)-1)//当前季度前一季度
            if(monthcur==1){
                lastday=(new Date(year+'-03-31 00:00:00')).getTime()
            }
            if(monthcur==2){
                lastday=(new Date(year+'-06-30 00:00:00')).getTime()
            }
            if(monthcur==3){
                lastday=(new Date(year+'-09-30 00:00:00')).getTime()
            }
            if(monthcur==4){
                lastday=(new Date(year+'-12-31 00:00:00')).getTime()
            }
        }
        this.$emit("change",{units:this.value,date:this.getDayTime(lastday)})
      },
      getquar(val){
          this.getquarter=val
          this.$emit("change",{units:this.value,date:this.getDayTime(this.getquarter)})
      },
    getData(){
        var lastday=''
        if(this.value==1){//选中周的 周日 日期 时间戳 到秒
            lastday=this.value2.getTime()+(8.64e7*5)
            // console.log(lastday)
            // console.log((new Date('2020-08-16 00:00:00')).getTime())
        }else if(this.value==2){//选中月的最后一天时间戳 到秒
            var nowMonth = this.value2.getMonth(); //当前月 
            var nowYear = this.value2.getFullYear(); //当前年 
            //本月的开始时间
            // var monthStartDate = new Date(nowYear, nowMonth, 1); 
            //本月的结束时间
            var monthEndDate = new Date(nowYear, nowMonth+1, 0);
            // var timeStar=Date.parse(monthStartDate)/1000;//s
            var timeEnd=Date.parse(monthEndDate);
            lastday=timeEnd
        }else if(this.value==0){
            lastday=this.value2
        }
        this.$emit("change",{units:this.value,date:this.getDayTime(lastday)})
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