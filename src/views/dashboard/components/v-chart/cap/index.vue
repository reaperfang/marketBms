<template>
	<div class="panel-content-cap">
		<div class="chartContent">
			<div class="circle-45">
				<span>是否</span>
			</div>
			<div class="circle-65">
				<span>零售</span>
			</div>

			<div class="circle-55">
				<span>发生</span>
			</div>

			<div class="circle-90">
				<span>豆腐丝豆</span>
			</div>

			<div class="circle-70">
				<span>所发生</span>
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
			chart: ""
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

			data.goods_type_name.forEach(item => {
				console.log(item.goods_type_name);
				console.log(
					item.goods_type_name.match(/[\u4E00-\u9FA5]/g).length
				);
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

		.circle-45 {
			position: absolute;
			top: 65px;
			left: 120px;
			border-radius: 50%;
			width: 45px;
			height: 45px;
			background: rgba(255, 92, 49, 0.1);
			box-shadow: 0px 0px 12px 0px #5f5eff inset;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.circle-65 {
			position: absolute;
			top: 35px;
			left: 30px;
			border-radius: 50%;
			width: 65px;
			height: 65px;
			background: rgba(255, 92, 49, 0.1);
			box-shadow: 0px 0px 12px 0px #ff5c31 inset;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.circle-55 {
			position: absolute;
			top: 35px;
			right: 300px;
			border-radius: 50%;
			width: 55px;
			height: 55px;
			background: rgba(255, 92, 49, 0.1);
			box-shadow: 0px 0px 12px 0px #f59f00 inset;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.circle-70 {
			position: absolute;
			top: 35px;
			right: 200px;
			border-radius: 50%;
			width: 70px;
			height: 70px;
			background: rgba(255, 92, 49, 0.1);
			box-shadow: 0px 0px 12px 0px #06c9dd inset;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.circle-90 {
			position: absolute;
			top: 35px;
			right: 70px;
			border-radius: 50%;
			width: 90px;
			height: 90px;
			background: rgba(255, 92, 49, 0.1);
			box-shadow: 0px 0px 12px 0px #026dff inset;
			display: flex;
			align-items: center;
			justify-content: center;
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
