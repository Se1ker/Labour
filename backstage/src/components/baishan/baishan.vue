<template>
    <el-container>
        <el-header>
            <el-row>
                <el-col :span="2">
                    <el-image style="width: 100px; height: 100px" src="/static/baishan.png" fit="fill" />
                </el-col>
                <el-col :span="5">
                    <span class="logoTit">百善</span>
                </el-col>
                <el-col :span="10">
                    <span class="title">社工端后台系统</span>
                </el-col>
                <el-col :span="2">
                    <el-avatar :size="50" fit="fill" src="/static/head.png" class="admin" />
                </el-col>
                <el-col :span="3">
                    <span class="name">陈社工(管理员)</span>
                </el-col>
                <el-col :span="2">
                    <el-button type="danger" class="logout">退出</el-button>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row :gutter="130">
                <el-col :span="8">
                    <el-card class="box-card">
                        <el-image style="width: 70px; height: 70px" src="/static/data.png" fit="fill" class="gotoPic" />
                        <div class="mainTit">健康数据中心</div>
                        <el-button type="primary" class="goto">进入</el-button>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card class="box-card">
                        <el-image style="width: 70px; height: 70px" src="/static/package.png" fit="fill"
                            class="gotoPic" />
                        <div class="mainTit">老人管理</div>
                        <el-button type="primary" class="goto">进入</el-button>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card class="box-card">
                        <el-image style="width: 70px; height: 70px" src="/static/order.png" fit="fill"
                            class="gotoPic" />
                        <div class="mainTit">服务订单</div>
                        <el-button type="primary" class="goto">进入</el-button>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="130">
                <el-col :span="8">
                    <el-card class="box-card">
                        <el-image style="width: 70px; height: 70px" src="/static/search.png" fit="fill"
                            class="gotoPic" />
                        <div class="mainTit">监测系统</div>
                        <el-button type="primary" class="goto">进入</el-button>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card class="box-card">
                        <el-image style="width: 70px; height: 70px" src="/static/date.png" fit="fill" class="gotoPic" />
                        <div class="mainTit">子女端反馈</div>
                        <el-button type="primary" class="goto">进入</el-button>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card class="box-card">
                        <el-image style="width: 70px; height: 70px" src="/static/pen.png" fit="fill" class="gotoPic" />
                        <div class="mainTit">政务平台</div>
                        <el-button type="primary" class="goto">进入</el-button>
                    </el-card>
                </el-col>
            </el-row>

        </el-main>
    </el-container>
</template>

<script setup>

import { ref, reactive } from 'vue'
</script>
<style lang = 'less' scoped>

.el-main {
    margin-top: 20px;
    width: 1200px;
    overflow: hidden;
}

.goto {
    margin-left: 35%;
    margin-top: 20px;
}

.mainTit {
    text-align: center;
    margin-top: 20px;
    font-size: 25px
}

.gotoPic {
    margin-left: 35%;
}

#app {
    width: 1200px
}

.el-container {
    width: 1200px;
    margin: 0 auto
}

.el-header {
    width: 1200px;
    background-color: #ffe5f7;
    height: 100px
}


.logo {
    height: 100px
}

.logoTit {
    font-family: 'STXingkai';
    margin-left: 10px;
    color: #860032;
    font-size: 50px;
    line-height: 100px;
}

.title {
    font-family: 'STXingkai';
    line-height: 100px;
    font-size: 50px;
}

.el-avatar {
    margin-top: 20px;
}

.name {
    margin-left: -20px;
    line-height: 100px;
    font-size: 15px;
    color: #860032;
}

.logout {
    margin-top: 30px;
}

.el-main {
    background-color: #fff
}

.box-card {
    width: 290px;
    height: 225px;
}
</style>