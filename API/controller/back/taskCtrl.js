const tasksUtil = require('../../util/tasksUtil')
exports.getTaskList = async (req, res) => {
    let data = await tasksUtil.getTaskList()
    res.status(200).json({ msg: data ? '获取成功' : '获取失败', data })
}
exports.getCleanConfig = async (req, res) => {
    let data = await tasksUtil.getCleanConfig()
    res.status(200).json({ msg: data ? '获取成功' : '获取失败', data })
}
exports.setCleanConfig = async (req, res) => {
    let data = await tasksUtil.setCleanConfig(req.body.cleanCount,req.body.startTime)
    res.status(200).json({ msg: data ? '设置成功' : '设置失败', data })
}
exports.distribute = async (req, res) => {
    let data = await tasksUtil.distribute(req.body.urls,req.body.cleanCount)
    res.status(200).json({ msg: data ? '操作成功':'操作失败',data})
}