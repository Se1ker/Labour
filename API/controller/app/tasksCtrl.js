const tasksUtil = require('../../util/tasksUtil')
// 打扫推荐(一个班负责一个教室)
exports.cleanRecommend = async (req, res) => {
    let belong = req.user.belong
    let classes = req.user.class
    let data = await tasksUtil.getCleanRoom(belong, classes)
    res.status(200).json({ msg: data ? '获取成功' : "获取失败", data })
}
// 班级成员自选
exports.choose = async (req, res) => {
    let data = await tasksUtil.choose(req.user.class.toString(), req.user._id.toString(), req.body.weekDay)
    res.status(200).json({ msg: data ? '选取成功' : '选取成功', data })
}
exports.chooseList = async (req, res) => {
    let data = await tasksUtil.chooseList(req.user.class)
    res.status(200).json({ msg: data ? '获取成功' : '获取失败', data })
}
exports.distribute = async (req, res) => {
    let data = await tasksUtil.distribute()
    res.status(200).json({ msg: data ? '获取成功' : '获取失败', data })
}
exports.getTask = async (req, res) => {
    let data = await tasksUtil.getTask(req.user._id)
    res.status(200).json({ msg: data ? '获取成功' : '获取失败', data })
}
exports.isSign = async (req, res) => {
    let data = await tasksUtil.isSign(req.user.class)
    res.status(200).json({ msg: data ? '已签到' :'未签到',data })
}
exports.taskSign = async (req, res) => {
    let data = await tasksUtil.taskSign(req.user)
    res.status(200).json({ msg: data ? '签到成功' : '签到失败,非本周任务或重复签到', data })
}