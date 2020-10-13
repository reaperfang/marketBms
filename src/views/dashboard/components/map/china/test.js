/* global $ axios echarts build_timestamp getTextForKey getCurrentLang getLangProp */
/* exported switchMapMetrics searchArea */


const mobulesConfig = {
    'map': {
      func: showMap,
      supportProvince: true,
    }
  };
  
  
  function getVisualPieces(type) {
    const pieces = {
      country: [
        { min: 3001, label: '3001单以上', color: '#003C87' },
        { min: 2000, max: 3000, label: '2000-3001单', color: '#003C87' },
        { min: 1001, max: 2000, label: '1001-2000单', color: '#0373FF' },
        { min: 1, max: 1000, label: '1-1000单', color: '#5EC6F9' }
      ]
    };
    const visualPieces = pieces[type] || pieces.city;
    return visualPieces;
  }
  
  async function prepareChartMap(mapName) {
    let geoJSON = null;
    if (!echarts.getMap(mapName)) {
      geoJSON = (await axios.get('map/json/china.json')).data;
      echarts.registerMap(mapName, geoJSON);
    } else {
      geoJSON = echarts.getMap(mapName).geoJson;
    }
    return geoJSON;
  }
  
  async function getData(type) {
    const ret = await axios.get(`by_${type}.json`);
    console.log("ret",ret.data);
    return ret.data;
  }
  
  
  async function createMapChartConfig({ mapName, data, valueKey = 'confirmedCount' }) {
    let geoJSON = await prepareChartMap(mapName);
    geoJSON.features.forEach(v => {
      const showName = v.properties.name;
      data.forEach(d => {
        d.records.forEach(r => {
          const name = r.name;
          if (name.substr(0, showName.length) === showName || showName.substr(0, name.length) === name) {
            r.showName = showName;
          }
        });
      });
    });
  
  
    const visualPieces = getVisualPieces(mapName === 'china' ? 'country' : 'city');
  
  
    const config = {
      baseOption: {
        timeline: {
          axisType: 'category',
          autoPlay: false,
          // currentIndex: data.length - 1,
          playInterval: 1000,
          data: data.map(d => d.day),
          show: false
        },
        tooltip: {
          show: true,
          trigger: 'item',
        },
        xAxis: [
          {
            type: 'value',
            axisLine: { show: false, },
            axisTick: { show: false, },
            axisLabel: { show: false, },
            splitLine: { show: false, },
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisLabel: {
              show: false,
              interval: 0,
            },
            axisTick: { show: false, },
            axisLine: { show: false, },
          }
        ],
        visualMap: [
          {
            type: 'piecewise',
            pieces: visualPieces,
            // left: 'auto',
            right: 0,
            bottom: 200,
            // seriesIndex: 0,
            show: true
          }
        ],
        series: [
          {
            name: '',
            type: 'map',
            mapType: mapName,
            label: {
              show: false,// true 显示区域名称 false 不显示
            },
            // left: hideBarChart ? 'center' : '30%',
            left: 'center',
            tooltip: {
              formatter: ({ name, data }) => {
                if (data) {
                  const { name, /*value,*/ confirmed, dead, cured, increased, insick } = data;
                  // const tip = `<b>${name}</b><br />${getTextForKey('现存确诊：')}${insick}<br />${getTextForKey('累计确诊：')}${confirmed}<br />${getTextForKey('治愈人数：')}${cured}<br />${getTextForKey('死亡人数：')}${dead}<br />${getTextForKey('新增确诊：')}${increased}`;
                  const tip = `<b>${name}</b><br />${'订单总数：'}${insick}<br />`;
                  return tip;
                }
                return `<b>${name}</b><br />${'暂无数据'}`;
              },
            },
            z: 1000,
          }
        ]
      },
      options: data.map(d => {
        return {
          series: [
            {
              data: d.records.map(r => {
                return {
                  name: r.showName,
                  value: r["insickCount"],//confirmedCount insickCount
                  insick: r.insickCount,
                };
              }),
            },
          ]
        };
      })
    };
  
    return config;
  }
  
  
  async function setupMapCharts(records, container, province = '', allCities = false) {
    const mapName = "china";
    const html = '<div id="mapchart" class="mychart" style="display:inline-block;width:100%;height:100%;"></div>';
    container.innerHTML = html;
    const cfg = await createMapChartConfig({ mapName, data: records });
    const chart = echarts.init(document.getElementById('mapchart'));
    chart.setOption(cfg);
  
    return [chart];
  }
  
  async function showMap(name) {
    const records = await getData("date");
    setupMapCharts(records, document.getElementById("chart_container"), name);
  }
  
  function handleHashChanged() {
    const func = mobulesConfig["map"];
    func.func("", "");
  }
  
  async function main() {
    handleHashChanged();
    window.onresize = handleHashChanged;
  }
  
  main();