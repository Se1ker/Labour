const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const academieSchema = new mongoose.Schema({
    name:{
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
module.exports = academieSchema