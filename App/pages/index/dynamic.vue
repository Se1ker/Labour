<template>
	<view>
		<view v-for="(item,index) in dynamicList" :key="index" class="dynamicState">
			<view @click="DynamicDetails(item)">
				<view class="PIM">
					<u--image :src="item.avatar" width="100rpx" height="100rpx" shape="circle"></u--image>
					<u--text :text="item.ownerName" margin="30rpx" size="35rpx"></u--text>
					<view class="date">{{item.updatedAt}}</view>
				</view>
				<view class="activityContent">
					<u--text :lines="1" :text="item.title" margin="5rpx 0rpx 15rpx 0rpx"></u--text>
					<view v-if="item.images">
						<!-- <view v-for="(model,index) in item.images" :key="index">
							<u--image :src="model" width="200rpx" height="200rpx" :fade="true"
								duration="450"></u--image>
						</view> -->
						<u-album :urls="item.images"></u-album>
					</view>
					<view v-else>
						<u--image :src="item.cover" width="150px" height="150px"></u--image>
					</view>
				</view>
			</view>
			<view class="behavior">
				<!-- <u-icon :name="item.dianzan == true ? iconAct : icon" size="60rpx" label="收藏"
					@click="dianzan(item)"></u-icon> -->
				<u-icon name="chat" size="60rpx" label="评论" @click="DynamicDetails(item)"></u-icon>
				<!-- <u-icon :name="item.favorite == true ? iconAct : icon" size="60rpx" :label="voluntaryList.favorite == true ? yishoucang : shoucang" @click="shoucang()"></u-icon> -->
			</view>
		</view>
	</view>
</template>

<script>
	import transferTime from '../../components/transferTime.js'
	export default {
		name: 'dynamic',
		
		data() {
			return {
				dynamicList:[],
				skip: 0,
				icon:"bookmark",
				iconAct: "bookmark-fill",
				yishoucang:"已收藏",
				shoucang:"收藏"
			}
		},
		methods:{
			DynamicDetails(item){
				var Item = JSON.stringify(item)
				if(item.isDone === undefined){
					this.getListComments(item)
					uni.navigateTo({
						url:'./voluntaryDetail?voluntaryItem='+ Item
					})
				}else{
					this.listComments(item)
					uni.navigateTo({
						url:"./lostAndFound/lostAndFoundDetail?lostAndFoundItem="+Item
					})
				}
				// console.log(item.isDone)
			},
			//点击收藏
			// shoucang(){
				
			// },
			//获取失物招领&寻物启事评论列表
			async listComments(item) {
			  await this.$request({
			    url: '/losts/listComments',
			    data: {
			      lid: item._id
			    }
			  }).then((res) => {
			    // console.log("foudlist",res)
			    this.Comments = res.data.data
			    this.disposeData(this.Comments)
			    this.$store.commit('comments', this.Comments)
			  }).catch(err => {
			    console.log(err)
			  })
			},
			//获取志愿活动评论列表
			getListComments(item){
				this.$request({
					url:'/listComments',
					data: {aid: item._id}
				}).then((res) => {
					this.commentsList = res.data.data
					this.disposeData(this.commentsList)
					this.$store.commit('commentsList',this.commentsList)
				}).catch(err => {
					console.log(this.err)
				})
			},
			//处理数据
			disposeData(data) {
			  for (var i = 0; i < data.length; i++) {
			    data[i].comment.createdAt = transferTime.dateTimeStr('y-m-d h:i', data[i].comment.createdAt)
			    // console.log(data[i].comment.createdAt)
			    if (data[i].child) {
			      this.disposeData(data[i].child)
			    }
			  }
			},
			//获取动态列表
			async getListDynamic(){
				// 瓢
				var arr = new Array();
				await this.$request({
					url:'/listDynamic',
					data: {
						"skip": this.skip,
						"limit": 3
					}
				}).then((res) => {
					var data = transferTime.dateTimeStr('y-m-d h:i', res.data.data[0].updatedAt)
					if(res.statusCode === 200) {this.skip=this.skip+3}
					arr = JSON.parse(JSON.stringify(res.data.data))
					for(var i = 0; i < arr.length; i++){
						arr[i].updatedAt = transferTime.dateTimeStr('y-m-d h:i', arr[i].updatedAt)
						arr[i].createdAt = transferTime.dateTimeStr('y-m-d h:i', arr[i].createdAt)
						if(arr[i].actTime !== undefined){
							arr[i].actTime.start = JSON.parse(JSON.stringify(transferTime.dateTimeStr('y-m-d h:i', arr[i].actTime.start)))
							arr[i].actTime.end = transferTime.dateTimeStr('y-m-d h:i', arr[i].actTime.end)
							arr[i].applyTime.end = transferTime.dateTimeStr('y-m-d h:i', arr[i].applyTime.end)
							arr[i].applyTime.start = transferTime.dateTimeStr('y-m-d h:i', arr[i].applyTime.start)
						}
					}
					// 把瓢中的东西放入this.dynamicList, 瓢清空
					this.dynamicList.push(...arr);
					arr = [];
				}).catch(err => {
					console.log(err)
				})
				return this.dynamicList.length;
			}
		},
		created(){
			this.getListDynamic()
		}
	}
</script>

<style lang="scss">
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
		// height: 600rpx;
		height: auto!important;
		padding: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 16rpx;
	}
</style>
