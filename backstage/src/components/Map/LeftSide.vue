<template>
    <div class="leftSide">
        实时检查数据
        <ul  class="infinite-list" style="overflow: auto">
            <el-tag :type=item.type v-for="item in conditions" :key="item._id" class="infinite-list-item ml-2">
                {{ item.area.name }}
                {{ item.status }}
                {{item.createdAt.split('T')[0]}}
            </el-tag>
        </ul>
    </div>
</template>

<script setup>

import { ref, reactive, inject } from 'vue'
const $api = inject('$api')
let conditions = ref([])
$api.conditions.getConditions().then((res) => {
    conditions.value = res.data
    conditions.value.forEach((item, index, arr) => {
        switch (item.status) {
            case '不合格':
                arr[index].type = 'danger'
                break;
            case '合格':
                arr[index].type = 'success'
                break;
            case '优秀':
                arr[index].type = ''
                break;
            case '预警':
                arr[index].type = 'warning'
                break;
        }
    })
})
</script>
<style lang = 'less' scoped>
.leftSide {
    font-size:20px;
    text-align: center;
    height: 100%;
    background-color: #fff;
    width: 20%;
}

.infinite-list {
    height: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
}

.infinite-list .infinite-list-item {
    height: 60px;
    width: 100%;
    margin: 10px;
    color: black;
}

.infinite-list .infinite-list-item+.list-item {
    margin-top: 10px;
}
</style>