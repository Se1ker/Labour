// 失物招领路由
const express = require('express')
const router = express.Router()
const lostCtrl = require('../controller/app/lostCtrl')
const lostValidator = require('../validator/lostValidator')
// token验证
const auth = require('../middleware/auth')
// 创建失物招领&寻物启事活动
router.post('/createLosts', auth.strict, lostValidator.createLosts, lostCtrl.createLosts)
router.get('/searchByKey', auth.strict, lostCtrl.searchByKey)
router.post('/doneLosts', auth.strict, lostCtrl.doneLosts)
router.post('/commentLosts', auth.strict, lostValidator.commentLosts, lostCtrl.commentLosts)
router.post('/losts/replyComment', auth.strict, lostValidator.replyComment, lostCtrl.replyComment)
router.get('/losts/listComments', auth.relaxed, lostCtrl.listComments)
router.get('/listLosts', auth.relaxed, lostCtrl.listLosts)
module.exports = router