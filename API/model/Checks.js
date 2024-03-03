const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const checkSchema = new mongoose.Schema({
    uid:{
        type:ObjectId,
    },
    weekDay:{
        type:String,
    },
    room:{
        type:Array,
    },
    bid:{
        type:ObjectId,
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
module.exports = checkSchema