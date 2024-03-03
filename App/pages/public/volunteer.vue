<template>
	<view>
		<!-- tabs标签 -->
		<u-tabs :list="list" @click="click" :scrollable="false" lineColor="#353535" lineWidth="50" lineHeight="1">
		</u-tabs>
		<!-- 活动栏 -->
		<all v-if="index == 0"></all>
		<notStart v-if="index == 1"></notStart>
		<underway v-if="index == 2"></underway>
		<finished v-if="index == 3"></finished>
		<theEnd v-if="index == 4"></theEnd>
	</view>
</template>

<script>
	import all from './volunteer/all.vue'
	import finished from './volunteer/finished.vue'
	import notStart from './volunteer/notStart.vue'
	import underway from './volunteer/underway.vue'
	import theEnd from './volunteer/theEnd.vue'
	export default {
		components: {
			all,
			finished,
			notStart,
			underway,
			theEnd
		},
		data() {
			return {
				list: [{
					name: '全部',
				}, {
					name: '未开始',
				}, {
					name: '进行中'
				}, {
					name: '已结束'
				}, {
					name: '已完结'
				}],
				index: "0"
			}
		},
		methods: {
			click(item) {
				this.index = item.index
			},
			detail() {
				uni.navigateTo({
					url: './activityDetail'
				})
			}
		},
		created() {
			uni.showLoading({
				title: '加载中'
			});
		}
	}
</script>

<style lang="scss">
</style>
