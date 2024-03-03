const { jwtSecret } = require('../config/config.default')
const { verify } = require('../util/myUtil').jwt
const { Users } = require('../model')
const  beObjectId = require('mongoose').Types.ObjectId
// const inspirecloud = require('@byteinspire/api');

async function addUser(req) {
    // 从请求头获取 token 数据
    let token = req.headers.authorization
    if (!token) {
        return false
    }
    token = token ? token.split('Bearer ')[1] : null
    const decodedToken = await verify(token, jwtSecret) // token为空会出错
    const id = beObjectId(decodedToken.userId)
    // 挂载用户个人信息到请求体上，供后续使用
    req.user = await Users.findOne({_id: id},{},{lean:true})
    return true
}

// 宽松登陆
module.exports.relaxed = async (req, res, next) => {
    await addUser(req)
    next()
}

// 严格登陆
module.exports.strict = async (req, res, next) => {
    try {
        let done = await addUser(req)
        if (!done) {
            return res.status(401).json({ msg: '登陆验证未通过' })
        }
        next()       
    } catch (error) {
        return res.status(401).json({ msg: '登陆验证已过期,请重新登陆' })
    }

}