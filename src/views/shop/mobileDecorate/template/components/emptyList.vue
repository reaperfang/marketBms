<template>
	<div class="empty-list">
		<img src="@/assets/images/shop/noSearchImg.png"/>
		<span>{{'您搜索的行业内当前没有可使用的模版，请您换个行业再次搜索！'}}</span>
	</div>
</template>

<script>
    export default {
        name: "emptyList"
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
