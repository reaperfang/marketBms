/* 交易分布 */
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
      n:{},
      mapName: 'chinaAll',
      geoCoordMap: {},
      mapData: [
          // { name: '北京', selected: false, value: 1 },
          // { name: '天津', selected: false, value: 2 },
          // { name: '上海', selected: false, value: 3 },
          // { name: '重庆', selected: false, value: 4 },
          // { name: '河北', selected: false, value: 5 },
          // { name: '河南', selected: false, value: 6 },
          // { name: '云南', selected: false, value: 7 },
          // { name: '辽宁', selected: false, value: 8 },
          // { name: '黑龙江', selected: false, value: 9 },
          // { name: '湖南', selected: false, value: 10 },
          // { name: '安徽', selected: false, value: 11 },
          // { name: '山东', selected: false, value: 12 },
          // { name: '新疆', selected: false, value: 13 },
          // { name: '江苏', selected: false, value: 14 },
          // { name: '浙江', selected: false, value: 15 },
          // { name: '江西', selected: false, value: 16 },
          // { name: '湖北', selected: false, value: 17 },
          // { name: '广西', selected: false, value: 18 },
          // { name: '甘肃', selected: false, value: 19 },
          // { name: '山西', selected: false, value: 20 },
          // { name: '内蒙古', selected: false, value: 21 },
          // { name: '陕西', selected: false, value: 22 },
          // { name: '吉林', selected: false, value: 23 },
          // { name: '福建', selected: false, value: 24 },
          // { name: '贵州', selected: false, value: 25 },
          // { name: '广东', selected: false, value: 26 },
          // { name: '青海', selected: false, value: 27 },
          // { name: '西藏', selected: false, value: 28 },
          // { name: '四川', selected: false, value: 29 },
          // { name: '宁夏', selected: false, value: 30 },
          // { name: '海南', selected: false, value: 31 },
          // { name: '台湾', selected: false, value: 32 },
          // { name: '香港', selected: false, value: 33 },
          // { name: '澳门', selected: false, value: 34 }
      ] //各省地图颜色数据依赖value
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
    //数据格式处理
    dataVal(){
      this.dataChart.areaOrderNumList.forEach(item=>{
        this.mapData.push({ name: item.area_name, selected: false, value: item.order_cquantity_area })
      })
    },
    // 数据显示控制
    con(){
      this.dataVal();
      this.option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>'+'订单数量：{c}'
        },
        series: [{
          type: 'map',
          mapType: 'chinaAll',
          roam: true,//是否开启地图放大缩小功能
          label: {
            normal: {
                show: true, //显示省份标签
                textStyle: {
                  color: "#454545",
                  fontSize:8,
                } //省份标签字体颜色
            },
            emphasis: { //对应的鼠标悬浮效果
                show: false,
                textStyle: {
                    color: "#DDEFFF"
                }
            }
          },
          aspectScale: 0.75,
          zoom: 1.2,
          itemStyle: {
            normal: {
                show:false,
                borderWidth: 1, //区域边框宽度
                borderColor: '#0077FF', //区域边框颜色
                areaColor: "#DDEFFF", //区域颜色
            },
            emphasis: {
                show:false,
                borderWidth: 1,
                borderColor: '#0077FF',
                areaColor: "#63C2FF",
            }
          },
          data: this.mapData
        }],
        dataRange: {
          x: '-1000 px',
          y: '-1000 px',
          splitList: [
              {start: 3001},
              {start: 2001, end: 3000},
              {start: 1001, end: 2000,},
              {start: 1, end: 1000,},
              {start: 0,end: 0}
          ],
          color: ['#0077FF', '#4FA0FF','#72BAFF', '#AFD5FF', '#DDEFFF']
        },
      };
      this.makeOption(this.flow);
    //   this.option.xAxis.data = this.flow.xAxis;
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
