<template>
	<view class="pages">
		<view class="placeholder"></view>
		<view class="title">检查{{buildingName}}&#12288;{{weekDay}}&#32;☺</view>
		<view v-for="(item, index) in listData" :key="index">
			<li class="done">
				<div>教室</div>
				<span class="label">{{item.name}}</span>
			</li>
		</view>
	</view>

</template>
<script>
	export default {
		data() {
			return {
				listData: [], // 教室list
				buildingName: '', // 楼栋
				weekDay: '' // 日期
			}
		},
		methods: {
			scrolltolower() {},
			getList() {
				this.$request({
						url: '/getCheckById',
					})
					.then((res) => {
						this.listData = res.data.data.room;
						this.weekDay = res.data.data.weekDay;
						this.buildingName = res.data.data.buildingName;
						uni.hideLoading()
					})
			}
		},
		created() {
			uni.showLoading({
				title:'页面加载中'
			})
			this.getList()
		}
	}
</script>
<style lang="scss">
	.pages {
		box-sizing: border-box;
		// height: 100vh;
		// background-color: #cc55ff;
		background-image: linear-gradient(to left, #a18cd1 0%, #fbc2eb 100%);

		.placeholder {
			height: 20px;
		}

		.title {
			color: #fff;
			height: 40px;
			line-height: 40px;
			width: 90%;
			margin: 0 5% 20px 5%;
			padding-bottom: 10px;
			font-size: 2rem;
			text-align: center;
			border-bottom: 1px solid #ffffff4d;
		}

		.done {
			font-size: 1.1rem;
			font-family: 'Quicksand', sans-serif;
			color: #fff;
			list-style: none;
			box-sizing: border-box;
			display: flex;
			margin: 0 -3rem 4px;
			padding: 1.1rem 3rem;
			justify-content: space-around;
			align-items: center;
			background: rgba(255, 255, 255, 0.1);
		}

		.label {
			margin: 0;
			padding: 0;
			position: relative;
			transition: opacity .2s linear;
		}
	}
</style>
