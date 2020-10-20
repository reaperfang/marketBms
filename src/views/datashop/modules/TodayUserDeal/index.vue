<template>
	<div class="grid-content middle-grid-margin">
		<el-row type="flex" justify="space-between">
			<el-col :span="12">
				<gridtitle :title="'今日交易金额'"></gridtitle>
			</el-col>
			<el-col :span="12">
				<div class="grid-title-end">
					<span>
						同比昨日
						<!-- <span>{{ persent }}%{{ persent == 0 ? "" : "↑" }}</span> -->
						<span
							>{{ abs(persent) }}%{{
								persent < 0 ? "↓" : persent > 0 ? "↑" : ""
							}}</span
						>
					</span>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<countTo
					:startVal="startVal"
					:endVal="endVal"
					:duration="7000"
					ref="countTo"
				></countTo>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="12">
				<gridtitle :title="'用户交易分布'"></gridtitle>
			</el-col>
			<el-col :span="12"> </el-col>
		</el-row>

		<el-row class="grid-map">
			<chinamap :mapData="mapData" ref="chart"></chinamap>
		</el-row>
	</div>
</template>

<script>
import gridtitle from "../../components/title/index";
import chinamap from "../../components/map/china/index";
import countTo from "../../components/CountTo/index";
import { mapGetters, mapActions, mapState } from "vuex";
import { keepTwoDecimalFull } from "@/utils/util";

export default {
	watch: {
		"dashboard.chinamap"(val) {
			this.$refs.chart.showChart(
				this.initMapData(this.mapData, val ? val : [])
			);
		},
		"dashboard.amount"(val) {
			// this.persent =
			// 	val.place_order_amount_rgrt == "-9999"
			// 		? 0
			// 		: parseInt(
			// 				parseFloat(val.place_order_amount_rgrt).toFixed(2)
			// 		  ) * 100;

			//Math.round(110.115*100)/100
			this.persent =
				val.place_order_am_rgrt == "-9999"
					? 0
					: keepTwoDecimalFull(
							parseFloat(val.place_order_am_rgrt) * 100
					  );
			this.endVal = parseFloat(val.place_order_am_rt);

			//this.$refs.countTo.start();

			console.log("this.endVal ", this.endVal);
		}
	},

	props: {
		// data: {
		//   type: Object,
		//   default: false
		// }
	},
	components: { gridtitle, chinamap, countTo },
	data: function() {
		return {
			startVal: 0,
			endVal: 0,
			persent: "",
			//cid: JSON.parse(localStorage.getItem("shopInfos")).id,
			//mapData: [],
			mapData: [
				{ name: "湖北", value: 0 },
				{ name: "广东", value: 0 },
				{ name: "河南", value: 0 },
				{ name: "浙江", value: 0 },
				{ name: "湖南", value: 0 },
				{ name: "安徽", value: 0 },
				{ name: "江西", value: 0 },
				{ name: "江苏", value: 0 },
				{ name: "重庆", value: 0 },
				{ name: "山东", value: 0 },
				{ name: "四川", value: 0 },
				{ name: "黑龙江", value: 0 },
				{ name: "北京", value: 0 },
				{ name: "上海", value: 0 },
				{ name: "河北", value: 0 },
				{ name: "福建", value: 0 },
				{ name: "广西", value: 0 },
				{ name: "陕西", value: 0 },
				{ name: "云南", value: 0 },
				{ name: "海南", value: 0 },
				{ name: "贵州", value: 0 },
				{ name: "山西", value: 0 },
				{ name: "天津", value: 0 },
				{ name: "辽宁", value: 0 },
				{ name: "甘肃", value: 0 },
				{ name: "吉林", value: 0 },
				{ name: "新疆", value: 0 },
				{ name: "内蒙古", value: 0 },
				{ name: "宁夏", value: 0 },
				{ name: "香港", value: 0 },
				{ name: "台湾", value: 0 },
				{ name: "青海", value: 0 },
				{ name: "澳门", value: 0 },
				{ name: "西藏", value: 0 }
			],
			interval: {},
			intervalTime: 1000
		};
	},
	computed: {
		...mapState(["dashboard"])
	},
	mounted() {
		this.init();
		// var IntervalId = window.setInterval(() => {
		// 	this.init();
		// }, 10000);

		//this.modifyAmount();

		this.createInterval(this.intervalTime);
	},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed: function() {},
	methods: {
		...mapActions(["maplist"]),
		async init() {
			let parames = { ...this.invokeType, cid: this.cid };
			//let res = await this._apis.dashboard.realTimeUser(parames);
			let res =
				'{"areaOrderNumList":[{"area_name":"西藏","order_cquantity_area":0},{"area_name":"河南","order_cquantity_area":9},{"area_name":"甘肃","order_cquantity_area":0},{"area_name":"陕西","order_cquantity_area":0},{"area_name":"天津","order_cquantity_area":47},{"area_name":"安徽","order_cquantity_area":0},{"area_name":"北京","order_cquantity_area":3065},{"area_name":"福建","order_cquantity_area":0},{"area_name":"山西","order_cquantity_area":0},{"area_name":"海南","order_cquantity_area":6},{"area_name":"广西","order_cquantity_area":0},{"area_name":"河北","order_cquantity_area":13},{"area_name":"辽宁","order_cquantity_area":3},{"area_name":"湖北","order_cquantity_area":0},{"area_name":"内蒙古","order_cquantity_area":300},{"area_name":"广东","order_cquantity_area":8},{"area_name":"四川","order_cquantity_area":64},{"area_name":"江苏","order_cquantity_area":0},{"area_name":"香港","order_cquantity_area":5},{"area_name":"黑龙江","order_cquantity_area":0},{"area_name":"青海","order_cquantity_area":0},{"area_name":"台湾","order_cquantity_area":0},{"area_name":"浙江","order_cquantity_area":6},{"area_name":"山东","order_cquantity_area":7},{"area_name":"贵州","order_cquantity_area":0},{"area_name":"宁夏","order_cquantity_area":0},{"area_name":"上海","order_cquantity_area":3},{"area_name":"湖南","order_cquantity_area":0},{"area_name":"重庆","order_cquantity_area":0},{"area_name":"云南","order_cquantity_area":0},{"area_name":"吉林","order_cquantity_area":0},{"area_name":"江西","order_cquantity_area":0},{"area_name":"澳门","order_cquantity_area":0},{"area_name":"新疆","order_cquantity_area":1}]}';
			this.maplist(JSON.parse(res).areaOrderNumList);
		},

		initMapData(oldData, newData) {
			let result = [];

			for (var j = 0; j < oldData.length; j++) {
				let newItem = this.getValueByName(oldData[j].name, newData);
				if (newItem) {
					result.push({
						name: oldData[j].name,
						value: newItem.order_cquantity_area
					});
				} else {
					result.push(oldData[j]);
				}
			}

			return result;
		},

		getValueByName(key, data) {
			let result = data.find(item => {
				return item.area_name === key;
			});
			return result;
		},
		abs(val) {
			return Math.abs(val);
		},
		setInterval(callback, time) {
			return window.setInterval(() => {
				callback();
			}, time);
		},
		randomNum(maxNum, minNum, decimalNum) {
			// 获取指定范围内的随机数, decimalNum指小数保留多少位
			var max = 0,
				min = 0;
			minNum <= maxNum
				? ((min = minNum), (max = maxNum))
				: ((min = maxNum), (max = minNum));
			switch (arguments.length) {
				case 1:
					return Math.floor(Math.random() * (max + 1));
					break;
				case 2:
					return Math.floor(Math.random() * (max - min + 1) + min);
					break;
				case 3:
					return (Math.random() * (max - min) + min).toFixed(
						decimalNum
					);
					break;
				default:
					return Math.random();
					break;
			}
		},
		createInterval(intervalTime) {
			this.interval[intervalTime] = this.setInterval(() => {
				this.endVal += parseFloat(this.randomNum(30, 100, 2));
				this.clearInterval(this.intervalTime);
				this.intervalTime = parseInt(this.randomNum(1, 5, 2)) * 1000;
				this.createInterval(this.intervalTime);
			}, intervalTime);
		},
		clearInterval(intervalTime) {
			window.clearInterval(this.interval[intervalTime]);
		},
		modifyAmount() {
			// if (this.interval) {
			// 	this.clearInterval();
			// }
			// this.interval[this.intervalTime] = this.setInterval(() => {
			// 	// if (j == seriesData.length) j = 0;
			// 	// // topCity数组就是top的这个5个城市.
			// 	// this.option.series[0].data = [convertData(seriesData)[j]];
			// 	// // console.log(
			// 	// // 	"this.option.series[0].data",
			// 	// // 	this.option.series[0].data
			// 	// // );
			// 	// // console.log("geoCoordMap", geoCoordMap);
			// 	// this.chart.setOption(this.option);
			// 	// j++;
			// 	this.intervalTime = parseInt(this.randomNum(1, 5, 2)) * 1000;
			// 	// console.log("this.intervalTime", this.intervalTime);
			// 	this.endVal += parseFloat(this.randomNum(30, 100, 2));
			// 	this.clearInterval(this.intervalTime);
			// }, this.intervalTime);
		}
	}
};
</script>
<style lang="scss" scoped>
.animate {
	padding-left: 20px;
	font-size: 12px;
	color: #000;
	display: inline-block;
	white-space: nowrap;
	animation: 10s wordsLoop linear infinite normal;
}

@keyframes wordsLoop {
	0% {
		transform: translateX(50px);
		-webkit-transform: translateX(50px);
	}
	100% {
		transform: translateX(-100%);
		-webkit-transform: translateX(-100%);
	}
}

@-webkit-keyframes wordsLoop {
	0% {
		transform: translateX(50px);
		-webkit-transform: translateX(50px);
	}
	100% {
		transform: translateX(-100%);
		-webkit-transform: translateX(-100%);
	}
}
</style>
