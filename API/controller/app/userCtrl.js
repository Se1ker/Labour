// const inspirecloud = require('@byteinspire/api');
// 发送邮件插件
const securityCode = require('../../util/securityCodeUtil')
// 登录模块插件
const userUtil = require('../../util/userUtil')
// 活动模块插件
const activityUtil = require('../../util/activityUtil')
// 评论工具
const commentUtil = require('../../util/commentUtil');



// 发送验证码
exports.sendSecCode = async (req, res, next) => {
    await securityCode.send(req.body.toEmail)
    res.status(200).json({
        msg: "发送成功"
    })
}

// 注册
exports.register = async (req, res, next) => {
    let { toEmail, password, stuId } = req.body
    let sid = await userUtil.create(toEmail, password, stuId)
    res.status(200).json({
        msg: "注册用户成功",
        data: {
            sid
        }
    })
}

// 登录
exports.login = async (req, res, next) => {
    let { account, password } = req.body
    let uid = await userUtil.check(account, password)
    if (!uid) {
        return res.status(401).json({
            msg: "账号或密码错误"
        })
    }
    let token = await userUtil.setToken(uid)
    res.status(200).json({
        msg: "登录成功",
        data: { token }
    })
}
// 修改密码
exports.modifyPass = async (req, res, next) => {
    let newPass = req.body.newPass
    let uid = req.user._id.toString()
    let user = await userUtil.modifyPass(newPass, uid)
    res.status(200).json({
        msg: user ? '修改成功' : '修改失败',
        data: user
    })
}
exports.modifyUserInfo = async (req, res, next) => {
    let { nickname, academyId } = req.body
    let user = await userUtil.modifyUserInfo(req.user._id.toString(), nickname, academyId, req, req.body.classId)
    res.status(user ? 200 : 400).json({
        msg: user ? '修改成功' : '修改失败',
        data: user
    })
}
// 返回用户个人信息
exports.getUserInfo = async (req, res, next) => {
    let user = await userUtil.getUserInfo(req.user._id.toString())
    res.status(200).json({
        msg: "获取用户个人信息成功",
        data: user
    })
}

exports.joinActivity = async (req, res, next) => {
    let uid = req.user._id.toString()
    let succeed = await activityUtil.join(req.body.aid, uid)
    let code = succeed ? 200 : 400
    let msg = succeed ? '加入活动成功' : '加入活动失败，活动不存在,未通过审核或重复加入'
    res.status(code).json({
        msg
    })
}

exports.quitActivity = async (req, res, next) => {
    let uid = req.user._id.toString()
    let succeed = await activityUtil.quit(req.body.aid, uid)
    let code = succeed ? 200 : 400
    let msg = succeed ? '退出活动成功' : '退出活动失败，活动不否存在或未曾加入'
    res.status(code).json({
        msg
    })
}

// 根据用户id返回参加的活动信息
exports.listJoinActivity = async (req, res, next) => {
    let aidList = (await userUtil.getUserInfo(req.user._id.toString())).actId 
    aidList ? aidList : []
    let data
    let actList = []
    if (aidList.length !== 0) {
        for (let aid of aidList) {
            actList.push(await activityUtil.getActivityById(aid))
        }
       data = await activityUtil.actDecorate(actList)
    }
    res.status(200).json({
        msg: "获取当前用户活动列表成功",
        data
    })
}

// 积分排行
exports.scoreSort = async (req, res, next) => {
    let data = await userUtil.scoreSort()
    res.status(200).json({
        msg: "获取积分排序列表成功",
        data
    })
}

exports.likeComment = async (req, res, next) => {
    let isLike = await commentUtil.like(req.body.cmid, req.user._id.toString())
    res.status(201).json({ msg: isLike ? '点赞成功' : '已取消点赞', data: isLike })
}

exports.addFavorites = async (req, res, next) => {
    let isAdd = await userUtil.addFavorites(req.user, req.body.aid)
    res.status(201).json({ msg: isAdd ? '收藏成功' : '已取消收藏', data: isAdd })
}
exports.listClass = async (req, res) => {
    let data = await userUtil.listClass(req.body.academyId)
    res.status(200).json({ msg: data ? '获取成功' : '获取失败', data })
}