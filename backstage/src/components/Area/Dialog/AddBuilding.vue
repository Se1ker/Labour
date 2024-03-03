<template>
    <!-- 添加楼栋 对话框 -->
    <el-dialog title="添加楼栋" v-model="dialogVisible" width="40%" @close="dialogVisible = false">
        <el-form>
            <el-form-item label="楼栋名:" label-position="left">
                <el-input autocomplete="off" v-model="buidlingName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue'

const props = defineProps({
    addBuildingVisible: {
        type: Boolean
    },
    addBuilding: {
        type: Function
    },
    buidlingName: {
        type: String
    }
})
const emit = defineEmits(['update:modelValue', 'addBuilding'])
const add = () => {
    props.addBuilding(props.buidlingName)
}
const dialogVisible = computed({
    get: () => {
        return props.addBuildingVisible
    },
    set: (val) => {
        emit('update:modelValue', val)
    }
})
</script>
<style lang = 'less' scoped>
.el-dialog {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
</style>