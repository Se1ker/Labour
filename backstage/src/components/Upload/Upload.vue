<template>
    <el-dialog v-model="uploadVisible" @close="handleClose">
        <el-upload class="upload-demo" drag action="https://qc9qjl.api.cloudendpoint.cn/uploadFile" :limit="1"
            :on-success="uploadSuccess" ref="upload">
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
    </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { UploadFilled } from "@element-plus/icons-vue";
const emit = defineEmits(['update:modelValue', 'changeUpload'])
let upload = ref(null)
const handleClose = () => {
    uploadVisible = false;
}
const props = defineProps({
    uploadVisible: {
        type: Boolean
    }
})
let uploadVisible = computed({
    get: () => {
        return props.uploadVisible
    },
    set: (val) => {
        emit('update:modelValue', val)
    }
})
const uploadSuccess = (response) => {
    console.log(response)
}
</script>
