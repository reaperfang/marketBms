<template>
	<div class="v-chart-funnel">
		<ve-funnel
			:data="chartData"
			:settings="chartSettings"
			:extend="chartExtend"
			v-bind="pubSetting"
			:tooltip-visible="true"
			:legend-visible="false"
		></ve-funnel>
	</div>
</template>

<script>
import list from "../../_mixin/index.js";
import echarts from "echarts";
export default {
	props: ["chartData", "chartSettings", "chartExtend"],
	mixins: [list],
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
.v-chart-funnel {
	height: 100%;
	// background: yellow;
}
</style>
