const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({
    stuId:{
        type:String
    },
    password:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})
module.exports = adminSchema