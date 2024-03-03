const activityUtil = require('../../util/activityUtil')
exports.checkActivity = async function (req, res, next) {
    let aid = req.body.aid
    let pass = req.body.pass
    let data = await activityUtil.check(aid, pass)
    res.status(200).json({
        msg: data ? '操作成功' : '操作不成功'
    })
}
exports.checkDone = async function (req, res, next) {
    let data = await activityUtil.checkDone(req.body.aid,req.body.status)
    res.status(200).json({ msg: data ? '操作成功' : '操作失败' })
}