<template>
    <el-container class="home-container">
        <el-header>
            <el-image
                src="https://qc85lv.file.qingfuwucdn.com/file/c12e1784280aac10_1646981274424.png"
                fit="contain"
            ></el-image>
            <div @click="() => { router.push('/welcome') }" style="cursor: pointer;">劳动教育实践数字化管理与展示系统</div>
            <el-button type="danger" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <div>
                <el-button @click="isCollapse = !isCollapse" type="primary" :style="btnStyle">|||</el-button>
                <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    :collapse="isCollapse"
                    :router="true"
                >
                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon>
                                <user-filled />
                            </el-icon>
                            <span>用户信息管理</span>
                        </template>
                        <el-menu-item index="userInfo">普通用户信息</el-menu-item>
                        <el-menu-item index="checkerInfo">检查员信息</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon>
                                <office-building />
                            </el-icon>
                            <span>卫生区域管理</span>
                        </template>
                        <el-menu-item index="areaInfo">卫生区域信息</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="3">
                        <template #title>
                            <el-icon>
                                <list />
                            </el-icon>
                            <span>任务管理</span>
                        </template>
                        <el-menu-item index="cleanTask">打扫任务管理</el-menu-item>
                        <el-menu-item index="checkTask">检查任务管理</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="4">
                        <template #title>
                            <el-icon>
                                <paperclip />
                            </el-icon>
                            <span>活动管理</span>
                        </template>
                        <el-menu-item index="activityCheck">活动管理</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </div>

            <el-main>
                <el-card>
                    <router-view></router-view>
                </el-card>
            </el-main>
        </el-container>
    </el-container>
</template>

<script  setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import {
    List,
    Paperclip,
    UserFilled,
    OfficeBuilding,
    Menu as IconMenu,
} from '@element-plus/icons-vue'
const router = useRouter()
const logout = () => {
    router.push('/index')
}
const isCollapse = ref(true)
const btnStyle = computed(() => {
    return {
        width: !isCollapse.value ? "200px" : "63px"
    }
})
</script>
<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.el-menu {
    margin-top: 50px;
}
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 1rem;
    .el-image {
        width: 50px;
        height: 50px;
        margin-left: 80px;
    }
}

.el-main {
    background-color: #e9eef3;
}
</style>