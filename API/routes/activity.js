// 活动路由

const express = require('express')
const router = express.Router()
// 活动功能控制
const activityCtrl = require('../controller/app/activityCtrl');
const activityValidator = require('../validator/activityValidator');
const publicActCtrl = require('../controller/public/publicActCtrl');
// token验证
const auth = require('../middleware/auth');
// 创建活动
router.post('/createActivity', auth.strict, activityValidator.createActivity, activityCtrl.createActivity)
// 获取活动列表
router.get('/listActivity', auth.relaxed, publicActCtrl.listActivity)
// 活动签到
router.post('/activitySignIn', auth.strict, activityCtrl.activitySignIn)
// 活动签退
router.post('/activitySignOut', auth.strict, activityCtrl.activitySignOut)
// 评论活动
router.post('/commentActivity', auth.strict, activityValidator.commentActivity, activityCtrl.commentActivity)
// 获取活动评论
router.get('/listComments', auth.relaxed, activityValidator.listComments, activityCtrl.listComments)
// 回复评论
router.post('/replyComment', auth.strict, activityValidator.replyComment, activityCtrl.replyComment)
// 根据活动id返回活动详情
router.get('/getActivityById', auth.relaxed, activityCtrl.getActivityById)
// 获取热门推荐活动
router.get('/getHotActivity', auth.relaxed, activityCtrl.getHotActivity)
// 获取动态
router.get('/listDynamic',auth.relaxed, activityCtrl.listDynamic)
// 提交结项申请
router.post('/commit',auth.strict,activityCtrl.commit)
module.exports = router