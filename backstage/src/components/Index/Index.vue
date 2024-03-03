<template>
    <div class="index" style="background:url('/static/brige1.jpg')">
        <el-container>
            <el-header>
                <el-affix :offset="0" class="headTab">
                    <div class="background"></div>
                    <el-row :gutter="20">
                        <el-col :span="6" :offset="10">
                            <el-image src="/static/logo.png"
                                fit="fill" class="logo"></el-image>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5">
                            <div class="tabTitle">
                                <el-link @click="toDetail('intro')">项目介绍</el-link>
                            </div>
                        </el-col>
                        <el-col :span="5"> 
                            <div class="tabTitle">
                                <el-link @click="toDetail('download')">APP下载</el-link>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="logoTitle">劳动教育实践数字化管理与展示系统</div>
                        </el-col>
                        <el-col :span="5">
                            <div class="tabTitle">
                                <el-link @click="toBack">后台管理子系统</el-link>
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div class="tabTitle">
                                <el-link @click="toMap">可视化展示子系统</el-link>
                            </div>
                        </el-col>
                    </el-row>
                </el-affix>
            </el-header>
            <Intro id="intro" />
            <!-- <Download id="download" /> -->
                <!-- <Footer /> -->
        </el-container>
    </div>
</template>

<script>

import { defineComponent } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import Intro from './Intro.vue'
import Login from './Login.vue'
import Download from './Download.vue'
import Footer from './Footer.vue'
export default defineComponent({
    components: {
        Intro,
        Login,
        Download,
        Footer
    },

    setup() {
        const router = useRouter()
        const toBack = () => {
            router.push('/login')
        }
        const toMap = () => {
            router.push('/map')
        }
        const goHome = () => {
            router.push('/home')
        }
        const toDetail = (id) => {
            const scrollDom = document.getElementById(id);
            scrollDom.scrollIntoView();
        }
        onBeforeRouteLeave((to, from, next) => {
            if (to.path === '/login') {
                let tokenStr = window.sessionStorage.getItem('token')
                if (!tokenStr) {
                    next()
                } else {
                    goHome()
                }
            } else {
                next()
            }
        })
        return {
            toDetail, toBack, toMap
        }
    }
})
</script>
<style lang = 'less' scoped>
#intro {
    margin: 0px auto;
    height:100%
}

#download {
    margin: 20px auto;
}

.headTab {
    margin-top: -100px;
    width: 1400px;
}

.background {
    position: absolute;
    width: 1500px;
    height: 120px;
    margin: 0 auto;
    background: -webkit-linear-gradient(rgba(0, 0, 0, 0.4),
            rgba(0, 0, 0, 0.1));
}

.logo {
    width: 60px;
    height: 60px;
}

.logoTitle {
    font-family: "PingFang SC";
}

.tabTitle {
    font-size: 30px;
}

.el-row {
    text-align: center;
}

.index {
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
    height:100%;
    background-repeat: no-repeat !important;
}

.el-main {
    margin-top: 30px;
    height: 800px;
}

.el-header {
    overflow: hidden;
    height: 200px;
    margin: 0 auto;
    padding: 0;
}
.el-container{
    height:1000px;
}
.headImg {
    height: 530px;
    width: 1400px;
    mask: linear-gradient(185deg, transparent, rgb(94, 92, 92));
}
</style>