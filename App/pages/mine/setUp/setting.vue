<template>
  <view class="content">
    <view class="block">
      <view class="function" @click="personalData">个人资料</view>
      <view class="function" @click="changePassword">修改密码</view>
      <view class="function" @click="aboutUS">关于</view>
    </view>
    <u-button text="退出当前账号" size="max" type="error" class="quit" @click="exit"></u-button>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
export default {
  data() {
    return {
      profileImg: '../../static/1.jfif',
      name: '敲代码',
      studentNumber: '2009101035',
      academy: '电子与信息学院'
    }
  },
  methods: {
    personalData() {
      uni.navigateTo({
        url: "./personalData"
      })
    },
    changePassword() {
      uni.navigateTo({
        url: "/pages/login/backPassword"
      })
    },
	aboutUS(){
		uni.navigateTo({
			url:"./aboutUS"
		})
	},
    exit() {
      try {
        uni.removeStorageSync('token');
        this.$refs.uToast.show({
          type: 'success',
          message: "退出成功",
          iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
          complete() {
			  uni.reLaunch({ url: '/pages/login/login' })
          }
        })
      } catch (e) {
      }
    }
  }
}
</script>

<style lang="scss">
.content {
  font-family: STKaiti, "Microsoft YaHei", "Gill Sans MT", Calibri,
    "Trebuchet MS", sans-serif;
  height: 100vh;
  background-color: #ededed91;
  padding-top: 20rpx;
  .block {
    font-weight: 600;
    border-radius: 20rpx;
    margin: 20rpx;
    margin-top: 0;
    background-color: #fff;
    overflow: hidden;
    .function {
      line-height: 100rpx;
      height: 100rpx;
      padding-left: 30rpx;
      margin-top: 20rpx;
      border-bottom: 0.1rem solid #e6e6e6;
    }
  }
  // 按钮
  .quit {
    margin-top: 600rpx;
    width: 400rpx;
  }
}
</style>
