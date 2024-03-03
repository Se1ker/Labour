const express = require('express')
const router = express.Router()
// 管理员token验证
const adminAuth = require('../../middleware/adminAuth')
const areaCtrl = require('../../controller/back/areaCtrl')
router.get('/getArea',adminAuth,areaCtrl.getArea)
router.post('/addBuilding',adminAuth,areaCtrl.addBuilding)
router.post('/removeBuilding',adminAuth,areaCtrl.removeBuilding)
router.post('/addRoom',adminAuth,areaCtrl.addRoom)
router.post('/removeRoom',adminAuth,areaCtrl.removeRoom)
module.exports = router