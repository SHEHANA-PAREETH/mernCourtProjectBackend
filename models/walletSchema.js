const mongoose=require('mongoose')
const users=require('./userModel')
const walletSchema=new mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    ref :users
  },
  Amount:{
    type:Number,
    required:true,
    default:0
  } ,
  timeStamp:{
    type:Date
  }

})
module.exports=mongoose.model('wallets',walletSchema)