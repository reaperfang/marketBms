<template>
  <div class="container-fluid" id="chart_container">
    Loading...
  </div>
</template>

<script>
import axios from "axios";
import echarts from "echarts";
import { mapGetters, mapActions, mapState } from "vuex";
import chinaData from "../../../data/china.json"
import byDate from "../../../data/by_date.json"

export default {
  watch: {
    // flowData(val) {
    // }
  },
  props: {
    // data: {
    //   type: Object,
    //   default: false
    // }
  },
  components: {},
  data: function() {
    return {
      mobulesConfig: {
        map: {
          func: this.showMap,
          supportProvince: true,
        },
      },
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {
    this.handleHashChanged();
    window.onresize = this.handleHashChanged;
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),
    getVisualPieces(type) {
      const pieces = {
        country: [
          { min: 3001, label: "3001单以上", color: "#003C87" },
          { min: 2000, max: 3000, label: "2000-3001单", color: "#003C87" },
          { min: 1001, max: 2000, label: "1001-2000单", color: "#0373FF" },
          { min: 1, max: 1000, label: "1-1000单", color: "#5EC6F9" }, //#86FEFC
          { min: 0, max: 1, label: "待破零", color: "#86FEFC" },
        ],
      };
      const visualPieces = pieces[type] || pieces.city;
      return visualPieces;
    },
    async setupMapCharts(records, container, province = "", allCities = false) {
      const mapName = "china";
      const html =
        '<div id="mapchart" class="mychart" style="display:inline-block;width:100%;height:100%;"></div>';
      container.innerHTML = html;
      const cfg = await this.createMapChartConfig({ mapName, data: records });
      const chart = echarts.init(document.getElementById("mapchart"));
      chart.setOption(cfg);

      return [chart];
    },
    async showMap(name) {
      const records = await this.getData("date");
      this.setupMapCharts(
        records,
        document.getElementById("chart_container"),
        name
      );
    },
    async prepareChartMap(mapName) {
      let geoJSON = null;
      if (!echarts.getMap(mapName)) {
        // geoJSON = (await axios.get("static/data/china.json")).data;
        geoJSON=chinaData;
        echarts.registerMap(mapName, geoJSON);
      } else {
        geoJSON = echarts.getMap(mapName).geoJson;
      }
      return geoJSON;
    },
    async getData(type) {
      // const ret = await axios.get(`static/data/by_${type}.json`);
      const ret = byDate;
      return byDate;
    },
    async createMapChartConfig({ mapName, data, valueKey = "confirmedCount" }) {
      let geoJSON = await this.prepareChartMap(mapName);
      geoJSON.features.forEach((v) => {
        const showName = v.properties.name;
        data.forEach((d) => {
          d.records.forEach((r) => {
            const name = r.name;
            if (
              name.substr(0, showName.length) === showName ||
              showName.substr(0, name.length) === name
            ) {
              r.showName = showName;
            }
          });
        });
      });

      const visualPieces = this.getVisualPieces(
        mapName === "china" ? "country" : "city"
      );

      const config = {
        baseOption: {
          timeline: {
            axisType: "category",
            autoPlay: false,
            // currentIndex: data.length - 1,
            playInterval: 1000,
            data: data.map((d) => d.day),
            show: false,
          },
          tooltip: {
            show: true,
            trigger: "item",
          },
          xAxis: [
            {
              type: "value",
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: { show: false },
              splitLine: { show: false },
            },
          ],
          yAxis: [
            {
              type: "category",
              axisLabel: {
                show: false,
                interval: 0,
              },
              axisTick: { show: false },
              axisLine: { show: false },
            },
          ],
          visualMap: [
            {
              type: "piecewise",
              pieces: visualPieces,
              right: 10,
              bottom: 30,
              show: true,
              textStyle: {
                fontSize:12,
                color: "#FFFFFF",
              },
            },
          ],
          series: [
            {
              name: "",
              type: "map",
              mapType: mapName,
              label: {
                show: false, // true 显示区域名称 false 不显示
              },
              // left: hideBarChart ? 'center' : '30%',
              left: "center",
              tooltip: {
                formatter: ({ name, data }) => {
                  if (data) {
                    const {
                      name,
                      /*value,*/ confirmed,
                      dead,
                      cured,
                      increased,
                      insick,
                    } = data;
                    // const tip = `<b>${name}</b><br />${getTextForKey('现存确诊：')}${insick}<br />${getTextForKey('累计确诊：')}${confirmed}<br />${getTextForKey('治愈人数：')}${cured}<br />${getTextForKey('死亡人数：')}${dead}<br />${getTextForKey('新增确诊：')}${increased}`;
                    const tip = `<b>${name}</b><br />${"订单总数："}${insick}<br />`;
                    return tip;
                  }
                  return `<b>${name}</b><br />${"暂无数据"}`;
                },
              },
              z: 1000,
            },
          ],
        },
        options: data.map((d) => {
          return {
            series: [
              {
                data: d.records.map((r) => {
                  return {
                    name: r.showName,
                    value: r["insickCount"], //confirmedCount insickCount
                    insick: r.insickCount,
                  };
                }),
              },
            ],
          };
        }),
      };

      return config;
    },
    handleHashChanged() {
      const func = this.mobulesConfig["map"];
      func.func("", "");
    },
  },
};
</script>

<style lang="scss">
.container-fluid {
  height: 100%;
}
</style>
