/**
 * 用户相关验证器
 */

const { body } = require('express-validator')
const validate = require('../middleware/validate')
const securityCode = require('../util/securityCodeUtil')
const userUtil = require('../util/userUtil');
const { Classes, Academies } = require('../model')
// const inspirecloud = require('@byteinspire/api')
// string转ObjectId
const  beObjectId = require('mongoose').Types.ObjectId

exports.register = validate([
    body('code').notEmpty().withMessage('验证码不能为空')
        .isLength(6).withMessage('验证码长度需为6位')
        .custom(async (code, { req }) => {
            let isMatch = await securityCode.compCode(req.body.toEmail, code)
            if (!isMatch) {
                return Promise.reject('验证码已失效或不正确')
            }
        })
        .bail(),
    body('toEmail').notEmpty().withMessage('邮箱不能为空')
        .isEmail().withMessage('邮箱格式错误')
        .custom(async toEmail => {
            if (await userUtil.isEmailExist(toEmail)) {
                return Promise.reject('邮箱已存在')
            }
        })
        .bail(),   //前面验证全通过才执行下边的
    body('stuId').notEmpty().withMessage('学号不能为空')
        .isLength({ min: 10 })
        .custom(async stuId => {
            if (await userUtil.isStuIdExist(stuId)) {
                return Promise.reject('学号已存在')
            }
        })
        .bail(),   //前面验证全通过才执行下边的
    body('password')
        .notEmpty().withMessage('密码不能为空')
        .isLength({ min: 10, max: 16 }).withMessage('密码长度在10到16之间')
        .bail()    //前面验证全通过才执行下边的
])

exports.login = validate([
    body('account').notEmpty().withMessage('账号不能为空')
        .bail(),
    body('password').notEmpty().withMessage('密码不能为空')
        .isLength({ min: 10, max: 16 }).withMessage('密码长度在10到16之间')
        .bail()
])

exports.modifyPass = validate([
    body('code').notEmpty().withMessage('验证码不能为空')
        .isLength(6).withMessage('验证码长度需为6位')
        .custom(async (code, { req }) => {
            let isMatch = await securityCode.compCode(req.user.email, code)
            if (!isMatch) {
                return Promise.reject('验证码已失效或不正确')
            }
        })
        .bail(),
    body('newPass')
        .notEmpty().withMessage('密码不能为空')
        .isLength({ min: 10, max: 16 }).withMessage('密码长度在10到16之间')
        .bail()
])

exports.modifyUserInfo = validate([
    body('classId').custom(async (none,{req}) => {
        console.log(req.user)
        let classId = req.body.classId ? req.body.classId :null
        if (classId) {
            let classItem = await Classes.where({ _id: beObjectId(classId) }).findOne()
            if (!classItem) return Promise.reject('classId不合法')
            if (req.user.class && (classId !== req.user.class.toString())) return Promise.reject('当前已选择班级')
        }else{
            if (!req.user.class) return Promise.reject('当前未选择班级,请先选择班级,classId不能为空')
        }
    }).bail(),
    body('academyId').custom(async  (none,{req}) => {
        let academyId = req.body.academyId ? req.body.academyId :null
        if(academyId){
            if ( !await Academies.where({ _id: beObjectId(academyId) }).findOne()) return Promise.reject('academyId不合法')
        }
    }).bail()
])
exports.listClass = validate([
    body('academyId').custom(async academyId => {
        if(academyId.length !== 24 || !Academies.where({_id:beObjectId(academyId)}).findOne()) return Promise.reject('academyId不合法')
    })
])