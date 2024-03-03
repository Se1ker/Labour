<template>
    <el-dialog v-model="stepVisible" @close="handleClose" :modal="false">
        <el-steps :space="200" :active="active" simple>
            <el-step title="导入场地课表" :icon="UploadFilled" />
            <el-step title="导入班级信息" :icon="UploadFilled" />
            <el-step title="输入单间教室分配人数" :icon="Edit" />
        </el-steps>
        <!-- http://localhost:3000 -->
        <!-- http://175.27.247.87:8081 -->
        <el-upload class="upload" drag action="http://localhost:3000/api/v1/uploadExcel" :limit="1" name="excel"
            :on-success="uploadSuccess"  ref="upload" v-if="!(urls.length === 2)" >
            <el-icon class="el-icon--upload">
                <upload-filled />
            </el-icon>
            <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    xlsx/xls files with a size less than 500kb
                </div>
            </template>
        </el-upload>
        <el-card v-if="(urls.length === 2)">
            <el-input v-model="cleanCount" />
            <div class="btn">
                <el-button type="primary" @click="distribute(urls,cleanCount)">点击进行分配</el-button>
                <el-button type="danger" @click="cancel">取消</el-button>
            </div>
        </el-card>
    </el-dialog>

</template>

<script setup>

import { ref, computed ,inject} from 'vue'
import { Edit, UploadFilled } from '@element-plus/icons-vue'
const emit = defineEmits(['update:modelValue', 'changeUpload','showData'])
const $api = inject('$api')
let upload = ref(null)
let active = ref(1)
let urls = ref([])
let cleanCount = ref('')
const next = () => {
    if (active.value === 1 || active.value === 2) {
        active.value++
        upload.value.clearFiles()
    }
}
const distribute = (urls,cleanCount) => {
    $api.task.distribute({urls,cleanCount}).then((res) =>{
        emit('showData',res.data)
    })
    stepVisible = false;
}
const cancel = () => {

}
const handleClose = () => {
    stepVisible = false;
}
const props = defineProps({
    stepVisible: {
        type: Boolean
    }
})
let stepVisible = computed({
    get: () => {
        return props.stepVisible
    },
    set: (val) => {
        emit('update:modelValue', val)
    }
})
const uploadSuccess = (response) => {
    console.log(response)
    urls.value.push(response)
    next()
}
</script>
<style lang = 'less' scoped>
.upload {
    width: 380px;
    margin: 0 auto;
}

.btn {
    width:380px;
    height:50px;
    margin: 0 auto;
    margin-top: 50px;
}
</style>