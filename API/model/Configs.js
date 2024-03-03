const mongoose = require('mongoose')

const configSchema = new mongoose.Schema({
    checkBuildings: {
        type: Array
    },
    checkCount: {
        type: Number,
    },
    startTime:{
        type:Date,
    },
    cleanCount: {
        type:Number
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
module.exports = configSchema