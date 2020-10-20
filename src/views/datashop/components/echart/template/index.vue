<template>
  <div class="panel-content">
    <div style="width: 150px;height: 150px;" ref="chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: [],
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
      let option = {
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
  height: 100%;
}
</style>
