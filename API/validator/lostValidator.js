const { body, query } = require('express-validator')
const validate = require('../middleware/validate')

exports.createLosts = validate([
    body('title').notEmpty().withMessage('标题不能为空').bail(),
    body('content').notEmpty().withMessage('内容不能为空').bail(),
    body('images').custom(async (images, { req }) => {
        if (images) {
            if (!(images instanceof Array) || images.length > 3) return Promise.reject('images不合法')
        }
    }).bail(),
    body('keywords').notEmpty().withMessage('关键词不能为空').custom(async (keywords, { req }) => {
        if (!(keywords instanceof Array)) return Promise.reject('keywords不合法')
    }).bail(),
    body('type').notEmpty().withMessage('类型不能为空').custom(async (type, { req }) => {
        if (['失物招领', '寻物启事'].indexOf(type) === -1) return Promise.reject('type不合法')
    }).bail(),
    body('contact').notEmpty().withMessage('联系方式不能为空').custom(async (contact, { req }) => {
        console.log(contact);
        if (!(contact.type || contact.info)) return Promise.reject('联系方式或联系内容不能为空')
    }).bail()
])
exports.commentLosts = validate([
    body('lid').notEmpty().isLength(24).withMessage('所评论活动id不能为空').bail(),
    body('content').notEmpty().withMessage('评论内容不能为空').bail()
])

exports.listComments = validate([
    query('lid').notEmpty().isLength(24).withMessage('活动id不能为空').bail()
])
exports.replyComment = validate([
    body('reply').isLength(24).notEmpty().withMessage('reply不合法').bail(),
    body('content').notEmpty().withMessage('评论内容不能为空').bail(),
    body('belong').isLength(24).notEmpty().withMessage('所属活动id不能为空')
])
