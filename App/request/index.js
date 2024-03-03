// export const baseUrl = 'https://qc9qjl.app.cloudendpoint.cn/api/v1'
export const baseUrl = 'http://localhost:3000/api/v1'
var flag = true;
function countTime() {
	//获取当前时间  
	var date = new Date();
	//当前时间转时间戳
	var now = date.getTime();
	//设置截止时间  本地存储 或者 cookies
	var endDate = now + (24 * 3600 * 1000) * 14 - 3600 * 1000;
	uni.setStorageSync('endDate', endDate);
}
// 获取Token
function getToken() {
	// 14天 - 1小时
	if(flag){
		flag = !flag;
		countTime();
	}
	//时间差  对比 本地存储时间减去当前时间 小于0清空token重新登录
	var leftTime = uni.getStorageSync('endDate') - new Date().getTime();
	if (leftTime < 0) {
		//小于0清空token
		uni.clearStorageSync()
		flag = true;
	}
	try {
		const token = uni.getStorageSync('token');
		if (token) {
			return token
		} else {
			return null
		}
	} catch (err) {
		console.log(err)
	}
}

function request(data) {
	if (!data.url) {
		return "err"
	} else if (data.url == '/login' || data.url == '/sendSecCode'|| data.url == '/register') {
		// 针对登录注册接口
		return new Promise((resolve, reject) => {
			uni.request({
					url: baseUrl + data.url,
					method: data.method,
					data: data.data
				}).then((res) => {
					resolve(res[1])
				})
				.catch((response) => {
					reject(response)
				})
		})
	}
	// if (!getToken()) {
	// 	uni.reLaunch({
	// 		url: '/pages/login/login'
	// 	})
	// }
	// 将字符串转换为大写
	data.method ? data.method = data.method.toUpperCase() : data.method = 'GET';
	return new Promise((resolve, reject) => {
		if (!getToken()) {
			console.log(getToken());
			uni.reLaunch({
				url: '/pages/login/login'
			})
		}
		uni.request({
				url: baseUrl + data.url,
				method: data.method,
				data: data.data,
				header: {
					'authorization': "Bearer " + getToken()
				},
			}).then((res) => {
				if (res[1].statusCode === 401) {
					uni.clearStorageSync()
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
				resolve(res[1])
			})
			.catch((response) => {
				reject(response)
			})
	})
}
module.exports = request;
