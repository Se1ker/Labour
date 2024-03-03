const mongoose = require('mongoose')
const buildingSchema = new mongoose.Schema({
    name:{
        type:String
    },
    count:{
        type:Number
    },
    limit:{
        type:Number
    },
    select:{
        type:Array
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
module.exports =buildingSchema