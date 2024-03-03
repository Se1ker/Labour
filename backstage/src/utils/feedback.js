import { ElLoading, ElMessage } from 'element-plus'
import {nextTick} from 'vue'
const errorMsg = {
    type: 'error',
    message: '操作失败，请重试',
    showClose: true
}
const successMsg = {
    type: 'success',
    message: '操作成功',
    showClose: true
}

const feedbackEvents = {
    error: () => {
        ElMessage(errorMsg)
    },
    success: () => {
        ElMessage(successMsg)
    },
    showLoading: (options) => {
        ElLoading.service({ fullscreen: true, ...options })
    },
    closeLoading: () => {
        let loadingInstance = ElLoading.service()
        nextTick(() => {
            loadingInstance.close()
        })
    },
}
export default feedbackEvents