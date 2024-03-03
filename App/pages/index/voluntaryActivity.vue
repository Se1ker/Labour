<template>
  <view class="page">
    <WaterfallsFlow :wfList="voluntaryListSon" />
    <u-loadmore :status="status" :line="true"/>
    <view class="footer"></view>
  </view>
</template>

<script>
import WaterfallsFlow from "../../components/WaterfallsFlow/WaterfallsFlow.vue";

export default {
  components: {
    WaterfallsFlow,
  },
  computed: {
    voluntaryList() {
      return this.$store.state.voluntaryList;
    },
  },
  data() {
    return {
      requiredData: [{}], // 存放模拟加载的数据
      status: 'loadmore',
      voluntaryListSon: [],
      foundIndex: 10
    };
  },
  // onLoad() {
  //   uni.showLoading({
  //     title: "加载中",
  //   });
  // },
  onReachBottom() {
    this.status = 'loading';
    // 每次触底多加载十条
		this.voluntaryListSon = this.voluntaryList.slice(0,Math.min(this.foundIndex+10,this.voluntaryList.length));
		if(this.foundIndex+10 >= this.voluntaryList.length) {
			this.status = 'nomore';
		} else {
			this.foundIndex = this.foundIndex + 10;
			this.status = 'loadmore';
		}
  },
  onPullDownRefresh() {
    // this.$forceUpdate();
    uni.redirectTo({ url: '/pages/index/voluntaryActivity' })
    setTimeout(() => { uni.stopPullDownRefresh(); },1200)
  },
  methods: {
    // itemTap(item){
    //    uni.navigateTo({
    //    	url:"./voluntaryDetail"
    //    })
    // },
  },
  created() {
    this.voluntaryListSon = this.voluntaryList.slice(0,Math.min(10,this.voluntaryList.length));
	console.log(this.voluntaryList)
    // uni.showLoading({
    //   title: "加载中",
    // });
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #ffffff;
  .footer {
    height: 2rpx;
  }
}
</style>