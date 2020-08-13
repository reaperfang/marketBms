<template>
	<div class="row-3-grid-content middle-grid-margin flex-column">
		<el-row type="flex" justify="space-between" class="item-title">
			<el-col :span="12">
				<gridtitle :title="'商城访客(最近七天)'"></gridtitle>
			</el-col>
			<el-col :span="12"> </el-col>
		</el-row>
		<el-row class="item-content">
			<vline></vline>
		</el-row>
	</div>
</template>

<script>
import gridtitle from "../..//components/title/index";
import vline from "../../components/v-chart/line/index";
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
	components: { vline, gridtitle },
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