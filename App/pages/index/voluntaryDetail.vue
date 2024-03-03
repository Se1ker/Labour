<template>
	<view class="content">
		<view class="box top">
			<!-- 标题及封面 -->
			<view class="topSon">
				<view class="img">
					<u--image :showLoading="true" :src="voluntaryList.cover" width="80px" height="80px" @click="click"></u--image>
				</view>
				<view class="title">
					{{voluntaryList.title}}
				</view>
			</view>
			<!-- 人数 -->
			<view class="info">
				可参与人数: {{voluntaryList.capacity}}	已报名: {{appliedPerson}}   活动积分:{{voluntaryList.score}}
			</view>
			<!-- 时间 -->
			<view class="times">
				<view class="time">报名时间:{{voluntaryList.applyTime.start + " - " +voluntaryList.applyTime.end}}</view>
				<view class="time">打扫时间:{{voluntaryList.actTime.start + " - " + voluntaryList.actTime.end}}</view>
			</view>
			<!-- 地点 -->
			<view class="address">打扫地址:{{voluntaryList.location}}</view>
		</view>
		<!-- 发起人信息 -->
		<view class="box middle">
			<view class="middleSon">发起人:{{voluntaryList.ownerName}}</view>
			<view class="middleSon">联系方式:{{voluntaryList.ownerEmail}}</view>
		</view>
		<!-- 打扫成员 -->
		<view class="box footer">
			<view class="members">打扫成员</view>
			<view class="membersInfo">
				<!-- 所有打扫人员 -->
				<view class="membersInfoSon" v-for="(item, index) in voluntaryList.applyPerson" :key="index">
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
			<u-icon :name="voluntaryList.favorite == true ? iconAct : icon" size="60rpx" :label="voluntaryList.favorite == true ? yishoucang : shoucang" @click="dianzan()"></u-icon>
			<u-icon name="chat" size="60rpx" label="评论"></u-icon>
		</view>
		<!-- <view v-for="(item,index) in pinglunList" :key="index"  class="pinglun">
			<view>{{item.owner + " : " + item.content}}</view>
			<view >
				<u-icon :name="isPinglunDZ == true ? iconAct1 : icon1" size="60rpx" :label="isPinglunDZ" @click="dianZanPL()"></u-icon>
			</view>
			<u-icon name="chat" size="60rpx" label="回复"></u-icon>
		</view> -->
		<!-- <view class="pinglun">
			<new-try :children="commentsList" @replypl="replypl"></new-try>
		</view> -->
		<view class="pinglun">
			<comment :data='commentsList' :id='this.aid' :isAct="isAct"></comment>
		</view>
		<!-- 报名按钮 -->
		<view class="fixed">
			<u-button :color="color" :text="text" type="info" @click="joinActivity()" :disabled="bool"></u-button>
		</view>
		 <u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import comment from '../../components/comment/index.vue'
	export default {
		components: {
			comment
		},
		computed:{
			commentsList(){
				return this.$store.state.commentsList;
			}
		},
		data() {
			return {
				// src: '/static/releaseTask.png',
				color: '#ff895e',	// 按钮颜色
				bool: false,		// 是否禁用按钮
				text: '报名',		// 按钮文字
				founder: '花木人',							 // 活动创始人
				phoneNumber: '12345678900',			// 电话号码
				voluntaryList:{},
				appliedPerson:0,
				aid:'', //该活动的id
				content: '',
				//收藏图标
				icon:"bookmark",
				iconAct: "bookmark-fill",
				//点赞评论图标
				icon1:"thumb-up",
				iconAct1: "thumb-up-fill",
				shoucang: '收藏',
				yishoucang :'已收藏',
				isAct: true
			}
		},
		methods: {
			// 报名功能
			// SignIn() {
			// 	this.color = '';
			// 	this.bool = true;
			// 	this.text = '已报名';
			// },
			dianzan(){
				this.addFavorites()
				if(this.voluntaryList.favorite === false){
					this.voluntaryList.favorite = true
				}else{
					this.voluntaryList.favorite = false
				}
			},
			//判断报名或者活动是否已结束
			isActPass(){
				var time = new Date()
				var time1 = this.voluntaryList.applyTime.end;
				var time4 = this.voluntaryList.actTime.end;
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
			},
			//更新活动信息
			async getRefreshedList(){
				await this.$request({
					url:'/getActivityById',
					data: {aid:this.aid}
				}).then((res) => {
					// console.log(res.data)
					// console.log(this.aid)
					this.voluntaryList.applyPeople = res.data.data.applyPeople
					// console.log(this.voluntaryList.applyPerson.indexOf(this.aid))
					for(var i=0;i < this.voluntaryList.applyPerson.length;i++){
						if(this.aid == this.voluntaryList.applyPerson[i].uid){
							this.text = '已报名';
							this.bool = true;
							this.color = '';
						}
					}
				}).catch(err => {
					console.log(err);
				})
			},
			//报名参加
			async joinActivity(){
				if(this.voluntaryList.isPass == true){
					await this.$request({
						url:'/joinActivity',
						method: 'post',
						data: {aid:this.aid}
					}).then((res) => {
						console.log(res)
						if (res.statusCode == 200) {
							this.color = '';
							this.bool = true;
							this.text = '已报名';
							this.$refs.uToast.show({
								type: 'success',
								message: "报名成功",
								iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
							})
						
						}else{
							this.$refs.uToast.show({
							type: 'error',
							message: res.data.msg,
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
							})
						}
					}).catch(err => {
						console.log(err)
					})
				} else {
					this.$refs.uToast.show({
					type: 'error',
					message: "当前活动未通过审核",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
					})
				}
			},
			//点击收藏
			async addFavorites(){
				await this.$request({
					url:'/addFavorites',
					method: 'post',
					data: {aid: this.aid}
				}).then((res) => {
					// this. = res.data.data
					console.log(res)
				}).catch(err => {
					concole.log(err)
				})
			},
			async replyComment(){
				await this.$request({
					url:'/replyComment',
					method: 'post',
					data:{
					 	reply: this.cmid,
					 	content: this.value,
						belong: this.caid
					}
				}).then((res) => {
					this.value = ''
					// console.log(111)
					console.log(res)
				}).catch(err => {
					concole.log(err)
				})
			},
			//评论活动
			async commentActivity(){
				await this.$request({
					url:'/commentActivity',
					method: 'post',
					data:{
						aid: this.aid,
						content: this.value
					}
				}).then((res) => {
					this.value = ''
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
					this.comment.nickname = res.data.nickname;
					this.comment.avatar = res.data.avatar;
					this.comment.liked = false;
					this.comment.content = this.value;
					this.showData(this.commentsList)
				}).catch(err => {
					console.log(err)
				})
			},
		},
		onLoad(options) {
			var item = JSON.parse(options.voluntaryItem)
			this.voluntaryList = item
			this.appliedPerson = this.voluntaryList.applyPerson.length
			this.aid = this.voluntaryList._id
			this.getRefreshedList()
			this.isActPass()
		}
	}
</script>

<style lang="scss">
	.content {
		margin: 0;
		padding: 0;
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
				font-size: 30rpx;
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
		.pinglun{
			margin-top: 10rpx;
			padding: 30rpx
		}
		// 报名按钮
		.fixed {
			width: 100%;
			margin-top: 30rpx;
			border-radius: 20rpx;
			box-shadow: 0px 0px 14px #8cb7ffc7;
		}
		.myUl{
			list-style: none;
			padding: 0;
			margin: 0;
		}
	}
</style>
