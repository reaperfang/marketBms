/* 渠道转化比例图表 */
<script type='es6'>
import chartBase from "@/components/ChartBase";

export default {
  name: "pieChart",
  extends: chartBase,
  props: ['dataChart'],
  data() {
    return {
      flow:[],
    };
  },
  created() {
  },
  watch:{
    dataChart(newValue,oldValue){
      this.n = newValue
      this.con(this.n)
    }
  },
  methods: {
    con(n){
      this.flow = n;
      this.makeOption(n);
      this.oChart.setOption(this.option, true);
    },
    //设置图表数据项
    makeOption(data) {
      this.option = {
        tooltip: {
          trigger: "item",
          formatter:'{b}：{c}人<br/>'+'占比：{d}%'
        },
        legend: {  
          x:'5.5%',      //可设定图例在左、右、居中
          y:'top',
          data:["非会员", "会员"],
          icon: "circle",
          itemWidth:8,
        },
        calculable: true,
        color: ['#0077FF', '#FF9938'], 
        series: [{
          name: "",
          type: "pie",
          hoverAnimation:false,
          radius: ['35%', '55%'], 
          center: ["50%", "50%"],
          labelLine: {//设置延长线的长度
            normal: {
              length: 5,//设置延长线的长度
                // length2: 10,//设置第二段延长线的长度
            }
          },
          label: { //  饼图图形上的文本标签
            normal: { // normal 是图形在默认状态下的样式
                    formatter: '{a|{b}}\n{hr|}\n{per|{d}%}',
                    rich: {
                        a: {
                            color: '#999999',
                            fontSize: 11,
                            lineHeight: 20,
                            align: 'center'
                        },
                        hr: {
                            width: '100%',
                            height: 0,
                            alien:'center'
                        },
                        per: {
                            color: '#000000',
                            align: 'center',
                            fontSize: 15,
                        }
                    },
              show: true,
              position: 'outer',
              fontSize: 12,
              // formatter: '{b}：{c}人\n\n占比：{d}%',
              // formatter: function (params) {
              //   console.log(params)
              //   let html='';
              //   // for(let i=0;i<params.length;i++){
              //   //   html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
              //   //   if(params[i].seriesName=="name"){
              //   //     html+=params[i].seriesName+":"+params[i].value+"<br>";
              //   //   }else{
              //   //     html+=params[i].seriesName+":"+params[i].value+"<br>";
              //   //   }
              //   // }
              //   if(params.name=="非会员"){
              //       html+='<span style="display:inline-block;color:#92929B;">'+params.name+':'+params.value+'</span><br>';
              //     }else{
              //       html+='<span style="display:inline-block;color:#92929B;">'+params.name+':'+params.value+'</span><br>';
              //     }
              //   return html;
              // }
            }
          },
          data: data,
        }]
      };
    }
  },
  components: {}
};
</script>
