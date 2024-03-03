<template>
	<view v-if="model">
		<li class="myLi">
			<view :style="{marginLeft:model.comment.reply !== null ? '90rpx' : '20rpx'}">
				<view class="AndPIM">
					<view class="PIM">
						<u--image :src="model.comment.avatar" width="80rpx" height="80rpx" shape="circle"></u--image>
						<view class="userName">{{model.comment.nickname}}</view>
					</view>
					<u-icon :name="model.comment.liked == true ? iconAct : icon" size=30 @click="dainzan(model)">
					</u-icon>
				</view>
		
				<!-- <view v-if="model.comment.reply">
				{{ "对"+fathername +"的回复:"}}
			</view>
			<view>{{ model.comment.content}}</view> -->
				<view class="reply">
					<view v-if="model.comment.reply" class="reply">
						<!-- <u--text type="primary" text="回复"></u--text> -->
						<view class="replyTxt">回复</view>
						<u--text :text="fathername + ':'" type="primary" size=14 lineHeight=21></u--text>
					</view>
					<view>{{model.comment.content}}</view>
				</view>
				<view class="timeAndBtn">
					<view @click="replyIt(model)">回复</view>
					<!-- <u--input placeholder="回复" border="none" v-model="value" :foucs="foucs" @confirm="confirm(item)"fontSize=12></u--input> -->
					<view class="time">{{model.comment.createdAt}}</view>
				</view>
			</view>
			<ul>
				<item v-for="(child,index) in model.child" :model='child' :fathername='model.comment.nickname'
					:key='index'></item>
			</ul>
		</li>
	</view>

</template>

<script>
	import Bus from 'components/bus.js';  
	export default {
		
		name: 'Item',
		props: {
			model: {
				type: Object,
				required: true
			},
			fathername: {
				type: String,
				required: false
			}
		},
		data() {
			return {
				iconAct: "thumb-up-fill",
				icon: "thumb-up",
				aid: '', //当前活动的id
				cmid: '', //所回复的评论id
				value: '', //输入的回复内容
				content: '',
				fatherNmae: '',
				isReply: false
			}
		},
		watch:{
			model:{
				handler(newVal,oldVal){
					this.model = newVal
					// console.log("model",this.model)
				},
				deep: true
			}
		},
		methods: {
			replyIt(model) {
				// console.log("item.model",model)
				//所回复的评论id
				this.cmid = model.comment._id;
				//当前活动的id
				this.aid = model.comment.belong;
				// console.log(model.comment.belong)
				this.isReply = true;
				this.fatherName = model.comment.nickname;
				var em = [this.isReply, this.cmid, this.aid,this.fatherName]
				// console.log("em",em)
				Bus.$emit('ee', em)
			},
			dainzan(model) {
				this.cmid = model.comment._id
				// console.log(this.cmid)
				if (model.comment.liked == true) {
					model.comment.liked = false
				} else {
					model.comment.liked = true
				}
				this.likeComment()
			},
			async likeComment() {
				await this.$request({
					url: '/likeComment',
					method: 'post',
					data: {
						cmid: this.cmid
					}
				}).then((res) => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},
		}
	}
</script>
<style>
	ul,
	li {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}
	
	.PIM {
		display: flex;
		justify-content: flex-start;
	}
	
	.reply {
		margin-right: 10rpx;
		display: flex;
		justify-content: flex-start;
	}
	
	.userName {
		color: #2979FF;
		line-height: 82rpx;
		margin-left: 20rpx;
	}
	
	.replyTxt {
		font-size: 28rpx;
		line-height: 41rpx;
	}
	
	.AndPIM {
		display: flex;
		justify-content: space-between;
	}
	
	.timeAndBtn {
		font-size: 24rpx;
		color: #606266;
		display: flex;
		justify-content: flex-end;
	}
	
	.time {
		margin-left: 20rpx;
	}
</style>
