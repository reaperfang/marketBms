/* 访问客流分析 */
<script type='es6'>
import chartBase from "@/components/ChartBase";
export default {
  name: "durationChart",
  extends: chartBase,
  computed:{},
  props: ['dataChart','type'],
  data() {
    return {
      flow:{},
      n:{}
    };
  },
  created() { },
  watch:{
    dataChart(newValue,oldValue){
      this.n = newValue
      this.con()
    },
    type(newValue,oldValue){
      this.nearDay(newValue)
    },
  },
  methods: {
    // 数据显示控制
    nearDay(val){
      if(val == 1){
        this.option.title.text = "平均停留时间（秒）",
        this.option.legend.data = ["平均停留时间"],
        this.option.series = [{name:"平均停留时间",type: "line",stack: "总量",data: this.flow['yAxis']},
        ]
      }else if(val == 2){
         this.option.title.text = "跳出率（%）",
         this.option.legend.data = ["跳出率"],
         this.option.series =[{name:"跳出率",type: "line",stack: "总量",data: this.flow['yAxis']},
         ]
      }
    },
    con(){
      this.option = {
        title: {
          text: ["平均停留时间"]
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["平均停留时间"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage:{}
        //   }
        // },
        //X轴
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.flow['xAxis']
        },
        //Y轴
        yAxis: {
          type: "value",
          minInterval: 1
        },
        series: [
          {
            name:"平均停留时间",
            type: "line",
            stack: "总量",
            data: this.flow['yAxis'] 
          }
        ]
      };
      this.flow = {
        xAxis:this.n.xAxis,
        yAxis:this.n.series[0] && this.n.series[0].data
      }
      this.nearDay(this.type);
      this.makeOption(this.flow);
      this.option.xAxis.data = this.flow.xAxis;
      this.oChart.setOption(this.option, true);

    },
    //设置图表数据项
    makeOption(data) {
      this.option
    }
  },
  mounted(){

  },
  components: {}
};
</script>
