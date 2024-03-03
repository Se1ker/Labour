<template>
	<view class="content">
		<!-- 活动封面 -->
		<view class="activitiesCover">
			<view>活动封面</view>
			<view class="img" @click="chooseImg">
				<image :src="form.cover" mode="scaleToFill" />
			</view>
		</view>
		<u-form :model="form" ref="uForm" label-width="120rpx" label-align="center">
			<!-- 活动名称 -->
			<u-form-item prop="title" borderBottom>
				<view class="activitiesName">
					<view class="name">活动名称</view>
					<view class="inputName">
						<u--input placeholder="请输入活动名称" border="none" v-model="form.title" showWordLimit></u--input>
					</view>
				</view>
			</u-form-item>
			<!-- 活动简介 -->
			<view class="activeIntroduce">
				<view class="name">活动简介</view>
				<view class="inputName">
					<u--textarea type="textarea" border="none" v-model="form.content" placeholder="请输入活动简介"
						showWordLimit>></u--textarea>
				</view>
			</view>
			<!-- 报名时间 -->
			<view class="activityTime">
				报名时间
				<view class="time">
					<text class="startTime" @click="selectionTime(1)">{{applyTime.start}}</text>
					<text class="startTime" @click="selectionTime(2)">{{applyTime.end}}</text>
				</view>
			</view>
			<!-- 活动时间 -->
			<view class="activityTime">
				活动时间
				<view class="time">
					<text class="startTime" @click="selectionTime(3)">{{actTime.start}}</text>
					<text class="startTime" @click="selectionTime(4)">{{actTime.end}}</text>
				</view>
			</view>
			<!-- 活动地点 -->
			<view class="number loacted">
				<view class="name">活动地点</view>
				<u--input placeholder="请输入" border="none" v-model="form.location" inputAlign="right" showWordLimit>>
				</u--input>
			</view>
			<!-- 活动积分 -->
			<u-form-item prop="score" borderBottom>
				<view class="number">
					<view class="name">活动积分</view>
					<u--input placeholder="请输入1-9的整数" border="none" v-model="form.score" inputAlign="right"
						showWordLimit>></u--input>
				</view>
			</u-form-item>
			<!-- 活动人数 -->
			<u-form-item prop="capacity" borderBottom>
				<view class="number">
					<view class="name">活动人数</view>
					<u--input placeholder="请输入" border="none" v-model="form.capacity" inputAlign="right" showWordLimit>>
					</u--input>
				</view>
			</u-form-item>
		</u-form>
		<!-- 创建按钮 -->
		<view class="fixed">
			<u-button :color="color" text="创建活动" type="info" @click="SignIn"></u-button>
		</view>
		<!-- 时间选择器 -->
		<u-datetime-picker :show="show" v-model="value1s" mode="datetime" @cancel="cancel" @confirm="confirm">
		</u-datetime-picker>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import transferTime from '../../components/transferTime.js'
	export default {
		data() {
			return {
				form: {
					cover: '/static/logo.png', // 封面图片
					title: '', // 活动名称
					content: '', // 活动描述
					location: '', // 活动地点
					capacity: '', // 活动人数
					score: null, // 活动积分
					applyTime: { // 报名开始时间
						start: '年-月-日——时-分',
						end: '年-月-日——时-分'
					},
					actTime: { // 活动开始时间
						start: '年-月-日——时-分',
						end: '年-月-日——时-分'
					}
				},
				// 用于显示
				applyTime: { // 报名开始时间
					start: '年-月-日——时-分',
					end: '年-月-日——时-分'
				},
				actTime: { // 活动开始时间
					start: '年-月-日——时-分',
					end: '年-月-日——时-分'
				},
				color: '#ff895e', // 按钮颜色
				value1s: Number(new Date()),
				show: false, // 控制时间选择器的 "显示与隐藏"
				rules: {
					// 标题
					title: [{
						required: true,
						min: 1,
						message: '请输入标题',
						trigger: ['change', 'blur'],
					}],
					// 积分
					score: [{
							required: true,
							min: 1,
							max: 9,
							message: '请输入积分整数,1-9',
							// 可以单个或者同时写两个触发验证方式 
							trigger: 'blur',
						},
						{
							pattern: /^[0-9]$/,
							message: '积分只能为整数',
							trigger: ['change', 'blur'],
						}
					],
					// 人数
					capacity: [{
							required: true,
							min: 1,
							max: 9999,
							message: '请输入参与人数',
							// 可以单个或者同时写两个触发验证方式 
							trigger: 'blur',
						},
						{
							pattern: /^[0-9]+$/,
							message: '只能为整数',
							trigger: ['change', 'blur'],
						}
					]
				}
			}
		},
		methods: {
			// 创建活动
			SignIn() {
				console.log(this.form);
				this.$refs.uForm.validate().then(valid => {
				this.form.score = Number(this.form.score)
					if (valid) {
						this.$request({
							url: '/createActivity',
							method: 'post',
							data: this.form
						}).then((res) => {
							console.log(res)
							if (res.statusCode == 200) {
								this.$refs.uToast.show({
									type: 'success',
									message: res.data.msg,
									iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
									complete() {
										uni.navigateBack()
									}
								})
							}
						})
					} else {
						uni.$u.toast('格式错误')
					}
				}).catch(err => {
					uni.$u.toast('格式错误')
				})

			},
			// 选择封面
			chooseImg() {
				const that = this
				uni.chooseImage({
					count: 1,
					// 图片格式：
					// sizeType: ['original', 'compressed'],
					crop: {
						width: 80,
						height: 80,
						resize: false
					},
					// 图片来源：从相册中选择
					sourceType: ['album'],
					success: (res) => {
						if (res.errMsg == "chooseImage:ok" && res.tempFilePaths.length !== 0) {
							that.form.cover = res.tempFilePaths[0]
							uni.uploadFile({
								url: 'http://175.27.247.87:8081/api/v1/uploadImage',
								filePath: res.tempFilePaths[0],
								name: "img",
								header: {
									'authorization': "Bearer " + uni.getStorageSync('token')
								},
								success: (res) => {
									console.log(res);
									// that.form.cover = JSON.parse(res.data).url;
									that.form.cover = res.data;
								}
							})
						}
					}
				})
			},
			// 取消选择
			cancel() {
				this.show = !this.show;
			},
			// 确定选择
			confirm(e) {
				// 用于上传数据所需格式
				let time = uni.$u.timeFormat(e.value - 28800000, 'yyyy-mm-ddThh:MM:ss.000Z');
				console.log(time);
				// 用于显示
				let timeone = uni.$u.timeFormat(e.value, 'yyyy-mm-dd hh:MM');
				switch (this.key) {
					case 1:
						this.form.applyTime.start = time;
						this.applyTime.start = timeone;
						break;
					case 2:
						this.form.applyTime.end = time;
						this.applyTime.end = timeone;
						break;
					case 3:
						this.form.actTime.start = time;
						this.actTime.start = timeone;
						break;
					case 4:
						this.form.actTime.end = time;
						this.actTime.end = timeone;
						break;

					default:
						break;
				}
				this.show = !this.show;
			},
			// 选择时间
			selectionTime(key) {
				this.show = !this.show;
				this.key = key;
			},
		},
		onReady() {
			// setRules 调用此方法，设置校验规则
			this.$refs.uForm.setRules(this.rules);
		}
	}
</script>

<style lang="scss">
	.content {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;

		.activitiesCover,
		.number,
		.activityTime {
			display: flex;
		}

		.loacted {
			border-bottom: 1rpx solid #ececec;
		}

		// 活动名称
		.activitiesName {
			width: 100%;
			padding: 30rpx;

			.name {
				font-size: 36rpx;
				font-weight: 600;
				padding: 10rpx;
			}

			//输入框
			.inputName {
				width: 80%;
				margin: 10rpx 0 0 0;
			}
		}

		// 活动介绍
		.activeIntroduce {
			width: 100%;
			padding-bottom: 10rpx;
			border-bottom: 1rpx solid #c3c3c3;

			.name {
				font-size: 34rpx;
				font-weight: 600;
				padding: 20rpx 0 20rpx 50rpx;
			}

			.inputName {
				width: 96%;
				margin: 0 auto;
			}
		}

		// 活动封面
		.activitiesCover {
			justify-content: space-around;
			align-items: center;
			font-size: 50rpx;
			padding-top: 20rpx;

			image {
				width: 160rpx;
				height: 160rpx;
			}
		}

		// 活动时间
		.activityTime {
			flex-direction: column;
			width: 100%;
			padding: 20rpx;
			box-sizing: border-box;
			color: #666;

			.time {
				display: flex;
				justify-content: space-around;
				align-items: center;
				width: 100%;
				height: 100rpx;

				.startTime {
					padding: 10rpx;
					border-radius: 20rpx;
					font-size: 30rpx;
					border: 0.0267rem dashed #666;
				}
			}
		}

		// 活动人数
		.number {
			box-sizing: border-box;
			display: flex;
			align-items: center;
			padding: 30rpx;
			width: 100%;
			font-size: 30rpx;
			font-weight: 600;
		}
	}

	// 签到按钮
	.fixed {
		position: fixed;
		bottom: 0;
		right: 0;
		z-index: 100;
		width: 100%;
		border-radius: 20rpx;
		box-shadow: 0rem 0rem 0.3733rem #8cb7ffc7;
	}
</style>
