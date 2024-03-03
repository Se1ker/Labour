<template>
  <!-- 选项卡列表 swiper高度自适应 -->
  <view class="tabsSwiper">
    <view class="tabs">
      <view class="tabs-con" :class="{ active: activeIndex == index }" @click="tabsChange(item, index)" :style="{ color: activeIndex == index ? activeColor : '' }" v-for="(item, index) in tabs" :key="index">
        <view class="title">{{ item.title }}</view>
      </view>
    </view>
    <view class="list">
      <swiper :style="{ height: swiperHeight + 'rpx' }" :current="swiperCurrent" @change="swiperChange">
        <swiper-item style="height: 100%" v-for="(item, index) in tabs" :key="index">
          <view :class="'list' + index">
            <view class="item">
              <!-- 列表数据 -->
              <!-- <slot :listData="item.data" class="slot"></slot> -->
              <slot v-for="(item,index) in item.data">
				  <view class="cleanData">
					  {{item.area}}
				  </view>
			  </slot>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
export default {
  name: "tabsSwiper",
  props: {
    tabs: {
      type: Array,
      default: () => {
        return [];
      },
    },
    activeColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeIndex: 0, // tabs索引
      swiperCurrent: 0, // swiper索引
      swiperHeight: 0, //swiper高度
    };
  },
  mounted() {
    this.initSwiperHeight(".list0");
  },
  methods: {
    // 点击tabs
    tabsChange(item, index) {
      this.activeIndex = index;
      this.swiperCurrent = index;
      let list = ".list" + index;
      this.initSwiperHeight(list);
      this.$emit("tabsChange", item);
    },
    // 点击商品
    touchItem(goods, cur) {
      this.$emit("touchItem", goods);
    },
    // 手势切换
    swiperChange(e) {
      this.activeIndex = e.detail.current;
      let list = ".list" + e.detail.current;
      this.initSwiperHeight(list);
    },
    // 计算高度
    initSwiperHeight(list) {
      const query = uni.createSelectorQuery().in(this);
      this.$nextTick(() => {
        query
          .select(list)
          .boundingClientRect((data) => {
            this.swiperHeight = Math.ceil(data.height / (uni.upx2px(data.height) / data.height));
          })
          .exec();
      });
    },
  },
};
</script>

<style lang="scss">
.tabsSwiper {
  padding: 30rpx;
}

.tabs {
	margin-bottom: 20rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .tabs-con {
    color: #333;
    transition: all 0.5s;
    padding: 6rpx 40rpx;
    overflow: hidden;

    .title {
      font-size: 26rpx;
      width: 100%;
    }

    .des {
      font-size: 20rpx;
      width: 100%;
    }

    &.active {
      transition: all 0.5s;
      // box-shadow: 0 0 2rpx 0 #bcbec2;
      background-color: #ffffff;
      // border-radius: 16rpx 16rpx 0 0;

      .title {
        font-size: 26rpx;
        font-weight: bold;
      }
    }
  }
}

.list {
  box-shadow: 0rpx 0rpx 2rpx 2rpx #bcbec2;
  background-color: #ffffff;
  padding: 12rpx;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  overflow: hidden;
  min-height: 100rpx;
}

.cleanData{
	height: 100rpx;
	display:flex;
	margin: 15rpx 5rpx 15rpx 5rpx;
	box-shadow: 0px 0px 6px #d5d5d6;
	border-radius: 16rpx 16rpx 16rpx 16rpx;
	flex-direction: column;
	justify-content: space-around;
}
</style>
