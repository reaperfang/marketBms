/* 渠道转化比例图表 */
<script type='es6'>
import chartBase from "@/components/ChartBase";

export default {
  name: "pieChart",
  extends: chartBase,
  data() {
    return {
      flow:[],
      opinionData:[
          {value:335, name:'非会员'},
          {value:310, name:'会员'},
        ]
    };
  },
  created() {
  },
  methods: {
    con(n){
      console.log(n)
      console.log(this.flow)
      this.flow = n;
      this.makeOption(n);
      this.oChart.setOption(this.option, true);
    },
    //设置图表数据项
    makeOption(data) {
      this.option = {
        tooltip: {
          trigger: "item",
          // formatter: "{a} <br/>{b} : {c} ({d}%)",
          formatter:'{b}：{c}人<br/>'+'占比：{d}%'
        },
        legend: {  
          x:'10%',      //可设定图例在左、右、居中
          y:'top',
          data:["非会员", "会员"],
          icon: "circle",
          itemWidth:8,
          },
        calculable: true,
        color: ['#0077FF', '#FF9938'], 
        series: [
          {
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
                    show: true,
                    // color: '#000000',
                    position: 'outer',
                    fontSize: 12,
                    // formatter: '{b}：{c}人\n占比：{d}%', // {b}:数据名； {c}：数据值； {d}：百分比
                    formatter: '{b}：{c}人\n\n占比：{d}%',
                    // formatter:'{a_set|这段文本采用样式a}',
                    // borderWidth: 20,
                    // borderRadius: 4,
                    // padding: [90, -50],
                    // rich: {
                    //     a_set: {
                    //         color: "#1a1a1a",
                    //         lineHeight: 20,
                    //         align: "center"
                    //     },
                    //     c_set:{
                    //         color: "#808080",
                    //     }
                      
                    // }
                    
                }
            },
            data: this.opinionData,
          }
        ]
      };
    }
  },
  components: {}
};
</script>
