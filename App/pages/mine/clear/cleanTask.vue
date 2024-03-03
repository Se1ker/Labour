<template>
	<view class="content">
		<view class="box">
			<view class="now">
				{{taskList.currentWeek}}
			</view>
			<view class="detail">
				院系：{{taskList.detail.acaName}}
			</view>
			<view class="detail">
				教室：{{taskList.detail.buildName}} {{taskList.detail.areaName}}
			</view>
			<view class="detail">
				所属班级：{{taskList.detail.className}}
			</view>
			<view class="allweek">
				<u--text text="需要打扫的周次:"></u--text>
				<view>{{allWeek}}</view>
				<u-toast ref="uToast"></u-toast>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		computed: {
		  taskList() {
		    return this.$store.state.taskList;
		  },
		},
		data(){
			return{
					allWeek:""
				}
		},
		methods:{ 
			
		},
		// created() {
		// 	console.log(this.taskList)
		// 	if (!this.taskList) {
		// 		this.$refs.uToast.show({
		// 			type: 'error',
		// 			message: "请先前往任务选择页面选择任务",
		// 			iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
		// 		})
		// 	}
		// },
		onLoad() {
			console.log(this.taskList)
			if (this.taskList == undefined) {
				uni.showToast({
					title: '请先前往任务选择页面选择日期',
					icon:'none',
					duration: 3000
				});
			}
			this.allWeek = this.taskList.allWeek.join()
		}
	}
</script>
<style lang="scss">
	.box {
		box-sizing: border-box;
		width: 95%;
		border-radius: 20rpx;
		margin: 80rpx 2.5% 20rpx 2.5%;
		box-shadow: 0px 0px 6px #c6c6c6;
		font-family: 'KaiTi', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
	}
	.now{
		font-size: 36rpx;
		height: 100rpx;
		line-height: 100rpx;
		padding: 10rpx 0 16rpx 20rpx;
		border-bottom: 4rpx solid #bbb;
	}
	.detail{
		height: 70rpx;
		line-height: 70rpx;
		padding: 10rpx 0 16rpx 20rpx;
		border-bottom: 4rpx solid #bbb;
	}
	.allweek{
		height: 120rpx;
		line-height: 60rpx;
		padding: 10rpx 0 16rpx 20rpx;
		width: 95%;
	}
	
</style>