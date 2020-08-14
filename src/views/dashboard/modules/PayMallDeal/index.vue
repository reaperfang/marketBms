<template>
	<div class="grid-content  flex-column">
		<el-row type="flex" justify="space-between" class="item-start">
			<el-col :span="24">
				<vpay></vpay>
			</el-col>
		</el-row>
		<el-row type="flex" justify="space-between" class="item-end">
			<el-col :span="24">
				<gridtitle :title="'商城成交来源TOP3'"></gridtitle>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import gridtitle from "../../components/title/index";
import vpay from "../../components/pay/index";
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
	components: { gridtitle, vpay },
	data: function() {
		return {
			startVal: 0,
			endVal: 1000000
		};
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
