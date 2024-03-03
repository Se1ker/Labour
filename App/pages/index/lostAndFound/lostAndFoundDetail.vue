<template>
	<view class="contant">
		<view class="lostAndFound" >
			<view>
				<!-- 个人信息部分 -->
				<view class="PIM">
					<u--image :src="lostAndFoundList.avatar" width="100rpx" height="100rpx" shape="circle"></u--image>
					<u--text :text="lostAndFoundList.ownerName" margin="30rpx" size="35rpx"></u--text>
					<view class="date">{{lostAndFoundList.createdAt}}</view>
				</view>
				<!-- 活动内容 -->
				<view class="activityContent">
					<u--text :lines="1" :text="lostAndFoundList.title" size="20" :bold="true" margin="5rpx 0rpx 15rpx 0rpx"></u--text>
					<u--text :text="lostAndFoundList.content"></u--text>
					<!-- <view v-for="(model,Rindex) in lostAndFoundList.images" :key="Rindex">
						<u--image :src="model" width="200rpx" height="200rpx" :fade="true" duration="450"></u--image>
					</view> -->
					<u-album :urls="lostAndFoundList.images"></u-album>
				</view>
			</view>
			<!-- 状态 -->
			<view class="behavior">
				<u-icon name="chat" size="60rpx" label="评论"></u-icon>
				<u-icon :name="shoucang === true ? iconAct : icon" size="60rpx" label="收藏" @click="dianzan()"></u-icon>
			</view>
			<view>
				<comment :id='lostAndFoundList._id' :data='comments' :isAct="isAct"></comment>
			</view>
			<u-button :text="text" @click="doneLosts()" :disabled="disabled" class="Ubtn" type="primary"></u-button>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import comment from '../../../components/comment/index.vue'
	export default{
		data(){
			return{
				lostAndFoundList:{},
				//收藏图标
				icon:"bookmark",
				iconAct: "bookmark-fill",
				shoucang: false,
				id:'',
				isAct: false,
				text:"完结活动",
				disabled: true,
				uid: ''//当前用户id
			}
		},
		components:{
			comment
		},
		computed:{
			comments(){
				return this.$store.state.comments;
			},
			userInfo(){
				return this.$store.state.userInfo;
			}
		},
		onLoad(options){
			this.getUserInfo()
			var item = JSON.parse(options.lostAndFoundItem)
			this.lostAndFoundList = item
			if(this.lostAndFoundList.uid == this.userInfo._id && this.lostAndFoundList.isDone == false){
				this.disabled = false
			}else if(this.lostAndFoundList.isDone == true){
				this.text = '活动已完结'
			}
			
			uni.showLoading({
				title:'页面加载中'
			})
		},
		methods:{
			//收藏效果的实现
			dianzan(){
				if(this.shoucang === true){
					this.shoucang = false
				} else {
					this.shoucang = true
				}
				this.addFavorites()
			},
			//点击收藏
			async addFavorites(){
				await this.$request({
					url:'/addFavorites',
					method: 'post',
					data: {aid: this.lostAndFoundList._id}
				}).then((res) => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},
			//获取个人信息
			async getUserInfo(){
				await this.$request({
					url:'/getUserInfo',
				}).then((res) => {
					console.log(res)
					
				}).catch(err => {
					console.log(err)
				})
			},
			//完结活动
			async doneLosts(){
				await this.$request({
					url:'/doneLosts',
					method: 'post',
					data:{
						lid: this.lostAndFoundList._id
					}
				}).then((res) => {
					console.log(res)
					this.text = "活动已完结"
					this.disabled = true
					if (res.statusCode == 200) {
						this.showPop = false
						this.$refs.uToast.show({
							type: 'success',
							message: "活动已完结",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
						})
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//获取个人信息
			async getUserinfo() {
				await this.$request({
					url: '/getUserInfo'
				}).then((res) => {
					console.log(res)
					this.uid = res.data.data._id
					let data = res.data.data 
					this.$store.commit('userInfo',data)
					if(this.userInfo.favorites.indexOf(this.lostAndFoundList._id) !== -1){
						this.shoucang = true
					}
				}).catch(err => {
					console.log(err)
				})
			},
		}
	}
</script>

<style lang="scss">
	.contant{
		padding: 30rpx 15rpx 10rpx 10rpx;
		font-family: 'KaiTi','Times New Roman', Times, serif;
	}
	.PIM{
		display: flex;
		text-align: center;
		// flex-direction: row;
		// text-align: flex-end;
		height: 100rpx;
		padding-left: 16rpx;
		margin-top: 10rpx;
	}
	//动态里的时间
	.date{
		margin: 10rpx 42rpx 0rpx 0rpx;
		font-size: 30rpx;
		color: #6d6f74;
		line-height: 94rpx;
	}
	//动态里的点赞，评论，点击参加部分
	.behavior{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 18rpx;
	}
	//动态里的活动部分
	.activityContent{
		margin-top: 18rpx;
	}
	//动态
	.lostAndFound{
		height: 450rpx;
		padding: 20rpx;
		margin-bottom: 10rpx;
		border-radius: 16rpx;
	}
	.Ubtn{
		margin-top: 100rpx;
	}
</style>
