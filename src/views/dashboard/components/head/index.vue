<template>
	<div class="head">
		<el-row class="row-1">
			<el-col>
				<el-row>
					<el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
						<div class="left">
							<img
								src="../../../../assets/images/dashboard/head/left/default.png"
								alt
							/>
							<span>店 铺 名 称</span>
						</div>
					</el-col>
					<el-col
						:xs="12"
						:sm="14"
						:md="14"
						:lg="14"
						:xl="16"
						class="content"
					>
						<div>交  易  数  据  大  屏</div>
					</el-col>
					<el-col
						:xs="8"
						:sm="6"
						:md="6"
						:lg="6"
						:xl="4"
						class="right"
					>
						<div class="refresh">
							<img
								src="../../../../assets/images/dashboard/head/right/refresh/default.png"
								alt
							/>
							<span>刷 新</span>
						</div>
						<div class="fullscreen" @click="fullscreen">
							<img
								src="../../../../assets/images/dashboard/head/right/fullscreen/default.png"
								alt
							/>
							<span>全 屏</span>
						</div>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
const Base64 = require("js-base64").Base64;

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
	components: {},
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
		fullscreen() {
			let element = document.documentElement;
			// 判断是否已经是全屏
			// 如果是全屏，退出
			if (document.fullscreen) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			} else {
				// 否则，进入全屏
				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.webkitRequestFullScreen) {
					element.webkitRequestFullScreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.msRequestFullscreen) {
					// IE11
					element.msRequestFullscreen();
				}
			}
		}
	}
};
</script>

<style lang="scss">
.head {
	.row-1 {
		background: url("../../../../assets/images/dashboard/head/bg/default.png")
			no-repeat;
		background-size: cover;
		-webkit-background-size: cover;
		-o-background-size: cover;
		background-position: center 0;
		height: 84px;
		.left {
			margin: 15px 0 0 35px;
			display: flex;
			align-items: center;
			span {
				font-size: 14px;
				font-weight: 500;
				color: rgba(255, 255, 255, 0.8);
				margin-left: 2px;
			}
		}
		.content {
			font-size: 42px;
			color: rgba(255, 255, 255, 1);
			text-align: center;
			padding: 17px 0;
		}

		.right {
			padding: 15px 40px 0 0;
			text-align: right;
			.refresh,
			.fullscreen {
				display: inline-block;
				width: 66px;
				height: 25px;
				background: rgba(71, 225, 255, 0.08);
				border-radius: 2px;
				text-align: center;
				margin: 0 10px 0 0;
				padding: 5px;
				img {
					margin-right: 6px;
				}
				span {
					font-size: 12px;
					color: rgba(255, 255, 255, 0.8);
				}
			}
		}
	}
}
</style>
