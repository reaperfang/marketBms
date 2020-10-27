<template>
	<div class="panel-content-cap">
		<div class="chartContent empty" v-show="isEmpty">
			<span>暂无数据</span>
		</div>
		<div class="chartContent" v-show="!isEmpty">
			<div
				class="circle-45 circle-hover"
				v-show="five"
				@click.prevent
				v-tooltip.right="{
					ref: 'tooltipRef-45',
					class: 'tooltip-custom tooltip-other-custom'
				}"
			>
				<span class="time-text">{{
					getLength(five) > 4 ? five.substring(0, 4) : five
				}}</span>
				<div ref="tooltipRef-45" class="tooltip-content">
					<span
						style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#5f5eff"
					></span>
					<span style="padding:15px 0">交易排名第五</span><br />
					<p style="padding:5px 17px;">{{ five }}</p>
				</div>
			</div>
			<div
				class="circle-55 circle-hover"
				v-show="fourth"
				@click.prevent
				v-tooltip.left="{
					ref: 'tooltipRef-55',
					class: 'tooltip-custom tooltip-other-custom'
				}"
			>
				<!-- <span class="time-text">{{ fourth }}</span> -->
				<span class="time-text">{{
					getLength(fourth) > 4 ? fourth.substring(0, 4) : fourth
				}}</span>
				<div ref="tooltipRef-55" class="tooltip-content">
					<span
						style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#f59f00"
					></span>
					<span style="padding:15px 0">交易排名第四</span><br />
					<p style="padding:5px 17px;">{{ fourth }}</p>
				</div>
			</div>
			<div
				class="circle-65 circle-hover"
				v-show="third"
				@click.prevent
				v-tooltip.left="{
					ref: 'tooltipRef-65',
					class: 'tooltip-custom tooltip-other-custom'
				}"
			>
				<!-- <span class="time-text">{{ third }}</span> -->
				<span class="time-text">{{
					getLength(third) > 4 ? third.substring(0, 4) : third
				}}</span>
				<div ref="tooltipRef-65" class="tooltip-content">
					<span
						style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff5c31"
					></span>
					<span style="padding:15px 0">交易排名第三</span><br />
					<p style="padding:5px 17px;">{{ third }}</p>
				</div>
			</div>
			<div
				class="circle-70 circle-hover"
				v-show="sec"
				@click.prevent
				v-tooltip.right="{
					ref: 'tooltipRef-70',
					class: 'tooltip-custom tooltip-other-custom'
				}"
			>
				<!-- <span class="time-text">{{ sec }}</span> -->
				<span class="time-text">{{
					getLength(sec) > 4 ? sec.substring(0, 4) : sec
				}}</span>
				<div ref="tooltipRef-70" class="tooltip-content">
					<span
						style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#06c9dd"
					></span>
					<span style="padding:15px 0">交易排名第二</span><br />
					<p style="padding:5px 17px;">{{ sec }}</p>
				</div>
			</div>

			<div
				class="circle-90 circle-hover"
				v-show="first"
				@click.prevent
				v-tooltip.right="{
					ref: 'tooltipRef-90',
					class: 'tooltip-custom tooltip-other-custom'
				}"
			>
				<!-- <span class="time-text">{{ first }}</span> -->
				<span class="time-text">{{
					getLength(first) > 4 ? first.substring(0, 4) : first
				}}</span>
				<div ref="tooltipRef-90" class="tooltip-content">
					<span
						style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#026dff"
					></span>
					<span style="padding:15px 0">交易排名第一</span><br />
					<p style="padding:5px 17px;">{{ first }}</p>
				</div>
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
			chartData: [
				// {
				// 	size: 90,
				// 	top: "一",
				// 	name: this.first,
				// 	color: "#026dff"
				// },
				// {
				// 	size: 70,
				// 	top: "二",
				// 	name: this.sec,
				// 	color: "#06c9dd"
				// },
				// {
				// 	size: 65,
				// 	top: "三",
				// 	name: this.third,
				// 	color: "#ff5c31"
				// },
				// {
				// 	size: 55,
				// 	top: "四",
				// 	name: this.fourth,
				// 	color: "#f59f00"
				// },
				// {
				// 	size: 45,
				// 	top: "五",
				// 	name: this.five,
				// 	color: "#5f5eff"
				// }
			],
			chart: "",
			first: "",
			sec: "",
			third: "",
			fourth: "",
			five: "",

			isEmpty: false

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
		getLength(val) {
			return val && val.match(/[\u4E00-\u9FA5]/g).length;
		},
		tipHtml: params => {
			return "FDSFSDFDSFSDF";
			var dotHtml = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.barColor}"></span>`;
			return `${dotHtml}交易排名第${params.top}<br/> &nbsp&nbsp&nbsp${params.content}%`;
		},
		showChart(data) {
			if (!data.goods_type_name) {
				this.isEmpty = true;
				return;
			}

			data.goods_type_name.forEach((item, index) => {
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

			this.chartData = [
				{
					size: "90",
					top: "一",
					name: this.first,
					color: "#026dff"
				},
				{
					size: 70,
					top: "二",
					name: this.sec,
					color: "#06c9dd"
				},
				{
					size: 65,
					top: "三",
					name: this.third,
					color: "#ff5c31"
				},
				{
					size: 55,
					top: "四",
					name: this.fourth,
					color: "#f59f00"
				},
				{
					size: 45,
					top: "五",
					name: this.five,
					color: "#5f5eff"
				}
			];

			// console.log("this.chartData ", this.chartData);
		}
	},
	components: {}
};
</script>

<style lang="scss">
.panel-content-cap {
	height: 100%;
	display: flex;
	justify-content: center;

	.chartContent {
		height: 100%;
		position: relative;
		// background: red;
		// margin: 0 130px;

		// border: 1px solid red;
		width: 275px;

		.text-mult {
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
			top: 65px;
			right: 85px;
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

		// .circle-45:hover {
		// 	background: #026dff;
		// 	box-shadow: 0px 0px 12px 0px #026dff inset;
		// 	transform: scale(2.2);

		// 	width: 100px;
		// 	height: 100px;
		// 	margin-left: -50px;
		// 	margin-top: -50px;
		// 	span {
		// 		font-size: 18px;
		// 	}
		// }

		.circle-55 {
			position: absolute;
			top: 42px;
			right: 140px;
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

		// .circle-55:hover {
		// 	background: #026dff;
		// 	box-shadow: 0px 0px 12px 0px #026dff inset;
		// 	transform: scale(1.8);
		// 	width: 100px;
		// 	height: 100px;
		// 	margin-left: -45px;
		// 	margin-top: -45px;
		// 	span {
		// 		font-size: 18px;
		// 	}
		// }

		.circle-65 {
			position: absolute;
			top: 55px;
			right: 200px;
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

		// .circle-65:hover {
		// 	background: #026dff;
		// 	box-shadow: 0px 0px 12px 0px #026dff inset;
		// 	transform: scale(1.8);
		// 	width: 100px;
		// 	height: 100px;
		// 	margin-left: -45px;
		// 	margin-top: -45px;
		// 	span {
		// 		font-size: 18px;
		// 	}
		// }

		.circle-70 {
			position: absolute;
			top: 105px;
			right: 120px;
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

		// .circle-70:hover {
		// 	background: #026dff;
		// 	box-shadow: 0px 0px 12px 0px #026dff inset;
		// 	transform: scale(1.8);
		// 	width: 100px;
		// 	height: 100px;
		// 	margin-left: -35px;
		// 	margin-top: -35px;
		// 	span {
		// 		font-size: 18px;
		// 	}
		// }

		.circle-90 {
			position: absolute;
			top: 85px;
			right: 0px;
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

		// .circle-90:hover {
		// 	background: #026dff;
		// 	box-shadow: 0px 0px 12px 0px #026dff inset;
		// 	transform: scale(1.8);
		// 	width: 100px;
		// 	height: 100px;
		// 	margin-left: -25px;
		// 	margin-top: -25px;
		// 	span {
		// 		font-size: 18px;
		// 	}
		// }

		span {
			font-size: 14px;
			font-weight: 500;
			color: #ffffff;
			padding: 5px;
		}
	}

	.time-text {
		// overflow: hidden;
		// text-overflow: ellipsis;
		// white-space: nowrap;
		//text-align: center;

		width: 50px;
		text-align: center;
	}

	.empty {
		display: flex;
		justify-content: center;
		align-items: center;
		span {
			color: #92929b;
		}
	}
}

@media screen and (max-width: 1440px) and (max-height: 900px){
	.panel-content-cap {
		.chartContent {
			margin-top: -10px;
		}
	}
}
@media screen and (max-width: 1600px) and (max-height: 900px){
	.panel-content-cap {
		.chartContent {
			margin-top: -10px;
		}
	}
}

/* custom CSS */
.vue-tooltip.tooltip-custom {
	opacity: 0.8;
	background-color: #333333;
	border-radius: 4px;
}

.vue-tooltip.tooltip-custom .tooltip-arrow {
	opacity: 0.8;
	//background-color: #333333;
	border-right-color: #333333;
	border-left-color: #333333;
	// background-color: red;
}

.tooltip-content {
	// opacity: 0.8;
	background-color: #333333;
	p {
		color: #ffffff;
	}
}
</style>
