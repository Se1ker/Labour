const { redis } = require('../model')
// string转ObjectId
const beObjectId = require('mongoose').Types.ObjectId
const { Buildings, Areas } = require('../model')
exports.getArea = async () => {
    let areaList = []
    tempList = JSON.parse(await redis.get('areaList'))
    if (tempList) return tempList
    let buildList = await Buildings.find({},{ name: 1 })
    for (let build of buildList) {
        let roomlist = await Areas.where({ belong: build._id }).find()
        areaList.push({ building: build.name, bid: build._id, roomlist })
    }
    await redis.set('areaList', JSON.stringify(areaList), 'EX', 60 * 3);
    return areaList
}
/** 增加楼栋
 * @param {string} buildingName 楼栋名称
 */
exports.addBuilding = async (buildingName) => {
    let areaList = JSON.parse(await redis.get('areaList'))
    // cache未过期
    if (areaList) {
        let buildItem = await Buildings.create({ name: buildingName, count: 0 })
        areaList.push({ building: buildingName, bid: buildItem._id, roomlist: [] })
        await redis.set('areaList', JSON.stringify(areaList), 'EX', 60 * 3);
        return buildItem
    } else {
        // cache过期
        return await Buildings.create({ name: buildingName, count: 0 })
    }

}
/** 删除楼栋
 * @param {string} bid 楼栋id
 */
exports.removeBuilding = async (bid) => {
    let areaList = JSON.parse(await redis.get('areaList'))
    // cache未过期
    if (areaList) {
        let buildItem = await Buildings.where({ _id: beObjectId(bid) }).remove()
        areaList = areaList.filter(item => {
            return item.bid !== bid
        })
        await redis.set('areaList', JSON.stringify(areaList), 'EX', 60 * 3);
        return buildItem
    } else {
        // cache过期
        return await Areas.where({ belong: beObjectId(bid) }).remove()
    }


}
/** 增加教室
 * @param {string} 楼栋id
 * @param {string} 教室名称
 */

exports.addRoom = async (bid, roomName) => {
    let areaList = JSON.parse(await redis.get('areaList'))
    // cache未过期
    if (areaList) {
        for (let item of areaList) {
            if (item.bid === bid) {
                let buildingItem = await Buildings.where({ _id: beObjectId(bid) }).findOne()
                buildingItem.count++
                await Buildings.create(buildingItem)
                let roomItem = await Areas.create({ belong: beObjectId(bid), name: roomName, type: "room" })
                item.roomlist.push(roomItem)
                await redis.set('areaList', JSON.stringify(areaList), 'EX', 60 * 3);
                return roomItem
            }
        }
    } else {
        let buildingItem = await Buildings.where({ _id: beObjectId(bid) }).findOne()
        buildingItem.count++
        await Buildings.updateOne(buildingItem)
        return await Areas.create({ belong: beObjectId(bid), name: roomName, type: "room" })
    }

}
/** 删除教室
 * @param {string} rid 教室id
 */
exports.removeRoom = async (rid) => {
    let areaList = JSON.parse(await redis.get('areaList'))
    // cache未过期
    let flag = false
    if (areaList) {
        for (let item of areaList) {
            for (let room of item.roomlist) {
                if (room._id === rid) {
                    item.roomlist = item.roomlist.filter(item => {
                        return item._id !== rid
                    })
                    flag = true
                    break
                }
            }
            if(flag) break
        }
        await redis.set('areaList', JSON.stringify(areaList), 'EX', 60 * 3)
        let roomItem = await Areas.where({ _id: beObjectId(rid) }).findOne()
        let buildingItem = await Buildings.findOne({ _id: roomItem.belong },{},{lean:true})
        buildingItem.count--
        await Buildings.updateOne(buildingItem)
        return await Areas.where({ _id: beObjectId(rid) }).remove()
    } else {
        let roomItem = await Areas.where({ _id: beObjectId(rid) }).findOne()
        let buildingItem = await Buildings.findOne({ _id: roomItem.belong },{},{lean:true})
        buildingItem.count--
        await Buildings.updateOne(buildingItem)
        return await Areas.where({ _id: beObjectId(rid) }).remove()
    }

}

