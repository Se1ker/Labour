const express = require('express')
const router = express.Router()
const adminCtrl = require('../../controller/back/adminCtrl')
// 管理员token验证
const adminAuth = require('../../middleware/adminAuth')
const publicActCtrl = require('../../controller/public/publicActCtrl');
const checkCtrl = require('../../controller/app/checkCtrl');
router.post('/saLogin', adminCtrl.saLogin)

router.get('/back/listActivity', adminAuth, publicActCtrl.listActivity)
router.get('/setCheck',checkCtrl.setCheck)

module.exports = router