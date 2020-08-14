<template>
	<div class="item-ring flex-column">
		<el-row type="flex" justify="space-between" class="item-title">
			<el-col :span="24">
				<gridtitle :title="title"></gridtitle>
			</el-col>
		</el-row>
		<el-row class="item-content"> 
            <vring :chartData="chartData" :title="title":icon="icon"></vring>
			<!-- <component :is="isIcon" :data="{key:title,value:'8445566'}"></component> -->
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
	props: ["title","chartData","icon"],
	components: { gridtitle ,vring},
	data: function() {
		return {
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

<style lang="scss">
.item-ring {
	height: 100%;
}
</style>
