<template>
	<view class="contant">
		<view class="Uinput">
			<view>关键词搜索</view>
			<view class="sousuo">
				<u--input placeholder="请输入查找物品关键字" v-model="value" @confirm="confirm"></u--input>
				<view class="sousuoBtn">
					<u-button text="搜索" type="primary" @click="confirm"></u-button>
				</view>
			</view> 
		</view>
		<u-tabs :list="list" @click="uTabs" :scrollable="false"></u-tabs>
		<foundObject v-if="index == 0" ref="foundObject"></foundObject>
		<lostObject v-if="index == 1" ref="lostObject"></lostObject>
		<u-loadmore :status="status" :line="true"/>
	</view>
</template>

<script>
	import foundObject from './foundObject.vue'
	import lostObject from './lostObject.vue'
	import transferTime from '../../../components/transferTime.js'
	export default {
		components:{
			foundObject,
			lostObject
		},
		data() {
			return {
				list:[{
					name:"寻物启事"
				},{
					name:"失物招领"
				}],
				//收藏图标
				icon:"bookmark",
				iconAct: "bookmark-fill",
				index:0,
				allList:[],//所有的列表
				foundList:[],//寻物启事列表
				lostList:[],//失物招领列表
				newFoundList:[],//新的寻物启事
				newLostList:[],//新的失物招领
				RnewFoundList:[],//寻物启事页面的关键字列表
				RnewLostList:[],//失物招领页面的关键字列表
				value:'', //input输入的内容
				kongList:[],//作用是页面跳转后清空关键字列表
				status: 'loadmore',
				foundIndex: 5,
				lostIndex: 5
			}
		},
		methods: {
			//收藏效果的实现
			dianzan(item){
				this.addFavorites()
				if(item.dianzan === true){
					item.dianzan = false
				} else {
					item.dianzan = true
				}
			},
			confirm(){
				this.searchByKey()
				uni.showLoading({
				  title: "正在努力搜索",
				});
			},
			lostAndFoundDetail(item){
				var lostAndFoundItem = JSON.stringify(item)
				uni.navigateTo({
					url:"./lostAndFoundDetail?lostAndFoundItem="+ lostAndFoundItem
				})
			},
			uTabs(item){
				console.log(item.index)
				this.index = item.index
			},
			//点击收藏
			async addFavorites(item){
				await this.$request({
					url:'/addFavorties',
					method: 'post',
					data: {aid: item._id}
				}).then((res) => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},
			//获取列表
			async getListLosts(){
				await this.$request({
					url:'/listLosts'
				}).then((res) => {
					console.log(res)
					this.allList = res.data.data
					for(var i=0;i<this.allList.length;i++){
						this.allList[i].createdAt = transferTime.dateTimeStr('y-m-d h:i',res.data.data[i].createdAt)
						// for(let j in this.allList[i].images) {
						// 	this.allList[i].images[j] = JSON.parse(this.allList[i].images[j]);
						// }
						if(this.allList[i].type == "失物招领"){
							this.lostList.push(this.allList[i])
						}else{
							this.foundList.push(this.allList[i])
						}
					}
					this.$store.commit('foundList',this.foundList.slice(0,5));
					this.$store.commit('lostList',this.lostList.slice(0,5));
					// console.log(this.foundList.length,this.lostList.length);
					
				}).catch(err => {
					console.log(err)
				})
			},
			//查找关键字的活动
			async searchByKey(){
				await this.$request({
					url:'/searchByKey',
					data:{
						key: this.value
					}
				}).then((res) => {
					console.log(res)
					for(let i = 0; i < res.data.data.length;i++){
						res.data.data[i].createdAt = transferTime.dateTimeStr('y-m-d h:i',res.data.data[i].createdAt)
						if(res.data.data[i].type == '失物招领' && this.index == 1){
							this.RnewLostList.push(res.data.data[i])
						} else if(res.data.data[i].type == '寻物启事' && this.index == 0){
							this.RnewFoundList.push(res.data.data[i])
						}
					}
					 uni.hideLoading();
					if(this.RnewLostList.length == 0 && this.index == 1){
						uni.showModal({
								title:'未查找到相关活动'
						})
					} else if(this.RnewFoundList.length == 0 && this.index == 0){
						uni.showModal({
								title:'未查找到相关活动'
						})
					}
					this.value = ''
					this.newFoundList = this.RnewFoundList;
					this.newLostList = this.RnewLostList
					this.$store.commit('newFoundList',this.newFoundList)
					this.$store.commit('newLostList',this.newLostList)
					this.RnewFoundList = []
					this.RnewLostList = []
				}).catch(err => {
					console.log(err)
				})
			}
		},
		onNavigationBarButtonTap:function(e){
			// console.log(e.text)
			uni.navigateTo({
				url:'../createActivity'
			})
		},
		onLoad(){
			this.getListLosts()
			this.$store.commit('newLostList',this.kongList)
			this.$store.commit('newFoundList',this.kongList)
			uni.showLoading({
				title:'页面加载中'
			})
		},
		// 监听用户下拉操作
		onPullDownRefresh() {
			uni.redirectTo({ url: '/pages/index/lostAndFound/lostAndFound' })
			setTimeout(() => { uni.stopPullDownRefresh(); },1200)
		},
		// 监听用户触底操作
		async onReachBottom() {
			this.status = 'loading';
			console.log(this.index)
			// 寻物启事懒加载
			if(this.index === 0) {
				console.log(this.foundList.slice(0,Math.min(this.foundIndex+5,this.foundList.length)));
				this.$store.commit('foundList',this.foundList.slice(0,Math.min(this.foundIndex+5,this.foundList.length)));
				if(this.foundIndex+5 >= this.foundList.length) {
					this.status = 'nomore';
				} else {
					this.foundIndex = this.foundIndex + 5;
					this.status = 'loadmore';
				}
			// 失物招领懒加载
			} else if(this.index === 1) {
				console.log(this.lostList);
				console.log(this.lostList.slice(0,Math.min(this.lostIndex+5,this.lostList.length)));
				this.$store.commit('lostList',this.lostList.slice(0,Math.min(this.lostIndex+5,this.lostList.length)));
				if(this.lostIndex+5 >= this.lostList.length) {
					this.status = 'nomore';
				} else {
					this.lostIndex = this.lostIndex + 5;
					this.status = 'loadmore';
				}
				console.log(this.lostIndex);
			}
			console.log("触底啦！！！ 等会吧")
		}
	}
</script>

<style lang="scss">
	.contant{
		padding: 40rpx 25rpx 20rpx 20rpx;
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
		box-shadow: 0px 0px 8px #d5d5d6;
		height: 450rpx;
		padding: 20rpx;
		margin-bottom: 10rpx;
		border-radius: 16rpx;
	}
	.Uinput{
		margin-bottom: 20rpx;
	}
	.sousuo{
		display: flex;
		justify-content: space-between;
	}
	.sousuoBtn{
		margin-left: 6rpx;
		width: 100rpx;
	}
</style>
