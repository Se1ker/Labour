<template>
	<view class="wf-item-page">
		<image :src="item.cover" mode="widthFix" class="item-img" />
		<view class="item-info">
			<view class="area">{{item.title}}</view>
			<view class="startTxt">活动开始时间</view>
			<view class="date">{{item.actTime.start}}</view>
			<view class="endTxt">活动结束时间</view>
			<view class="date">{{item.actTime.end}}</view>
			<view class="condition">
				<view class="number">人数: {{item.capacity}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				require: true
			}
		},
		onLoad() {
			
		}
	}
</script>

<style lang="scss" scoped>
	.wf-item-page {
		background: #ffffff;
		overflow: hidden;
		border-radius: 15rpx;
		padding: 10rpx;
		font-family: 'KaiTi', 'Times New Roman', Times, serif;
		box-shadow: 0px 0px 2px #d5d5d6;
	}

	.item-img {
		width: 100%;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
	}

	.item-info {
		padding: 5px;
	}

	.area {
		height: 60rpx;
		line-height: 60rpx;
		font-size: 34rpx;
		// background-color: #eee;
		// text-align: center;
		margin-bottom: 10rpx;
		/*强制文字在一行文本框内*/
		white-space: nowrap;
		/*溢出部分文字隐藏*/
		overflow: hidden;
		/*溢出部分省略号处理*/
		text-overflow: ellipsis;
	}

	.startTxt {
		font-size: 28rpx;
		margin-top: 10rpx;
	}

	.endTxt {
		font-size: 28rpx;
	}

	.date {
		height: 40rpx;
		font-size: 25rpx;
		// background-color: #eee;
		// text-align: center;
		color: #C0C0C0;
		margin-bottom: 10rpx;
	}

	.condition {
		color: #696969;
		font-size: 24rpx;
		display: flex;
		justify-content: space-between;
		// padding: 10rpx;
	}
</style>
