const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const signSchema = new mongoose.Schema({
    uid:{
        type:ObjectId
    },
    nickname:{
        type:String
    },
    classId:{
        type:ObjectId
    },
    day:{
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
module.exports = signSchema