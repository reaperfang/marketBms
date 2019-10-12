/* 访问客流分析 */
<script type='es6'>
import chartBase from "@/components/ChartBase";

export default {
  name: "pfChart",
  extends: chartBase,
  computed: { },
  props: ['dataChart','type'],
  data() {
    return {
      flow: {},
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
        this.option.title.text = "浏览/访问",
        this.option.legend.data = ["浏览量","访客量"],
        this.option.series = [{name:"访客",type: "line",stack: "总量",data: this.flow['yAxis2']},
        {name:"浏览",type: "line",stack: "总量",data: this.flow['yAxis1']}]
      }else if(val == 2){
         this.option.title.text = "到店时段",
         this.option.legend.data = ["到店时段"],
         this.option.series =[{name:"到店人数",type: "line",stack: "总量",data: this.flow['yAxis1']},
         ]
      }else if(val == 3){
         this.option.title.text = "访问次数",
         this.option.legend.data = ["访问次数"],
         this.option.series =[{name:"访问次数",type: "line",stack: "总量",data: this.flow['yAxis1']},
         ]
      }else if(val == 4){
         this.option.title.text = "访问来源",
         this.option.legend.data = ["小程序","公众号"],
         this.option.series = [{name:"小程序",type: "line",stack: "总量",areaStyle: {},data: this.flow['yAxis1']},
         {name:"公众号",type: "line",stack: "总量",areaStyle: {},data: this.flow['yAxis2']},
         ]
      }
    },
    con() {
      this.option = {
        title: {
          text: ["浏览/访问"]
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["浏览", "访客"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "2%",
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.flow["xAxis"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "访客",
            type: "line",
            stack: "总量",
            data: this.flow['yAxis']
          },
          {
            name: "浏览",
            type: "line",
            stack: "总量",
            data: this.flow['yAxis'] 
          }
        ]
      };
      this.flow = {
        xAxis:this.n.xAxis,
        yAxis1:this.n.series[0] && this.n.series[0].data,
        yAxis2:this.n.series[1] && this.n.series[1].data,
      }
      this.nearDay(this.type)
      this.makeOption(this.flow);
      this.option.xAxis.data = this.flow.xAxis;
      this.oChart.setOption(this.option, true);
    },
    //设置图表数据项
    makeOption(data) {
      this.option;
    }
  },
  mounted() {},
  components: {}
};
</script>
