<template>
	<div class="icon-agesex">
		<div class="top">
			<img
				src="../../../../../assets/images/dashboard/person/men.png"
				alt=""
			/>
			<span>{{ sexData && sexData.gender }}%</span>
		</div>
		<div class="top">
			<img
				src="../../../../../assets/images/dashboard/person/women.png"
				alt=""
			/>
			<span>{{ sexData && sexData.female }}%</span>
		</div>
		<!--<div class="start">
			<img
				src="../../../../../assets/images/dashboard/person/men.png"
				alt=""
			/>
			<img
				src="../../../../../assets/images/dashboard/person/women.png"
				alt=""
			/>
		</div>
		<div class="end">
			<span>{{ sexData && sexData.gender }}%</span>
			<span>{{ sexData && sexData.female }}%</span>
		</div>-->
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
	props: ["title", "sexData"],
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
.icon-agesex {
	position: absolute;
	margin: auto;
	top: 10px;
	left: 0;
	bottom: 0;
	right: 0;
	height: 70px;
	width: 100px;
	text-align: center;
	img {
		height: 24px;
		margin: 0 5px;
	}
	.top{
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		margin-top: 5px;
		span {
			font-size: 12px;
			font-weight: 400;
			color: #ffffff;
			line-height: 17px;
			margin: 5px 3px 0 3px;
		}
	}
	/*.end {
		display: flex;
		span {
			font-size: 12px;
			font-weight: 400;
			color: #ffffff;
			line-height: 17px;
			margin: 0 3px;
		}

		&:nth-child(1) {
			padding-left: 5px;
		}

		&:nth-child(2) {
			padding-left: 5px;
		}
	}*/
}

@media screen and(max-width: 1600px){
	.icon-agesex {
		margin-top: 34px;
		.top {
			img {
				width: 10px;
				height: 20px;
				margin-left: 10px;
			}
			>span {
				font-size: 12px;
				transform: scale(0.92);
				margin-left: -5px;
			}
		}
	}
}

@media screen and(max-width: 1440px){
	.icon-agesex {
		margin-top: 35px;
		.top {
			img {
				width: 10px;
				height: 20px;
				margin-left: 10px;
			}
			>span {
				font-size: 12px;
				transform: scale(0.83);
				margin-left: -7px;
			}
		}
	}
}
@media screen and (max-width: 1366px) and (max-height: 768px){
	.icon-agesex {
		margin-top: 32px;
	}
}
@media screen and (max-width: 1280px) and (max-height: 800px){
	.icon-agesex {
		margin-top: 32px;
	}
}
</style>
