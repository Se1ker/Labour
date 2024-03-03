<template>
	<view class="content">
		<view class="box" v-for="(item, index) in collegeList" :key="index" @click="college(item)">
      <view class="grid">
          {{item.name}}
      </view>
    </view>
	</view>
</template>

<script>
	export default {
    computed: {
      collegeList() {
        return this.$store.state.collegeList;
      }
    },
		data() {
			return {
			};
		},
    methods: {
      college(item) {
        this.$store.commit("choose", item)
        // 返回上一页
        uni.navigateBack()
      }
    },
    created() {

    }

	}
</script>

<style lang="scss">
.content {
  font-family: 'STKaiti', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 36rpx;
  font-weight: 600;
  .box {
    padding-left: 30rpx;
    .grid {
      line-height: 100rpx;
      height: 100rpx;
      margin-top: 10rpx;
      border-bottom: 1rpx solid #e0e0e0;
    }
  }
}
</style>
