<template>
    <div class="headBar">
        <div ref="overview" class="overview"></div>
        <Tendency/>
        <Distribute />
    </div>
</template>

<script setup>

import { ref, inject, reactive, onMounted } from 'vue'
import Tendency from './Tendency.vue';
import Distribute from './Distribute.vue'
const $echarts = inject('$echarts')

// 基于准备好的dom，初始化echarts实例
const overview = ref(null);

onMounted(() => { // 需要获取到element,所以是onMounted的Hook
    let overviewChart = $echarts.init(overview.value);
    // 绘制图表
    overviewChart.setOption({
        title: {
            text: '卫生情况总览',
            subtext: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },

        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: '优秀率' },
                    { value: 735, name: '不合格率' },
                    { value: 580, name: '合格率' },
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    });
    window.onresize = function () { // 自适应大小
        overviewChart.resize();
    };
});

</script>
<style lang = 'less' scoped>
.headBar {
    display: flex;
    justify-content:space-around;
    width: 100%;
    height: 30%;
    background-color: #fff;
    margin-bottom: 10px;
}

.overview {
    width: 20%;
    height: 100%
}
</style>