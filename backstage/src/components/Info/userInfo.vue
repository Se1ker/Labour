<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>用户信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>普通用户信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="tableData.data" border style="width: 100%" v-loading="loading">
        <el-table-column prop="stuId" label="学号" width="180" />
        <el-table-column prop="nickname" label="姓名" width="180" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="academyName" label="学院" />
        <el-table-column prop="className" label="班级" />
        <el-table-column label="Operations">
            <template #default="scope">
                <el-button size="small" type="primary" @click="showModify(scope.row)">Edit</el-button>
                <el-button size="small" type="danger" @click="deleteUser(scope.row._id)">Delete</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination v-if="!loading" v-model:currentPage="currentPage" v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40, 50]" :small="small" :disabled="disabled" :background="background"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    <el-dialog v-model="modifyVisible" title="用户信息修改" width="40%" :before-close="handleClose">
        <el-form :model="modifyForm" label-width="120px">
            <el-form-item label="姓名">
                <el-input v-model="modifyForm.nickname" />
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="modifyForm.email" />
            </el-form-item>
            <el-form-item label="学院">
                <el-select v-model="modifyForm.belong" :placeholder="modifyForm.academyName" @change="academyChange">
                    <el-option v-for="item in academyList" :label="item.name" :value="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item label="班级">
                <el-select v-model="modifyForm.class" :placeholder="modifyForm.className">
                    <el-option v-for="item in currentClassList" :label="item.name" :value="item._id" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="modifyVisible = false">取消</el-button>
                <el-button type="primary" @click="modify">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script  setup>

import { reactive, inject, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
let modifyVisible = ref(false)
let modifyForm = ref({})
const currentPage = ref(1)
const pageSize = ref(10)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const total = ref(0)
const $api = inject('$api')
const $fb = inject('$fb')
let loading = ref(true)
let tableData = reactive({
    data: []
})
let showModify = (item) => {
    modifyVisible.value = true
    modifyForm.value = item
    currentClassList.value = classList.value.filter(item => {
        return item.belong === modifyForm.value.belong
    })
}
let deleteUser = (userId) => {
    $fb.showLoading()
    loading.value = true
    $api.info.deleteUser({ userId }).then((res) => {
        $fb.closeLoading()
        loading.value = false
        getAllUser(currentPage.value - 1, pageSize.value)
        $fb.success()
    })
}
let academyList = ref([])
let classList = ref([])
let getList = () => {
    $api.info.listAcademy().then(res => {
        academyList.value = res.data
    })
    $api.info.listAllClass().then(res => {
        classList.value = res.data

    })
}
getList()
let currentClassList = ref([])
let academyChange = (currentAcademy) => {
    modifyForm.value.class = ''
    currentClassList.value = classList.value.filter(item => {
        return item.belong === currentAcademy
    })
}
let modify = () => {
    loading.value = true
    $fb.showLoading()
    $api.info.modifyUserInfo(modifyForm.value).then(res => {
        loading.value = false
        $fb.closeLoading()
        $fb.success()
        modifyVisible.value = false
    }).catch((err) => {
        console.log(err)
    })
}
const getAllUser = (skip, limit) => {
    loading.value = true
    $api.info.getAllUser({ skip, limit }).then(res => {
        tableData.data = res.data.userList
        $fb.success()
        loading.value = false
        total.value = res.data.count
    }).catch(() => {
        loading.value = false
        $fb.error()
    })
}
getAllUser(currentPage.value - 1, pageSize.value)
const handleSizeChange = (limit) => {
    getAllUser((currentPage.value - 1) * currentPage.value, limit)
}
const handleCurrentChange = (val) => {
    getAllUser(pageSize.value * (currentPage.value - 1), pageSize.value)
}
</script>
<style lang = 'less' scoped>
.el-pagination {
    margin-top: 20px;
}
</style>