/* 访问路径图表 */
<script type='es6'>
import chartBase from "@/components/ChartBase";
// import chinaMap from "@/assets/js/maps/chinaMap.js";
// import worldMap from "@/assets/js/maps/worldMap.js";
export default {
  name: "apChart",
  extends: chartBase,
  data() {
    return {};
  },
  created() {
    // this.engine.registerMap("china", chinaMap);
    //  this.engine.registerMap('world', worldMap);
  },
  methods: {
    //设置图表数据项
    makeOption(data) {
      this.option = {
        color: [
          "rgba(255, 69, 0, 0.5)",
          "rgba(255, 150, 0, 0.5)",
          "rgba(255, 200, 0, 0.5)",
          "rgba(155, 200, 50, 0.5)",
          "rgba(55, 200, 100, 0.5)"
        ],
        title: {
          text: "漏斗图",
          subtext: "纯属虚构"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ["展现", "点击", "访问", "咨询", "订单"]
        },
        calculable: true,
        series: [
          {
            name: "预期",
            type: "funnel",
            x: "10%",
            width: "80%",
            itemStyle: {
              normal: {
                label: {
                  formatter: "{b}预期"
                },
                labelLine: {
                  show: false
                }
              },
              emphasis: {
                label: {
                  position: "inside",
                  formatter: "{b}预期 : {c}%"
                }
              }
            },
            data: [
              { value: 60, name: "访问" },
              { value: 40, name: "咨询" },
              { value: 20, name: "订单" },
              { value: 80, name: "点击" },
              { value: 100, name: "展现" }
            ]
          },
          {
            name: "实际",
            type: "funnel",
            x: "10%",
            width: "80%",
            maxSize: "80%",
            itemStyle: {
              normal: {
                borderColor: "#fff",
                borderWidth: 2,
                label: {
                  position: "inside",
                  formatter: "{c}%",
                  textStyle: {
                    color: "#fff"
                  }
                }
              },
              emphasis: {
                label: {
                  position: "inside",
                  formatter: "{b}实际 : {c}%"
                }
              }
            },
            data: [
              { value: 30, name: "访问" },
              { value: 10, name: "咨询" },
              { value: 5, name: "订单" },
              { value: 50, name: "点击" },
              { value: 80, name: "展现" }
            ]
          }
        ]
      };
    }
  },
  components: {}
};
</script>
