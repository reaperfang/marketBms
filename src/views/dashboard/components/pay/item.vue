<template>
	<div class="pay-item">
		<el-row class="row-start">
			<span>支付人数</span>
		</el-row>
		<el-row class="row-end">
		<span>275</span>
		</el-row>
	</div>
</template>

<script>
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
	components: {},
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
.pay-item {
	display: flex;
	height: 100%;
	flex-direction: column;

	.row-start {
		flex: 1.5;
		display: flex;
		align-items: center;
		span {
			font-size: 12px;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			margin-left: 10px;
		}
	}

	.row-end {
		flex: 3;
        display: flex;
        justify-content: center;
        align-items: center;
		span {
			font-size: 24px;
			font-weight: 500;
			color: rgba(255, 225, 75, 1);
		}
	}
}
</style>
