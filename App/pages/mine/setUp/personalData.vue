<template>
  <view class="content">
    <view class="Box"></view>
    <view class="box">
      <view class="grid">
        <view class="font">邮箱</view>
        <u--input border="none" v-model="email" fontSize="18px" disabled disabledColor="#66666600"></u--input>
      </view>
    </view>
    <view class="box">
      <view class="grid">
        <view class="font">学号</view>
        <u--input border="none" v-model="stuId" fontSize="18px" disabled disabledColor="#66666600"></u--input>
      </view>
    </view>
    <view class="box specialBox">
      <view class="grid">
        <view class="font">昵称</view>
        <u--input border="none" v-model="nickname" fontSize="18px"></u--input>
      </view>
    </view>
    <view class="box">
      <view class="grid">
        <view class="font">院系</view>
        <u--input border="none" v-model="academyName" fontSize="18px" disabled disabledColor="#66666600"></u--input>
      </view>
    </view>
    <view class="box">
      <view class="grid">
        <view class="font">班级</view>
        <u--input border="none" v-model="classId" fontSize="18px" disabled disabledColor="#66666600"></u--input>
      </view>
    </view>
    <view class="Flex">
      <!-- 修改按钮 -->
      <u-button :color="color" text="确定修改" type="info" @click="SignIn"></u-button>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>
<script>
export default {
  data() {
    return {
      email: '',
      stuId: '',
      nickname: '',
      academyName: '',
      classId: '',
      color: '#ff895e',	// 按钮颜色
      show: false, //弹出层提示
    }
  },
  computed: {
    collegeId() {
      return this.$store.state.collegeId
    },
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  onLoad() {
    this.email = this.userInfo.email || null
    this.stuId = this.userInfo.stuId || null
    this.nickname = this.userInfo.nickname || null
    this.academyName = this.userInfo.academyName || "未选"
    this.classId = this.userInfo.className || "未选"
  },
  onShow() {
    this.collegeId.name ? this.academyName = this.collegeId.name : this.academyName
  },
  methods: {
    async SignIn() {
      console.log(1);
      await this.$request({
        url: '/modifyUserInfo',
        method: 'post',
        data: {
          nickname: this.nickname,
        }
      }).then((res) => {
        console.log(res,this.nickname);
        if (res.statusCode == 200) {
          this.$refs.uToast.show({
            type: 'success',
            message: res.data.msg,
            iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.content {
  font-family: "STKaiti", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 36rpx;
  font-weight: 600;
  .Box {
    height: 10rpx;
    width: 100%;
  }
  .box {
    background-color: #66666617;
    padding-left: 30rpx;
    .grid {
      display: flex;
      line-height: 100rpx;
      height: 100rpx;
      margin-top: 20rpx;
      border-bottom: 1rpx solid #e0e0e0;
      .font {
        padding-right: 30rpx;
      }
    }
  }
  .specialBox {
    background-color: #fff;
  }
  .Flex {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: blue;
  }
}
</style>
