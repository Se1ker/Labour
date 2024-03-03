<template>
    <div class="rightSide">
        <!-- <div class="sheetBox"> -->
            <div class="title" :style="{ 'marginBottom': '10px' }">打扫情况</div>
            <div>教室总数:370</div>
            <div>已打扫 : 200</div>
            <Clean />
        <!-- </div> -->

        <!-- <div class="sheetBox"> -->
            <div class="title" :style="{ 'marginBottom': '10px' }">检查情况</div>
            <div>已打扫:200</div>
            <div>已检查: 100</div>
            <Check />
        <!-- </div> -->

    </div>
</template>

<script setup>

import { ref, reactive } from 'vue'
import Clean from './Clean.vue'
import Check from './Check.vue'
</script>
<style lang = 'less' scoped>
.rightSide {
    height: 100%;
    width: 20%;
}

.title {
    text-align: center;
    font-size: 20px
}

.sheetBox {
    // height: 500px;
    margin-top: 10px;
}
</style>