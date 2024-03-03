<template>
    <view>
		<u-picker :show="show" :columns="columns" :loading="pickerStatus" closeOnClickOverlay @confirm="confirm" @cancel="cancel"></u-picker>
        <view class="btn">
		    <u-button @click="show = true" :text="tower" size="large" color="linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%"></u-button>
        </view>
        <view class="btn">
		    <u-button class="btnSon" @click="chooseWeek(index)" :text="item.weekDay" :type="item.type" :disabled="item.remain === 0? true : false" size="large" v-for="(item, index) in week" :key="index"></u-button>
        </view>
        <view class="btn chooseBtn">
		    <u-button @click="chooseTask" text="确定选择" size="large" color="#8063fc"></u-button>
        </view>
        <u-toast ref="uToast"></u-toast>
	</view>
</template>
<script>
export default {
    data() {
        return {
            show: false,
            // 楼栋列表
            columns: [
                []
            ],
            bid: "",    // 楼栋id
            tower: "选择楼栋",
            allTower: [],    // 所有楼栋信息
            week: [
            {weekDay:'周一',type:"default",remain:0},
            {weekDay:'周二',type:"default",remain:0},
            {weekDay:'周三',type:"default",remain:0},
            {weekDay:'周四',type:"default",remain:0},
            {weekDay:'周五',type:"default",remain:0}
            ],
            pickerStatus: false
        }
    },
    methods: {
        chooseWeek(i) {
            if(this.week[i]) {
                for(let i in this.week) {
                    this.week[i].type = "default";
                }
                console.log(this.week)
                this.week[i].type = "success";
            }
        },
        confirm(e) {
            if(e) {
                let selectDetail = new Array();
                this.tower = e.value[0]
                for(let i in this.allTower) {
                    // 找到选中楼栋的数据
                    if(this.allTower[i].name === this.tower) {
                        selectDetail = this.allTower[i].selectDetail;
                        this.bid = this.allTower[i]._id;
                    }
                }
                // 将获取到的数据进行处理
                for(let j in selectDetail){
                    this.week[j].remain = selectDetail[j].remain;
                }
         
            }
            this.show = false;
        },
        cancel() {
            this.show = false;
        },
        chooseTask() {
            // this.bid,
            let weekDay = "";
            for(let i in this.week) {
                if(this.week[i].type === "success") { weekDay = this.week[i].weekDay }
            }
            if(this.bid && weekDay) {
                this.$request({ 
                    url: '/createCheck',
                    method: 'POST',
                    data: {
                        "weekDay": weekDay,
                        "bid": this.bid
                    }
                })
                .then((res) => {
					console.log(res)
                    if(res.statusCode === 200) {
                        // 成功
                        this.$refs.uToast.show({
						type: 'success',
						message: "选择成功",
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
					})
                    } else {
                        this.$refs.uToast.show({
						type: 'error',
						message: res.data.errors[0].msg,
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
					})
                    }
                })
            } else {
                this.$refs.uToast.show({
						type: 'error',
						message: "请先选择任务",
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
					})
            }
        }
    },
    created() {
        this.pickerStatus = true;
        this.$request({
				url: '/getCheckList'
			}).then((res) => {
                if(res.statusCode === 200) {
                    // 保存楼栋信息
                    this.allTower = res.data.data
                    // 生成columns列表
                    for(var index in this.allTower) {
                        this.columns[0].push(res.data.data[index].name)
                    }
                    this.pickerStatus = false;
                }
			})
    }
}
</script>

<style lang="scss">
.btn {
    width: 80%;
    margin: 10%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .u-button {
        margin: 10px 0;
        border: 1rpx solid #d9d9d9;
        border-radius: 24rpx;
    }
    .btnSon {
        width: 40%;
        margin-right: 10px;
    }
}
.chooseBtn {
    margin-top: 80px;
}
</style>