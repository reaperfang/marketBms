<template>
	<div class="icon-pie">
		<p class="p-end">{{ city }}</p>
		<p class="p-start">{{ progress }}%</p>
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
.icon-pie {
	position: absolute;
	margin: auto;
	top: -15px;
	left: 0;
	bottom: 0;
	right: 0;
	height: 50px;
	width: 100px;
	text-align: center;
	.p-start {
		font-size: 24px;
		font-weight: 600;
		color: rgba(255, 255, 255, 1);
		line-height: 35px;
	}

	.p-end {
		font-size: 12px;
		font-weight: 400;
		color: #ffffff;
		line-height: 20px;
		// margin-bottom: 3px;
		padding-top: 5px;
	}
}
@media screen and (max-width: 1600px) and (max-height: 900px) {
	.icon-pie {
		position: absolute;
		margin: auto;
		top: -15px;
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
			line-height: 28px;
		}

		.p-end {
			font-size: 12px;
			font-weight: 400;
			color: #ffffff;
			line-height: 20px;
			// margin-bottom: 3px;
			padding-top: 5px;
		}
	}
}
@media screen and (max-width: 1440px) and (max-height: 900px) {
	.icon-pie {
		position: absolute;
		margin: auto;
		top: -15px;
		left: 0;
		bottom: 0;
		right: 0;
		height: 40px;
		width: 100px;
		text-align: center;
		.p-start {
			font-size: 15px;
			font-weight: 600;
			color: rgba(255, 255, 255, 1);
			line-height: 21px;
		}

		.p-end {
			font-size: 12px;
			font-weight: 400;
			color: #ffffff;
			line-height: 20px;
			// margin-bottom: 3px;
			padding-top: 5px;
		}
	}
}
@media screen and (max-width: 1366px) and (max-height: 768px){
	.icon-pie {
		.p-start {
			font-size: 14px;
		}
		.p-end {
			font-size: 12px;
			transform:scale(0.9)
		}
	}
}
@media screen and (max-width: 1280px) and (max-height: 800px){
	.icon-pie {
		.p-start {
			font-size: 14px;
		}
		.p-end {
			font-size: 12px;
			transform:scale(0.9)
		}
	}
}
</style>
