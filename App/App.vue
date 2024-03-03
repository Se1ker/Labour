<script>
export default {
  onLaunch: function() {
	  const token = uni.getStorageSync('token');
    // token存在时
    if ((token??'') !== '') {
      uni.switchTab({
        url: 'pages/index/index',
        animationType: 'pop-in',
        animationDuration: 200,
        complete: () => {
          //跳转完页面后再关闭启动页
          // setTimeout(function() {
          //   // #ifdef APP-PLUS
          //   plus.navigator.closeSplashscreen();
          //   // #endif
          // }, 2000)
        }
      });
    } else {
      // 跳转到登录页
      uni.redirectTo({
        url: 'pages/login/login',
        animationType: 'pop-in',
        animationDuration: 200,
        complete: () => { 
          //跳转完页面后再关闭启动页
          // setTimeout(function() {
          //   // #ifdef APP-PLUS
          //   plus.navigator.closeSplashscreen();
          //   // #endif
          // }, 2000)
        }
      });
    }
  },
  onShow: function() {
    console.log('App Show')
    //解决uniapp设置自动登录跳转首页时加载登录页问题
			setTimeout(() => {
				// #ifdef APP-PLUS
				plus.navigator.closeSplashscreen();
				// #endif
			}, 1200);
  },
  onHide: function() {
    // console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import 'uview-ui/index.scss';
/*每个页面公共css */
</style>