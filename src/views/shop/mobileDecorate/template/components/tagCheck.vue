<template>
    <div class="tag-check">
		<div class="tag-check-item" @click="handleSelectAll" :style="{backgroundColor: checkedItems.length ===  checkItems.length ? '#1890FF' : '#ffffff', color: checkedItems.length ===  checkItems.length ? '#ffffff' : 'rgba(0,0,0,0.65)'}">
			全部
		</div>
		<div class="tag-check-item" @click="handleSelectItems(item)" v-for="(item, index) of checkItems" :key="index + 'checkItems'" :style="{backgroundColor: checkedItems.indexOf(item) > -1 ? '#1890FF' : '#ffffff', color: checkedItems.indexOf(item) > -1 ? '#ffffff' : 'rgba(0,0,0,0.65)'}">
			{{item}}
		</div>
	</div>
</template>

<script>
    export default {
        name: "tagCheck",
		props: {
			checkItems: {
				type: Array,
				default () {
					return []
				}
			},
			checkedItems: {
				type: Array,
				default () {
					return []
				}
			}
		},
		methods: {
			handleSelectItems(val) {
				this.$emit("handleSelectItems", val);
			},
			handleSelectAll() {
				this.$emit("handleSelectAll");
			}
		}
    }
</script>

<style scoped lang="scss">
.tag-check {
    width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: start;
	align-items: start;
	flex-flow:row wrap;
	&-item {
		padding-left: 10px;
		padding-right: 10px;
		margin-right: 16px;
		border-radius:4px;
		margin-top: 16px;
		font-size:13px;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
	}
}
</style>
