// 用户路由

const express = require('express')
const router = express.Router()
const { upload} = require('../util/uploadUtil')

// 用户功能控制
const userCtrl = require('../controller/app/userCtrl');
const publicUserCtrl = require('../controller/public/publicUserCtrl')
const uploadCtrl = require('../controller/app/uploadCtrl');
// const publicUserCtrl = require('../../controller/public/publicUserCtrl')
// 数据验证
const validator = require('../validator/userValidator')
// token验证
const auth = require('../middleware/auth');
// 发送验证码
router.post('/sendSecCode', userCtrl.sendSecCode)
// 注册
router.post('/register', validator.register, userCtrl.register)
// 登录
router.post('/login', validator.login, userCtrl.login)
// 返回用户个人信息
router.get('/getUserInfo', auth.strict, userCtrl.getUserInfo)
// 修改用户个人信息
router.post('/modifyUserInfo', auth.strict, upload.single('img'),validator.modifyUserInfo, userCtrl.modifyUserInfo)
// 加入活动
router.post('/joinActivity', auth.strict, userCtrl.joinActivity)
// 退出活动
router.post('/quitActivity', auth.strict, userCtrl.quitActivity)
// 积分排行
router.get('/scoreSort', auth.relaxed, userCtrl.scoreSort)
// 根据用户id返回参加的活动信息
router.get('/listJoinActivity', auth.strict, userCtrl.listJoinActivity)

// 点赞评论
router.post('/likeComment', auth.strict, userCtrl.likeComment)

// 返回学院列表
router.get('/listAcademy', auth.relaxed, publicUserCtrl.listAcademy)
// 收藏活动
router.post('/addFavorites', auth.strict, userCtrl.addFavorites)
// 返回班级列表
router.post('/listClass',auth.strict, validator.listClass, userCtrl.listClass)
// 上传图片接口
router.post('/uploadImage',auth.strict,upload.single('img'),uploadCtrl.upload)
module.exports = router