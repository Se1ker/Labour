const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const areaSchema = new mongoose.Schema({
    belong: {
        type: ObjectId
    },
    name:{
        type:String
    },
    type:{
        type:String
    },
    ownedClass:{
        type:ObjectId
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
module.exports = areaSchema