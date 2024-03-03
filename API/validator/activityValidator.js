const { body, query } = require('express-validator')
const validate = require('../middleware/validate')

exports.createActivity = validate([
    body('title').notEmpty().withMessage('活动标题不能为空').bail(),
    body('content').notEmpty().withMessage('活动内容不能为空').bail(),
    body('score').notEmpty().withMessage('活动分数不能为空').custom(async (score, { req }) => {
        if (typeof score !== 'number' || score < 0 || score > 10 || Math.floor(score) !== score) return Promise.reject('score不合法')
    }).bail(),
    body('applyTime').notEmpty().custom(async (applyTime, { req }) => {
        if (!applyTime.start instanceof Date || !applyTime.end instanceof Date || applyTime.start >= applyTime.end) {
            return Promise.reject('applyTime不合法')
        }
    }),
    body('actTime').notEmpty().custom(async (actTime, { req }) => {
        if (!actTime.start instanceof Date || !actTime.end instanceof Date || actTime.start >= actTime.end) {
            return Promise.reject('actTime不合法')
        }
    }),
    body('location').notEmpty().withMessage('活动地点不能为空').bail()
])

exports.checkActivity = validate([
    body('aid').notEmpty().isLength(24).withMessage('需审核活动id不能为空').bail(),
    body('pass').isBoolean().withMessage('活动审核状态异常').bail()
])

exports.commentActivity = validate([
    body('aid').notEmpty().isLength(24).withMessage('所评论活动id不能为空').bail(),
    body('content').notEmpty().withMessage('评论内容不能为空').bail()
])

exports.listComments = validate([
    query('aid').notEmpty().isLength(24).withMessage('活动id不能为空').bail()
])
exports.replyComment = validate([
    body('reply').isLength(24).notEmpty().withMessage('reply不合法').bail(),
    body('content').notEmpty().withMessage('评论内容不能为空').bail(),
    body('belong').isLength(24).notEmpty().withMessage('所属活动id不能为空')
])