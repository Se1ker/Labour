<template>
    <view>
        <view class="top">
            <u--text :lines="1" :size="20" color="#ff7a00" :text="text"></u--text>
            <u-line></u-line>
        </view>
        <view class="middle">
            <u-steps :current="current">
                <u-steps-item title="未报名"></u-steps-item>
                <u-steps-item title="已报名"></u-steps-item>
            </u-steps>
        </view>
        <view class="btn" @click="signUpBtn">
            <u-button
                type="primary"
                icon="man-add-fill"
                :text="textBtn"
                :disabled="disabled"
                color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"
                size="normal"
            ></u-button>
        </view>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>

<script>
export default {
    data() {
        return {
            text: "您当前不是检察员，报名请看下方",
            textBtn: "报名",
            disabled: false,
            current: 0, //设置当前处于第几步
        }
    },
    methods: {
        // 报名成为检察员
        signUpBtn() {
            this.disabled = true;
            this.current = 1;
            this.textBtn = "已报名"
            this.$request({
                url: '/apply',
                method: "post"
            })
                .then((res) => {
                    if (res.satusCode == 200) {
                        this.$refs.uToast.show({
							type: 'success',
							message: res.data.msg,
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
						})
                    } else {
                        this.$refs.uToast.show({
							type: 'error',
							message: res.data.errors[0]?.msg,
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
						})
                        this.disabled = false;
                        this.current = 0;
                        this.textBtn = "报名"
                    }
                })

        }
    }
}
</script>

<style lang="scss">
.top {
    margin: 0 80rpx;
    margin-bottom: 80rpx;
    margin-top: 160rpx;
    height: 80rpx;
    line-height: 80rpx;
}
.middle {
    .u-steps--row {
        margin-top: 200rpx;
    }
}
.btn {
    width: 40%;
    margin: auto;
    margin-top: 240rpx;
}
</style>