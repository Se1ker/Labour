<template>
	<view class="content">
		<view class="dynamicState" >
			<view>
				<view class="PIM">
					<u--image :src="dynamicList.touxiang" width="100rpx" height="100rpx" shape="circle"></u--image>
					<u--text :text="dynamicList.name" margin="30rpx" size="35rpx"></u--text>
					<view class="date">{{dynamicList.date}}</view>
				</view>
				<view class="activityContent">
					<u--text :lines="1" :text="dynamicList.activity"></u--text>
					<u--image :src="dynamicList.dynamicStateImg" width="200rpx" height="200rpx" :fade="true" duration="450" margin=" 20rpx 0rpx 0rpx 0rpx"></u--image>
				</view>
			</view>
			<view class="behavior">
				<u-icon :name="dynamicList.dianzan == true ? iconAct : icon" size="60rpx" label="收藏" @click="dianzan()"></u-icon>
				<u-icon name="chat" size="60rpx" label="评论"></u-icon>
				<u-icon name="man-add" size="60rpx" label="点击参加"></u-icon>
			</view>
			<view class="inputPinglun">
				<u--input  placeholder="请输入评论内容" border="surround" v-model="content" :focus="focus" @confirm="confirm"></u--input>
			</view>
			<view v-for="(item,index) in pinglunList" :key="index"  class="pinglun">
				<view>{{item.owner + " : " + item.content}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				//收藏图标
				icon:"bookmark",
				iconAct: "bookmark-fill",
				dynamicList:{},
				content:'',
				pinglunList:[],
				focus: false,
				id:''
			}
		},
		onLoad(options){
			this.getListComments()
			var item = JSON.parse(options.indexItem)
			console.log(options)
			console.log(options.isPinglun)
			this.dynamicList = item
			console.log(this.dynamicList)
			if(options.isPinglun !== false){
				this.focus = true
			}else{
				this.foucs = false
			}
		},
		methods:{
			//点赞效果的实现
			dianzan(){
				this.addFavorites()
				console.log(this.dynamicList)
				if(this.dynamicList.dianzan === true){
					this.dynamicList.dianzan = false
				} else {
					this.dynamicList.dianzan = true
				}
			},
			//点击评论
			confirm(){
				this.content = ''
				this.commentAct()
				this.getListComments()
			},
			//获取评论列表
			async getListComments(){
				await this.$request({
					url:'/listComments',
					data:{aid:this.dynamicList._id}
				}).then((res) => {
					console.log(res)
					this.pinglunList = res.data.data
				}).catch(err =>{
					console.log(err)
				})
			},
			//点击评论
			async commentAct(){
				await this.$request({
					url:'/commentActivity',
					data:{
						aid:this.dynamicList._id,
						content:this.content
					}
				}).then((res) => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},
			//点击收藏
			async addFavorites(){
				await this.$request({
					url:'/addFavorties',
					method: 'post',
					data: {aid: this.id}
				}).then((res) => {
					console.log(res)
				}).catch(err => {
					concole.log(err)
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding: 12rpx;
		font-family: 'KaiTi','Times New Roman', Times, serif;
		// width: 100%;
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
	}
	//动态里的点赞，评论，点击参加部分
	.behavior{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 38rpx;
	}
	//动态里的活动部分
	.activityContent{
		margin-top: 38rpx;
	}
	.pinglun{
		margin-top: 28rpx;
	}
	.putBtn{
		width: 150rpx;
		margin-left: 15rpx;
	}
	.inputPinglun{
		display: flex;
		justify-content: space-between;
	}
</style>
