<template>
  <div class="panel-content-cap">
    <div style="height: 100%;" ref="chartContent"></div>
  </div>
</template>

<script>
import echarts from "echarts";
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
    window.addEventListener("resize", (ev) => {
      this.$dt.start({
        type: "debounce",
          time: 100,
        immediate: true,
        success: () => {
         console.log("cap chart size changed!");
         this.chart.resize();
        },
      });
    });
  },
  methods: {
    showChart() {
      this.chart = echarts.init(this.$refs.chartContent);

      var plantCap = [
        {
          name: "居住",
          value: "Settlements",
        },
        {
          name: "行政",
          value: "administration",
        },
        {
          name: "文化",
          value: "Culture",
        },
        {
          name: "医疗",
          value: "hospital ",
        },
        {
          name: "教育",
          value: "education ",
        },
        {
          name: "交通",
          value: "hospital",
        },
        {
          name: "产业",
          value: "industry",
        },
      ];

      var datalist = [
        {
          offset: [10, 50],
          symbolSize: 60,
          opacity: 0.95,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#29c0fb",
            },
            {
              offset: 1,
              color: "#2dc5b9",
            },
          ]),
        },
        {
          offset: [38, 70],
          symbolSize: 50,
          opacity: 0.95,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#35d17e",
            },
            {
              offset: 1,
              color: "#49ddb2",
            },
          ]),
        },
        {
          offset: [23, 43],
          symbolSize: 70,
          opacity: 0.95,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#e5d273",
            },
            {
              offset: 1,
              color: "#e4a37f",
            },
          ]),
        },
        {
          offset: [44, 26],
          symbolSize: 90,
          opacity: 0.95,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#277aec",
            },
            {
              offset: 1,
              color: "#57c5ec",
            },
          ]),
        },
        {
          offset: [80, 58],
          symbolSize: 65,
          opacity: 0.95,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#e54948",
            },
            {
              offset: 1,
              color: "#f08456",
            },
          ]),
        },
        {
          offset: [76, 36],
          symbolSize: 68,
          opacity: 0.7,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#11c46e",
            },
            {
              offset: 1,
              color: "#f08456",
            },
          ]),
        },
        {
          offset: [64, 75],
          symbolSize: 65,
          opacity: 0.68,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#ff4141",
            },
            {
              offset: 1,
              color: "#ff8989",
            },
          ]),
        },
      ];
      var datas = [];
      for (var i = 0; i < plantCap.length; i++) {
        var item = plantCap[i];
        var itemToStyle = datalist[i];
        datas.push({
          name: item.name + "\n" + item.value,
          value: itemToStyle.offset,
          symbolSize: itemToStyle.symbolSize,
          label: {
            normal: {
              textStyle: {
                fontSize: 18,
                fontWeight: 800,
                lineHeight: 22,
              },
            },
          },
          itemStyle: {
            normal: {
              color: itemToStyle.color,
              opacity: itemToStyle.opacity,
            },
          },
        });
      }
      let option = {
        backgroundColor: "#12468500",
        grid: {
          show: false,
          top: 10,
          bottom: 10,
        },
        xAxis: [
          {
            gridIndex: 0,
            type: "value",
            show: false,
            min: 0,
            max: 100,
            nameLocation: "middle",
            nameGap: 5,
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            min: 0,
            show: false,
            max: 100,
            nameLocation: "middle",
            nameGap: 30,
          },
        ],
        series: [
          {
            type: "effectScatter",
            // symbol: 'circle',
            // symbolSize: 120,

            hoverAnimation: true,
            label: {
              normal: {
                show: true,
                formatter: "{b}",
                color: "#fff",
                textStyle: {
                  fontSize: "20",
                },
              },
            },
            itemStyle: {
              normal: {
                color: "#00acea",
              },
            },
            data: datas,
          },
        ],
      };
      this.chart.clear();
      this.chart.setOption(option);
    },
  },
  components: {},
};
</script>

<style scoped>
.panel-content-cap {
  height: 100%;
}
</style>
