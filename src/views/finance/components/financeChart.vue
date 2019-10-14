/* demo图表 */
<script type='es6'>
import chartBase from "@/components/ChartBase";
export default {
  name: "financeChart",
  extends: chartBase,
  data() {
    return {
      datas:[],
      dates:[],
      incomes:[],
      expends:[],
      realIncomes:[],
      dataLists:[]
    };
  },
  props:['dataList'],
  watch:{
    dataList(newData,oldData){
      this.dataList = newData
      // this.makeOption(this.dataList)
      this.init();
    }
  },
  created() { },
  methods: {
    //设置图表数据项
    makeOption(){
      this.dates = []
      this.incomes = []
      this.expends = []
      this.realIncomes = []
      this.dataList.map((item)=>{
        item.accountDate = item.accountDate.substring(0,10)
        this.dates.push(item.accountDate)
        // this.dates = this.datas.reverse();
        this.incomes.push(item.income)
        this.expends.push(item.expend)
        this.realIncomes.push(item.realIncome)
      })

      this.option = {
        title: {
            text: '金额（元）'
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
        // toolbox: {
        //     feature: {
        //         saveAsImage: {}
        //     }
        // },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.dates.reverse()
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name:'总收入',
                type:'line',
                stack: '总量',
                data: this.incomes
            },
            {
                name:'总支出',
                type:'line',
                stack: '总量',
                data: this.expends
            },
            {
                name:'实际收入',
                type:'line',
                stack: '总量',
                data: this.realIncomes
            }
        ]
      };
    }
  },
  components: {}
};
</script>
