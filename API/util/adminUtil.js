const { jwt } = require('./myUtil')
const { jwtSecret } = require('../config/config.default')
const { Admins } = require('../model/index')

exports.setToken = async (_id) => {
    return await jwt.sign({
        userId: _id,
        role: "admin"
    }, jwtSecret, { expiresIn: 14 * 24 * 60 * 60 })
}

exports.check = async (stuId, password) => {
   let admin = await Admins.where({ stuId }).findOne()
   if(!admin) return null
    return (admin.password == password) ? admin._id.toString() : null
}