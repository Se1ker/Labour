<template>
  <view>
    <!-- 活动栏 -->
    <view
      class="active"
      @click="detail(item.id)"
      v-for="(item, index) in listJoinActivity"
      :key="index"
    >
      <!-- 活动信息 -->
      <view class="actMessage">
        <text id="taskName">{{item.title}}</text>
        <text class="message">活动时间:<br>{{item.actTime}}</text>
        <text class="message">地点:{{item.location}}</text>
        <text class="message">人数:{{item.capacity}}</text>
      </view>
      <!-- 活动图片及状态 -->
      <view class="imgMessage">
        <u--image
          :src="item.cover"
          shape="circle"
          height="80"
          width="80"
        ></u--image>
        <text class="state">{{item.state}}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    listJoinActivity() {
        return this.finished()
    }
  },
  methods: {
    detail(id) {
      uni.navigateTo({
        url: './activityDetail?id=' + id
      })
    },
    finished() {
        let listStag = this.$store.state.listJoinActivity;
        let list = new Array()
        for (let index = 0; index < listStag.length; index++) {
            if (listStag[index].state == "进行中") {
                list.push(listStag[index])
            }
        }
        return list
    }
  }
}
</script>

<style lang="scss">
// 活动栏
.active {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 86%;
  height: 300rpx;
  margin: 20px 7% 0 7%;
  border-radius: 20rpx;
  box-shadow: 0px 0px 8px #d5d5d6;
  // 活动信息
  .actMessage {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 60%;
    height: 300rpx;
    padding: 20rpx;
    font-family: 'KaiTi', 'Times New Roman', Times, serif;
    #taskName {
      font-size: 36rpx;
      font-weight: bold;
      padding-bottom: 10rpx;
    }
    .message {
      color: #666;
      font-size: 24rpx;
    }
  }
  // 活动图片
  .imgMessage {
    padding: 20rpx;
    text-align: center;
    .state {
      display: inline-block;
      margin-top: 40rpx;
    }
  }
}
</style>
