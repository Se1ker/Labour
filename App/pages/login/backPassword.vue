<template>
	<view class="u-page">
		<!-- 所有内容的容器 -->
		<view class="title">卫生管理监督系统</view>
		<!-- 登录表单 -->
		<u-form :model="form" ref="uForm" label-width="120rpx" label-align="center">
			<u-form-item label="邮箱" prop="toEmail" borderBottom>
				<u--input v-model="form.toEmail" :clearable="false" placeholder="请输入邮箱" maxlength="20"
					type="text" border="none"></u--input>
			</u-form-item>
			<u-form-item label="新密码" prop="newPassword" borderBottom>
				<u--input v-model="form.newPassword" placeholder="请输入密码" :password-icon="false" maxlength="10"
					type="text" password border="none"></u--input>
			</u-form-item>
		</u-form>
		<view class="codeInput">
			<u-code-input v-model="code" mode="line" color="#f1f2f2" borderColor="#4d88ff" space="6" :fontSize="20"></u-code-input>
			<u-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange"></u-code>
			<view class="getCodeBtn">
				<u-button @tap="getCode" type="primary">{{tips}}</u-button>
			</view>
		</view>
		<view class="btn" @click="submit">
			<view class="btn_1">
				<u-button type="primary" color="linear-gradient(to top, #0ba360 0%, #3cba92 100%)" shape="circle" size="normal" text="确定"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					toEmail: '',
					newPassword: ''
				},
				rules: {
					toEmail: [{
							required: true,
							min: 2,
							message: '请输入邮箱',
							// 可以单个或者同时写两个触发验证方式 
							trigger: 'blur',
						},
						{
							pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
							message: '输入正确邮箱',
							trigger: 'blur'
						}
					],
					newPassword: [{
							required: true,
							min: 10,
							max: 16,
							message: '请输入新密码,10-16位',
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
				tips: '', // 发送倒计时
				seconds: 30, // 发送验证码间隔时间
				code: '' // 验证码
			}
		},
		methods: {
			// 修改密码方法
			submit() {
				// validate 对整个表单进行校验的方法
				this.$refs.uForm.validate().then(valid => {
					if (valid) {
						// 前端校验成功
						this.$request({
						url: '/modifyPass',
						method: 'post',
						data: {
							code: this.form.toEmail,
							newPass: this.form.newPassword
						}
					}).then((res) => {
						uni.$u.toast('修改成功')
						uni.redirectTo({
							url: './login'
						});
					})
					} else {
						// 前端校验失败
						this.$refs.uToast.show({
							title: "格式错误",
							type: 'error',
							position: 'top',
						})
					}
				});
			},
			// 倒计时
			codeChange(text) {
				this.tips = text;
			},
			// 发送验证码轻触事件
			getCode() {
				if (this.$refs.uCode.canGetCode && this.form.toEmail) {
					let toEmail = this.form.toEmail
					// 向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					this.$request({
						url: '/sendSecCode',
						method: 'post',
						data: {
							toEmail
						}
					}).then((res) => {
						console.log(res);
						uni.hideLoading();
						uni.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					})
				} else if (!this.form.toEmail) {
					uni.$u.toast('请先输入邮箱');
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			end() {
				//   uni.$u.toast('倒计时结束');
			},
			start() {
				//   uni.$u.toast('倒计时开始');
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
	}
</script>

<style>
	.u-page {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		height: 100vh;
		background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
		font-size: 60rpx;
	}

	/* 标题 */ 
	.title {
		margin: 150rpx auto;
		margin-bottom: 100rpx;
		font-size: 60rpx;
		line-height: 500rpx;
		height: 400rpx;
	}

	/* 表单区域 */
	.u-form {
		width: 70%;
		margin: 0 15%;
	}

	.u-form-item {
		background-color: #fff;
		border-radius: 60rpx;
		margin-bottom: 20rpx;
	}

	/* 按钮区域 */
	.btn {
		display: flex;
		justify-content: center;
	}

	.btn_1 {
		height: 160rpx;
		width: 240rpx;
		padding: 30rpx;
	}

	.u-form-item--left__content__label {
		padding-left: 20rpx;
	}

	.codeInput {
		display: flex;
		margin: 0 auto;
	}

	.getCodeBtn {
		padding-left: 20rpx;
	}
</style>
