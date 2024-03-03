const { Areas, Tasks, Classes, Users, Buildings, Configs, Checks, Conditions } = require('../model')
const tasksUtil = require('../util/tasksUtil')
let fs = require('fs')
const xlsx = require("node-xlsx");
// string转ObjectId
const beObjectId = require('mongoose').Types.ObjectId
    // 获取参数
    ; (async function () {
        global.CHECKCOUNT = (await Configs.find())[0].checkCount
    })()
async function countList() {
    let needCheckList = (await Configs.find({}, { checkBuildings: 1, _id: 0 }))[0].checkBuildings
    needCheckList.forEach((id, index, arr) => {
        console.log(arr)
        arr[index] = id.toString()
    })
    let buildList = await Buildings.where().find()

    let countList = []
    for (let build of buildList) {
        if (needCheckList.indexOf(build._id.toString()) !== -1) {
            let item = {}
            item.bid = build._id
            item.name = build.name
            item.count = await Areas.where({ belong: build._id }).count()
            countList.push(item)
        }
    }
    console.log(countList)
    return countList
}
// function lunxun() {
//     let results = []
//     let count = 243
//     for (let i = 1; i <= 30; i++) {
//         console.log(i)
//         let item = {}
//         item.checkCount = i
//         let initRem = count % i
//         let initLimit = count / i
//         if (count < i) {
//             console.log("教室数比设置的检查数小")
//             item.limit = 1
//             item.select = [count]

//         } else {
//             console.log("教室数比设置的检查数大")
//             if (initRem >= Math.floor(initLimit)) {
//                 console.log("余数比任务数大")
//                 if (initRem < Math.ceil(i / 2)) {
//                     console.log("余数比检查数的一半小")
//                     item.limit = Math.floor(initLimit)
//                     let add = Math.floor((initRem) / item.limit)
//                     let arr = new Array(item.limit)
//                     arr.fill(i + add) // 每项的值加上remainder/limit
//                     // 在arr中随机选择rem/limit个表项分别加1
//                     let pos = tasksUtil.randomNum(initRem % Math.floor(initLimit), item.limit)
//                     pos.forEach(item => {
//                         arr[item] += 1
//                     })
//                     item.select = arr
//                 } else {
//                     console.log("余数比检查数的一半大")
//                     let arr = new Array(Math.floor(initLimit))
//                     arr.fill(i)
//                     arr.push(initRem)
//                     item.limit = arr.length
//                     item.select = arr
//                 }
//             } else if (initRem < Math.floor(initLimit)) {
//                 console.log("余数比任务数小")
//                 item.limit = Math.floor(initLimit)
//                 let arr = new Array(Math.floor(initLimit))
//                 arr.fill(i)
//                 let pos = tasksUtil.randomNum(initRem, item.limit)
//                 pos.forEach(item => {
//                     arr[item] += 1
//                 })
//                 item.select = arr
//             }
//             results.push(item)
//         }

//     }
//     for (let res of results) {
//         let avl = 0
//         let varn = 0
//         for (let item of res.select) {
//             avl += item
//         }
//         avl = avl / res.select.length
//         for (let arrItem of res.select) {
//             varn += (arrItem - avl) * (arrItem - avl)
//         }
//         varn = varn / res.select.length
//         console.log(varn)
//     }
//     // const buffer = xlsx.build(results);
//     // fs.writeFileSync('res.xlsx', buffer)
//     // console.log(results)
// }
// lunxun()
async function setCheck() {

    let checkList = []
    let countLists = await countList()
    for (let build of countLists) {
        let initRem = build.count % CHECKCOUNT
        let initLimit = build.count / CHECKCOUNT
        let item = await Buildings.where({ _id: build.bid }).findOne()
        if (build.count < CHECKCOUNT) {
            console.log("教室数比设置的检查数小")
            item.limit = 1
            item.select = [build.count]
        }
        else {
            console.log("教室数比设置的检查数大")
            if (initRem >= Math.floor(initLimit)) {
                console.log("余数比任务数大")
                if (initRem < Math.ceil(CHECKCOUNT / 2)) {
                    console.log("余数比检查数的一半小")
                    item.limit = Math.floor(initLimit)
                    let add = Math.floor((initRem) / item.limit)
                    let arr = new Array(item.limit)
                    arr.fill(CHECKCOUNT + add) // 每项的值加上remainder/limit
                    // 在arr中随机选择rem/limit个表项分别加1
                    let pos = tasksUtil.randomNum(initRem % Math.floor(initLimit), item.limit)
                    pos.forEach(item => {
                        arr[item] += 1
                    })
                    item.select = arr
                } else {
                    console.log("余数比检查数的一半大")
                    item.limit = Math.floor(initLimit)
                    let arr = new Array(Math.floor(initLimit))
                    arr.fill(CHECKCOUNT)
                    arr.push(initRem)
                    item.limit = arr.length
                    item.select = arr
                }

            } else if (initRem < Math.floor(initLimit)) {
                console.log(initLimit)
                console.log("余数比任务数小")
                item.limit = Math.floor(initLimit)
                let arr = new Array(Math.floor(initLimit))
                arr.fill(CHECKCOUNT)
                let pos = tasksUtil.randomNum(initRem, item.limit)
                console.log()
                pos.forEach(item => {
                    arr[item] += 1
                })
                item.select = arr

            }
        }
        // if (build.count < CHECKCOUNT) { //第一种情况
        //     item.limit = 1
        //     item.select = [build.count]
        // } else if ((initRem) > Math.floor(initLimit)) {
        //     // 如果这个余数小于CHECKCOUNT的一半的操作，均分
        //     if ((initRem) < Math.ceil(CHECKCOUNT / 2)) {
        //         item.limit = Math.floor(initLimit)
        //         let add = Math.floor((initRem) / item.limit)
        //         let rem = (initRem) % item.limit
        //         let arr = new Array(item.limit)
        //         arr.fill(CHECKCOUNT + add)
        //         let pos = tasksUtil.randomNum(1, item.limit)
        //         arr[pos[0]] += rem
        //         item.select = arr
        //     } else {
        //         item.limit = Math.floor(initLimit) + 1
        //         // 随机选一个下标来实现随机非标准项
        //         let pos = tasksUtil.randomNum(1, item.limit - 1)
        //         // 填充数组
        //         let arr = new Array(item.limit - 1)
        //         arr.fill(CHECKCOUNT)
        //         // 插入
        //         arr.splice(...pos, 0, (initRem))
        //         item.select = arr
        //     }

        // } else {
        //     item.limit = Math.floor(initLimit)
        //     // 随机选一个下标来实现随机非标准项
        //     let pos = tasksUtil.randomNum((initRem), item.limit)
        //     // 填充数组
        //     let arr = new Array(item.limit)
        //     arr.fill(CHECKCOUNT)
        //     // 插入
        //     pos.forEach(item => {
        //         arr[item] += 1
        //     })
        //     item.select = arr
        // }
        item.count = build.count
        checkList.push(await Buildings.create(item))
    }
    return checkList
}

/**
 * @param {string} uid
 * @param {string} weekDay 
 * @param {string} bid 
 */
async function createCheck(uid, weekDay, bid) {
    uid = beObjectId(uid)
    bid = beObjectId(bid)
    let index = await Checks.where({ weekDay }).count()
    let building = await Buildings.where({ _id: bid }).findOne()
    if (index === building.limit) return false
    let roomList = await Areas.where({ belong: bid }).find()
    let count = building.select[index]
    let room = []
    if (index !== 0) {
        // 去掉已经选择了的教室
        if (index + 1 > building.limit) return false
        let tmp = await Checks.find({ weekDay }, { room: 1, _id: 0 })
        let existRoom = []
        tmp.forEach(item => {
            item.room.forEach(room => {
                existRoom.push(room.toString())
            })
        })
        roomList = roomList.filter(item => {
            return existRoom.indexOf(item._id.toString()) === -1
        })
    }
    for (let i = 0; i < count; i++) {
        room.push(roomList.shift())
    }
    return await Checks.create({ uid, weekDay, room, bid })
}
/**
 * 报名
 * @param {string} uid 
 */
async function apply(uid) {
    let item = await Users.where({ _id: beObjectId(uid) }).findOne()
    await Users.updateOne({ _id: item }, { role: 'checker' })
    return true
}


async function getCheckList() {
    let buildList = await Buildings.find({}, {}, { lean: true })
    let weekDay = ['周一', '周二', '周三', '周四', '周五']
    for (let build of buildList) {
        if (!build.limit) continue
        let checkList = await Checks.where({ bid: build._id }).find()
        build.selectDetail = []
        weekDay.forEach((item, index) => {
            build.selectDetail.push({ weekDay: item, remain: build.limit })
            checkList.forEach((check) => {
                if (check.weekDay === item) build.selectDetail[index]['remain']--
            })
        })
    }
    for (let i = 0; i < buildList.length; i++) {
        if (buildList[i].selectDetail === undefined) {
            buildList.splice(i, 1)
        }
    }
    buildList = buildList.filter(item => {
        return item.selectDetail !== undefined
    })
    return buildList
}
/**
 * 根据uid获取检查任务
 * @param {string} uid 
 */
async function getCheckById(uid) {
    let checkItem = await Checks.findOne({ uid: beObjectId(uid) }, {}, { lean: true })
    if (!checkItem) return false
    for (let i = 0; i < checkItem.room.length; i++) {
        let tempRoom = await Areas.where().findOne({ _id: checkItem.room[i] }, {}, { lean: true })
        checkItem.room[i] = { rid: tempRoom._id, name: tempRoom.name }
    }
    checkItem.buildingName = (await Buildings.where({ _id: checkItem.bid }).findOne()).name
    return checkItem
}

async function checkCondition(uid, status, desc, images, coords, classes, area) {
    // 判断卫生状况
    let taskItem = await Tasks.where({ area: beObjectId(area.rid) }).findOne()
    if (!taskItem.status || !taskItem.status) {
        taskItem.status = status === '不合格' ? '预警' : status
    } else if (taskItem.status === '预警') {
        taskItem.status = status === '不合格' ? '不合格' : status
    } else {
        taskItem.status = status
    }
    let _id = taskItem._id
    delete taskItem._id
    await Tasks.updateOne({ _id }, taskItem)
    return await Conditions.create({ uid, status: taskItem.status, desc, images, coords, class: classes, area })
}
async function conditionList() {
    let conditionList = await Conditions.where().find()
    let checkerSet = new Set()
    let checkerMap = new Map()
    for (let conditionItem of conditionList) {
        checkerSet.add(conditionItem.uid.toString())
    }
    for (let uid of [...checkerSet]) {
        let checkerName = (await Users.where({ _id: beObjectId(uid) }).findOne({}, { nickname: 1 })).nickname
        checkerMap.set(uid, checkerName)
    }
    await conditionList.forEach(async (conditionItem, index, arr) => {
        arr[index].checkerName = checkerMap.get(conditionItem.uid.toString())
    })
    return conditionList
}
// 获取已经生成的检查任务
async function listChosen() {
    let checkList = await Checks.find({}, {}, { lean: true })
    let buildList = await Buildings.find({}, {}, { lean: true })
    let buildMap = new Map()
    let roomMap = new Map()
    for (let build of buildList) {
        buildMap.set(build._id.toString(), build.name)
    }
    let roomList = await Areas.where().find()
    for (let roomItem of roomList) {
        roomMap.set(roomItem._id.toString(), roomItem.name)
    }
    checkList.forEach(async (checkItem, index, arr) => {

        checkItem.room.forEach((roomItem, roomIndex, room) => {
            room[roomIndex] = { rid: roomItem, roomName: roomMap.get(roomItem.toString()) }
        })
        arr[index].buildingName = buildMap.get(checkItem.bid.toString())
        arr[index].checkerName = (await Users.where({ _id: checkItem.uid }).findOne()).nickname
    })

    for (let i = 0; i < checkList.length; i++) {
        checkList[i].checkerName = (await Users.where({ _id: checkList[i].uid }).findOne()).nickname
        checkList[i].room.forEach((roomItem, roomIndex, room) => {
            room[roomIndex] = { rid: roomItem, roomName: roomMap.get(roomItem.toString()) }
        })
        checkList[i].buildingName = buildMap.get(checkList[i].bid.toString())
    }
    return checkList
}
// 修改一个教室分配多少人检查
async function modifyCheckCount(checkCount) {
    checkCount = typeof checkCount === 'number' ? checkCount : Number(checkCount)
    let config = (await Configs.where().find())[0]
    config.checkCount = checkCount
    delete config._id
    await Configs.updateOne(config)
    global.CHECKCOUNT = checkCount
    return checkCount
}
async function getCheckCount() {
    return (await Configs.where().find())[0].checkCount
}
exports.apply = apply
exports.createCheck = createCheck
exports.getCheckList = getCheckList
exports.getCheckById = getCheckById
exports.setCheck = setCheck
exports.checkCondition = checkCondition
exports.conditionList = conditionList
exports.listChosen = listChosen
exports.modifyCheckCount = modifyCheckCount
exports.getCheckCount = getCheckCount