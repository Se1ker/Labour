<template>
	<view class="content">
		<view class="top">
			<view class="head" @click="modifyImg">
				<u--image :src="userInfo.avatar" shape="circle" height="80" width="80"></u--image>
			</view>
			<view class="name">
				<view id="college">{{ userInfo.academyName }}</view>
				<view id="name">{{ userInfo.nickname }}</view>
			</view>
		</view>
		<view class="middle">
			<view class="tiele">
				<view class="front">总统计数据</view>
				<view class="behind">打扫历史 &gt;</view>
			</view>
			<view class="box">
				<view class="minBox">
					学期目标(次)
					<br />
					{{ info.termGoal }}
				</view>
				<view class="minBox">
					已完成(次)
					<br />
					{{ info.completed }}
				</view>
			</view>
		</view>
		<view class="last">
			<view class="circle" @click="volunteer(2)">
				<view class="img">
					<u--image :src="src[1]" width="50px" height="50px"></u--image>
				</view>打扫签到
			</view>
			<view class="circle" @click="volunteer(1)">
				<view class="img_special">
					<u--image :src="src[0]" width="40px" height="40px"></u--image>
				</view>卫生检查
			</view>
			<view class="circle" @click="volunteer(3)">
				<view class="img_special">
					<u--image :src="src[2]" width="40px" height="40px"></u--image>
				</view>志愿活动
			</view>
			<view class="circle" @click="volunteer(4)">
				<view class="img">
					<u--image :src="src[3]" width="50px" height="50px"></u--image>
				</view>积分排行
			</view>
			<view class="circle" @click="volunteer(5)">
				<view class="img_special">
					<u--image :src="src[4]" width="40px" height="40px"></u--image>
				</view>活动创建
			</view>
			<view class="circle" @click="volunteer(7)">
				<view class="img_special">
					<u--image :src="src[5]" width="50px" height="50px"></u--image>
				</view>失物/寻物
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	computed: {
		userInfo() {
			return this.$store.state.userInfo
		}
	},
	data() {
		return {
			src: [ // 图标
				'/static/releaseTask.png',
				'/static/signIn.png',
				'/static/voluntaryActivity.png',
				'/static/rankingIist.png',
				'/static/releaseActivity.png',
				'/static/lostFound.png'
			],
			info: { // 总统计数据
				termGoal: '10',
				completed: '10',
				number: '120'
			},
			rankingList: []//积分排行列表
		}
	},

	methods: {
		// 页面跳转
		volunteer(key) {
			console.log(key)
			switch (key) {
				case 1:
					uni.navigateTo({
						url: './releaseCheck'
					})
					break;
				case 2:
					uni.navigateTo({
						url: './signDesk'
					})
					break;
				case 3:
					this.listJoinActivity();
					uni.navigateTo({
						url: './volunteer'
					})
					break;
				case 4:
					this.getScoreSort()
					break;
				case 5:
					uni.navigateTo({
						url: './createActivities'
					})
					break;
				case 6:
				console.log(123)
					uni.navigateTo({
						url: '../index/createActivity'
					})
					break;
				case 7:
					uni.navigateTo({
						url: '../index/lostAndFound/lostAndFound'
					})
					break;
				default:
					break;
			}

		},
		modifyImg() {
			let that = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: function (res) {
					console.log(res.tempFilePaths[0]);
					uni.uploadFile({
						url: "http://175.27.247.87:8081/api/v1/modifyUserInfo",
						filePath: res.tempFilePaths[0],
						name: "img",
						header: {
							'authorization': "Bearer " + uni.getStorageSync('token')
						},
						success: (res) => {
							let data = JSON.parse(res.data)
							if (res.statusCode == 200) {
								// 修改头像并提示成功
								that.userInfo.avatar = data.data.avatar
								that.$refs.uToast.show({
									type: 'success',
									message: data.msg,
									iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
								})
							} else {
								that.$refs.uToast.show({
									type: 'error',
									message: "修改失败",
									iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
								})
							}
						}
					})
				}
			});
		},
		listJoinActivity() {
			this.$request({
				url: '/listJoinActivity',
			}).then(res => {
				let tasklist = this.listGroup(res.data.data)
				this.$store.commit('listJoinActivity', tasklist);
				// console.log("已上传")
				uni.hideLoading();
			})
		},
		listGroup(listJoinActivity) {
			let tasklist = []
			for (let index = 0; index < listJoinActivity.length; index++) {
				let actTimeStart = uni.$u.timeFormat(listJoinActivity[index].actTime.start, 'yyyy.mm.dd hh:MM')
				let actTimeEnd = uni.$u.timeFormat(listJoinActivity[index].actTime.end, 'yyyy.mm.dd hh:MM')
				tasklist[index] = {
					id: listJoinActivity[index]._id,
					title: listJoinActivity[index].title,
					cover: listJoinActivity[index].cover,
					location: listJoinActivity[index].location,
					capacity: listJoinActivity[index].capacity,
					actTime: actTimeStart + '-' + actTimeEnd
				}
				var nowTime = new Date().getTime()
				var actTimeS = new Date(actTimeStart).getTime();
				var actTimeE = new Date(actTimeEnd).getTime();
				// 如果已完结，退出本次循环
				if (listJoinActivity[index].isDone === true) {
					tasklist[index].state = "已完结"
					continue
				}
				// 判断活动状态
				if (actTimeS > nowTime) {
					tasklist[index].state = "未开始"
				} else if (actTimeE < nowTime) {
					tasklist[index].state = "已结束"
				} else {
					tasklist[index].state = "进行中"
				}
			}
			return tasklist
		},
		//获取积分排行列表
		getScoreSort() {
			this.$request({
				url: '/scoreSort'
			}).then((res) => {
				this.rankingList = res.data.data
				this.$store.commit('rankingList', this.rankingList);
				uni.navigateTo({
					url: "../index/rankingList"
				})
			})
		},
	}
}
</script>

<style lang="scss">
.content {
	font-family: "Microsoft YaHei", "Gill Sans MT", Calibri, "Trebuchet MS",
		sans-serif;
	height: 100vh;
	padding-top: 20rpx;
	background-color: #ededed91;
	// 个人信息模块
	.top {
		display: flex;
		width: 94%;
		height: 240rpx;
		margin: 20rpx 3%;
		margin-top: 0;
		border-radius: 20rpx;
		background-color: #fff;
		box-shadow: 0px 0px 4px 2px #e2e2e5;
		.head {
			box-sizing: border-box;
			height: 200rpx;
			width: 200rpx;
			padding: 44rpx;
		}

		.name {
			display: flex;
			width: 100%;
			height: 100%;
			flex-direction: column-reverse;
			#name,
			#college {
				width: 100%;
				height: 100rpx;
				line-height: 70rpx;
				padding-left: 40rpx;
				font-size: 30rpx;
				font-family: "Gill Sans", "Gill Sans MT", Calibri,
					"Trebuchet MS", sans-serif;
				color: #8f8f8f;
			}
			#name {
				font-size: 50rpx;
				color: black;
			}
		}
	}
	// 统计数据模块
	.middle {
		width: 94%;
		height: 300rpx;
		margin: 30rpx 3%;
		border-radius: 20rpx;
		background-color: #fff;
		box-shadow: 0px 0px 4px 2px #e2e2e5;
		.tiele {
			display: flex;
			box-sizing: border-box;
			justify-content: space-between;
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 20rpx;

			.front {
				height: 100%;
				margin: 10rpx;
			}

			.behind {
				line-height: 100rpx;
			}
		}

		.box {
			display: flex;
			.minBox {
				height: 140rpx;
				width: 50%;
				margin: 40rpx 10%;
				border: 1rpx solid #ececec;
				border-radius: 20rpx;
				box-sizing: border-box;
				text-align: center;
				// box-shadow: 0px 0px 2px 1px #e2e2e5;
				padding-top: 20rpx;
			}
		}
	}
	//
	.last {
		display: flex;
		flex-wrap: wrap;
		border-radius: 40rpx;
		width: 94%;
		margin: 0 3%;
		margin-top: 20rpx;
		padding: 10rpx 0;
		box-sizing: border-box;
		background-color: #fff;
		box-shadow: 0px 0px 4px 2px #e2e2e5;

		.circle {
			display: flex;
			flex-direction: column;
			justify-content: center;
			box-sizing: border-box;
			height: 48%;
			width: 31%;
			// padding: 0%;
			margin: 1%;
			text-align: center;
			font-size: 24rpx;
			color: #8f8f8f;
			// border-radius: 20rpx;
			// box-shadow: 0px 0px 2px 1px #e2e2e5;

			.img,
			.img_special {
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.img {
				height: 100rpx;
				width: 100rpx;
				margin: 10rpx auto;
			}

			.img_special {
				height: 80rpx;
				width: 80rpx;
				margin: 20rpx auto;
			}
		}
	}
}
</style>
