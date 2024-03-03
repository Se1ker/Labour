const activityUtil = require('../../util/activityUtil')
const commentUtil = require('../../util/commentUtil');

exports.createActivity = async function (req, res, next) {
    let applyTime = { start: req.body.applyTime.start, end: req.body.applyTime.end }
    let actTime = { start: req.body.actTime.start, end: req.body.actTime.end }
    let aid = await activityUtil.create(req.body.title, req.body.content, req.body.score, req.user._id.toString(), req.body.capacity, applyTime, actTime, req.body.cover, req.body.location)
    res.status(200).json({
        msg: "创建活动成功",
        data: {
            aid
        }
    })
}


exports.activitySignIn = async function (req, res, next) {
    let uid = req.user._id.toString()
    let succeed = await activityUtil.signIn(req.body.aid, uid)
    let code = succeed ? 200 : 400
    let msg = succeed ? '活动签到成功' : '退出活动签到失败，活动不否存在或未曾加入或重复签到'
    res.status(code).json({
        msg
    })
}

exports.activitySignOut = async function (req, res, next) {
    let uid = req.user._id.toString()
    let succeed = await activityUtil.signOut(req.body.aid, uid)
    let code = succeed ? 200 : 400
    let msg = succeed ? '活动签退成功' : '退出活动签退失败，活动不否存在或未曾加入或未签到'
    res.status(code).json({
        msg
    })
}

exports.commentActivity = async (req, res, next) => {
    let uid = req.user._id.toString()
    let aid = req.body.aid
    let content = req.body.content
    let cmid = await commentUtil.comment(uid, content, null, aid, 'activity')
    res.status(200).json({ msg: '评论成功', data: cmid })
}

// 获取评论列表
exports.listComments = async (req, res, next) => {
    let aid = req.query.aid
    let comments = await commentUtil.list(aid)
    let data = await commentUtil.decorateComment(comments, "activity")
    res.status(200).json({ msg: '获取评论列表成功', data })
}

exports.replyComment = async (req, res, next) => {
    let owner = req.user._id
    let reply = req.body.reply
    let content = req.body.content
    let belong = req.body.belong
    let cmid = await commentUtil.reply(owner, reply, content, belong)
    res.status(200).json({ msg: cmid ? '回复评论成功' : '回复评论失败', data: cmid })
}

// 判断当前用户是否加入当前活动
exports.isJoin = async (req, res, next) => {
    let { aid } = req.body
    let uid = req.user._id.toString()
    let isJoin = await activityUtil.isJoin(aid, uid)
    let msg = isJoin ? '已加入当前活动' : '未加入当前活动'
    res.status(200).json({ msg, data: isJoin })
}

// 判断当前用户是否签到当前活动
exports.isSign = async (req, res, next) => {
    let { aid } = req.body
    let uid = req.user._id.toString()
    let isSign = await activityUtil.isSign(aid, uid)
    let msg = isJoin ? '已签到' : '未签到'
    res.status(200).json({ msg, data: isSign })
}
// 根据活动id返回活动详情
exports.getActivityById = async (req, res, next) => {
    let aid = req.query.aid
    let data = await activityUtil.decorateFavorites(req.user, await activityUtil.actDecorate(await activityUtil.getActivityById(aid)))
    res.status(200).json({ msg: '获取活动成功', data })
}
// 热门推荐活动 todo
exports.getHotActivity = async (req, res, next) => {
    let data = await activityUtil.getHotActivity(req.user)
    res.status(200).json({ msg: '获取热门推荐活动成功', data })
}
// 获取动态列表
exports.listDynamic = async (req, res, next) => {
    let data = await activityUtil.listDynamic(req.query.skip,req.query.limit)
    res.status(200).json({ msg: data ? '获取动态列表成功' : '获取失败', data })
}
// 提交结项申请
exports.commit = async (req, res, next) => {
    let data = await activityUtil.commit(req.body.aid,req.body.urls)
    res.status(200).json({msg: data ? '提交成功':'提交失败'})
}