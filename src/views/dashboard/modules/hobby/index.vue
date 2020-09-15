<template>
	<div class="row-3-grid-content flex-column flex-box">
		<!-- <el-row type="flex" justify="space-between" class="item-title">
			<el-col :span="24">
				<gridtitle :title="'用户交易偏好'"></gridtitle>
			</el-col>
		</el-row>
		<el-row class="item-content">
			<vcap></vcap>
		</el-row> -->
		<div class="title">
			<gridtitle :title="'用户交易偏好'"></gridtitle>
		</div>
		<div class="content">
			<vcap></vcap>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import gridtitle from "../../components/title/index";
import vcap from "../../components/v-chart/cap/index";

export default {
	watch: {
		// flowData(val) {
		// }
	},
	props: {
		// data: {
		//   type: Object,
		//   default: false
		// }
	},
	components: { gridtitle, vcap },
	data: function() {
		return {
			cid: JSON.parse(localStorage.getItem("shopInfos")).id,
			boddy: []
		};
	},
	computed: {
		//...mapState([""])
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
		...mapActions(["hobbylist"]),
		async init() {
			let parames = { ...this.invokeType, cid: this.cid };
			let resstatistics = await this._apis.dashboard.statistics(parames);
			this.hobbylist(JSON.parse(resstatistics));
		}
	}
};
</script>
<style lang="scss">
// .main-box {
// 	position: relative;
// 	width: 100%;
// 	height: 100%;
// 	.title {
// 		width: 100%;
// 		height: 43px;
// 		// background: #29f0bf;
// 	}
// 	.content {
// 		width: 100%;
// 		position: absolute;
// 		top: 43px;
// 		bottom: 0px;
// 		left: 0px;
// 		// background: #f09529;
// 	}
// }
</style>
