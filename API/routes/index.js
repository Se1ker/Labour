const express = require('express');
const {User} = require('../model')
const ObjectId = require('mongodb').ObjectId;
const router = express.Router()
// app相关路由
router.use(require('./user'))
router.use(require('./tasks'))
router.use(require('./check'))
router.use(require('./losts'))
router.use(require('./activity'))
// 后台管理相关路由
router.use(require('./back/back'))
router.use(require('./back/user'))
router.use(require('./back/area'))
router.use(require('./back/check'))
router.use(require('./back/task'))
router.use(require('./back/activity'))
module.exports = router