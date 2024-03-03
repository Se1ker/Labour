<template>
	<view>
		<!-- 活动栏 -->
		<view class="workCell" @click="detail(item)" v-for="(item, index) in checkList" :key="index">
			<view class="address">
				{{item.area.name}}
			</view>
			<view class="status">
				{{item.status}}
			</view>
		</view>
        <popup ref="popupChild"></popup>
	</view>
</template>

<script>
	import popup from './popup.vue'
	export default {
        components: {
			popup
		},
		data() {
			return {
            }
		},
		computed: {
			checkList() {
				return this.$store.state.checkList
			}
		},
		methods: {
			detail(itemDetail) {
                this.$refs.popupChild.open(itemDetail);
			}
		},
		// 数据更新后调用
		updated() {console.log("123");
			uni.hideLoading();
		}
	}
</script>

<style lang="scss">
	// 活动栏
	.active {
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		width: 86%;
		height: 300rpx;
		margin: 20px 7% 0 7%;
		border-radius: 20rpx;
		box-shadow: 0px 0px 8px #d5d5d6;
	}

    .workBox {
		margin: 0 auto;
		width: 740rpx;
		height: 1300rpx;
	}

	.btnBox {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.btnBox1 {
		width: 150rpx;
	}

	.btnBox2 {
		width: 150rpx;
		margin-right: 60rpx;
	}

	.workCell {
		width: 680rpx;
		height: 100rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		background-color: #9292ff;
		border-radius: 25rpx;
		position: relative;
		color: white;
		box-shadow: 2rpx 2rpx 0rpx 1rpx #e4e4e4;
	}

	.status {
		position: absolute;
		right: 30rpx;
		top: 30rpx;
		font-size: 34rpx;
		font-weight: 600;
	}

	.address {
		position: absolute;
		top: 30rpx;
		left: 50rpx;
		font-size: 36rpx;
		font-weight: 600;
		width: 206rpx;
		height: 80rpx;
		text-overflow: ellipsis; //文字隐藏后添加省略号
		overflow: hidden;
		white-space: nowrap;
	}
</style>
