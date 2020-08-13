<template>
	<div class="row-3-grid-content">
		<el-row type="flex" justify="space-between" class="item-title">
			<el-col :span="12">
				<gridtitle :title="'总交易金额分布'"></gridtitle>
			</el-col>
			<el-col :span="12">
				<gridtitle :title="'客单价(最近七天)'"></gridtitle>
			</el-col>
		</el-row>
		<el-row class="item-content">
			<el-col :span="12" class="v-el-col">
				<vhistogram></vhistogram>
			</el-col>
			<el-col :span="12" class="v-el-col">
					<vhistogram></vhistogram>
				 </el-col>
		</el-row>
	</div>
</template>

<script>
import gridtitle from "../..//components/title/index";
import vhistogram from "../../components/v-chart/histogram/index";
import { mapGetters, mapActions, mapState } from "vuex";

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
	components: { gridtitle, vhistogram },
	data: function() {
		return {};
	},
	computed: {
		//...mapState([""])
	},
	mounted() {},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed: function() {},
	methods: {
		//...mapActions([""]),
	}
};
</script>

<style lang="scss">
$row-3-grid-content: 300px;

.row-3-grid-content {
	height: $row-3-grid-content;
	background: rgba(71, 225, 255, 0.02);
	box-shadow: 0px 1px 20px 0px rgba(71, 225, 255, 0.1);
	border: 1px solid rgba(71, 225, 255, 0.15);

	.item-title {
		height: 50px;
	}

	.item-content {
		height: 100%;
		margin: 0 8px;

		.v-el-col {
			height: 100%;
		}
	}
}
</style>
