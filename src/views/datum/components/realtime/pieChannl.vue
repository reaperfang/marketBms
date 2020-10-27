<template>
    <div>
        <div id="main" style="width: 100%;height: 300px;"></div>
    </div>
</template>
<script>
import echarts from 'echarts'

export default {
  name: "",
  props: ['dataChart'],
  data() {
    return {
        charts:'',
    };
  },
  created() {
  },
  watch:{
    dataChart(newValue,oldValue){
      this.dataChart = newValue
       this.drawPie('main')
    }
  },
  methods: {
    drawPie(id){
        this.charts = echarts.init(document.getElementById(id))
        this.charts.setOption({
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
            // selectedMode:false,
        },
        calculable: true,
        color: ['#0077FF', '#FF9938'], 
        series: [{
        name: "",
        type: "pie",
        hoverAnimation:false,
        radius: ['25%', '42%'], 
        center: ["50%", "50%"],
        labelLine: {//设置延长线的长度
            normal: {
                length: 5,//设置延长线的长度
            }
        },
        label: { //  饼图图形上的文本标签
            normal: { // normal 是图形在默认状态下的样式
                formatter: '{b|{b}：}{perb|{c}人}\n{a|占比：}{per|{d}%}',
                rich: {
                    a: {
                        // width: 50,
                        color: '#92929B',
                        fontSize: 12,
                        lineHeight: 20,
                        align: 'left'
                    },
                    b: {
                        // width: 50,
                        color: '#92929B',
                        fontSize: 12,
                        lineHeight: 20,
                        align: 'right'
                    },
                    per: {
                        color: '#161617',
                        align: 'left',
                        fontSize: 12,
                        fontWeight: 'bold',
                        // width: 50,
                    },
                    perb: {
                        color: '#161617',
                        align: 'right',
                        fontSize: 12,
                        fontWeight: 'bold',
                        // width: 50,
                    }
                },
                show: true,
                position: 'outer',
                fontSize: 12,
                }
            },
            data: this.dataChart,
            }]
        })
    }
  },
    //调用
    mounted(){
        // console.log(this.dataChart)
        this.$nextTick(function() {
            this.drawPie('main')
        })
    }
}
</script>
