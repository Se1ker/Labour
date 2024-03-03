<template>
	<view class="contant" v-if="rankingList">
		<!-- 前三名数据 -->
		<view class="TopThree">
			<view class="second">
				<!-- u--image :src="huangguan"></u--image> -->
				<u--image :src="rankingList[1].avatar" width="130rpx" height="130rpx" shape="circle" class="headPortrait"></u--image>
				<u--text size= "12" :text="rankingList[1].nickname" align="center"></u--text>
				<u--text size= "12" :text="rankingList[1].score" align="center"></u--text>
				<u--text size= "12" :text="rankingList[1].academyName" align="center"></u--text>
			</view>
			<view class="first">
				<u--image :src="rankingList[0].avatar" width="140rpx" height="140rpx" shape="circle" class="headPortrait"></u--image>
				<u--text size= "12" :text="rankingList[0].nickname" align="center"></u--text>
				<u--text size= "12" :text="rankingList[0].score" align="center"></u--text>
				<u--text size= "12" :text="rankingList[0].academyName" align="center"></u--text>
			</view>
			<view class="third">
				<u--image :src="rankingList[2].avatar" width="120rpx" height="120rpx" shape="circle" class="headPortrait"></u--image>
				<u--text size= "12" :text="rankingList[2].nickname" align="center"></u--text>
				<u--text size= "12" :text="rankingList[2].score" align="center"></u--text>
				<u--text size= "12" :text="rankingList[2].academyName" align="center"></u--text>
			</view>
		</view>
		<!-- 排行数据 -->
		<view v-for="(item,index) in rankingList" :key="index" class="rankingList">
			<view class="gerenxinxi">
				<view class="ranking">{{index+1}}</view>
				<u--image :src="item.avatar" width="100rpx" height="100rpx" shape="circle"></u--image>
				<view>
					<u--text :text="item.nickname" lineHeight="50rpx"></u--text>
					<u--text :text="item.academyName" lineHeight="50rpx"></u--text>
				</view>
			</view>
			<view class="integration">{{item.score}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				
			}
		},
		methods:{
		},
		computed:{
			rankingList(){
				return this.$store.state.rankingList;
			}
		}
	}
</script>

<style lang="scss">
	body{
		background-color: linear-gradient(#F5F5F5,#778899);
	}
	.contant{
		padding: 20rpx;
		font-family: 'KaiTi','Times New Roman', Times, serif;
		 
	}
	.ranking{
		line-height: 100rpx;
		margin-right: 25rpx;
	}
	//前三名样式
	.TopThree{
		display: flex;
		justify-content: space-around;
		margin-bottom: 40rpx;
	}
	//第一名样式
	.first{
		margin-top: 25rpx;
	}
	//第二名样式
	.second{
		margin-top: 75rpx;
	}
	//第三名样式
	.third{
		margin-top: 125rpx;
	}
	.rankingList{
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		padding: 13rpx 60rpx 13rpx 13rpx;
		margin-top: 30rpx;
		box-shadow: 0px 0px 8px #d6d7d7;
		border-radius: 16rpx;;
		background-color: #FFFFFF;
	}
	.gerenxinxi{
		display: flex;
		justify-content: space-around;
	}
	//积分样式
	.integration{
		// margin: 0rpx 50rpx 0rpx 0rpx;
		line-height: 100rpx;
		color: #FFA500;
	}
	//头像样式
	.headPortrait{
		border-radius: 50%;
		box-shadow: 0px 0px 10px #d5d5d6;
	}
</style>
