<template>
  <view class="content">
    <view class="box top">
      <!-- 标题及封面 -->
      <view class="topSon">
        <view class="img">
          <u--image
            :showLoading="true"
            :src="act.cover"
            width="80px"
            height="80px"
          ></u--image>
        </view>
        <view class="title">
          {{act.title}}
        </view>
      </view>
      <!-- 人数 -->
      <view class="info">
        可参与人数: {{act.capacity}} 已报名: {{act.signUp}} 已签到: {{act.signed}}
      </view>
      <!-- 时间 -->
      <view class="times">
        <view class="time">报名时间: {{act.applyTime}}</view>
        <view class="time">活动时间: {{act.actTime}}</view>
      </view>
      <!-- 地点 -->
      <view class="address">活动地址: {{act.location}}</view>
    </view>
    <!-- 发起人信息 -->
    <view class="box middle">
      <view class="middleSon">发起人: {{act.ownerName}}</view>
      <view class="middleSon">联系方式: {{act.ownerEmail}}</view>
    </view>
    <!-- 打扫成员 -->
    <view class="box footer">
      <view class="members">参与成员</view>
      <view class="membersInfo">
        <!-- 所有打扫人员 -->
        <view
          class="membersInfoSon"
          v-for="(item, index) in act.applyPerson"
          :key="index"
        >
          <!-- 个人头像 -->
          <view class="img">
            <u-avatar :src="item.avatar"></u-avatar>
          </view>
          {{item.nickname}}
        </view>
      </view>
    </view>
    <!-- 报名签到按钮 -->
    <view class="fixed">
      <u-button
        :color="color"
        :text="text"
        type="info"
        @click="SignEnd"
        :disabled="bool"
      ></u-button>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  data() {
    return {
      act: {
      },
      color: '#ff895e',	// 按钮颜色
      text: '',		// 按钮文字
      bool: false,		// 是否禁用按钮
      show: false,
      num:0 
    }
  },
  methods: {
    // 签到功能
    SignIn(e) {
      this.color = '';
      this.bool = true;
      this.text = e;
    },
    SignEnd(e) {
      if (e) {
        this.color = '#ff895e';
        this.bool = false;
        this.text = e;
      }
      if (!e) {
        this.num++
      }
      if(this.text == "报名" && this.num == 1) {
        this.$request({
          url: '/joinActivity',
          method: 'post',
          data: {
            aid: this.id
          }
        }).then( (res) => {
          if (res.statusCode == 200) {
            this.SignIn("已报名")
          }
        })
      } else if (this.text == "签到" && this.num == 1) {
        this.$request({
          url: '/activitySignIn',
          method: 'post',
          data: {
            aid: this.id
          }
        }).then( (res) => {
          if (res.statusCode == 200) {
            this.SignIn("已签到")
          }
        })
      }
    },
    // 处理数据格式
    processData() {
      let applyTimeStart = uni.$u.timeFormat(this.act.applyTime.start, 'yyyy.mm.dd hh:MM')
      let applyTimeEnd = uni.$u.timeFormat(this.act.applyTime.end, 'yyyy.mm.dd hh:MM')
      let actTimeStart = uni.$u.timeFormat(this.act.actTime.start, 'yyyy.mm.dd hh:MM')
      let actTimeEnd = uni.$u.timeFormat(this.act.actTime.end, 'yyyy.mm.dd hh:MM')
      this.act.applyTime = applyTimeStart + '-' + applyTimeEnd
      this.act.actTime = actTimeStart + '-' + actTimeEnd
      this.act.signUp = this.act.applyPerson?.length
      this.act.signed = this.act.signedPerson?.length
      // 是否报名
      let isApply = false
      for (let index = 0; index < this.act.signUp; index++) {
        if (this.userInfo._id == this.act.applyPerson[index].uid) {
          isApply = true;
          break;
        }
      }
      // 是否签到
      let isSignUp = false
      for (let index = 0; index < this.act.signed; index++) {
        if (this.userInfo._id == this.act.signedPerson[index]) {
          isSignUp = true;
          break;
        }
      }

      // 判断按钮状态
      var nowTime = new Date().getTime()  // 当前时间距离1970年的毫秒数
      var applyTimeS = new Date(applyTimeStart).getTime();
      var applyTimeE = new Date(applyTimeEnd).getTime();
      var actTimeS = new Date(actTimeStart).getTime();
      var actTimeE = new Date(actTimeEnd).getTime();

      // 判断时间范围
      function decide() {
        // 报名开始时间之前
        if (nowTime < applyTimeS) { return 0 }
        // 报名开始到活动开始之前
        else if (applyTimeS < nowTime && nowTime < actTimeS) { return 5 }
        // 报名开始到报名结束之间
        else if (applyTimeS < nowTime && nowTime < applyTimeE) { return 1 }
        // 活动开始到报名结束之间
        else if (actTimeS < nowTime && nowTime < applyTimeE) { return 2 }
        // 报名结束到活动结束之间
        else if (applyTimeE < nowTime && nowTime < actTimeE) { return 3 }
        // 活动结束之后
        else if (actTimeE < nowTime) { return 4 }
      }
      // 相应处理结果
      switch (decide()) {
        case 0:
          // 报名未开始
          this.SignIn("报名未开始")
          break;
        case 1:
          // 如果已报名并大于活动开始时间，则显示签到
          if (isApply && nowTime > actTimeS) {
          if (!isSignUp) {
            this.SignEnd("签到")
          } else {
            this.SignIn("已签到")
          }
          } else if (isApply && nowTime < actTimeS) {
            // 如果已报名并小于活动开始时间，则显示已报名
            this.SignIn("已报名")
          } else {
            // 未报名显示报名
            this.SignEnd("报名")
          }
          break;
        case 2:
          //未报名显示报名
          if (!isApply) {
            this.SignEnd("报名")
          } else if (isApply && !isSignUp) {
            // 已报名并未签到，则显示签到
            this.SignEnd("签到")
          } else if (isApply && isSignUp) {
            // 已签到，则显示已签到
            this.SignIn("已签到")
          }
          break;
        case 3:
          // 未报名
          if (!isApply) {
            this.SignIn("未报名")
          } else if (isApply && !isSignUp) {
            // 已报名并未签到，则显示签到
            this.SignEnd("签到")
          } else {
            // 已签到，则显示已签到
            this.SignIn("已签到")
          }
          break;
        case 4:
          // 活动已结束
          this.SignIn("活动已结束")
          break;
        case 5:
          // 活动开始之前
          if (!isApply) {
            this.SignEnd("报名")
          } else {
            this.SignIn("已报名")
          }
          break;
        default:
          console.log("发生错误");
          break;
      }
    }
  },
  onLoad(options) {
    uni.showLoading({
      title: '加载中'
    });
    this.id = options.id;
    this.$request({
      url: '/getActivityById',
      data: {
        aid: options.id
      }
    }).then(res => {
      if (res.statusCode == 200) {
        this.act = res.data.data
        this.processData()
        setTimeout(function() {
          uni.hideLoading();
        }, 1000);
      }
    })
  }
}
</script>

<style lang="scss">
.content {
  margin: 0;
  padding: 0;
  padding-top: 20rpx;
  .box {
    box-sizing: border-box;
    width: 90%;
    border-radius: 20rpx;
    margin: 0 5% 20rpx 5%;
    box-shadow: 0px 0px 6px #c6c6c6;
    font-family: 'KaiTi', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }
  .top {
    height: 500rpx;
    font-size: 30rpx;
    // 标题及封面
    .topSon {
      display: flex;
      font-family: 'SimHei', Courier, monospace;
      font-size: 40rpx;
      font-weight: 600;
      .img {
        padding: 20rpx;
        margin: auto;
      }
      .title {
        width: calc(100% - 100px);
        height: 200rpx;
        line-height: 200rpx;
        padding-left: 40rpx;
      }
    }
    // 人数
    .info {
      font-size: 22rpx;
      color: #666;
      padding: 0 0 16rpx 20rpx;
      border-bottom: 4rpx solid #bbb;
    }
    // 时间
    .times {
      box-sizing: border-box;
      height: 140rpx;
      line-height: 60rpx;
      width: 100%;
      padding: 10rpx 0 0 30rpx;
      border-bottom: 4rpx solid #bbb;
    }
    // 地点
    .address {
      box-sizing: border-box;
      height: 100rpx;
      line-height: 100rpx;
      width: 100%;
      padding-left: 30rpx;
    }
  }
  // 发起人信息
  .middle {
    height: 160rpx;
    line-height: 60rpx;
    padding: 20rpx 0 0 40rpx;
  }
  // 打扫成员
  .footer {
    // height: 400rpx;
    padding: 30rpx;
    .members {
      height: 40rpx;
      width: 100%;
    }
    .membersInfo {
      display: flex;
      flex-wrap: wrap;
      .membersInfoSon {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 20rpx;
        text-align: center;
        .a {
          background-color: #9f9f9f;
        }
        .b {
          background-color: #5acf56;
        }
        .img {
          margin: auto;
          padding-bottom: 10rpx;
        }
      }
    }
  }
  // 签到按钮
  .fixed {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 100;
    width: 100%;
    border-radius: 20rpx;
    box-shadow: 0px 0px 14px #8cb7ffc7;
  }
}
</style>
