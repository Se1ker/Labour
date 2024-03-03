const express = require('express')
const router = express.Router()
// 管理员token验证
const adminAuth = require('../../middleware/adminAuth')
const userInfoCtrl = require('../../controller/back/userInfoCtrl')
router.get('/getAllUser',adminAuth,userInfoCtrl.getAllUser)
router.get('/getAllChecker',adminAuth,userInfoCtrl.getAllChecker)
router.post('/back/modifyUserInfo',adminAuth,userInfoCtrl.modifyUserInfo)
router.get('/listAllClass',adminAuth,userInfoCtrl.listAllClass)
router.post('/deleteUser',adminAuth,userInfoCtrl.deleteUser)
module.exports = router