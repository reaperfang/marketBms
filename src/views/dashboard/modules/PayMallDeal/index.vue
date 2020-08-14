<template>
	<div class="grid-content  flex-column">
		<el-row type="flex" justify="space-between" class="item-start">
			<el-col :span="24">
				<vpay></vpay>
			</el-col>
		</el-row>
		<el-row class="item-end">
			<div class="maill-deal-s">
				<el-row
					class="box-item-start"
				>
					<el-col :span="24">
						<gridtitle :title="'商城成交来源TOP3'"></gridtitle>
					</el-col>
				</el-row>
				<div class="box-item-end"></div>
			</div>
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
<style lang="scss" scoped>
.maill-deal-s {
	// background: yellow;
	height: 100%;
	.box-item-start {
		height: 43px;
	}

	.box-item-end {
		background: red;
		margin:0  8px;
		position: absolute;
		top: 43px;
		left: 0;
		bottom: 0;
		right: 0;
	}
}
</style>
