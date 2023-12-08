const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    password1:{
        type:String,
        required:true
    },
    profilepic:{
        type:String
    },
    role:{
        type:Number,
        default:1
    }
    
})


module.exports=mongoose.model('User',userSchema)
