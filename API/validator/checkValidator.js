const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { Areas, Users, Buildings, Checks } = require('../model')
const weekDays = ['周一', '周二', '周三', '周四', '周五']
// string转ObjectId
const  beObjectId = require('mongoose').Types.ObjectId
exports.apply = validate([
    body().custom(async (uid, { req }) => {
        if ((await Users.where({ _id: req.user._id }).findOne()).role) {
            return Promise.reject('当前用户已报名')
        }
    }).bail()
])
exports.createCheck = validate([
    body().custom(async (uid, { req }) => {
        if (!(await Users.where({ _id: req.user._id }).findOne()).role) {
            return Promise.reject('当前用户未报名')
        }
    }).bail(),
    body('weekDay').notEmpty().withMessage('weekDay不能为空').custom(async (weekDay) => {
        if (weekDays.indexOf(weekDay) === -1) return Promise.reject('weekDay不合法')
    }).bail(),
    body('bid').notEmpty().withMessage('bid不能为空').custom(async (bid) => {
        if (!(await Buildings.where({ _id: beObjectId(bid) }).findOne())) return Promise.reject('bid不合法')
    }).bail(),
    body().custom(async (none, { req }) => {
        if ((await Checks.where({ uid: req.user._id }).findOne())) {
            return Promise.reject('当前用户已选检查任务')
        }
    }).bail(),
])
exports.checkCondition = validate([

    body('status').notEmpty().withMessage('status不能为空').bail(),
    body('coords').custom(async (coords) => {
        let reg = /^[-\+]?\d+(\.\d+)\,[-\+]?\d+(\.\d+)$/;
        let result = coords.toString().match(reg)
        if (!result) return Promise.reject('坐标不合法')
    }).bail(),
    body().custom(async (none, { req }) => {
        if (req.body.status === '合格') {
            if (req.body.desc !== undefined) return Promise.reject('desc不合法')
        }
        else if (req.body.status === '不合格') {
            if (req.body.desc === undefined || req.body.desc.length === 0) return Promise.reject('desc不合法')
            if (req.body.images === undefined) return Promise.reject('images不合法')
        }
        else if (req.body.status === '优秀') {
            if (req.body.desc !== undefined) return Promise.reject('desc不合法')
            if (req.body.images === undefined) return Promise.reject('images不合法')
        }
    }).bail(),
    body('area').notEmpty().withMessage('area不能为空').custom(async (area) => {
        let areaItem = await Areas.where({ _id: beObjectId(area.rid) }).findOne()
        if (area.rid.length !== 24 || !areaItem || (areaItem.name !== area.name))return Promise.reject('rid或name不合法')
    }).bail(),
])