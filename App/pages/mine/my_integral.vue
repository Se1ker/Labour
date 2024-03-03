<template>
	<view class="content">
		<view class="integral">220</view>
		<view class="integralDetail">
			<u--text text="积分明细"></u--text>
			<view v-for="(item,index) in integralList" :key="index" class="integralList">
					<view>
						<u--text :text="item.area"></u--text>
						<u--text :text="item.date"></u--text>
					</view> 
					<view>{{item.integral}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		computed:{
			integralList(){
				return this.$store.state.integralList;
			}
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style lang="scss">
	.content{
		// padding: 20rpx;
		// height: 600rpx;
		font-family: 'KaiTi','Times New Roman', Times, serif;
	}
	
	.integral {
		padding-top: 20rpx;
		border: 1rpx solid #303133;
		box-sizing: border-box;
		height: 150rpx;
		// display: block;
		width: 100%;
		font-size: 60rpx;
		text-align: center;
		margin-bottom: 40rpx;
	}
	
	.integralDetail{
		margin-top: 20rpx;
	}
	
	.integralList{
		height: 100rpx;
		// width: 700rpx;
		line-height: 50rpx;
		padding: 10rpx 40rpx 5rpx 16rpx;
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
		box-shadow: 0px 0px 8px #d5d5d6;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		
	}
</style>
