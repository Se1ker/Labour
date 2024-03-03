<template>
    <div ref="clean" class="clean"></div>
    <div :style="{'text-align':'center','font-size':'20px'}">打扫率 : {{Math.floor((100 / 200) * 100)  + '%'}}</div>
</template>

<script setup>

import { ref, inject, onMounted } from 'vue'
const $echarts = inject('$echarts')
const clean = ref(null)
onMounted(() => {
    var myChart = $echarts.init(clean.value)
    var option;

    option = {
        tooltip: {
            trigger: 'item'
        },

        series: [
            {
                name: '检查情况',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '10',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 200, name: '已打扫数' },
                    { value: 100, name: '已检查' }
                ]
            }
        ]
    };

    option && myChart.setOption(option);

})
</script>
<style lang = 'less' scoped>
.clean {
    width: 100%;
    height: 200px;
}
</style>