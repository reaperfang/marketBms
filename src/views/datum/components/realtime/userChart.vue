/* 用户概览 */
<script type='es6'>
import chartBase from "@/components/ChartBase";
export default {
  name: "durationChart",
  extends: chartBase,
  computed:{},
  props: ['dataChart','units'],
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
      var interval=0
      if(this.units==0){
        interval=2
      }
      this.flow = {
        xAxis:this.n.xAxis,
        // yAxis1:this.n.yAxis1,
        yAxis2:this.n.yAxis2,
        yAxis3:this.n.yAxis3,
      }
      this.option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {  
          top:'0%',
          right: "3.5%",
          data: ['用户总数','新增用户', '新增会员'],
          icon: "circle",
          itemWidth:8,
        }, 
        // color:['#0077FF','#2FC25B','#FF8615'], 
        color:['#2FC25B','#FF8615'],
        grid: {
          top:'11%',
          left: "2%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {//X轴
          type: "category",
          boundaryGap: false,
          axisLabel:{
            textStyle: {
              color: '#92929B', 
            },
            showMaxLabel:true,
            interval:interval,
            formatter: function (params) {
              var newParamsName = "";
              var paramsNameNumber = params.length;
              var provideNumber = 5;  //一行显示几个字
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                  for (var p = 0; p < rowNumber; p++) {
                      var tempStr = "";
                      var start = p * provideNumber;
                      var end = start + provideNumber;
                      if (p == rowNumber - 1) {
                          tempStr = params.substring(start, paramsNameNumber);
                      } else {
                          tempStr = params.substring(start, end) + "\n";
                      }
                      newParamsName += tempStr;
                  }

              } else {
                  newParamsName = params;
              }
              return newParamsName
            },
          },
          data: this.flow['xAxis']
        },
        yAxis: {//Y轴
          type: "value",
          minInterval: 1,
          axisLabel:{
            textStyle: {
              color: '#92929B', 
            },
          },
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
        series: [
        //   {
        //   name: '用户总数',
        //   data: this.flow['yAxis1'],
        //   type: 'line',
        //   hoverAnimation:false,
        //   symbol:'circle',
        //   symbolSize: 8,   //设定实心点的大小
        //   itemStyle:{  
        //     normal:{  
        //       borderColor:'#fff',  //拐点边框颜色  
        //     }  
        //   },
        // },
        {
          name: '新增用户',
          data: this.flow['yAxis2'],
          type: 'line',
          hoverAnimation:false,
          symbol:'circle',
          symbolSize: 8,   //设定实心点的大小
          itemStyle:{  
            normal:{  
              borderColor:'#fff',  //拐点边框颜色  
            }  
          },
        },
        {
          name: '新增会员',
          data: this.flow['yAxis3'],
          type: 'line',
          hoverAnimation:false,
          symbol:'circle',
          symbolSize: 8,   //设定实心点的大小
          itemStyle:{  
            normal:{  
              borderColor:'#fff',  //拐点边框颜色  
            }  
          },
        }],
      };
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
