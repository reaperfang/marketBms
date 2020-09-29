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
				offsetY: 90,
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
						height: 50,
						fontSize: 13,
						align: "center",
						// color: "#FFFFFF",
						rich: {
							b: {
								fontSize: 12,
								lineHeight: 20,
								color: "#FFFFFF",
								padding: [0, 0, 5, 0]
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
	}
};
</script>

<style lang="scss" scoped>
.v-chart-ring {
	height: 100%;
	position: relative;
}
</style>
