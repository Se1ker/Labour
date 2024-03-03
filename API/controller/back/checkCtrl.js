const checkUtil = require('../../util/checkUtil')
exports.getConditions = async (req,res) => {
    let data =  await checkUtil.conditionList()
    res.status(200).json({msg:data ? '获取成功':'获取失败',data})
}
// 返回已经选择的检查任务
exports.listChosen = async (req, res) => {
    let data = await checkUtil.listChosen()
    res.status(200).json({msg:data ? '获取成功' : '获取失败', data })
}
exports.modifyCheckCount = async (req, res) => {
    let data = await checkUtil.modifyCheckCount(req.body.checkCount)
    res.status(200).json({msg:data ? '修改成功' : '修改失败', data })
}
exports.getCheckCount = async (req, res) => {
    let data = await checkUtil.getCheckCount()
    res.status(200).json({msg:data ? '获取成功' : '获取失败', data })
}