const { Losts } = require('../model/index')
const userUtil = require('../util/userUtil')
// string转ObjectId
const  beObjectId = require('mongoose').Types.ObjectId
/**
 * 
 * @param {string} uid 用户id
 * @param {string} content 内容
 * @param {object} contact 联系方式
 * @param {array} images 
 * @param {array} keywords 
 * @returns 活动id
 */
async function create(uid, title, content, images, keywords, type, contact, isDone = false) {
    uid = beObjectId(uid)
    return (await Losts.create({ uid, content, title, images, keywords, type, contact, isDone }))._id
}

/**
* @param {string} key 关键词
* @returns 失物招领列表
*/
async function searchByKey(key) {
    let lists = await list()
    let relatedList = []
    for (let item of lists) {
        for (let keyword of item.keywords) {
            if (keyword.indexOf(key) !== -1) relatedList.push(item)
        }
    }
    return relatedList
}

/**
 * @param {string} lid 事件id
 */
async function done(lid) {
    lid = beObjectId(lid)
    let item = await Losts.where({ _id: lid }).findOne()
    if (item.isDone) return false
    item.isDone = true
    if (await Losts.updateOne(item)) return true
}
async function list() {
    return await decorate((await Losts.find({},{},{lean:true})))
}
//装饰个人信息
async function decorate(losts) {
    let ownerList = []
    for (let lost of losts) {
        let owner = userUtil.getUserInfo(lost.uid)
        ownerList.push(owner)
    }
    for (let lost of losts) {
        for await (let owner of ownerList) {
            let ownerName = owner.nickname
            let ownerEmail = owner.email
            let avatar = owner.avatar
            lost.ownerName = ownerName
            lost.ownerEmail = ownerEmail
            lost.avatar = avatar
        }
    }
    return losts

}
exports.create = create
exports.searchByKey = searchByKey
exports.done = done
exports.list = list
exports.decorate = decorate