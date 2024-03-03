<template>
	<view class="workBox">
		<!-- 详情弹窗 -->
		<u-overlay :show="showMask">
				<view class="detailBox">
					<!-- <view v-for="(lunbo,index) in detail.images" :key="index">
						<u--image :src="lunbo" mode="aspectFill" @tap="previewImage(index)" :showLoading="true"></u--image>
					</view> -->
					<view class="album">
						<u-album :urls="detail.images" singleSize="312" multipleSize="100" maxCount="3"></u-album>
					</view>
					<view class="detailDesc">
						{{detail.desc}}
					</view>
					<view :class="'detail_status '+ className">
						{{detail.status}}
					</view>
					<view class="detailInfo">
						<view class="detail_address">
							<!-- {{detail.area.name}} -->
						</view>
						<view class="nameAndDte">
							<view class="name">
								检察员: {{detail.checkerName}}
							</view>
							<view class="date">
								{{detail.createdAt}}
							</view>
						</view>
					</view>
					<u-button type="primary" @click="exit" class="detailBtn">确定</u-button>
				</view>
		</u-overlay>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				className: '',
				showMask: false,
				show: false,
                detail: ''
			}
		},
		methods: {
			open(item) {
				this.detail = item
				console.log(this.detail.images?.length);
				this.show = !this.show
				this.showMask = !this.showMask
				
				// this.detail.checkerName = item.checkerName.substring(0, 1) + "**"
				// 对合格情况进行判断
				if (this.detail.status === '不合格') {
					this.className = "unqualified"
				} else if (this.detail.status === '合格') {
					this.className = "qualified"
				} else if (this.detail.status === '预警') {
					this.className = "warnning"
				} else if (this.detail.status === '优秀') {
					this.className = "youxiu"
				}
			},
			click(item) {
				this.index = item.index
			},
            exit() {
				this.show = !this.show
				this.showMask = !this.showMask
			},
		}

	}
</script>
<style lang="scss">
	.workBox {
		margin: 0 auto;
		width: 740rpx;
		height: 1300rpx;
	}

	.detailBox {
		display: flex;
		flex-direction: column;
		// align-items: center;
		// justify-content: center;
		width: 600rpx;
		height: 700rpx;
		background-color: #e0e0e0;
		margin-bottom: 100rpx;
		margin-top: 400rpx;
		margin-left: 8%;
		border-radius: 20rpx;
		position: absolute;
		overflow: hidden;
		// 图片
		.album {
			border-radius: 20rpx 20rpx 0 0;
			width: 100%;
			height: 336rpx;
			margin-bottom: 20rpx;
			overflow: hidden;
		}
		.detailDesc {
		width: 80%;
		height: 100rpx;
		margin: 0 auto;
		margin-bottom: 20rpx;
		color: #303133;
		padding: 10rpx 30rpx;
		overflow: hidden;
		word-break: break-all;
		word-wrap: break-word;
		font-size: 25rpx;
		background-color: #fff;
		border-radius: 20rpx;
		}
		.detailBtn {
		height: 80rpx;
		width: 300rpx;
		position: fixed;
		margin-top: 660rpx;
		margin-left: 0rpx;
		}
		swiper {
			height: 410rpx;
		}
	}

	
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

	

	.detail_status {
		position: absolute;
		text-align: center;
		border-radius: 20rpx;
		line-height: 50rpx;
		width: 100rpx;
		height: 50rpx;

		color: #303133;
		right: 50rpx;
		bottom: 140rpx;
	}
	.detailInfo {
		height: 172rpx;
		width: 100%;
		.detail_address {
			height: 86rpx;
			width: 100%;
		}
		.nameAndDte {
			width: 100%;
			height: 86rpx;
			text-align: right;
			margin-right: 10px;
		}
		.name {
			padding-right: 10px;
			color: #8f8f8f;
		}
		.date {
			padding: 4px 10px 0 0;
			font-size: 10px;
			color: #999999;
		}
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
</style>
