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
			:is="setIcon(icon)"
			:title="title"
			:total="total"
			:sexData="sexData"
		></component>
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
import color from "../../../../../components/Wxcolor/color.js";
export default {
	// props: ["chartData", "chartSettings", "chartExtend"],
	props: ["chartData", "title", "icon", "total", "sexData", "barColor"],
	mixins: [list],
	data() {
		return {
			chartSettings: {
				// area: false
				// itemStyle: {
				// 	normal: {
				// 		//color: "#F59F00",
				// 		label: {
				// 			show: false
				// 		},
				// 		labelLine: {
				// 			show: false
				// 		}
				// 	}
				// },
				//radius: [60, 70],
				radius: [50, 60],
				offsetY: screen.width > 1600 ? 90 : screen.width == 1600 ? 75 : screen.width == 1440 ? 75 : screen.width <= 1366 ? 73 : 75,
				labelLine: {
					normal: {
						length: 5,
						length2: 50,
						lineStyle: {
							type: "solid",
							color: "#FFFFFF"
						}
					}
				},
				label: {
					normal: {
						formatter: params => {
							return "{b| " + params.name + "}  ";
						},
						borderWidth: 0,
						borderRadius: 4,
						padding: [0, -50],
						height: screen.width > 1366 ? 40 : 35,
						fontSize: screen.width > 1366 ? 13 : 12,
						align: "center",
						// color: "#FFFFFF",
						rich: {
							b: {
								fontSize: screen.width > 1366 ? 12 : 9,
								lineHeight: screen.width > 1366 ? 20 : 20,
								color: "#FFFFFF",
								padding: screen.width > 1366 ? [0, 0, 5, 0] : [0, 0, 5, 0],
								//borderRadius: 100
								// padding: [3, 3, 0, -16]
							},
							c: {
								fontSize: 20,
								lineHeight: 20,
								color: "orange"
							}
						}
					}
				}
			},
			chartExtend: {
				//color: ["#026DFF", "#F59F00"],
				color: this.barColor,
				tooltip: {
					formatter: function(params) {
						var dotHtml = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color}"></span>`;
						return `${dotHtml}${params.data.name} <br/>&nbsp&nbsp&nbsp占比: &nbsp${params.percent}%`;
					}
				}
			}
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
					result = iconuser;
			}

			return result;
		}
	},
	mounted() {
		console.log(screen.width)
		if (screen.width == 1440){
			this.chartSettings.radius = [32, 42]
		}else if (screen.width == 1600){
			this.chartSettings.radius = [35, 45]
		} else if (screen.width <= 1366) {
			this.chartSettings.radius = [30, 40]
		} else {
			console.log(screen.width)
		}
		if (window.screen.height < 900) {
			this.chartSettings.radius = [35, 45]
		}
	}
};
</script>

<style lang="scss" scoped>
.v-chart-ring {
	height: 100%;
	position: relative;
}
/* @media screen and (max-width: 1440px) and (max-height: 900px){
	.v-chart-ring /deep/ canvas{
		top: -17px!important;
	}
} */
/* @media screen and (max-width: 1600px) and (max-height: 900px){
	.v-chart-ring /deep/ canvas{
		top: -17px!important;
	}
} */
</style>
