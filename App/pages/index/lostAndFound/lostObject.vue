<template>
  <view>
    <view v-if="newLostList.length == 0 ? list=lostList : list=newLostList">
      <view v-if="value == '2' ? list=myLostList : list=list">
        <view
          v-for="(item, index) in list"
          :key="index"
          class="lostAndFound"
        >
          <view @click="lostAndFoundDetail(item)">
            <!-- 个人信息部分 -->
            <view class="PIM">
              <u--image
                :src="item.avatar"
                width="100rpx"
                height="100rpx"
                shape="circle"
              ></u--image>
              <u--text
                :text="item.ownerName"
                margin="30rpx"
                size="35rpx"
              ></u--text>
              <view class="date">{{item.createdAt}}</view>
            </view>
            <!-- 活动内容 -->
            <view class="activityContent">
              <u--text
                :lines="1"
                :text="item.title"
              ></u--text>
              <!-- <view v-for="(model,Rindex) in item.images" :key="Rindex">
							<u--image :src="model" width="200rpx" height="200rpx" :fade="true" duration="450"  class="myImage"></u--image>
						</view> -->
              <u-album :urls="item.images"></u-album>
            </view>
          </view>
          <!-- 状态 -->
          <view class="behavior">
            <u-icon
              name="chat"
              size="60rpx"
              label="评论"
              @click="lostAndFoundDetail(item)"
            ></u-icon>
            <u-icon
              :name="item.dianzan == true ? iconAct : icon"
              size="60rpx"
              label="收藏"
              @click="dianzan(item)"
            ></u-icon>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import transferTime from '../../../components/transferTime.js'
export default {
  data() {
    return {
      //收藏图标
      icon: "bookmark",
      iconAct: "bookmark-fill",
      Comments: [],
      list: [],
      length: 0,
      myLostList: []
    }
  },
  props: {
    value: {
      type: String,
      require: true
    }
  },
  computed: {
    lostList() {
      return this.$store.state.lostList
    },
    newLostList() {
      return this.$store.state.newLostList
    },
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  created() {
    this.queryMyLostList();
    // console.log("newlostlist", this.newLostList)
    this.length = this.newLostList.length
    // console.log("length", this.length)
  },
  methods: {
    //收藏效果的实现
    dianzan(item) {
      this.addFavorites()
      if (item.dianzan === true) {
        item.dianzan = false
      } else {
        item.dianzan = true
      }
    },
    lostAndFoundDetail(item) {
      this.listComments(item)
      var lostAndFoundItem = JSON.stringify(item)
      uni.navigateTo({
        url: "./lostAndFoundDetail?lostAndFoundItem=" + lostAndFoundItem
      })
    },
    //点击收藏
    async addFavorites(item) {
      await this.$request({
        url: '/addFavorties',
        method: 'post',
        data: { aid: item._id }
      }).then((res) => {
        console.log(res)
      }).catch(err => {
        concole.log(err)
      })
    },
    //获取评论列表
    async listComments(item) {
      await this.$request({
        url: '/losts/listComments',
        data: {
          lid: item._id
        }
      }).then((res) => {
        this.Comments = res.data.data
        this.disposeData(this.Comments)
        this.$store.commit('comments', this.Comments)
      }).catch(err => {
        console.log(err)
      })
    },
    //处理数据
    disposeData(data) {
      for (var i = 0; i < data.length; i++) {
        data[i].comment.createdAt = transferTime.dateTimeStr('y-m-d h:i', data[i].comment.createdAt)
        console.log(data[i].comment.createdAt)
        if (data[i].child) {
          this.disposeData(data[i].child)
        }
      }
    },
    // 查找出我的失物招领
    queryMyLostList() {
      for (let index = 0; index < this.lostList.length; index++) {
        if (this.userInfo._id == this.lostList[index].uid) {
          this.myLostList.push(this.lostList[index])
        }
      }
    }
  }
}
</script>

<style lang="scss">
.contant {
  padding: 40rpx 25rpx 20rpx 20rpx;
  font-family: 'KaiTi', 'Times New Roman', Times, serif;
}
.PIM {
  display: flex;
  text-align: center;
  // flex-direction: row;
  // text-align: flex-end;
  height: 100rpx;
  padding-left: 16rpx;
  margin-top: 10rpx;
}
//动态里的时间
.date {
  margin: 10rpx 42rpx 0rpx 0rpx;
  font-size: 28rpx;
}
//动态里的点赞，评论，点击参加部分
.behavior {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 18rpx;
}
//动态里的活动部分
.activityContent {
  margin-top: 18rpx;
}
//动态
.lostAndFound {
  box-shadow: 0px 0px 8px #d5d5d6;
  height: auto!important;
  padding: 20rpx;
  margin-bottom: 10rpx;
  border-radius: 16rpx;
}
.Uinput {
  margin-bottom: 20rpx;
}
.sousuo {
  display: flex;
  justify-content: space-between;
}
.sousuoBtn {
  width: 100rpx;
}
.myImage {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
}
.album {
  @include flex;
  align-items: flex-start;

  &__avatar {
    background-color: $u-bg-color;
    padding: 5px;
    border-radius: 3px;
  }

  &__content {
    margin-left: 10px;
    flex: 1;
  }
}
</style>
