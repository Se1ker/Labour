const express = require('express')
const router = express.Router()
const tasksCtrl = require('../controller/app/tasksCtrl')
const taskValidator = require('../validator/taskValidator')
// token验证
const auth = require('../middleware/auth');
// router.get('/recommend', auth.strict, taskValidator.recommend, tasksCtrl.cleanRecommend)
router.post('/choose', auth.strict, taskValidator.choose, tasksCtrl.choose)
router.get('/chooseList', auth.strict,taskValidator.chooseList, tasksCtrl.chooseList)
router.get('/distribute', auth.strict, tasksCtrl.distribute)
router.get('/getTask', auth.strict,taskValidator.getTask, tasksCtrl.getTask)
router.post('/isTaskSign',auth.strict, tasksCtrl.isSign)
router.post('/taskSign', auth.strict, tasksCtrl.taskSign)
module.exports = router