<template>
	<div class="row-3-grid-content flex-column">
		<el-row type="flex" justify="space-between" class="item">
			<el-col :span="24">
				<gridtitle :title="'用户交易偏好'"></gridtitle>
			</el-col>
		</el-row>
		<el-row class="item-content">
			<vcap></vcap>
		</el-row>
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
