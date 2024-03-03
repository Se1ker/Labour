<template>
    <div ref="tendency" class="tendency"></div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
const tendency = ref(null)
const $echarts = inject('$echarts')
onMounted(() => {
    var myChart = $echarts.init(tendency.value);
    var option;
    option = {
        title: {
            text: '趋势图'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['优秀率', '不合格率', '合格率']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '优秀率',
                type: 'line',
                stack: 'Total',
                data: [140, 132, 101, 134, 90, 230, 190]
            },
            {
                name: '不合格率',
                type: 'line',
                stack: 'Total',
                data: [220, 182, 191, 234, 290, 330, 100]
            },
            {
                name: '合格率',
                type: 'line',
                stack: 'Total',
                data: [250, 232, 201, 154, 190, 330, 210]
            },
        ]
    };

    option && myChart.setOption(option);

})

</script>
<style lang = 'less' scoped>
.tendency {
    width: 30%;
    height: 100%
}
</style>