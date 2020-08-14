<template>
	<div class="icon-agesex">
		<div class="row start">年龄性别</div>
		<div class="row end">5156556</div>
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
	props:["title"],
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
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	height: 70px;
	width: 100px;
	.start,
	.end {
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		display: flex;
		justify-content: center;
	}

	.start {
		font-size: 14px;
	}

	.end {
		font-size: 20px;
		margin-top: 10px;
	}

	// background: yellow;
}
</style>
