<template>
	<view>
		<view class="inputPinglun">
			<u--input  :placeholder="placeholder" border="surround" v-model.trim="value" :focus="focus" @confirm="confirm" @click="replypl()" @blur="blur"></u--input>
		</view>
		<view v-if="data">
			<view v-show="isShow">
				<ul v-for="(item,index) in data" :key="index">
					<item :model='item' @ee="replypl"></item>
				</ul>
			</view>
			<view @click="showComment" class="showComment">----------{{text}}评论----------</view>
		</view>
	</view>
</template>

<script>
	import Item from './item'
	import Bus from '../bus.js'; 
	import getDateTime from '../getDateTime.js'
	export default {
		created() {
			uni.hideLoading()
			Bus.$on('ee',(em)=>{
				this.replypl(em)
			}),
			this.placeholder = "请输入评论内容"
			 
		},
		components: {
			Item
		},
		props: {
			data: {
				type: Array,
				required: true,
				},
			
			id:{
				type: String,
				requires: true
			},
			isAct:{
				type:Boolean,
				required: true
			}},
			data() {
				return {
					focus: false,
					isShow: true, //是否展开评论
					text:'收起',
					value:'',
					isReply: false,
					cmid:'',  //回复的评论id
					caid:'', //回复评论的活动id
					aid:'',   //活动id
					fatherName:'',
					placeholder: '请输入评论内容',
					comment: {
						comment:{
							_id:'',
							nickname: '',
							liked: false,
							avatar:'',
							createdAt: "",
							updatedAt: "",
							content:'',
							reply:'',
							belong:''
						},
						child:[]
					}
						
				}
			},
			watch:{
				data:{
					handler(newVal,oldVal){
						this.data = newVal
						// console.log("newVal",newVal)
						// console.log("oldVal",oldVal)
					},
					deep: true
				}
			},
			methods: {
				replypl: function(em) {
						this.focus = true;
						this.isReply = em[0];
						this.cmid = em[1];
						this.caid = em[2];
						this.fatherName = em[3];
						this.placeholder = "回复" + this.fatherName;
				},
				//点击展开评论
				showComment(){
					if(this.isShow === true){
						this.isShow = false
						this.text = '展开'
					}else{
						this.isShow = true
						this.text = '收起'
					}
				},
				//点击发送评论
				confirm(){
					if(this.value === "" || this.value === undefined || this.value === null){
						uni.showModal({
								title:'内容不能为空'
						})
					} else {
						if(this.isReply == false && this.isAct == true){
							uni.showLoading({
								title:"评论发表中"
							})
							this.commentActivity()
						} else if(this.isReply == true && this.isAct == true){
							uni.showLoading({
								title:"评论发表中"
							})
							this.replyComment()
						} else if(this.isReply == false&& this.isAct == false){
							uni.showLoading({
								title:"评论发表中"
							})
							this.commentLosts()
						} else {
							uni.showLoading({
								title:"评论发表中"
							})
							this.replyLostsComment()
						}
					}
					
				},
				//失去焦点触发
				blur(){
					this.focus = false;
					this.placeholder = "请输入评论内容"
				},
				//实时渲染数据
				showData(data){
					this.isReply = false
					for(var i=0;i< data.length; i++){
						if(this.cmid == data[i].comment._id){
							this.comment.comment.reply = this.cmid
							data[i].child.push(JSON.parse(JSON.stringify(this.comment)))
						} else if(data[i].child.length !== 0){
							this.showData(data[i].child)
						} else{
							console.log("查找失败")
						}
					}
				},
				//前端渲染评论数据
				showCommentList(data){
					this.comment.comment.nickname = data.nickname;
					this.comment.comment.avatar = data.avatar;
					this.comment.comment.liked = false;
					var timeStr = getDateTime.dateTimeStr('y-m-d h:i'); // y:年 m:月 d:日 h:时 i:分 s:秒 中间的分割符号可更改
					this.comment.comment.createdAt = timeStr
					this.comment.comment.content = this.value;
					if(this.isReply == true){
						this.showData(this.data)
					}else{
						this.comment.comment.reply = null
						this.data.push(JSON.parse(JSON.stringify(this.comment)))
					}
					uni.hideLoading()
					this.value = ''
					this.focus = false
					this.placeholder = "请输入评论内容"
				},
				//获取个人信息
				async getUserInfo(){
					await this.$request({
						url:'/getUserInfo',
					}).then((res) => {
						this.showCommentList(res.data.data)
					}).catch(err => {
						console.log(err)
					})
				},
				// 回复评论
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
						// console.log(111)
						console.log("回复评论",res)
						this.comment.comment._id = res.data.data
						// console.log(this.comment.comment._id)
						this.comment.comment.belong = this.id
						this.getUserInfo()
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
							aid: this.id,
							content: this.value
						}
					}).then((res) => {
						
						this.comment.comment._id = res.data.data
						this.comment.comment.belong = this.id
						this.getUserInfo()
						console.log("评论活动",res)
					}).catch(err => {
						console.log(err)
					})
				},
				// 回复失物招领寻物启事评论
				async replyLostsComment(){
					await this.$request({
						url:'/losts/replyComment',
						method: 'post',
						data:{
						 	reply: this.cmid,
						 	content: this.value,
							belong: this.caid
						}
					}).then((res) => {
						this.comment.comment._id = res.data.data
						this.comment.comment.belong = this.id
						this.getUserInfo()
						console.log("回复失物招领评论",res)
					}).catch(err => {
						concole.log(err)
					})
				},
				//评论失物招领寻物启事活动
				async commentLosts(){
					await this.$request({
						url:'/commentLosts',
						method: 'post',
						data:{
							lid: this.id,
							content: this.value
						}
					}).then((res) => {
						this.comment.comment._id = res.data.data
						// console.log(this.comment.comment._id)
						this.comment.comment.belong = this.id
						console.log("评论失物招领活动",res)
						this.getUserInfo()
					}).catch(err => {
						console.log(err)
					})
				},
			}
		}
</script>
<style>
	ul{
		list-style: none;
		margin: 0;
		padding: 0;
	}
	
	.inputPinglun{
		margin-bottom: 40rpx;
	}
	
	.showComment{
		color:#C0C0C0;
		text-align: center;
	}
</style>
