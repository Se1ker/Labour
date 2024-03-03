<template>
	<view class="content">
		<scroll-view id="tab" scroll-x="true" class="scrollView">
			<view v-for="(item,index) in barNameList" :key="item.id" class="tabName" :data-current="index" @click="ontabtap">
				<text class="tabName_text" :class="tabIndex == index?'active_text':''">{{item.name}}</text>
			</view>
		</scroll-view>
		<swiper id="tabContent" :current="tabIndex" @change="tabChange">
			<swiper-item>
				<view class="tabBcontent">
					<my-integral></my-integral>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="tabBcontent">
					<integrity-rate></integrity-rate>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import myIntegral from './my_integral.vue'
	import integrityRate from './integrity_rate.vue'
	export default{
		components: {
			myIntegral,
			integrityRate
		},
		data(){
			return{
				tabIndex:0,
				barNameList:[{
				    name: '积分',
				    id: '0'
				}, {
				    name: '诚信度',
				    id: '1'
				}],
				barContentList:[]
			}
		},
		methods:{
			onLoad() {
			    setTimeout(()=>{
			      this.barNameList.forEach((tabBar) => {
			          this.barContentList.push({
			              data: [],
			              isLoading: false,
			              refreshText: "",
			              loadingText: '加载更多...'
			          });
			      }); 
				  this.getList(0); // 默认初始获取第一个选项对应的数据
			    },350)
			},
			// 获取列表数据
			getList(index){
				let activeTab = this.barContentList[index];
				let list = [];
				activeTab.data = activeTab.data.concat(list);
			},
			// swiper滑动时改变下标
			tabChange(e){
				let index = e.target.current || e.detail.current;  // 获取到当前移动到第几个
				this.switchTab(index);
			},
			// scroll-view 点击 tab 时 改变下标
			ontabtap(e){
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.switchTab(index);
			},
			switchTab(index){
				if(this.tabIndex == index){
					return
				}
				// 先清空前面访问的swiper的缓存，要不再次切换到之前访问过的tab的时候内容会显示多次
				this.barContentList[this.tabIndex].data = [];
				// 后赋值
				this.getList(index);
				this.tabIndex = index;
			}
		}
	}
</script>

<style>
	#tab{
		width: 100%;
		display: flex;
	}
	.content{
		padding-top: 20rpx;
	}
	.tabName{
		text-align: center;
		width: 50%;
		display: inline-block;
		/* height: 70rpx; */
		line-height: 80rpx;
		white-space: nowrap;
		
	}
	.scrollView{
		padding: 30rpx;
		box-sizing: border-box;
	}
	.tabName_text{
		display: inline-block;
		width: 100%;
		height: 100%;
	}
	.active_text{
		border-bottom: 5rpx solid #F0AD4E;
	}
	#tabContent{
		width: 100%;
		height: 1200rpx;
	}
	.tabBcontent{
		padding: 20rpx;
		height: 100%;
	}
</style>

