/* 交易看板 */
<script type='es6'>
import chartBase from "@/components/ChartBase";
export default {
  name: "durationChart",
  extends: chartBase,
  computed:{},
  props: ['dataChart','checkList','units'],
  data() {
    return {
      flow:{},
      n:{},
    };
  },
  created() { },
  watch:{
    dataChart(newValue,oldValue){
      this.n = newValue
      this.con()
    },
    checkList(newValue,oldValue){
      this.checkList = newValue
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
      var color=['#FF8615','#0077FF','#2FC25B','#655EFF']
      var name=['支付金额','支付订单数', '支付人数','客单价']
      var series=[]
      var maxY=0
      var leftY=[]
      this.checkList.forEach((item,index)=>{
        this.n.data[0]=this.n.data[0] && this.n.data[0].map(item => { return (item*1).toFixed(2)})
        this.n.data[3]=this.n.data[3] && this.n.data[3].map(item => { return (item*1).toFixed(2)})
        if(item){
          var arr = this.n.data[index]
          var max = Math.max(...arr)
          leftY.push(max)
          series.push({
            name: name[index],
            data: this.n.data[index],
            type: 'line',
            hoverAnimation:false,
            symbol:'circle',
            symbolSize: 8,   //设定实心点的大小
            color:color[index],
            itemStyle:{  
              normal:{  
              borderColor:'#fff',  //拐点边框颜色  
            }  
          },
          })
        }
      })
      maxY=Math.max(...leftY);
      this.flow = { 
        xAxis:this.n.xAxis,
        // yAxis1:this.n.data[0] && this.n.data[0].map(item => { return (item*1).toFixed(1)}),
      }
      this.option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {  
          top:'0%',
          right: "3.5%",
          data: ['支付金额','支付订单数', '支付人数','客单价'],
          icon: "circle",
          itemWidth:8,
        }, 
        color:['#FF8615','#0077FF','#2FC25B','#655EFF'],
        grid: {
          top:'11%',
          left: "0%",
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
        yAxis: [{//Y轴
          type: "value",
          // minInterval: 1,
          // scale : true,
          // max : maxY==0?2:maxY,
          // // min : 0,
          // interval: maxY/5,
          // splitNumber : 5,
          // boundaryGap : [ 0, 1],
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
        }],
        series:series,
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
