<template>
	<view class="content">
		<view class="profile">
			<u--image shape="circle" :src="profileImg" width="150rpx" height="150rpx" class="profileImg"></u--image>
			<view>
				<u--text :text="name" margin="15rpx"></u--text>
				<u--text :text="studentNumber" margin="15rpx"></u--text>
				<u--text :text="academy" margin="15rpx"></u--text>
			</view>
		</view>
		<view @click="chooseTask" class="Task">
			<u--image :src="src[0]" width="37px" height="37px"></u--image>
			<view class="txt">选择任务</view>
		</view>
		<view @click="checkTask" class="Task">
			<u--image :src="src[1]" width="37px" height="37px"></u--image>
			<view class="txt">检查任务</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				profileImg:'/static/1.jfif',
				name:'敲代码',
				studentNumber:'2009101034',
				academy:'电子与信息学院',
				src:[
					"/static/xuanze.png",
					"/static/task.png",
				]
			}
		},
		methods:{
			chooseTask() {
				uni.navigateTo({
					url:"./chooseTask"
				})
			},
			checkTask(){
				uni.navigateTo({
					url:"./checkTask"
				})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		padding: 20rpx;
		font-family: 'KaiTi','Times New Roman', Times, serif;
	}
	.profile{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		padding: 20rpx 40rpx 20rpx 40rpx;
		box-shadow: 0px 0px 8px #d5d5d6;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin-bottom: 100rpx;
		height: 200rpx;
		line-height: 108%;
	}
	.Task{
		display: flex;
		margin-top: 50rpx;
		padding: 15rpx 0 0 50rpx ;
		line-height: 100rpx;
		width: 100%;
		height: 100rpx;
		box-shadow: 0px 0px 8px #d5d5d6;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		box-sizing: border-box;
			.txt{
				margin-left: 30rpx;
			}
	}
</style>
