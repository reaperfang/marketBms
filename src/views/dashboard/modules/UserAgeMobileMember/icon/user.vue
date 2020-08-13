<template>
	<div class="icon-user">
		<div class="row start">{{title}}</div>
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
.icon-user {
	position: absolute;
	margin: auto;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	height: 70px;
	width: 70px;
	.start {
		font-size: 12px;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
	}

	.end {
		font-size: 14px;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
	}

	// background: yellow;
}
</style>
