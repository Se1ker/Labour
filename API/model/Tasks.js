const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const taskSchema = new mongoose.Schema(
    {
        belong: {
            type:ObjectId
        },
        area: {
            type:ObjectId
        },
        class: {
            type:ObjectId
        },
        mon: {
            type:Array
        },
        tue:{
            type:Array
        },
        wed:{
            type:Array
        },
        thu:{
            type:Array
        },
        fri:{
            type:Array
        },
        status:{
            type:String
        },
        bid:{
            type:ObjectId
        },
        createdAt:{
            type:Date
        },
        createdAt:{
            type:Date,
            default:Date.now
        },
        updatedAt:{
            type:Date,
            default:Date.now
        }
    }
)
module.exports = taskSchema