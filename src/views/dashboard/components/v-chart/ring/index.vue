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

		<div class="icon-user">
			<div class="row start">用户</div>
			<div class="row end">5156556</div>
		</div>

		<!-- <component
			:is="isIcon"
			:data="{ key: "test", value: '8445566' }"
		></component> -->
		<!-- <iconuser :data="{ key: "test", value: '8445566' }"></iconuser> -->
	</div>
</template>

<script>
import list from "../../_mixin/index.js";
import echarts from "echarts";

//icon

// import iconuser from "../../../modules/UserAgeMobileMember/icon/user";
export default {
	// props: ["chartData", "chartSettings", "chartExtend"],
	props: ["chartData", "title"],
	mixins: [list],
	data() {
		return {
			chartSettings: {
				// area: false
				radius: [60, 70],
				offsetY: 95
			},
			chartExtend: {
			}
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

	.icon-user {
		position: absolute;
		margin: auto;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		height: 70px;
		width: 70px;
		.start {
			font-size: 12px;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
		}

		.end {
			font-size: 14px;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
		}

		// background: yellow;
	}
}
</style>
