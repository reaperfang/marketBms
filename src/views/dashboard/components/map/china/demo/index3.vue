<template>
  <div class="panel-content">
    <!-- <div
      style="display:inline-block;width:100%;height:100%;"
      ref="chartContentPietest"
    ></div> -->

    <div
      style="display:inline-block;width:100vw;height:100vh;"
      ref="chartContentPietest"
    ></div>
  </div>
</template>

<script>
import echarts from "echarts";
import chinaData from "../../../data/china.json";
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
      //   this.$dt.start({
      //     type: "debounce",
      //     immediate: true,
      //     time: 100,
      //     success: () => {
      //       this.chart.resize();
      //     },
      //   });

      this.chart.resize();
    });
  },
  methods: {
    showChart() {
      this.chart = echarts.init(this.$refs.chartContentPietest);

      //var name_title = "新型冠状病毒累计确诊·中国"
      var name_title = "全国疫情每日累计确诊数据";
      //var subname = '信科学生居住地分布图'
      var subname = "截止至2020-04-07";
      var nameColor = " rgb(0, 0, 0)";
      var name_fontFamily = "汉仪简菱心";
      var subname_fontSize = 15;
      var name_fontSize = 30;
      var mapName = "china";
      var data = [
        { name: "湖北", value: 67803 },
        { name: "广东", value: 1533 },
        { name: "河南", value: 1276 },
        { name: "浙江", value: 1265 },
        { name: "湖南", value: 1019 },
        { name: "安徽", value: 990 },
        { name: "江西", value: 937 },
        { name: "江苏", value: 651 },
        { name: "重庆", value: 579 },
        { name: "山东", value: 781 },
        { name: "四川", value: 560 },
        { name: "黑龙江", value: 544 },
        { name: "北京", value: 587 },
        { name: "上海", value: 538 },
        { name: "河北", value: 327 },
        { name: "福建", value: 351 },
        { name: "广西", value: 254 },
        { name: "陕西", value: 256 },
        { name: "云南", value: 184 },
        { name: "海南", value: 168 },
        { name: "贵州", value: 147 },
        { name: "山西", value: 138 },
        { name: "天津", value: 180 },
        { name: "辽宁", value: 144 },
        { name: "甘肃", value: 139 },
        { name: "吉林", value: 98 },
        { name: "新疆", value: 76 },
        { name: "内蒙古", value: 1213 },
        { name: "宁夏", value: 75 },
        { name: "香港", value: 914 },
        { name: "台湾", value: 373 },
        { name: "青海", value: 18 },
        { name: "澳门", value: 44 },
        { name: "西藏", value: 1 },
      ];

      var geoCoordMap = {};
      var toolTipData = [];

      /*获取地图数据*/
      let geoJSON = this.prepareChartMap("china");
      geoJSON.features.forEach((v) => {
        const name = v.properties.name;
        geoCoordMap[name] = v.properties.cp;
      });

      // console.log("============geoCoordMap===================")
      // console.log(geoCoordMap)
      // console.log("================data======================")
      // console.log(data);
      // console.log(toolTipData);
      var max = 44,
        min = 0; // todo
      var maxSize4Pin = 50,
        minSize4Pin = 0;

      var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          // document.write(data[i].value[0]);
          // document.write('\t');
          // document.write(data[i].value[1]);
          // document.write('\t\t');
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value),
            });
          }
        }
        return res;
      };

      var option = {
        // //backgroundColor: "#FF010F27", //背景色
        tooltip: {
          show: true,
          trigger: "item",
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
              const tip = `<b>${name}</b><br />${"订单总数："}${data.value[2]}<br />`;
              return tip;
            }
            return `<b>${name}</b><br />${"暂无数据"}`;
          },
        },
        // tooltip: {
        //   show:true,
        //   trigger: "item",
        //   formatter: function(params) {
        //     if (typeof params.value[2] == "undefined") {
        //       var toolTiphtml = "";
        //       for (var i = 0; i < toolTipData.length; i++) {
        //         if (params.name == toolTipData[i].name) {
        //           toolTiphtml += toolTipData[i].name + ":<br>";
        //           for (var j = 0; j < toolTipData[i].value.length; j++) {
        //             toolTiphtml +=
        //               toolTipData[i].value[j].name +
        //               ":" +
        //               toolTipData[i].value[j].value +
        //               "<br>";
        //           }
        //         }
        //       }
        //       console.log(toolTiphtml);
        //       return toolTiphtml;
        //     } else {
        //       var toolTiphtml = "";
        //       for (var i = 0; i < toolTipData.length; i++) {
        //         if (params.name == toolTipData[i].name) {
        //           toolTiphtml += toolTipData[i].name + ":<br>";
        //           for (var j = 0; j < toolTipData[i].value.length; j++) {
        //             toolTiphtml +=
        //               toolTipData[i].value[j].name +
        //               ":" +
        //               toolTipData[i].value[j].value +
        //               "<br>";
        //           }
        //         }
        //       }
        //       console.log(toolTiphtml);
        //       return toolTiphtml;
        //     }
        //   },
        // },
        visualMap: {
          show: true,
          min: 1,
          max: 3000,
          right: 26,
          bottom: 50,
          showLabel: !0,
          //text: ['高', '低'], // 文本，默认为数值文本

          //calculable: true,

          seriesIndex: [1],
          pieces: [
            { min: 1001, label: "> 1001 ", color: "#003C87" },
            { min: 501, max: 1000, label: "501 - 1000 ", color: "#003C87" },
            { min: 101, max: 500, label: "101 - 500 ", color: "#0373FF" },
            { min: 11, max: 100, label: "11 - 100 ", color: "#5EC6F9" },
            { min: 0, max: 10, label: "0 - 10 ", color: "#86FEFC" },
          ],
        },
        geo: {
          show: true,
          map: mapName,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          roam: false,
          itemStyle: {
            normal: {
              areaColor: "#031525",
              borderColor: "#3B5077",
            },
            emphasis: {
              areaColor: "#2B91B7", // 地图
            },
          },
        },
        series: [
          {
            name: "散点",
            type: "scatter",
            coordinateSystem: "geo",
            //data: convertData(data.slice(0,5)),
            data: [],
            symbolSize: 25,
            label: {
              normal: {
                formatter: "{b}",
                //position: 'right',
                color: "#000000",
                textStyle: {
                  fontSize: "10", //字体大小
                  fontWeight: "bolder", //字体加粗
                },

                show: true,
              },
            },
            itemStyle: {
              normal: {
                color: "#FFFF00",
                // color: '#05C3F9', // 无效 //有效了
                show: false,
              },
            },
          },
          {
            type: "map",
            map: mapName,
            geoIndex: 0,
            aspectScale: 0.75, //长宽比
            showLegendSymbol: true, // 存在legend时显示
            label: {
              normal: {
                color: "#ff00ff",
                show: true,
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: "#000000",
                },
              },
            },

            roam: true,
            itemStyle: {
              normal: {
                areaColor: "#031525",
                borderColor: "#3B5077",
              },
              emphasis: {
                areaColor: "#2B91B7",
              },
            },
            animation: true,
            data: convertData(data),
          },
        ],
      };
      this.chart.clear();
      this.chart.setOption(option);

      var j = 0;
      var IntervalId = window.setInterval(() => {
        if (j == 30) j = 0;
        // topCity数组就是top的这个5个城市.
        option.series[0].data = [convertData(data)[j]];
        this.chart.setOption(option);
        j++;
      }, 500);
    },

    prepareChartMap(mapName) {
      let geoJSON = null;
      if (!echarts.getMap(mapName)) {
        // geoJSON = (await axios.get("static/data/china.json")).data;
        geoJSON = chinaData;
        echarts.registerMap(mapName, geoJSON);
      } else {
        geoJSON = echarts.getMap(mapName).geoJson;
      }
      return geoJSON;
    },
  },
  components: {},
};
</script>

<style scoped>
.panel-content {
  position: relative;
  height: 100%;
}
</style>
