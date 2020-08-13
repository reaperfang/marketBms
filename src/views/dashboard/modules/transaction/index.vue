<template>
	<div class="row-3-grid-content  flex-column">
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