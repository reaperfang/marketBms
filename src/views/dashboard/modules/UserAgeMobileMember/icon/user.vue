<template>
	<div class="icon-user">
		<div class="row start">
			<span>总用户(人)</span>
		</div>
		<div class="row end">
			<span>{{ total }}</span>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
	watch: {
		// flowData(val) {
		// }
	},
	// props: {
	// 	data: {
	// 		type: Object,
	// 		default: false
	// 	}
	// },
	props: ["title", "total"],
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
.icon-user {
	position: absolute;
	margin: auto;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	// height: 70px;
	height: 55px;
	width: 100px;
	.start,
	.end {
		display: flex;
		justify-content: center;
	}

	.start {
		font-size: 12px;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		margin-top: 5px;
	}

	.end {
		font-size: 24px;
		font-weight: 600;
		color: rgba(255, 255, 255, 1);
		line-height: 33px;
		margin-top: 5px;
	}

	// background: yellow;
}

@media screen and(max-width: 1600px){
	.icon-user {
		margin-top: 50px;
		.end {
			margin-top: -2px;
		}
	}
}

@media screen and(max-width: 1440px){
	.icon-user {
		margin-top: 48px;
		.start {
			font-size: 12px;
			transform: scale(0.83);
			margin-top: 10px;
		}
		.end {
			font-size: 17px;
			line-height: 24px;
			margin-top: 0;
		}
	}
}
@media screen and (max-width: 1366px) and (max-height: 768px){
	.icon-user {
		margin-top: 45px;
	}
}
@media screen and (max-width: 1280px) and (max-height: 800px){
	.icon-user {
		margin-top: 45px;
	}
}
</style>
