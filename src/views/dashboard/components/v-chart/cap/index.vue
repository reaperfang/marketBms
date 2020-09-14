<template>
	<div class="panel-content-cap">
		<div class="chartContent">
			<div class="circle-45 circle-hover" v-show="five">
				<span>{{ five }}</span>
			</div>
			<div class="circle-55 circle-hover" v-show="fourth">
				<span>{{ fourth }}</span>
			</div>
			<div class="circle-65 circle-hover" v-show="third">
				<span>{{ third }}</span>
			</div>
			<div class="circle-70 circle-hover" v-show="sec">
				<span>{{ sec }}</span>
			</div>

			<div class="circle-90 circle-hover" v-show="first">
				<span>{{ first }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import echarts from "echarts";
export default {
	// props: ["boddy"],
	name: "TEMPLATE",
	watch: {
		"dashboard.hobby"(val) {
			this.showChart(val);
		}
	},
	computed: {
		...mapState(["dashboard"])
	},
	data() {
		return {
			chartData: "71.23",
			chart: "",
			first: "",
			sec: "",
			third: "",
			fourth: "",
			five: ""

			// first: "测试",
			// sec: "测试",
			// third: "测试",
			// fourth: "测试",
			// five: "测试"
		};
	},
	created() {},
	mounted() {
		//this.showChart();
		// window.addEventListener("resize", ev => {
		// 	this.chart.resize();
		// });
	},
	methods: {
		showChart(data) {
			//let result = data.goods_type_name;

			data.goods_type_name.forEach((item, index) => {
				// console.log("item", item);
				// console.log("index", index);
				// console.log(item.goods_type_name);
				// console.log(
				// 	item.goods_type_name.match(/[\u4E00-\u9FA5]/g).length
				// );

				if (index == 0) {
					this.first = item.goods_type_name;
				}

				if (index == 1) {
					this.sec = item.goods_type_name;
				}
				if (index == 2) {
					this.third = item.goods_type_name;
				}
				if (index == 3) {
					this.fourth = item.goods_type_name;
				}
				if (index == 4) {
					this.five = item.goods_type_name;
				}
			});
		}
	},
	components: {}
};
</script>

<style lang="scss" scoped>
.panel-content-cap {
	height: 100%;

	.chartContent {
		height: 100%;
		position: relative;

		.text-mult {
			// overflow: hidden;
			// text-overflow: ellipsis;
			// white-space: nowrap;

			display: block;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			text-align: center;
		}

		.circle-hover {
			cursor: pointer;
		}

		.circle-45 {
			position: absolute;
			top: 105px;
			left: 120px;
			border-radius: 50%;
			width: 45px;
			height: 45px;
			background: rgba(255, 92, 49, 0.1);
			box-shadow: 0px 0px 12px 0px #5f5eff inset;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: -20px;
			margin-top: -20px;
		}

		.circle-45:hover {
			background: #026dff;
			box-shadow: 0px 0px 12px 0px #026dff inset;
			// transform: scale(2.2);

			width: 100px;
			height: 100px;
			margin-left: -50px;
			margin-top: -50px;
			span {
				font-size: 18px;
			}
		}

		.circle-55 {
			position: absolute;
			top: 75px;
			right: 300px;
			border-radius: 50%;
			width: 55px;
			height: 55px;
			background: rgba(255, 92, 49, 0.1);
			box-shadow: 0px 0px 12px 0px #f59f00 inset;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: -20px;
			margin-top: -20px;
		}

		.circle-55:hover {
			background: #026dff;
			box-shadow: 0px 0px 12px 0px #026dff inset;
			//transform: scale(1.8);
			width: 100px;
			height: 100px;
			margin-left: -45px;
			margin-top: -45px;
			span {
				font-size: 18px;
			}
		}

		.circle-65 {
			position: absolute;
			top: 55px;
			left: 50px;
			border-radius: 50%;
			width: 65px;
			height: 65px;
			background: rgba(255, 92, 49, 0.1);
			box-shadow: 0px 0px 12px 0px #ff5c31 inset;
			display: flex;
			align-items: center;
			justify-content: center;

			margin-left: -20px;
			margin-top: -20px;
		}

		.circle-65:hover {
			background: #026dff;
			box-shadow: 0px 0px 12px 0px #026dff inset;
			//transform: scale(1.8);
			width: 100px;
			height: 100px;
			margin-left: -45px;
			margin-top: -45px;
			span {
				font-size: 18px;
			}
		}

		.circle-70 {
			position: absolute;
			top: 55px;
			right: 220px;
			border-radius: 50%;
			width: 70px;
			height: 70px;
			background: rgba(255, 92, 49, 0.1);
			box-shadow: 0px 0px 12px 0px #06c9dd inset;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: -20px;
			margin-top: -20px;
		}

		.circle-70:hover {
			background: #026dff;
			box-shadow: 0px 0px 12px 0px #026dff inset;
			//transform: scale(1.8);
			width: 100px;
			height: 100px;
			margin-left: -35px;
			margin-top: -35px;
			span {
				font-size: 18px;
			}
		}

		.circle-90 {
			position: absolute;
			top: 50px;
			right: 90px;
			border-radius: 50%;
			width: 90px;
			height: 90px;
			background: rgba(255, 92, 49, 0.1);
			box-shadow: 0px 0px 12px 0px #026dff inset;
			display: flex;
			align-items: center;
			justify-content: center;

			margin-left: -20px;
			margin-top: -20px;
		}

		.circle-90:hover {
			background: #026dff;
			box-shadow: 0px 0px 12px 0px #026dff inset;
			//transform: scale(1.8);
			width: 100px;
			height: 100px;
			margin-left: -25px;
			margin-top: -25px;
			span {
				font-size: 18px;
			}
		}

		span {
			font-size: 14px;
			font-weight: 500;
			color: #ffffff;
			padding: 5px;
		}
	}
}
</style>
