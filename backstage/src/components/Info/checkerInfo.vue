<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>用户信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>检查员信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
        <el-col :span="6">
            <el-input v-model="searchInput" placeholder="search by stuId" clearable @clear="clear" />
        </el-col>
        <el-col :span="1">
            <el-button :icon="Search" type="primary" @click="search" />
        </el-col>
    </el-row>
    <el-table :data="tableData.data" border style="width: 100%" v-loading="loading">
        <el-table-column label="姓名" prop="nickname"></el-table-column>
        <el-table-column label="学号" prop="stuId"></el-table-column>
        <el-table-column label="学院" prop="academyName"></el-table-column>
        <el-table-column label="班级" prop="className"></el-table-column>
        <el-table-column label="检查楼栋" prop="buildName"></el-table-column>
        <el-table-column label="检查教室">
            <template #default="scope">
                <el-tag v-for="item in scope.row.room">{{ item.roomName }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="Operations">
            <template #default="scope">
                <el-button size="small" type="primary">Edit</el-button>
                <el-button size="small" type="danger">Delete</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination v-if="!loading" v-model:currentPage="currentPage" v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40, 50]" :small="small" :disabled="disabled" :background="background"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'

import { reactive, inject, ref } from 'vue'
import {
    Search,
} from '@element-plus/icons-vue'
const currentPage = ref(1)
const pageSize = ref(10)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const total = ref(0)
let searchInput = ref()
const $api = inject('$api')
const $fb = inject('$fb')
let loading = ref(true)
let tableData = reactive({
    data: []
})
let initData = []
const getAllChecker = (skip, limit) => {
    loading.value = true
    if (tableData.data.length === 0) {
        $api.info.getAllChecker().then((res) => {
            $fb.success()
            initData = res.data
            tableData.data = initData.slice(currentPage.value - 1, pageSize.value)
            loading.value = false
            total.value = initData.length
        }).catch(() => {
            $fb.error()
            loading.value = false
        })
    } else {
        tableData.data = initData.slice(skip, skip + limit)
        loading.value = false
    }

}
getAllChecker()
const handleSizeChange = (limit) => {
    getAllChecker((currentPage.value - 1) * currentPage.value, limit)
}
const handleCurrentChange = (val) => {
    getAllChecker(pageSize.value * (currentPage.value - 1), pageSize.value)
}
const search = () => {
    tableData.data = initData.filter(item => {
        return item.stuId === searchInput.value
    })
}
const clear = () => {
    tableData.data = initData.slice(pageSize.value * (currentPage.value - 1), pageSize.value)
}
</script>
<style lang = 'less' scoped>
.el-tag {
    margin-right: 5px;
    margin-top: 5px;
}

.el-pagination {
    margin-top: 20px;
}

.el-table {
    margin-top: 20px;
}
</style>