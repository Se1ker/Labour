const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const acativiteSchema = new mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    score: {
        type: Number
    },
    applyPerson: {
        type: Array
    },
    signedPerson:{
        type:Array
    },
    owner: {
        type: String
    },
    capacity: {
        type: Number
    },
    applyTime: {
        type: Object
    },
    actTime: {
        type: Object
    },
    cover: {
        type: String
    },
    location: {
        type: String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    isDone: {
        type: Boolean
    },
    isPass: {
        type: Boolean
    },
    signOut: {
        type: Array
    }
})
module.exports = acativiteSchema