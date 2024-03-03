<template>
	<view class="box">
		<!-- 占位 -->
		<view class="placeholder">卫生管理监督系统</view>
		<!-- 注册表单 -->
		<u-form :model="form" ref="uForm" label-width="120rpx" label-align="center">
			<!-- 用户名区域 -->
			<u-form-item label="邮箱" prop="toEmail" borderBottom>
				<view class="input_Verification">
					<u--input v-model="form.toEmail" :clearable="false" placeholder="请输入邮箱" maxlength="20" type="text"
						border="none"></u--input>
				</view>
			</u-form-item>
			<!-- 学号区域 -->
			<u-form-item label="学号" prop="stuId" borderBottom>
				<u--input v-model="form.stuId" :clearable="false" placeholder="请输入学号" maxlength="10" type="number"
					border="none"></u--input>
			</u-form-item>
			<!-- 密码区域 -->
			<u-form-item label="密码" prop="password" borderBottom>
				<u--input v-model="form.password" :clearable="false" placeholder="请输入密码" maxlength="16" type="text"
					password border="none"></u--input>
			</u-form-item>
		</u-form>
		<view class="codeInput">
			<u-code-input v-model="code" mode="line" color="#f1f2f2" borderColor="#4d88ff" space="6" :fontSize="20">
			</u-code-input>
			<u-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange"></u-code>
			<view class="getCodeBtn">
				<u-button @tap="getCode" type="primary">{{tips}}</u-button>
			</view>
		</view>
		<view class="btn">
			<u-button type="primary" @click="submit" color="linear-gradient(to top, #0ba360 0%, #3cba92 100%)"
				shape="circle" size="normal" text="注册"></u-button>
		</view>
		<!-- 消息提示应用 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					stuId: '',
					password: '',
					toEmail: '',
				},
				rules: {
					stuId: [{
							required: true,
							message: '请输入学号',
							// 可以单个或者同时写两个触发验证方式 
							trigger: 'blur',
						},
						{
							pattern: /^[12][0-9]{7}[0-6][0-9]$/,
							message: '该学号不存在',
							trigger: 'blur',
						}
					],
					password: [{
							required: true,
							min: 10,
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
				},
				tips: '', // 发送倒计时
				seconds: 30, // 发送验证码间隔时间
				code: '' // 验证码
			}
		},
		methods: {
			// 注册按钮确定事件
			submit() {
				// validate 对整个表单进行校验的方法
				this.$refs.uForm.validate().then(valid => {
					if (valid && this.code) {
						// 前端校验成功
						this.form.code = this.code; // 将验证码加入表单对象，整理数据发送
						// 调用后台接口检验邮箱是否存在，存在，则提示该邮箱已注册
						this.$request({
							url: '/register',
							method: 'post',
							data: this.form
						}).then((res) => {
							console.log(res);
							if (res.statusCode == 200) {
								uni.$u.toast('注册成功');
							} else {
								uni.$u.toast('注册失败');
							}

						}).catch(err => {
							console.log(err);
						})
					}
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
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
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			// setRules 调用此方法，设置校验规则
			this.$refs.uForm.setRules(this.rules);
		}
	};
</script>

<style lang="scss">
	.box {
		display: flex;
		flex-direction: column;
		background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
		height: 100vh;
		width: 100%;
	}

	/* 占位 */
	.placeholder {
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

	.btn {
		width: 200rpx;
		height: 120rpx;
		margin: 30rpx auto;
	}

	.codeInput {
		display: flex;
		margin: 0 auto;
	}

	.getCodeBtn {
		padding-left: 20rpx;
	}
</style>
