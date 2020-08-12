<template>
	<div class="pay">
		<el-row class="row">
			<el-col :span="8"
				><div class="grid-box">
					<vitem></vitem></div
			></el-col>
			<el-col :span="8"><div class="grid-box"></div></el-col>
			<el-col :span="8"><div class="grid-box"></div></el-col>
		</el-row>
		<el-row class="row">
			<el-col :span="8"><div class="grid-box"></div></el-col>
			<el-col :span="8"><div class="grid-box"></div></el-col>
			<el-col :span="8"><div class="grid-box"></div></el-col>
		</el-row>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import vitem from "./item";
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
	components: { vitem },
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
.pay {
	height: 100%;
	display: flex;
	flex-direction: column;
	.row {
		flex: 1;
		margin: 10px 0 0 10px;

		.grid-box {
			background: RGBA(4, 25, 50, 1);
			height: 100%;
			margin-right: 10px;
			cursor: pointer;
		}

		.grid-box:hover {
			background: rgba(71, 225, 255, 0.05);
			border: 1px solid rgba(6, 201, 221, 1);
		}
	}
}
</style>
