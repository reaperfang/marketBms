<template>
	<div class="empty-list">
		<img src="@/assets/images/shop/noSearchImg.png"/>
		<span>{{tipText}}</span>
	</div>
</template>

<script>
    export default {
        name: "emptyList",
		props: {
			tipText: {
				type: String,
				default () {
					return '当前搜索无结果，请您重新搜索！'
				}
			}
		}
    }
</script>

<style scoped lang="scss">
.empty-list {
	width: 100%;
	background: #ffffff;
	height: 592px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	img {
		width: 302px;
		height: 236px;
	}
	span {
		margin-top: 40px;
		height:20px;
		font-size:14px;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color:rgba(136,136,136,1);
		line-height:20px;
	}
}
</style>
