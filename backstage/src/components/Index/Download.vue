<template>

    <el-card shadow="hover">

        <el-row justify="space-around">
            <el-col :span="8">
                <el-image src="/static/index.png" fill="fit" style="width:300px;height:620px"></el-image>
            </el-col>
            <el-col :span="10">
                <div class="btns">

                    <el-button style="width:200px;height:70px" type="primary">
                        <el-image src="/static/android.png" style="width:50px;height:50px"></el-image>

                    </el-button>
                    <el-button style="width:200px;height:70px" type="primary">
                        <el-image src="/static/ios.png" style="width:50px;height:50px"></el-image>
                        IOS 下载
                    </el-button>
                </div>

            </el-col>
        </el-row>
    </el-card>
</template>

<script>

import { defineComponent } from 'vue'
export default defineComponent({
})
</script>
<style lang = 'less' scoped>
.el-card {
    height: 700px;
    width: 80%;
    margin-bottom: 20px;
    opacity: 0.7;
}

.btns {
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-around
}

.el-button+.el-button {
    margin-left: 0px;
}
</style>