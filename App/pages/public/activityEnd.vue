<template>
	<view class="content">
		<view class="btn1">
			<view class="box">
				<u-button type="primary" text="选择活动" @click="showHide" class="btn"></u-button>
				<u--text :text="value" margin="110rpx 0rpx 150rpx 50rpx"></u--text>
			</view>
			<u-picker :show="show" :columns="columns" ref="uPicker" @confirm="confirm" @cancel="cancel"></u-picker>
		</view>
		<view class="upload">
			<u-upload
				:fileList="fileList1"
				@afterRead="afterRead"
				@delete="deletePic"
				name="1"
				multiple
				:maxCount="3"
			></u-upload>
		</view>
		<view class="announce">
			<u-button type="primary" text="发布" @click="publish" :disabled="bool"></u-button>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				activityEnd:[],
				show:false,
				columns:[],
				value:"活动",
				fileList1:[],
				id:"",
				bool: true
			}
		},
		computed: {
			myActivityList() {
				return this.$store.state.myActivityList
			}
		},
		methods:{
			displayData(){
				for(var i=0;i<this.myActivityList.length;i++){
					// console.log(this.myActivityList[i].isPass)
					if(this.myActivityList[i].isPass === true && this.myActivityList[i].isDone !== true){
						this.activityEnd.push(this.myActivityList[i])
					}
				}
				this.columns[0] = this.activityEnd.map(item=>{return item.title})
				// uni.hideLoading()
				if(this.columns[0].length === 0){
					uni.showToast({
						title:"当前无可结项活动",
						duration: 2000,
						icon: "none"
					})
				}
				
				// console.log(this.columns[0])
			},
			showHide() {
				this.show = true
			},
			confirm(e) {
				console.log(e)
				this.id = this.activityEnd[e.indexs[0]]._id
				this.value = e.value[0];
				this.show = false
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
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'https://qc9qjl.api.cloudendpoint.cn/uploadImage',
						filePath: url,
						name: 'myFile',
						success: (res) => {
							resolve(res.data)
						}
					});
				})
			},
			announce(){
				if(this.fileList1 !== [] && this.value !== "" && this.id !== ""){
					this.bool = false
				}
			},
			async publish(){
				let data = new Object();
				data.urls = this.fileList1?.length ? this.fileList1.map(item => {return item.url}) : null;
				data.aid = this.id
				await this.$request({
				url: '/commit',
				method: 'POST',
				data: data
				}).then((res) => {
					console.log(res)
					if (res.statusCode == 200) {
						this.$refs.uToast.show({
							type: 'success',
							message: "发布成功",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
						})
					}
					this.fileList1 = []
					this.value = ""
					this.bool = true
				})
			}
		},
		watch:{
			// 图片
			fileList1: function (val, oldVal) {
				// 判断是否启用发布按钮
				this.announce();
			}
		},
		onLoad() {
			this.displayData()
			// console.log(this.myActivityList,"111")
		},
		// created() {
		// 	uni.showLoading({
		// 		title: '加载中'
		// 	})
		// }
	}
</script>

<style lang="scss">
	.content{
		padding: 50rpx;
		box-sizing: border-box;
		width: 90%;
		height: 900rpx;
		border: 1px solid #fff;
		border-radius: 20rpx;
		margin: 100rpx 5% 100rpx 5%;
		box-shadow: 0px 0px 8px #d5d5d6;
	}
	.box{
		display: flex;
		justify-content: space-around;
	}
	// 选择任务按钮
	.btn {
		width: 300rpx;
		height: 100rpx;
		margin: 80rpx 20rpx 50rpx 0rpx;
	}
	.btn1 {
		display: inline-block;
	}
	
	// input
	.announce {
		width: 300rpx;
		height: 100rpx;
		margin: 250rpx auto!important;
	}
</style>
