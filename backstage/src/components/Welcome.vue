<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>后台管理系统</el-breadcrumb-item>
        <el-breadcrumb-item>主面板</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="welcomeTitle">欢迎来到 劳动教育实践数字化管理与展示系统</div>

    <el-row class="dataBar">
        <el-col :span="4">
            <el-card>
                <el-row>
                    <el-col>今日打扫数</el-col>
                </el-row>
                <el-row>
                    <el-col :offset="6" style="fontSize:25px">128</el-col>
                </el-row>
                <el-row>
                    <el-col class="bottom">
                        未打扫
                        <span style="float:right">200</span>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="4" :offset="1">
            <el-card>
                <el-row>
                    <el-col>今日检查数</el-col>
                </el-row>
                <el-row>
                    <el-col :offset="6" style="fontSize:25px">200</el-col>
                </el-row>
                <el-row>
                    <el-col class="bottom">
                        未检查
                        <span style="float:right">20</span>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="4" :offset="1">
            <el-card>
                <el-row>
                    <el-col>今日活动数</el-col>
                </el-row>
                <el-row>
                    <el-col :offset="6" style="fontSize:25px">200</el-col>
                </el-row>
                <el-row>
                    <el-col class="bottom">
                        已审核
                        <span style="float:right">100</span>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="4" :offset="1">
            <el-card>
                <el-row>
                    <el-col>不合格教室</el-col>
                </el-row>
                <el-row>
                    <el-col :offset="6" style="fontSize:25px">200</el-col>
                </el-row>
                <el-row>
                    <el-col class="bottom">
                        合格教室
                        <span style="float:right">300</span>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
    <div class="headContainer">
        <div>
            <div>
                <el-card class="fast">
                    <span>快捷入口</span>
                    <el-card class="fastDetail" @click="() => { router.push('/map') }">
                        <el-link type="primary">可视化展示子系统</el-link>
                    </el-card>
                    <el-card class="fastDetail" @click="() => { router.push('/index') }">
                        <el-link type="primary">门户网站</el-link>
                    </el-card>
                </el-card>

            </div>
        </div>
        <div class="dateSheet">
            <el-calendar v-model="dateValue" />
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
const dateValue = ref(new Date())
const router = useRouter()
</script>
<style lang = 'less' scoped>
.el-row {
    margin-bottom: 10px;
}

.bottom {
    margin-bottom: -20px;
}

.headContainer {
    display: flex;
    justify-content: space-around
}

.welcomeTitle {
    width: 900px;
    height: 80px;
    font-size: 40px;
    font-family: 'STXingkai';
    margin: 0 auto;
}

.fast {
    margin-top: 20px
}

.fastDetail {
    width: 500px;
    margin-top: 20px;
    font-size: 25px;
    cursor: pointer;
}

.dateSheet {
    overflow: hidden;
    height: 520px;
    width: 500px;

}

.dataBar {
    margin-top: 20px;
    margin-bottom: 60px;
    justify-content: space-around;
}
</style>