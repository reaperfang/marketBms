/* demo图表 */
<script type='es6'>
import chartBase from "@/components/ChartBase";
export default {
  name: "financeChart",
  extends: chartBase,
  data() {
    return {

    };
  },
  props:['dataList'],
  watch:{
    dataList(newData,oldData){
      this.dataList = newData
      this.init();
    }
  },
  created() { },
  methods: {
    //设置图表数据项
    makeOption(){    
      this.option = {
        title: {
            // text: '金额（元）'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['总收入','总支出','实际收入']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            name:'日期',
            data: this.dataList && this.dataList.dates && this.dataList.dates.reverse(),
            axisLine:{
              symbol:['none','arrow'], 
            }
        },
        yAxis: {
            name:'金额（元）',
            type: 'value',
            axisLine:{
              symbol:['none','arrow'], 
            }
        },
        series: [
            {
                name:'总收入',
                type:'line',
                // stack: '总量',
                data: this.dataList.incomes && this.dataList.incomes.reverse()
            },
            {
                name:'总支出',
                type:'line',
                // stack: '总量',
                data: this.dataList.expends && this.dataList.expends.reverse()
            },
            {
                name:'实际收入',
                type:'line',
                // stack: '总量',
                data: this.dataList.realIncomes && this.dataList.realIncomes.reverse()
            }
        ]
      };
    }
  },
  components: {}
};
</script>
