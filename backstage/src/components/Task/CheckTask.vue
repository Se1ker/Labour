<template>
    <el-button type="primary" @click="setCheck">生成检查任务</el-button>
    <el-button type="primary" @click="lunxun">轮询</el-button>
    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small" @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm" />
    <el-button :disabled="addRoomDis" v-else type="warning" class="button-new-tag ml-1" @click="showInput">点击修改单个任务检查数
        当前检查数:{{ checkCount }}
    </el-button>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="楼栋" width="180" />
        <el-table-column prop="count" label="教室数" width="180" />
        <el-table-column prop="limit" label="任务量" />
        <el-table-column prop="selectDetail" label="任务选择">
            <template #default="scope">
                <el-table :data="scope.row.selectDetail">
                    <el-table-column prop="weekDay" label="日期" />
                    <el-table-column prop="remain" label="剩余量" />
                </el-table>
                <el-table :data="scope.row.select">
                    <el-table-column prop="selectItem" label="单项任务数" />
                </el-table>
            </template>
        </el-table-column>
        <el-table-column label="Operations">
            <template #default="scope">
                <el-button size="large" type="primary">Edit</el-button>
                <el-button size="large" type="danger">Delete</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup>

import { ref, inject, nextTick } from 'vue'
let inputVisible = ref(false)
let inputValue = ref()
const $api = inject('$api')
let tableData = ref([])
let loading = ref(true)
let InputRef = ref(null)
let checkCount = ref(0)
$api.check.getCheckCount().then(res => {
    checkCount.value = res.data
})
const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}
let lunxun = async () => {
    for (let i = 1; i < 243; i++) {
        console.log(i)
        await $api.check.modifyCheckCount({ checkCount: i }).then(res => {
            checkCount.value = res.data
            setCheck()
        })
    }
}
let setCheck = async () => {
    loading.value = true
    await $api.check.setCheck().then(async res => {
        await $api.check.getCheckList().then((res) => {
            for (let item of res.data) {
                item.select.forEach((selectItem, index) => {
                    item.select[index] = { index, selectItem }
                })
            }
            let avl = 0
            let varn = 0
            for (let arrItem of res.data[0].select) {
                avl += arrItem.selectItem
            }
            avl = avl / res.data[0].select.length
            console.log("平均值" + avl)
            for (let arrItem of res.data[0].select) {
                varn += (arrItem.selectItem - avl) * (arrItem.selectItem - avl)
            }

            console.log(res.data[0].select.length)
            varn = varn / res.data[0].select.length
            console.log("方差：" + varn)
            tableData.value = res.data
            loading.value = false
        })
    })
}
const handleInputConfirm = () => {
    if (inputValue.value) {
        $api.check.modifyCheckCount({ checkCount: inputValue.value }).then(res => {
            checkCount.value = res.data
        })
    }
    inputVisible.value = false
    inputValue.value = ''
}
$api.check.getCheckList().then((res) => {
    loading.value = true
    for (let item of res.data) {
        item.select.forEach((selectItem, index) => {
            item.select[index] = { index, selectItem }
        })
    }
    tableData.value = res.data
    loading.value = false
})
</script>
<style lang = 'less' scoped>
.el-table {
    margin-top: 20px
}

.el-input {
    width: 100px;
}
</style>