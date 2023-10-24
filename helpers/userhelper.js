const USER=require('../models/userModel')
const mongoose=require('mongoose')




const getUserData=(userId)=>{
return USER.findOne({_id:userId},{password:0})
}


    


module.exports=getUserData