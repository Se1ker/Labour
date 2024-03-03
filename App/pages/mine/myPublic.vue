<template>
  <view class="contant">
    <u-tabs
      :list="list"
      @click="uTabs"
      :scrollable="false"
    ></u-tabs>
    <foundObject
      v-if="index == 0"
      :value="key"
      :myFoundList="myFoundList"
    ></foundObject>
    <lostObject
      v-if="index == 1"
      :value="key"
    ></lostObject>
  </view>
</template>

<script>
import foundObject from '../index/lostAndFound/foundObject.vue'
import lostObject from '../index/lostAndFound/lostObject.vue'
export default {
  components: {
    foundObject,
    lostObject
  },
  data() {
    return {
      list: [{
        name: "寻物启事"
      }, {
        name: "失物招领"
      }],
      //收藏图标
      icon: "bookmark",
      iconAct: "bookmark-fill",
      index: "0",
      allList: [],//所有的列表
      foundList: [],//寻物启事列表
      lostList: [],//失物招领列表
      newFoundList: [],//新的寻物启事
      newLostList: [],//新的失物招领
      RnewFoundList: [],
      RnewLostList: [],
      value: '', //input输入的内容
      kongList: [],
      myFoundList: []
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
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
    confirm() {
      this.searchByKey()
    },
    lostAndFoundDetail(item) {
      var lostAndFoundItem = JSON.stringify(item)
      uni.navigateTo({
        url: "./lostAndFoundDetail?lostAndFoundItem=" + lostAndFoundItem
      })
    },
    uTabs(item) {
      this.index = item.index
    },
    //点击收藏
    async addFavorites(item) {
      await this.$request({
        url: '/addFavorties',
        method: 'post',
        data: { aid: item._id }
      }).then((res) => {
        console.log(res)
      })
    },
    //获取列表
    async getListLosts() {
      await this.$request({
        url: '/listLosts'
      }).then((res) => {
        this.allList = res.data.data
        for (var i = 0; i < this.allList.length; i++) {
          this.allList[i].createdAt = res.data.data[i].createdAt.substring(0, 10) + " " + res.data.data[i].createdAt.substring(11, 16)
          if (this.allList[i].type == "失物招领") {
            this.lostList.push(this.allList[i])
          } else {
            this.foundList.push(this.allList[i])
          }
        }
        // 处理寻物启事数据
        for (let index = 0; index < this.foundList.length; index++) {
          if (this.userInfo._id == this.foundList[index].uid) {
            this.myFoundList.push(this.foundList[index])
          }
        }
        uni.hideLoading();
        this.$store.commit('foundList', this.foundList);
        this.$store.commit('lostList', this.lostList);
        uni.hideLoading();
      })
    },
    //查找关键字的活动
    async searchByKey() {
      await this.$request({
        url: '/searchByKey',
        data: {
          key: this.value
        }
      }).then((res) => {
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].type == '失物招领' && this.index == 1) {
            this.RnewLostList.push(res.data.data[i])
          } else if (res.data.data[i].type == '寻物启事' && this.index == 0) {
            this.RnewFoundList.push(res.data.data[i])
          }
        }
        if (this.RnewLostList.length == 0 && this.index == 1) {
          uni.showModal({
            title: '未查找到相关活动'
          })
        } else if (this.RnewFoundList.length == 0 && this.index == 0) {
          uni.showModal({
            title: '未查找到相关活动'
          })
        }
        this.newFoundList = this.RnewFoundList;
        this.newLostList = this.RnewLostList
        this.$store.commit('newFoundList', this.newFoundList)
        this.$store.commit('newLostList', this.newLostList)
        this.RnewFoundList = []
        this.RnewLostList = []
      })
    }
  },
  onNavigationBarButtonTap: function(e) {
    uni.navigateTo({
      url: '../createActivity'
    })
  },
  onLoad(option) {
    if (option.key) {
      this.key = option.key;
    }
    this.getListLosts()
    this.$store.commit('newLostList', this.kongList)
    this.$store.commit('newFoundList', this.kongList)
  },
  created() {
    uni.showLoading({
      title: '加载中'
    });
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
  height: 100rpx;
  padding-left: 16rpx;
  margin-top: 10rpx;
}
//动态里的时间
.date {
  margin: 10rpx 42rpx 0rpx 0rpx;
  font-size: 30rpx;
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
  height: 450rpx;
  padding: 20rpx;
  margin-bottom: 10rpx;
  border-radius: 16rpx;
}
.sousuo {
  display: flex;
  justify-content: space-between;
}
.sousuoBtn {
  width: 100rpx;
}
</style>
