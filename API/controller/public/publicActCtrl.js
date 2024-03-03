const activityUtil = require('../../util/activityUtil')
exports.listActivity = async (req, res, next) => {
    let listActivity = await activityUtil.list(req.query.status)
    listActivity = await activityUtil.actDecorate(listActivity)
    listActivity = await activityUtil.decorateFavorites(req.user, listActivity)
    let t = req.query.status === undefined ? '已通过审核' : req.query.status
    let msg = t + '列表查询成功'
    res.status(200).json({
        msg,
        data: listActivity
    })
}
