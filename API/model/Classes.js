const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const classSchema = new mongoose.Schema(
    {
        belong: {
            type: ObjectId
        },
        name: {
            type: String
        },
        peopleCount: {
            type: Number
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
module.exports = classSchema