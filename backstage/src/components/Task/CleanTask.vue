<template>
    <el-row>
        <el-col>
            <el-button type="primary" @click="changeStep(true)">
                打扫任务智能分配
            </el-button>
        </el-col>
    </el-row>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading" v-if="tableData.length">
        <el-table-column prop="academyName" label="责任学院" />
        <el-table-column prop="buildName" label="楼栋" />
        <el-table-column prop="areaName" label="教室号" />
        <el-table-column prop="className" label="责任班级" />
    </el-table>
    <el-pagination v-if="!loading" v-model:currentPage="currentPage" v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40, 50]" :small="small" :disabled="disabled" :background="background"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    <step v-model:stepVisible="stepVisible" @update:model-value="changeStep" @showData="showData" />
</template>

<script setup>
import step from '../Task/Step.vue'
import { ref, watch, inject } from 'vue'
const currentPage = ref(1)
const pageSize = ref(10)
const small = ref(false)
const disabled = ref(false)
const background = ref(false)
const total = ref(0)
const $api = inject('$api')
let tableData = ref([])
let tempData = ref([])
let loading = ref(true)
let stepVisible = ref(false)
let url = ref([])
let pickDisabled = ref(true)
// 翻页
const turnPage = (skip = 0, limit = 10) => {
    tableData.value = tempData.value.slice(skip, limit + skip)
}
const handleSizeChange = (limit) => {
    turnPage((currentPage.value - 1) * currentPage.value, limit)
}
const handleCurrentChange = (val) => {
    turnPage(pageSize.value * (currentPage.value - 1), pageSize.value)
}
$api.task.list().then(res => {
    tempData.value = res.data
    loading.value = false
    total.value = res.data.length
    turnPage()
})
let showData = (data) => {
    loading.value = true
    $api.task.list().then(res => {
        tempData.value = res.data
        loading.value = false
        total.value = res.data.length
        turnPage()
    })
}
watch(url, (url, preUrl) => {
    if (url.length === 2) pickDisabled.value = false
})
let changeStep = (val) => {
    stepVisible.value = val
}
</script>
<style lang = 'less' scoped>
.el-table {
    margin-top: 20px
}

.el-pagination {
    margin-top: 20px;
}
</style>