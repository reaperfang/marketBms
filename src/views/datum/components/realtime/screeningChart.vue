/* 数据总览 */
<script type='es6'>
import chartBase from "@/components/ChartBase";
export default {
  name: "durationChart",
  extends: chartBase,
  computed:{},
  props: ['dataChart'],
  data() {
    return {
      flow:{},
      n:{}
    };
  },
  created() { },
  watch:{
    dataChart(newValue,oldValue){
      this.n = newValue
      this.con()
    },
  },
  methods: {
    // 数据显示控制
    con(){
      this.option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {  
            x:'right',      //可设定图例在左、右、居中
          y:'top',
          data: ['今日', '昨日'],
          icon: "circle",
          itemWidth:10,
          },  
        grid: {
          top:'11%',
          left: "0%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        //X轴
        xAxis: {
          type: "category",
          boundaryGap: false,
          // data: this.flow['xAxis']
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        //Y轴
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLine:{       //y轴
            show:false
          },
          splitLine :{    //网格线
            lineStyle:{
              type:'dashed'    //设置网格线类型 dotted：虚线   solid:实线
            },
            show:true, //隐藏或显示
          },
        },
         series: [{
                    name: '今日',
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    symbol:'circle',
                    symbolSize: 8,   //设定实心点的大小
                    color:['#0077FF'],
                    itemStyle:{  
                        normal:{  
                        color:'#0077FF',  
                        borderColor:'#fff',  //拐点边框颜色  
                        }  
                    },
                },
                {
                    name: '昨日',
                    data: [620, 711, 823, 934, 1445, 1456, 1178],
                    type: 'line',
                    symbol:'circle',
                    symbolSize: 8,   //设定实心点的大小
                    color:['#2FC25B'],
                    itemStyle:{  
                        normal:{  
                        color:'#2FC25B',  
                        borderColor:'#fff',  //拐点边框颜色  
                        }  
                    },
                }],
      };
      this.flow = {
        xAxis:this.n.xAxis,
        yAxis1:this.n.series[0] && this.n.series[0].data.map(item => { return (item*1).toFixed(1)}),
        yAxis2:this.n.series[1] && this.n.series[1].data.map(item => { return (item*1).toFixed(1)}),
      }
      this.makeOption(this.flow);
      this.option.xAxis.data = this.flow.xAxis;
      this.oChart.setOption(this.option, true);

    },
    //设置图表数据项
    makeOption(data) {
      this.option
    }
  },
  mounted(){

  },
  components: {}
};
</script>
