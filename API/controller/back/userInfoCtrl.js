const userUtil = require('../../util/userUtil')
exports.getAllUser = async (req, res) => {
    let data = await userUtil.getAllUser(parseInt(req.query.skip), parseInt(req.query.limit))
    res.status(200).json({ msg: data ? '获取成功' : '获取失败', data })
}
exports.getAllChecker = async (req, res) => {
    let data = await userUtil.getAllChecker()
    res.status(200).json({ msg: data ? '获取成功' : '获取失败', data })
}
exports.modifyUserInfo = async (req, res) => {
    let data = await userUtil.backModifyUserInfo(req.body)
    res.status(200).json({ msg: data ? '操作成功' : '操作失败', data })
}
exports.listAllClass = async (req, res) => {
    let data = await userUtil.listAllClass()
    res.status(200).json({ msg: data ? '获取成功' : '获取失败', data })
}
exports.deleteUser = async (req, res) => {
    let data = await userUtil.deleteUser(req.body.userId)
    res.status(200).json({ msg: data ? '操作成功' : '操作失败', data })
}
