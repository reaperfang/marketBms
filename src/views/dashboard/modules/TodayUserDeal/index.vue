<template>
	<div class="grid-content middle-grid-margin">
		<el-row type="flex" justify="space-between">
			<el-col :span="18">
				<gridtitle :title="'今日交易金额'"></gridtitle>
			</el-col>
			<el-col :span="6">
				<div class="grid-title-end">
					<span>
						同比昨日
						<span>增长20%</span>
					</span>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<countTo
					:startVal="startVal"
					:endVal="endVal"
					:duration="7000"
				></countTo>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="24">
				<gridtitle :title="'用户交易分布'"></gridtitle>
			</el-col>
		</el-row>

		<el-row class="grid-map">
			<chinamap></chinamap>
		</el-row>
	</div>
</template>

<script>
import gridtitle from "../../components/title/index";
import chinamap from "../../components/map/china/index";
import countTo from "../../components/CountTo/index";
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
	components: { gridtitle,chinamap ,countTo},
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
