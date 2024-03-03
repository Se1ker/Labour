const express = require('express')
const router = express.Router()
const activityValidator = require('../../validator/activityValidator')
const activityCtrl = require('../../controller/back/activityCtrl')
const adminAuth = require('../../middleware/adminAuth')
router.post('/checkActivity', activityValidator.checkActivity, adminAuth, activityCtrl.checkActivity)
router.post('/checkDone',  adminAuth, activityCtrl.checkDone)
module.exports = router