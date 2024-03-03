const express = require('express')
const router = express.Router()
const checkCtrl = require('../controller/app/checkCtrl')
const checkValidator = require('../validator/checkValidator')
// token验证
const auth = require('../middleware/auth');
router.post('/apply', auth.strict, checkValidator.apply, checkCtrl.apply)
router.post('/createCheck', auth.strict, checkValidator.createCheck, checkCtrl.createCheck)
router.get('/getCheckList', auth.strict, checkCtrl.getCheckList)
router.get('/getCheckById', auth.strict, checkCtrl.getCheckById)
router.post('/checkCondition', auth.strict,checkValidator.checkCondition,checkCtrl.checkCondition)
module.exports = router