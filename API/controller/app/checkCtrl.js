const checkUtil = require('../../util/checkUtil')
// 报名
exports.apply = async (req, res) => {
    let data = await checkUtil.apply(req.user._id.toString())
    res.status(200).json({ msg: data ? '报名成功' : '报名失败', data })
}
// 选择楼栋，随机匹配教室
exports.getCheckRoom = async (req, res) => {
    let data = await checkUtil.getCheckRoom(req.body.bid, req.body.weekDay)
    res.status(200).json({ msg: data ? '获取成功' : '获取失败', data })
}
// 自选周几，生成检查任务
exports.createCheck = async (req, res) => {
    let data = await checkUtil.createCheck(req.user._id.toString(), req.body.weekDay, req.body.bid)
    res.status(200).json({ msg: data ? '生成成功' : '人数已满', data })
}
// 返回检查任务列表
exports.getCheckList = async (req, res) => {
    let data = await checkUtil.getCheckList()
    res.status(200).json({ msg: data ? '生成成功' : '人数已满', data })
}
// 根据uid获取检查任务
exports.getCheckById = async (req, res) => {
    let data = await checkUtil.getCheckById(req.user._id.toString())
    res.status(200).json({ msg: data ? '获取成功' : '获取失败', data })
}
// 发布检查情况
exports.checkCondition = async (req, res) => {
    let { status, desc, images, coords, area } = req.body
    let uid = req.user._id
    let classes = req.user.class
    let data = await checkUtil.checkCondition(uid, status, desc, images, coords,classes, area)
    res.status(200).json({
        msg: data ? '发布成功' : '发布失败',
        data
    })
}
exports.setCheck = async (req, res) => {
    let data = await checkUtil.setCheck()
    res.status(200).json({ data })
}