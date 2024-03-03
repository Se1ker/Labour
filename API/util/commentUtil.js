const { Comments, Users } = require('../model')
// string转ObjectId
const beObjectId = require('mongoose').Types.ObjectId
/**
 * 创建评论
 * @param {objectid} owner 发送者id
 * @param {string} content 评论内容·
 * @param {string} reply 回复的人
 * @param {objectid} belong 评论所属事件id
 * @param {string} type 事件类型
 * @returns 评论id
 */
async function create(owner, content, reply, belong, type) {
    return (await Comments.create({ owner, content, reply, belong, type }))._id
}

/**
 * 获取评论列表
 * @param {string} belong 所属事件id
 * @param {string} uid 请求者用户id
 * @returns 评论列表
 */
async function list(belong, uid) {
    let comments = JSON.parse(JSON.stringify(await Comments.where({ belong }).find())) ;
    for (let comment of comments) {
        comment.likeCount = countLikes(comment)
        comment.liked = (comment.like || []).indexOf(uid) != -1 // 未验证登陆情况，该功能暂时不可用
        delete comment.like
    }
    return comments
}

/**
 * 回复评论
 * @param {objectid} owner 发送者id
 * @param {objectid} reply 被回复的人id
 * @param {string} content 回复内容
 * @returns 评论id
 */
async function reply(owner, reply, content, belong) {
    if ((await Comments.where({ _id: beObjectId(reply) }).findOne()).belong !== belong) return false;
    return create(owner, content, reply, belong, null)
}

async function get(cmid) {
    return await Comments.findOne({ _id: beObjectId(cmid) },{},{lean: true})
}

async function like(cmid, uid) {
    let comment = await get(cmid)
    let likes = comment.like || []
    let index = likes.indexOf(uid)
    if (index == -1) {
        likes.push(uid)
    }
    else {
        likes.splice(index, 1)
    }
    comment.like = likes
    let _id = comment._id
    await Comments.updateOne({_id},comment)
    return index == -1
}

function countLikes(comment) {
    let likes = comment.like || []
    return likes.length
}

async function decorateComment(commentList, type) {
    let comTreeList = []
    let rootCommentList = findRootId(commentList, type)
    for (let rootComment of rootCommentList) {
        comTreeList.push(await buildComTree(rootComment, commentList))
    }
    return comTreeList
}
//装饰个人信息
async function decorate(comment) {
    let comments = JSON.parse(JSON.stringify(comment))
    let user = await Users.where({ _id: comments.owner }).findOne()
    comments.avatar = user.avatar
    comments.nickname = user.nickname
    return comments
}
// 找到评论根节点
function findRootId(commentList, type) {
    let rootCommentList = []
    for (let comment of commentList) {
        if (comment.type === type) rootCommentList.push(comment)
    }
    return rootCommentList
}
// 根据根节点建立树
async function buildComTree(rootComment, commentList, comTree = {}, child = []) {
    rootComment = JSON.parse(JSON.stringify(await decorate(rootComment)))
    comTree.comment = rootComment
    comTree.child = []
    if (rootComment.reply !== null) child.push(comTree)
    for (let comment of commentList) {
        if (comment?.reply?.toString() === (rootComment._id.toString())) {
            await buildComTree(comment, commentList, undefined, comTree.child)
        }
    }
    return comTree;
}
exports.comment = create
exports.list = list
exports.reply = reply
exports.like = like
exports.decorateComment = decorateComment