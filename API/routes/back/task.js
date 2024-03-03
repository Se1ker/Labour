const express = require('express')
const router = express.Router()
const {upload} = require('../../util/uploadUtil')
const uploadCtrl = require('../../controller/app/uploadCtrl');
// 管理员token验证
const adminAuth = require('../../middleware/adminAuth')
const taskCtrl = require('../../controller/back/taskCtrl')
router.get('/getTaskList',adminAuth,taskCtrl.getTaskList)
router.get('/getCleanConfig',adminAuth,taskCtrl.getCleanConfig)
router.post('/setCleanConfig',adminAuth,taskCtrl.setCleanConfig)
router.post('/distribute',adminAuth,taskCtrl.distribute)
router.post('/uploadExcel',upload.single('excel'),uploadCtrl.upload)
module.exports = router