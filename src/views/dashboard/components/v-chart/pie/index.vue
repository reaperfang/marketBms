<template>
  <div class="panel-content">
    <div style="width: 150px;height: 150px;" ref="chartContentPie"></div>

    <icon :progress="progress" :city="city"></icon>
  </div>
</template>

<script>
import echarts from "echarts";
import icon from "./icon";
export default {
  props: ["barColor", "progress", "city"],
  name: "TEMPLATE",
  data() {
    return {
      chartData: "71.23",
      chart: "",
    };
  },
  mounted() {
    this.showChart();

    // window.addEventListener("resize", (ev) => {
    //   this.$dt.start({
    //     type: "debounce",
    //     immediate: true,
    //     time: 100,
    //     success: () => {
    //       this.chart.resize();
    //     },
    //   });
    // });
  },
  methods: {
    showChart() {
      this.chart = echarts.init(this.$refs.chartContentPie);
      var data = {
        value: this.progress,
        company: "年度能耗",
        // ringColor: [{
        //   offset: 0,
        //   color: '#02d6fc' // 0% 处的颜色
        // }, {
        //   offset: 1,
        //   color: '#367bec' // 100% 处的颜色
        // }]

        ringColor: [
          {
            offset: 0,
            color: this.barColor, // 0% 处的颜色
          },
        ],
      };
      let option = {
        // title: {
        //   text: data.value + "%\n" + data.company,
        //   x: "center",
        //   y: "center",
        //   textStyle: {
        //     color: "#fff",
        //     fontSize: "18",
        //   },
        // },
        tooltip: {
          show: true,
        },
        color: ["#1A273D"],
        legend: {
          show: false,
          data: [],
        },

        series: [
          {
            name: "Line 1",
            type: "pie",
            clockWise: true,
            //radius: ['55', '65'],//设置圆环的半径
            radius: ["55", "65"], //设置圆环的半径
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            data: [
              {
                value: data.value,
                name: "",
                itemStyle: {
                  normal: {
                    color: {
                      // 完成的圆环的颜色
                      colorStops: data.ringColor,
                    },
                    label: {
                      show: false,
                    },
                    labelLine: {
                      show: false,
                    },
                  },
                },
              },
              {
                name: "",
                value: 100 - data.value,
              },
            ],
          },
        ],
      };
      this.chart.clear();
      this.chart.setOption(option);
    },
  },
  components: {
    icon,
  },
};
</script>

<style scoped>
.panel-content {
  position: relative;
}
</style>
