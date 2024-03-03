//引入 axios
import axios from "axios";
import { ElMessage } from 'element-plus';

const http = axios.create({
    // http://localhost:3000
    // http://175.27.247.87:8081
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 50000
})

// 数据请求拦截
http.interceptors.request.use((config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 返回响应数据拦截
http.interceptors.response.use((res) => {
    const data = res.data;
    // 状态码为 2xx 范围时都会调用该函数，处理响应数据
    if (res.status === 200) {
        const code = data.code;
        return Promise.resolve(data);
    }
}, (error) => {
    if (error.response.status) {
        // 状态码超过 2xx 范围时都会调用该函数，处理错误响应
        switch (error.response.status) {
            case 404:
                ElMessage({
                    type: 'error',
                    message: '请求路径找不到！',
                    showClose: true
                });
                break;
            case 401:
                ElMessage({
                    type: 'error',
                    message: '未授权，请重新登录',
                    showClose: true
                });
                window.sessionStorage.removeItem('token')
                // location.href = '/login'
                break;
            case 500:
                ElMessage({
                    type: 'error',
                    message: '服务器内部错误！',
                    showClose: true
                });
                break;
            default:
                break;
        }
    }
    return Promise.reject(error);
});
export default http;

