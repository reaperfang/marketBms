/* 身份属性会员增长趋势图表 */
<script type='es6'>
import chartBase from "@/components/ChartBase";
export default {
  name: "ip2Chart",
  extends: chartBase,
  data() {
    return {
      flow:{}
    };
  },
  created() {
  },
  methods: {
    con(n){
      this.flow = n;
      this.makeOption(n);
      this.oChart.setOption(this.option, true);
    },
    //设置图表数据项
    makeOption(data) {
      this.option = {
        title: {
          text: "趋势图（人）",
          //subtext: "纯属虚构"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["最高气温", "最低气温"]
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
           // boundaryGap: false,
            data: this.flow['xAxis']
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1,
          }
        ],
        series: [
          {
            type: 'line',
            data: this.flow['yAxis']
          },
        ]
      };
    }
  },
  components: {}
};
</script>
