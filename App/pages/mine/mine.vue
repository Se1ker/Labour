<template>
  <view class="content">
    <!-- 个人属性 -->
    <view class="top">
      <view class="topSon">
        <view class="head" @click="modifyImg">
          <u--image :src="userInfo.avatar" shape="circle" height="80" width="80"></u--image>
        </view>
        <view class="name">
          <view id="name">{{ userInfo.nickname }}_{{ userInfo.stuId }}</view>
          <view id="college">{{ userInfo.academyName }}</view>
        </view>
      </view>
      <view class="score">
        <view class="scoreSon">
          <view class="num">{{ userInfo.score || 0 }}</view>
          <view class="text">积分</view>
        </view>
        <view class="scoreSon">
          <view class="num">{{ userInfo.HDegree || 100 }}%</view>
          <view class="text">诚信率</view>
        </view>
      </view>
    </view>
    <view class="tab">
      <view class="box">
        <view class="leftBox"></view>
        <view class="rightBox"></view>
      </view>
      <view class="nav">
        <view class="navItem" @click="myIntegral">
          <view class="img">
            <u--image :src="src[0]" width="50px" height="50px"></u--image>
          </view>我的积分
        </view>
        <view class="navItem" @click="volunteer">
          <view class="img">
            <u--image :src="src[1]" width="50px" height="50px"></u--image>
          </view>我的活动
        </view>
        <view class="navItem" @click="myPublic">
          <view class="img">
            <u--image :src="src[2]" width="50px" height="50px"></u--image>
          </view>失物/寻物
        </view>
      </view>
      <view class="tabBox">
        <view class="tabSon" @click="checker">
          <view class="img">
            <u--image :src="src[3]" width="30px" height="30px"></u--image>
          </view>检查员
        </view>
        <view class="tabSon" @click="cleaner">
          <view class="img">
            <u--image :src="src[4]" width="30px" height="30px"></u--image>
          </view>打扫员
        </view>
        <view class="tabSon" @click="postProject">
          <view class="img">
            <u--image :src="src[5]" width="30px" height="30px"></u--image>
          </view>活动结项
        </view>
        <view class="tabSon" @click="setting">
          <view class="img">
            <u--image :src="src[6]" width="30px" height="30px"></u--image>
          </view>设置
        </view>
      </view>
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
      src: [ // 图标
        '/static/integral.png',
        '/static/voluntaryActivity.png',
        '/static/lostFound.png',
        '/static/person.png',
        '/static/person.png',
				'/static/activityEnd.png',
        '/static/settingUp.png',
      ],
    }
  },
  methods: {
    volunteer() {
      this.listJoinActivity();
      uni.navigateTo({
        url: '../public/volunteer'
      })
    },
    listJoinActivity() {
      this.$request({
        url: '/listJoinActivity',
      }).then(res => {
        let tasklist = this.listGroup(res.data.data)
        this.$store.commit('listJoinActivity', tasklist);
      })
    },
    listGroup(listJoinActivity) {
      let tasklist = []
      for (let index = 0; index < listJoinActivity.length; index++) {
        let actTimeStart = uni.$u.timeFormat(listJoinActivity[index].actTime.start, 'yyyy.mm.dd hh:MM')
        let actTimeEnd = uni.$u.timeFormat(listJoinActivity[index].actTime.end, 'yyyy.mm.dd hh:MM')
        tasklist[index] = {
          id: listJoinActivity[index]._id,
          title: listJoinActivity[index].title,
          cover: listJoinActivity[index].cover,
          location: listJoinActivity[index].location,
          capacity: listJoinActivity[index].capacity,
          actTime: actTimeStart + '-' + actTimeEnd
        }
        var nowTime = new Date().getTime()
        var actTimeS = new Date(actTimeStart).getTime();
        var actTimeE = new Date(actTimeEnd).getTime();
        // 判断活动状态
        if (actTimeS > nowTime) {
          tasklist[index].state = "未开始"
        } else if (actTimeE < nowTime) {
          tasklist[index].state = "已结束"
        } else {
          tasklist[index].state = "进行中"
        }
      }
      // console.log(tasklist);
      return tasklist
    },
    myPublic() {
      uni.navigateTo({
        url: "./myPublic?key=2"
      })
    },
    myIntegral() {
      uni.navigateTo({
        url: "./myIntegral"
      })
    },
    checker() {
      if (this.userInfo.role === "checker") {
        uni.navigateTo({
          url: "./check/checker"
        })
      } else {
        uni.navigateTo({
          url: "./check/signUp"
        })
      }
    },
    cleaner() {
      uni.navigateTo({
        url: "./clear/cleaner"
      })
    },
    postProject() {
      uni.navigateTo({
				url:"../public/activityEnd"
			})
    },
    setting() {
      uni.navigateTo({
        url: "./setUp/setting"
      })
    },
    modifyImg() {
      let that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: function (res) {
          console.log(res.tempFilePaths[0]);
          uni.uploadFile({
            url: "http://175.27.247.87:8081/api/v1/modifyUserInfo",
            filePath: res.tempFilePaths[0],
            name: "img",
            header: {
              'authorization': "Bearer " + uni.getStorageSync('token')
            },
            success: (res) => {
              console.log(res);
              console.log("res");
              let data = JSON.parse(res.data)
              if (res.statusCode == 200) {
                // 修改头像并提示成功
                that.userInfo.avatar = data.data.avatar
                that.$refs.uToast.show({
                  type: 'success',
                  message: data.msg,
                  iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
                })
              } else {
                that.$refs.uToast.show({
                  type: 'error',
                  message: "修改失败",
                  iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
                })
              }
            }
          })
        }
      });
    }
  },
  created() { }
}
</script>

<style lang="scss">
.content {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100vh;
  letter-spacing: 1rpx;
  font-family: "Microsoft YaHei", "Gill Sans MT", Calibri, "Trebuchet MS",
    sans-serif;
  /* 个人名片信息 */
  .top {
    width: 100%;
    height: 25%;
    // background-color: black;
    letter-spacing: 2rpx;
    background: url("/static/person1.png");
    background-size: cover;
    color: #fff;
    font-weight: 700;

    .topSon {
      display: flex;

      .head {
        box-sizing: border-box;
        height: 200rpx;
        width: 200rpx;
        padding: 40rpx;
      }

      .name {
        display: flex;
        width: 100%;
        height: 100%;
        line-height: 200rpx;
        flex-direction: column;
        padding-left: 60rpx;
      }

      #name,
      #college {
        width: 100%;
        height: 80rpx;
        padding-left: 20rpx;
        font-size: 36rpx;
      }

      #college {
        font-size: 32rpx;
        color: #d4d4d4;
        font-weight: 400;
        line-height: 160rpx;
      }
    }

    .score {
      display: flex;
      width: 100%;
      height: calc(100% - 100px);

      .scoreSon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 50%;
        height: 100%;
        text-align: center;

        .num {
          font-size: 40rpx;
        }

        .text {
          font-size: 20rpx;
          color: #d4d4d4;
        }
      }
    }
  }

  .tab {
    width: 100%;
    height: 75%;
    background-color: #ededed91;
    font-family: STKaiti, "Microsoft YaHei", "Gill Sans MT", Calibri,
      "Trebuchet MS", sans-serif;
    // 圆角效果
    .box {
      display: flex;
      justify-content: space-between;
      background-color: #fff;

      .leftBox {
        width: 60rpx;
        height: 60rpx;
        background-color: #fff;
        border-top-left-radius: 30rpx;
        box-shadow: -2rpx -30rpx 0rpx 0rpx #201d32;
      }

      .rightBox {
        width: 60rpx;
        height: 60rpx;
        background-color: #fff;
        border-top-right-radius: 30rpx;
        box-shadow: 2rpx -30rpx 0rpx 0rpx #f6a120;
      }
    }
    // 活动
    .nav {
      display: flex;
      padding-bottom: 20rpx;
      font-weight: 600;
      background-color: #fff;

      .navItem {
        width: 33.3%;
        text-align: center;
        .img {
          height: 100rpx;
          width: 100rpx;
          margin: 10rpx auto;
        }
      }
    }
    // 底部
    .tabBox {
      margin: 20rpx;
      border-radius: 20rpx;
      overflow: hidden;
      background-color: #fff;
      .tabSon {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 20rpx;
        padding-left: 40rpx;
        font-size: 36rpx;
        font-weight: 600;
        border-bottom: 0.1rem solid #e6e6e6;

        .img {
          margin-right: 30rpx;
        }
      }
    }
  }
}
</style>
