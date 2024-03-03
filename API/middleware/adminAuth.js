const { jwtSecret } = require('../config/config.default')
const { verify } = require('../util/myUtil').jwt
const { Admins } = require('../model')
const ObjectId = require('mongodb').ObjectId;
module.exports = async (req, res, next) => {
    // 从请求头获取 token 数据
    let token = req.headers.authorization
    token = token ? token.split('Bearer ')[1] : null
    if (!token) {
        return res.status(401).json({
            msg: '未在请求头加入token'
        })
    }
    try {
        const decodedToken = await verify(token, jwtSecret)
        const role = decodedToken.role
        if (role !== "admin") {
            return res.status(401).json({
                msg: '非管理员用户'
            })
        }
        const id = ObjectId(decodedToken.userId)
        // 挂载用户个人信息到请求体上，供后续使用
        req.user = await Admins.where({ _id: id }).findOne()
        next()
    } catch (err) {
        return res.status(401).json({
            msg: '验证未通过'
        })
    }
    // 验证token是否有效
    // 无效 响应 401 状态码
    // 有效 把用户信息读取出来挂载到req 请求对象上 继续往后执行

}