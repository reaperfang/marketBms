/* 身份属性属性比例图表 */
<script type='es6'>
import chartBase from "@/components/ChartBase";
export default {
  name: "pp2Chart",
  extends: chartBase,
  data() {
    return {
      flow:{}
    };
  },
  created() {
    // this.engine.registerMap("china", chinaMap);
    //  this.engine.registerMap('world', worldMap);
  },
  methods: {
    con(n,type){
      this.flow = n
      this.makeOption(n,type);
      this.oChart.setOption(this.option, true);
    },
    //设置图表数据项
    makeOption(data,type) {
      this.option = {
        title: {
        text: '趋势图'
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data:['']
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
          data: this.flow['xAxisData']
      },
      yAxis: {
          type: 'value'
      },
      series: [
          {
              name:'客价单',
              type:'line',
              stack: '总量',
              data:this.flow['yAxisData']
          }
      ]
      };
      if(type == 1){
        this.option.title.text = "客单价",
        this.option.legend.data = ["客单价"],
        this.option.series = [{name:"客单价",type: "line",stack: "总量",data: this.flow['yAxisData']}]
      }else if(type == 2){
         this.option.title.text = "订单量",
         this.option.legend.data = ["订单量"],
         this.option.series =[{name:"订单量",type: "line",stack: "总量",data: this.flow['yAxisData']},
         ]
      }else if(type == 3){
         this.option.title.text = "人均消费金额趋势",
         this.option.legend.data = ["人均消费金额"],
         this.option.series =[{name:"人均消费金额",type: "line",stack: "总量",data: this.flow['yAxisData']},
         ]
      }
    }
  },
  components: {}
};
</script>
