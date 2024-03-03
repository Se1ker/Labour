<template>
    <el-button type="primary" @click="changeData('all')">总览</el-button>
    <el-button type="info" @click="changeData('unCheck')">未审核</el-button>
    <el-button type="success" @click="changeData('pass')">通过审核</el-button>
    <el-button type="danger" @click="changeData('unPass')">未通过审核</el-button>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="活动标题" />
        <el-table-column prop="content" label="活动内容" />
        <el-table-column prop="score" label="活动分数" width='40' />
        <el-table-column prop="ownerName" label="活动发起人" />
        <el-table-column prop="ownerEmail" label="发起人邮箱" />
        <el-table-column prop="location" label="活动地点" />
        <el-table-column label="创建时间">
            <template #default="scope">
                {{ scope.row.createdAt.toString().split('T')[0] }}
            </template>
        </el-table-column>
        <el-table-column label="状态">
            <template #default="scope">
                <el-tag class="ml-2" :type=scope.row.tagType> {{
                        scope.row.isPass === undefined ? '未审核' : (scope.row.isPass ?
                            '通过审核' : '未通过审核')
                }} </el-tag>
                <el-tag class="ml-2">
                    {{ scope.row.signOut.length === 0 ? '未结项' : (scope.row.isDone === undefined ?
                            '已提交结项材料' : (scope.row.isDone ? '已结项' : '拒绝结项'))
                    }}
                </el-tag>
                <span style="margin-left: 10px"></span>
            </template>
        </el-table-column>
        <el-table-column>
            <template #default="scope">
                <el-button type="primary" @click="showDialog(scope.row)">Edit</el-button>
                <el-button type="danger">Delete</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog title="活动管理" v-model="dialogVisible" @close="dialogVisible = false">
        <div>活动审核:</div>
        <el-switch v-model="checkStatus" class="mb-2" active-color="#13ce66" inactive-color="#ff4949" active-text="通过"
            inactive-text="不通过" />
        <div>活动结项:</div>
        <span>允许结项</span>
        <el-switch v-model="allow" class="ml-2" style="margin-left:20px;margin-right:20px"
            :disabled="!currentItem.signOut" />
        <span>不允许结项</span>
        <el-switch v-model="notAllow" class="ml-2" style="margin-left:20px" :disabled="!currentItem.signOut" />
        <div>
            <el-collapse v-model="activeNames" @change="handleChange" v-if="currentItem.signOut">
                <el-collapse-item title="活动详细信息" name="1">
                    <el-card>
                        <el-row>
                            <el-col>
                                <span>报名人数: {{ currentItem.applyPerson.length }}</span>
                            </el-col>
                            <el-col>
                                <span>活动签到人数: {{ currentItem.signedPerson?.length }}</span>
                            </el-col>
                            <el-col>
                                <span>活动报名时间: {{ `开始时间:${currentItem.applyTime.start.split('T')[0]}-${new
                                        Date(currentItem.applyTime.start).getHours()}:${new
                                            Date(currentItem.applyTime.start).getMinutes()}`
                                }}
                                    <br>
                                    {{ `截止时间${currentItem.applyTime.end.split('T')[0]}-${new
                                            Date(currentItem.applyTime.end).getHours()}:${new
                                                Date(currentItem.applyTime.end).getMinutes()}`
                                    }}</span>
                            </el-col>
                            <el-col>
                                <span>活动进行时间: {{ `开始时间:${currentItem.actTime.start.split('T')[0]}-${new
                                        Date(currentItem.actTime.start).getHours()}:${new
                                            Date(currentItem.actTime.start).getMinutes()}`
                                }}
                                    <br>
                                    {{ `截止时间${currentItem.actTime.end.split('T')[0]}-${new
                                            Date(currentItem.actTime.end).getHours()}:${new
                                                Date(currentItem.actTime.end).getMinutes()}`
                                    }}</span>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div>
            <el-collapse v-model="activeNames" @change="handleChange" v-if="currentItem.signOut">
                <el-collapse-item title="结项材料" name="1">
                    <el-image v-for="url in currentItem.signOut" :src="url" fit="fill"></el-image>
                </el-collapse-item>
            </el-collapse>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="modify(currentItem._id, checkStatus)">确定</el-button>
                <el-button type="danger" @click="dialogVisible = false">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, inject, watch } from 'vue'
const tableData = ref([])
const tempData = ref([])
const $api = inject('$api')
const $fb = inject('$fb')
let dialogVisible = ref(false)
let checkStatus = ref(true)
let allow = ref(false)
let notAllow = ref(false)
let loading = ref(true)
let currentItem = ref({})
let showDialog = (item) => {
    currentItem.value = item
    dialogVisible.value = true
}
watch([allow, notAllow], (newVal, oldVal) => {
    if (currentItem.value.signOut) {
        if ((newVal[0] + newVal[1]) === 2) {
            allow.value ? notAllow.value = false : notAllow.value = true
        }
        if (newVal[0] === true) currentItem.value.isDone = true
        if (newVal[1] === true) currentItem.value.isDone = false
    }

})
$api.activity.list({ status: 'all' }).then(res => {
    tempData.value = res.data.reverse()
    tableData.value = res.data
    loading.value = false
    tableData.value.forEach((item, index, arr) => {
        switch (item.isPass) {
            case undefined:
                arr[index].tagType = 'info'
                break;
            case true:
                arr[index].tagType = 'success'
                break;
            case false:
                arr[index].tagType = 'danger'
                break;
        }
    })
})
const changeData = (status) => {
    switch (status) {
        case 'unCheck':
            tableData.value = tempData.value.filter(item => {
                return item.isPass === undefined
            })
            break;
        case 'pass':
            tableData.value = tempData.value.filter(item => {
                return item.isPass === true
            })
            break;
        case 'unPass':
            tableData.value = tempData.value.filter(item => {
                return item.isPass === false
            })
            break;
        case 'all':
            tableData.value = tempData.value
    }

}
// 确认修改
let modify = (aid, status) => {
    $fb.showLoading()
    check(aid, status)
    checkDone(aid, currentItem.value.isDone)
}
const check = (aid, status) => {
    $api.activity.check({ aid, pass: status }).then(res => {
        for (let index = 0; index < tableData.value.length; index++) {
            if (tableData.value[index]._id === aid) {
                tableData.value[index].isPass = status
                switch (status) {
                    case true:
                        tableData.value[index].tagType = 'success'
                        break;
                    case false:
                        tableData.value[index].tagType = 'danger'
                        break;
                }
                break;
            }
        }
        dialogVisible.value = false
        $fb.closeLoading()
        $fb.success()
    })
        .catch(err => {
            $fb.closeLoading()
            $fb.error()
        })
}
const checkDone = (aid, status) => {
    $api.activity.checkDone({ aid, status }).then(res => {
        for (let index = 0; index < tableData.value.length; index++) {
            if (tableData.value[index]._id === aid) {
                tableData.value[index].isDone = status
                break;
            }
        }
    })
}
</script>
<style lang = 'less' scoped>
.el-table {
    margin-top: 20px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>