<template>
	<view class="content">
		<view class="rate">
			<u--text text="100%" size="24"></u--text>
			<u--text text="正常参与活动2次 未签到0次" size="12"></u--text>
		</view>
		<view>诚信度明细</view>
		<view v-for="(item,index) in integralRateList" :key="index" class="integralRateList">
			<view>
				<view>{{item.area}}</view>
				<view>{{item.date}}</view>
			</view>
			<view>{{item.status}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		computed:{
			integralRateList(){
				return this.$store.state.integralRateList;
			}
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style>
	.content{
		font-family: 'KaiTi','Times New Roman', Times, serif;
	}
	.rate{
		height: 200rpx;
		margin-bottom: 40rpx;
		border: 1rpx solid #000000;
		line-height: 80rpx;
		box-sizing: border-box;
		padding: 10rpx;
	}
	.integralRateList{
		height: 100rpx;
		line-height: 50rpx;
		padding: 5rpx 40rpx 5rpx 16rpx;
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
		box-shadow: 0px 0px 8px #d5d5d6;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
	}
</style>
