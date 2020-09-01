<template>
	<div class="grid-content middle-grid-margin">
		<el-row type="flex" justify="space-between">
			<el-col :span="18">
				<gridtitle :title="'今日交易金额'"></gridtitle>
			</el-col>
			<el-col :span="6">
				<div class="grid-title-end">
					<span>
						同比昨日
						<span>增长{{ persent }}%</span>
					</span>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<!-- <countTo
					:prefix="''"
					:suffix=""
					:startVal="startVal"
					:endVal="endVal"
					:duration="7000"
					ref="countTo"
				></countTo> -->

				<countTo
					:startVal="startVal"
					:endVal="endVal"
					:duration="7000"
					ref="countTo"
				></countTo>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="24">
				<gridtitle :title="'用户交易分布'"></gridtitle>
			</el-col>
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

export default {
	watch: {
		"dashboard.chinamap"(val) {
			this.$refs.chart.showChart(this.initMapData(this.mapData, val));
		},
		"dashboard.amount"(val) {
			console.log('"dashboard.amount"(val) {', val);
			this.persent = parseFloat(val.place_order_amount_rgrt) * 100;
			this.endVal = parseFloat(val.place_order_amount_rt) * 100;

			this.$refs.countTo.start();
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
			cid: JSON.parse(localStorage.getItem("shopInfos")).id,
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
			]
		};
	},
	computed: {
		...mapState(["dashboard"])
	},
	mounted() {
		this.init();
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
			let parames = { cid: this.cid };
			let res = await this._apis.dashboard.realTimeUser(parames);
			this.maplist(res.areaOrderNumList);
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
		}
	}
};
</script>
