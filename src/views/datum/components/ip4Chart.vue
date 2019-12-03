/* 访问客流分析 */
<script type='es6'>
import chartBase from "@/components/ChartBase";

export default {
  name: "ip4Chart",
  extends: chartBase,
   computed:{
      
  },
  props:{
  },
  data() {
    return {
      flow:{}
    };
  },
  created() {

  },
  methods: {
    // 数据显示控制
    con(n){
      // console.log('data',n)
      this.flow = {
        xAxis:n.xAxis,
        yAxisSubmitOrderData:n.series[0].data,
        yAxisPayOrderData:n.series[1].data,
        yAxisOrderConversionData:n.series[2].data
      }
      this.makeOption(n);
      this.oChart.setOption(this.option, true);
    },
    //设置图表数据项
    makeOption(data) {
      this.option = {
        title: {
          text: [""]
        },
        tooltip: {
          trigger: "axis",
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
          data: this.flow['xAxis']
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name:"下单单数",
            type: "line",
            stack: "下单单数",
            data: this.flow['yAxisSubmitOrderData']
          },
          {
            name:"支付单数",
            type: "line",
            stack: "支付单数",
            data: this.flow['yAxisPayOrderData'] 
          },
          {
            name:"单数转化",
            type: "line",
            stack: "单数转化",
            data: this.flow['yAxisOrderConversionData'] 
          }
        ]
      }
    }
  },
  mounted(){
  },
  components: {}
};
</script>
