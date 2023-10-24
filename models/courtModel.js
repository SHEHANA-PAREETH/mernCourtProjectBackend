const mongoose=require('mongoose')
const User=require('../models/userModel')
const courtSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
  
    description:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref: User
    },
   image:[]
    
})


module.exports=mongoose.model('Court',courtSchema)
