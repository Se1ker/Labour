<template>
	<view class="u-page">
		<!-- 所有内容的容器 -->
		<view class="title"><text class="title_child">劳动教育实践<br>数字化管理与展示系统</text></view>
		<!-- 登录表单 -->
		<u-form :model="form" ref="uForm" label-width="120rpx" label-align="center">
			<u-form-item label="学号" prop="account" borderBottom>
				<u--input v-model="form.account" :clearable="false" placeholder="请输入学号" minlength="10" type="text"
					border="none"></u--input>
			</u-form-item>
			<u-form-item label="密码" prop="password" borderBottom>
				<u--input v-model="form.password" placeholder="请输入密码" :password-icon="false" maxlength="16" type="text"
					password border="none"></u--input>
			</u-form-item>
		</u-form>
		<view id="backPassword" @click="backPassword">找回密码</view>
		<view class="btn">
			<view class="btn_1">
				<u-button type="primary" @click="addNember" color="linear-gradient(to top, #0ba360 0%, #3cba92 100%)"
					shape="circle" size="normal" text="注册"></u-button>
			</view>
			<view class="btn_1">
				<u-button type="primary" @click="submit" color="linear-gradient(to top, #0ba360 0%, #3cba92 100%)"
					shape="circle" size="normal" text="登录"></u-button>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				"account": "2009101032",
				"password": "1234567890"
			},
			rules: {
				account: [{
					required: true,
					message: '请输入学号',
					// 可以单个或者同时写两个触发验证方式 
					trigger: 'blur',
				},
				{
					pattern: /^[12][0-9]{7}[0-6][0-9]$/,
					message: '该账号不存在',
					trigger: 'blur',
				}
				],
				password: [{
					required: true,
					min: 3,
					max: 16,
					message: '请输入密码,10-16位',
					// 可以单个或者同时写两个触发验证方式 
					trigger: ['change', 'blur'],
				},
				{
					pattern: /^[A-Za-z0-9]+$/,
					message: '密码只能为数字或字母',
					trigger: 'blur'
				}
				],
			},
			show: false,
		}
	},
	methods: {
		// 登录按钮
		async submit() {
			await this.$request({
				url: "/login",
				method: "post",
				data: this.form
			}).then((res) => {
				console.log(res);
				if (res?.statusCode == 200) {
					try {
						uni.setStorageSync('token', res.data.data.token);
					} catch (e) {
						console.log(e);
					}
					this.$store.commit('passwordLength', this.form.password.length)
					this.$refs.uToast.show({
						type: 'success',
						message: res.data.msg,
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
						complete() {
							uni.switchTab({
								url: '/pages/index/index'
							})
						}
					})
				} else {
					this.$refs.uToast.show({
						type: 'error',
						message: res.data.msg,
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
					})
				}
			}).catch(err => {
				console.log(err);
				this.$refs.uToast.show({
					type: 'error',
					message: "登录失败",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
				})
			})
		},
		addNember() {
			uni.navigateTo({
				url: "./addNember"
			})
		},
		backPassword() {
			uni.navigateTo({
				url: "./backPassword"
			})
		}
	},
	// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
	onReady() {
		// setRules 调用此方法，设置校验规则
		this.$refs.uForm.setRules(this.rules);
	}
}
</script>

<style>
.u-page {
	margin: 0;
	padding: 0;
	height: 100vh;
	/* background-color: #7eb6f854; */
	/* background-image: linear-gradient(to bottom right, #7a88ff, #7affaf); */
	background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
	/* background-image: linear-gradient(to top, #c1dfc4 0%, #deecdd 100%); */
	font-size: 60rpx;
}

/* 标题区域 */
.title {
	width: 100%;
	height: 400rpx;
	text-align: center;
	padding-top: 10rem;
	/* margin-bottom: 50rpx; */
	line-height: 60rpx;
}

.title_child {
	display: inline-block;
	height: 80rpx;
	width: 480rpx;
	font-size: 44rpx;
}

/* 表单区域 */
.u-form {
	width: 70%;
	margin: 0 15%;
	margin-top: 0rpx;
}

.u-form-item {
	background-color: #fff;
	border-radius: 60rpx;
	margin-bottom: 20rpx;
}

/* 找回密码 */
#backPassword {
	/* float: right; */
	margin-right: 80rpx;
	text-align: right;
	color: #666;
	font-size: 16px;
}

/* 按钮 */
.btn {
	display: flex;
	margin-top: 30rpx;
}

.btn_1 {
	width: 200rpx;
	height: 120rpx;
	margin: 0rpx auto;
	/* margin-left: 70rpx; */
}
</style>
