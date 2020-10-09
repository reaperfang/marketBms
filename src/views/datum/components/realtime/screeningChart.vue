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
      //获取当前小时
      var curdata=new Date();
      var curhours=curdata.getHours()+2;
      this.flow = {
        xAxis:this.n.xAxis,
        yAxis1:this.n.data_rt && this.n.data_rt.map(item => { return (item*1).toFixed(2)}),
        yAxis2:this.n.data_rd && this.n.data_rd.map(item => { return (item*1).toFixed(2)}),
        // yAxis1:this.n.data_rt,
        // yAxis2:this.n.data_rd,
      }
      this.flow.yAxis1=this.flow.yAxis1.slice(0,curhours)
      this.option = {
        tooltip: {
          trigger: "axis",
          // formatter:'0：00：{c}人<br/>'+'占比：{d}%'
            formatter: function (params) {
              let html='0:00-'+(params[0].name-1)+":59<br>";
              for(let i=0;i<params.length;i++){
                html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
                if(params[i].seriesName=="今日"){
                  html+=params[i].seriesName+":"+params[i].value+"<br>";
                }else{
                  html+=params[i].seriesName+":"+params[i].value+"<br>";
                }
              }
              return html;
            }
        },
        legend: {  
          top:'0%',
          right: "1.5%",
          data: ['今日', '昨日'],
          icon: "circle",
          itemWidth:8,
          textStyle:{//图例文字的样式
            color:'#92929B',
          }
        },  
        color:['#0077FF','#2FC25B'],
        grid: {
          top:'11%',
          left: "0%",
          right: "2%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {//X轴
          type: "category",
          boundaryGap: false,
          axisLine:{ 
            lineStyle: {
                color: '#EDEDED',
                width: 1, //这里是为了突出显示加上的  
            }
          },
          axisLabel:{
            showMaxLabel:true,
            interval: 5,
            textStyle: {
              color: '#92929B', 
            },
          },
          data: this.flow['xAxis']
        },
        yAxis: {//Y轴
          type: "value",
          // splitNumber: 5,
          minInterval: 1,
          // max:leftY.max,
          // min:leftY.min,
          axisLabel:{
            textStyle: {
              color: '#92929B', 
            },
          },
          axisLine:{       //y轴
            show:false,
            lineStyle: {
                color: '#EDEDED',
                width: 1, //这里是为了突出显示加上的  
            }
          },
          splitLine :{    //网格线
            lineStyle:{
              color: '#EDEDED',
              type:'dashed'    //设置网格线类型 dotted：虚线   solid:实线
            },
            show:true, //隐藏或显示
          },
        },
        series: [{
          name: '今日',
          data: this.flow.yAxis1,
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
          name: '昨日',
          data: this.flow.yAxis2,
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
