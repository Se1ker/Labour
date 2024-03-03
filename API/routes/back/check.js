const express = require('express')
const router = express.Router()
// 管理员token验证
const adminAuth = require('../../middleware/adminAuth')
const checkCtrl = require('../../controller/back/checkCtrl')
router.get('/getConditions',checkCtrl.getConditions)
router.get('/listChosen',adminAuth,checkCtrl.listChosen)
router.post('/modifyCheckCount',adminAuth,checkCtrl.modifyCheckCount)
router.get('/getCheckCount',adminAuth,checkCtrl.getCheckCount)
module.exports = router