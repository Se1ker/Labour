<template>
    <div class="selectBox">
        <el-select v-model="bid" placeholder="请选择楼栋" @change="handleSelect(bid)">
            <el-option
                v-for="item in areaLists"
                :key="item.bid"
                :label="item.building"
                :value="item.bid"
            ></el-option>
        </el-select>
        <el-button type="primary" @click="updateVisible(true)">添加楼栋</el-button>
        <el-button type="danger" @click="removeBuildingEvent" :disabled="addRoomDis">删除楼栋</el-button>
        <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
        />
        <el-button
            :disabled="addRoomDis"
            v-else
            type="warning"
            class="button-new-tag ml-1"
            @click="showInput"
        >添加教室</el-button>
    </div>
    <div class="tagBox">
        <el-popconfirm title="确定删除此教室?" v-for="tag in roomList" @confirm="handleClose(tag)">
            <template #reference>
                <el-tag :key="tag" :disable-transitions="false">{{ tag.name }}</el-tag>
            </template>
        </el-popconfirm>
    </div>
    <AddBuildingDialog
        v-model="addBuildingVisible"
        :buidlingName="buidlingName"
        @update:model-value="updateVisible"
        :addBuilding="addBuilding"
    />
    <removeBuildingDialog
        :buildingName="buildingName"
        ref="removeBuildingRef"
        :removeBuilding="removeBuilding"
    />
</template>

<script setup>
import removeBuildingDialog from './Dialog/RemoveBuilding.vue'
import AddBuildingDialog from './Dialog/AddBuilding.vue'
import { ref, nextTick, inject, computed } from 'vue'
const $api = inject('$api')
const $fb = inject('$fb')
const addRoomDis = ref(true)
const buidlingName = ref('')
const addBuildingVisible = ref(false)
const bid = ref('')
const buildingName = ref('')
const roomList = ref([])
const inputVisible = ref(false)
const inputValue = ref('')
const removeBuildingRef = ref(null)
const InputRef = ref(null)
const props = defineProps({
    areaList: {
        type: Array
    },
    reload: {
        type: Function
    }
})
const removeBuildingEvent = () => {
    removeBuildingRef.value.open()
}
const removeBuilding = () => {
    let removeBid = bid.value
    $api.area.removeBuilding({ removeBid }).then(res => {
        emit('update:modelValue', removeBid, 'remove')
        $fb.closeLoading()
        $fb.success()
    }).catch(err => {
        $fb.closeLoading()
        $fb.error()
    })
}
const emit = defineEmits(['update:modelValue'])
const areaLists = computed({
    get: () => {
        return props.areaList
    },
    set: (buildItem) => {
        console.log(123)
    }
})
const addBuilding = (buildingName) => {
    $fb.showLoading({ text: "正在添加" })
    $api.area.addBuilding({ buildingName }).then(res => {
        emit('update:modelValue', res.data, 'add')
        updateVisible(false)
        $fb.closeLoading()
        $fb.success()
    }).catch(err => {
        $fb.closeLoading()
        $fb.error()
    })
}
const updateVisible = (val) => {
    addBuildingVisible.value = val
}
const handleClose = (tag) => {
    // 这个tag是一个指针
    let rid = tag._id
    $api.area.removeRoom({ rid }).then(res => {
        $fb.success()
    }).catch(err => {
        $fb.error()
    })
    roomList.value.splice(roomList.value.indexOf(tag), 1)
}
const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}
const handleInputConfirm = () => {
    if (inputValue.value) {
        $api.area.addRoom({bid:bid.value,roomName:inputValue.value}).then(res => {
            console.log(res.data)
            roomList.value.push(res.data)
            $fb.success()
        })
    }
    inputVisible.value = false
    inputValue.value = ''
}
let areaMap = new Map()
areaLists.value.forEach(item => {
    areaMap.set(item.bid, [item.building, item.roomlist])
})
let handleSelect = (bid) => {
    addRoomDis.value = false
    roomList.value = (areaMap.get(bid))[1]
    buildingName.value = (areaMap.get(bid))[0]
}
</script>
<style lang = 'less' scoped>
.selectBox {
    width: 550px;
    display: flex;
    justify-content: space-around;
}
.el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
}
.tagBox {
    margin-top: 20px;
}
.el-input {
    width: 100px;
}
</style>