/* 身份属性会员增长趋势图表 */
<script type='es6'>
import chartBase from "@/components/ChartBase";
export default {
  name: "ip3Chart",
  extends: chartBase,
  data() {
    return {
      flow: {}
    };
  },
  created() {},
  methods: {
    con(n) {
      this.flow = n;
      this.makeOption(n);
      this.oChart.setOption(this.option, true);
    },
    //设置图表数据项
    makeOption(data) {
      this.option = {
        color: ["#c23531", "#2f4554", "#61a0a8", "#eee"],
        title: {
          text: "支付趋势（人）",
          //subtext: "Rainbow bar example",
          // link: "http://echarts.baidu.com/doc/example.html"
        },
        grid: {
          borderWidth: 0,
          y: 100,
          y2: 60
        },
        xAxis: [
          {
            type: "category",
            data: this.flow["xAxis"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            type: "bar",
            itemStyle: {
              normal: {
                //这里是重点
                color: function(params) {
                  var colorList = ["#A1E174", "#578EFA", "#FD932B", "#FD4C2B"];
                  return colorList[params.dataIndex];
                }
              }
            },
            data: this.flow["yAxis"]
          }
        ]
      };
    }
  },
  components: {}
};
</script>
