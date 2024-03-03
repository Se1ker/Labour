const { body, query } = require('express-validator')
const validate = require('../middleware/validate')
const { Areas, Tasks, Classes, Users, Buildings, Checks } = require('../model')
exports.recommend = validate([
    body().custom(async (none, { req }) => {
        let classes = req.user.class
        if ((await Tasks.where({ class: classes }).find()).length !== 0) return Promise.reject('重复获取')
    }).bail()
])
exports.choose = validate([
    body().custom(async (none, { req }) => {
        let weekDay = req.body.weekDay
        let user = req.user
        if(!user.class) return Promise.reject('当前未选择班级')
        let item = await Tasks.where({ class: user.class }).findOne()
        if (!(user.cleanTasks !== undefined ^ user.cleanTasks !== null)) return Promise.reject('重复选取')
        if (item[weekDay].length - 1 === item[weekDay][0]) return Promise.reject('超过人数限制')
    }).bail()
])

exports.getTask = validate([
    body().custom(async (none,{req}) => {
        let {cleanTasks} = req.user
        if(!cleanTasks) return Promise.reject('当前未选择任务')
    })
])

exports.chooseList = validate([
    body().custom(async (none,{req}) => {
        if(!req.user.class) return Promise.reject('当前未选择班级')
    })
])

exports.getTask = validate([
    body().custom(async (none,{req}) => {
        if(req.user.cleanTasks === null || req.user.cleanTasks === undefined) return Promise.reject('当前未选择任务')
    })
])