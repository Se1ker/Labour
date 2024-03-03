const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const conditionSchema = new mongoose.Schema(
    {
        uid: {
            type: ObjectId
        },
        status: {
            type: String
        },
        desc: {
            type: String
        },
        images: {
            type: Array
        },
        coords: {
            type: Array
        },
        class: {
            type: ObjectId
        },
        area: {
            type: Object
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
module.exports = conditionSchema