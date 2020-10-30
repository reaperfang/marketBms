<template>
	<div class="icon-pie-t">
		<p class="p-start">{{ progress }}%</p>
		<p class="p-end">{{ city }}</p>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
	watch: {
		// flowData(val) {
		// }
	},
	props: ["progress", "city"],
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
	}
};
</script>

<style lang="scss">
.icon-pie-t {
	position: absolute;
	margin: auto;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	height: 53px;
	width: 100px;
	text-align: center;
	.p-start {
		font-size: 24px;
		font-weight: 600;
		color: rgba(255, 255, 255, 1);
		line-height: 35px;
		// padding: 3px 0;
	}

	.p-end {
		font-size: 14px;
		font-weight: 400;
		color: #ffffff;
		line-height: 20px;
	}
}
@media screen and (max-width: 1600px) and (max-height: 900px) {
	.icon-pie-t {
		position: absolute;
		margin: auto;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		height: 40px;
		width: 100px;
		text-align: center;
		.p-start {
			font-size: 20px;
			font-weight: 600;
			color: rgba(255, 255, 255, 1);
			line-height: 35px;
			// padding: 3px 0;
		}

		.p-end {
			font-size: 14px;
			font-weight: 400;
			color: #ffffff;
			line-height: 20px;
		}
	}
}
@media screen and (max-width: 1440px) and (max-height: 900px) {
	.icon-pie-t {
		position: absolute;
		margin: auto;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		height: 40px;
		width: 100px;
		text-align: center;
		.p-start {
			font-size: 18px;
			font-weight: 600;
			color: rgba(255, 255, 255, 1);
			line-height: 35px;
			// padding: 3px 0;
		}

		.p-end {
			font-size: 12px;
			font-weight: 400;
			color: #ffffff;
			line-height: 20px;
		}
	}
}
@media screen and (max-width: 1366px) and (max-height: 768px){
	.icon-pie-t {
		height: 54px;
		.p-start {
			font-size: 17px;
		}
	}
}
@media screen and (max-width: 1280px) and (max-height: 800px){
	.icon-pie-t {
		height: 54px;
		.p-start {
			font-size: 17px;
		}
	}
}
</style>
