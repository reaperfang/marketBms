<template>
	<div class="head">
		<div class="left-box">
			<svg-icon iconClass="shop"></svg-icon>
			<span>{{ shopName }}</span>
			<svg-icon iconClass="time"></svg-icon>
			<span> {{ currentTime }}</span>
		</div>
		<el-row class="row-1">
			<el-col>
				<el-row>
					<el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
						<div class="left">
							<!-- <svg-icon iconClass="shop"></svg-icon>
							<span>{{ shopName }}</span>
							<svg-icon iconClass="time"></svg-icon>
							<span> {{ currentTime }}</span> -->
						</div>
					</el-col>
					<el-col
						:xs="11"
						:sm="13"
						:md="13"
						:lg="13"
						:xl="15"
						class="content"
					>
						<div>交 易 数 据 大 屏</div>
					</el-col>
					<el-col
						:xs="8"
						:sm="6"
						:md="6"
						:lg="6"
						:xl="4"
						class="right"
					>
						<div class="refresh" @click="refresh">
							<svg-icon iconClass="refresh"></svg-icon>
							<span>刷 新</span>
						</div>
						<div
							class="fullscreen"
							@click="fullscreen"
							ref="fullscreen"
						>
							<svg-icon iconClass="fullscreen"></svg-icon>
							<!-- <span>全 屏</span> -->
							<span>{{
								!this.fullscreenState ? "全 屏" : "退 出"
							}}</span>
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
		return {
			shopName: JSON.parse(localStorage.getItem("shopInfos")).shopName,
			timer: "", //定义一个定时器的变量
			currentTime: new Date(), // 获取当前时间
			fullscreenState: false
		};
	},
	computed: {
		//...mapState([""])
	},
	mounted() {
		var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
		this.timer = setInterval(function() {
			_this.currentTime = //修改数据date
				new Date().getFullYear() +
				"年" +
				(new Date().getMonth() + 1) +
				"月" +
				new Date().getDate() +
				"日 " +
				new Date().getHours() +
				":" +
				new Date().getMinutes() +
				":" +
				new Date().getSeconds();
		}, 1000);

		window.addEventListener("keydown", e => {
			if (e && e.keyCode == 122) {
				this.modifyfullscreenState();
			}
		});

		// window.addEventListener("fullscreenchange", e => {
		// 	if (e && e.keyCode == 122) {
		// 		this.modifyfullscreenState();
		// 	}
		// });
	},
	beforeCreate() {
		if (this.timer) {
			clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
		}
	},
	created() {},
	beforeMount() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed: function() {},
	methods: {
		//...mapActions([""]),
		modifyfullscreenState() {
			this.fullscreenState = !this.fullscreenState;
		},
		fullscreen() {
			// this.$toast({
			// 	message:
			// 		"全屏或退出全屏操作 windows 使用F11  mac 使用 Command+Control+F",
			// 	position: "top"
			// });
			// this.$toast({
			// 	message:
			// 		"快捷键全屏或退出全屏操作\n windows F11 \n mac Command+Control+F",
			// 	position: "top"
			// });
			//this.$message("F11 全屏或退出全屏");
			// this.$message({
			// 	dangerouslyUseHTMLString: true,
			// 	message:
			// 		"<strong>windows 用户 F11 全屏或退出全屏操作</strong><br><br>" +
			// 		"<strong>mac 用户 F11 全屏或退出全屏操作</strong>",
			// 	center: true
			// });
			// return;
			var isInFullScreen =
				(document.fullscreenElement &&
					document.fullscreenElement !== null) ||
				(document.webkitFullscreenElement &&
					document.webkitFullscreenElement !== null) ||
				(document.mozFullScreenElement &&
					document.mozFullScreenElement !== null) ||
				(document.msFullscreenElement &&
					document.msFullscreenElement !== null);
			var docElm = document.documentElement;
			if (!isInFullScreen) {
				if (docElm.requestFullscreen) {
					docElm.requestFullscreen();
				} else if (docElm.mozRequestFullScreen) {
					docElm.mozRequestFullScreen();
				} else if (docElm.webkitRequestFullScreen) {
					docElm.webkitRequestFullScreen();
				} else if (docElm.msRequestFullscreen) {
					docElm.msRequestFullscreen();
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}

			this.modifyfullscreenState();
		},
		refresh() {
			window.location.reload();
		}
	}
};
</script>

<style lang="scss">
.head {
	position: relative;
	height: 80px;

	.left-box {
		position: absolute;
		margin: 15px 0 0 35px;
		display: flex;
		align-items: center;
		span {
			font-size: 14px;
			font-weight: 500;
			color: rgba(255, 255, 255, 0.8);
			margin-right: 5px;
		}
	}

	.row-1 {
		background: url("../../../../assets/images/dashboard/head/bg/default.png")
			no-repeat;
		background-size: cover;
		-webkit-background-size: cover;
		-o-background-size: cover;
		background-position: center 0;
		height: 100%;
		.left {
			margin: 15px 0 0 35px;
			display: flex;
			align-items: center;
			span {
				font-size: 14px;
				font-weight: 500;
				color: rgba(255, 255, 255, 0.8);
				margin-right: 5px;
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
				width: 75px;
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
				cursor: pointer;
			}
		}
	}
}
</style>
