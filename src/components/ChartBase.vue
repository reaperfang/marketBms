<!--图表基础组件，所有图表继承自此组件-->
<template>
  <div class="chart" ref="chart" :style="{width: width, height: height}"></div>
</template>

<script type='es6'>
// import echarts from 'echarts';  // 引入 ECharts 模块
const echarts = () =>
  import(/* webpackChunkName: "echarts" */ 'echarts')
export default {
  name: "chartBase",
  props:{
    title:{
      type: String,
      default: '图表'
    },
    downloadTitle:{
      type: String,
      default: '下载图表'
    },
    width:{
      type: String,
      default: '100%'
    },
    height:{
      type: String,
      default: '400px'
    },
    data:{
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  data() {
    return {
      engine: echarts,   //图表库
      eChart: null,      //图表dom元素
      oChart: null,      //图表对象
      option: {},        //图表数据项
      chartData: this.data,  //图表数据
      colorList: [
        'rgb(64,158,255)',
        'rgb(108,191,61)',
        '#af6ccf',
        '#eda448',
        '#e37959',
        'rgb(172,53,80)'
      ]
    };
  },
  mounted(){
    this.init();
  },
  watch:{
    data:{
      handler(newValue, oldValue){
        this.chartData = newValue;
        this.render();
      },
      deep:true
    }
  },
  methods: {

    //初始化图表
    init() {
      const _self = this;
      if (this.$refs.chart) {
        this.eChart = this.$refs.chart;
        this.oChart = this.engine.init(this.eChart, null, {renderer: 'svg'});
        document.body.onresize = ()=>{
          _self.oChart.resize();
        }
        this.render();
      }
    },

    //渲染前准备
    render() {
      if(this.chartData){
        this.makeOption(this.chartData);
        this.oChart.setOption(this.option, true);
      }
    },

    //设置图表数据项
    makeOption(data) {

    }
  },
  components: {}
};
</script>
