<template>
	<view>
		<u--input v-model="title" placeholder="请输入活动标题" @confirm="confirmTitle" @blur="confirmTitle"></u--input>
		<u-radio-group v-model="typeValue" placement="row" @change="typeChange">
			<view>选择活动类型：</view>
			<u-radio v-for="(item,index) in typeList" :key="index" :label="item.name" :name="item.name"></u-radio>
		</u-radio-group>
		<u--textarea v-model="content" placeholder="请输入活动内容" count @confirm="textConfirm"></u--textarea>
		<u-upload :fileList="fileList1" :maxCount="3" @afterRead="afterRead" @delete="deletePic" multiple name="1">
		</u-upload>
		<view class="contactType">
			<view class="UBtn">
				<u-button @click="showPicker = true" :text="pickValue"></u-button>
			</view>
				<u--input v-model="contactNum" placeholder="请输入联系方式" @confirm="confirmContact" @blur="confirmContact" class="UInput">
				</u--input>
		</view>
		<u--input v-model="value" @confirm="confirm" placeholder="请输入所创建活动的标签(最少输入一个)" @blur="confirm"></u--input>
		<view v-for="(item,index) in tag" :key="index">
			<uni-tag :text="item" type="primary" class="Utag" @click="shanchu(index)"></uni-tag>
		</view>
		<u-picker :show="showPicker" :columns="columns" @confirm="confirmPicker"></u-picker>
		<u-button text="发布" :disabled="Pdisabled" type="primary" class="fabuBtn" @click="createLosts()"></u-button>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tag: [],
				value: '', //输入的标签内容
				typeList: [{
					name: '失物招领',
					disabled: false
				}, {
					name: '寻物启事',
					disabled: false
				}],
				title: '', //输入的标题内容
				typeValue: '失物招领', //所选的活动类型
				content: '', //输入的内容
				fileList1: [], //上传的图片列表
				columns: [
					['QQ', '邮箱', 'phone', '微信']
				],
				showPicker: false, //弹出层是否显示
				pickValue: '选择联系方式',
				contactNum: '', //输入的联系方式
				Pdisabled: true, //是否禁用发布按钮
				filesList: [], //已上传的图片列表
				show: false
			}
		},
		methods: {
			confirm() {
				console.log(this.value);
				if (this.value !== "") {
					this.tag.push(this.value);
				}
				console.log(this.tag)
				this.fabu()
				this.value = ''
			},
			shanchu(index) {
				// console.log(index)
				this.tag.splice(index, 1)
			},
			typeChange() {
				console.log(this.typeValue);
				this.fabu()
			},
			//确认所选联系方式
			confirmPicker(e) {
				this.pickValue = e.value[0]
				this.showPicker = false
				this.fabu()
			},
			//确定所输入的联系方式
			confirmContact() {
				console.log(this.contactNum)
				this.fabu()
			},
			//确定输入的标题
			confirmTitle() {
				console.log(this.title)
				this.fabu()
			},
			//确定所输入的内容
			textConfirm() {
				console.log(this.content)
				this.fabu()
			},

			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// console.log("event",event.file)
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						// status: 'uploading',
						// message: '上传中'
					})
				})
				// console.log("list",lists)
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].thumb)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						url: result
					}))
					this.filesList.push(this.fileList1[i].url.replace(/"/g, ""))
					console.log(this.filesList)
					fileListLen++
				}
			},
			//上传图片
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
			//是否可以发布
			fabu() {
				if (this.title !== '' && this.typeValue !== '' && this.content !== '' && this.contactNum !== '' && this.tag
					.length !== 0 && this.pickValue !== '选择联系方式') {
					this.Pdisabled = false
				}
			},
			//创建活动接口
			async createLosts() {
				await this.$request({
					url: '/createLosts',
					method: 'post',
					data: {
						title: this.title,
						content: this.content,
						images: this.filesList,
						contact: {
							type: this.pickValue,
							info: this.contactName
						},
						keywords: this.tag,
						type: this.typeValue
					}
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
						// this.title = '';
						// this.content = '';
						// this.fileList1 = [];
						// this.filesList = [];
						// this.pickValue = '选择联系方式'
						// this.contactNum = '';
						// this.tag = [];
						// this.Pdisabled = true;
					} else {
						this.$refs.uToast.show({
							type: 'error',
							message: "发布失败,亲在尝试一次呗",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
						})
					}
				}).catch(err => {
					console.log(err)
				})
			}

		}
	}
</script>

<style lang="scss">
	.Utag {
		text-align: center;
	}

	uni-view {
		display: inline;
		margin: 20rpx;
	}

	.UBtn {
		width: 200rpx;
	}

	.contactType {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.fabuBtn {
		margin-top: 200rpx;
		width: 200rpx;
	}
	
	.UInput{
		height: 1.8rem;
	}
</style>
