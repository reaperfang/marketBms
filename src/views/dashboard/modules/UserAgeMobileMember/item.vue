<template>
	<div class="item-ring flex-column">
		<el-row type="flex" justify="space-between" class="item-title">
			<el-col :span="24">
				<gridtitle :title="title"></gridtitle>
			</el-col>
		</el-row>
		<el-row class="item-content"> 
            <vring :chartData="chartData"></vring>
        </el-row>
	</div>
</template>

<script>
import gridtitle from "../../components/title/index";
import vring from "../../components/v-chart/ring/index";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
	watch: {
		// flowData(val) {
		// }
	},
	props: ["title","chartData"],
	components: { gridtitle ,vring},
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
.item-ring {
	height: 100%;
}
</style>
