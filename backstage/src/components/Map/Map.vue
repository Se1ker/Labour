<template>
    <HeadBar />
    <div class="main">
        <LeftSide />
        <div class="map-page-container">
            <el-amap :center="center" :zoom="zoom" :pitch="40" view-mode="3D" :showIndoorMap="true" @init="init">
                <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position"
                    @click="(e) => { clickArrayMarker(marker, e) }" />
            </el-amap>
        </div>
        <RightSide />
    </div>

</template>

<script setup>
import { ref,reactive } from "vue";
import HeadBar from "./HeadBar.vue"
import LeftSide from "./LeftSide.vue"
import RightSide from "./RightSide.vue"
const zoom = ref(16.97);
const center = ref([115.030702, 27.110210]);
let map = null;
let markers = reactive([
    {
        position: [115.034835, 27.116019],
        id: 1
    },
    {
        position: [115.034835, 27.113239],
        id: 2
    },
    {
        position: [115.034835, 27.112239],
        id: 2
    }
])
const init = (e) => {
    const marker = new AMap.Marker({
        position: [115.034835, 27.116019]
    });
    e.add(marker);
    map = e;
    console.log('map init: ', map)
    // let add = () => {
    //     const marker = new AMap.Marker({
    //         position: [115.034835, 27.113239]
    //     });
    //     e.add(marker);
    // }
    // add()
}

</script>

<style>
.main {
    height: 100%;
    display: flex;
}

.map-page-container {
    height: 90%;
    width: 60%;
    margin-left: 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
}

</style>
