<template>
	<view class="u-page">
		<view class="box"></view>
		<view class="content">
			<view class="btn btn1">
				<u-button type="primary" text="选择任务" @click="showHide" class="btn"></u-button>
			</view>
			<view class="btn btn1">
				<u-button type="primary" text="获取当前位置" @click="getLocation" class="btn"></u-button>
			</view>
			<view class="show">
				<u--input border="surround" v-model="value" disabled disabledColor="#fff" inputAlign="center"
					fontSize="16px"></u--input>
			</view>
			<view class="show">
				<u--input border="surround" v-model="coord" placeholder="请获取位置信息" disabled disabledColor="#fff"
					inputAlign="center" fontSize="16px"></u--input>
			</view>
			<view class="switch">
				<view class="switchSon">
					优秀
					<u-switch v-model="switchBtnOptimal"></u-switch>
				</view>
				<view class="switchSon">
					合格
					<u-switch v-model="switchBtnQualified"></u-switch>
				</view>
				<view class="switchSon">
					不合格
					<u-switch v-model="switchBtnUnqualified"></u-switch>
				</view>
			</view>
			<view class="inputName">
				<u--textarea type="textarea" border="surround" v-model="reviewValue" placeholder="请输入评价" showWordLimit>>
				</u--textarea>
			</view>
			<view class="upload">
				<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
					:maxCount="3"></u-upload>
			</view>
			<view class="btn announce">
				<u-button type="primary" text="发布" @click="publish" :disabled="bool"></u-button>
			</view>
			<!-- 任务选择器 -->
			<u-picker :show="show" ref="uPicker" :columns="columns" @confirm="confirm" @change="changeHandler"
				closeOnClickOverlay :loading="loading" @cancel="cancel"></u-picker>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false, // 控制选择器的 "显示与隐藏"
				loading: false, // 加载效果
				value: '', // 任务
				// 开关选择器
				switchBtnOptimal: false, // 优
				switchBtnQualified: false, // 合格
				switchBtnUnqualified: false, //不合格
				fileList1: [], // 显示已上传的文件列表
				reviewValue: null, //检查评价
				bool: true,
				coords: [], // 经纬度
				coord: '',
				area: {
					"name": "123",
					"rid": "624ebb181762f45c7c7f8fed"
				},
				columns: [
					[],
					[]
				],
				columnData: [],
				rid: [] // 教室id
			}
		},
		watch: {
			//优
			switchBtnOptimal: function(val, oldVal) {
				if (val == true) {
					this.switchBtnQualified = false;
					this.switchBtnUnqualified = false;
				}
				// 判断是否启用发布按钮
				this.announce();
			},
			// 合格
			switchBtnQualified: function(val, oldVal) {
				if (val == true) {
					this.switchBtnOptimal = false;
					this.switchBtnUnqualified = false;
				}
				// 判断是否启用发布按钮
				this.announce();
			},
			// 不合格
			switchBtnUnqualified: function(val, oldVal) {
				if (val == true) {
					this.switchBtnOptimal = false;
					this.switchBtnQualified = false;
				}
				// 判断是否启用发布按钮
				this.announce();
			},
			// 图片
			fileList1: function(val, oldVal) {
				// 判断是否启用发布按钮
				this.announce();
			},
			// 评价
			reviewValue: function() {
				// 判断是否启用发布按钮
				this.announce();
			},
			coords: function() {
				// 判断是否启用发布按钮
				this.announce();
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
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].thumb)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				// console.log("url",url)
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://175.27.247.87:8081/api/v1/uploadImage',
						filePath: url,
						name: 'img',
						header: {
							'authorization': "Bearer " + uni.getStorageSync('token')
						},
						success: (res) => {
							console.log("res", res.data)
							setTimeout(() => {
								resolve(res.data)
							}, 1000)
						}
					});
				})
			},
			// 关于是否启动发布按钮
			announce() {
				if (!((this.switchBtnOptimal || this.switchBtnQualified || this.switchBtnUnqualified) && this.value
						.length > 0 && this.coords.length)) {
					// 禁用发布按钮
					this.bool = true
				} else if (this.switchBtnUnqualified && this.coords.length) {
					if (this.fileList1.length > 0 && this.reviewValue.length > 0) {
						// 启用发布按钮
						this.bool = false
					} else {
						// 禁用发布按钮
						this.bool = true
					}
				} else {
					// 启用发布按钮
					this.bool = false
				}
			},
			publish() {
				let data = new Object();
				let name = this.value.split(" ")[1];
				data.status = this.switchBtnOptimal ? '优秀' : (this.switchBtnQualified ? '合格' : '不合格');
				data.images = this.fileList1?.length ? this.fileList1.map(item => {
					return item.url
				}) : null;
				data.coords = this.coords;
				data.area = {
					"name": name,
					"rid": ''
				}
				for (const i in this.columnData) {
					if (this.columnData[i].name == name) {
						data.area.rid = this.columnData[i].rid
					}
				}
				if ((this.reviewValue ?? '') !== '') {
					data.desc = this.reviewValue;
				}
				this.$request({
					url: '/checkCondition',
					method: 'POST',
					data: data
				}).then((res) => {
					if (res.statusCode == 200) {
						this.$refs.uToast.show({
							type: 'success',
							message: "发布成功",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
						})
						this.fileList1 = []
						this.coord = '请获取位置信息'
						this.switchBtnOptimal = false // 优
						this.switchBtnQualified = false // 合格
						this.switchBtnUnqualified = false //不合格
						data = {}
					} else {
						this.$refs.uToast.show({
							type: 'error',
							message: "发生未知错误，请重试",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
						})
					}
				})
			},
			// 获取经纬度
			getLocation() {
				console.log('11');
				// uni.getLocation({
				// 	success: (res) => {
				// 		console.log("成功");
				// 		this.coords = [res.latitude, res.longitude]
				// 		this.coord = '纬度' + this.coords[0] + '   经度' + this.coords[1]
				// 	},
				// 	fail(err) {
				// 		this.coord = '请重新获取位置信息'
				// 		console.log(err);
				// 	}
				// })
				setTimeout(() => {
					this.coords = ['27.5684', '116.63775']
					this.coord = '纬度' + this.coords[0] + '   经度' + this.coords[1]
				}, 1200)
			}
		},
		created() {
			this.$request({
					url: '/getCheckById',
				})
				.then((res) => {
					// 楼栋和教室信息保存
					this.columnData = res.data.data.room;
					this.columns = [
						[res.data.data.buildingName], res.data.data.room.map(item => {
							return item.name
						})
					];
					this.value = this.columns[0][0] + ' ' + this.columns[1][0]
				})

		}
	}
</script>

<style lang="scss">
	.u-page {
		padding: 0;
		margin: 0;

		// 顶部占位盒子
		.box {
			height: 60rpx;
			width: 100%;
		}

		.content {
			box-sizing: border-box;
			width: 90%;
			height: 100%;
			border: 1px solid #fff;
			border-radius: 20rpx;
			margin: 0rpx 5% 100rpx 5%;
			box-shadow: 0px 0px 8px #d5d5d6;

			// 选择任务按钮
			.btn {
				width: 200rpx;
				height: 100rpx;
				margin: 50rpx;
			}

			.btn1 {
				display: inline-block;
			}

			// input
			.show {
				width: 80%;
				height: 80rpx;
				margin: 40rpx auto;
			}

			// 开关选择按钮
			.switch {
				display: flex;
				justify-content: center;
				width: 100%;
				margin: 0 10rpx;

				.switchSon {
					display: flex;
					width: 33%;
				}
			}

			// 任务显示
			.inputName {
				width: 94%;
				margin: 40rpx 10rpx;
			}

			// 上传
			.upload {
				display: flex;
				padding-left: calc((100% - 480rpx) / 2);
				width: 100%;
			}

			// 发布按钮
			.announce {
				margin: 60rpx calc((100% - 200rpx) / 2);
			}
		}
	}
</style>
