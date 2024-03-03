<template>
	<view class="content">
		<!-- 首页背景图 -->
		<view class="bgRadiu">
			<u--image :src="src" width="100%" height="280rpx" :fade="true" duration="450"></u--image>
		</view>
		<!-- 导航栏 -->
		<view class="navigationBarImg">
			<u--image src="../../static/rankinglist.png" width="105rpx" height="105rpx" @click="getScoreSort">
			</u--image>

			<u--image src="../../static/voluntaryActivity.png" width="95rpx" height="95rpx" @click="voluntaryActcicty">
			</u--image>

			<u--image src="../../static/lostFound.png" width="105rpx" height="105rpx" @click="lostAndFound"></u--image>

			<u--image src="../../static/detail.png" width="100rpx" height="100rpx" @click="detail"></u--image>
		</view>
		<view class="navigationBarTxt">
			<view>积分排行</view>
			<view>志愿活动</view>
			<view>失物/寻物</view>
			<view>检查展示</view>
		</view>
		<!-- 活动推荐部分 -->
		<view class="primary">
			<view class="character">
				推荐列表
			</view>
			<view class="indicatorBar">
				<u-scroll-list indicatorBarWidth="40rpx" :indicator="indicator">
					<view v-for="(item, index) in recommendlist" :key="index" @click="open(item)">
						<view class="indicatorImage">
							<u--image :src="item.cover" width="250rpx" height="150rpx" radius="12rpx"></u--image>
						</view>
					</view>
				</u-scroll-list>
			</view>
			<!-- 动态部分 -->
			<view class="character">动态</view>
			<dynamic ref="dynamic"></dynamic>
			
		</view>
		<u-popup :show="showPop" mode="center" :round="10">
			<!-- 修改密码表单 -->
			<u-form :model="form" ref="uForm" label-width="120rpx" label-align="center">
				<u-form-item label="密码" prop="newPass" borderBottom>
					<u--input v-model="form.newPass" placeholder="请输入密码" :password-icon="false" maxlength="16"
						type="text" password border="none"></u--input>
				</u-form-item>
			</u-form>
			<view class="btn" @click="close">
				<u-button type="primary" shape="circle" size="normal" text="修改密码"></u-button>
			</view>
		</u-popup>
		<!-- 修改学院表单 -->
		<u-popup :show="showCollegePop" mode="center" :round="10">
			<u-form :model="collegeForm" ref="uForm" label-width="200rpx" label-align="center">
				<u-form-item label="学院" prop="newCollege" borderBottom>
					<view class="collegeAndClass">
						<view @click="showCollege()">{{collegeForm.newCollege}}</view>
					</view>
						<u-picker :show="collegeShow" ref="uPinker" :loading="loading" :columns="collegeColumns"  @confirm="collegeConfirm"></u-picker>
				</u-form-item>
			</u-form>
			<view class="btn" @click="collegeClose">
				<u-button type="primary" shape="circle" size="normal" text="确认"></u-button>
			</view>
		</u-popup>
		<!-- 修改班级表单 -->
		<u-popup :show="showClassPop" mode="center" :round="10">
			<u-form :model="classForm" ref="uForm" label-width="200rpx" label-align="center">
				<u-form-item label="班级" prop="newClass" borderBottom>
					<view class="collegeAndClass">
						<view @click="showClass()">{{classForm.newClass}}</view>
					</view>
						<u-picker :show="classShow" ref="uPinker" :loading="loading" :columns="classColumns"  @confirm="classConfirm"></u-picker>
				</u-form-item>
			</u-form>
			<view class="btn" @click="classClose">
				<u-button type="primary" shape="circle" size="normal" text="确认"></u-button>
			</view>
		</u-popup>
		<u-toast ref="uToast"></u-toast>
		<u-loadmore :status="status" :line="true"/>
	</view>

</template>

<script>
	import transferTime from '../../components/transferTime.js'
	import dynamic from './dynamic'
	export default {
		data() {
			return {
				src: "../../static/shouye.png", //页面背景图
				indicator: false, //是否显示推荐活动部分滚动条
				//推荐活动部分的图片
				recommendlist: [],
				//动态数据
				dynamicState: [],
				//收藏图标
				icon: "bookmark",
				iconAct: "bookmark-fill",
				id: '',
				pinglunList:[], //推荐活动的评论列表
				isPinglun: false,
				voluntaryList: [], //志愿活动列表
				rankingList: [], //积分排行列表
				rules: {
					newPass: [{
							required: true,
							min: 10,
							max: 16,
							message: '请输入密码,10-16位',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						},
						{
							pattern: /^[A-Za-z0-9]+$/,
							message: '密码只能为数字或字母',
							trigger: 'blur'
						}
					],
				},
				show: false,
				showPop: false,
				showClassPop: false,//是否弹出修改班级
				showCollegePop: false,//是否弹出修改学院
				collegeShow: false,
				classShow: false,
				loading: false,
				collegeColumns: [
					['正在加载']
				],
				classColumns: [
					['正在加载']
				],
				form: {
					newPass: ''
				},
				collegeForm:{
					newCollege:'请选择学院'
				},
				classForm:{
					newClass: '请选择班级',
				},
				status: 'loadmore',
				chooseList:{},//打扫员可以选择的周几列表
				dynamicStateLengthOne: 0,
				dynamicStateLengthTwo: 0,
				collegeList:[],//学院信息列表
				collegeId:'',//所选学院的id
				classId:'',//所选班级的id
				classList:[],//班级信息列表
				classId:'',//所选班级id
			}
		},
		computed: {
			passwordLength() {
				return this.$store.state.passwordLength
			}
		},
		components:{
			dynamic
		},
		onLoad() {
			// this.getListClass()
			// this.getListAcademy()
			this.getUserinfo()
			this.getHotActivity()
			this.getConditions()//获取检查情况
			this.getChooseList()
			this.getCleanTask()//获取打扫任务
			this.getVoluntaryList()//获取志愿活动列表
			this.getlistJoinActivity()//获取我的志愿活动列表
			uni.stopPullDownRefresh();	// 停止当前页面的下拉刷新
		},
		methods: {
			//点击跳转详情页
			DynamicDetails(item) {
				console.log(item)
				var indexItem = JSON.stringify(item)
				uni.navigateTo({
					url: `./dynamicDetails?isPinglun=${this.isPinglun}&indexItem=${indexItem}`
					// url:"./dynamicDetails?item="+ item
				})
			},
			//点击推荐部分跳转详情页
			open(item) {
				this.listComments(item)
				var recommendItem = JSON.stringify(item)
				// console.log("000",item._id)
				uni.navigateTo({
					url: "./recommendDetail?recommendItem=" + recommendItem
					// url:"./recommendDetail"
				})
			},
			//点赞效果的实现
			dianzan(item) {
				if (item.dianzan === true) {
					item.dianzan = false
				} else {
					item.dianzan = true
				}
			},
			pinglun(item) {
				this.isPinglun = true;
				this.DynamicDetails(item)
			},
			voluntaryActcicty() {
				// this.getVoluntaryList()
				uni.navigateTo({
					url: "./voluntaryActivity"
				})
			},
			//点击失物招领图标
			lostAndFound() {
				uni.navigateTo({
					url: "./lostAndFound/lostAndFound"
				})
			},
			//点击检查详情图标
			detail() {
				uni.navigateTo({
					url: "./detail"
				})
			},
			//是否展示学院选择框
			showCollege(){
				this.collegeShow = true
				// console.log("showCollege")
			},
			//是否展示班级选择框
			showClass(){
				console.log(this.classColumns[0])
				
				this.getListClass()
				this.classShow = true
				
			},
			//确定选择的学院
			collegeConfirm(e){
				console.log(e,"college")
				this.collegeId = this.collegeList[e.indexs[0]]._id
				console.log(this.collegeId)
				this.collegeForm.newCollege = e.value[0]
				this.collegeShow = false
				// this.getListClass()
			},
			//确定选择的班级
			classConfirm(e){
				console.log(e,"class")
				this.classId = this.classList[e.indexs[0]]._id
				console.log(this.collegeId)
				this.classForm.newClass = e.value[0]
				this.classShow = false
			},
			//关闭展示学院班级选择框以及再次确认
			classClose(){
				this.showClassPop = false
				let that = this
				uni.showModal({
						title:'确认后将不能更改',
						success:function(res){
							if(res.confirm){
								console.log('确认')
								that.modifyUserInfo()
							} else {
								that.showClassPop = true
								that.classShow = true
								console.log(that.showClassPop)
								console.log("取消")
								
							}
						}
				})
			},
			collegeClose(){
				this.showCollegePop = false
				let that = this
				uni.showModal({
						title:'确认后将不能更改',
						success:function(res){
							if(res.confirm){
								console.log('确认')
								that.getListClass()
							} else {
								that.showCollegePop = true
								that.collegeShow = true
								console.log(that.showCollegePop)
								console.log("取消")
							}
						}
				})
				
			},
			//获取评论列表
			async listComments(item){
				await this.$request({
					url:'/listComments',
					data:{
						aid: item._id
					}
				}).then((res) => {
					console.log(res)
					// console.log(this.recommendData._id)
					this.pinglunList = res.data.data
					this.disposeData(this.pinglunList)
					this.$store.commit('recommentCommentsList',this.pinglunList)
				}).catch(err => {
					console.log(err)
				})
			},
			//格式化日期
			disposeData(data){
				for(var i=0;i<data.length;i++){
					data[i].comment.createdAt = transferTime.dateTimeStr('y-m-d h:i',data[i].comment.createdAt)
					if(data[i].child){
						this.disposeData(data[i].child)
					}
				}
			},
			//获取个人信息
			async getUserinfo() {
				await this.$request({
					url: '/getUserInfo'
				}).then((res) => {
					console.log(res)
					this.id = res.data.data._id
					if(res.data.data.className == ""){
						this.getListAcademy()
					}
					
				}).catch(err => {
					console.log(err)
				})
			},
			//点击加入活动
			async joinActivity(item) {
				await this.$request({
					url: '/joinActivity',
					method: 'post',
					data: {
						aid: item._id
					}
				}).then((res) => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},
			//点击收藏
			async addFavorites(item) {
				await this.$request({
					url: '/addFavorties',
					method: 'post',
					data: {
						aid: item._id
					}
				}).then((res) => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},
			//获取热门活动列表
			async getHotActivity() {
				await this.$request({
					url: '/getHotActivity',
					method: 'get'
				}).then((res) => {
					console.log(res)
					this.recommendlist = res.data.data
					for (var i = 0; i < this.recommendlist.length; i++) {
						this.recommendlist[i].actTime.start = transferTime.dateTimeStr('y-m-d h:i', res.data
							.data[i].actTime.start)
						this.recommendlist[i].actTime.end = transferTime.dateTimeStr('y-m-d h:i', res.data
							.data[i].actTime.end)
						this.recommendlist[i].applyTime.end = transferTime.dateTimeStr('y-m-d h:i', res.data
							.data[i].applyTime.end)
						this.recommendlist[i].applyTime.start = transferTime.dateTimeStr('y-m-d h:i', res.data
							.data[i].applyTime.start)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//获取打扫任务
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
			//获取积分排行列表
			getScoreSort() {
				console.log("1");
				this.$request({
					url: '/scoreSort'
				}).then((res) => {
					this.rankingList = [];
					for (let i in res.data.data) {
						if (res.data.data[i].score) {
							let length = this.rankingList.length
							this.rankingList[length] = res.data.data[i]
						}
					}
					this.$store.commit('rankingList', this.rankingList);
					uni.navigateTo({
						url: "./rankingList"
					})
				})
			},
			//获取志愿活动列表
			getVoluntaryList() {
				this.$request({
					url: '/listActivity'
				}).then((res) => {
					console.log(res,"志愿活动");
					// console.log(res.data.data[0].actTime.start.substring(0,10) + res.data.data[0].actTime.start.substring(11,16))
					this.voluntaryList = res.data.data
					// console.log(this.voluntaryList)
					for (var i = 0; i < res.data.data.length; i++) {
						this.voluntaryList[i].actTime.start = transferTime.dateTimeStr('y-m-d h:i', res.data.data[
							i].actTime.start)
						this.voluntaryList[i].actTime.end = transferTime.dateTimeStr('y-m-d h:i', res.data.data[i]
							.actTime.end)
						this.voluntaryList[i].applyTime.end = transferTime.dateTimeStr('y-m-d h:i', res.data.data[
							i].applyTime.end)
						this.voluntaryList[i].applyTime.start = transferTime.dateTimeStr('y-m-d h:i', res.data
							.data[i].applyTime.start)
					}
					this.$store.commit('voluntaryList', this.voluntaryList);
					// console.log(this.voluntaryList[0].cover)
				}).catch(err => {
					console.log(err);
				})
			},
			//获取打扫员可选周几
			async getChooseList(){
				await this.$request({
					url:'/chooseList',
					method: 'get'
				}).then((res) =>{
					this.chooseList = res.data.data
					this.$store.commit('chooseList',this.chooseList)
					// console.log(this.chooseList)
					console.log(res)
				}).catch(err =>{
					console.log(err)
				})
			},
			//获取我的志愿活动
			getlistJoinActivity(){
				this.$request({
					url:"/listJoinActivity",
				}).then(res => {
					console.log(res,"我的志愿活动")
					let myActivityList = res.data.data
					console.log(myActivityList)
					this.$store.commit('myActivityList',myActivityList)
				})
			},
			//获取学院信息
			async getListAcademy(){
				await this.$request({
					url:'/listAcademy',
					method: 'get'
				}).then((res) => {
					console.log(res,"listAcademy")
					// console.log(this.showClassPop)
					this.collegeList = res.data.data
					this.collegeColumns[0] = res.data.data.map(item=>{return item.name})
					console.log(this.collegeColumns[0])
					this.showCollegePop = true
				}).catch(err =>{
					console.log(err)
				})
			},
			//获取班级信息
			async getListClass(){
				await this.$request({
					url:'/listClass',
					method: 'post',
					data:{
						academyId:this.collegeId
					}
				}).then((res) => {
					console.log(res,"classList")
					this.classList = res.data.data
					this.classColumns[0] = res.data.data.map(v=>{return v.name})
					console.log(this.classColumns[0])
					this.showClassPop = true
				}).catch(err => {
					console.log(err)
				})
			},
			//获取检查情况
			async getConditions(){
				await this.$request({
					url:'/getConditions',
					method: 'get'
				}).then(res => {
					let checkList = res.data.data;
					console.log(res,"检查情况")
					for(var i=0;i<checkList.length;i++){
						checkList[i].createdAt = transferTime.dateTimeStr('y-m-d',res.data.data[i].createdAt)
					}
					// console.log(checkList,"666")
					this.$store.commit('checkList',checkList)
				})
			},
			// 修改密码
			close() {
				this.$refs.uForm.validate().then(res => {
					// uni.$u.toast('校验通过')
					if (res) {
						this.$request({
							url: '/modifyPass',
							method: 'post',
							data: this.form
						}).then((res) => {
							console.log(res);
							if (res.statusCode == 200) {
								this.showPop = false
								this.$refs.uToast.show({
									type: 'success',
									message: res.data.msg,
									iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
								})
							} else {
								this.$refs.uToast.show({
									type: 'error',
									message: "修改失败",
									iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
								})
							}
						})
					}
				}).catch(errors => {
					uni.$u.toast('格式错误')
				})
			},
			// 修改学院和班级  因后台bug存在，目前是直接调用了这个接口，然后上传静态数据
			async modifyUserInfo(){
				await this.$request({
					url:'/modifyUserInfo',
					method: 'post',
					data:{
						academyId: this.collegeId,
						classId: this.classId
					}
				}).then((res) => {
					console.log(res,"修改学院和班级")
					this.getChooseList()
				}).catch(err => {
					console.log(err)
				})
			}
		},
		created() {
			this.$request({
				url: '/getUserInfo'
			}).then((res) => {
				console.log(res.data.data);
				this.$store.commit("userInfo", res.data.data)
			})
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.passwordLength < 10 && this.passwordLength ? this.showPop = true : this.showPop = false;
			if (this.showPop) {
				// setRules 调用此方法，设置校验规则
				setTimeout(() => {
					// 确保获取到了 this.$refs.uForm
					this.$refs.uForm.setRules(this.rules);
				}, 200)
			}			
		},
		// 监听用户下拉操作
		onPullDownRefresh() {
			uni.reLaunch({ url: '/pages/index/index' })
			setTimeout(() => { uni.stopPullDownRefresh(); },1200)
			
		},
		// 监听用户触底操作
		async onReachBottom() {
			this.status = 'loading';
			this.dynamicStateLengthOne = await this.$refs.dynamic.getListDynamic()
			// console.log(this.dynamicStateLengthOne,this.dynamicStateLengthTwo)
			if(this.dynamicStateLengthTwo === this.dynamicStateLengthOne) {
				this.status = 'nomore';
			} else {
				this.status = 'loadmore';
			}
			this.dynamicStateLengthTwo = this.dynamicStateLengthOne
			console.log("触底啦！！！ 等会吧")
		}
	}
</script>

<style lang="scss">
	html {
		-webkit-text-size-adjust: none;
	}

	.content {
		padding: 12rpx;
		font-family: 'KaiTi', 'Times New Roman', Times, serif;
		// width: 100%;
		.bgRadiu {
			margin: 8rpx 20rpx;
			border-radius: 10px;
			overflow: hidden;
		}
	}

	//导航栏图标
	.navigationBarImg {
		display: flex;
		// width: 100% !important;
		height: 120rpx;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		margin-top: 20rpx;
		// background-color: #dcdcdc;
		// box-shadow: 0px 0px 8px #d5d5d6;
		border-radius: 16rpx 16rpx 0rpx 0rpx;
	}

	//导航栏文字
	.navigationBarTxt {
		display: flex;
		height: 60rpx;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		// background-color: #dcdcdc;
		// box-shadow: 0px 0px 8px #d5d5d6;
		margin-bottom: 10rpx;
		// border-radius: 0rpx 0rpx 16rpx 16rpx;
		border-bottom: 1rpx solid #c3c3c3;
	}

	//推荐活动部分（大家都在参与）
	.primary {
		padding: 5rpx;
	}

	.indicatorBar {
		margin: 15rpx;
	}

	.indicatorImage {
		margin-left: 20rpx;
	}

	//文字（如大家都在参与，动态字样）
	.character {
		font-size: 36rpx;
		font-weight: 600;
		margin-bottom: 20rpx;
		padding-left: 36rpx;
	}

	//动态里的个人信息栏
	.PIM {
		display: flex;
		text-align: center;
		// flex-direction: row;
		// text-align: flex-end;
		height: 100rpx;
		padding-left: 16rpx;
		margin-top: 10rpx;
	}

	//动态里的时间
	.date {
		margin: 10rpx 42rpx 0rpx 0rpx;
		font-size: 30rpx;
	}

	//动态里的点赞，评论，点击参加部分
	.behavior {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 18rpx;
	}

	//动态里的活动部分
	.activityContent {
		margin-top: 18rpx;
	}

	//动态
	.dynamicState {
		box-shadow: 0px 0px 8px #d5d5d6;
		height: 450rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 16rpx;
	}

	.btn {
		width: 60%;
		margin: 6rpx auto;
	}
	
	.collegeAndClass{
		width: 300rpx;
	}
	
</style>
