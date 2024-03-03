<template>
	<view class="workBox">
		<!-- tabs标签 -->
		<u-tabs :list="list" @click="click" :scrollable="false" lineColor="#353535" lineWidth="50" lineHeight="1">
		</u-tabs>
		<!-- 活动栏 -->
		<all v-if="index == 0"></all>
		<good v-if="index == 1"></good>
		<qualified v-if="index == 2"></qualified>
		<warn v-if="index == 3"></warn>
		<unqualified v-if="index == 4"></unqualified>
	</view>
</template>
<script>
	import all from './detail/all.vue'
	import good from './detail/good.vue'
	import qualified from './detail/qualified.vue'
	import warn from './detail/warn.vue'
	import unqualified from './detail/unqualified.vue'
	export default {
		components: {
			all,
			good,
			qualified,
			warn,
			unqualified
		},
		data() {
			return {
				// status: 'loadmore',
				token: '',
				className: '',
				showMask: false,
				show: false,
				detail: '',
				list: [{
					name: '全部',
				}, {
					name: '优秀',
				}, {
					name: '合格'
				}, {
					name: '预警'
				}, {
					name: '不合格'
				}],
				index: "0"
			}
		},
		computed: {
			checkList() {
				return this.$store.state.checkList
			}
		},
		onLoad() {
			// console.log(this.checkList)
			// console.log(this.checkList[0].area.name)
		},
		methods: {
			// 点击按钮退出详情页
			exit() {
				this.show = !this.show
				this.showMask = !this.showMask
			},
			click(item) {
				this.index = item.index
			}
		},
		created() {
			// uni.showLoading({
			// 	title: '加载中'
			// });
		},
		// onPullDownRefresh: function() {
		// 	// let that = this
		// 	// this.huoqu();
		// 	setTimeout(function() {
		// 		uni.stopPullDownRefresh();
		// 		uni.showToast({
		// 			title: "刷新完成",
		// 			duration: 1000
		// 		})
		// 	}, 1000);
		// },

	}
</script>
<style lang="scss">
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
		background-color: #f4f4f5;
		border-radius: 25rpx;
		position: relative;
		box-shadow: 10rpx 10rpx 10rpx 1rpx #ccc;
	}

	.status {
		position: absolute;
		right: 30rpx;
		top: 30rpx;
	}

	.aca {
		position: absolute;
		top: 30rpx;
		left: 20rpx;
	}

	.address {
		position: absolute;
		top: 30rpx;
		left: 50rpx;
		font-size: 28rpx;
		width: 206rpx;
		height: 80rpx;
		text-overflow: ellipsis; //文字隐藏后添加省略号
		overflow: hidden;
		white-space: nowrap;
	}

	.detailBox {
		display: flex;
		align-items: center;
		// justify-content: center;
		width: 600rpx;
		height: 830rpx;
		background-color: #f4f4f5;
		margin: 240rpx auto;
		margin-left: 8%;
		border-radius: 20rpx;
		position: absolute;

		// top: -1000rpx;
		swiper {
			height: 410rpx;
		}
	}

	.detailBtn {
		height: 80rpx;
		width: 300rpx;
		position: fixed;
		margin-top: 860rpx;
		margin-left: 145rpx;
	}

	// .image{
	// 	height: 400rpx;
	// 	display: inline-block;
	// }
	uni-swiper {
		height: 300rpx !important;

		.swiper-item {
			margin-top: 20rpx;
		}

		image {
			margin-left: 30rpx;
			width: 90%;
			height: 240rpx;
		}
	}

	.detailDesc {
		width: 550rpx;
		height: 150rpx;
		margin: 110rpx 15rpx 0rpx 15rpx;
		color: #303133;
		padding: 10rpx 30rpx;
		overflow: hidden;
		word-break: break-all;
		word-wrap: break-word;
		font-size: 25rpx;
		background-color: #c8c9cc;
		border-radius: 20rpx;
	}

	.detail_status {
		position: absolute;
		text-align: center;
		border-radius: 20rpx;
		line-height: 50rpx;
		width: 100rpx;
		height: 50rpx;

		color: #303133;
		right: 50rpx;
		bottom: 160rpx;
	}

	.unqualified {
		background-color: #dd6161;
	}

	.warnning {
		background-color: #ff9900;
	}

	.qualified {
		background-color: #19be6b;
	}

	.youxiu {
		background-color: #002fa7;
		color: #ffffff;
	}

	// .detailInfo {
	// 	position: absolute;
	// 	bottom: 10rpx;
	// 	right: 10rpx;
	// 	color: #909399;
	// 	width: 300rpx;
	// 	height: 200rpx;

	// 	.date {
	// 		font-size: 20rpx;
	// 		margin-top: 10rpx;
	// 		margin-left: 130rpx;
	// 	}

	// 	.name {
	// 		margin-top: -10rpx;
	// 		margin-left: 100rpx;
	// 		font-size: 1em;
	// 	}

	// 	.detail_address {
	// 		word-break: break-all;
	// 		word-wrap: break-word;
	// 		overflow: hidden;
	// 		width: 250rpx;
	// 		height: 80rpx;
	// 		margin-left: -250rpx;
	// 		margin-top: 20rpx;
	// 		color: #606266;
	// 	}
	// }
</style>
