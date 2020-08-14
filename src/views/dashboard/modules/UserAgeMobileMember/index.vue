<template>
	<div class="grid-content flex-column">
		<el-row type="flex" justify="space-between" class="item">
			<el-col :span="12">
				<vitem :title="'用户渠道分别'" :chartData="chartData" :icon="'0'"></vitem>
			</el-col>
			<el-col :span="12">
				<vitem :title="'渠道会员转换'" :chartData="chartData" :icon="'1'"></vitem>
			</el-col>
		</el-row>
		<el-row type="flex" justify="space-between" class="item">
			<el-col :span="12">
				<vitem :title="'性别年龄分布'" :chartData="chartData" :icon="'2'"></vitem>
			</el-col>
			<el-col :span="12">
				<vitem :title="'绑定手机号'" :chartData="chartData" :icon="'3'"></vitem>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import gridtitle from "../../components/title/index";
import vitem from "./item";
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
	components: { gridtitle, vitem },
	data: function() {
		return {
			chartData: {
				columns: ["日期", "访问用户"],
				rows: [
					{ 日期: "1/1", 访问用户: 1393 },
					{ 日期: "1/2", 访问用户: 3530 },
					{ 日期: "1/3", 访问用户: 2923 },
					{ 日期: "1/4", 访问用户: 1723 },
					{ 日期: "1/5", 访问用户: 3792 },
					{ 日期: "1/6", 访问用户: 4593 }
				]
			}
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

