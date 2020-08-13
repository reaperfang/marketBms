<template>
	<div class="v-chart-ring">
		<ve-ring
			:data="chartData"
			:settings="chartSettings"
			:extend="chartExtend"
			v-bind="pubSetting"
			:tooltip-visible="true"
			:legend-visible="false"
		></ve-ring>

		<component
			:is="iconuser"

			:title="title"
		></component>
	</div>
</template>

<script>
import list from "../../_mixin/index.js";
import echarts from "echarts";

//icon

import iconuser from "../../../modules/UserAgeMobileMember/icon/user";
export default {
	// props: ["chartData", "chartSettings", "chartExtend"],
	props: ["chartData", "title"],
	mixins: [list],
	data() {
		return {
			chartSettings: {
				// area: false
				radius: [60, 70],
				offsetY: 90
			},
			chartExtend: {
			},
			iconuser:iconuser

		};
	},
	components: {
		// iconuser
	}
};
</script>

<style lang="scss" scoped>
.v-chart-ring {
	height: 100%;
	position: relative;
}
</style>
