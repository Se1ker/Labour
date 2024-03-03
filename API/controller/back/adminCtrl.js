const adminUtil = require('../../util/adminUtil')
const activityUtil = require('../../util/activityUtil')

exports.saLogin = async (req, res, next) => {
    let { stuId, password } = req.body;
    let adminId = await adminUtil.check(stuId, password)
    if (!adminId) {
        return res.status(400).json({
            msg: "账号或密码错误"
        })
    }
    let token = await adminUtil.setToken(adminId)
    res.status(200).json({
        msg: "登录成功",
        data: { token }
    })
}

