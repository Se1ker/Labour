const lostUtil = require('../../util/lostUtil')
const commentUtil = require('../../util/commentUtil')
exports.createLosts = async (req, res) => {
    let data = await lostUtil.create(req.user._id.toString(), req.body.title, req.body.content, req.body.images, req.body.keywords, req.body.type, req.body.contact)
    res.status(200).json({
        msg: data ? '创建成功' : '创建失败',
        data
    })
}
exports.searchByKey = async (req, res) => {
    let data = await lostUtil.searchByKey(req.query.key)
    res.status(200).json({
        msg: 1,
        data
    })
}
exports.doneLosts = async (req, res) => {
    let data = await lostUtil.done(req.body.lid.toString())
    res.status(200).json({ msg: data ? '关闭成功' : '关闭失败或者已关闭', data })
}

exports.commentLosts = async (req, res) => {
    let uid = req.user._id.toString()
    let lid = req.body.lid
    let content = req.body.content
    let cmid = await commentUtil.comment(uid, content, null, lid, 'losts')
    res.status(200).json({ msg: '评论成功', data: cmid })
}
exports.replyComment = async (req, res, next) => {
    let owner = req.user._id
    let reply = req.body.reply
    let content = req.body.content
    let belong = req.body.belong
    let cmid = await commentUtil.reply(owner, reply, content, belong)
    res.status(200).json({ msg: cmid ? '回复评论成功' : '回复评论失败', data: cmid })
}
exports.listComments = async (req, res, next) => {
    let lid = req.query.lid
    let comments = await commentUtil.list(lid)
    let data = await commentUtil.decorateComment(comments, "losts")
    res.status(200).json({ msg: '获取评论列表成功', data })
}
exports.listLosts = async (req, res, next) => {
    let data = await lostUtil.list()
    res.status(200).json({ msg: data ? '获取列表成功' : '获取失败', data })
}