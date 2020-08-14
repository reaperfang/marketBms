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

		<component :is="setIcon(icon)" :title="title"></component>
	</div>
</template>

<script>
import list from "../../_mixin/index.js";
import echarts from "echarts";

//icon

import iconuser from "../../../modules/UserAgeMobileMember/icon/user";
import iconmember from "../../../modules/UserAgeMobileMember/icon/member";
import iconmobile from "../../../modules/UserAgeMobileMember/icon/mobile";
import iconagesex from "../../../modules/UserAgeMobileMember/icon/agesex";
export default {
	// props: ["chartData", "chartSettings", "chartExtend"],
	props: ["chartData", "title","icon"],
	mixins: [list],
	data() {
		return {
			chartSettings: {
				// area: false
				radius: [60, 70],
				offsetY: 90
			},
			chartExtend: {}
		};
	},
	components: {
		// iconuser
	},
	methods: {
		setIcon(val) {
			let result = "";
			switch (val) {
				case "0":
					result = iconuser;
					break;
				case "1":
					result = iconmember;
					break;
				case "2":
					result = iconagesex;
					break;
				case "3":
					result = iconmobile;
					break;

				default:
					result=iconuser;
			}

		  return result;
		}
	}
};
</script>

<style lang="scss" scoped>
.v-chart-ring {
	height: 100%;
	position: relative;
}
</style>
