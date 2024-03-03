<template>
    <el-row :gutter="32">
        <el-col :span="9" :offset="2">
            <div style="font-size:1.2em;width:500px;color: azure; text-align:left">
                &nbsp
                &nbsp根据国务院关于全面加强新时代大中小学劳动教育的意见，为构建德智体美劳全面培养的教育体系，各大高校积极展开劳动教育活动，设置劳动教育课程，纳入人才培养方案，形成具有综合性、实践性、开放性、针对性的劳动教育课程体系。
                <br />
                &nbsp
                &nbsp为响应国家和学校号召，积极结合学科、专业特点，将软件开发技术有机融入劳动教育的管理中以智能和高效地管理劳动教育实践的实施。我们团队面向学校开展的劳动教育实践项目，针对其管理不便，展现缺失，实践成果验收不便等问题，结合相应软件开发技术开发出一款符合我校实际情况的劳动教育实践数字化管理与展示系统。
            </div>
        </el-col>
        <el-col :span="3">
            <el-image src="/static/index.jpg" fill="fit" style="width:260px;height:520px"></el-image>
        </el-col>
        <el-col :span="8">
            <div class="btns">
                <el-link href="http://175.27.247.87:8081/__UNI__950B984__20220528172353.apk"
                    target="_blank"  style="margin-right: 20px;">
                    <el-button style="width:150px;height:60px" type="primary">
                        <el-image src="/static/android.png" style="width:50px;height:50px"></el-image>
                        Android 下载
                    </el-button>
                </el-link>
                <el-button style="width:150px;height:60px" type="primary">
                    <el-image src="/static/ios.png" style="width:40px;height:40px"></el-image>
                    敬请期待
                </el-button>
            </div>
        </el-col>
    </el-row>
</template>

<script >

import { defineComponent } from 'vue'
export default defineComponent({
})
</script>
<style lang = 'less' scoped>
.el-card {
    width: 1000px;
    height: 540px;
    opacity: 0.8;
}

.btns {
    margin-top: 400px;
}

.introPic {
    opacity: 0.5;
}
</style>