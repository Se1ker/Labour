const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const userSchema = new mongoose.Schema({
    email: {
        type: String
    },
    stuId: {
        type: String
    },
    password: {
        type: String
    },
    belong: {
        type: ObjectId
    },
    actId:{
        type:Array
    },
    nickname: {
        type: String
    },
    score: {
        type: Number
    },
    HDegree: {
        type: Number
    },
    avatar: {
        type: String
    },
    favorites: {
        type: Array
    },
    class: {
        type: ObjectId
    },
    cleanTasks: {
        type: Object
    },
    role: {
        type: String
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
module.exports = userSchema