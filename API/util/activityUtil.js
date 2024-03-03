const { Activities, Users, Comments, Losts } = require('../model/index')
const userUtil = require('../util/userUtil')
const lostUtil = require('../util/lostUtil')
const { redis } = require('../model')
// string转ObjectId
const beObjectId = require('mongoose').Types.ObjectId
async function getActivityById(aid) {
    return await Activities.findOne({ _id: beObjectId(aid) },{},{lean:true})
}

function arrayIsEmpty(array) {
    return array == undefined || array.length == 0
}

function isPass(activity) {
    return activity.isPass || false
}
/**
 * 将用户id装饰成对应的用户信息
 * @param {Array|Object} activity 活动（列表）
 * @returns 添加了用户信息活动（列表）
 */
async function actDecorate(activities) {
    let flag = activities instanceof Array
    activities = flag ? activities : [activities]
    let ownerList = []
    for (let activity of activities) {
        let owner = await userUtil.getUserInfo(activity.owner)
        ownerList.push(owner)
    }
    for (let activity of activities) {
        for await (let owner of ownerList) {
            let ownerName = owner.nickname
            let ownerEmail = owner.email
            let avatar = owner.avatar
            activity.ownerName = ownerName
            activity.ownerEmail = ownerEmail
            activity.avatar = avatar
            applyPersons = []
        }
        for (let personId of (activity.applyPerson || [])) {
            let person = await userUtil.getUserInfo(personId)
            applyPersons.push({ uid: person._id, nickname: person.nickname, avatar: person.avatar })
        }
        activity.applyPerson = applyPersons
    }
    return flag ? activities : activities[0]
}
/**
 * 创建一个活动
 * @param {string} title 活动标题
 * @param {string} content 活动内容描述
 * @param {number} score 活动分数
 * @param {string} owner 创建者id
 * @param {number} capacity 活动容量
 * @param {object} applyTime 可加入时间
 * @param {object} actTime 行动时间
 * @param {string} cover 封面图片url
 * @returns 创建的活动的id
 */
async function create(title, content, score, owner, capacity, applyTime, actTime, cover, location) {
    let user = await Users.findOne({ _id: beObjectId(owner) },{},{lean:true})
    let userAct = user.actId || []
    let aid = (await Activities.create({ title, content, score, applyPerson: [owner], owner, capacity, applyTime, actTime, cover, location }))._id
    userAct.push(aid)
    await Users.updateOne({_id:user._id},{actId:userAct})
    return aid
}

/**
 * 获取活动列表
 * @param {string} status 活动状态
 * @returns 活动列表
 */
async function list(status) {
    let isPass
    switch (status) {
        case 'all':
            return await Activities.find({},{},{lean:true})
        case 'unPass':
            isPass = false
            break;
        case 'unCheck':
            isPass = null
            break;
        default: isPass = true
    }
    return await Activities.find({ isPass },{},{lean:true})
}

/**
 * 参加活动
 * @param {string} aid 活动id
 * @param {string} uid 参加者id
 * @returns 是否参加成功
 */
async function join(aid, uid) {
    let activity = await getActivityById(aid)
    let user = await Users.where({ _id: beObjectId(uid) }).findOne()
    let userAct = user.actId || []
    // 检查活动是否存在
    if (activity == null) {
        return false
    }
    // 未通过审核
    if (!isPass(activity)) {
        return false;
    }
    let members = activity.applyPerson || []
    // 重复加入返回false
    if (members.indexOf(uid) != -1) {
        return false
    }
    userAct.push(aid)
    // user.actId = userAct
    await Users.updateOne({_id:user._id},{actId:userAct})
    members.push(uid);
    // activity.applyPerson = members
    await Activities.updateOne({_id:activity._id},{applyPerson:members})
    return true
}

/**
 * 退出活动
 * @param {string} aid 活动id
 * @param {string} uid 参加者id
 * @returns 是否退出成功
 */
async function quit(aid, uid) {
    let activity = await getActivityById(aid)
    let user = await Users.where({ _id: beObjectId(uid) }).findOne()
    let userAct = user.actId || []
    // 检查活动是否存在、是否有人加入过
    if (activity === null || arrayIsEmpty(activity.applyPerson)) {
        return false
    }
    let members = activity.applyPerson
    // 未加入返回false
    let index = members.indexOf(uid)
    let i = userAct.indexOf(aid)
    if (index == -1) {
        return false
    }
    userAct.splice(i, 1)
    // user.actId = userAct
    await Users.updateOne({_id:user._id},{actId:userAct})
    members.splice(index, 1)
    // activity.applyPerson = members
    await Activities.updateOne({_id:activity._id},{applyPerson:members})
    return true
}

/**
 * 活动签到
 * @param {string} aid 活动id
 * @param {string} uid 用户id
 * @returns 是否签到成功
 */
async function signIn(aid, uid) {
    let activity = await getActivityById(aid)
    // 检查活动是否存在、是否有人加入过、该用户是否加入
    if (activity === null || arrayIsEmpty(activity.applyPerson) || activity.applyPerson.indexOf(uid) == -1) {
        return false
    }
    let signed = activity.signedPerson || []
    // 是否已经签到
    if (signed.indexOf(uid) != -1) {
        return false
    }
    signed.push(uid)
    Activities.updateOne({_id:activity._id},{signedPerson:signed})
    return true
}

/**
 * 签退
 * @param {string} aid 活动id
 * @param {string} uid 用户id
 * @returns 是否签退成功
 */
async function signOut(aid, uid) {
    let activity = await getActivityById(aid)
    // 检查活动是否存在、是否有人加入过、该用户是否加入、是否签到过
    if (activity === null || arrayIsEmpty(activity.applyPerson) || activity.applyPerson.indexOf(uid) == -1 || arrayIsEmpty(activity.signedPerson) || activity.signedPerson.indexOf(uid) == -1) {
        return false
    }
    let signOut = activity.signOut || []
    // 是否已经签退
    if (signOut.indexOf(uid) != -1) {
        return false
    }
    signOut.push(uid)
    activity.signOut = signOut
    await Activities.updateOne({_id:activity._id},{signOut})
    return true
}

/**
 * 审核活动
 * @param {string} aid 活动id
 * @param {boolean} pass 审核是否通过
 */
async function check(aid, pass) {
    let activity = await getActivityById(aid)
    await Activities.updateOne({_id:activity._id},{isPass:pass})
}

/**
 * 是否已加入当前活动
 * @param {string} aid 活动_id
 * @param {string} uid 用户_id
 * @returns 是否已加入
 */
async function isJoin(aid, uid) {
    let activity = await getActivityById(aid)
    return activity.applyPerson.indexOf(uid) != -1
}

/**
 * 是否已加入当前活动
 * @param {string} aid 活动_id
 * @param {string} uid 用户_id
 * @returns 是否已签到
 */
async function isSign(aid, uid) {
    let activity = await getActivityById(aid)
    return activity.signedPerson.indexOf(uid) != -1
}
/**
*@returns 热门活动10条
*/
async function getHotActivity(user) {
    let list = await decorateFavorites(user, await Activities.find({ isPass: true, isDone: false || undefined },{},{lean: true}))
    for (let activity of list) {
        activity.commentCount = await Comments.find({ belong: activity._id }).count()
    }
    list.sort((a, b) => { return (b.favoritesCount * 0.7 + b.commentCount * 0.3) - (a.favoritesCount * 0.7 + a.commentCount * 0.3) })
    return await actDecorate(list.slice(0, 10))
}

async function favoritesCount(aid) {
    return await Users.where({ favorites: { $all: aid } }).count();
}

async function decorateFavorites(user, activities) {
    let flag = activities instanceof Array
    activities = flag ? activities : [activities]
    let countList = []
    for (let activity of activities) {
        countList.push(favoritesCount(activity._id.toString()))
    }
    for (let activity of activities) {
        for await (let count of countList) {
            activity.favoritesCount = count
            // 用户是否收藏
            activity.favorite = (user.favorites || []).indexOf(activity._id.toString()) != -1
        }
    }
    return flag ? activities : activities[0]
}
async function listDynamic(skip = 0, limit = 10, user) {
    let uniList = JSON.parse(await redis.get('uniList'))
    if (uniList) {
        uniList = uniList.splice(skip, limit)
        return uniList
    }
    // 筛选出近一周的活动和失物招领
    // 当前时间
    const now = new Date();
    // 24 小时之前
    const lastTime = new Date(now - 60 * 24 * 60 * 60 * 1000);
    let activityList = await Activities.find({},{},{lean:true});
    activityList = await actDecorate(activityList)
    let lostList = await Losts.where().find({ createdAt: { $in: [lastTime, now] } });
    lostList = await lostUtil.decorate(lostList)
    uniList = [...activityList, ...lostList];
    uniList.sort((a, b) => { return b.createdAt - a.createdAt })
    await redis.set('uniList', JSON.stringify(uniList), 'EX', 60);
    uniList = uniList.splice(skip, limit)
    return uniList
}
async function checkDone(aid, status) {
    let activityItem = await Activities.findOne({ _id: beObjectId(aid) },{},{lean:true})
    if (status) {
        for (let person of (activityItem.signedPerson || [])) {
            let personItem = await Users.findOne({ _id: beObjectId(person) },{},{lean:true})
            personItem.score = personItem.score ? personItem.score : 0
            personItem.score += activityItem.score
        }
    }
    activityItem.isDone = status
    delete activityItem._id
    await Activities.updateOne(activityItem)
}
async function commit(aid, urls) {
    let activityItem = await Activities.findOne({ _id: beObjectId(aid) },{},{lean:true})
    return  await Activities.updateOne({_id:activityItem._id},{signOut:urls})
}
exports.listDynamic = listDynamic
exports.create = create
exports.list = list
exports.join = join
exports.quit = quit
exports.signIn = signIn
exports.signOut = signOut
exports.isJoin = isJoin
exports.isSign = isSign
exports.check = check
exports.getActivityById = getActivityById
exports.actDecorate = actDecorate
exports.decorateFavorites = decorateFavorites
exports.getHotActivity = getHotActivity
exports.checkDone = checkDone
exports.commit = commit