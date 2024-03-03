// const inspirecloud = require('@byteinspire/api')
const { Users, Academies, Classes, Checks, Buildings, Areas, redis } = require('../model')
const { jwt } = require('./myUtil')
const { jwtSecret } = require('../config/config.default')
// string转ObjectId
const beObjectId = require('mongoose').Types.ObjectId
// const uploadImageUtil = require('./uploadImageUtil')

// 根据学院id返回学院
async function getAcademy(academyId) {
    if (academyId) {
        academyId = academyId.toString()
        return await Academies.findOne({ _id: beObjectId(academyId) }, {}, { lean: true })
    }
}

exports.isEmailExist = async function isEmailExist(email) {
    return await Users.where({ email: email }).count() > 0;
}

exports.isStuIdExist = async function isStuIdExist(stuId) {
    return await Users.where({ stuId: stuId }).count() > 0;
}

/**
 * 检查账号密码是否匹配
 * @param {string} account 账号（学号）
 * @param {string} password 密码
 * @returns 账号密码是否匹配
 */
exports.check = async (account, password) => {
    let user = {}
    if (account.indexOf('@') == -1) {
        // 学号登陆
        user = await Users.where({ stuId: account }).findOne()
    } else {
        // 邮箱登陆
        user = await Users.where({ email: account }).findOne()
    }
    return (user?.password == password) ? user._id.toString() : null
}

exports.setToken = async (uid) => {
    return await jwt.sign({
        userId: uid
    }, jwtSecret, { expiresIn: '14d' })
}

/**
 * 生成用户并保存到数据库
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @param {number} stuId 学号
 * @returns 用户id（非学号）
 */
exports.create = async (email, password, stuId) => {
    let nickname = Math.random().toString(36).substring(10) + `_${stuId}`;
    let user = Users.create({ email, password, stuId, nickname })
    return user._id
}
/**
 * 修改用户信息
 * @param {string} id 用户唯一标识
 * @param {string} nickname 昵称
 * @param {string} academyId 学院id
 * @param file 图片文件
 * @returns 修改之后的信息
 */
exports.modifyUserInfo = async (id, nickname, academyId, req, classId) => {
    let user = await Users.findOne({ _id: beObjectId(id) }, {}, { lean: true })
    if (!user.class) {
        user.class = beObjectId(classId)
    }
    if (nickname) {
        user.nickname = nickname
    }
    if (req.file) {
        user.avatar = `http://175.27.247.87:8081/${req.file.filename.toString()}`
    }
    if (academyId) {
        user.belong = beObjectId(academyId)
    }
    let _id = user._id
    delete user._id
    await Users.updateOne({ _id }, user)
    user.academyName = await getAcademy(academyId).name
    delete user.belong
    delete user.password
    return user
}
/**
 * 修改密码
 * @param {string} newPass 新密码
 * @param {string} uid 用户唯一标识
 * @returns true 修改成功
 */
exports.modifyPass = async (newPass, uid) => {
    let item = await Users.where({ _id: beObjectId(uid) }).findOne()
    item.password = newPass
    delete item._id
    await Users.updateOne(item)
    return true
}
/**
 * 获取用户个人信息
 * @param {string} uid 用户唯一标识
 * @returns 用户个人信息
 */
exports.getUserInfo = async (uid) => {
    const user = await Users.findOne({ _id: beObjectId(uid) }, {}, { lean: true })
    user.academyName = (await getAcademy(user.belong) || { name: "" }).name
    user.classId = user.class ? user.class : null
    user.className = (await Classes.where({ _id: user?.classId }).findOne() || { name: "" }).name
    delete user.class
    delete user.password
    delete user.belong
    return user
}

/**
 * 根据积分排名
 * @returns 排名列表
 */
exports.scoreSort = async () => {
    let list = await Users.where().sort({ score: -1 }).limit(20).find()
    for (let user of list) {
        user.academyName = await getAcademy(user.belong).name
        delete user.password
        delete user.belong
    }
    return list
}

/**
 * 返回学院信息
 * @returns 学院信息
 */
exports.listAcademy = async () => {
    return await Academies.where().find()
}
/**
 * 返回班级信息
 * @returns 班级信息
 */
exports.listAllClass = async () => {
    let classList = await Classes.find({}, {}, { lean: true })
    let academyList = await Academies.find({}, {}, { lean: true })
    let academyMap = new Map()
    academyList.forEach(item => {
        academyMap.set(item._id.toString(), item.name)
    })
    for (let item of classList) {
        item['academyName'] = academyMap.get(item.belong.toString())
    }
    return classList
}

exports.addFavorites = async (user, aid) => {
    let favorites = user.favorites || []
    const index = favorites.indexOf(aid);
    if (index == -1) {
        favorites.push(aid)
    }
    else {
        favorites.splice(index, 1)
    }
    user.favorites = favorites
    delete user_id
    await Users.updateOne(user)
    return index == -1
}

exports.getAllUser = async (skip = 0, limit = 10) => {
    let count = await Users.where().count()
    let userList = await Users.find({}, {}, { lean: true }).skip(skip).limit(limit)
    for (let user of userList) {
        user.academyName = (await Academies.where({ _id: user.belong }).findOne())?.name
        user.className = (await Classes.where({ _id: user.class }).findOne())?.name
    }
    return { userList, count }
}
exports.getAllChecker = async () => {
    if (JSON.parse(await redis.get('checkerList'))) return JSON.parse(await redis.get('checkerList'))
    let checkerList = await Users.find({ role: "checker" }, { _id: 1, stuId: 1, class: 1, belong: 1, nickname: 1 }, { lean: true })
    for (let checker of checkerList) {
        let checkItem = await Checks.where({ uid: checker._id }).findOne()
        let className = (await Classes.where({ _id: checker.class }).findOne())?.name
        let academyName = (await Academies.where({ _id: checker.belong }).findOne())?.name
        let buildName = (await Buildings.where({ _id: checkItem.bid }).findOne())?.name
        checker.room = []
        checker.buildName = buildName
        checker.className = className
        checker.academyName = academyName
        for (let roomItem of checkItem.room) {
            checker.room.push({ roomId: roomItem, roomName: (await Areas.where({ _id: roomItem }).findOne()).name })
        }
    }
    await redis.set('checkerList', JSON.stringify(checkerList), 'EX', 60 * 3);
    return checkerList
}
exports.backModifyUserInfo = async (userInfoForm) => {
    let userItem = await Users.findOne({ _id: userInfoForm._id }, {}, { lean: true });
    userItem.nickname = userInfoForm.nickname
    userItem.belong = beObjectId(userInfoForm.belong)
    userItem.class = beObjectId(userInfoForm.class)
    return await Users.updateOne(userItem)
}
exports.deleteUser = async (userId) => {
    return Users.where({ _id: beObjectId(userId) }).remove()
}
exports.listClass = async (academyId) => {
    return await Classes.where({ belong: beObjectId(academyId) }).find()
}