const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const lostSchema = new mongoose.Schema({
    uid:{
        type:ObjectId
    },
    content:{
        type:String
    },
    images:{
        type:Array
    },
    keywords:{
        type:Array
    },
    title:{
        type:String
    },
    type:{
        type:String
    },
    isDone:{
        type:Boolean
    },
    contact:{
        type:Object
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
module.exports = lostSchema