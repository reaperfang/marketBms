<template>
	<div id="templateManage">
		<el-tabs v-model="currentTab" @tab-click="handleClick">
			<el-tab-pane label="首页模板" name="homeTemplate"></el-tab-pane>
			<el-tab-pane label="活动页模板" name="activeTemplate"></el-tab-pane>
			<el-tab-pane label="我的模板" name="myTemplate"></el-tab-pane>
			<div class="template-search" v-if="currentTab !== 'myTemplate' ">
				<el-button class="template-search-reset" @click="resetAndFetch">重 &nbsp;&nbsp; 置</el-button>
				<el-button type="primary" class="template-search-search" @click="fetchList">查 &nbsp;&nbsp; 询</el-button>
			</div>
		</el-tabs>
		<component :is="currentTab" ref="templateChild"></component>
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
		created() {
		  if(this.$route.query.tab) this.currentTab = this.$route.query.tab;
    },
		methods: {
			handleClick(comp) {
				this.currentTab = comp.name;
			},
			resetAndFetch() {
				this.$refs.templateChild.resetfetch();
			},
			fetchList() {
				this.$refs.templateChild.query();
			}
		}
	};
</script>

<style lang="scss" scoped>
  .el-tabs {
    padding: 0 20px;
    position: relative;
    background: #fff;
  }
  /deep/ .el-tabs__header {
    margin: 0 0 5px;
  }
  /deep/ .el-tabs__item {
    height: 60px;
    line-height: 60px;
  }

	/deep/ .el-tabs__content {
		position: static;
	}
	.template-search {
    position: absolute;
    z-index: 100;
    top: 13px;
    right: 20px;

    &-search {
      width: 80px;
      height: 34px;
      border-radius: 4px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(255, 255, 255, 1);
    }

    &-reset {
      width: 80px;
      height: 34px;
      border-radius: 4px;
      border: 1px solid rgba(101, 94, 255, 1);
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(101, 94, 255, 1);
      background: rgba(255, 255, 255, 1);
    }
	}
</style>
