<template>
  <el-breadcrumb :separator-icon="ArrowRight">
  <el-breadcrumb-item>卫生区域管理</el-breadcrumb-item>
    <el-breadcrumb-item>卫生区域信息</el-breadcrumb-item>
  </el-breadcrumb>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="教室" name="first">
      <Room
        v-if="flag"
        v-model:areaList="areaList"
        @update:model-value="updateAreaList"
        :reload="reload"
      />
    </el-tab-pane>
    <!-- <el-tab-pane label="包干区" name="second">包干区</el-tab-pane> -->
  </el-tabs>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'

import { inject, ref, nextTick } from 'vue'
// 组件
import Room from './Room.vue'
const $api = inject('$api')
const activeName = ref('first')
let areaList = ref([])
let flag = ref(false)
const getAreaList = () => {
  $api.area.getAreaList().then((res) => {
    console.log(res.data)
    areaList.value = res.data
    flag.value = true
  })

}
// 局部刷新数据
const reload = () => {
  flag.value = false
  nextTick(() => {
    flag.value = true
  })
}
const updateAreaList = (buildItem, operation) => {
  if (operation === 'add') {
    areaList.value.push({ building: buildItem.name, bid: buildItem._id, roomList: [] })
  } else if (operation === 'remove') {
    areaList.value = areaList.value.filter(item => {
      return item.bid !== buildItem
    })
  }
  reload()
}
getAreaList()
const handleClick = (tab, event) => {
  console.log(tab, event)
}
</script>
<style lang = 'less' scoped>
</style>