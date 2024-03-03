<template>
	<view>
		<view class="content">
			<!-- <view class="PIM">
				<u--text :text="chooseList.classInfo.name" size=20 type="success"></u--text>
				<u--text :text="chooseList.room" size=20 type="success"></u--text>
			</view> -->
			<view v-for="(item,index) in timeButton" :key="index">
				<view class="choose">
					<view class="Box">
						<u-button :text="item.time" @click="timeSelect(item)" :disabled="item.disabled" :type="item.color"
						size="large" class="btn"></u-button>
					</view>
					<view class="residue">剩余名额：{{item.remain}}</view>
				</view>
			</view>
			<u-button text="确认" @click="submit()" class="confirm" color="#8063fc"></u-button>
			<u-toast ref="uToast"></u-toast>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
			chooseList() {
				return this.$store.state.chooseList;
			}
		},
		data() {

			return {
				taskList:"",
				time: '',
				timeButton: [{
					time: '周一',
					weekDay: 'mon',
					disabled: false,
					color: 'default',
					remain: 0
				}, {
					time: '周二',
					weekDay: 'tue',
					disabled: false,
					color: 'default',
					remain: 0
				}, {
					time: '周三',
					weekDay: 'wed',
					disabled: false,
					color: 'default',
					remain: 0
				}, {
					time: '周四',
					weekDay: 'thu',
					disabled: false,
					color: 'default',
					remain: 0
				}, {
					time: '周五',
					weekDay: 'fri',
					disabled: false,
					color: 'default',
					remain: 0
				}]
			}
		},
		methods: {
			timeSelect(item) {
				for (let i = 0; i < this.timeButton.length; i++) {
					this.timeButton[i].color = 'default'
				}
				console.log(item.time)
				this.time = item.weekDay
				item.color = 'success'
			},
			submit() {
				if (this.time === '') {
					console.log("还未选择")
				} else {
					this.choose()
				}
			},
			//提交结果
			async choose() {
				await this.$request({
					url: '/choose',
					method: 'post',
					data: {
						weekDay: this.time
					}
				}).then((res) => {
					if (res.statusCode === 200) {
						// 成功
						this.$refs.uToast.show({
							type: 'success',
							message: "选择成功",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
						})
						this.getCleanTask()
					} else {
						this.$refs.uToast.show({
							type: 'error',
							message: res.data.errors[0].msg,
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
						})
					}
				})
			},
			getCleanTask(){
				this.$request({
					url:"/getTask",
					method: 'get'
				}).then((res) => {
					this.taskList = res.data.data
					this.$store.commit('taskList',this.taskList)
					console.log(res,"获取打扫卫生")
				}).catch(err => {
					console.log(err)
				})
			},
			judegeData() {
				this.timeButton[0].remain = this.chooseList.mon.remain;
				this.timeButton[1].remain = this.chooseList.tue.remain;
				this.timeButton[2].remain = this.chooseList.wed.remain;
				this.timeButton[3].remain = this.chooseList.thu.remain;
				this.timeButton[4].remain = this.chooseList.fri.remain;
				if (this.chooseList.mon.remain === 0) {
					this.timeButton[0].disabled = true
					if (this.chooseList.tue.remain === 0) {
						this.timeButton[1].disabled = true
						if (this.chooseList.wed.remain === 0) {
							this.timeButton[2].disabled = true
							if (this.chooseList.thu.remain === 0) {
								this.timeButton[3].disabled = true
								if (this.chooseList.fri.remain === 0) {
									this.timeButton[4].disabled = true

								}
							}
						}
					}
				}
			}
		},
		onLoad() {
			this.judegeData()
		}
	}
</script>

<style lang="scss">
	.content {
		padding: 100rpx 30rpx 30rpx 30rpx;
	}

	.PIM {
		display: flex;
		justify-content: space-around;
		margin: 20rpx 0rpx 50rpx 0rpx;
	}

	.choose {
		display: flex;
		justify-content: space-around;
		.Box {
			width: 60%;
		}
	}

	.residue {
		line-height: 124rpx;
	}

	.btn {
		width: 300rpx;
		height: 100rpx;
		margin: 10rpx;
		border: 1rpx solid #d9d9d9;
		border-radius: 24rpx;
	}

	.confirm {
		width: 450rpx;
		height: 100rpx;
		margin: 0 auto;
		margin-top: 200rpx;
	}
</style>
