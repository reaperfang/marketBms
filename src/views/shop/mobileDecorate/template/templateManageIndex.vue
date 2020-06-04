<template>
	<div>
		<el-tabs v-model="currentTab" @tab-click="handleClick">
			<el-tab-pane label="首页模板" name="homeTemplate"></el-tab-pane>
			<el-tab-pane label="活动模板" name="activeTemplate"></el-tab-pane>
			<el-tab-pane label="我的模板" name="myTemplate"></el-tab-pane>
			<div class="template-search" v-if="currentTab !== 'myTemplate' ">
				<el-button size="small" class="template-search-reset">重置</el-button>
				<el-button size="small" class="template-search-search">查询</el-button>
			</div>
		</el-tabs>
		<component :is="currentTab"></component>
	</div>
</template>

<script>
	import myTemplate from "./myTemplate";
	import homeTemplate from "./homeTemplate";
	import activeTemplate from "./activeTemplate";
	export default {
		name: "pageManageIndex",
		components: { myTemplate, homeTemplate, activeTemplate},
		data() {
			return {
				currentTab: "homeTemplate"
			};
		},
		created() {},
		methods: {
			handleClick(comp) {
				this.currentTab = comp.name;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.el-tabs {
		background: #fff;
		padding: 20px;
		position: relative;
	}
	/deep/ .el-tabs__content {
		position: static;
	}
	.template-search {
		position: absolute;
		z-index: 100;
		top: 20px;
		right: 20px;
		&-search {
			height:34px;
			background:rgba(101,94,255,1);
			border:1px solid rgba(101,94,255,1);
			border-radius:4px;
			font-size:14px;
			font-family:MicrosoftYaHei;
			color:rgba(255,255,255,1);
			line-height:19px;
			padding: 0 15px 0 15px;
		}
		&-reset {
			height:34px;
			border-radius:4px;
			border:1px solid rgba(101,94,255,1);
			font-size:14px;
			font-family:MicrosoftYaHei;
			color:rgba(101,94,255,1);
			padding: 0 15px 0 15px;
			background:rgba(255,255,255,1);
		}
	}
</style>
