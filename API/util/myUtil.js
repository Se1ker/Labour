const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const crypto = require('crypto')

jwt.sign = promisify(jwt.sign)
jwt.verify = promisify(jwt.verify)
jwt.decode = promisify(jwt.decode)

exports.jwt = jwt

// 获取 支持的散列算法
exports.md5 = str => {
    return crypto.creatHash('md5')
        .update('key' + str)
        .digest('hex')//转换成十进制
}