const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const commentSchema = new mongoose.Schema({
    owner:{
        type:ObjectId
    },
    content:{
        type:String
    },
    reply:{
        type:ObjectId
    },
    belong:{
        type:ObjectId,
    },
    type:{
        type:String,
    },
    like:{
        type:Array,
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
module.exports = commentSchema