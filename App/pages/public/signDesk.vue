<template>
	<view class="u-page">
		<view class="box"></view>
		<view class="content">
			<!-- 选择任务按钮 -->
			<u-button type="primary" text="选择任务" @click="showHide" class="btn"></u-button>
			<view class="show">
				<u--input border="surround" v-model="value" placeholder="请选择任务" disabled disabledColor="#fff"
					inputAlign="center" fontSize="16px"></u--input>
			</view>
			<!-- 签到按钮 -->
			<u-button type="primary" text="签到" @click="signIn" class="btn signIn"></u-button>
			<!-- <view class="footer">
				<text id="num">已签到人数 {{signedNum}}/{{totalNum}}</text>
				<u-line-progress :percentage="30" activeColor="#ff0000" height="20"></u-line-progress>
			</view> -->
			<!-- 任务选择器 -->
			<u-picker :show="show" ref="uPicker" :columns="columns" @confirm="confirm" @change="changeHandler"
				closeOnClickOverlay :loading="loading" @cancel="cancel"></u-picker>
			<u-toast ref="uToast"></u-toast>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
			taskList() {
				return this.$store.state.taskList;
			}
		},
		data() {
			return {
				show: false,	// 控制选择器的 "显示与隐藏"
				loading: false,	// 加载效果
				value: '',
				// signedNum: '3',	// 已签到人数
				// totalNum: '10'	,// 总人数
				columns: [[],[]]
			}
		},
		methods: {
			changeHandler(e) {
				const {
					columnIndex,
					value,
					values, // values为当前变化列的数组内容
					index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e
				// 当第一列值发生变化时，变化第二列(后一列)对应的选项
				if (columnIndex === 0) {
					this.loading = true
					// 模拟网络请求
					uni.$u.sleep(1500).then(() => {
						picker.setColumnValues(1, this.columnData[index])
						this.loading = false
					})
				}
			},
			// 回调参数为包含columnIndex、value、values
			confirm(e) {
				this.value = e.value[0] + " " + e.value[1];
				this.show = false
			},
			showHide() {
				this.show = true
			},
			cancel() {
				this.show = false
			},
			// 签到
			signIn() {
				this.$request({
					url: '/taskSign',
					method: 'post'
				}).then(res => {
					if(res.statusCode === 200 && res.data.data) {
						this.$refs.uToast.show({
							type: 'success',
							message: "签到成功",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
							complete() {
								uni.navigateBack();
							}
						})
					} else {
						this.$refs.uToast.show({
							type: 'error',
							message: res.data.msg,
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
						})
					}
					console.log(res)
				})
			}
		},
		created() {
			this.columns = [
				[this.taskList.detail.buildName],[this.taskList.detail.areaName]
			]
		}
	}
</script>
<style lang="scss">
	.u-page {
		padding: 0;
		margin: 0;
		// 顶部占位盒子
		.box {
			height: 100rpx;
			width: 100%;
		}

		// 内容盒子
		.content {
			box-sizing: border-box;
			width: 90%;
			height: 900rpx;
			border: 1px solid #fff;
			border-radius: 20rpx;
			margin: 0rpx 5% 100rpx 5%;
			box-shadow: 0px 0px 8px #d5d5d6;
			// input
			.show {
				width: 80%;
				height: 80rpx;
				margin: 100rpx auto;
			}
			// 按钮
			.btn {
				width: 200rpx;
				height: 100rpx;
				margin: 60rpx;
			}
			// 签到按钮
			.signIn {
				margin: 40rpx auto;
				margin-top: 300rpx;

			}
			// // 进度条
			// .footer {
			// 	width: 70%;
			// 	padding-left: 40rpx;
			// 	#num {
			// 		display: inline-block;
			// 		margin-bottom: 10rpx;
			// 	}
			// }
		}
	}

	
	

	

	
</style>
