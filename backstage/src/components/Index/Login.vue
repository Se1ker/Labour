<template>
    <div class="loginBack">
        <el-card class="loginCard">
            <el-image src="static/loginImg.jpg" fit="fill"></el-image>
            <div class="loginForm">
                <el-form label-position="right" label-width="100px" style="max-width: 460px">
                    <el-link href="/index">
                        <h1 style="text-align:center;margin-top:-60px">智慧校园劳动教育数字化管理与展示系统</h1>
                    </el-link>

                    <h3 style="text-align:center;margin-top:20px;margin-bottom:60px">后台管理系统登录</h3>
                    <el-form-item label="账号">
                        <el-input v-model="loginForm.stuId"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="loginForm.password" type="password"></el-input>
                    </el-form-item>
                    <div style="margin-left: 20px;display:flex;justify-content:space-around">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="danger" @click="reset">清空</el-button>
                    </div>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script setup>

import { reactive, inject } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { useRouter} from 'vue-router'
const router = useRouter()
const $api = inject('$api')

const login = () => {
    console.log(1)
    const loadingInstance = ElLoading.service({ text: "正在登录" })
    $api.admin.login(loginForm).then(res => {
        console.log(res)
        loadingInstance.close()
        window.sessionStorage.setItem(
            "token",
            "Bearer " + res.data.token
        );
        router.push('/home')
    }).catch(err => {
        console.log(err)
        ElMessage({
            type: 'error',
            message: '登陆失败，请检查账号或者密码',
            showClose: true
        });
        loadingInstance.close()

    })
}
const loginForm = reactive({
    stuId: "",
    password: "",
})
const reset = () => {
    loginForm.stuId = ""
    loginForm.password = ""
}
</script>
<style lang = 'less' scoped>
.loginBack {
    overflow: hidden;
    height: 100%;
    width: 100%;
    background: url("/public/static/4.jpg");
    background-repeat: no-repeat;
    background-size: 100%;
    .loginCard {
        opacity: 0.7;
        width: 1200px;
        height: 500px;
        margin: 100px auto;
        border-radius: 50px;
        :deep(.el-card__body) {
            display: flex;
            flex-direction: row;
        }
        .loginForm {
            margin-top: 100px;
            margin-left: 180px;
            .el-form-item {
                margin-left: -50px;
            }
        }
        .el-image {
            width: 500px;
            height: 450px;
        }
    }
}
</style>