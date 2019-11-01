/* 身份属性属性比例图表 */
<script type='es6'>
import chartBase from "@/components/ChartBase";

export default {
  name: "ip1Chart",
  extends: chartBase,
  data() {
    return {
      flow:[]
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
         text: "属性比例",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "horizontal",
          x: "right",
          data: ["非会员", "会员"]
        },
        calculable: true,
        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.flow
          }
        ]
      };
    }
  },
  components: {}
};
</script>
