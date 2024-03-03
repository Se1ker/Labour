<template></template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
const props = defineProps({
    buildingName: {
        type: String
    },
    removeBuilding: {
        type: Function
    }
})
const open = () => {
    ElMessageBox.confirm(
        `此操作将会永久删除${props.buildingName}及其所有教室`,
        'Warning',
        {
            confirmButtonText: '确认删除',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            props.removeBuilding()
            ElMessage({
                type: 'success',
                message: 'Delete completed',
            })
        })
        .catch((err) => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            })
        })
}
defineExpose({ open })
</script>
<style lang = 'less' scoped>
</style>