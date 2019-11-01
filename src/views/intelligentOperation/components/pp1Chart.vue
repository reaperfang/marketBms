/* 身份属性属性比例图表 */
<script type='es6'>
import chartBase from "@/components/ChartBase";
// import chinaMap from "@/assets/js/chinaMap.js";
// import worldMap from "@/assets/js/worldMap.js";
export default {
  name: "pp1Chart",
  extends: chartBase,
  data() {
    return {
      flow:{}
    };
  },
  created() {
    // this.engine.registerMap("china", chinaMap);
    //  this.engine.registerMap('world', worldMap);
  },
  methods: {
    con(n){
      this.flow = n
      this.makeOption(n);
      this.oChart.setOption(this.option, true);
    },
    //设置图表数据项
    makeOption(data) {
      this.option = {
        title: {
        text: '折线图堆叠'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    // toolbox: {
    //     feature: {
    //         saveAsImage: {}
    //     }
    // },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.flow['xAxisData']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'客价单',
            type:'line',
            stack: '总量',
            data:this.flow['yAxisData']
        }
    ]
      };
    }
  },
  components: {}
};
</script>
