<template>
	<view class="content">
		<view class="box top">
			<!-- 标题及封面 -->
			<view class="topSon">
				<view class="img">
					<u--image :showLoading="true" :src="recommendData.cover" width="80px" height="80px" @click="click"></u--image>
				</view>
				<view class="title">
					{{recommendData.title}}
				</view>
			</view>
			<!-- 人数 -->
			<view class="info">
				可参与人数: {{recommendData.capacity}}	已报名: {{appliedPerson}}   活动积分:{{recommendData.score}}
			</view>
			<!-- 时间 -->
			<view class="times">
				<view class="time">报名时间:{{recommendData.applyTime.start + " - " +recommendData.applyTime.end}}</view>
				<view class="time">打扫时间:{{recommendData.actTime.start + " - " + recommendData.actTime.end}}</view>
			</view>
			<!-- 地点 -->
			<view class="address">打扫地址:{{recommendData.content}}</view>
		</view>
		<!-- 发起人信息 -->
		<view class="box middle">
			<view class="middleSon">发起人:{{recommendData.ownerName}}</view>
			<view class="middleSon">联系方式:{{recommendData.ownerEmail}}</view>
		</view>
		<!-- 打扫成员 -->
		<view class="box footer">
			<view class="members">参与成员</view>
			<view class="membersInfo">
				<!-- 所有打扫人员 -->
				<view class="membersInfoSon" v-for="(item, index) in recommendData.applyPerson" :key="index">
					<!-- 签到状态 -->
					<!-- <view class="status" :class="item.status === '未签到' ? 'a' : 'b'">{{item.status}}</view> -->
					<!-- 个人头像 -->
					<view class="img">
						<u-avatar :src="item.avatar"></u-avatar>
					</view>
					{{item.nickname}}
				</view>
			</view>
		</view>
		<!-- 收藏评论参加 -->
		<view class="behavior">
			<u-icon :name="recommendData.favorite == true ? iconAct : icon" size="60rpx" :label="recommendData.favorite == true ? yishoucang : shoucang" @click="dianzan()"></u-icon>
			<u-icon name="chat" size="60rpx" label="评论"></u-icon>
		</view>
		<!-- 评论区域 -->
		<view class="comment">
			<comment :data="recommentCommentsList" :isAct="isAct"></comment>
		</view>
		<!-- 报名按钮 -->
		<view class="fixed">
			<u-button :color="color" :text="text" type="info" @click="joinActivity()" :disabled="bool"></u-button>
		</view>
	</view>
</template>

<script>
	import comment from '../../components/comment/index.vue'
	import transferTime from '../../components/transferTime.js'
	export default{
		data(){
			return{
				recommendData:{},
				appliedPerson: 0,
				//收藏图标
				icon:"bookmark",
				iconAct: "bookmark-fill",
				yishoucang:"已收藏",
				shoucang:"收藏",
				isDianzan: false,
				pinglunList: [],
				color: '#ff895e',	// 按钮颜色
				bool: false,		// 是否禁用按钮
				isAct: true,    //是否为热门活动    
			}
		},
		components:{
			comment,
			transferTime
		},
		computed:{
			recommentCommentsList(){
				return this.$store.state.recommentCommentsList;
			}
		},
		methods:{
			dianzan(){
				this.addFavorites()
				if(this.recommendData.favorite === false){
					this.recommendData.favorite = true
				}else{
					this.recommendData.favorite = false
				}
			},
			//判断报名或者活动是否已结束
			isActPass(){
				var time = new Date()
				var time1 = this.recommendData.applyTime.end;
				var time4 = this.recommendData.actTime.end;
				var date = new Date(time1.replace(/-/g,'/'));
				var date1 = new Date(time4.replace(/-/g,'/'));
				var time2 = date.getTime();//活动报名结束时间距离1970年的毫秒数
				var time5 = date1.getTime();//活动结束时间距离1970年的毫秒数
				var time3 = (time.getTime())//当前时间距离1970年的毫秒数
				if(time3 > time2 && time3 < time5){
					this.color = '';
					this.bool = true;
					this.text = '报名已结束';
				} else if(time3 > time2 && time3 > time5){
					this.color = '';
					this.bool = true;
					this.text = '活动已结束';
				}
				uni.hideLoading()
			},
			//评论
			async commentActivity(){
				await this.$request({
					url:'/commentActivity',
					method: 'post',
					data:{
						aid: this.recommendData._id,
						content: this.value
					}
				}).then((res) => {
					console.log(res)
					this.value = ''
				}).catch(err => {
					console.log(err)
				})
			},
			//报名参加
			async joinActivity(){
				await this.$request({
					url:'/joinActivity',
					method: 'post',
					data: {aid:this.aid}
				}).then((res) => {
					console.log(res)
					this.color = '';
					this.bool = true;
					this.text = '已报名';
				}).catch(err => {
					console.log(err)
				})
			},
			//点击收藏
			async addFavorites(){
				await this.$request({
					url:'/addFavorites',
					method: 'post',
					data: {aid: this.recommendData._id}
				}).then((res) => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			}
		},
		onLoad(options){
			var item = JSON.parse(options.recommendItem)
			this.recommendData = item
			// console.log("recommendData",this.recommendData)
			this.appliedPerson = this.recommendData.applyPerson.length
			this.isActPass()
			// uni.hideLoading()
		},
		// created() {
		// 	uni.showLoading({
		// 		title:'页面加载中'
		// 	})
		// }
	}
</script>

<style lang="scss">
	.content {
		margin: 0;
		padding: 20rpx 10rpx 10rpx 10rpx;
		padding-top: 20rpx;
		.box {
			box-sizing: border-box;
			width: 90%;
			border-radius: 20rpx;
			margin: 0 5% 20rpx 5%;
			box-shadow: 0px 0px 6px #c6c6c6;
			font-family: 'KaiTi', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		}
		.top {
			height: 500rpx;
			font-size: 30rpx;
			// 标题及封面
			.topSon {
				display: flex;
				font-family: 'SimHei', Courier, monospace;
				font-size: 40rpx;
				font-weight: 600;
				.img {
					padding: 20rpx;
					margin: auto;
				}
				.title {
					width: calc(100% - 100px);
					height: 200rpx;
					line-height: 200rpx;
					padding-left: 40rpx;
				}
			}
			// 人数
			.info {
				font-size: 22rpx;
				color: #666;
				padding: 0 0 16rpx 20rpx;
				border-bottom: 4rpx solid #bbb;
			}
			// 时间
			.times {
				box-sizing: border-box;
				height: 140rpx;
				line-height: 60rpx;
				width: 100%;
				padding: 10rpx 0 0 20rpx;
				border-bottom: 4rpx solid #bbb;
			}
			// 地点
			.address {
				box-sizing: border-box;
				height: 100rpx;
				line-height: 100rpx;
				width: 100%;
				padding-left: 40rpx;
			}
		}
		// 发起人信息
		.middle {
			height: 160rpx;
			line-height: 60rpx;
			padding: 20rpx 0 0 40rpx;
		}
		// 打扫成员
		.footer {
			// height: 400rpx;
			padding: 30rpx;
			.members {
				height: 40rpx;
				width: 100%;
			}
			.membersInfo {
				display: flex;
				flex-wrap: wrap;
				.membersInfoSon {
					position: relative;
					display: flex;
					flex-direction: column;
					padding: 20rpx;
					text-align: center;
					.status {
						position: absolute;
						top: 24rpx;
						right: -20rpx;
						z-index: 99;
						height: 30rpx;
						width: 78rpx;
						font-size: 12rpx;
						border-radius: 20rpx;
						text-align: center;
					}
					.a {
						background-color: #9f9f9f;
					}
					.b {
						background-color: #5acf56;
					}
					.img {
						margin: auto;
						padding-bottom: 10rpx;
					}
				}
			}
		}
		//收藏评论点击参加
		.behavior{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin-top: 38rpx;
		}
		// 报名按钮
		.fixed {
			// position: fixed;
			// bottom: 0;
			// right: 0;
			// z-index: 100;
			width: 100%;
			margin-top: 30rpx;
			border-radius: 20rpx;
			box-shadow: 0px 0px 14px #8cb7ffc7;
		}
		
		.comment{
			margin-top: 40rpx;
		}
	}
</style>
