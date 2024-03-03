const { Areas, Tasks, Classes, Users, Buildings, Academies, Configs, Sign } = require('../model')
const nodeXlsx = require('node-xlsx')
const downloadFile = require('../util/downloadFile')
const { redis } = require('../model')
// string转ObjectId
const  beObjectId = require('mongoose').Types.ObjectId
const download = async (urls) => {
    console.log(urls)
    urls = [
        'http://localhost:3000/room.xlsx',
        'http://localhost:3000/classInfo.xlsx'
      ]
        await downloadFile.downloadFileAsync(urls[0], `/tmp/room.xlsx`)
        await downloadFile.downloadFileAsync(urls[1], `/tmp/classInfo.xlsx`)
}

const writeAC = async () => {
    const ex = nodeXlsx.parse("/tmp/classInfo.xlsx")
    ex[0].data.splice(0, 1)
    let acaSet = new Set()
    ex[0].data.forEach(item => {
        if (item.length !== 0) acaSet.add(item[1])
    })
    let list = [...acaSet]
    list.forEach(async item => {
        await Academies.create({ name: item })
    })
    for (let item of ex[0].data) {
        if (item.length === 0) return
        let id = (await Academies.where({ name: item[1] }).findOne())._id
        await Classes.create({ belong: id, name: item[2], peopleCount: item[3] })
    }
}
writeAC()
const getData = () => {
    const ex2 = nodeXlsx.parse("/tmp/room.xlsx")
    return ex2[0].data
}
const dataTreat =  (data) => {
    let matchBuild = (room) => {
        if (/^11[AB]-/.test(room) || /^画室11[AB]/.test(room)) return "11栋"
        if (/^10[ABCD]/.test(room)) return "10栋"
        if (/^13-/.test(room)) return "13栋"
        if (/^20-/.test(room)) return "20栋"
        if (/^21-/.test(room)) return "21栋"
        if (/^23-/.test(room)) return "23栋"
        if (/^4-/.test(room)) return "4栋"
        if (/^第5教学楼/.test(room)) return "5栋"
        if (/^8[ABCDE]/.test(room) || room === "-101") return "8栋"
        if (/^第9教学楼/.test(room)) return "9栋"
        if (/^体训馆/.test(room)) return "体训馆"
        if (/^医学校区/.test(room)) return "医学校区"
        if (/^艺术\d/.test(room)) return "艺术学校"
        if (/^教学培训中心/.test(room)) return "东方医院"
        if (room === '化学虚拟仿真实验室' || room === '书法教室E-210' || room === '录播教室E-301') return "图书馆"
        return "未知"
    }
    let all = []
    let temp = []
    let roomList = []
    // 把每个教室的数据分开成不同元素push进all数组
    data.forEach((item, index, arr) => {
        arr[index].splice(6, 2)
        temp.push(arr[index])
        if ((index + 1) % 10 === 0 && index !== 0) {
            all.push(JSON.parse(JSON.stringify(temp)))
            temp = []
        }
    })
    // 在字符串中分离出班级数据
    let classList = []
    all.forEach((room, index) => {
        let obj = {}
        obj.room = room[1][0].split(' ')[0]
        let build = matchBuild(obj.room)
        obj.build = build
        roomList.push(room[1][0].split(' ')[0])
        let classes = []
        room.forEach((item0, index) => {
            for (let item1 of item0) {
                if (item1 === null) continue;
                let c = item1.split(']')
                c.splice(0, 1)
                c.forEach(item2 => {
                    classes.push(item2.split('◇')[1])
                })
            }
        })
        obj.classes = classes
        classList.push(obj)
    })
    classList.forEach(classItem => {
        classItem.classes = classItem.classes.filter(item => {
            // 去掉公选课和没有班级的课
            if (item !== undefined) {
                return (item.indexOf('gx') === -1 && item.indexOf('大学英语拓展课程') === -1 && item.indexOf('GX') === -1 && !isNaN(parseInt(item.substring(0, 2))))
            }
        })
        // 解析用逗号分开的好几个班
        let classTemp = []
        for (let item of classItem.classes) {
            if (item.indexOf(',') !== -1) {
                classTemp.push(...item.split(','))
            }
        }
        classItem.classes = classItem.classes.filter(item => {
            return item.indexOf(',') === -1
        })
        classItem.classes = [...classTemp, ...classItem.classes]
        // 统计次数
        let list = []
        classItem.classes.forEach(item => {
            let wasteClass = ['2020英语', '2019应用化学001班', '21日语辅导班', '2019化学工程与工艺001班', "2021级社工研究生班"]
            if (item.search("国际") !== -1) {
                list.push(item.split('(')[0] + "(" + item.split('(')[1])
            }
            else if (!(wasteClass.includes(item.split('(')[0]))) {
                list.push(item.split('(')[0])
            }

        })
        let countMap = list.reduce((all, item) => {
            if (item in all) {
                all[item]++
            } else {
                all[item] = 1
            }
            return all
        }, {})
        let countList = []
        for (let item of Object.keys(countMap)) {
            let obj = {}
            obj.className = item
            obj.count = countMap[item]
            countList.push(obj)
        }
        countList = countList.sort((a, b) => {
            return (b.count - a.count)
        })
        classItem.classes = countList
    })
    return classList
}
const matchRoom = (classList) => {
    let matchSet = new Set()
    let matchList = []
    let match = (classItem) => {
        for (let i = 0; i < classItem.classes.length; i++) {
            if (classItem.classes[i + 1] && classItem.classes[i + 1].count === classItem.classes[i].count) {
                let tempList = []
                tempList = classItem.classes.filter(item => { return item.count === classItem.classes[i].count })
                let length = matchSet.size
                while (matchSet.size === length) {
                    if (tempList.length === 0) break
                    let index = Math.floor(Math.random() * tempList.length)
                    if (matchSet.has(tempList[index].className)) {
                        tempList.splice(index, 1)
                        continue
                    }
                    matchSet.add(tempList[index].className)
                    matchList.push({ room: classItem.room, className: tempList[index].className })
                    return
                }
            } else {
                if (matchSet.has(classItem.classes[i].className)) continue
                matchSet.add(classItem.classes[i].className)
                matchList.push({ room: classItem.room, className: classItem.classes[i].className })
                return
            }
        }

    }
    classList.forEach(roomItem => {
        match(roomItem)
    })
    return matchList
}
// 写入楼栋和房间
const writeBR = async (classList) => {
    let saveList = []
    for (let item of classList) {

        let { _id } = await Buildings.where({ name: item.build }).findOne() || { _id: 0 }
        if (!_id) {
            _id = (await Buildings.create({ name: item.build }))._id
        }
        saveList.push({ belong: _id, name: item.room, type: "room" })
    }
    await Areas.create(saveList)
}
/**
 * 
 * @param {ObjectId} classId 
 * @returns 初始化数组对象
 */
async function setArray(classId) {
    let peopleCount = (await Classes.where({ _id: classId }).findOne()).peopleCount
    let limit = Math.floor(peopleCount / 5)
    let rem = peopleCount % 5
    let arr = randomNum(rem, 5)
    let obj = {}
    let weekDay = ['mon', 'tue', 'wed', 'thu', 'fri']
    for (let i = 0; i < weekDay.length; i++) {
        obj[weekDay[i]] = []
        obj[weekDay[i]][0] = limit
    }
    for (let j = 0; j < arr.length; j++) {
        obj[weekDay[arr[j]]][0]++
    }
    return obj
}
// 生成count个，在round范围内的不重复的随机数
function randomNum(count, round) {
    let set = new Set();
    while (set.size < count) {
        let index = Math.floor(Math.random() * round)
        set.add(index)
    }
    return [...set]
}
// 写入匹配班级并生成任务
const writeCR = async (matchList) => {
    // 获取全部的班级并制成map
    let classList = await Classes.where().find()
    let allAreaList = await Areas.where().find()
    let classMap = new Object()
    let areaMap = new Object()
    classList.forEach(classItem => {
        console.log(classItem)
        classMap[classItem.name] = { belong: classItem.belong, ownedClass: classItem._id }
    })
    allAreaList.forEach(areaItem => {
        areaMap[areaItem.name] = areaItem
    })
    let taskList = []
    let areaList = []
    for (let item of matchList) {
        let { belong, ownedClass } = classMap[item.className]
        let areaItem = areaMap[item.room]
        areaItem.ownedClass = ownedClass
        areaList.push(areaItem)
        let dayObj = await setArray(ownedClass)
        taskList.push({ belong, area: areaItem._id, class: ownedClass, ...dayObj, bid: areaItem.belong })
    }
    await Areas.create(areaList)
    await Tasks.create(taskList)
}
const unMatch = async (matchList, classList) => {

    let matchRoom = matchList.map(item => {
        return item.room
    })
    let matchClass = matchList.map(item => {
        return item.className
    })
    let classSet = new Set()
    classList.forEach(item => {
        item.classes.forEach(item => {
            classSet.add(item.className)
        })
    })
    let allClass = await Classes.find({},{ _id: 0, name: 1 })
    allClass = allClass.map(item => { return item.name })
    let unMatachClass = allClass.filter(item => {
        return matchClass.indexOf(item) === -1
    })
    let unmatchBuild = new Set()
    let unmatchRoom = classList.filter(item => {
        unmatchBuild.add(item.build)
        return matchRoom.indexOf(item.room) === -1
    })
    let roomList = {}
    unmatchBuild.forEach((item, index) => {
        unmatchRoom.forEach(roomItem => {
            if (roomItem.build === item) {
                if (!(roomList[index] instanceof Object)) {
                    roomList[index] = {}
                    roomList[index].room = []
                }
                roomList[index].room.push(roomItem.room)
            }
        })
    })
    let baseArea = [
        {
            build: ['11栋', '13栋', '20栋', '21栋', '23栋', '图书馆'],
            classList: ['口腔', '中医', '护理', '临床', '体教', '药学', '土木', '机制', '医工', '临床', '预防', '康复', '电气']
        },
        {
            build: ['10栋', '5栋', '8栋', '9栋'],
            classList: ['历史', '旅管', '会计', '营销', '经济', '物理', '工管', '新闻', '数学', '心理', '社工', '统计', '编导', '运动', '外汉', '文博', '法学', '材化', '化工', '园林', '汉语', '美术', '应化', '视设']
        }
    ]
    // 再匹配函数
    let rematch = (build) => {
        let rematchRoom = null
        while (!rematchRoom) {
            let buildItem = build[Math.floor(Math.random() * build.length)]
            if (buildItem === undefined) break
            if (roomList[buildItem].room.length === 0) {
                build.splice(build.indexOf(buildItem), 1)
                continue
            }
            let index = Math.floor(Math.random() * roomList[buildItem].room.length)
            rematchRoom = roomList[buildItem].room[index]
            roomList[buildItem].room.splice(index, 1)
            break
        }
        return rematchRoom

    }
    let rematchList = []
    let finalUnmatch = []
    unMatachClass.forEach(item => {
        for (let baseItem of baseArea) {
            if (baseItem.classList.includes(item.substring(2, 4))) {
                let rematchRoom = rematch(JSON.parse(JSON.stringify(baseItem.build)))
                if (rematchRoom === null) {
                    finalUnmatch.push(item)
                } else {
                    rematchList.push({ className: item, room: rematchRoom })
                }
            }
        }
    })
    let finalRoomArray = Object.values(roomList).map(item => {
        if (item.room.length !== 0) {
            return item.room
        }
    })
    let finalRoomList = []
    finalRoomArray.forEach(room => {
        if (room !== undefined) {
            finalRoomList.push(...room)
        }

    })
    for (let room of finalRoomList) {
        if (finalUnmatch.length === 0) break
        let index = Math.floor(Math.random() * finalUnmatch.length)
        let className = finalUnmatch[index]
        rematchList.push({ className, room: room })
        finalUnmatch.splice(index, 1)
    }
    return rematchList
}
// 匹配主函数
const distribute = async (urls) => {
    await download(urls)
    const data = getData()
    const classList =  dataTreat(data)
    await writeBR(classList)
    let matchList = matchRoom(classList)
    let rematchList = await unMatch(matchList, classList)
    matchList = [...matchList, ...rematchList]
    await writeCR(matchList)
    return matchList
}
const chooseList = async (classId) => {
    let classes = await Classes.where({ _id: classId }).findOne()
    let task = await Tasks.findOne({ class: classId },{},{lean:true})
    let room = (await Areas.where({ _id: task.area }).findOne()).name
    let weekDay = ['mon', 'tue', 'wed', 'thu', 'fri']
    let obj = {}
    for (let i = 0; i < weekDay.length; i++) {
        obj[weekDay[i]] = { capacity: task[weekDay[i]][0], remain: task[weekDay[i]][0] + 1 - task[weekDay[i]].length }
    }
    let list = {
        tasksId: task._id,
        classInfo: { name: classes.name, peopleCount: classes.peopleCount },
        room,
        ...obj
    }
    return list
}
// 班级成员自选
const choose = async (classId, uid, weekDay) => {
    let item = await Tasks.where({ class: beObjectId(classId) }).findOne()
    let user = await Users.where({ _id: beObjectId(uid) }).findOne()
    let room = (await Areas.where({ _id: beObjectId(item.area) })).name
    item[weekDay].push(uid)
    user.cleanTasks = { room, weekDay }
    await Tasks.create(item)
    await Users.create(user)
    return weekDay
}

const getTask = async (uid) => {
    let now = new Date()
    let { startTime, cleanCount } = await Configs.findOne({},{ startTime: 1, _id: 0, cleanCount: 1 })
    let week = Math.floor((now - startTime) / 1000 / 60 / 60 / 24 / 7)
    const weekMap = {
        "mon": "周一",
        "tue": "周二",
        "wed": "周三",
        "thu": "周四",
        "fri": "周五",
    }
    let taskList = []
    let detail
    let personItem = await Users.findOne({ _id: uid },{ cleanTasks: 1, _id: 0, class: 1 })
    let { cleanTasks: { weekDay }, class: classId } = personItem
    let list = JSON.parse(await redis.get(`${personItem.class}taskList`))
    if (!list) {
        let taskItem = await Tasks.where({ class: classId }).findOne()
        let taskDay = taskItem[weekDay]
        let className = (await Classes.where({ _id: taskItem.class }).findOne()).name
        let areaName = (await Areas.where({ _id: taskItem.area }).findOne()).name
        let buildName = (await Buildings.where({ _id: taskItem.bid }).findOne()).name
        let acaName = (await Academies.where({ _id: taskItem.belong }).findOne()).name
        detail = { className, areaName, buildName, acaName }
        // 打扫人数超过分配人数，则按最大分配人数算
        let limit = taskDay[0]
        if (cleanCount > limit) cleanCount = limit
        // 如果选这天的人数小于cleanCount，那么cleanCount以实际人数为准
        if (cleanCount > taskDay.length - 1) cleanCount = taskDay.length - 1
        // 删除限制值，便于后续操作
        taskDay.splice(0, 1)
        for (let i = 0; i < 18; i++) {
            let index = (cleanCount * i) % taskDay.length
            //数组末尾数据不够了，要从头部开始取
            if (taskDay.length - index < cleanCount) {
                // 先取掉尾部剩余的
                taskList.push(taskDay.slice(index, taskDay.length))
                // 差值，还需要从头部取得值
                let diffVal = cleanCount - taskList[i].length
                taskList[i].push(...taskDay.slice(0, diffVal))
            } else {
                taskList.push(taskDay.slice(index, index + cleanCount))
            }
        }
        await redis.set(`${classId}taskList`, JSON.stringify(taskList), 'EX', 60 * 30)
        await redis.set(`${classId}detail`, JSON.stringify(detail), 'EX', 60 * 30)
    } else {
        taskList = list
        detail = JSON.parse(await redis.get(`${classId}detail`))
    }
    let flag = taskList[week]?.includes(uid.toString())
    let currentWeek = flag ? `当前是第${week}周,当前${weekMap[weekDay]}有打扫任务` : `当前是第${week}周,当前周无打扫任务`
    let isTask = flag ? true : false
    let allWeek = []
    taskList.forEach((taskItem, index) => {
        if (taskItem.includes(uid.toString())) {
            allWeek.push(index + 1)
        }
    })
    return { isTask, currentWeek, allWeek, detail, weekDay }
}

const getTaskList = async () => {
    let list = []
    list = JSON.parse(await redis.get('list'))
    if (list === null) {
        list = []
        let buildingMap = new Map()
        let buildingSet = new Set()
        let academyMap = new Map()
        let academySet = new Set()

        let taskList = await Tasks.find({},{ belong: 1, area: 1, class: 1, bid: 1 })
        for (let taskItem of taskList) {
            buildingSet.add(taskItem.bid.toString())
            academySet.add(taskItem.belong.toString())
        }
        for (let bid of [...buildingSet]) {
            let buildName = (await Buildings.where({ _id: beObjectId(bid) }).findOne()).name
            buildingMap.set(bid, buildName)
        }
        for (let academyId of [...academySet]) {
            let academyName = (await Academies.where({ _id: beObjectId(academyId) }).findOne()).name
            academyMap.set(academyId, academyName)
        }
        for (let taskItem of taskList) {
            let areaName = (await Areas.where({ _id: taskItem.area }).findOne()).name
            let className = (await Classes.where({ _id: taskItem.class }).findOne()).name
            list.push({
                _id: taskItem._id,
                academyName: (academyMap.get(taskItem.belong.toString())),
                buildName: (buildingMap.get(taskItem.bid.toString())),
                areaName,
                className
            })
        }
        await redis.set('list', JSON.stringify(list), 'EX', 60 * 30)
    }

    return list
}

async function isSign(classId,uid) {
    let now = new Date()
    let isSameDay = (timeStampA, timeStampB) => {
        let dateA = new Date(timeStampA);
        let dateB = new Date(timeStampB);
        console.log((dateA.setHours(0, 0, 0, 0) == dateB.setHours(0, 0, 0, 0)))
        return (dateA.setHours(0, 0, 0, 0) == dateB.setHours(0, 0, 0, 0));
    }
    let signList = await Sign.where({ classId: beObjectId(classId) }).find()
    let res = signList.filter((item) => {  
        return (isSameDay(now, new Date(item.createdAt)) && (item.uid.toString() === uid.toString()))
    })
    return res.length !== 0
}
// 打扫任务签到
// 判断是否是今天值日
// 判断是否已经签到
// 签到
async function taskSign(user) {
    let { isTask, weekDay } = await getTask(user._id)
    if (isTask && user.cleanTasks.weekDay === weekDay) { //是今天值日，允许签到
        //判断是否已经签到
        if (!await isSign(user.class.toString(),user._id)) {
            return await Sign.create({ uid: user._id, nickname: user.nickname, classId: user.class, day: user.cleanTasks.weekDay })
        }
    }
    return false
}
async function getCleanConfig() {
    let { startTime, cleanCount } = await Configs.findOne({},{ startTime: 1, _id: 0, cleanCount: 1 })
    return { startTime, cleanCount }
}
async function setCleanConfig(cleanCount, startTime) {
    let configItem = await Configs.findOne({},{ startTime: 1, _id: 0, cleanCount: 1 })
    configItem.cleanCount = cleanCount ? cleanCount : configItem.cleanCount
    configItem.startTime = startTime ? startTime : configItem.startTime
    return await Configs.create(configItem)
}
exports.distribute = distribute
exports.chooseList = chooseList
exports.choose = choose
exports.getTask = getTask
exports.getTaskList = getTaskList
exports.randomNum = randomNum
exports.taskSign = taskSign
exports.isSign = isSign
exports.getCleanConfig = getCleanConfig
exports.setCleanConfig = setCleanConfig